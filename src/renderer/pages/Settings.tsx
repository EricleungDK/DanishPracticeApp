import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function Settings() {
  const [showConfirm, setShowConfirm] = useState(false);
  const loadDashboardData = useAppStore((s) => s.loadDashboardData);

  const handleReset = async () => {
    await window.api.resetProgress();
    setShowConfirm(false);
    loadDashboardData();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-800">Reset Progress</h3>
          <p className="text-sm text-gray-500 mt-1">
            Clear all review history and spaced repetition data. Exercise content will be kept.
          </p>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="mt-3 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              Reset All Progress
            </button>
          ) : (
            <div className="mt-3 flex gap-3">
              <button
                onClick={handleReset}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold text-gray-800">About</h3>
          <p className="text-sm text-gray-500 mt-1">
            Danish Practice Generator v1.0.0
          </p>
          <p className="text-sm text-gray-500">
            Built with Electron + React + TypeScript
          </p>
        </div>
      </div>
    </div>
  );
}
