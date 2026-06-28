'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Zap, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<any | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');

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

  // Load audit data automatically if redirected back from GSC connection flow, or prefill/start audit from blog CTA
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isGscConnected = params.get('gsc_connected') === 'true';
      const urlEmail = params.get('email');
      const urlDomain = params.get('domain');
      const shouldStartAudit = params.get('start_audit') === 'true';

      if (isGscConnected && urlEmail && urlDomain) {
        setLoading(true);
        setError(null);
        setEmail(urlEmail);
        setUrl(urlDomain);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('omnirank_user_email', urlEmail);
            localStorage.setItem('omnirank_user_domain', urlDomain);
          } catch (e) {
            console.warn('localStorage is disabled in this browser mode:', e);
          }
        }
        
        fetch(`/api/audits?email=${encodeURIComponent(urlEmail)}&domain=${encodeURIComponent(urlDomain)}`)
          .then((res) => {
            if (!res.ok) throw new Error('Failed to retrieve your latest audit.');
            return res.json();
          })
          .then((data) => {
            if (data.audit) {
              setAuditData(data.audit);
              setSubscriptionTier(data.subscriptionTier || 'free');
            } else {
              throw new Error('No completed audits found for GSC connection.');
            }
          })
          .catch((err) => {
            console.error(err);
            setError(err.message || 'Failed to auto-load audit data after GSC connection.');
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (!isGscConnected && (urlDomain || urlEmail)) {
        if (urlDomain) setUrl(urlDomain);
        if (urlEmail) setEmail(urlEmail);

        if (shouldStartAudit && urlDomain) {
          const runAudit = async () => {
            setLoading(true);
            setError(null);
            setAuditData(null);
            try {
              const response = await fetch('/api/audits', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: urlDomain, email: urlEmail || undefined }),
              });
              const data = await response.json();
              if (!response.ok) {
                throw new Error(data.error || 'Failed to complete GEO audit.');
              }
              setAuditData(data.audit);
              setSubscriptionTier(data.subscriptionTier || 'free');
            } catch (err: any) {
              console.error(err);
              setError(err.message || 'Something went wrong. Please try again.');
            } finally {
              setLoading(false);
            }
          };
          runAudit();
        }
      }
    }
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
  };

  // Render Dashboard if audit is complete
  if (auditData) {
    return (
      <main className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col justify-between">
        <div className="flex-grow">
          <header className="border-b border-slate-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50 print:hidden">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-xl tracking-tight text-white">
                <img src="/logo.png" alt="OmniRank Logo" className="h-8 w-8 object-contain mr-0.5 rounded-lg" />
                OMNI <span className="text-indigo-400">RANK</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold select-none">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Free-Tier Powered
                </div>
                <span className="text-slate-800">|</span>
                <Link href="/blog" className="text-slate-400 hover:text-indigo-400 transition-colors">
                  Blog
                </Link>
              </div>
            </div>
          </header>
          <Dashboard auditData={auditData} userEmail={email} subscriptionTier={subscriptionTier} onReset={handleReset} />
        </div>
        <footer className="border-t border-slate-950/80 bg-slate-950/20 py-6 text-center text-xs text-muted-foreground print:hidden">
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
