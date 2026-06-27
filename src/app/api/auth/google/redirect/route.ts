import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const domain = searchParams.get('domain');

  if (!email || !domain) {
    return NextResponse.json({ error: 'Missing email or domain parameter' }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

  // Encode state as base64 to securely pass it through Google's OAuth flow
  const stateObj = { email, domain };
  const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

  // If no Client ID is configured, redirect to a beautiful Mock Consent page to allow demo testing
  if (!clientId) {
    console.log('No GOOGLE_CLIENT_ID configured. Redirecting to Mock Consent screen.');
    const mockConsentUrl = new URL('/api/auth/google/mock-consent', req.url);
    mockConsentUrl.searchParams.set('state', state);
    mockConsentUrl.searchParams.set('email', email);
    mockConsentUrl.searchParams.set('domain', domain);
    return NextResponse.redirect(mockConsentUrl);
  }

  // Construct Google OAuth 2.0 URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/webmasters.readonly');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent'); // Force refresh token
  googleAuthUrl.searchParams.set('state', state);

  return NextResponse.redirect(googleAuthUrl.toString());
}
