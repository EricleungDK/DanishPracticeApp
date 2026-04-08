import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VocabBoost from '../../../pages/VocabBoost';
import { useVocabBoostStore } from '../../../store/useVocabBoostStore';
import type { SynonymEntry, VocabRound } from '../../../../shared/types';

const sampleSynonyms: SynonymEntry[] = Array.from({ length: 10 }, (_, i) => ({
  id: `syn-${i + 1}`,
  word: `word${i + 1}`,
  synonym: `synonym${i + 1}`,
  part_of_speech: 'noun',
  topic: 'test',
  cefr_level: 'B1' as const,
  example_da: `Example ${i + 1}`,
  example_synonym_da: `Synonym example ${i + 1}`,
  hint_en: `Hint ${i + 1}`,
}));

const sampleRounds: VocabRound[] = [
  {
    entry: sampleSynonyms[0],
    prompt: 'word1',
    choices: ['synonym1', 'word3', 'word5', 'word7'],
    correctIndex: 0,
  },
  {
    entry: sampleSynonyms[1],
    prompt: 'word2',
    choices: ['word4', 'synonym2', 'word6', 'word8'],
    correctIndex: 1,
  },
];

beforeEach(() => {
  useVocabBoostStore.setState({
    topic: null,
    rounds: [],
    currentRound: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answered: false,
    selectedIndex: null,
    sessionActive: false,
    sessionComplete: false,
  });
});

describe('VocabBoost Page', () => {
  it('renders pre-session screen with start button', () => {
    render(<VocabBoost />);
    expect(screen.getByText('Vocabulary Boost')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('All Topics')).toBeInTheDocument();
  });

  it('renders active quiz when session is active', () => {
    useVocabBoostStore.setState({
      sessionActive: true,
      rounds: sampleRounds,
      currentRound: 0,
    });

    render(<VocabBoost />);
    expect(screen.getByText('word1')).toBeInTheDocument();
    expect(screen.getByText('synonym1')).toBeInTheDocument();
    expect(screen.getByText('noun')).toBeInTheDocument();
    expect(screen.getByText('Round 1 / 2')).toBeInTheDocument();
  });

  it('renders session summary when complete', () => {
    useVocabBoostStore.setState({
      sessionActive: true,
      sessionComplete: true,
      rounds: sampleRounds,
      score: 2,
      bestStreak: 2,
    });

    render(<VocabBoost />);
    expect(screen.getByText('Session Complete!')).toBeInTheDocument();
    expect(screen.getByText('2/2')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Play Again')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows correct/wrong highlights after answering', () => {
    useVocabBoostStore.setState({
      sessionActive: true,
      rounds: sampleRounds,
      currentRound: 0,
      answered: true,
      selectedIndex: 1, // Wrong answer (correct is 0)
    });

    render(<VocabBoost />);
    // Feedback text should appear
    expect(screen.getByText('Hint 1')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('shows topic filter dropdown', () => {
    render(<VocabBoost />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'food' } });
    expect(useVocabBoostStore.getState().topic).toBe('food');
  });
});
