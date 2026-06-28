'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Globe, 
  Search, 
  Sparkles, 
  Settings, 
  LogOut, 
  RefreshCw, 
  TrendingUp, 
  BookOpen, 
  User as UserIcon 
} from 'lucide-react';

interface Project {
  id: string;
  domain: string;
  url: string;
  overallScore: number;
  grade: string;
  createdAt: Date;
}

interface ProjectsClientProps {
  initialProjects: Project[];
  userEmail: string;
  subscriptionTier: string;
}

export default function ProjectsClient({ initialProjects, userEmail, subscriptionTier }: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const loadingSteps = [
    'Crawling target website content...',
    'Analyzing robots.txt and sitemap.xml...',
    'Extracting Structured Schema.org JSON-LD...',
    'Evaluating semantic content structure & SCUs...',
    'Checking brand entity NAPs and sameAs signals...',
    'Running Gemini AI optimization engine...',
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

  const handleCreateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl.trim(), email: userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete website audit.');
      }

      // Redirect to GSC/GEO dashboard for this specific domain!
      router.push(`/?domain=${encodeURIComponent(data.audit.domain)}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // Helper for grade circle colorings
  const getGradeColors = (grade: string) => {
    const primary = grade.startsWith('A') || grade.startsWith('B') 
      ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 glow-emerald'
      : grade.startsWith('C') 
        ? 'border-amber-500/20 text-amber-400 bg-amber-500/5 glow-amber'
        : 'border-red-500/20 text-red-400 bg-red-500/5 glow-red';
    return primary;
  };

  return (
    <main className="min-h-screen bg-[#030712] text-[#f3f4f6] pb-16 relative overflow-hidden">
      {/* Glow overlays */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight text-white select-none">
            <img src="/logo.png" alt="OmniRank Logo" className="h-8 w-8 object-contain mr-0.5 rounded-lg" />
            OMNI <span className="text-indigo-400">RANK</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="text-slate-400 flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 uppercase text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              {subscriptionTier} Account
            </div>
            <span className="text-slate-800">|</span>
            <Link href="/blog" className="text-slate-400 hover:text-indigo-400 transition flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> Blog
            </Link>
            <span className="text-slate-800">|</span>
            <Link href="/profile" className="text-slate-400 hover:text-indigo-400 transition flex items-center gap-1">
              <Settings className="h-3.5 w-3.5" /> Settings & Billing
            </Link>
            <span className="text-slate-800">|</span>
            <button 
              onClick={() => setShowSignOutConfirm(true)}
              className="text-red-400 hover:text-red-300 transition flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main projects grid layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        
        {/* Welcome header banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-900/60">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              My Workspaces
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              Select an active workspace to track citations, or audit a new domain for AI search performance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Projects List Card */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Globe className="h-4.5 w-4.5 text-indigo-400" /> Active Websites ({projects.length})
            </h2>

            {projects.length === 0 ? (
              <div className="bg-slate-950/40 border border-slate-900 border-dashed rounded-2xl p-12 text-center">
                <Globe className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 text-sm font-semibold">No Audited Projects Yet</p>
                <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                  Run a Generative Engine Optimization scan on the right panel to initialize your first website workspace.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <Link 
                    key={p.id}
                    href={`/?domain=${encodeURIComponent(p.domain)}`}
                    className="group bg-slate-950/45 border border-slate-900 rounded-2xl p-5 hover:border-indigo-500/20 hover:bg-slate-950 transition-all duration-200 backdrop-blur-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-indigo-950/40 border border-indigo-900/40 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:scale-105 transition">
                            <Globe className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition">
                            {p.domain}
                          </span>
                        </div>
                        
                        <span className={`h-8 w-8 rounded-full border flex items-center justify-center text-[10px] font-black tracking-tight flex-shrink-0 ${getGradeColors(p.grade)}`}>
                          {p.grade}
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span>GEO Visibility Readiness</span>
                          <span className="font-semibold text-slate-300">{p.overallScore}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${p.overallScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-900/60 pt-3.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Audited {new Date(p.createdAt).toLocaleDateString()}</span>
                      <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition duration-200">
                        Open Report →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Audit Form Section */}
          <div className="bg-slate-950/45 border border-slate-900 rounded-2xl p-6 backdrop-blur-xl h-fit">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-indigo-400" /> Audit New Website
            </h3>

            {loading ? (
              <div className="py-6 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                <div className="text-center">
                  <h4 className="font-bold text-slate-200 text-xs">Analyzing Domain</h4>
                  <p className="text-indigo-400 text-[10px] font-medium animate-pulse mt-0.5">
                    {loadingSteps[loadingStep]}
                  </p>
                </div>
                <div className="w-36 h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateAudit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label htmlFor="url" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Website URL / Domain
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600">
                      <Search className="h-4 w-4" />
                    </div>
                    <input
                      id="url"
                      type="text"
                      required
                      placeholder="e.g., clientdomain.com"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#07090e] border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition duration-200"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-[10px] font-semibold pl-1">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-650/15"
                >
                  <Plus className="h-4 w-4" />
                  Add Audit Workspace
                </button>
              </form>
            )}
          </div>
        </div>
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
