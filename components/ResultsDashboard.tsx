
import React, { useState } from 'react';
import { PredictionResult, ModelOutput, PatientData } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Cell, ReferenceLine
} from 'recharts';
import { Brain, AlertCircle, CheckCircle, Activity, Info, Download, Search, Star, MessageSquare, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ResultsDashboardProps {
  result: PredictionResult;
  patientData: PatientData;
  onFeedback: (id: string, rating: number, comment: string) => void;
}

const RiskIndicator = ({ risk, level }: { risk: number; level: string }) => {
  let color = 'text-green-600';
  let bgColor = 'bg-green-100';
  let borderColor = 'border-green-200';

  if (level === 'Moderate') { color = 'text-yellow-600'; bgColor = 'bg-yellow-100'; borderColor = 'border-yellow-200'; }
  else if (level === 'High') { color = 'text-orange-600'; bgColor = 'bg-orange-100'; borderColor = 'border-orange-200'; }
  else if (level === 'Very High') { color = 'text-red-600'; bgColor = 'bg-red-100'; borderColor = 'border-red-200'; }

  const data = [{ name: 'Risk', value: risk, fill: level === 'Very High' ? '#DC2626' : level === 'High' ? '#EA580C' : level === 'Moderate' ? '#CA8A04' : '#16A34A' }];

  return (
    <div className={`p-6 rounded-2xl border ${borderColor} ${bgColor} flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[260px]`}>
      <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={120} /></div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2 z-10">Ensemble Risk Score</h3>
      <div className="h-48 w-full z-10 relative">
        <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={20} data={data} startAngle={180} endAngle={0}>
                <RadialBar background dataKey="value" cornerRadius={10} />
                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-5xl font-bold fill-current text-slate-900">{risk}%</text>
                <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className={`text-xl font-medium ${color}`}>{level} Risk</text>
            </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const SafetyStatusCard = ({ status, description }: { status: string; description: string }) => {
    let bg = 'bg-slate-50';
    let border = 'border-slate-200';
    let iconColor = 'text-slate-500';
    let Icon = Info;
    let titleColor = 'text-slate-800';

    if (status === 'Safe') {
        bg = 'bg-emerald-50';
        border = 'border-emerald-200';
        iconColor = 'text-emerald-500';
        Icon = ShieldCheck;
        titleColor = 'text-emerald-800';
    } else if (status === 'Monitor') {
        bg = 'bg-amber-50';
        border = 'border-amber-200';
        iconColor = 'text-amber-500';
        Icon = AlertCircle;
        titleColor = 'text-amber-800';
    } else if (status === 'Critical') {
        bg = 'bg-rose-50';
        border = 'border-rose-200';
        iconColor = 'text-rose-500';
        Icon = ShieldAlert;
        titleColor = 'text-rose-800';
    }

    return (
        <div className={`p-6 rounded-2xl border ${border} ${bg} flex flex-col justify-center h-full`}>
            <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-8 h-8 ${iconColor}`} />
                <div>
                    <h3 className={`text-lg font-bold ${titleColor}`}>Safety Check: {status}</h3>
                </div>
            </div>
            <p className="text-sm text-slate-600 font-medium ml-11">{description}</p>
        </div>
    );
};

const ModelComparisonChart = ({ outputs }: { outputs: ModelOutput[] }) => {
  const data = outputs.map(m => ({
    name: m.type,
    confidence: Math.round(m.confidence * 100),
    prediction: m.prediction,
    color: m.type === 'ANN' ? '#3b82f6' : m.type === 'DNN' ? '#8b5cf6' : '#10b981'
  }));

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
         <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Architecture Comparison (KNN vs DNN vs ANN)
         </h3>
         <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} unit="%" />
                    <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full" style={{background: d.color}}></div>
                                            <p className="font-bold text-slate-800">{d.name}</p>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-1">Confidence: <span className="font-mono font-bold">{d.confidence}%</span></p>
                                        <p className={`text-xs font-bold px-1.5 py-0.5 rounded inline-block ${d.prediction === 'Diabetic' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {d.prediction}
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="confidence" radius={[6, 6, 6, 6]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
         </div>
    </div>
  );
};

const SHAPChart = ({ features }: { features: PredictionResult['featureImportance'] }) => {
    // Sort by absolute value to show most impactful features first
    const sorted = [...features].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 6);

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-500" />
                XAI: Feature Contribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">Positive (Red) increases risk, Negative (Green) decreases risk.</p>
            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }} stackOffset="sign">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="feature" type="category" width={100} tick={{fontSize: 11, fontWeight: 500}} interval={0} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                        <ReferenceLine x={0} stroke="#94a3b8" />
                        <Bar dataKey="value" barSize={20}>
                            {sorted.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#10b981'} radius={[4, 4, 4, 4]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, patientData, onFeedback }) => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleDownload = () => {
    alert("Downloading PDF Report... (Simulation)");
  };

  const submitFeedback = () => {
    onFeedback(result.id, rating, comment);
    setFeedbackSent(true);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
         <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Download Report
         </button>
      </div>

      {/* Top Row: Risk + Safety */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RiskIndicator risk={result.overallRisk} level={result.riskLevel} />
        
        {/* Safety Status Card */}
        <SafetyStatusCard status={result.safetyStatus} description={result.safetyDescription} />

        <SHAPChart features={result.featureImportance} />
      </div>

      {/* Second Row: Model Analysis (List + Graph) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Confidence List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-500" />
                Model Details
             </h3>
             <div className="flex-1 space-y-4 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                {result.modelOutputs.map((model, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-slate-700">{model.type} Model</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${model.prediction === 'Diabetic' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {model.prediction}
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${model.confidence * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500">{model.description}</p>
                    </div>
                ))}
             </div>
        </div>

        {/* Model Comparison Graph */}
        <ModelComparisonChart outputs={result.modelOutputs} />
      </div>

      {/* Analysis & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Clinical Analysis
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-4">{result.analysis}</p>
            <div className="flex flex-wrap gap-2 mt-4">
                {result.keyFactors.map((factor, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs rounded-md border border-red-100 font-medium">
                        {factor}
                    </span>
                ))}
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Action Plan
            </h3>
            <ul className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <div className="mt-1 min-w-[16px] flex justify-center text-green-500 font-bold">•</div>
                        {rec}
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Rate this Prediction
        </h3>
        {!feedbackSent ? (
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-1 w-full">
                    <div className="flex gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`transition-colors ${rating >= star ? 'text-yellow-500' : 'text-slate-300'}`}
                            >
                                <Star className="w-6 h-6 fill-current" />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Was this analysis helpful? Any feedback?"
                        className="w-full p-3 rounded-lg border border-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={2}
                    />
                </div>
                <button
                    onClick={submitFeedback}
                    disabled={rating === 0}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed mt-2 sm:mt-0"
                >
                    Submit
                </button>
            </div>
        ) : (
            <div className="text-green-700 font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Thank you for your feedback!
            </div>
        )}
      </div>
    </div>
  );
};
