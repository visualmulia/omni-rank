import React from 'react';
import Link from 'next/link';
import { Zap, BookOpen, Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: siteConfig.defaultSEO.title,
  description: siteConfig.defaultSEO.description,
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-950/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-950/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar Header */}
      <header className="border-b border-slate-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50 print:hidden select-none">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-white hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="OmniRank Logo" className="h-8 w-8 object-contain mr-0.5 rounded-lg" />
            OMNI <span className="text-indigo-400">RANK</span>
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <Link href="/" className="hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-indigo-400 hover:text-indigo-350 transition-colors flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Blog</span>
            </Link>
            <Link href="/blog/newsletter" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              <span>Newsletter</span>
            </Link>
          </nav>
          
          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/10 transition-all duration-200 cursor-pointer"
            >
              <Zap className="h-3 w-3 fill-white" />
              <span>Free Audit</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-8 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/20 py-8 text-center text-xs text-slate-500 print:hidden select-none">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <div className="flex justify-center gap-6 text-sm font-medium text-slate-400 mb-2">
            <Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-indigo-400 transition-colors">Blog</Link>
            <Link href="/blog/newsletter" className="hover:text-indigo-400 transition-colors">Newsletter</Link>
          </div>
          <p>© {new Date().getFullYear()} OmniRank. AI Visibility Intelligence for Indie Hackers & SME.</p>
          <p className="text-[10px] text-slate-600 max-w-md mx-auto leading-relaxed">
            GEO is a rapidly evolving practice. OmniRank provides analytical scores and guidance for informational purposes only. We make no guarantees of rankings in individual LLM instances.
          </p>
        </div>
      </footer>
    </div>
  );
}
