'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="my-8 space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className="rounded-xl border border-slate-800 bg-[#11131e]/40 backdrop-blur-md overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left font-bold text-slate-100 hover:text-indigo-400 transition-colors duration-200 cursor-pointer"
              >
                <span className="text-sm md:text-base pr-4">{item.question}</span>
                <ChevronDown 
                  className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-indigo-400' : ''
                  }`} 
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[500px] border-t border-slate-900' : 'max-h-0'
                } overflow-hidden`}
              >
                <div className="p-4 md:p-5 text-sm md:text-base text-slate-400 leading-relaxed bg-[#090a0f]/40">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
