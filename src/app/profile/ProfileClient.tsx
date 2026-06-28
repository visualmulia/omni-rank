'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User as UserIcon, 
  CreditCard, 
  Download, 
  ArrowLeft, 
  Sparkles, 
  Package, 
  Clock,
  ShieldCheck,
  ExternalLink,
  Gift,
  LogOut
} from 'lucide-react';

interface Purchase {
  id: string;
  productSlug: string;
  amount: number;
  currency: string;
  downloadToken: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  company: string | null;
  timezone: string;
  locale: string;
  currency: string;
  subscriptionTier: string;
  subscriptionStatus: string;
}

interface ProfileClientProps {
  user: User;
  purchases: Purchase[];
}

export default function ProfileClient({ user, purchases }: ProfileClientProps) {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const hasPlaybook = purchases.some(p => p.productSlug === 'geo-playbook');

  // Format currency helper
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-[#030712] text-[#f3f4f6] relative overflow-hidden pb-16">
      {/* Background decoration elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="border-b border-slate-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            href="/projects"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Workspaces
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-900 border border-slate-800 text-slate-400">
              Session Active
            </span>
            <button 
              onClick={() => setShowSignOutConfirm(true)}
              className="text-xs text-red-400 hover:text-red-300 font-medium transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            User Settings & Profile
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Manage your account configurations, subscription plans, and download your digital assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Overview Card */}
          <div className="md:col-span-2 bg-slate-950/45 border border-slate-900 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-indigo-950 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name || 'User'} 
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <UserIcon className="h-6 w-6" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user.name || 'OmniRank Member'}</h2>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-900/60 pt-5">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Company / Organization</span>
                <span className="text-sm font-medium text-slate-200">{user.company || 'Not Specified'}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Location Locale</span>
                  <span className="text-sm font-medium text-slate-200 uppercase">{user.locale}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Preferred Currency</span>
                  <span className="text-sm font-medium text-slate-200 uppercase">{user.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Tier Card */}
          <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
            {user.subscriptionTier !== 'free' && (
              <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/10 rounded-bl-full flex items-center justify-end pr-3 pb-3">
                <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Membership</h3>
              </div>
              <div className="mb-2">
                <span className="text-3xl font-black capitalize text-white">
                  {user.subscriptionTier} Plan
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {user.subscriptionTier === 'free' 
                  ? 'Access free basic SEO visibility checks. Upgrade to unlock full search analytics.' 
                  : `Your plan is currently ${user.subscriptionStatus}. Manage billing directly in Polar.`}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-900/60">
              {user.subscriptionTier === 'free' ? (
                <Link 
                  href="/pricing"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition text-center text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 fill-white" />
                  Upgrade Plan
                </Link>
              ) : (
                <div className="space-y-4">
                  <a 
                    href="https://polar.sh/customer"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold py-2.5 rounded-xl transition text-center text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Manage Billing
                  </a>

                  {user.subscriptionTier === 'pro' && (
                    <div className="pt-4 border-t border-slate-900/60 text-left">
                      <div className="flex items-center gap-1.5 text-indigo-400 font-black text-[10px] uppercase tracking-wider mb-1.5">
                        <Sparkles className="h-3 w-3 fill-indigo-400" />
                        Upgrade to Agency
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-2.5">
                        Track unlimited client websites, generate custom reports, and enable high-frequency sweeps.
                      </p>
                      <Link 
                        href="/pricing"
                        className="w-full bg-gradient-to-r from-indigo-650 to-violet-650 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold py-1.5 rounded-lg transition text-center text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-indigo-650/15"
                      >
                        Explore Agency Plan
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Digital Products Center */}
        <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-6 backdrop-blur-xl mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Digital Product Downloads</h3>
          </div>

          {purchases.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-900 rounded-xl bg-slate-950/20">
              <Package className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">No Purchased Digital Products Found</p>
              <p className="text-xs text-slate-500 mt-1">
                Any PDF guides or toolkits purchased under your email will appear here for lifetime access.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-400 uppercase font-medium tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Asset Name</th>
                    <th className="py-3 px-4">Price Paid</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/10 transition">
                      <td className="py-3.5 px-4 text-slate-300 font-mono flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-100 font-semibold">
                        {p.productSlug === 'geo-playbook' 
                          ? 'Generative Engine Optimization (GEO) Action Playbook' 
                          : p.productSlug}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {formatPrice(Number(p.amount), p.currency)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link 
                          href={`/api/download?token=${p.downloadToken}`}
                          className="inline-flex items-center gap-1 bg-indigo-950/60 hover:bg-indigo-950 text-indigo-400 font-semibold py-1.5 px-3 rounded-lg border border-indigo-500/20 transition hover:border-indigo-500/40"
                        >
                          <Download className="h-3 w-3" />
                          Download PDF
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dynamic Promotional Banner Upsell */}
        {!hasPlaybook && (
          <div className="bg-gradient-to-r from-indigo-950/80 via-slate-950 to-indigo-950/80 border border-indigo-500/15 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-[-30%] right-[-10%] w-[30%] h-[150%] bg-indigo-500/5 rotate-[25deg] blur-xl pointer-events-none" />
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              <div className="h-12 w-12 rounded-xl bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                  Exclusive Member Offer
                </span>
                <h4 className="text-base font-bold text-white">
                  Unlock the GEO Action Playbook — 15% Member Discount
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 max-w-md">
                  Get our actionable PDF guide detailing the top 12 AI search visibility checklists for Perplexity and Gemini.
                </p>
              </div>
            </div>
            <Link 
              href="/offers/geo-playbook"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition whitespace-nowrap"
            >
              Get Action Playbook
            </Link>
          </div>
        )}
      </div>

      {/* Custom Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-sm w-full bg-slate-950 border border-slate-900 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-30%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[80px] pointer-events-none" />
            <h3 className="text-lg font-bold text-white mb-2">Sign Out</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Are you sure you want to sign out of your OmniRank account?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold py-2.5 rounded-xl border border-slate-800 transition text-xs cursor-pointer"
              >
                No, Stay
              </button>
              <a
                href="/api/auth/logout"
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl transition text-xs text-center flex items-center justify-center cursor-pointer"
              >
                Yes, Sign Out
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
