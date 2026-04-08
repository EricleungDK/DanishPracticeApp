import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      className="flex flex-col-reverse md:flex-row h-screen bg-[var(--color-bg-primary)]"
      style={{
        paddingTop: 'var(--safe-area-top, 0px)',
        paddingBottom: 'var(--safe-area-bottom, 0px)',
      }}
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Sidebar />
      <main
        id="main-content"
        className="flex-1 overflow-y-auto px-4 md:px-[5%] py-6 md:py-8"
      >
        {children}
      </main>
    </div>
  );
}
