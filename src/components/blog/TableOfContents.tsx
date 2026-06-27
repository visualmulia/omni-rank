'use client';

import React, { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';
import { HeadingItem } from '@/lib/mdx';

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false); // For mobile collapsible view

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Find entries that are intersecting
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Set active to the first visible entry
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px', // Trigger when heading is near the top of the viewport
        threshold: 0.1,
      }
    );

    headingElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      headingElements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 90; // Offset for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      
      setActiveId(id);
      setIsOpen(false); // Close mobile collapsible
    }
  };

  return (
    <>
      {/* Mobile Collapsible TOC (shown at top of article on smaller viewports) */}
      <div className="lg:hidden w-full border border-slate-800 bg-[#11131e]/30 backdrop-blur-md rounded-xl overflow-hidden mb-6 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left font-bold text-sm text-slate-200 hover:text-indigo-400 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-indigo-400" />
            <span>Table of Contents</span>
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {isOpen && (
          <div className="px-4 pb-4 border-t border-slate-900 bg-slate-950/20">
            <ul className="space-y-2 mt-3">
              {headings.map((h) => (
                <li 
                  key={h.id}
                  style={{ paddingLeft: `${(h.level - 2) * 12}px` }}
                >
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => handleLinkClick(e, h.id)}
                    className={`text-xs block py-0.5 transition-colors ${
                      activeId === h.id 
                        ? 'text-indigo-400 font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <nav className="hidden lg:block w-full max-w-[240px] shrink-0 sticky top-28 self-start p-4 border border-slate-900 bg-[#11131e]/10 backdrop-blur-md rounded-2xl select-none">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-4">
          <List className="h-3.5 w-3.5" />
          <span>On this page</span>
        </div>
        <ul className="space-y-3 pr-2 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <li 
                key={h.id}
                style={{ paddingLeft: `${(h.level - 2) * 12}px` }}
              >
                <a
                  href={`#${h.id}`}
                  onClick={(e) => handleLinkClick(e, h.id)}
                  className={`text-xs block py-0.5 transition-all duration-200 border-l-2 pl-3 ${
                    isActive 
                      ? 'text-indigo-400 font-bold border-indigo-500 bg-indigo-500/5' 
                      : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-800'
                  }`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
