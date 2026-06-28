import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryptSession, getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const stateBase64 = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    console.error('Google OAuth error callback:', error);
    return NextResponse.redirect(new URL('/?gsc_error=' + encodeURIComponent(error), req.url));
  }

  if (!code || !stateBase64) {
    return NextResponse.json({ error: 'Missing code or state parameter' }, { status: 400 });
  }

  let flow = 'gsc';
  let email = '';
  let domain = '';
  try {
    const decodedState = JSON.parse(Buffer.from(stateBase64, 'base64').toString('utf-8'));
    flow = decodedState.flow || 'gsc';
    email = decodedState.email || '';
    domain = decodedState.domain || '';
  } catch (err) {
    return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
  }

  const isLoginFlow = flow === 'login';

  if (!isLoginFlow && (!email || !domain)) {
    return NextResponse.json({ error: 'Missing email or domain in state for GSC connection flow.' }, { status: 400 });
  }

  let accessToken = '';
  let refreshToken = '';
  let expiresAt = new Date(Date.now() + 3600 * 1000); // Default 1 hour from now

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

  const isMockCode = code.startsWith('mock_');

  if (!clientId || isMockCode) {
    // Generate simulated tokens for demo/sandbox purposes
    accessToken = 'mock_google_access_token_' + Math.random().toString(36).substring(2);
    refreshToken = 'mock_google_refresh_token_' + Math.random().toString(36).substring(2);
    expiresAt = new Date(Date.now() + 3600 * 1000);
  } else {
    // Exchange OAuth code for actual Google tokens
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret || '',
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || data.error || 'Failed to exchange token');
      }

      accessToken = data.access_token;
      refreshToken = data.refresh_token || ''; 
      const expiresIn = data.expires_in || 3600;
      expiresAt = new Date(Date.now() + expiresIn * 1000);
    } catch (err: any) {
      console.error('Failed to exchange Google OAuth code:', err);
      return NextResponse.redirect(new URL(`/?gsc_error=${encodeURIComponent(err.message || 'Token exchange failed')}`, req.url));
    }
  }

  // Handle LOGIN flow
  if (isLoginFlow) {
    let userEmail = email;
    let userName = email ? email.split('@')[0] : 'User';
    let avatarUrl = '';

    if (!isMockCode && clientId) {
      try {
        // Fetch user profile from google userinfo API
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          userEmail = profile.email || userEmail;
          userName = profile.name || userName;
          avatarUrl = profile.picture || '';
        }
      } catch (profileErr) {
        console.error('Error fetching Google user profile:', profileErr);
      }
    }

    if (!userEmail) {
      userEmail = 'sandbox_user_' + Math.random().toString(36).substring(2, 7) + '@omnirank.test';
    }

    try {
      const dbUser = await prisma.user.upsert({
        where: { email: userEmail },
        update: {
          name: userName,
          avatarUrl: avatarUrl || undefined,
        },
        create: {
          email: userEmail,
          name: userName,
          avatarUrl: avatarUrl || undefined,
          subscriptionTier: 'free',
          subscriptionStatus: 'inactive',
        },
      });

      // Encrypt user details into a session cookie
      const sessionToken = encryptSession({
        email: dbUser.email,
        userId: dbUser.id,
      });

      const response = NextResponse.redirect(new URL('/', req.url));
      response.cookies.set('omnirank_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      console.log(`Successfully logged in user: ${dbUser.email}`);
      return response;
    } catch (dbErr: any) {
      console.error('Database sign-in error:', dbErr);
      return NextResponse.json({ error: 'Database update failed: ' + dbErr.message }, { status: 500 });
    }
  }

  // Handle GSC linking flow
  try {
    // 1. Resolve master user session
    const session = await getSession();
    const masterEmail = session?.email || email;

    if (!masterEmail) {
      return NextResponse.json({ error: 'Unauthorized: No active login session found.' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: masterEmail },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in system.' }, { status: 404 });
    }

    const siteUrl = `sc-domain:${domain}`;

    // 2. Save credential linked to user
    const gscCred = await prisma.gscCredential.upsert({
      where: {
        userId_gscEmail: {
          userId: dbUser.id,
          gscEmail: email, // Google account email used to connect GSC
        },
      },
      update: {
        gscAccessToken: accessToken,
        gscRefreshToken: refreshToken || undefined,
        gscTokenExpiresAt: expiresAt,
        gscSiteUrl: siteUrl,
      },
      create: {
        userId: dbUser.id,
        gscEmail: email,
        gscAccessToken: accessToken,
        gscRefreshToken: refreshToken || 'mock_refresh_token',
        gscTokenExpiresAt: expiresAt,
        gscSiteUrl: siteUrl,
      },
    });

    // 3. Link all matching client audits for this domain to this credential
    await prisma.audit.updateMany({
      where: {
        userId: dbUser.id,
        domain: domain,
      },
      data: {
        gscCredentialId: gscCred.id,
      },
    });

    console.log(`Successfully connected Google Search Console credential (${email}) for user: ${masterEmail}, domain: ${domain}`);

    // 4. Redirect user back to home page with connection details
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('gsc_connected', 'true');
    redirectUrl.searchParams.set('email', masterEmail);
    redirectUrl.searchParams.set('domain', domain);
    
    return NextResponse.redirect(redirectUrl.toString());
  } catch (err: any) {
    console.error('Failed to save GSC credentials to DB:', err);
    return NextResponse.json({ error: 'Database update failed: ' + err.message }, { status: 500 });
  }
}
