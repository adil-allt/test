import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSidebar } from '../contexts/SidebarContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isExpanded } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isExpanded ? 'ml-64' : 'ml-16'
          } w-full`}
        >
          <div className="h-full p-6">
            <div className="h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}