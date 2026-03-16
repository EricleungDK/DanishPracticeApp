import React, { useState } from 'react';
import type { Exercise, ReadingAnswerKey, ReadingQuestion } from '../../../shared/types';

interface Props {
  exercise: Exercise;
  onSubmit: (answer: { questionIndex: number; answer: any; question: ReadingQuestion }) => void;
  disabled: boolean;
}

export default function ReadingExercise({ exercise, onSubmit, disabled }: Props) {
  const answerKey = exercise.answer_key as ReadingAnswerKey;
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [freeTextInput, setFreeTextInput] = useState('');

  const question = answerKey.questions[currentQuestion];
  if (!question) return null;

  const handleMCSelect = (index: number) => {
    if (disabled) return;
    const newAnswers = { ...answers, [currentQuestion]: index };
    setAnswers(newAnswers);
    onSubmit({
      questionIndex: currentQuestion,
      answer: index,
      question,
    });
  };

  const handleFreeTextSubmit = () => {
    if (disabled || !freeTextInput.trim()) return;
    const newAnswers = { ...answers, [currentQuestion]: freeTextInput };
    setAnswers(newAnswers);
    onSubmit({
      questionIndex: currentQuestion,
      answer: freeTextInput,
      question,
    });
    setFreeTextInput('');
  };

  return (
    <div className="space-y-4">
      {/* Passage */}
      <div className="bg-gray-50 p-4 rounded-lg border max-h-60 overflow-y-auto">
        <p className="text-base leading-relaxed whitespace-pre-line">{exercise.danish_text}</p>
        {showTranslation && (
          <p className="text-sm text-gray-500 mt-3 pt-3 border-t italic">
            {exercise.english_text}
          </p>
        )}
      </div>

      <button
        onClick={() => setShowTranslation(!showTranslation)}
        className="text-xs text-blue-500 hover:text-blue-700"
      >
        {showTranslation ? 'Hide translation' : 'Show translation'}
      </button>

      {/* Question */}
      <div className="border-t pt-4">
        <p className="text-sm text-gray-400 mb-1">
          Question {currentQuestion + 1} / {answerKey.questions.length}
        </p>
        <p className="font-medium">{question.question_da}</p>
        <p className="text-sm text-gray-500 italic">{question.question_en}</p>

        {question.type === 'multiple_choice' && question.options && (
          <div className="mt-3 space-y-2">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleMCSelect(i)}
                disabled={disabled}
                className={`w-full text-left px-4 py-2 rounded-lg border transition-colors ${
                  answers[currentQuestion] === i
                    ? 'bg-blue-100 border-blue-400'
                    : 'hover:bg-gray-50 border-gray-200'
                } disabled:opacity-50`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === 'free_text' && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={freeTextInput}
              onChange={(e) => setFreeTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFreeTextSubmit()}
              disabled={disabled}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
              placeholder="Type your answer..."
            />
            <button
              onClick={handleFreeTextSubmit}
              disabled={disabled || !freeTextInput.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Check
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
