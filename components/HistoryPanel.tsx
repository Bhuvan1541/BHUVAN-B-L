
import React from 'react';
import { PredictionResult } from '../types';
import { Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HistoryPanelProps {
  history: PredictionResult[];
  onViewDetail: (result: PredictionResult) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onViewDetail }) => {
  if (history.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">No History Available</h3>
              <p className="text-slate-500 text-sm">Run your first prediction to see it tracked here.</p>
          </div>
      );
  }

  // Sort history for the chart (oldest first)
  const chartData = [...history]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(h => ({
        date: new Date(h.timestamp).toLocaleDateString(),
        risk: h.overallRisk,
        id: h.id
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Patient History & Progress</h2>
      </div>

      {/* Progress Chart */}
      {history.length > 1 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Risk Score Progression
              </h3>
              <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" />
                          <YAxis domain={[0, 100]} fontSize={12} stroke="#94a3b8" unit="%" />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Area type="monotone" dataKey="risk" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {history.map((record) => (
            <div key={record.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm text-slate-500 font-mono">{new Date(record.timestamp).toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold 
                            ${record.riskLevel === 'Low' ? 'bg-green-100 text-green-700' : 
                            record.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {record.riskLevel} Risk
                        </span>
                        {record.feedback && (
                             <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium border border-indigo-100">
                                Rated ★ {record.feedback.rating}
                             </span>
                        )}
                    </div>
                    <p className="text-slate-800 font-medium text-sm line-clamp-1">{record.analysis.substring(0, 100)}...</p>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <div className="text-2xl font-bold text-slate-900">{record.overallRisk}%</div>
                        <div className="text-xs text-slate-500">Risk Score</div>
                    </div>
                    <button 
                        onClick={() => onViewDetail(record)}
                        className="p-2 bg-slate-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
