import React from 'react';
import { Check, X } from 'lucide-react';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface ComparisonTableProps {
  data: TableData;
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  if (!data || !data.headers || !data.rows) return null;

  // Simple formatter helper to replace [yes] or [no] strings with icons
  const formatCell = (text: string) => {
    const trimmed = text.trim().toLowerCase();
    if (trimmed === '[yes]' || trimmed === 'yes') {
      return (
        <span className="inline-flex items-center justify-center p-1 rounded-full bg-emerald-500/10 text-emerald-400">
          <Check className="h-4 w-4" />
        </span>
      );
    }
    if (trimmed === '[no]' || trimmed === 'no') {
      return (
        <span className="inline-flex items-center justify-center p-1 rounded-full bg-rose-500/10 text-rose-400">
          <X className="h-4 w-4" />
        </span>
      );
    }
    return text;
  };

  return (
    <div className="my-8 rounded-xl border border-slate-800 bg-[#11131e]/20 backdrop-blur-md overflow-hidden glow-primary max-w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm md:text-base">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60">
              {data.headers.map((header, idx) => (
                <th 
                  key={idx} 
                  className={`p-4 font-bold text-white tracking-wide uppercase text-xs md:text-sm ${
                    idx === 0 ? 'text-slate-400' : 'text-indigo-400'
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.rows.map((row, rowIdx) => (
              <tr 
                key={rowIdx} 
                className="hover:bg-slate-900/20 transition-colors duration-150"
              >
                {row.map((cell, cellIdx) => (
                  <td 
                    key={cellIdx} 
                    className={`p-4 text-slate-300 ${
                      cellIdx === 0 
                        ? 'font-semibold text-slate-200 bg-slate-950/20' 
                        : 'font-normal'
                    }`}
                  >
                    {formatCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
