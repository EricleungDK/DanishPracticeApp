import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      className="flex flex-col-reverse md:flex-row bg-[var(--color-bg-primary)]"
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        boxSizing: 'border-box',
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
