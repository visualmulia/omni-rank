import React from 'react';
import Link from 'next/link';

interface CategoryItem {
  name: string;
  slug: string;
  count?: number;
}

interface CategoryPillsProps {
  categories: CategoryItem[];
  activeSlug?: string | null;
}

export function CategoryPills({ categories, activeSlug = null }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-2.5 py-4 overflow-x-auto no-scrollbar scroll-smooth">
      <Link
        href="/blog"
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer select-none ${
          !activeSlug 
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20' 
            : 'bg-[#11131e]/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
        }`}
      >
        All Articles
      </Link>
      
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        
        return (
          <Link
            key={cat.slug}
            href={`/blog/category/${cat.slug}`}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer select-none whitespace-nowrap ${
              isActive 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20' 
                : 'bg-[#11131e]/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {cat.name} {cat.count !== undefined && <span className="opacity-60 font-semibold ml-0.5">({cat.count})</span>}
          </Link>
        );
      })}
    </div>
  );
}
