'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Sparkles, 
  BookOpen, 
  FileCode, 
  Layers, 
  ShieldCheck, 
  Lock, 
  CheckCircle, 
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function PlaybookOfferPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check for successful payment redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment_success') === 'true') {
        setSuccess(true);
        // Clean query parameters from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);

    try {
      // Save as pending subscriber/lead before redirecting (cart abandonment capture)
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          leadMagnet: 'geo-playbook',
        }),
      });
    } catch (err) {
      console.warn('Failed to capture lead details before redirect:', err);
    }

    // Redirect to Polar sandbox checkout link with customer_email prefilled
    const polarCheckoutUrl = `https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_2F1WlWtB9naV8hmgsK2qr8bM7BevDGgdPeaDN1zFqNx/redirect?customer_email=${encodeURIComponent(email)}`;
    window.location.href = polarCheckoutUrl;
  };

  const modules = [
    {
      num: "01",
      title: "The AI Crawling Landscape",
      desc: "Deep dive into how ClaudeBot, GPTBot, and PerplexityBot scrape websites. Understand training set indexing vs. real-time citations."
    },
    {
      num: "02",
      title: "Mastering llms.txt & llms-full.txt",
      desc: "Go beyond basic text. Learn exact syntax rules to feed crawler models with context summaries, file mappings, and sub-project documentation."
    },
    {
      num: "03",
      title: "High-Citation JSON-LD Schemas",
      desc: "50+ pre-formatted templates. Custom templates for SaaS pricing, local clinic booking, e-commerce, and authority articles."
    },
    {
      num: "04",
      title: "Writing for Evidence Density",
      desc: "How to restructure sentences, compile tables, and insert 'SCUs' (Self-Contained Units) that LLMs extract as citation facts."
    },
    {
      num: "05",
      title: "Off-Page AI Entity Modeling",
      desc: "Standardize NAP records, claim profiles, and feed training corpus graphs to make your brand the default answer in ChatGPT responses."
    }
  ];

  return (
    <div className="min-h-screen bg-[#05060f] text-slate-100 font-sans pb-24 selection:bg-indigo-600/30">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between select-none">
        <Link 
          href="/blog" 
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Blog</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="OmniRank Logo" className="h-6 w-auto" />
          <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-indigo-400 transition">OmniRank</span>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-indigo-400 text-xs font-black uppercase tracking-wider select-none">
            <Sparkles className="h-3.5 w-3.5 fill-indigo-400" />
            <span>Premium GEO Product</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            The <span className="bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">GEO Action Pack & Template Library</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            The ultimate implementation toolkit to rank and get cited on Perplexity, ChatGPT, Gemini, and Claude. Stop losing organic traffic to AI summaries. Get the step-by-step guide, 50+ schema snippets, and template packs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Implementation Guide</h4>
                <p className="text-[10px] text-slate-500">Step-by-Step PDF</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <FileCode className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">50+ Templates</h4>
                <p className="text-[10px] text-slate-500">JSON-LD Library</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">12 Templates</h4>
                <p className="text-[10px] text-slate-500">llms.txt Pack</p>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Card */}
        <div className="lg:col-span-5">
          <div className="glass rounded-3xl border border-indigo-500/20 p-6 md:p-8 space-y-6 relative overflow-hidden bg-slate-950/20 backdrop-blur-md">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="h-32 w-32 text-indigo-400" />
            </div>

            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 text-emerald-400 animate-bounce">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-xl text-slate-100">Purchase Successful!</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Thank you for your order, <strong>{name}</strong>. We have sent a download link for the **GEO Action Pack & Template Library 2026** directly to <strong>{email}</strong>.
                  </p>
                </div>
                <div className="pt-4">
                  <a
                    href="/downloads/geo-checklist-2026.txt"
                    download
                    className="inline-flex items-center justify-center gap-2 w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                  >
                    Download Playbook Assets
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-100">Action Pack Offer</h3>
                    <p className="text-[10px] text-slate-500">One-Time Payment Only</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 line-through mr-1.5">$99</span>
                    <span className="text-2xl font-black text-indigo-400">$19</span>
                  </div>
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Full Name</label>
                    <input
                      type="text"
                      required
                      disabled={loading}
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      disabled={loading}
                      placeholder="e.g. john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        <span>Redirecting to Checkout...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        <span>Get Action Pack for $19</span>
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[9px] text-center text-slate-500 flex items-center justify-center gap-1 select-none">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Secure SSL Checkout. Powered by Polar.sh
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Book Modules Details */}
      <section className="max-w-4xl mx-auto px-6 pt-28 space-y-12 select-none">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">What's Inside the Action Pack?</h2>
          <p className="text-xs text-slate-400">The complete implementation bundle for rapid AI search ranking.</p>
        </div>

        <div className="space-y-6">
          {modules.map((m, idx) => (
            <div 
              key={idx}
              className="flex gap-4 md:gap-6 p-5 rounded-2xl border border-slate-900 bg-slate-950/20 items-start hover:border-slate-800 transition"
            >
              <span className="text-2xl md:text-3xl font-black text-indigo-500/30 font-mono tracking-tight shrink-0 mt-0.5">
                {m.num}
              </span>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm md:text-base text-slate-100">{m.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="max-w-3xl mx-auto px-6 pt-24 text-center select-none">
        <div className="border border-indigo-500/10 bg-slate-950/10 rounded-3xl p-8 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Risk-Free 30-Day Guarantee</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
            Try the GEO Action Pack & Template Library 2026 for 30 days. Read the strategies, copy the JSON-LD schemas, and implement the templates. If you do not feel it gave you the exact step-by-step blueprint and templates to optimize your website for AI search, contact support for a full, prompt refund.
          </p>
        </div>
      </section>
    </div>
  );
}
