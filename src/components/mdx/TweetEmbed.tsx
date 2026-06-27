import React from 'react';

interface TweetEmbedProps {
  id: string;
  authorName?: string;
  authorHandle?: string;
  content?: string;
  date?: string;
}

export function TweetEmbed({ 
  id, 
  authorName = 'Ardyan Permana', 
  authorHandle = 'ardyan_permana', 
  content = 'Just did a deep audit on my new site using OmniRank. Found out 4 key sections were completely unoptimized for LLM citations. Fixed it, and 2 weeks later ChatGPT is citing my brand! GEO is real.', 
  date = 'Jun 27, 2026' 
}: TweetEmbedProps) {
  const tweetUrl = `https://twitter.com/${authorHandle}/status/${id}`;

  return (
    <div className="my-6 p-5 rounded-2xl border border-slate-800 bg-[#11131e]/30 hover:border-sky-500/30 transition-all duration-300 max-w-lg mx-auto relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Mock Avatar */}
          <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs">
            AP
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 leading-tight">{authorName}</h4>
            <p className="text-xs text-slate-400">@{authorHandle}</p>
          </div>
        </div>
        <a 
          href={tweetUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sky-400 hover:text-sky-300 transition-colors"
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>

      <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-3">
        {content}
      </p>

      <div className="text-xs text-slate-500 flex items-center justify-between">
        <span>{date}</span>
        <a 
          href={tweetUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:underline text-indigo-400 hover:text-indigo-300"
        >
          View on Twitter
        </a>
      </div>
    </div>
  );
}
