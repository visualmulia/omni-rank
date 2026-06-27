import React from 'react';
import { ArticleCard } from './ArticleCard';
import { ArticleMetadata } from '@/lib/mdx';

interface RelatedArticlesProps {
  articles: ArticleMetadata[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="border-t border-slate-900 pt-10 my-10 space-y-6">
      <h3 className="text-xl md:text-2xl font-black text-white text-center md:text-left">
        You Might Also Like
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
