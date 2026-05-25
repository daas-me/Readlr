/**
 * Main Application Layout
 * Wrapper component for the entire app
 */

import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="size-full flex flex-col">
      {children}
    </div>
  );
}
