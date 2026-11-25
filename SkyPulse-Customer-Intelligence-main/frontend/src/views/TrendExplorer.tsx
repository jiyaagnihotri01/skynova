import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, Legend 
} from 'recharts';
import { TrendingUp, Globe, Calendar, Clock, BarChart2 } from 'lucide-react';
import { getTrendAnalytics } from '../services/api';

export function TrendExplorer() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getTrendAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load trend analytics:', err);
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
        <h3 className="text-base font-extrabold text-ba-navy dark:text-white">Failed to Load Trend Analytics</h3>
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
            Time-Series Analytics
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Trend Explorer & Forecasting</h2>
        <p className="text-sm text-slate-200 mt-1 max-w-xl">
          Multi-quarter complaint timelines, sentiment calendars, and country-wise review distributions.
        </p>
      </div>

      {/* Complaint Timeline Stacked Area Chart */}
      <div className="skypulse-glass p-7 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-ba-red" />
              <span>Multi-Quarter Complaint Volume Timeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Baggage, delay, and catering complaint volumes over time</p>
          </div>
        </div>

        <div className="h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.complaint_timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
              <XAxis dataKey="period" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0A192F', borderRadius: '14px', border: 'none', color: '#FFF' }} />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="delays" stackId="1" stroke="#EB2226" fill="#EB2226" fillOpacity={0.6} name="Flight Delays" />
              <Area type="monotone" dataKey="baggage_issues" stackId="1" stroke="#00205B" fill="#00205B" fillOpacity={0.6} name="Baggage Delays" />
              <Area type="monotone" dataKey="catering" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Catering Issues" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sentiment Calendar Breakdown */}
        <div className="skypulse-glass p-7 rounded-3xl space-y-4">
          <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-ba-navy dark:text-sky-400" />
            <span>Monthly Sentiment Calendar</span>
          </h3>
          <p className="text-xs text-slate-400">Positive vs Negative breakdown per month</p>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sentiment_calendar}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0A192F', borderRadius: '14px', border: 'none', color: '#FFF' }} />
                <Bar dataKey="positive" fill="#10B981" radius={[4, 4, 0, 0]} name="Positive" />
                <Bar dataKey="negative" fill="#EB2226" radius={[4, 4, 0, 0]} name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country-wise Reviews Table */}
        <div className="skypulse-glass p-7 rounded-3xl space-y-4">
          <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
            <Globe className="w-5 h-5 text-ba-red" />
            <span>Country-wise Review Distribution</span>
          </h3>
          <p className="text-xs text-slate-400">Passenger feedback origin breakdown</p>

          <div className="space-y-3 pt-2">
            {data.country_reviews?.map((c: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-ba-navy text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-ba-navy dark:text-white">{c.country}</span>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="font-semibold text-slate-500">{c.reviews} reviews</span>
                  <span className="font-extrabold text-ba-navy dark:text-sky-400">CSI {c.avg_csi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
