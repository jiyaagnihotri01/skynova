import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, Send, Sparkles, User, Bot, HelpCircle, RefreshCw, FileText, 
  CheckCircle2, AlertTriangle, Lightbulb, TrendingUp 
} from 'lucide-react';
import { postAdvisorChat, generateExecutiveReport } from '../services/api';
import { ChatMessage, ExecutiveReportData } from '../types';

export function AIAdvisor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Good day. I am SkyPulse AI Executive Advisor powered by Amazon Bedrock. Ask me strategic questions about British Airways passenger dissatisfaction drivers, touchpoint friction, or operational interventions.',
      source: 'Amazon Bedrock'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState<ExecutiveReportData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What should British Airways improve?',
    'Why are customers unhappy?',
    'Generate Executive Report',
    'Summarize all complaints',
    'Predict future satisfaction'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    if (q === 'Generate Executive Report') {
      handleGenerateReport();
      return;
    }

    const userMsg: ChatMessage = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await postAdvisorChat(q);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.answer,
          source: res.source
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Error connecting to Amazon Bedrock AI Advisor service.',
          source: 'System Error'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const res = await generateExecutiveReport();
      setReport(res);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl ba-ribbon text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase bg-ba-red text-white rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Amazon Bedrock Generative Advisor</span>
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">AI Advisor & Executive Support</h2>
          <p className="text-sm text-slate-200 mt-1 max-w-xl">
            Ask complex operational questions, simulate CSI lift scenarios, and synthesize C-Suite executive reports.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={reportLoading}
          className="px-5 py-3 rounded-2xl bg-white text-ba-navy hover:bg-ba-red hover:text-white font-extrabold text-xs shadow-xl transition-all flex items-center space-x-2 shrink-0"
        >
          <FileText className={`w-4 h-4 ${reportLoading ? 'animate-spin' : ''}`} />
          <span>{reportLoading ? 'Generating Report...' : 'Generate Executive Report'}</span>
        </button>
      </div>

      {/* Generated Report View (if present) */}
      {report && (
        <div className="skypulse-glass p-8 rounded-3xl space-y-6 border-l-4 border-l-ba-red">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-ba-navy dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-ba-red" />
              <span>Executive Advisory Report</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400">Source: {report.source}</span>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans bg-slate-100/70 dark:bg-slate-800/60 p-4 rounded-2xl">
            {report.executive_summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-ba-red flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Operational Pain Points</span>
              </h4>
              {report.top_issues?.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>High-Priority Immediate Actions</span>
              </h4>
              {report.immediate_actions?.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggested Questions Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center space-x-1">
          <HelpCircle className="w-4 h-4 text-ba-red" />
          <span>Suggested Questions:</span>
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="px-3.5 py-2 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-ba-navy dark:text-slate-200 hover:border-ba-red hover:text-ba-red whitespace-nowrap transition-all shadow-sm shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* ChatGPT-style Interface */}
      <div className="skypulse-glass rounded-3xl p-6 flex flex-col h-[560px]">
        
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-ba-navy text-white shadow-lg shadow-ba-navy/20'
                      : 'bg-ba-red text-white shadow-lg shadow-ba-red/20'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-ba-navy to-slate-900 text-white font-medium rounded-tr-none'
                      : 'bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none space-y-1'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {!isUser && msg.source && (
                    <span className="text-[10px] font-mono text-slate-400 block pt-1 border-t border-slate-200 dark:border-slate-700">
                      Engine: {msg.source}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-ba-red text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-ba-red" />
                <span>Amazon Bedrock is synthesizing intelligence...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Bedrock AI Advisor about British Airways complaints, food scores, flight delays..."
            className="flex-1 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-ba-red transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3.5 rounded-2xl bg-ba-red hover:bg-ba-darkred text-white font-extrabold text-xs shadow-lg shadow-ba-red/25 disabled:opacity-50 flex items-center space-x-2 shrink-0 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>

      </div>

    </div>
  );
}
