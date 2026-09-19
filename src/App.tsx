import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PrototypeContainer } from './components/prototype/PrototypeContainer';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kohler-sense-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('kohler-sense-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('kohler-sense-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-zinc-100/70 dark:bg-[#0f0f10] text-zinc-900 dark:text-zinc-100 font-sans flex flex-col transition-colors duration-200">
      <Navbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="flex-1">
        <PrototypeContainer isDarkMode={isDarkMode} />
      </main>

      <footer className="bg-white dark:bg-[#111111] border-t border-zinc-200 dark:border-zinc-800 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-black dark:text-white uppercase tracking-wider font-sans">KOHLER <span className="text-[#c29b38]">SENSE</span></span>
            <span>•</span>
            <span>Commercial Smart Facility Operations</span>
            <span>•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Real-Time IoT Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#c29b38]" />
            <span>KOHLER-MITWPU AI Research Lab Program • Track 2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

