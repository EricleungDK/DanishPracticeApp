import React from 'react';
import type { Exercise } from '../../shared/types';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  total: number;
  children: React.ReactNode;
}

const typeLabels: Record<string, string> = {
  fill_blank: 'Fill in the Blank',
  sentence_construction: 'Sentence Construction',
  reading: 'Reading Comprehension',
  listening: 'Listening',
};

export default function ExerciseCard({ exercise, index, total, children }: ExerciseCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {typeLabels[exercise.type] || exercise.type}
        </span>
        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {exercise.difficulty}
        </span>
        {exercise.topic && (
          <span className="text-xs text-gray-400">{exercise.topic}</span>
        )}
        <span className="ml-auto text-sm text-gray-400">
          {index + 1} / {total}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">{children}</div>
    </div>
  );
}
