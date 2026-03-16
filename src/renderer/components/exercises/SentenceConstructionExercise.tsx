import React, { useState, useRef } from 'react';
import type { Exercise, SentenceConstructionAnswerKey } from '../../../shared/types';

interface Props {
  exercise: Exercise;
  onSubmit: (answer: string[]) => void;
  disabled: boolean;
}

export default function SentenceConstructionExercise({ exercise, onSubmit, disabled }: Props) {
  const answerKey = exercise.answer_key as SentenceConstructionAnswerKey;
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(answerKey.words_given);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragSource, setDragSource] = useState<'selected' | 'available' | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // --- Drag from available → selected ---
  const handleAvailableDragStart = (e: React.DragEvent, word: string, index: number) => {
    if (disabled) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', word);
    setDragSource('available');
    setDragIndex(index);
  };

  const handleDropOnAnswer = (e: React.DragEvent, insertAt?: number) => {
    e.preventDefault();
    if (disabled) return;

    if (dragSource === 'available' && dragIndex !== null) {
      const word = available[dragIndex];
      const newAvailable = available.filter((_, i) => i !== dragIndex);
      const newSelected = [...selected];
      if (insertAt !== undefined) {
        newSelected.splice(insertAt, 0, word);
      } else {
        newSelected.push(word);
      }
      setSelected(newSelected);
      setAvailable(newAvailable);
    }

    resetDrag();
  };

  // --- Drag to reorder within selected ---
  const handleSelectedDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', selected[index]);
    setDragSource('selected');
    setDragIndex(index);
  };

  const handleSelectedDragOver = (e: React.DragEvent, overIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(overIndex);
  };

  const handleSelectedDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (disabled || dragIndex === null) return;

    if (dragSource === 'selected') {
      // Reorder within selected
      const newSelected = [...selected];
      const [moved] = newSelected.splice(dragIndex, 1);
      newSelected.splice(dropIndex, 0, moved);
      setSelected(newSelected);
    } else if (dragSource === 'available') {
      // Drop from available into a specific position
      handleDropOnAnswer(e, dropIndex);
      return;
    }

    resetDrag();
  };

  // --- Drag from selected back to available ---
  const handleDropOnAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || dragSource !== 'selected' || dragIndex === null) return;

    const word = selected[dragIndex];
    setSelected(selected.filter((_, i) => i !== dragIndex));
    setAvailable([...available, word]);
    resetDrag();
  };

  const resetDrag = () => {
    setDragIndex(null);
    setDragOverIndex(null);
    setDragSource(null);
  };

  // --- Click fallback ---
  const addWord = (word: string, index: number) => {
    if (disabled) return;
    setSelected([...selected, word]);
    setAvailable(available.filter((_, i) => i !== index));
  };

  const removeWord = (index: number) => {
    if (disabled) return;
    const word = selected[index];
    setSelected(selected.filter((_, i) => i !== index));
    setAvailable([...available, word]);
  };

  const handleSubmit = () => {
    if (selected.length > 0) onSubmit(selected);
  };

  const handleReset = () => {
    setSelected([]);
    setAvailable(answerKey.words_given);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 italic mb-2">{exercise.english_text}</p>

      {/* Answer area — drop zone */}
      <div
        ref={dropZoneRef}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
        onDrop={(e) => handleDropOnAnswer(e)}
        className={`min-h-[3.5rem] p-3 rounded-lg flex flex-wrap gap-2 transition-colors ${
          dragSource === 'available'
            ? 'bg-blue-100 border-2 border-blue-400'
            : 'bg-blue-50 border-2 border-dashed border-blue-300'
        }`}
      >
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm">Drag words here to build the sentence...</span>
        )}
        {selected.map((word, i) => (
          <div
            key={`sel-${i}`}
            draggable={!disabled}
            onDragStart={(e) => handleSelectedDragStart(e, i)}
            onDragOver={(e) => handleSelectedDragOver(e, i)}
            onDrop={(e) => handleSelectedDrop(e, i)}
            onDragEnd={resetDrag}
            onClick={() => removeWord(i)}
            className={`select-none cursor-grab active:cursor-grabbing px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              dragSource === 'selected' && dragIndex === i
                ? 'opacity-40 bg-blue-400 text-white'
                : dragOverIndex === i && dragSource === 'selected'
                  ? 'bg-blue-700 text-white scale-105'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Available words — also a drop zone to return words */}
      <div
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
        onDrop={handleDropOnAvailable}
        className={`min-h-[2.5rem] flex flex-wrap gap-2 p-2 rounded-lg transition-colors ${
          dragSource === 'selected' ? 'bg-gray-100 border-2 border-dashed border-gray-300' : ''
        }`}
      >
        {available.map((word, i) => (
          <div
            key={`avail-${i}`}
            draggable={!disabled}
            onDragStart={(e) => handleAvailableDragStart(e, word, i)}
            onDragEnd={resetDrag}
            onClick={() => addWord(word, i)}
            className={`select-none cursor-grab active:cursor-grabbing px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              dragSource === 'available' && dragIndex === i
                ? 'opacity-40 bg-gray-300 text-gray-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {word}
          </div>
        ))}
        {available.length === 0 && dragSource !== 'selected' && (
          <span className="text-xs text-gray-300 italic">All words placed</span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={disabled || selected.length === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Check
        </button>
        <button
          onClick={handleReset}
          disabled={disabled}
          className="text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
