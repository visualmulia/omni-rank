'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Sparkles, ArrowRight } from 'lucide-react';

export function OnmiRankAuditCTA() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Clean URL
    let domain = url.trim();
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = 'https://' + domain;
    }

    try {
      const parsed = new URL(domain);
      const host = parsed.hostname;
      
      // Redirect to homepage with search parameters
      const params = new URLSearchParams();
      params.set('domain', host);
      if (email.trim()) {
        params.set('email', email.trim());
      }
      params.set('start_audit', 'true');
      
      router.push(`/?${params.toString()}`);
    } catch (err) {
      alert('Please enter a valid website URL.');
    }
  };

  return (
    <div className="my-10 p-6 md:p-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-[#11131e]/90 to-indigo-950/20 glow-primary relative overflow-hidden">
      {/* Glow dot */}
      <div className="absolute right-[-10%] top-[-10%] w-[40%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px]" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="space-y-3 text-left lg:max-w-md">
          <div className="inline-flex items-center gap-1 bg-indigo-950 border border-indigo-850 px-2.5 py-0.5 rounded-full text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 fill-indigo-400" />
            <span>Interactive Audit</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
            Check Your Site's AI Search Visibility Now
          </h3>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            LLMs index sites differently than Google. Run a free GEO scan to see if ChatGPT, Perplexity, and Gemini can find your business.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full lg:max-w-sm space-y-2.5">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter your website URL (e.g. mysite.com)"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <input
              type="email"
              placeholder="Your Email (Optional, for PDF report)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
          >
            <Zap className="h-4 w-4 fill-white" />
            <span>Run Free GEO Audit</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
