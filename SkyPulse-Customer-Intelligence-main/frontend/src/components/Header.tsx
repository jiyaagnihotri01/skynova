import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Sparkles, Filter } from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

interface HeaderProps {
  awsMode: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Header({ awsMode, isDarkMode, toggleDarkMode, searchQuery, setSearchQuery }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search passenger feedback, Touchpoints, CSI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-ba-red dark:focus:border-ba-red transition-all"
          />
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center space-x-4">
          
          {/* AWS Status Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-ba-red" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">AWS Engine:</span>
            <span className="font-bold text-ba-navy dark:text-sky-400">{awsMode || 'Connecting...'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-ba-navy dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-ba-navy" />}
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-ba-navy dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ba-red"></span>
            </button>

            {showNotifications && (
              <NotificationDrawer onClose={() => setShowNotifications(false)} />
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
