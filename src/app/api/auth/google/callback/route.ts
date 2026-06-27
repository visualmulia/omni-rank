import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

  let email = '';
  let domain = '';
  try {
    const decodedState = JSON.parse(Buffer.from(stateBase64, 'base64').toString('utf-8'));
    email = decodedState.email;
    domain = decodedState.domain;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
  }

  if (!email || !domain) {
    return NextResponse.json({ error: 'Missing email or domain in state' }, { status: 400 });
  }

  let accessToken = '';
  let refreshToken = '';
  let expiresAt = new Date(Date.now() + 3600 * 1000); // Default 1 hour from now

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

  const isMockCode = code.startsWith('mock_');

  if (!clientId || isMockCode) {
    // Generate simulated tokens for demo purposes
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
      // Google only returns refresh_token on the FIRST user consent redirect.
      // If we don't get one because they re-connected, we keep the old refresh token.
      refreshToken = data.refresh_token || ''; 
      const expiresIn = data.expires_in || 3600;
      expiresAt = new Date(Date.now() + expiresIn * 1000);
    } catch (err: any) {
      console.error('Failed to exchange Google OAuth code:', err);
      return NextResponse.redirect(new URL(`/?gsc_error=${encodeURIComponent(err.message || 'Token exchange failed')}`, req.url));
    }
  }

  // Update or create the User in the DB with GSC credentials
  try {
    const siteUrl = `sc-domain:${domain}`; // standard search console domain property format

    // We do an upsert so that the user is guaranteed to exist.
    const userUpdate: any = {
      gscConnected: true,
      gscAccessToken: accessToken,
      gscTokenExpiresAt: expiresAt,
      gscSiteUrl: siteUrl,
    };

    if (refreshToken) {
      userUpdate.gscRefreshToken = refreshToken;
    }

    await prisma.user.upsert({
      where: { email },
      update: userUpdate,
      create: {
        email,
        name: email.split('@')[0],
        subscriptionTier: 'free',
        gscConnected: true,
        gscAccessToken: accessToken,
        gscRefreshToken: refreshToken || 'mock_refresh_token',
        gscTokenExpiresAt: expiresAt,
        gscSiteUrl: siteUrl,
      },
    });

    console.log(`Successfully connected Google Search Console for user: ${email}, domain: ${domain}`);

    // Redirect the user back to the home page with connection flags so frontend triggers auto-reload
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('gsc_connected', 'true');
    redirectUrl.searchParams.set('email', email);
    redirectUrl.searchParams.set('domain', domain);
    
    return NextResponse.redirect(redirectUrl.toString());
  } catch (dbErr: any) {
    console.error('Failed to save GSC credentials to DB:', dbErr);
    return NextResponse.json({ error: 'Database update failed: ' + dbErr.message }, { status: 500 });
  }
}
