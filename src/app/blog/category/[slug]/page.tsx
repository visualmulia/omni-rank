import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getArticles, getCategories } from '@/lib/mdx';
import { ArticleGrid } from '@/components/blog/ArticleGrid';
import { CategoryPills } from '@/components/blog/CategoryPills';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { siteConfig } from '@/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);
  const catName = category ? category.name : 'Category';

  return {
    title: `${catName} Articles | ${siteConfig.name} Blog`,
    description: `Browse all articles under the ${catName} category.`,
  };
}

export async function generateStaticParams() {
  const { getCategories } = require('@/lib/mdx');
  const categories = getCategories();
  return categories.map((cat: any) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const articles = getArticles();
  const categories = getCategories();
  
  // Find current category
  const currentCategory = categories.find((c) => c.slug === slug);
  const categoryName = currentCategory ? currentCategory.name : slug;

  // Filter articles by category
  const filteredArticles = articles.filter(
    (a) => a.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );

  const breadcrumbs = [
    { label: 'Blog', href: '/blog' },
    { label: 'Category' },
    { label: categoryName }
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb and back link */}
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
          Category Archive
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-white">
          Category: <span className="bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">{categoryName}</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl">
          Showing {filteredArticles.length} articles matching the "{categoryName}" category.
        </p>
      </div>

      {/* Category Pills list */}
      <section className="border-y border-slate-900/60 py-2 select-none">
        <CategoryPills categories={categories} activeSlug={slug} />
      </section>

      {/* Grid of articles */}
      <section className="py-4">
        <ArticleGrid articles={filteredArticles} />
      </section>
    </div>
  );
}
