'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  X, 
  Sparkles, 
  ChevronLeft, 
  ShieldCheck, 
  HelpCircle, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Free Plan",
      description: "Essential tools to start optimizing your brand's AI search footprint.",
      price: { monthly: 0, yearly: 0 },
      cta: "Get Started Free",
      href: "/",
      popular: false,
      features: [
        "1 Active Project/Domain",
        "Technical Signals GEO Audit",
        "llms.txt file generation guide",
        "Manual GEO checklist copy",
        "Email support (48h turnaround)"
      ],
      notIncluded: [
        "Brand Entity audit & findings",
        "Content Structure details & insights",
        "Freshness Signals & sitemap checks",
        "Prioritized Action Plan generation",
        "AI Keyword Opportunities tracker",
        "Technical Files Auto-Generator",
        "GSC Search Performance Analytics",
        "AI Citation Monitoring tab",
        "White-label PDF exports"
      ]
    },
    {
      name: "Pro Plan",
      description: "Everything you need to systematically track and grow your AI citation rate.",
      price: { monthly: 29, yearly: 23 }, // 20% discount approx on yearly
      cta: "Upgrade to Pro",
      href: "/api/auth/google/redirect", // Or direct auth flow link
      popular: true,
      features: [
        "Up to 5 Active Projects/Domains",
        "Full GEO Audit (All 4 Pillars Unlocked)",
        "Content, Brand & Freshness recommendations",
        "Prioritized Action Plan builder",
        "AI Keyword Opportunities scanner",
        "Technical Files Auto-Generator (1-click)",
        "GSC Search Performance Dashboard",
        "AI Citation Monitoring Tab (Daily sweeps)",
        "Email support (24h turnaround)"
      ],
      notIncluded: [
        "White-label PDF report exports",
        "API access to audit engine"
      ]
    },
    {
      name: "Agency Plan",
      description: "Designed for marketing teams and SEO agencies managing multiple client sites.",
      price: { monthly: 69, yearly: 55 },
      cta: "Go Agency",
      href: "/api/auth/google/redirect",
      popular: false,
      features: [
        "Unlimited Projects & Domains",
        "Full GEO Audit (All 4 Pillars Unlocked)",
        "Content, Brand & Freshness recommendations",
        "Prioritized Action Plan builder",
        "AI Keyword Opportunities scanner",
        "Technical Files Auto-Generator (1-click)",
        "GSC Search Performance Dashboard",
        "AI Citation Monitoring Tab (Daily sweeps)",
        "White-label PDF report exports (with logo)",
        "Dedicated VIP Account Manager",
        "API Access (beta)"
      ],
      notIncluded: []
    }
  ];

  const faqItems = [
    {
      q: "What is Generative Engine Optimization (GEO)?",
      a: "Generative Engine Optimization (GEO) is the next evolution of search engine optimization. It focuses on structuring and optimizing your website content so AI engine crawlers (such as ChatGPT, Perplexity, Gemini, and Claude) can understand, parse, and cite your brand as an authoritative reference in their answers."
    },
    {
      q: "Can I upgrade or downgrade my plan at any time?",
      a: "Yes, you can easily change your subscription level from your account settings. If you upgrade, the changes apply immediately. If you downgrade, your current limits remain active until the end of your billing cycle."
    },
    {
      q: "How does the AI Citation Monitoring daily sweep work?",
      a: "For Pro and Agency accounts, we track your target queries and keyword phrases across major LLMs daily. We simulate search prompts to ChatGPT, Claude, Perplexity, and Gemini to check if your brand's URL or name is mentioned, calculating your dynamic AI Share of Voice (SOV)."
    },
    {
      q: "Is there a money-back guarantee?",
      a: "Yes! We offer a 14-day money-back guarantee on all our plans. If you're not satisfied with the insights and tools provided, reach out to our support team and we will issue a full refund."
    }
  ];

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 font-sans pb-24">
      {/* Upper Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between select-none">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-400 transition">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Tool</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="OmniRank Logo" className="h-6 w-auto" />
          <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-indigo-400 transition">OmniRank</span>
        </Link>
      </header>

      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-6 text-center pt-8 pb-12 space-y-6">
        <div className="inline-flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-900/40 px-3.5 py-1 rounded-full text-indigo-400 text-xs font-black uppercase tracking-wider animate-pulse">
          <Sparkles className="h-3.5 w-3.5 fill-indigo-400" />
          <span>Flexible Pricing Plans</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-2xl mx-auto">
          Scale Your Brand's <span className="bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">AI Visibility</span>
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Choose the right plan to unlock technical auto-generators, connect Google Search Console, and track your daily citations on Perplexity and ChatGPT.
        </p>

        {/* Toggle Switch */}
        <div className="flex justify-center items-center gap-4 pt-4">
          <span className={`text-xs md:text-sm font-semibold transition ${billingPeriod === 'monthly' ? 'text-slate-100' : 'text-slate-500'}`}>
            Monthly
          </span>
          <button 
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-slate-900 border border-slate-800 rounded-full p-1 transition cursor-pointer relative flex items-center"
          >
            <div className={`w-6 h-6 bg-indigo-600 rounded-full shadow-md transition-transform duration-300 ${billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs md:text-sm font-semibold transition ${billingPeriod === 'yearly' ? 'text-slate-100' : 'text-slate-500'}`}>
              Yearly
            </span>
            <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Save 20%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p, idx) => {
          const displayPrice = billingPeriod === 'monthly' ? p.price.monthly : p.price.yearly;
          return (
            <div 
              key={idx}
              className={`glass rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative border ${
                p.popular 
                  ? 'border-indigo-500 shadow-xl shadow-indigo-600/5 bg-[#0e1124]/40 scale-100 md:scale-105 z-10' 
                  : 'border-slate-900 bg-slate-950/15 hover:border-slate-800'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 border border-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-indigo-600/20">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100 tracking-tight">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed min-h-[40px]">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 pt-2">
                  <span className="text-4xl md:text-5xl font-black text-white">${displayPrice}</span>
                  <span className="text-xs text-slate-400">/{billingPeriod === 'monthly' ? 'month' : 'mo, billed annually'}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 pt-4 text-xs">
                  {p.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200">{feat}</span>
                    </li>
                  ))}
                  {p.notIncluded.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 opacity-40">
                      <X className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
                      <span className="text-slate-400 line-through">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href={p.href}
                  className={`w-full h-11 rounded-xl font-bold text-xs flex items-center justify-center transition shadow-md ${
                    p.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Comparison Table Section */}
      <section className="max-w-5xl mx-auto px-6 pt-28 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Compare Plan Features</h2>
          <p className="text-xs text-slate-400">Detailed breakdown of tier limits and technical capabilities.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-900 bg-slate-950/15 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs select-none">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/30 font-bold text-slate-300">
                <th className="p-4 w-2/5">Feature Category</th>
                <th className="p-4 text-center">Free</th>
                <th className="p-4 text-center text-indigo-400">Pro ($29)</th>
                <th className="p-4 text-center">Agency ($69)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 text-slate-300">
              <tr>
                <td className="p-4 font-semibold text-slate-200">Active Domains Limit</td>
                <td className="p-4 text-center text-slate-400">1 Project</td>
                <td className="p-4 text-center font-bold text-indigo-400">5 Projects</td>
                <td className="p-4 text-center text-slate-400">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Technical Signals Audit</td>
                <td className="p-4 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Content & Brand Audit</td>
                <td className="p-4 text-center"><X className="h-4.5 w-4.5 text-slate-600 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Technical Files Auto-Generator</td>
                <td className="p-4 text-center"><X className="h-4.5 w-4.5 text-slate-600 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">GSC Analytics Integration</td>
                <td className="p-4 text-center"><X className="h-4.5 w-4.5 text-slate-600 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">AI Citation Sweeps Monitor</td>
                <td className="p-4 text-center"><X className="h-4.5 w-4.5 text-slate-600 mx-auto" /></td>
                <td className="p-4 text-center text-indigo-400 font-bold">Daily</td>
                <td className="p-4 text-center text-slate-400">Daily (High Frequency)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">White-Label Reports PDF</td>
                <td className="p-4 text-center"><X className="h-4.5 w-4.5 text-slate-600 mx-auto" /></td>
                <td className="p-4 text-center"><X className="h-4.5 w-4.5 text-slate-600 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 pt-28 space-y-12">
        <div className="text-center space-y-2">
          <HelpCircle className="h-8 w-8 text-indigo-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Billing & General FAQs</h2>
          <p className="text-xs text-slate-400">Have questions? We've got answers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 select-none">
          {faqItems.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-900 bg-slate-950/20 space-y-2">
              <h3 className="font-bold text-slate-100 text-sm">{item.q}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Support Footer Trust */}
      <section className="max-w-3xl mx-auto px-6 pt-24 text-center select-none">
        <div className="border border-slate-900 bg-slate-950/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">Secure Payment Guarantee</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">Encrypted payments processed securely. Cancel anytime.</p>
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Need custom pricing? <a href="mailto:support@omnirank.web.id" className="text-indigo-400 hover:underline">Contact Sales</a>
          </div>
        </div>
      </section>
    </div>
  );
}
