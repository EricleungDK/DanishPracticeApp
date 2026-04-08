import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface SkillRadarProps {
  data: { type: string; label: string; accuracy: number }[];
}

export default function SkillRadar({ data }: SkillRadarProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--color-text-tertiary)] text-sm">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="var(--color-border-primary)" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
        />
        <Radar
          dataKey="accuracy"
          fill="var(--color-accent-primary)"
          fillOpacity={0.3}
          stroke="var(--color-accent-primary)"
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
