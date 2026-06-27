import React from 'react';
import { codeToHtml } from 'shiki';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
}

export async function CodeBlock({ children, language = 'text' }: CodeBlockProps) {
  // Extract text content from children
  const codeContent = typeof children === 'string' 
    ? children 
    : children?.toString() || '';

  // Clean trailing newlines
  const cleanedCode = codeContent.replace(/\n$/, '');

  let html = '';
  try {
    html = await codeToHtml(cleanedCode, {
      lang: language.toLowerCase(),
      theme: 'github-dark',
    });
  } catch (e) {
    console.error(`Shiki failed to highlight lang "${language}", falling back to plain text.`, e);
    try {
      html = await codeToHtml(cleanedCode, {
        lang: 'text',
        theme: 'github-dark',
      });
    } catch {
      html = `<pre><code>${cleanedCode}</code></pre>`;
    }
  }

  return (
    <div className="my-6 rounded-xl border border-slate-800 bg-[#090a0f] overflow-hidden text-slate-100">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-900 bg-slate-950/60">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase">
          {language}
        </span>
        <CopyButton code={cleanedCode} />
      </div>
      {/* We wrap the shiki output in a container with styling. Shiki outputs a <pre> tag itself, so we can inject styles into it. */}
      <div 
        className="p-4 overflow-x-auto text-sm font-mono [&>pre]:bg-transparent! [&>pre]:p-0! [&>pre]:m-0! [&>code]:bg-transparent! [&>code]:p-0!"
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    </div>
  );
}
