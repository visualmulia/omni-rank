import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json({ error: 'Missing domain parameter' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json(generateMockGscData(domain));
    }

    // 1. Resolve master user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(generateMockGscData(domain));
    }

    // Find the latest audit report for this user and domain to access GSC credentials
    const audit = await prisma.audit.findFirst({
      where: {
        userId: user.id,
        domain: domain,
      },
      include: {
        gscCredential: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const gscCred = audit?.gscCredential;
    const isConnected = gscCred && gscCred.gscAccessToken && !gscCred.gscAccessToken.startsWith('mock_');

    // 2. If not connected, return realistic Mock Data for Demo mode
    if (!isConnected || !gscCred) {
      return NextResponse.json(generateMockGscData(domain));
    }

    // 3. Real Connection Flow - Refresh Token if expired
    let accessToken = gscCred.gscAccessToken;
    const expiresAt = gscCred.gscTokenExpiresAt;
    const isExpired = expiresAt ? new Date() > new Date(expiresAt) : true;

    if (isExpired && gscCred.gscRefreshToken) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (clientId && clientSecret) {
        try {
          const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: clientId,
              client_secret: clientSecret,
              refresh_token: gscCred.gscRefreshToken,
              grant_type: 'refresh_token',
            }),
          });

          const refreshData = await refreshRes.json();
          if (refreshRes.ok) {
            accessToken = refreshData.access_token;
            const expiresIn = refreshData.expires_in || 3600;
            const newExpiry = new Date(Date.now() + expiresIn * 1000);

            // Update credentials in GscCredential table
            await prisma.gscCredential.update({
              where: { id: gscCred.id },
              data: {
                gscAccessToken: accessToken,
                gscTokenExpiresAt: newExpiry,
              },
            });
          } else {
            console.error('Failed to refresh Google token:', refreshData);
          }
        } catch (refreshErr) {
          console.error('Error refreshing Google token:', refreshErr);
        }
      }
    }

    // 4. Fetch GSC Data from Google Webmasters API
    const siteUrl = gscCred.gscSiteUrl || `sc-domain:${domain}`;
    const encodedSiteUrl = encodeURIComponent(siteUrl);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDateStr = thirtyDaysAgo.toISOString().split('T')[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const endDateStr = yesterday.toISOString().split('T')[0];

    // Fetch Query Analytics (keywords)
    let queriesData = [];
    try {
      const queryRes = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: startDateStr,
            endDate: endDateStr,
            dimensions: ['query'],
            rowLimit: 50,
          }),
        }
      );

      if (queryRes.ok) {
        const queryJson = await queryRes.json();
        queriesData = queryJson.rows || [];
      } else {
        const errText = await queryRes.text();
        console.error(`Google API Query Analytics error: Status ${queryRes.status}`, errText);
        // If 403/404, we try fallback prefix: https://domain/
        if (queryRes.status === 403 || queryRes.status === 404) {
          const alternateUrl = encodeURIComponent(`https://${domain}/`);
          const retryRes = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${alternateUrl}/searchAnalytics/query`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                startDate: startDateStr,
                endDate: endDateStr,
                dimensions: ['query'],
                rowLimit: 50,
              }),
            }
          );
          if (retryRes.ok) {
            const retryJson = await retryRes.json();
            queriesData = retryJson.rows || [];
          }
        }
      }
    } catch (apiErr) {
      console.error('Error fetching search analytics from Google:', apiErr);
    }

    // Fetch Trend Analytics (by date for charts)
    let trendData = [];
    try {
      const trendRes = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: startDateStr,
            endDate: endDateStr,
            dimensions: ['date'],
            rowLimit: 31,
          }),
        }
      );

      if (trendRes.ok) {
        const trendJson = await trendRes.json();
        trendData = trendJson.rows || [];
      }
    } catch (trendErr) {
      console.error('Error fetching trend data from Google:', trendErr);
    }

    // Parse GSC Data to our format
    const formattedQueries = queriesData.map((row: any) => {
      const query = row.keys[0];
      return {
        query,
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: parseFloat(((row.ctr || 0) * 100).toFixed(2)),
        position: parseFloat((row.position || 0).toFixed(1)),
      };
    });

    // Sort by clicks descending
    formattedQueries.sort((a: any, b: any) => b.clicks - a.clicks);

    // Aggregate summary stats
    const totalClicks = formattedQueries.reduce((sum: number, q: any) => sum + q.clicks, 0);
    const totalImpressions = formattedQueries.reduce((sum: number, q: any) => sum + q.impressions, 0);
    const avgCtr = totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0.0;
    const avgPosition = formattedQueries.length > 0
      ? parseFloat((formattedQueries.reduce((sum: number, q: any) => sum + q.position, 0) / formattedQueries.length).toFixed(1))
      : 0.0;

    // Format chart timeline
    const formattedTimeline = trendData.map((row: any) => {
      const dateRaw = row.keys[0]; // YYYY-MM-DD
      const dateParts = dateRaw.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}`; // DD/MM format for x-axis
      return {
        date: formattedDate,
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
      };
    });

    // Sort timeline chronologically
    formattedTimeline.sort((a: any, b: any) => {
      const dateA = a.date.split('/').reverse().join('');
      const dateB = b.date.split('/').reverse().join('');
      return dateA.localeCompare(dateB);
    });

    return NextResponse.json({
      demoMode: false,
      summary: {
        totalClicks,
        totalImpressions,
        avgCtr,
        avgPosition,
      },
      queries: formattedQueries,
      timeline: formattedTimeline,
    });

  } catch (error: any) {
    console.error('Search Console API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch search console data' }, { status: 500 });
  }
}

// Helper to generate gorgeous mock data for preview/demo
function generateMockGscData(domain: string) {
  // Let's create realistic search keywords based on the domain name
  const isArdyan = domain.toLowerCase().includes('ardyan');
  
  const mockQueries = isArdyan 
    ? [
        { query: 'best web developer in bali', clicks: 142, impressions: 1120, ctr: 12.68, position: 2.1 },
        { query: 'ardyan web developer', clicks: 94, impressions: 380, ctr: 24.74, position: 1.0 },
        { query: 'custom android app development AI', clicks: 42, impressions: 530, ctr: 7.92, position: 3.4 },
        { query: 'SaaS builder bali no meetings', clicks: 28, impressions: 310, ctr: 9.03, position: 2.8 },
        { query: 'chrome extension development with AI', clicks: 19, impressions: 240, ctr: 7.91, position: 4.1 },
        { query: 'freelance nextjs developer bali', clicks: 15, impressions: 180, ctr: 8.33, position: 5.2 },
        { query: 'product automation solutions AI driven', clicks: 8, impressions: 120, ctr: 6.67, position: 6.5 },
        { query: 'software engineer bali portfolio', clicks: 5, impressions: 90, ctr: 5.56, position: 8.2 },
      ]
    : [
        { query: `${domain} seo analysis`, clicks: 84, impressions: 450, ctr: 18.67, position: 1.2 },
        { query: 'generative engine optimization tools', clicks: 56, impressions: 890, ctr: 6.29, position: 3.4 },
        { query: 'how to optimize site for LLMs', clicks: 34, impressions: 620, ctr: 5.48, position: 4.1 },
        { query: 'cite my site in chatgpt search', clicks: 22, impressions: 310, ctr: 7.10, position: 5.0 },
        { query: 'perplexity citation tracker free', clicks: 15, impressions: 210, ctr: 7.14, position: 6.2 },
        { query: 'ai search visibility audit tool', clicks: 8, impressions: 150, ctr: 5.33, position: 7.8 },
      ];

  // Calculate summary
  const totalClicks = mockQueries.reduce((sum, q) => sum + q.clicks, 0);
  const totalImpressions = mockQueries.reduce((sum, q) => sum + q.impressions, 0);
  const avgCtr = parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2));
  const avgPosition = parseFloat((mockQueries.reduce((sum, q) => sum + q.position, 0) / mockQueries.length).toFixed(1));

  // Generate 30 days of timeline trends
  const timeline = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateLabel = `${d.getDate()}/${d.getMonth() + 1}`;
    
    // Add some random walk noise
    const baseClicks = isArdyan ? 11 : 7;
    const baseImps = isArdyan ? 95 : 75;
    const randomNoise = Math.sin(i * 0.5) * 4 + (Math.random() - 0.5) * 5;
    const clicks = Math.max(1, Math.round(baseClicks + randomNoise));
    const impressions = Math.max(10, Math.round(baseImps + randomNoise * 8 + (Math.random() - 0.5) * 15));

    timeline.push({
      date: dateLabel,
      clicks,
      impressions,
    });
  }

  return {
    demoMode: true,
    summary: {
      totalClicks,
      totalImpressions,
      avgCtr,
      avgPosition,
    },
    queries: mockQueries,
    timeline,
  };
}
