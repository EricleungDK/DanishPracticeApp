import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SessionHistoryChartProps {
  sessions: { date: string; score: number }[];
}

export default function SessionHistoryChart({ sessions }: SessionHistoryChartProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--color-text-tertiary)] text-sm">
        No sessions yet
      </div>
    );
  }

  return (
    <div data-testid="session-history-chart">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={sessions}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'var(--color-text-tertiary)', fontSize: 11 }}
            width={35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-primary)',
              borderRadius: '8px',
              color: 'var(--color-text-primary)',
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="var(--color-accent-primary)"
            strokeWidth={2}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
