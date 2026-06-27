'use client';

import React, { useEffect, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface GEOChartProps {
  technical: number;
  content: number;
  brand: number;
  freshness: number;
}

export default function GEOChart({ technical, content, brand, freshness }: GEOChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
        Loading Chart...
      </div>
    );
  }

  const data = [
    { subject: 'Technical Signals', score: technical, fullMark: 100 },
    { subject: 'Content Structure', score: content, fullMark: 100 },
    { subject: 'Brand Entity', score: brand, fullMark: 100 },
    { subject: 'Freshness Signals', score: freshness, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full md:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={45}
            domain={[0, 100]}
            tick={{ fill: '#475569', fontSize: 9 }}
          />
          <Radar
            name="GEO Score"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
