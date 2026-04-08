import React from 'react';
import { render, screen } from '@testing-library/react';
import SessionHistoryChart from '../SessionHistoryChart';

describe('SessionHistoryChart', () => {
  it('renders with session data', () => {
    const sessions = [
      { date: '2026-03-18', score: 80 },
      { date: '2026-03-19', score: 90 },
    ];
    render(<SessionHistoryChart sessions={sessions} />);
    expect(screen.getByTestId('session-history-chart')).toBeInTheDocument();
  });

  it('shows empty state when no sessions', () => {
    render(<SessionHistoryChart sessions={[]} />);
    expect(screen.getByText(/no sessions/i)).toBeInTheDocument();
  });
});
