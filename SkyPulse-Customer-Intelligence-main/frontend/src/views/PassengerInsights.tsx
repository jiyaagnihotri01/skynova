import React, { useState, useEffect } from 'react';
import { 
  Smile, Frown, AlertCircle, Sparkles, Hash, Route, Calendar, ShieldCheck, ArrowRight 
} from 'lucide-react';
import { getPassengerInsights } from '../services/api';
import { Review } from '../types';

export function PassengerInsights() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getPassengerInsights();
        setData(res);
      } catch (err) {
        console.error('Failed to load passenger insights:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-ba-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
        <AlertCircle className="w-8 h-8 text-ba-red" />
        <h3 className="text-base font-extrabold text-ba-navy dark:text-white">Failed to Load Passenger Insights</h3>
        <p className="text-xs text-slate-500">Please verify backend server connection and network status.</p>
      </div>
    );
  }


  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl ba-ribbon text-white shadow-2xl">
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase bg-ba-red text-white rounded-full">
            Passenger Behavioral Analytics
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Passenger Insights & Emotion Journey</h2>
        <p className="text-sm text-slate-200 mt-1 max-w-xl">
          Multi-layer sentiment analysis, emotion detection, and passenger touchpoint journey mapping.
        </p>
      </div>

      {/* Customer Journey Stage Map */}
      <div className="skypulse-glass p-7 rounded-3xl space-y-4">
        <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
          <Route className="w-5 h-5 text-ba-red" />
          <span>Passenger Journey Touchpoint Health Map</span>
        </h3>
        <p className="text-xs text-slate-400">Sentiment index across 5 sequential passenger journey stages</p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          {data.journey_stages?.map((j: any, idx: number) => {
            const isHigh = j.sentiment_score >= 70;
            const isMed = j.sentiment_score >= 55;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Stage {idx + 1}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                    isHigh ? 'bg-emerald-500/10 text-emerald-600' : isMed ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-ba-red'
                  }`}>
                    CSI {j.sentiment_score}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-ba-navy dark:text-white">{j.stage}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Key Friction: <span className="font-semibold text-slate-700 dark:text-slate-300">{j.issues}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Emotion Analysis Breakdown */}
        <div className="skypulse-glass p-7 rounded-3xl space-y-4">
          <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
            <Smile className="w-5 h-5 text-ba-navy dark:text-sky-400" />
            <span>Emotion Analysis Distribution</span>
          </h3>
          <p className="text-xs text-slate-400">NLP emotional tone detection in passenger text</p>

          <div className="space-y-3 pt-2">
            {data.emotion_analysis?.map((e: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-ba-navy dark:bg-sky-400"></div>
                  <span className="text-xs font-bold text-ba-navy dark:text-white">{e.emotion}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300">{e.count} reviews</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {e.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyword Extraction */}
        <div className="skypulse-glass p-7 rounded-3xl lg:col-span-2 space-y-4">
          <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
            <Hash className="w-5 h-5 text-ba-red" />
            <span>Keyword & Topic Extraction</span>
          </h3>
          <p className="text-xs text-slate-400">Recurrent phrases mined from British Airways corpus</p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {data.keywords?.map((k: any, idx: number) => (
              <div
                key={idx}
                className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-2 text-xs font-bold text-ba-navy dark:text-white hover:border-ba-red transition-all cursor-pointer"
              >
                <span>#{k.keyword}</span>
                <span className="px-2 py-0.5 rounded-lg bg-ba-navy dark:bg-slate-900 text-white text-[10px] font-mono">
                  {k.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Review Timeline Cards */}
      <div className="skypulse-glass p-7 rounded-3xl space-y-6">
        <h3 className="text-lg font-extrabold text-ba-navy dark:text-white">Passenger Review Timeline</h3>
        
        <div className="space-y-4">
          {data.recent_insights?.slice(0, 5).map((rev: Review) => {
            const isPos = rev.sentiment === 'Positive';
            const isNeg = rev.sentiment === 'Negative';
            return (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-2 hover:border-ba-red transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase ${
                      isPos ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                      isNeg ? 'bg-rose-500/10 text-ba-red border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {rev.sentiment}
                    </span>
                    <span className="text-xs font-bold text-ba-navy dark:text-white">{rev.title}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span>{rev.date}</span>
                    <span className="font-bold text-ba-navy dark:text-sky-400">CSI {rev.csi_score}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{rev.text}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
