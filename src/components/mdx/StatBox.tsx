import React from 'react';

interface StatBoxProps {
  value: string;
  label: string;
}

export function StatBox({ value, label }: StatBoxProps) {
  return (
    <div className="my-8 p-6 md:p-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 to-blue-950/20 glow-primary text-center max-w-md mx-auto relative overflow-hidden">
      {/* Decorative Glow Dot */}
      <div className="absolute top-[-20%] left-[-20%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-2xl" />
      
      <div className="relative z-10 space-y-2">
        <div className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
          {value}
        </div>
        <div className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-400 max-w-[280px] mx-auto leading-normal">
          {label}
        </div>
      </div>
    </div>
  );
}
