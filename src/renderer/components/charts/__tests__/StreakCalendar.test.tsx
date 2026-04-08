import React from 'react';
import { render, screen } from '@testing-library/react';
import StreakCalendar from '../StreakCalendar';

describe('StreakCalendar', () => {
  it('renders 84 day cells (12 weeks)', () => {
    render(<StreakCalendar dailyActivity={{}} />);
    const cells = screen.getAllByTestId('streak-cell');
    expect(cells).toHaveLength(84);
  });

  it('applies intensity class based on activity count', () => {
    const today = new Date().toISOString().split('T')[0];
    render(<StreakCalendar dailyActivity={{ [today]: 5 }} />);
    const cells = screen.getAllByTestId('streak-cell');
    const activeCell = cells.find(c => c.getAttribute('data-count') === '5');
    expect(activeCell).toBeTruthy();
  });

  it('handles empty data gracefully', () => {
    render(<StreakCalendar dailyActivity={{}} />);
    expect(screen.getAllByTestId('streak-cell')).toHaveLength(84);
  });
});
