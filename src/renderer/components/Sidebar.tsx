import React from 'react';
import { LayoutDashboard, PenLine, RefreshCw, Zap, Settings } from 'lucide-react';
import { useAppStore, type Page } from '../store/useAppStore';
import ThemeToggle from './ui/ThemeToggle';

const navItems: { page: Page; label: string; icon: React.ReactNode; accent: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, accent: '#2563EB' },
  { page: 'exercise', label: 'Practice', icon: <PenLine size={18} />, accent: '#0891B2' },
  { page: 'review', label: 'Review', icon: <RefreshCw size={18} />, accent: '#D97706' },
  { page: 'vocab-boost', label: 'Vocab Boost', icon: <Zap size={18} />, accent: '#8B5CF6' },
  { page: 'settings', label: 'Settings', icon: <Settings size={18} />, accent: '#6B7280' },
];

export default function Sidebar() {
  const currentPage = useAppStore((s) => s.currentPage);
  const navigate = useAppStore((s) => s.navigate);
  const stats = useAppStore((s) => s.stats);
  const sessionExercises = useAppStore((s) => s.sessionExercises);
  const sessionComplete = useAppStore((s) => s.sessionComplete);
  const startPractice = useAppStore((s) => s.startPractice);
  const startReview = useAppStore((s) => s.startReview);

  const handleNav = (page: Page) => {
    if (page === 'exercise') {
      if (sessionExercises.length > 0 && !sessionComplete) {
        navigate('exercise');
      } else {
        startPractice();
      }
    } else if (page === 'review') {
      if (sessionExercises.length > 0 && !sessionComplete && currentPage === 'review') {
        navigate('review');
      } else {
        startReview();
      }
    } else {
      navigate(page);
    }
  };

  const hasActiveSession =
    sessionExercises.length > 0 && !sessionComplete && (currentPage === 'exercise' || currentPage === 'review');

  return (
    <nav
      aria-label="Main navigation"
      className="
        flex flex-row justify-around w-full
        md:flex-col md:justify-between md:w-56 md:h-auto
        bg-[var(--color-bg-sidebar)] text-[var(--color-text-sidebar)]
        border-r-0 md:border-r border-t md:border-t-0
      "
      style={{
        borderColor: 'var(--color-sidebar-border)',
        minHeight: '4rem',
      }}
    >
      {/* Header — desktop only */}
      <div
        className="hidden md:block px-5 py-5"
        style={{ borderBottom: '1px solid var(--color-sidebar-border)' }}
      >
        <h1 className="text-lg font-bold font-[family-name:var(--font-serif)] text-white">
          Dansk Praksis
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
          Danish Practice Generator
        </p>
      </div>

      {/* Nav items */}
      <div className="flex flex-row justify-around w-full md:flex-col md:py-2 md:px-3 md:gap-0.5 md:w-auto">
        {navItems.map(({ page, label, icon, accent }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => handleNav(page)}
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative flex items-center justify-center gap-3
                px-3 py-2.5 md:px-3 md:py-2.5 md:rounded-lg
                text-sm transition-all duration-150
                ${isActive
                  ? 'text-white'
                  : 'text-[var(--color-text-sidebar)] hover:text-white'
                }
              `}
              style={isActive ? {
                backgroundColor: `${accent}20`,
                boxShadow: `inset 3px 0 0 ${accent}`,
              } : undefined}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-sidebar-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '';
                }
              }}
            >
              <span style={{ color: isActive ? accent : undefined }}>{icon}</span>
              <span className="hidden md:inline flex-1 text-left">{label}</span>
              {page === 'exercise' && hasActiveSession && currentPage === 'exercise' && (
                <span
                  aria-label="Session active"
                  className="ml-auto hidden md:inline text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#5B7F6A', color: 'white' }}
                >
                  live
                </span>
              )}
              {page === 'review' && stats.dueCount > 0 && (
                <span
                  aria-label={`${stats.dueCount} reviews due`}
                  className="
                    absolute top-0.5 right-0.5 md:static md:ml-auto
                    text-white text-xs font-bold
                    min-w-[20px] h-5 md:min-w-[24px] md:h-auto
                    flex items-center justify-center
                    md:px-2 md:py-0.5 rounded-full
                  "
                  style={{ backgroundColor: '#C17D56' }}
                >
                  {stats.dueCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer — desktop only */}
      <div
        className="hidden md:flex md:flex-col md:gap-2 px-4 py-3"
        style={{ borderTop: '1px solid var(--color-sidebar-border)' }}
      >
        <ThemeToggle />
        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>v1.0.0</span>
      </div>
    </nav>
  );
}
