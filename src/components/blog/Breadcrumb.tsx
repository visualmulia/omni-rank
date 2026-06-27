import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-slate-400 text-xs md:text-sm my-4 select-none">
      <ol className="flex flex-wrap items-center gap-1.5 leading-none">
        <li>
          <Link href="/" className="hover:text-indigo-400 transition-colors">
            Home
          </Link>
        </li>
        
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          
          return (
            <React.Fragment key={idx}>
              <li className="flex items-center text-slate-600">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                {isLast || !item.href ? (
                  <span className="text-slate-200 font-medium truncate max-w-[200px] md:max-w-xs block">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-indigo-400 transition-colors truncate max-w-[150px] md:max-w-none block">
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
