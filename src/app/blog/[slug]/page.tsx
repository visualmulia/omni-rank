import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getArticleBySlug, getRelatedArticles, extractHeadings } from '@/lib/mdx';
import { getSchemasForArticle } from '@/lib/schema';
import { siteConfig } from '@/config/site';

// Import blog components
import { TableOfContents } from '@/components/blog/TableOfContents';
import { Breadcrumb } from '@/components/blog/Breadcrumb';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { RelatedArticles } from '@/components/blog/RelatedArticles';
import { NewsletterSignup } from '@/components/blog/NewsletterSignup';
import { AffiliateLink } from '@/components/blog/AffiliateLink';
import { LeadMagnet } from '@/components/blog/LeadMagnet';
import { OnmiRankAuditCTA } from '@/components/blog/OnmiRankAuditCTA';

// Import custom MDX components
import { Callout } from '@/components/mdx/Callout';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { ComparisonTable } from '@/components/mdx/ComparisonTable';
import { FAQ } from '@/components/mdx/FAQ';
import { StatBox } from '@/components/mdx/StatBox';
import { TweetEmbed } from '@/components/mdx/TweetEmbed';
import { YouTubeEmbed } from '@/components/mdx/YouTubeEmbed';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata dynamically for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  // Extract author URL or fallback to siteConfig LinkedIn url
  const authorUrl = siteConfig.author.socials.linkedin || 'https://www.linkedin.com/in/ardyanpermana/';

  return {
    title: `${article.metadata.title} | ${siteConfig.name} Blog`,
    description: article.metadata.description,
    keywords: article.metadata.tags || [],
    authors: [{ name: article.metadata.author, url: authorUrl }],
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description,
      type: 'article',
      url: `${siteConfig.url}/blog/${slug}`,
      images: [
        {
          url: article.metadata.coverImage ? `${siteConfig.url}${article.metadata.coverImage}` : siteConfig.ogImage,
          alt: article.metadata.title,
          width: 1200,
          height: 630
        },
      ],
      publishedTime: article.metadata.date ? `${article.metadata.date}T00:00:00+07:00` : undefined,
      modifiedTime: article.metadata.date ? `${article.metadata.date}T00:00:00+07:00` : undefined,
      authors: [authorUrl]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metadata.title,
      description: article.metadata.description,
      images: [article.metadata.coverImage ? `${siteConfig.url}${article.metadata.coverImage}` : siteConfig.ogImage],
    },
  };
}

// Generate static params for static site generation (SSG)
export async function generateStaticParams() {
  const { getArticles } = require('@/lib/mdx');
  const articles = getArticles();
  return articles.map((article: any) => ({
    slug: article.slug,
  }));
}

// MDX Components list
const mdxComponents = {
  Callout,
  CodeBlock,
  ComparisonTable,
  FAQ,
  StatBox,
  TweetEmbed,
  YouTubeEmbed,
  AffiliateLink,
  LeadMagnet,
  OnmiRankAuditCTA,
  // Custom wrappers for standard markdown elements to support branding and clean typography
  h1: (props: any) => <h1 className="text-3xl md:text-4xl font-extrabold mt-10 mb-4 text-white leading-tight" {...props} />,
  h2: (props: any) => {
    const id = props.id || props.children?.toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || '';
    return <h2 id={id} className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-slate-100 border-b border-slate-900 pb-2.5 leading-snug scroll-mt-24" {...props} />;
  },
  h3: (props: any) => {
    const id = props.id || props.children?.toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || '';
    return <h3 id={id} className="text-xl md:text-2xl font-bold mt-8 mb-3 text-slate-200 leading-snug scroll-mt-24" {...props} />;
  },
  p: (props: any) => <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6" {...props} />,
  ul: (props: any) => <ul className="list-disc list-outside pl-5 mb-6 space-y-2 text-sm md:text-base text-slate-300" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-outside pl-5 mb-6 space-y-2 text-sm md:text-base text-slate-300" {...props} />,
  li: (props: any) => <li className="pl-1 text-slate-300" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-6 italic text-slate-400 bg-slate-900/40 rounded-r-xl pr-4" {...props} />
  ),
  a: (props: any) => <a className="text-indigo-400 hover:text-indigo-300 underline font-semibold transition-colors duration-150 cursor-pointer" {...props} />,
  pre: (props: any) => {
    const codeEl = props.children;
    if (codeEl && codeEl.type === 'code') {
      const language = codeEl.props.className?.replace('language-', '') || 'text';
      const codeContent = codeEl.props.children;
      return <CodeBlock language={language}>{codeContent}</CodeBlock>;
    }
    return <pre className="bg-slate-950 border border-slate-900 rounded-xl p-4 overflow-x-auto my-6" {...props} />;
  },
  code: (props: any) => <code className="bg-slate-900 border border-slate-800 text-indigo-300 rounded px-1.5 py-0.5 text-xs font-mono" {...props} />,
};

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { metadata, content } = article;
  const headings = extractHeadings(content);
  const relatedArticles = getRelatedArticles(slug, metadata.category, metadata.tags, 3);
  const schemas = getSchemasForArticle(metadata, content);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const breadcrumbs = [
    { label: 'Blog', href: '/blog' },
    { label: metadata.category, href: `/blog/category/${metadata.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
    { label: metadata.title }
  ];

  const hasAffiliateLinks = metadata.affiliateLinks && metadata.affiliateLinks.length > 0;

  return (
    <article className="space-y-8 select-text">
      {/* JSON-LD Schemas Injection in head */}
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
      ))}

      {/* Top Navigation */}
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

      {/* Article Header Details */}
      <header className="space-y-6 text-center md:text-left max-w-4xl">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider text-indigo-400 select-none">
          {metadata.category}
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          {metadata.title}
        </h1>
        
        {/* Post Metadata info */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 text-xs md:text-sm font-semibold select-none">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 text-[10px]">
              AP
            </div>
            <span className="text-slate-300">{metadata.author}</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-850 hidden sm:inline-block" />
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Published on {formatDate(metadata.date)}</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-850" />
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{metadata.readingTime} min read</span>
          </span>
        </div>

        {/* Cover Image */}
        {metadata.coverImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 select-none">
            <img 
              src={metadata.coverImage} 
              alt={metadata.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-10 relative items-start">
        {/* Left/Middle Article Body */}
        <div className="flex-grow max-w-[720px] w-full min-w-0 prose prose-invert prose-slate select-text">
          {/* Centralized Affiliate Disclaimer */}
          {hasAffiliateLinks && (
            <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/20 text-xs text-slate-500 mb-8 italic select-none">
              <strong>Affiliate Disclosure:</strong> This article contains affiliate links for tools we genuinely use and recommend. If you make a purchase through these links, we may earn a small commission at no extra cost to you.
            </div>
          )}

          {/* Render MDX Content */}
          <MDXRemote 
            source={content} 
            components={mdxComponents}
          />

          <hr className="border-slate-900 my-10" />

          {/* Tags list */}
          {metadata.tags && metadata.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 my-6 select-none">
              <span className="text-xs font-bold text-slate-500 uppercase mr-1">Tags:</span>
              {metadata.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-900 hover:border-indigo-500/40 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Author Bio Section */}
          <AuthorBio authorName={metadata.author} />
        </div>

        {/* Right Sticky Sidebar Table of Contents */}
        <TableOfContents headings={headings} />
      </div>

      {/* Suggested Articles */}
      <RelatedArticles articles={relatedArticles} />

      {/* Bottom Newsletter Signup */}
      <section className="select-none">
        <NewsletterSignup placement="footer" />
      </section>
    </article>
  );
}
