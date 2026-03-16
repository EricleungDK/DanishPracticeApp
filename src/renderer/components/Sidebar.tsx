import React from 'react';
import { useAppStore, type Page } from '../store/useAppStore';

const navItems: { page: Page; label: string; icon: string }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: '📊' },
  { page: 'exercise', label: 'Practice', icon: '📝' },
  { page: 'review', label: 'Review', icon: '🔄' },
  { page: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const currentPage = useAppStore((s) => s.currentPage);
  const navigate = useAppStore((s) => s.navigate);
  const stats = useAppStore((s) => s.stats);
  const sessionExercises = useAppStore((s) => s.sessionExercises);
  const sessionComplete = useAppStore((s) => s.sessionComplete);

  const handleNav = (page: Page) => {
    if (page === 'exercise') {
      // Resume existing session if one is active and not complete
      if (sessionExercises.length > 0 && !sessionComplete) {
        navigate('exercise');
      } else {
        // No active session — go to dashboard to pick type
        navigate('dashboard');
      }
    } else if (page === 'review') {
      if (sessionExercises.length > 0 && !sessionComplete && currentPage === 'review') {
        navigate('review');
      } else {
        navigate('dashboard');
      }
    } else {
      navigate(page);
    }
  };

  const hasActiveSession =
    sessionExercises.length > 0 && !sessionComplete && (currentPage === 'exercise' || currentPage === 'review');

  return (
    <nav className="w-56 bg-gray-900 text-white flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-lg font-bold">Dansk Praksis</h1>
        <p className="text-xs text-gray-400 mt-1">Danish Practice Generator</p>
      </div>

      <div className="flex-1 py-4">
        {navItems.map(({ page, label, icon }) => (
          <button
            key={page}
            onClick={() => handleNav(page)}
            className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
            {page === 'exercise' && hasActiveSession && currentPage === 'exercise' && (
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                live
              </span>
            )}
            {page === 'review' && stats.dueCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.dueCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        v1.0.0
      </div>
    </nav>
  );
}
