'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Search, 
  ArrowUpRight, 
  CheckCircle2, 
  TrendingUp, 
  Lock, 
  RefreshCw, 
  Globe, 
  Sparkles, 
  ArrowDown, 
  ArrowUp,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface GSCDashboardProps {
  userEmail: string;
  domain: string;
  suggestedKeywords?: { keyword: string; strategy: string }[];
}

export default function GSCDashboard({ userEmail, domain, suggestedKeywords = [] }: GSCDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gscData, setGscData] = useState<any | null>(null);
  const [sortField, setSortField] = useState<'clicks' | 'impressions' | 'ctr' | 'position'>('clicks');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [inputEmail, setInputEmail] = useState(userEmail || '');
  const [emailError, setEmailError] = useState(false);

  const fetchGscData = async () => {
    setLoading(true);
    setError(null);
    try {
      const emailParam = userEmail ? `&email=${encodeURIComponent(userEmail)}` : '';
      const response = await fetch(`/api/gsc/analytics?domain=${encodeURIComponent(domain)}${emailParam}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch search console metrics.');
      }
      
      setGscData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while loading GSC data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (domain) {
      fetchGscData();
    }
  }, [userEmail, domain]);

  const handleConnectGSC = () => {
    if (!inputEmail.trim()) {
      setEmailError(true);
      return;
    }
    // Redirect to the GSC OAuth redirect endpoint
    const redirectUrl = `/api/auth/google/redirect?email=${encodeURIComponent(inputEmail.trim())}&domain=${encodeURIComponent(domain)}`;
    window.location.href = redirectUrl;
  };

  const handleSort = (field: 'clicks' | 'impressions' | 'ctr' | 'position') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortedQueries = () => {
    if (!gscData?.queries) return [];
    
    return [...gscData.queries].sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (sortDirection === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  };

  // Check if a keyword is also in the AI GEO recommendations list
  const isGeoKeyword = (query: string) => {
    return suggestedKeywords.some(
      k => k.keyword.toLowerCase().includes(query.toLowerCase()) || 
           query.toLowerCase().includes(k.keyword.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-medium">Retrieving Google Search Console performance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-xl mx-auto my-10">
        <Globe className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-white font-semibold text-lg mb-2">GSC Connection Failed</h3>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button 
          onClick={fetchGscData} 
          className="px-5 py-2.5 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition duration-200 text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { summary, timeline, demoMode } = gscData || {};
  const sortedQueries = getSortedQueries();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* 1. Header Banner detailing Connection Status */}
      {demoMode ? (
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md">
          {/* Decorative neon ambient light */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/15 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="flex items-start gap-4">
            <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 text-indigo-400 mt-1">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Demo Mode Active
                </span>
                <span className="text-slate-400 text-xs">Previewing {domain}</span>
              </div>
              <h2 className="text-white font-bold text-lg mt-1.5">Connect Your Live Search Console!</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                You are currently viewing simulated Search Console data. Connect your real Google Search Console account to view real-time clicks, impressions, and organic keywords performance.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto relative z-10">
            {!userEmail && (
              <div className="flex flex-col gap-1 min-w-[200px]">
                <input 
                  type="email"
                  placeholder="Enter Google Email"
                  value={inputEmail}
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    setEmailError(false);
                  }}
                  className={`px-4 py-2.5 text-xs rounded-xl bg-[#090b11] border ${emailError ? 'border-red-500' : 'border-slate-800 focus:border-indigo-500'} text-slate-100 placeholder:text-slate-600 outline-none transition duration-200`}
                />
                {emailError && <span className="text-[10px] text-red-500 font-semibold pl-1">Email is required</span>}
              </div>
            )}
            
            <button 
              onClick={handleConnectGSC}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.01] transition-all duration-200 text-sm whitespace-nowrap self-stretch sm:self-center cursor-pointer"
            >
              <Globe className="h-4 w-4" />
              Connect Real GSC
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Google Search Console Connected</h3>
              <p className="text-slate-400 text-xs mt-0.5">Successfully synchronized organic performance metrics for {domain}.</p>
            </div>
          </div>
          <button
            onClick={handleConnectGSC}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/60 px-3 py-1.5 rounded-lg transition"
          >
            <RefreshCw className="h-3 w-3" />
            Reconnect Account
          </button>
        </div>
      )}

      {/* 2. Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Clicks */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition duration-300 group">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Total Clicks</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{summary.totalClicks.toLocaleString()}</span>
            <span className="text-emerald-500 text-xs font-semibold flex items-center group-hover:translate-x-0.5 transition duration-200">
              30d <TrendingUp className="h-3 w-3 ml-0.5" />
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-2">Organic visits from Google Search</p>
        </div>

        {/* Card 2: Impressions */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition duration-300 group">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Total Impressions</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{summary.totalImpressions.toLocaleString()}</span>
            <span className="text-indigo-400 text-xs font-semibold">30d</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">Frequency website appeared in search results</p>
        </div>

        {/* Card 3: Avg CTR */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition duration-300 group">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Average CTR</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{summary.avgCtr}%</span>
            <span className="text-indigo-400 text-xs font-semibold">30d</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">Click-through ratio relative to impressions</p>
        </div>

        {/* Card 4: Avg Position */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition duration-300 group">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Avg. Position</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{summary.avgPosition}</span>
            <span className="text-indigo-400 text-xs font-semibold">30d</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">Average ranking position of your links on Google</p>
        </div>
      </div>

      {/* 3. Trend Line Chart */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-bold text-base">Organic Traffic & Impression Trend</h3>
            <p className="text-slate-500 text-xs mt-0.5">Organic clicks and impressions performance trend over the last 30 days.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Clicks
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Impressions
            </span>
          </div>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                yAxisId="left"
                stroke="#6366f1" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#10b981" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0b0f19', 
                  borderColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="clicks" 
                stroke="#6366f1" 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="impressions" 
                stroke="#10b981" 
                strokeWidth={1.5} 
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Query Analytics Table & GEO Alignment */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-base">Top Organic Keywords (Google Search)</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Search queries driving organic impressions and clicks to your website.
            </p>
          </div>
          <div className="text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400/20" />
            <span>The <strong className="text-indigo-300">GEO Match</strong> tag shows alignment with AI keyword recommendations.</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-950/40">
                <th className="py-4 px-6">Query / Keyword</th>
                <th className="py-4 px-6 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('clicks')}>
                  <div className="flex items-center justify-end gap-1">
                    Clicks {sortField === 'clicks' && (sortDirection === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('impressions')}>
                  <div className="flex items-center justify-end gap-1">
                    Impressions {sortField === 'impressions' && (sortDirection === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('ctr')}>
                  <div className="flex items-center justify-end gap-1">
                    CTR {sortField === 'ctr' && (sortDirection === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
                  </div>
                </th>
                <th className="py-4 px-6 text-right cursor-pointer hover:text-white transition" onClick={() => handleSort('position')}>
                  <div className="flex items-center justify-end gap-1">
                    Avg. Pos {sortField === 'position' && (sortDirection === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />)}
                  </div>
                </th>
                <th className="py-4 px-6 text-center">Optimization Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {sortedQueries.length > 0 ? (
                sortedQueries.map((item: any, idx: number) => {
                  const match = isGeoKeyword(item.query);
                  return (
                    <tr key={idx} className="hover:bg-slate-950/30 transition group">
                      <td className="py-4 px-6 font-medium text-slate-100 flex items-center gap-3">
                        <Search className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-400 transition" />
                        <span>{item.query}</span>
                        {match && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Sparkles className="h-2.5 w-2.5 fill-indigo-400/20" />
                            GEO Match
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-slate-100">{item.clicks.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right text-slate-400">{item.impressions.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right text-slate-400">{item.ctr}%</td>
                      <td className="py-4 px-6 text-right text-slate-400">#{item.position}</td>
                      <td className="py-4 px-6 text-center">
                        {match ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                            GEO-Ready
                          </span>
                        ) : (
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                alert(`GEO Optimization recommendation for "${item.query}":\nAdd high information density content (SCUs) to your website and update your llms.txt file so that AI search engines start citing your pages.`);
                              }}
                              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              Optimize GEO <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No keywords found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
