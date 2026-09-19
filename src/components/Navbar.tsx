import React from 'react';
import { 
  Zap,
  Moon,
  Sun,
  Activity,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111111]/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand: Kohler Signature Bold Aesthetics */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-zinc-900 flex items-center justify-center text-white font-black text-xl tracking-wider shadow-sm border border-zinc-800 dark:border-amber-500/40 relative overflow-hidden group">
              <span className="font-serif font-black tracking-widest text-white">K</span>
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#c29b38]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-black dark:text-white tracking-wider text-lg uppercase font-sans">
                  KOHLER <span className="text-[#c29b38] font-semibold">SENSE</span>
                </span>
                <span className="hidden sm:inline-flex bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Operational
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden xs:block">
                Commercial Smart Facility & Sustainability Intelligence
              </p>
            </div>
          </div>

          {/* Right Status & Controls */}
          <div className="flex items-center space-x-3">
            {/* Real-time telemetry status badge with Kohler Hydro Blue & Brass accents */}
            <div className="hidden md:flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300">
              <Activity className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
              <span className="font-mono font-medium">IoT Ingestion: 1000ms</span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-[#c29b38] dark:text-[#d4af37] font-semibold font-mono">SLA &lt; 90s</span>
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#c29b38]"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-[#c29b38]" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-zinc-800" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
