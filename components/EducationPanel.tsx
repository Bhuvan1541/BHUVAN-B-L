import React from 'react';
import { BookOpen, PieChart, ExternalLink, PlayCircle } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip } from 'recharts';

export const EducationPanel = () => {
  const statsData = [
    { name: 'Diagnosed', value: 28.7, fill: '#3b82f6' },
    { name: 'Undiagnosed', value: 8.5, fill: '#93c5fd' },
    { name: 'Pre-diabetes', value: 96, fill: '#e2e8f0' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Understanding Diabetes & AI Prediction</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    Our Multimodal Neural Network uses a combination of clinical records, imaging, and sensor data to predict diabetes risk.
                    It analyzes complex patterns that traditional methods might miss, such as subtle retinal changes or glucose variability.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-2">Type 2 Diabetes</h3>
                        <p className="text-sm text-slate-700">
                            A chronic condition that affects the way the body processes blood (sugar). 
                            Key risk factors include obesity, inactivity, and genetics.
                        </p>
                    </div>
                     <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <h3 className="font-semibold text-purple-900 mb-2">Why Multimodal AI?</h3>
                        <p className="text-sm text-slate-700">
                            By combining vision (retina scans) with time-series data (wearables) and static clinical data, 
                            accuracy increases by approximately 15% compared to single-model systems.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-red-500" />
                    Latest Research Articles
                </h3>
                <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                            <div className="w-24 h-16 bg-slate-200 rounded-md flex-shrink-0 overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 group-hover:scale-105 transition-transform" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-900 group-hover:text-blue-600">The Role of Deep Learning in Early Detection</h4>
                                <p className="text-xs text-slate-500 mt-1">Published in Journal of Medical AI • 2024</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-emerald-500" />
                    US Statistics (Millions)
                </h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <RePie width={400} height={400}>
                            <Pie
                                data={statsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RePie>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                    {statsData.map(d => (
                        <div key={d.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{background: d.fill}} />
                                {d.name}
                            </div>
                            <span className="font-bold">{d.value}M</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};