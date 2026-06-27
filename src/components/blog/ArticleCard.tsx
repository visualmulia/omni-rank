'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { ArticleMetadata } from '@/lib/mdx';

interface ArticleCardProps {
  article: ArticleMetadata;
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Format Date string
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
    <article className="group glass glass-hover rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300">
      {/* Cover Image Container */}
      <Link href={`/blog/${article.slug}`} className="block relative aspect-video overflow-hidden border-b border-slate-900 select-none">
        {/* Mock/styled cover image fallback */}
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-500">
          {/* Gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-indigo-900/10" />
          {/* Cover Image */}
          {article.coverImage && (
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, hide img element and show template
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {/* Fallback Icon / Text if image is absent or fails */}
          <span className="absolute text-slate-500 font-mono text-[10px] tracking-widest uppercase">
            OmniRank Media
          </span>
        </div>
        
        {/* Category Badge overlay */}
        <span className="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-full bg-indigo-600/90 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider text-white select-none">
          {article.category}
        </span>
      </Link>

      {/* Content Body */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-slate-500 text-[10px] md:text-xs font-semibold leading-none select-none">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(article.date)}</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{article.readingTime} min read</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-base md:text-lg text-slate-100 group-hover:text-indigo-400 line-clamp-2 leading-snug transition-colors duration-200">
            <Link href={`/blog/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs md:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mock author avatar */}
            <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 text-[9px]">
              AP
            </div>
            <span className="text-[10px] md:text-xs font-bold text-slate-300">
              {article.author}
            </span>
          </div>

          <Link 
            href={`/blog/${article.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Read Article</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
