import { Sun, Moon, FileText, Clock } from 'lucide-react';
import type { DocumentStats } from '../types';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  stats: DocumentStats;
}

export const Header = ({
  darkMode,
  onToggleTheme,
  stats,
}: HeaderProps) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 shadow-sm overflow-hidden shrink-0">
            <img src="/logo.svg" alt="mdToDocs Logo" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-50">
                mdToDocs
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                A4 PDF & DOCX
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Convert Markdown into beautiful documents
            </p>
          </div>
        </div>

        {/* Center / Right Section: Stats & Theme Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {stats.words > 0 && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-medium text-slate-800 dark:text-slate-200">{stats.words.toLocaleString()}</span> words
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{stats.characters.toLocaleString()}</span> chars
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>{stats.readingTimeMinutes} min read</span>
              </span>
            </div>
          )}

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
