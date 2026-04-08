import React from 'react';

interface StreakCalendarProps {
  dailyActivity: Record<string, number>;
}

function intensityClass(count: number): string {
  if (count === 0) return 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]';
  if (count <= 2) return 'bg-[var(--color-accent-primary-25)]';
  if (count <= 5) return 'bg-[var(--color-accent-primary-50)]';
  if (count <= 10) return 'bg-[var(--color-accent-primary-75)]';
  return 'bg-[var(--color-accent-primary)]';
}

export default function StreakCalendar({ dailyActivity }: StreakCalendarProps) {
  const days: { date: string; count: number }[] = [];
  const today = new Date();

  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({ date: dateStr, count: dailyActivity[dateStr] || 0 });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-12 gap-1">
        {days.map(({ date, count }) => (
          <div
            key={date}
            data-testid="streak-cell"
            data-count={count}
            title={`${date}: ${count} exercises`}
            className={`w-full aspect-square rounded-sm ${intensityClass(count)} transition-colors`}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 mt-1">
        <span className="text-xs text-[var(--color-text-tertiary)]">Less</span>
        {[0, 2, 5, 10, 15].map(n => (
          <div key={n} className={`w-3 h-3 rounded-sm ${intensityClass(n)}`} />
        ))}
        <span className="text-xs text-[var(--color-text-tertiary)]">More</span>
      </div>
    </div>
  );
}
