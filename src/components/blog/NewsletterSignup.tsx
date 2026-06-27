'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';

interface NewsletterSignupProps {
  placement?: 'footer' | 'sidebar';
}

export function NewsletterSignup({ placement = 'footer' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe. Please try again.');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const isSidebar = placement === 'sidebar';

  return (
    <div 
      className={`rounded-2xl border border-slate-800 bg-[#11131e]/30 backdrop-blur-md overflow-hidden ${
        isSidebar ? 'p-5 space-y-4' : 'p-6 md:p-8 space-y-6 max-w-2xl mx-auto my-12'
      }`}
    >
      {success ? (
        <div className="text-center py-6 space-y-3">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-indigo-500/10 text-indigo-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100">Welcome to the Club!</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              You are now subscribed to the OmniRank Newsletter. Get ready for weekly GEO insights!
            </p>
          </div>
        </div>
      ) : (
        <div className={isSidebar ? 'space-y-4' : 'flex flex-col md:flex-row gap-6 md:items-center justify-between'}>
          <div className={isSidebar ? 'space-y-1.5' : 'space-y-2 md:max-w-xs'}>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
              <Mail className="h-4 w-4" />
              <span>Newsletter</span>
            </div>
            <h3 className="font-extrabold text-lg md:text-xl text-white leading-tight">
              Get Weekly GEO Strategy Updates
            </h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              We send practical, technical tips on ranking in ChatGPT, Perplexity, Gemini, and Claude.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={`space-y-2.5 ${isSidebar ? 'w-full' : 'flex-grow md:max-w-md'}`}>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe to Newsletter</span>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-500">
              Zero spam. Unsubscribe in 1 click at any time.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
