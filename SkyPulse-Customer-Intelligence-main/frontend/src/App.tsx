import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './views/HomePage';
import { FlightExperience } from './views/FlightExperience';
import { PassengerInsights } from './views/PassengerInsights';
import { AIAdvisor } from './views/AIAdvisor';
import { TrendExplorer } from './views/TrendExplorer';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { getHealth, getHomeDashboard } from './services/api';
import { HomeDashboardData } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [awsMode, setAwsMode] = useState<string>('Standalone (Local Fallback)');
  const [homeData, setHomeData] = useState<HomeDashboardData | null>(null);
  const [loadingHome, setLoadingHome] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const h = await getHealth();
      setAwsMode(h.aws_mode || 'Standalone Mode');
    } catch (e) {
      setAwsMode('Offline Mode');
    }

    try {
      setLoadingHome(true);
      const data = await getHomeDashboard();
      setHomeData(data);
    } catch (e) {
      console.error('Failed to load home dashboard:', e);
    } finally {
      setLoadingHome(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex transition-colors`}>
      
      {/* 7-Tab Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header
          awsMode={awsMode}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* View Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {activeTab === 'home' && (
            <HomePage data={homeData} loading={loadingHome} />
          )}

          {activeTab === 'experience' && (
            <FlightExperience />
          )}

          {activeTab === 'insights' && (
            <PassengerInsights />
          )}

          {activeTab === 'ai-advisor' && (
            <AIAdvisor />
          )}

          {activeTab === 'trends' && (
            <TrendExplorer />
          )}

          {activeTab === 'reports' && (
            <ReportsView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

        </main>

        {/* Enterprise Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-8 bg-white/50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-ba-navy dark:text-white">SkyPulse AI</span>
              <span>&bull;</span>
              <span>British Airways Customer Intelligence Platform</span>
            </div>
            <div className="mt-2 sm:mt-0 font-mono text-[11px]">
              Powered by Amazon Bedrock & Comprehend
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
