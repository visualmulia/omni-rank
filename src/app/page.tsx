'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Zap, ShieldAlert, AlertTriangle, RefreshCw, User as UserIcon } from 'lucide-react';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<any | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const loadingSteps = [
    'Crawling target website content...',
    'Analyzing robots.txt and sitemap.xml...',
    'Extracting Structured Schema.org JSON-LD...',
    'Evaluating semantic content structure & SCUs...',
    'Checking brand entity NAPs and sameAs signals...',
    'Running Gemini AI optimization engine (Free Tier)...',
    'Compiling final GEO score & reports...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 1000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Load session state and auto-retrieve audits
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          setEmail(data.user.email);
          setSubscriptionTier(data.user.subscriptionTier || 'free');

          const params = new URLSearchParams(window.location.search);
          const urlDomain = params.get('domain');
          if (params.get('payment_success') === 'true') {
            setPaymentSuccess(true);
          }

          // If domain was connected to GSC, load that domain's audit, else load latest user audit
          const fetchUrl = urlDomain 
            ? `/api/audits?email=${encodeURIComponent(data.user.email)}&domain=${encodeURIComponent(urlDomain)}`
            : `/api/audits?email=${encodeURIComponent(data.user.email)}`;

          setLoading(true);
          fetch(fetchUrl)
            .then((res) => {
              if (!res.ok) throw new Error('No completed audits.');
              return res.json();
            })
            .then((auditRes) => {
              if (auditRes.audit) {
                setAuditData(auditRes.audit);
                setUrl(auditRes.audit.domain);
              }
            })
            .catch((err) => {
              console.log('No prior audits found for authenticated user:', err);
              if (urlDomain) setUrl(urlDomain);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          setIsAuthenticated(false);
          const params = new URLSearchParams(window.location.search);
          const urlDomain = params.get('domain');
          const urlEmail = params.get('email');
          const shouldStartAudit = params.get('start_audit') === 'true';

          if (urlDomain) setUrl(urlDomain);
          if (urlEmail) setEmail(urlEmail);

          if (shouldStartAudit && urlDomain) {
            setLoading(true);
            fetch('/api/audits', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: urlDomain, email: urlEmail || undefined }),
            })
              .then((res) => res.json())
              .then((auditRes) => {
                if (auditRes.audit) {
                  setAuditData(auditRes.audit);
                }
              })
              .catch((err) => console.error(err))
              .finally(() => setLoading(false));
          }
        }
      })
      .catch((err) => {
        console.error('Session retrieval failed:', err);
        setIsAuthenticated(false);
      });
  }, []);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setAuditData(null);

    try {
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, email: email || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete GEO audit.');
      }

      setAuditData(data.audit);
      setSubscriptionTier(data.subscriptionTier || 'free');
      try {
        if (email) localStorage.setItem('omnirank_user_email', email);
        if (data.audit.domain) localStorage.setItem('omnirank_user_domain', data.audit.domain);
      } catch (e) {
        console.warn('localStorage is blocked:', e);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAuditData(null);
    setUrl('');
    setEmail('');
    setError(null);
    try {
      localStorage.removeItem('omnirank_user_email');
      localStorage.removeItem('omnirank_user_domain');
    } catch (e) {
      console.warn('localStorage is blocked:', e);
    }
    // Redirect to clear URL parameters and reset interface
    window.location.href = '/';
  };

  // Render Dashboard if audit is complete
  if (auditData) {
    const isOverlayVisible = !isAuthenticated;

    return (
      <main className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col justify-between relative">
        {/* Blur dashboard content if guest user */}
        <div className={`flex-grow flex flex-col ${isOverlayVisible ? 'blur-md pointer-events-none select-none' : ''}`}>
          <header className="border-b border-slate-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50 print:hidden">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-xl tracking-tight text-white">
                <img src="/logo.png" alt="OmniRank Logo" className="h-8 w-8 object-contain mr-0.5 rounded-lg" />
                OMNI <span className="text-indigo-400">RANK</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold select-none">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="capitalize">{subscriptionTier} Plan</span>
                </div>
                <span className="text-slate-800">|</span>
                <Link href="/blog" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Blog
                </Link>
                {isAuthenticated && (
                  <>
                    <span className="text-slate-800">|</span>
                    <Link href="/profile" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" /> Settings & Billing
                    </Link>
                  </>
                )}
              </div>
            </div>
          </header>
          {paymentSuccess && (
            <div className="bg-emerald-950/85 border-b border-emerald-500/20 text-emerald-300 px-4 py-3 text-center text-xs font-semibold flex items-center justify-center gap-2 relative z-50 print:hidden">
              <Sparkles className="h-4 w-4 text-emerald-400 animate-bounce" />
              Upgrade successful! Your premium visibility features are now fully unlocked.
              <button 
                onClick={() => setPaymentSuccess(false)}
                className="ml-3 hover:text-emerald-100 transition text-[10px] cursor-pointer"
              >
                ✕ Dismiss
              </button>
            </div>
          )}
          <Dashboard auditData={auditData} userEmail={email} subscriptionTier={subscriptionTier} onReset={handleReset} />
        </div>

        {/* Mandatory Registration Overlay Gate */}
        {isOverlayVisible && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="max-w-md w-full bg-slate-950 border border-slate-900 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-30%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none" />
              <div className="flex items-center justify-center h-16 w-16 bg-indigo-950 border border-indigo-500/20 text-indigo-400 rounded-2xl mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                GEO Audit Completed!
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                We've processed the AI visibility checks for <span className="text-indigo-400 font-semibold">{auditData.domain}</span>. 
                Register/Sign In to save and access your dashboard.
              </p>
              
              <a
                href={`/api/auth/google/redirect?flow=login&email=${encodeURIComponent(email || '')}&domain=${encodeURIComponent(auditData.domain)}`}
                className="w-full bg-indigo-600 hover:bg-indigo-500 border border-indigo-550/40 text-white font-bold py-3 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
              >
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </a>
              <button 
                onClick={handleReset}
                className="mt-4 text-xs font-semibold text-slate-500 hover:text-slate-400 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        <footer className="border-t border-slate-950/80 bg-slate-950/20 py-6 text-center text-xs text-muted-foreground print:hidden relative z-10">
          © {new Date().getFullYear()} OmniRank. AI Visibility Intelligence for Indie Hackers & SME.
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-950/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-950/10 rounded-full blur-[120px]" />

      {/* Navbar Header */}
      <header className="border-b border-slate-900/60 bg-slate-950/20 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight text-white">
            <img src="/logo.png" alt="OmniRank Logo" className="h-8 w-8 object-contain mr-0.5 rounded-lg" />
            OMNI <span className="text-indigo-400">RANK</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold select-none">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              GEO Audit Tool
            </div>
            <span className="text-slate-800">|</span>
            <Link href="/blog" className="text-slate-400 hover:text-indigo-400 transition-colors">
              Blog
            </Link>
            {isAuthenticated === true ? (
              <>
                <span className="text-slate-800">|</span>
                <Link href="/profile" className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" /> Profile
                </Link>
              </>
            ) : isAuthenticated === false ? (
              <>
                <span className="text-slate-800">|</span>
                <Link 
                  href="/api/auth/google/redirect?flow=login"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 px-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-600/15"
                >
                  Sign In
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-2xl text-center space-y-8">
          
          {/* Headline & Value Prop */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-950/40 border border-indigo-900/40 px-3 py-1 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider animate-bounce">
              <Sparkles className="h-3 w-3" />
              Generative Engine Optimization (GEO)
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Is Your Brand Invisible <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
                to AI Search?
              </span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              84% of brands never appear in ChatGPT, Perplexity, or Gemini. OmniRank audits your site and generates the technical guides needed for AI engines to cite you.
            </p>
          </div>

          {/* Audit input Form / Loading State */}
          <div className="glass p-6 md:p-8 rounded-2xl glow-primary max-w-xl mx-auto space-y-6">
            {loading ? (
              // Loading micro-animations
              <div className="py-8 space-y-4 flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                <div className="space-y-1 text-center">
                  <h3 className="font-bold text-slate-200 text-sm">Processing Audit</h3>
                  <p className="text-indigo-400 text-xs font-medium animate-pulse">
                    {loadingSteps[loadingStep]}
                  </p>
                </div>
                <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              // Normal Input Form
              <form onSubmit={handleAudit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Website URL to Audit
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Search className="h-4.5 w-4.5" />
                    </div>
                    <input
                      id="url"
                      type="text"
                      required
                      placeholder="e.g. domain.com or https://mysite.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    Email Address
                    <span className="text-[10px] text-muted-foreground font-normal lowercase">(optional - to save history)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. mail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3.5 rounded-xl border border-rose-950/30 bg-rose-950/10 text-rose-400 text-xs leading-relaxed">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center gap-1.5"
                >
                  <Zap className="h-4 w-4 fill-white" />
                  Analyze Website Visibility
                </button>
              </form>
            )}
          </div>
          
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-950/60 bg-slate-950/10 py-6 text-center text-xs text-muted-foreground relative z-10">
        © {new Date().getFullYear()} OmniRank. AI Visibility Intelligence for Indie Hackers & SME.
      </footer>
    </main>
  );
}
