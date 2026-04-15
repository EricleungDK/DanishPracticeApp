import React from 'react';
import { PenLine, Puzzle, BookOpen, Volume2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import StatsCard from '../components/StatsCard';
import StreakCalendar from '../components/charts/StreakCalendar';
import SessionHistoryChart from '../components/charts/SessionHistoryChart';
import type { ExerciseType } from '../../shared/types';

const exerciseTypes: { type: ExerciseType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'fill_blank', label: 'Fill in the Blank', icon: <PenLine size={22} />, desc: 'Complete sentences with missing words' },
  { type: 'sentence_construction', label: 'Sentence Building', icon: <Puzzle size={22} />, desc: 'Arrange words into correct order' },
  { type: 'reading', label: 'Reading', icon: <BookOpen size={22} />, desc: 'Read passages and answer questions' },
  { type: 'listening', label: 'Listening', icon: <Volume2 size={22} />, desc: 'Listen and transcribe Danish' },
];

export default function Dashboard() {
  const stats = useAppStore((s) => s.stats);
  const startPractice = useAppStore((s) => s.startPractice);
  const startReview = useAppStore((s) => s.startReview);
  const chartData = useAppStore((s) => s.chartData);
  const sessionExercises = useAppStore((s) => s.sessionExercises);
  const sessionComplete = useAppStore((s) => s.sessionComplete);
  const navigate = useAppStore((s) => s.navigate);
  const currentIndex = useAppStore((s) => s.currentIndex);

  const hasActiveSession = sessionExercises.length > 0 && !sessionComplete;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] font-[family-name:var(--font-serif)]">
          Velkommen!
        </h2>
        <p className="text-[var(--color-text-secondary)] mt-1">Keep practicing your Danish every day.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Reviewed" value={stats.totalReviewed} />
        <StatsCard label="Accuracy" value={`${stats.accuracy}%`} />
        <StatsCard label="Due Reviews" value={stats.dueCount} />
        <StatsCard label="Streak" value={`${stats.streak}d`} />
      </div>

      {hasActiveSession && (
        <div className="mb-6 bg-[var(--color-info-bg)] border border-[var(--color-info-30)] rounded-[var(--radius-card)] p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-[var(--color-info)]">Session in progress</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {currentIndex} / {sessionExercises.length} completed
            </p>
          </div>
          <button
            onClick={() => navigate('exercise')}
            className="bg-[var(--color-accent-primary)] text-white px-5 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-accent-primary-hover)] transition-colors btn-hover"
          >
            Resume
          </button>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Practice by type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exerciseTypes.map(({ type, label, icon, desc }) => (
            <button
              key={type}
              onClick={() => startPractice(type)}
              className="text-left bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-[var(--radius-card)] p-4 hover:border-[var(--color-accent-primary)] card-hover"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[var(--color-accent-primary)]">{icon}</span>
                <span className="font-semibold text-[var(--color-text-primary)]">{label}</span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => startPractice()}
          className="flex-1 bg-[var(--color-accent-primary)] text-white py-3 rounded-[var(--radius-card)] font-semibold hover:bg-[var(--color-accent-primary-hover)] transition-colors btn-hover"
        >
          Mixed Practice
        </button>
        <button
          onClick={() => startReview()}
          disabled={stats.dueCount === 0}
          className="flex-1 bg-[var(--color-accent-secondary)] text-white py-3 rounded-[var(--radius-card)] font-semibold hover:bg-[var(--color-accent-secondary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-hover"
        >
          Review Due ({stats.dueCount})
        </button>
      </div>

      {/* Progress section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Progress</h3>

        <div
          className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-[var(--radius-card)] p-5"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">Activity (12 weeks)</p>
          <StreakCalendar dailyActivity={chartData.dailyActivity} />
        </div>

        <div
          className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-[var(--radius-card)] p-5"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">Score History</p>
          <SessionHistoryChart sessions={chartData.sessionHistory} />
        </div>
      </div>
    </div>
  );
}
