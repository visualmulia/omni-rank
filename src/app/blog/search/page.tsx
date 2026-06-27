import React, { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { searchArticles } from '@/lib/search';
import { ArticleGrid } from '@/components/blog/ArticleGrid';
import { SearchBar } from '@/components/blog/SearchBar';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { siteConfig } from '@/config/site';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = (await searchParams).q || '';
  return {
    title: query ? `Search results for "${query}" | ${siteConfig.name} Blog` : `Search Articles | ${siteConfig.name} Blog`,
    description: `Search results for query "${query}" on OmniRank blog.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (await searchParams).q || '';
  
  // Search articles using search helper
  const searchResults = searchArticles(query);
  const matchedArticles = searchResults
    .filter(r => r.score > 0 || !query) // If no query, show all
    .map(r => r.metadata);

  const breadcrumbs = [
    { label: 'Blog', href: '/blog' },
    { label: 'Search' },
    ...(query ? [{ label: `"${query}"` }] : [])
  ];

  return (
    <div className="space-y-8">
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

      {/* Header section */}
      <div className="space-y-4 text-center max-w-xl mx-auto">
        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block select-none">
            Blog Search
          </span>
          <h1 className="text-3xl font-black text-white">
            {query ? `Search Results for "${query}"` : 'Search Blog Articles'}
          </h1>
        </div>
        <Suspense fallback={<div className="h-11 bg-slate-950/60 animate-pulse rounded-xl w-full max-w-md mx-auto" />}>
          <SearchBar placeholder="Search GEO guides, tutorials..." />
        </Suspense>
      </div>

      {/* Search results stats */}
      {query && (
        <div className="text-xs text-slate-500 border-b border-slate-900/60 pb-3 select-none">
          Found {matchedArticles.length} matching publications.
        </div>
      )}

      {/* Results grid */}
      <section className="py-4">
        {matchedArticles.length > 0 ? (
          <ArticleGrid articles={matchedArticles} />
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-800 bg-[#11131e]/10 space-y-4 select-none">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-900 text-slate-500">
              <HelpCircle className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-300 text-sm">No results found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                We couldn't find any articles matching your search query. Try checking your spelling or using different keywords.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
            >
              Back to all articles
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
