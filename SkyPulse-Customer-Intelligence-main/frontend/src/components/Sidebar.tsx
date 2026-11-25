import React from 'react';
import { Home, Plane, Users, Brain, TrendingUp, FileText, Settings, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'experience', label: 'Flight Experience', icon: Plane },
    { id: 'insights', label: 'Passenger Insights', icon: Users },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Brain, badge: 'Bedrock' },
    { id: 'trends', label: 'Trend Explorer', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 shadow-xl shadow-slate-200/30 dark:shadow-none z-40 transition-colors">
      
      <div>
        {/* Brand Header with British Airways Speedmark ribbon */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-ba-navy to-slate-900 p-0.5 flex items-center justify-center shadow-lg shadow-ba-navy/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-4 h-4 bg-ba-red rounded-bl-lg"></div>
              <div className="w-full h-full bg-ba-navy rounded-[14px] flex items-center justify-center">
                <Plane className="w-6 h-6 text-white transform -rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-ba-navy dark:text-white font-sans">
                  SkyPulse
                </span>
                <span className="text-xl font-extrabold text-ba-red">AI</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                British Airways
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-ba-navy to-slate-900 text-white shadow-lg shadow-ba-navy/20 translate-x-1'
                    : 'text-slate-600 dark:text-slate-400 hover:text-ba-navy dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-ba-red' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full tracking-wider ${
                    isActive ? 'bg-ba-red text-white' : 'bg-slate-100 dark:bg-slate-800 text-ba-navy dark:text-sky-400 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Badge */}
      <div className="p-4 m-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
        <div>
          <span className="text-[11px] font-bold text-ba-navy dark:text-white block">C-Suite Intelligence</span>
          <span className="text-[10px] text-slate-400 font-medium">Enterprise AWS Bedrock</span>
        </div>
      </div>

    </aside>
  );
}
