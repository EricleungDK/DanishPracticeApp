import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

describe('Layout', () => {
  it('renders a skip-to-content link targeting #main-content', () => {
    render(<Layout><div>child</div></Layout>);
    const skipLink = screen.getByText(/skip to content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders main element with id="main-content"', () => {
    render(<Layout><div>child</div></Layout>);
    const main = document.getElementById('main-content');
    expect(main).toBeInTheDocument();
    expect(main?.tagName).toBe('MAIN');
  });

  it('renders children inside main content area', () => {
    render(<Layout><p>test content</p></Layout>);
    expect(screen.getByText('test content')).toBeInTheDocument();
  });
});
