import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getArticles } from '@/lib/mdx';
import { ArticleGrid } from '@/components/blog/ArticleGrid';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { siteConfig } from '@/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  // Hardcoded for default site author or map slug to name
  const authorName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `Articles by ${authorName} | ${siteConfig.name} Blog`,
    description: `Browse all articles authored by ${authorName}.`,
  };
}

export async function generateStaticParams() {
  // Return default author slug
  return [
    { slug: 'ardyan-permana' }
  ];
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const articles = getArticles();

  // Map slug back to name
  const authorName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Filter articles by author
  const filteredArticles = articles.filter(
    (a) => a.author.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );

  const breadcrumbs = [
    { label: 'Blog', href: '/blog' },
    { label: 'Author' },
    { label: authorName }
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

      {/* Author Profile Bio card */}
      <section className="select-none">
        <AuthorBio authorName={authorName} />
      </section>

      {/* Header section */}
      <div className="space-y-1 text-center md:text-left select-none">
        <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">
          Author Archives
        </h2>
        <p className="text-xs text-slate-500">
          Showing {filteredArticles.length} publications written by {authorName}.
        </p>
      </div>

      {/* Grid of articles */}
      <section className="py-4 border-t border-slate-900/60 pt-6">
        <ArticleGrid articles={filteredArticles} />
      </section>
    </div>
  );
}
