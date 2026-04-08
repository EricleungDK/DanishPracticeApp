import React from 'react';
import { render, screen } from '@testing-library/react';
import SkillRadar from '../SkillRadar';

describe('SkillRadar', () => {
  it('renders without crashing when data provided', () => {
    const data = [
      { type: 'fill_blank', label: 'Fill Blank', accuracy: 80 },
      { type: 'sentence_construction', label: 'Sentence', accuracy: 60 },
      { type: 'reading', label: 'Reading', accuracy: 90 },
      { type: 'listening', label: 'Listening', accuracy: 70 },
    ];
    const { container } = render(<SkillRadar data={data} />);
    expect(container.firstChild).toBeTruthy();
    expect(screen.queryByText(/no data/i)).not.toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<SkillRadar data={[]} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
});
