'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { affiliates } from '@/lib/affiliates';

interface AffiliateLinkProps {
  tool: string;
  children: React.ReactNode;
  className?: string;
}

export function AffiliateLink({ tool, children, className }: AffiliateLinkProps) {
  const affiliate = affiliates[tool];
  if (!affiliate || !affiliate.active) {
    return <span className={className}>{children}</span>;
  }

  // Construct URL with UTM Params
  let trackingUrl = affiliate.url;
  try {
    const urlObj = new URL(affiliate.url);
    if (affiliate.utmParams) {
      Object.entries(affiliate.utmParams).forEach(([key, val]) => {
        urlObj.searchParams.set(key, val);
      });
    }
    // Also inject default tracking details if not set
    if (!urlObj.searchParams.has('utm_source')) {
      urlObj.searchParams.set('utm_source', 'onmirank-blog');
    }
    trackingUrl = urlObj.toString();
  } catch (err) {
    console.error('Invalid affiliate url: ', affiliate.url, err);
  }

  const handleClick = () => {
    // Send tracking data to local API endpoint in the background
    fetch('/api/affiliate/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: affiliate.id,
        url: trackingUrl,
        article: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      }),
    }).catch((err) => console.error('Failed to log affiliate click:', err));
  };

  return (
    <a
      href={trackingUrl}
      target="_blank"
      rel="nofollow sponsored"
      onClick={handleClick}
      data-affiliate={tool}
      className={`inline-flex items-center gap-0.5 text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 transition-colors duration-150 cursor-pointer ${className || ''}`}
    >
      {children}
      <ExternalLink className="h-3 w-3 inline shrink-0 opacity-80" />
    </a>
  );
}
