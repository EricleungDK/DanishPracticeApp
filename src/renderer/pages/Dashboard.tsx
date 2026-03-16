import React from 'react';
import { useAppStore } from '../store/useAppStore';
import StatsCard from '../components/StatsCard';
import type { ExerciseType } from '../../shared/types';

const exerciseTypes: { type: ExerciseType; label: string; icon: string; desc: string }[] = [
  { type: 'fill_blank', label: 'Fill in the Blank', icon: '✍️', desc: 'Complete sentences with missing words' },
  { type: 'sentence_construction', label: 'Sentence Building', icon: '🧩', desc: 'Arrange words into correct order' },
  { type: 'reading', label: 'Reading', icon: '📖', desc: 'Read passages and answer questions' },
  { type: 'listening', label: 'Listening', icon: '🔊', desc: 'Listen and transcribe Danish' },
];

export default function Dashboard() {
  const stats = useAppStore((s) => s.stats);
  const startPractice = useAppStore((s) => s.startPractice);
  const startReview = useAppStore((s) => s.startReview);
  const sessionExercises = useAppStore((s) => s.sessionExercises);
  const sessionComplete = useAppStore((s) => s.sessionComplete);
  const navigate = useAppStore((s) => s.navigate);
  const currentIndex = useAppStore((s) => s.currentIndex);

  const hasActiveSession = sessionExercises.length > 0 && !sessionComplete;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Velkommen!</h2>
        <p className="text-gray-500 mt-1">Keep practicing your Danish every day.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Reviewed" value={stats.totalReviewed} color="blue" />
        <StatsCard label="Accuracy" value={`${stats.accuracy}%`} color="green" />
        <StatsCard label="Due Reviews" value={stats.dueCount} color="orange" />
        <StatsCard label="Streak" value={`${stats.streak}d`} color="purple" />
      </div>

      {/* Resume active session */}
      {hasActiveSession && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-blue-800">Session in progress</p>
            <p className="text-sm text-blue-600">
              {currentIndex} / {sessionExercises.length} completed
            </p>
          </div>
          <button
            onClick={() => navigate('exercise')}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Resume
          </button>
        </div>
      )}

      {/* Exercise type chooser */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Practice by type</h3>
        <div className="grid grid-cols-2 gap-3">
          {exerciseTypes.map(({ type, label, icon, desc }) => (
            <button
              key={type}
              onClick={() => startPractice(type)}
              className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{icon}</span>
                <span className="font-semibold text-gray-800">{label}</span>
              </div>
              <p className="text-xs text-gray-500">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Mixed practice + review */}
      <div className="flex gap-4">
        <button
          onClick={() => startPractice()}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Mixed Practice
        </button>
        <button
          onClick={() => startReview()}
          disabled={stats.dueCount === 0}
          className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Review Due ({stats.dueCount})
        </button>
      </div>
    </div>
  );
}
