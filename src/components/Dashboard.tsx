'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Globe,
  FileText,
  Layers,
  Activity,
  Sparkles,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
  TrendingUp,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import GEOChart from './GEOChart';
import GSCDashboard from './GSCDashboard';

interface AuditDetail {
  category: string;
  score: number;
  maxScore: number;
  findings: string[] | any;
  recommendations: string;
}

interface ActionItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  impact: string;
  effort: string;
  estimatedScoreGain: number;
  isCompleted: boolean;
}

interface AuditData {
  id: string;
  url: string;
  domain: string;
  overallScore: number;
  grade: string;
  technicalScore: number;
  contentScore: number;
  brandScore: number;
  freshnessScore: number;
  summary: string | null;
  suggestedKeywords: { keyword: string; strategy: string }[] | null;
  createdAt: string;
  details: AuditDetail[];
  actionItems: ActionItem[];
}

interface TrackedQuery {
  id: string;
  query: string;
  lastCheckedAt: string | null;
}

interface Citation {
  id: string;
  aiEngine: string;
  query: string;
  isCited: boolean;
  citationContext: string | null;
  responseSnippet: string | null;
  trackedAt: string;
}

interface CitationStats {
  totalQueries: number;
  citationRate: number;
  totalCitationsCount: number;
  engineStats: Record<string, { total: number; cited: number; rate: number }>;
}

interface DashboardProps {
  auditData: AuditData;
  userEmail?: string;
  onReset: () => void;
}

export default function Dashboard({ auditData, userEmail, onReset }: DashboardProps) {
  // Navigation tab: 'audit' | 'monitoring' | 'gsc'
  const [activeTab, setActiveTab] = useState<'audit' | 'monitoring' | 'gsc'>('audit');

  // Check URL query params on load to see if GSC connection just completed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('gsc_connected') === 'true') {
        setActiveTab('gsc');
        // Clean up URL query parameters so page refreshes/shares don't lock tab
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, []);

  // Audit Tab States
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>('technical');
  const [activeToolTab, setActiveToolTab] = useState<'llms' | 'ai' | 'schema'>('llms');

  // Monitoring Tab States
  const [queries, setQueries] = useState<TrackedQuery[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [stats, setStats] = useState<CitationStats>({
    totalQueries: 0,
    citationRate: 0,
    totalCitationsCount: 0,
    engineStats: {}
  });
  const [newQuery, setNewQuery] = useState('');
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [checkingCitations, setCheckingCitations] = useState(false);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);
  const [addedKeywords, setAddedKeywords] = useState<Record<string, boolean>>({});

  const {
    url,
    domain,
    overallScore,
    grade,
    technicalScore,
    contentScore,
    brandScore,
    freshnessScore,
    summary,
    suggestedKeywords,
    createdAt,
    details,
    actionItems,
  } = auditData;

  const brandName = domain.split('.')[0].toUpperCase();

  // Load queries and citations if Monitoring Tab is active
  useEffect(() => {
    if (activeTab === 'monitoring') {
      fetchQueriesAndCitations();
    }
  }, [activeTab]);

  const fetchQueriesAndCitations = async () => {
    setLoadingQueries(true);
    try {
      const emailParam = userEmail ? `?email=${encodeURIComponent(userEmail)}` : '';
      
      const [queriesRes, citationsRes] = await Promise.all([
        fetch(`/api/monitoring/queries${emailParam}`),
        fetch(`/api/monitoring/citations${emailParam}`)
      ]);

      const queriesData = await queriesRes.json();
      const citationsData = await citationsRes.json();

      if (queriesData.success) setQueries(queriesData.queries || []);
      if (citationsData.success) {
        setCitations(citationsData.citations || []);
        setStats(citationsData.stats);
      }
    } catch (err) {
      console.error('Error fetching monitoring data:', err);
    } finally {
      setLoadingQueries(false);
    }
  };

  const handleAddQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery.trim()) return;

    try {
      const response = await fetch('/api/monitoring/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: newQuery.trim(),
          email: userEmail
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewQuery('');
        fetchQueriesAndCitations();
      }
    } catch (err) {
      console.error('Error adding query:', err);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    try {
      const response = await fetch(`/api/monitoring/queries?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchQueriesAndCitations();
      }
    } catch (err) {
      console.error('Error deleting query:', err);
    }
  };

  const handleCheckNow = async () => {
    setCheckingCitations(true);
    try {
      const response = await fetch('/api/monitoring/cron');
      const data = await response.json();
      if (data.success) {
        fetchQueriesAndCitations();
      }
    } catch (err) {
      console.error('Error triggering check:', err);
    } finally {
      setCheckingCitations(false);
    }
  };

  const handleAddKeywordOpportunity = async (kw: string) => {
    try {
      const response = await fetch('/api/monitoring/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: kw,
          email: userEmail
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAddedKeywords(prev => ({ ...prev, [kw]: true }));
        fetchQueriesAndCitations();
      }
    } catch (err) {
      console.error('Error adding keyword:', err);
    }
  };

  // Color mappings
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    if (score >= 50) return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
  };

  const getImpactColor = (impact: string) => {
    if (impact.toLowerCase() === 'high') return 'text-rose-400 bg-rose-950/40 border-rose-800/40';
    if (impact.toLowerCase() === 'medium') return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
    return 'text-sky-400 bg-sky-950/40 border-sky-800/40';
  };

  const getEffortColor = (effort: string) => {
    if (effort.toLowerCase() === 'quick') return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
    if (effort.toLowerCase() === 'medium') return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
    return 'text-indigo-400 bg-indigo-950/40 border-indigo-800/40';
  };

  const getEngineColor = (engine: string) => {
    switch (engine.toLowerCase()) {
      case 'gemini': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'chatgpt': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'perplexity': return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
      case 'claude': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  // Pre-generate technical files
  const llmsTxtContent = `# ${brandName} - AI Knowledge Guide

## Overview
Comprehensive reference for ${brandName} website content and services. Designed for indexing by Large Language Models (LLMs).

## Core Pages
- ${url} - Main homepage and score dashboard landing.
- ${url}#features - Detailed overview of features and pricing.

## Contact Information
- Website: ${url}
- Domain Identity: ${domain}
`;

  const aiTxtContent = `User-agent: GPTBot
Allow: /
Purpose: indexing

User-agent: ClaudeBot
Allow: /
Purpose: indexing

User-agent: PerplexityBot
Allow: /
Purpose: indexing

User-agent: Google-Extended
Allow: /
Purpose: indexing
`;

  const schemaJsonContent = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${brandName}",
  "url": "${url}",
  "logo": "${url}/favicon.ico",
  "sameAs": [
    "https://twitter.com/${brandName.toLowerCase()}",
    "https://github.com/${brandName.toLowerCase()}"
  ]
}
</script>`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(key);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getCategoryDetails = (cat: string) => {
    const d = details.find(item => item.category.toLowerCase() === cat.toLowerCase());
    return {
      findings: Array.isArray(d?.findings) ? d.findings : [],
      recommendations: d?.recommendations || 'No recommendations generated.',
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8 animate-fade-in print:bg-white print:text-black">
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-900 gap-6 print:hidden">
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-4 text-base font-bold transition cursor-pointer relative flex items-center gap-2 ${activeTab === 'audit' ? 'text-indigo-400' : 'text-muted-foreground hover:text-slate-200'}`}
        >
          <Layers className="h-5 w-5" />
          GEO Audit Report
          {activeTab === 'audit' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
        </button>
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`pb-4 text-base font-bold transition cursor-pointer relative flex items-center gap-2 ${activeTab === 'monitoring' ? 'text-indigo-400' : 'text-muted-foreground hover:text-slate-200'}`}
        >
          <Activity className="h-5 w-5" />
          AI Citation Monitoring
          <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-black uppercase tracking-wider">v1.1</span>
          {activeTab === 'monitoring' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
        </button>
        <button
          onClick={() => setActiveTab('gsc')}
          className={`pb-4 text-base font-bold transition cursor-pointer relative flex items-center gap-2 ${activeTab === 'gsc' ? 'text-indigo-400' : 'text-muted-foreground hover:text-slate-200'}`}
        >
          <BarChart3 className="h-5 w-5" />
          Search Performance (GSC)
          {activeTab === 'gsc' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
        </button>
      </div>

      {/* RENDER TAB 1: GEO AUDIT */}
      {activeTab === 'audit' && (
        <div className="space-y-8">
          {/* Header Panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-2xl glow-primary print:border-none print:shadow-none print:p-0">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-wider uppercase">
                <Globe className="h-4 w-4" />
                GEO Visibility Audit Result
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 truncate">
                {domain}
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm mt-1">
                Audited on {new Date(createdAt).toLocaleString('id-ID')}
              </p>
            </div>
            
            <div className="flex items-center gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Print Report
              </button>
              <button
                onClick={onReset}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition cursor-pointer"
              >
                Audit Another Site
              </button>
            </div>
          </div>

          {/* Main Score & Graph Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Card */}
            <div className="lg:col-span-1 glass p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
              
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                Overall GEO Score
              </span>
              
              <div className="relative mt-4 flex items-center justify-center">
                <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(overallScore)}`}>
                  <span className="text-5xl font-black">{overallScore}</span>
                  <span className="text-xs font-bold tracking-widest text-muted-foreground mt-1">GRADE {grade}</span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm max-w-xs mt-6 leading-relaxed">
                {overallScore >= 80 
                  ? "Good optimization. Your website is ready to be cited and recommended in AI Search replies."
                  : "Moderate visibility. Major opportunities exist to increase crawlability and brand authority."}
              </p>
            </div>

            {/* Radar Chart Card */}
            <div className="lg:col-span-2 glass p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold">Optimization Vector</h2>
                <p className="text-xs text-muted-foreground">Visualization of your brand readiness across 4 GEO dimensions.</p>
              </div>
              <div className="mt-4 flex justify-center">
                <GEOChart
                  technical={technicalScore}
                  content={contentScore}
                  brand={brandScore}
                  freshness={freshnessScore}
                />
              </div>
            </div>
          </div>

          {/* AI Summary Banner */}
          <div className="glass p-6 rounded-2xl bg-gradient-to-r from-indigo-950/20 via-slate-900/50 to-indigo-950/20 border-indigo-900/30 flex items-start gap-4">
            <Sparkles className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-indigo-300 font-bold text-sm uppercase tracking-wider">OmniRank Executive Summary</h3>
              <p className="text-slate-300 text-sm mt-1 leading-relaxed">{summary}</p>
            </div>
          </div>

          {/* 4 Pillars Breakdown Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">GEO Category Breakdown</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Pillar Card: Technical */}
              <div className="glass rounded-2xl overflow-hidden transition-all duration-300 border-indigo-950/20">
                <button
                  onClick={() => setExpandedCard(expandedCard === 'technical' ? null : 'technical')}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-950/30 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${getScoreColor(technicalScore)}`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Technical Signals</h3>
                      <p className="text-xs text-muted-foreground">Crawler indexing, robots.txt, and metadata files</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-lg text-indigo-400">{technicalScore}/100</span>
                    {expandedCard === 'technical' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>
                
                {expandedCard === 'technical' && (
                  <div className="p-6 border-t border-slate-900 bg-slate-950/20 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Audit Findings</h4>
                        <div className="space-y-2">
                          {getCategoryDetails('technical').findings.map((finding: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm">
                              {finding.toLowerCase().includes('critical') || finding.toLowerCase().includes('missing') ? (
                                <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                              )}
                              <span className="text-slate-300">{finding}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">OmniRank Fix Instruction</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{getCategoryDetails('technical').recommendations}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pillar Card: Content */}
              <div className="glass rounded-2xl overflow-hidden transition-all duration-300 border-indigo-950/20">
                <button
                  onClick={() => setExpandedCard(expandedCard === 'content' ? null : 'content')}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-950/30 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${getScoreColor(contentScore)}`}>
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Content Structure</h3>
                      <p className="text-xs text-muted-foreground">Answer-first structure, questions, and evidence density</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-lg text-indigo-400">{contentScore}/100</span>
                    {expandedCard === 'content' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>
                
                {expandedCard === 'content' && (
                  <div className="p-6 border-t border-slate-900 bg-slate-950/20 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Audit Findings</h4>
                        <div className="space-y-2">
                          {getCategoryDetails('content').findings.map((finding: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm">
                              {finding.toLowerCase().includes('poor') || finding.toLowerCase().includes('thin') || finding.toLowerCase().includes('no') ? (
                                <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                              )}
                              <span className="text-slate-300">{finding}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">OmniRank Fix Instruction</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{getCategoryDetails('content').recommendations}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pillar Card: Brand */}
              <div className="glass rounded-2xl overflow-hidden transition-all duration-300 border-indigo-950/20">
                <button
                  onClick={() => setExpandedCard(expandedCard === 'brand' ? null : 'brand')}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-950/30 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${getScoreColor(brandScore)}`}>
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Brand Entity</h3>
                      <p className="text-xs text-muted-foreground">Entity schemas, NAPs, and connection points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-lg text-indigo-400">{brandScore}/100</span>
                    {expandedCard === 'brand' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>
                
                {expandedCard === 'brand' && (
                  <div className="p-6 border-t border-slate-900 bg-slate-950/20 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Audit Findings</h4>
                        <div className="space-y-2">
                          {getCategoryDetails('brand').findings.map((finding: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm">
                              {finding.toLowerCase().includes('missing') || finding.toLowerCase().includes('no') ? (
                                <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                              )}
                              <span className="text-slate-300">{finding}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">OmniRank Fix Instruction</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{getCategoryDetails('brand').recommendations}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pillar Card: Freshness */}
              <div className="glass rounded-2xl overflow-hidden transition-all duration-300 border-indigo-950/20">
                <button
                  onClick={() => setExpandedCard(expandedCard === 'freshness' ? null : 'freshness')}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-950/30 text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${getScoreColor(freshnessScore)}`}>
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Freshness Signals</h3>
                      <p className="text-xs text-muted-foreground">sitemap.xml and time attributes (dateModified)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-lg text-indigo-400">{freshnessScore}/100</span>
                    {expandedCard === 'freshness' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>
                
                {expandedCard === 'freshness' && (
                  <div className="p-6 border-t border-slate-900 bg-slate-950/20 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Audit Findings</h4>
                        <div className="space-y-2">
                          {getCategoryDetails('freshness').findings.map((finding: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm">
                              {finding.toLowerCase().includes('not') || finding.toLowerCase().includes('no') ? (
                                <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                              )}
                              <span className="text-slate-300">{finding}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">OmniRank Fix Instruction</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{getCategoryDetails('freshness').recommendations}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prioritized To-Do List Card */}
          <div className="glass p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold">Action Plan</h2>
              <p className="text-xs text-muted-foreground">Prioritized fixes sorted by optimization impact.</p>
            </div>

            <div className="space-y-3">
              {actionItems.map((item, idx) => (
                <div key={item.id || idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-900 bg-slate-950/30 gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-200 text-sm">{item.title}</span>
                      <span className="text-xs text-indigo-400 bg-indigo-950/40 border border-indigo-900/40 px-2 py-0.5 rounded-full capitalize">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-1 rounded border capitalize ${getImpactColor(item.impact)}`}>
                        {item.impact} Impact
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-1 rounded border capitalize ${getEffortColor(item.effort)}`}>
                        {item.effort} Effort
                      </span>
                    </div>
                    <div className="text-indigo-400 font-black text-sm pr-1">
                      +{item.estimatedScoreGain} GEO
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Keyword Opportunities Card */}
          {suggestedKeywords && suggestedKeywords.length > 0 && (
            <div className="glass p-6 rounded-2xl space-y-6">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  AI Keyword Opportunities
                </h2>
                <p className="text-xs text-muted-foreground">Tailored search queries where your brand can win high visibility, along with optimization strategies.</p>
              </div>

              <div className="space-y-3">
                {suggestedKeywords.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-900 bg-slate-950/30 gap-4">
                    <div className="space-y-1">
                      <p className="font-extrabold text-slate-200 text-sm">"{item.keyword}"</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <span className="text-indigo-400 font-medium">Strategy:</span> {item.strategy}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddKeywordOpportunity(item.keyword)}
                      disabled={addedKeywords[item.keyword] || queries.some(q => q.query.toLowerCase() === item.keyword.toLowerCase())}
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-800 text-white text-xs px-4 py-2 rounded-xl transition font-bold shrink-0 cursor-pointer"
                    >
                      {addedKeywords[item.keyword] || queries.some(q => q.query.toLowerCase() === item.keyword.toLowerCase()) ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          Added to Monitor
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          Track Keyword
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auto-generator Technical Files Tools */}
          <div className="glass p-6 rounded-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold">Technical Files Auto-Generator</h2>
              <p className="text-xs text-muted-foreground">Copy or download files to deploy directly onto your root directory to boost AI indexing immediately.</p>
            </div>

            <div className="flex border-b border-slate-900 gap-2">
              <button
                onClick={() => setActiveToolTab('llms')}
                className={`pb-3 text-sm font-semibold transition cursor-pointer px-1 relative ${activeToolTab === 'llms' ? 'text-indigo-400' : 'text-muted-foreground'}`}
              >
                llms.txt Guide
                {activeToolTab === 'llms' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
              </button>
              <button
                onClick={() => setActiveToolTab('ai')}
                className={`pb-3 text-sm font-semibold transition cursor-pointer px-1 relative ${activeToolTab === 'ai' ? 'text-indigo-400' : 'text-muted-foreground'}`}
              >
                ai.txt Crawler Rules
                {activeToolTab === 'ai' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
              </button>
              <button
                onClick={() => setActiveToolTab('schema')}
                className={`pb-3 text-sm font-semibold transition cursor-pointer px-1 relative ${activeToolTab === 'schema' ? 'text-indigo-400' : 'text-muted-foreground'}`}
              >
                JSON-LD Schema
                {activeToolTab === 'schema' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
              </button>
            </div>

            <div className="relative">
              {activeToolTab === 'llms' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Save as <code className="text-indigo-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded">llms.txt</code> in your domain root directory.</span>
                    <button
                      onClick={() => copyToClipboard(llmsTxtContent, 'llms')}
                      className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800 transition text-slate-300 cursor-pointer"
                    >
                      {copiedFile === 'llms' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedFile === 'llms' ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 font-mono text-xs overflow-x-auto max-h-60 text-slate-300">
                    {llmsTxtContent}
                  </pre>
                </div>
              )}

              {activeToolTab === 'ai' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Save as <code className="text-indigo-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded">ai.txt</code> in your domain root directory.</span>
                    <button
                      onClick={() => copyToClipboard(aiTxtContent, 'ai')}
                      className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800 transition text-slate-300 cursor-pointer"
                    >
                      {copiedFile === 'ai' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedFile === 'ai' ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 font-mono text-xs overflow-x-auto max-h-60 text-slate-300">
                    {aiTxtContent}
                  </pre>
                </div>
              )}

              {activeToolTab === 'schema' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Paste this JSON-LD schema snippet inside your website's <code className="text-indigo-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded">&lt;head&gt;</code> tag.</span>
                    <button
                      onClick={() => copyToClipboard(schemaJsonContent, 'schema')}
                      className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800 transition text-slate-300 cursor-pointer"
                    >
                      {copiedFile === 'schema' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedFile === 'schema' ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 font-mono text-xs overflow-x-auto max-h-60 text-slate-300">
                    {schemaJsonContent}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB 2: AI CITATION MONITORING */}
      {activeTab === 'monitoring' && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl space-y-2 relative overflow-hidden">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">AI Share of Voice (SOV)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-indigo-400">{stats.citationRate}%</span>
                <span className="text-xs text-emerald-400 flex items-center font-bold">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  cited
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">Percentage of tracked queries where your brand name or link is referenced.</p>
            </div>
            
            <div className="glass p-6 rounded-2xl space-y-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Active Queries</span>
              <div className="text-4xl font-black text-slate-100">{stats.totalQueries}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">Query phrases currently monitored daily for brand seaches.</p>
            </div>

            <div className="glass p-6 rounded-2xl space-y-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Checks Done</span>
              <div className="text-4xl font-black text-slate-100">{stats.totalCitationsCount}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">Historical record count of AI search response sweeps.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Keyword/Query Manager */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass p-6 rounded-2xl space-y-4">
                <h3 className="font-bold text-base">Monitor New Queries</h3>
                <form onSubmit={handleAddQuery} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. best organic food bali"
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                    className="flex-grow px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition cursor-pointer shrink-0"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </form>
              </div>

              <div className="glass p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-base">Tracked Keywords</h3>
                  <button
                    onClick={handleCheckNow}
                    disabled={checkingCitations || queries.length === 0}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-800 text-white text-xs px-3 py-1.5 rounded-lg transition font-bold cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${checkingCitations ? 'animate-spin' : ''}`} />
                    {checkingCitations ? 'Checking...' : 'Check Now'}
                  </button>
                </div>

                {loadingQueries ? (
                  <div className="text-center py-6 text-sm text-muted-foreground animate-pulse">Loading queries...</div>
                ) : queries.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-xs text-muted-foreground">
                    No active keywords tracked yet. Add one above!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {queries.map((q) => (
                      <div key={q.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-900 bg-slate-950/20">
                        <div className="space-y-0.5 truncate pr-2">
                          <p className="text-sm text-slate-200 font-semibold truncate">{q.query}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {q.lastCheckedAt ? `Checked ${new Date(q.lastCheckedAt).toLocaleDateString('id-ID')}` : 'Pending check'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteQuery(q.id)}
                          className="text-rose-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/20 transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Citations Feed Log */}
            <div className="lg:col-span-2 glass p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-base">Citations Sweep Feed</h3>
              
              {citations.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl text-xs text-muted-foreground">
                  No citations recorded yet. Make sure you have added keywords, then click "Check Now" to start sweeps.
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {citations.map((c) => (
                    <div key={c.id} className="border border-slate-900 bg-slate-950/10 rounded-xl overflow-hidden">
                      <div
                        onClick={() => setExpandedCitationId(expandedCitationId === c.id ? null : c.id)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 cursor-pointer hover:bg-slate-950/30 transition text-left"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${getEngineColor(c.aiEngine)}`}>
                              {c.aiEngine}
                            </span>
                            <span className="text-xs text-slate-400">Query:</span>
                            <span className="text-xs font-bold text-slate-200">"{c.query}"</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            Swept on {new Date(c.trackedAt).toLocaleString('id-ID')}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${c.isCited ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30' : 'text-slate-500 bg-slate-950 border-slate-900'}`}>
                            {c.isCited ? 'Cited' : 'Not Cited'}
                          </span>
                          {expandedCitationId === c.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </div>

                      {expandedCitationId === c.id && (
                        <div className="p-4 border-t border-slate-900 bg-slate-950/30 space-y-3">
                          {c.citationContext && (
                            <div className="space-y-1">
                              <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Citation Context</h4>
                              <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-900 leading-relaxed">
                                "...{c.citationContext}..."
                              </p>
                            </div>
                          )}
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              Full AI response
                            </h4>
                            <p className="text-xs text-slate-400 bg-slate-950/30 p-3 rounded-lg border border-slate-900 leading-relaxed whitespace-pre-wrap">
                              {c.responseSnippet || 'No response text stored.'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENDER TAB 3: GOOGLE SEARCH CONSOLE */}
      {activeTab === 'gsc' && (
        <GSCDashboard 
          userEmail={userEmail || ''} 
          domain={domain} 
          suggestedKeywords={suggestedKeywords || []} 
        />
      )}
    </div>
  );
}
