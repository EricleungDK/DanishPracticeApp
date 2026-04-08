import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getApiInstance } from '../lib/api-instance';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Settings() {
  const [showConfirm, setShowConfirm] = useState(false);
  const loadDashboardData = useAppStore((s) => s.loadDashboardData);

  const handleReset = async () => {
    await getApiInstance().resetProgress();
    setShowConfirm(false);
    loadDashboardData();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Settings</h2>

      <div
        className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-card)] border border-[var(--color-border-primary)] p-6 space-y-6"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)]">Appearance</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 mb-3">
            Toggle between light and dark mode.
          </p>
          <ThemeToggle />
        </div>

        <div className="pt-4 border-t border-[var(--color-border-secondary)]">
          <h3 className="font-semibold text-[var(--color-text-primary)]">Reset Progress</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Clear all review history and spaced repetition data. Exercise content will be kept.
          </p>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="mt-3 bg-[var(--color-error-bg)] text-[var(--color-error)] px-4 py-2 rounded-[var(--radius-button)] hover:opacity-80 transition-opacity btn-hover"
            >
              Reset All Progress
            </button>
          ) : (
            <div className="mt-3 flex gap-3" role="alertdialog" aria-label="Confirm reset">
              <button
                onClick={handleReset}
                className="bg-[var(--color-error)] text-white px-4 py-2 rounded-[var(--radius-button)] hover:opacity-90 transition-opacity btn-hover"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] px-4 py-2 rounded-[var(--radius-button)] hover:opacity-80 transition-opacity btn-hover"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[var(--color-border-secondary)]">
          <h3 className="font-semibold text-[var(--color-text-primary)]">About</h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Danish Practice Generator v1.0.0
          </p>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Built with Electron + React + TypeScript
          </p>
        </div>
      </div>
    </div>
  );
}
