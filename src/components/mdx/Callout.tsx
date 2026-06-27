import React from 'react';
import { Info, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface CalloutProps {
  type?: 'tip' | 'warning' | 'info' | 'success' | 'danger';
  children: React.ReactNode;
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: {
      bg: 'bg-blue-500/10 border-blue-500/20 text-blue-200',
      icon: <Info className="h-5 w-5 text-blue-400 shrink-0" />,
      border: 'border-l-4 border-l-blue-500'
    },
    tip: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200',
      icon: <Lightbulb className="h-5 w-5 text-emerald-400 shrink-0" />,
      border: 'border-l-4 border-l-emerald-500'
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-200',
      icon: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
      border: 'border-l-4 border-l-amber-500'
    },
    success: {
      bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200',
      icon: <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />,
      border: 'border-l-4 border-l-indigo-500'
    },
    danger: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-200',
      icon: <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />,
      border: 'border-l-4 border-l-rose-500'
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className={`my-6 flex gap-4 p-4 rounded-r-xl border border-y border-r ${currentStyle.bg} ${currentStyle.border}`}>
      <div className="mt-0.5">{currentStyle.icon}</div>
      <div className="text-sm md:text-base leading-relaxed">{children}</div>
    </div>
  );
}
