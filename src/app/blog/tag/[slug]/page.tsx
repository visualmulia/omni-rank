import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getArticles, getTags } from '@/lib/mdx';
import { ArticleGrid } from '@/components/blog/ArticleGrid';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { siteConfig } from '@/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tags = getTags();
  const tag = tags.find((t) => t.slug === slug);
  const tagName = tag ? tag.name : 'Tag';

  return {
    title: `#${tagName} Articles | ${siteConfig.name} Blog`,
    description: `Browse all articles tagged with #${tagName}.`,
  };
}

export async function generateStaticParams() {
  const { getTags } = require('@/lib/mdx');
  const tags = getTags();
  return tags.map((tag: any) => ({
    slug: tag.slug,
  }));
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const articles = getArticles();
  const tags = getTags();
  
  // Find current tag
  const currentTag = tags.find((t) => t.slug === slug);
  const tagName = currentTag ? currentTag.name : slug;

  // Filter articles by tag slug
  const filteredArticles = articles.filter((a) => 
    a.tags.some(t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
  );

  const breadcrumbs = [
    { label: 'Blog', href: '/blog' },
    { label: 'Tag' },
    { label: `#${tagName}` }
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
      <div className="space-y-2 text-center md:text-left">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
          Tag Archive
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-white font-mono">
          #{tagName}
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl">
          Showing {filteredArticles.length} articles containing the #{tagName} tag.
        </p>
      </div>

      {/* Grid of articles */}
      <section className="py-4 border-t border-slate-900/60 pt-6">
        <ArticleGrid articles={filteredArticles} />
      </section>
    </div>
  );
}
