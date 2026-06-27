import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Sparkles, Send, ShieldCheck, Mail } from 'lucide-react';
import { NewsletterSignup } from '@/components/blog/NewsletterSignup';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: `GEO Newsletter | ${siteConfig.name} - Stay Ahead of AI Search`,
  description: 'Join the weekly newsletter sharing technical details, guides, and templates for ranking on ChatGPT, Gemini, and Perplexity.',
};

export default function NewsletterPage() {
  const breadcrumbs = [
    { label: 'Blog', href: '/blog' },
    { label: 'Newsletter' }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Navigation breadcrumbs */}
      <div className="flex items-center justify-between border-b border-slate-900/60 pb-4 select-none">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Blog</span>
        </Link>
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Hero section */}
      <div className="text-center space-y-4 max-w-xl mx-auto py-4">
        <div className="inline-flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-900/40 px-3 py-1 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-wider select-none animate-pulse">
          <Sparkles className="h-3.5 w-3.5 fill-indigo-400" />
          <span>Weekly Publication</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Join the <span className="bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">GEO Newsletter</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
          Stay ahead of the generative engine shift. Every Tuesday, we send deep-dives, code templates, and actionable strategies on how to get cited by ChatGPT, Perplexity, Gemini, and Claude.
        </p>
      </div>

      {/* Main card signup */}
      <section className="select-none">
        <NewsletterSignup placement="footer" />
      </section>

      {/* Benefits / Value props */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 select-none">
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/20 space-y-2.5">
          <div className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
            <Send className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-sm">Actionable Blueprints</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No fluff or marketing theories. Just clear, copy-paste code snippets, robots.txt structures, and schema formats that LLMs crawl.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/20 space-y-2.5">
          <div className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-sm">AI Search Algorithm Changes</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI search engines are updated daily. We track new crawler behaviors (like ChatGPT O1, Perplexity Pro) and what they expect.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/20 space-y-2.5">
          <div className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-sm">100% Privacy Protected</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your data is never shared. We only use your email to send the newsletter. You can unsubscribe at any time in one single click.
          </p>
        </div>
      </section>
    </div>
  );
}
