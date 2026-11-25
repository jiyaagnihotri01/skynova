import React, { useState, useEffect } from 'react';
import { 
  Users, Utensils, Tv, ClipboardCheck, DoorOpen, Clock, Luggage, 
  Star, Sparkles, AlertCircle, CheckCircle2, ThumbsUp, ThumbsDown 
} from 'lucide-react';
import { getFlightExperience } from '../services/api';
import { FlightTouchpoint } from '../types';

export function FlightExperience() {
  const [loading, setLoading] = useState(true);
  const [touchpoints, setTouchpoints] = useState<FlightTouchpoint[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getFlightExperience();
        setTouchpoints(res.touchpoints || []);
      } catch (err) {
        console.error('Failed to load flight experience touchpoints:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getIcon = (name: string) => {
    if (name.includes('Cabin Crew')) return Users;
    if (name.includes('Food')) return Utensils;
    if (name.includes('Entertainment')) return Tv;
    if (name.includes('Check-in')) return ClipboardCheck;
    if (name.includes('Boarding')) return DoorOpen;
    if (name.includes('Delay') || name.includes('Punctuality')) return Clock;
    return Luggage;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-ba-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl ba-ribbon text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase bg-ba-red text-white rounded-full">
              Touchpoint Intelligence Matrix
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Flight Experience Touchpoints</h2>
          <p className="text-sm text-slate-200 mt-1 max-w-xl">
            Detailed NLP breakdown across 7 critical flight stages with sentiment ratios and Amazon Bedrock touchpoint summaries.
          </p>
        </div>
      </div>

      {/* 7 Flight Touchpoint Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {touchpoints.map((tp) => {
          const Icon = getIcon(tp.name);
          const isPos = tp.sentiment === 'Positive';
          const isNeg = tp.sentiment === 'Negative';
          return (
            <div key={tp.id} className="skypulse-glass p-6 rounded-3xl flex flex-col justify-between space-y-4 group">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-ba-navy/10 dark:bg-slate-800 text-ba-navy dark:text-sky-400 group-hover:bg-ba-red group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-ba-navy dark:text-white">{tp.name}</h3>
                      <span className="text-[11px] text-slate-400 font-semibold">{tp.category}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    isPos ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                    isNeg ? 'bg-rose-500/10 text-ba-red border border-rose-500/20' :
                    'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  }`}>
                    {tp.sentiment}
                  </span>
                </div>

                {/* Rating Bar */}
                <div className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-black text-ba-navy dark:text-white">{tp.rating}</span>
                    <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-bold">
                    <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{tp.positive_pct}%</span>
                    </span>
                    <span className="flex items-center space-x-1 text-ba-red">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{tp.negative_pct}%</span>
                    </span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden flex">
                  <div style={{ width: `${tp.positive_pct}%` }} className="bg-emerald-500 h-full"></div>
                  <div style={{ width: `${100 - tp.positive_pct - tp.negative_pct}%` }} className="bg-amber-400 h-full"></div>
                  <div style={{ width: `${tp.negative_pct}%` }} className="bg-ba-red h-full"></div>
                </div>

                {/* AI Summary */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-ba-red flex items-center space-x-1 tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Touchpoint Intelligence Summary</span>
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {tp.ai_summary}
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
