import React from 'react';
import { ArticleCard } from './ArticleCard';
import { ArticleMetadata } from '@/lib/mdx';

interface ArticleGridProps {
  articles: ArticleMetadata[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl border border-dashed border-slate-800 bg-[#11131e]/10">
        <p className="text-slate-400 text-sm">No articles found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
