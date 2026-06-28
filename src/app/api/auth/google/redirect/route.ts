import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const domain = searchParams.get('domain');
  const flow = searchParams.get('flow') || 'gsc'; // 'login' or 'gsc'

  if (flow === 'gsc' && (!email || !domain)) {
    return NextResponse.json({ error: 'Missing email or domain parameter for GSC connection flow.' }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

  // Encode state as base64 to securely pass it through Google's OAuth flow
  const stateObj = { flow, email, domain };
  const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

  // If no Client ID is configured, redirect to a beautiful Mock Consent page to allow demo testing
  if (!clientId) {
    console.log('No GOOGLE_CLIENT_ID configured. Redirecting to Mock Consent screen.');
    const mockConsentUrl = new URL('/api/auth/google/mock-consent', req.url);
    mockConsentUrl.searchParams.set('state', state);
    if (email) mockConsentUrl.searchParams.set('email', email);
    if (domain) mockConsentUrl.searchParams.set('domain', domain);
    mockConsentUrl.searchParams.set('flow', flow);
    return NextResponse.redirect(mockConsentUrl);
  }

  // Construct Google OAuth 2.0 URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  
  // Set scopes according to the target authorization flow
  const scope = flow === 'login'
    ? 'openid email profile'
    : 'https://www.googleapis.com/auth/webmasters.readonly';
  
  googleAuthUrl.searchParams.set('scope', scope);
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent'); // Force refresh token
  googleAuthUrl.searchParams.set('state', state);

  return NextResponse.redirect(googleAuthUrl.toString());
}
