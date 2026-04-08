import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../App';
import { useAppStore } from '../store/useAppStore';

beforeEach(() => {
  useAppStore.setState({
    currentPage: 'dashboard',
    stats: { totalReviewed: 0, accuracy: 0, streak: 0, dueCount: 0 },
    sessionExercises: [],
    sessionComplete: false,
    currentIndex: 0,
    theme: 'light',
  });
  jest.clearAllMocks();
});

describe('App', () => {
  it('renders Dashboard by default', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Velkommen!')).toBeInTheDocument();
  });

  it('renders Settings when currentPage is settings', async () => {
    useAppStore.setState({ currentPage: 'settings' });
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  it('calls loadTheme on mount', async () => {
    const spy = jest.spyOn(useAppStore.getState(), 'loadTheme');
    await act(async () => {
      render(<App />);
    });
    expect(window.api.getSetting).toHaveBeenCalledWith('theme');
  });
});
