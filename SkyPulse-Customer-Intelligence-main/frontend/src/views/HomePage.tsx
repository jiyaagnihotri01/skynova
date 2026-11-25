import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { 
  Award, Heart, AlertTriangle, CheckCircle2, Target, TrendingUp, 
  MapPin, ShieldAlert, ArrowUpRight, Plane 
} from 'lucide-react';
import { HomeDashboardData } from '../types';

interface HomePageProps {
  data: HomeDashboardData | null;
  loading: boolean;
}

export function HomePage({ data, loading }: HomePageProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 border-4 border-ba-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-ba-navy dark:text-sky-400">Loading SkyPulse Executive Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-ba-red flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-extrabold text-ba-navy dark:text-white">Unable to Load Dashboard Intelligence</h3>
        <p className="text-xs text-slate-500 max-w-md">
          Could not connect to the SkyPulse backend API service. Please verify backend deployment and network connectivity.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl bg-ba-navy text-white text-xs font-bold shadow-lg hover:bg-slate-800 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }


  const kpiCards = [
    {
      title: 'Customer Satisfaction Index',
      value: `${data.csi_index} / 100`,
      subtitle: 'Predictive CSI Score',
      icon: Award,
      badge: '+3.4 vs Last Qtr',
      color: 'text-ba-navy dark:text-sky-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Passenger Happiness',
      value: `${data.passenger_happiness}%`,
      subtitle: 'Positive sentiment ratio',
      icon: Heart,
      badge: 'Target: 40%+',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Critical Complaints',
      value: data.critical_complaints?.toLocaleString() || '0',
      subtitle: 'Identified friction events',
      icon: AlertTriangle,
      badge: 'Baggage & Delays',
      color: 'text-ba-red',
      bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Resolved Issues',
      value: data.resolved_issues?.toLocaleString() || '0',
      subtitle: '72% Resolution Rate',
      icon: CheckCircle2,
      badge: 'Automated Recovery',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'Prediction Accuracy',
      value: `${data.prediction_accuracy}%`,
      subtitle: 'Amazon Comprehend Model',
      icon: Target,
      badge: 'Confidence 0.94',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl ba-ribbon text-white shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase bg-ba-red text-white rounded-full">
                British Airways Management
              </span>
              <span className="text-xs text-slate-300 font-medium">Real-time Passenger Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
              British Airways Customer Intelligence
            </h1>
            <p className="text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
              Transform passenger feedback vectors into high-conviction executive decisions using Amazon Bedrock & Comprehend NLP algorithms.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-2xl font-black">{data.total_reviews?.toLocaleString()}</span>
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Reviews Analyzed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Large KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="skypulse-glass p-5 rounded-3xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-2xl font-black tracking-tight text-ba-navy dark:text-white block">
                  {kpi.value}
                </span>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-slate-400 font-medium">{kpi.subtitle}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {kpi.badge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Large Animated Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Monthly Satisfaction Trend Area Chart */}
        <div className="skypulse-glass p-7 rounded-3xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-ba-red" />
                <span>Monthly Customer Satisfaction Trend</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">CSI Index score progression vs Target Benchmark (65.0)</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-bold">
              <span className="flex items-center space-x-1.5 text-ba-navy dark:text-sky-400">
                <span className="w-3 h-3 rounded-full bg-ba-navy dark:bg-sky-400 inline-block"></span>
                <span>CSI Score</span>
              </span>
              <span className="flex items-center space-x-1.5 text-ba-red">
                <span className="w-3 h-3 rounded-full bg-ba-red inline-block"></span>
                <span>Target</span>
              </span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthly_satisfaction_trend}>
                <defs>
                  <linearGradient id="csiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00205B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00205B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A192F', borderRadius: '16px', color: '#FFF', border: 'none' }}
                />
                <Area type="monotone" dataKey="csi" stroke="#00205B" strokeWidth={3} fillOpacity={1} fill="url(#csiGradient)" name="Actual CSI" />
                <Area type="monotone" dataKey="target" stroke="#EB2226" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Target CSI" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Complaint Regions */}
        <div className="skypulse-glass p-7 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-ba-red" />
              <span>Top Complaint Regions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Geographic distribution of negative reviews</p>
          </div>

          <div className="h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.top_complaint_regions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis dataKey="region" type="category" stroke="#94A3B8" fontSize={11} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#0A192F', borderRadius: '14px', border: 'none', color: '#FFF' }} />
                <Bar dataKey="complaints" fill="#EB2226" radius={[0, 8, 8, 0]} name="Negative Reviews" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Airport-wise Experience Table */}
      <div className="skypulse-glass p-7 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-ba-navy dark:text-sky-400" />
              <span>Airport Hub Performance Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">CSI metrics across British Airways major international gateway airports</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Airport Gateway</th>
                <th className="py-3 px-4">Analyzed Reviews</th>
                <th className="py-3 px-4">Avg CSI Score</th>
                <th className="py-3 px-4">Happiness Rate</th>
                <th className="py-3 px-4 text-right">Status Benchmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {data.airport_experience?.map((apt, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ba-navy dark:text-white flex items-center space-x-2">
                    <Plane className="w-4 h-4 text-ba-red transform -rotate-45" />
                    <span>{apt.airport}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {apt.total_reviews}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-ba-navy dark:text-sky-400">
                    {apt.avg_csi} / 100
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                    {apt.happiness_rate}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      apt.avg_csi >= 60 ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                      apt.avg_csi >= 50 ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                      'bg-rose-500/10 text-ba-red border border-rose-500/20'
                    }`}>
                      {apt.avg_csi >= 60 ? 'Optimal' : apt.avg_csi >= 50 ? 'Moderate' : 'Needs Action'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
