import React from 'react';
import { X, AlertCircle, CheckCircle2, Info, Sparkles } from 'lucide-react';

export function NotificationDrawer({ onClose }: { onClose: () => void }) {
  const notifications = [
    {
      id: '1',
      type: 'warning',
      title: 'Baggage Wait Time Alert',
      message: 'LHR Terminal 5 baggage retrieval delays exceeded 90 mins threshold on flight BA246.',
      time: '12 mins ago'
    },
    {
      id: '2',
      type: 'info',
      title: 'Amazon Bedrock Advisory Ready',
      message: 'Executive Q3 Customer Satisfaction Index forecasting report completed.',
      time: '45 mins ago'
    },
    {
      id: '3',
      type: 'success',
      title: 'NLP Batch Dataset Processed',
      message: '1,300+ British Airways passenger feedback records synced to DynamoDB.',
      time: '2 hours ago'
    }
  ];

  return (
    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-fadeIn">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-ba-red" />
          <span className="text-xs font-bold text-ba-navy dark:text-white">Executive Notifications</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 mt-3">
        {notifications.map((n) => (
          <div key={n.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
              <span className="truncate">{n.title}</span>
              <span className="text-[10px] text-slate-400 font-normal shrink-0">{n.time}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
