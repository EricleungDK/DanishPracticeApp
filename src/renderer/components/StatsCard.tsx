import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

export default function StatsCard({ label, value, subtitle }: StatsCardProps) {
  return (
    <div
      role="status"
      aria-label={`${label}: ${value}`}
      className="rounded-[var(--radius-card)] border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-5 card-hover"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <p className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</p>
      <p className="text-3xl font-bold mt-1 text-[var(--color-text-primary)]">{value}</p>
      {subtitle && <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{subtitle}</p>}
    </div>
  );
}
