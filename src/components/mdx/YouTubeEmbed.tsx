import React from 'react';

interface YouTubeEmbedProps {
  id: string;
  title?: string;
}

export function YouTubeEmbed({ id, title = 'YouTube video player' }: YouTubeEmbedProps) {
  if (!id) return null;

  return (
    <div className="my-8 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg relative aspect-video w-full">
      <iframe
        className="absolute inset-0 w-full h-full border-0"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
