import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={toggleTheme}
      className="flex items-center gap-2 p-2 rounded-[var(--radius-button)] transition-colors hover:bg-[var(--color-bg-sidebar-hover)] text-[var(--color-text-sidebar)]"
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
      <span className="hidden md:inline text-sm">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
