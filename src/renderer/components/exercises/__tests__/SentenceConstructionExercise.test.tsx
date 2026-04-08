import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SentenceConstructionExercise from '../SentenceConstructionExercise';
import type { Exercise } from '../../../../shared/types';

const exercise: Exercise = {
  id: '1',
  type: 'sentence_construction',
  difficulty: 'B1',
  topic: 'daily life',
  danish_text: 'Jeg står altid tidligt op.',
  english_text: 'I always get up early.',
  answer_key: { correct_order: ['Jeg', 'står', 'altid', 'tidligt', 'op'], words_given: ['op', 'altid', 'Jeg', 'tidligt', 'står'], accept_also: [] },
  metadata: {},
};

describe('SentenceConstructionExercise', () => {
  it('answer zone has role="listbox"', () => {
    render(<SentenceConstructionExercise exercise={exercise} onSubmit={jest.fn()} disabled={false} />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('clicking a word adds it to answer (role="option")', async () => {
    const user = userEvent.setup();
    render(<SentenceConstructionExercise exercise={exercise} onSubmit={jest.fn()} disabled={false} />);
    await user.click(screen.getByText('Jeg'));
    const options = screen.getAllByRole('option');
    expect(options.some(o => o.textContent === 'Jeg')).toBe(true);
  });
});
