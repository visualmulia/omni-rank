import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || '';
  const email = searchParams.get('email') || '';
  const domain = searchParams.get('domain') || '';

  const callbackUrl = new URL('/api/auth/google/callback', req.url);
  callbackUrl.searchParams.set('code', 'mock_google_oauth_code_xyz123');
  callbackUrl.searchParams.set('state', state);

  const cancelUrl = new URL('/', req.url);

  // Return a beautiful, themed Google Consent Mock screen
  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hubungkan dengan Google Search Console</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #06070a;
          color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1rem;
          box-sizing: border-box;
        }
        .container {
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 2.5rem;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          text-align: center;
        }
        .header {
          margin-bottom: 2rem;
        }
        .google-logo {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 1.5rem;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }
        .google-logo span {
          display: inline-block;
        }
        .google-logo .g { color: #4285F4; }
        .google-logo .o1 { color: #EA4335; }
        .google-logo .o2 { color: #FBBC05; }
        .google-logo .g2 { color: #4285F4; }
        .google-logo .l { color: #34A853; }
        .google-logo .e { color: #EA4335; font-transform: rotate(-10deg); }
        h1 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }
        .subtitle {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .permission-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.25rem;
          text-align: left;
          margin-bottom: 2rem;
        }
        .permission-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #c7d2fe;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
        .permission-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.92rem;
          color: #e2e8f0;
          line-height: 1.5;
        }
        .permission-icon {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: bold;
          font-size: 0.8rem;
          margin-top: 2px;
        }
        .account-badge {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 30px;
          padding: 6px 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #94a3b8;
          margin-top: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }
        .account-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34a853;
        }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .btn {
          font-family: inherit;
          padding: 0.875rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-primary {
          background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
        }
        .btn-secondary {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #f1f5f9;
        }
        .footer-note {
          font-size: 0.75rem;
          color: #475569;
          margin-top: 1.5rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="google-logo">
            <span class="g">G</span><span class="o1">o</span><span class="o2">o</span><span class="g2">g</span><span class="l">l</span><span class="e">e</span>
          </div>
          <h1>Hubungkan Omni Rank</h1>
          <p class="subtitle">ke Google Search Console Anda</p>
          <div class="account-badge">
            <div class="account-dot"></div>
            <span>${email}</span>
          </div>
        </div>

        <div class="permission-card">
          <div class="permission-title">Izin yang Diminta:</div>
          <div class="permission-item">
            <div class="permission-icon">✓</div>
            <div>
              Melihat data performa Search Console (Clicks, Impressions, CTR, Keywords) untuk domain: 
              <strong style="color: #ffffff; display: block; margin-top: 4px;">${domain}</strong>
            </div>
          </div>
        </div>

        <div class="actions">
          <a href="${callbackUrl.toString()}" class="btn btn-primary">Izinkan dan Hubungkan</a>
          <a href="${cancelUrl.toString()}" class="btn btn-secondary">Batalkan</a>
        </div>

        <div class="footer-note">
          Ini adalah mode demo simulasi (Sandbox). Data asli Google Search Console Anda akan dihubungkan secara aman jika Google Client ID dikonfigurasi.
        </div>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
