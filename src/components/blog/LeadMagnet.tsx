'use client';

import React, { useState } from 'react';
import { Mail, Download, CheckCircle, RefreshCw } from 'lucide-react';
import { leadMagnets } from '@/lib/lead-magnets';

interface LeadMagnetProps {
  slug: string;
  placement?: 'inline' | 'sidebar' | 'banner';
}

export function LeadMagnet({ slug, placement = 'inline' }: LeadMagnetProps) {
  const magnet = leadMagnets[slug];
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!magnet) return null;

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
        body: JSON.stringify({
          email,
          name: name || undefined,
          leadMagnet: magnet.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe. Please try again.');
      }

      setSuccess(true);
      
      // Trigger file download automatically
      const link = document.createElement('a');
      link.href = magnet.fileUrl;
      link.setAttribute('download', '');
      // If it's a zip or pdf, we want it to download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`my-8 p-6 md:p-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/10 via-slate-900/60 to-indigo-950/5 glow-primary ${
        placement === 'sidebar' ? 'sticky top-24' : ''
      }`}
    >
      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="h-8 w-8 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-slate-100">Thank you! Your download has started.</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              We've sent a download link and copy of <strong>{magnet.title}</strong> to <strong>{email}</strong> just in case.
            </p>
          </div>
          <a
            href={magnet.fileUrl}
            download
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-indigo-400 hover:bg-slate-800 transition"
          >
            <Download className="h-4 w-4" />
            Didn't start? Click here
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            {/* Mock Thumbnail Image with icon */}
            <div className="h-16 w-16 shrink-0 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 relative overflow-hidden">
              <Download className="h-6 w-6 relative z-10" />
              <div className="absolute inset-0 bg-indigo-500/5 hover:scale-110 transition duration-300" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                Free Resource
              </span>
              <h3 className="font-bold text-base md:text-lg text-slate-100 leading-snug">{magnet.title}</h3>
              <p className="text-xs md:text-sm text-slate-400 mt-1 leading-relaxed">{magnet.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="First Name (Optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Preparing Download...</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span>Get Free Resource Now</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-500">
              No spam. Unsubscribe at any time. We protect your privacy.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
