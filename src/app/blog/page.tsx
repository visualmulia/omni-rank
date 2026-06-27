import React, { Suspense } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { getArticles, getCategories } from '@/lib/mdx';
import { ArticleGrid } from '@/components/blog/ArticleGrid';
import { CategoryPills } from '@/components/blog/CategoryPills';
import { SearchBar } from '@/components/blog/SearchBar';
import { NewsletterSignup } from '@/components/blog/NewsletterSignup';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: `Blog | ${siteConfig.name} - GEO & AI Search Optimization`,
  description: siteConfig.defaultSEO.description,
};

export default function BlogHomePage() {
  const articles = getArticles();
  const categories = getCategories();

  // Extract featured article (first one flagged as featured, or the latest post)
  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  // Filter out featured article from recent articles list
  const recentArticles = featuredArticle 
    ? articles.filter((a) => a.slug !== featuredArticle.slug) 
    : articles;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-12">
      {/* Blog Page Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-4 py-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
          OmniRank <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Blog</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Actionable guides, technical blueprints, and industry research on Generative Engine Optimization (GEO) and technical SEO for conversational search engines.
        </p>
        <div className="pt-2">
          <Suspense fallback={<div className="h-11 bg-slate-950/60 animate-pulse rounded-xl w-full max-w-md mx-auto" />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      {/* Hero Featured Article Section */}
      {featuredArticle && (
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Featured Article
          </h2>
          <div className="group glass rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-800 transition-all duration-300">
            {/* Image section */}
            <Link 
              href={`/blog/${featuredArticle.slug}`} 
              className="block relative aspect-video lg:aspect-auto lg:h-full lg:col-span-7 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-900 select-none"
            >
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/20 to-indigo-900/10" />
                {featuredArticle.coverImage && (
                  <img 
                    src={featuredArticle.coverImage} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover"
                  />
                )}
                <span className="absolute text-slate-500 font-mono text-xs tracking-widest uppercase">
                  Featured Media
                </span>
              </div>
              <span className="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-full bg-indigo-600/95 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider text-white">
                {featuredArticle.category}
              </span>
            </Link>

            {/* Description/Text section */}
            <div className="p-6 md:p-8 lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-500 text-[10px] md:text-xs font-semibold leading-none">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(featuredArticle.date)}</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{featuredArticle.readingTime} min read</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-xl md:text-2xl text-slate-100 group-hover:text-indigo-400 transition-colors leading-tight">
                  <Link href={`/blog/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h3>

                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  {featuredArticle.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 text-xs">
                    AP
                  </div>
                  <div className="leading-tight">
                    <span className="text-xs font-bold text-slate-200 block">
                      {featuredArticle.author}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Author</span>
                  </div>
                </div>

                <Link 
                  href={`/blog/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#11131e]/60 border border-slate-800 text-xs font-bold text-indigo-400 hover:bg-[#11131e]/90 transition"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Pills Filters */}
      <section className="space-y-4 border-t border-slate-900/60 pt-8 select-none">
        <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
          Browse by Category
        </h2>
        <CategoryPills categories={categories} />
      </section>

      {/* Recent Articles Grid */}
      <section className="space-y-6">
        <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest select-none">
          Recent Articles
        </h2>
        <ArticleGrid articles={recentArticles} />
      </section>

      {/* Newsletter signup widget */}
      <section className="pt-8 select-none">
        <NewsletterSignup placement="footer" />
      </section>
    </div>
  );
}
