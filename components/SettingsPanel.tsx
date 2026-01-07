
import React, { useState } from 'react';
import { User, Bell, Shield, Activity, Save, Moon, Smartphone, Mail, Lock, Sliders, Check, Globe, Link, Database, Download, Trash2, Cloud, Server, FileCode, BarChart } from 'lucide-react';

interface SettingsPanelProps {
  userRole: 'Doctor' | 'Patient';
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ userRole }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(userRole === 'Doctor' ? 'Dr. Devaa' : 'Jane Doe');
  const [email, setEmail] = useState(userRole === 'Doctor' ? 'dr.devaa@neurodiab.com' : 'jane.doe@email.com');
  
  // New Preferences State
  const [units, setUnits] = useState('mg/dL');
  const [language, setLanguage] = useState('English (US)');
  
  // New Integrations State
  const [integrations, setIntegrations] = useState({
    epicEhr: userRole === 'Doctor'
  });

  const [aiConfig, setAiConfig] = useState({
    sensitivity: 50,
    enableExperimental: false
  });

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API save
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Settings & Admin</h2>
            <p className="text-slate-500 text-sm mt-1">Manage profile, integrations, and multimodal configurations.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all shadow-md ${
            showSuccess 
              ? 'bg-green-600 text-white' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : showSuccess ? (
            <>
              <Check className="w-4 h-4" /> Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile, Preferences, Integrations */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Account Profile
            </h3>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                <span className="text-2xl font-bold text-slate-400">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm flex justify-between items-center">
                    <span>{userRole}</span>
                    <Lock className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regional & Preferences */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-500" />
              Regional & Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Glucose Units</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {['mg/dL', 'mmol/L'].map((u) => (
                            <button
                                key={u}
                                onClick={() => setUnits(u)}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${units === u ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {u}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                        <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
                        >
                        <option>English (US)</option>
                        <option>Spanish (Español)</option>
                        <option>French (Français)</option>
                        <option>German (Deutsch)</option>
                        </select>
                </div>
            </div>
          </div>

          {/* Connected Integrations */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Link className="w-5 h-5 text-orange-500" />
                Connected Integrations
            </h3>
            <div className="space-y-4">
                {/* Epic EHR */}
                <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">EPIC</div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">Epic Systems (EHR)</p>
                            <p className="text-xs text-slate-500">Sync patient clinical records</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIntegrations({...integrations, epicEhr: !integrations.epicEhr})}
                        className={`text-xs font-medium px-4 py-1.5 rounded-full transition-colors border ${integrations.epicEhr ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                        {integrations.epicEhr ? 'Connected' : 'Connect'}
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column - AI Config, Data Management, Admin Panel */}
        <div className="space-y-6">
            {/* AI Configuration (Doctor Only) */}
            {userRole === 'Doctor' && (
                <>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Cloud size={100} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-indigo-500" />
                        Model Configuration
                        </h3>
                        
                        <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700">Risk Threshold Sensitivity</label>
                                <span className="text-sm font-bold text-indigo-600">{aiConfig.sensitivity}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="99" 
                                value={aiConfig.sensitivity}
                                onChange={(e) => setAiConfig({...aiConfig, sensitivity: Number(e.target.value)})}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Adjusting this lowers the confidence score required to classify a patient as "High Risk".
                            </p>
                        </div>

                        <div className="flex items-center justify-between py-3 border-t border-slate-100">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Experimental Models (ViT-Pro)</p>
                                <p className="text-xs text-slate-500">Enable beta features for retinal scan analysis.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={aiConfig.enableExperimental}
                                onChange={(e) => setAiConfig({...aiConfig, enableExperimental: e.target.checked})}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        </div>
                    </div>

                    {/* Admin Dashboard Features (Simulated) */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart size={100} /></div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 relative z-10">
                            <Server className="w-5 h-5 text-emerald-400" />
                            Admin Console
                        </h3>
                        <div className="space-y-4 relative z-10">
                            <div className="bg-white/10 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Model Accuracy</p>
                                    <p className="text-xl font-bold text-white">98.7%</p>
                                </div>
                                <div className="text-right">
                                     <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Last Retrain</p>
                                     <p className="text-sm text-white">2h ago</p>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition-colors">
                                <FileCode className="w-3 h-3" /> Upload Training Dataset
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold transition-colors">
                                View System Logs
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Data Management */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-slate-500" />
                    Data Management
                 </h3>
                 <div className="space-y-4">
                     <button className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                         <div>
                             <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Export Medical Records</p>
                             <p className="text-xs text-slate-500">Download all history as PDF/CSV</p>
                         </div>
                         <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                     </button>
                     
                     <button className="w-full flex items-center justify-between p-3 border border-red-100 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left group">
                         <div>
                             <p className="text-sm font-medium text-red-700">Delete Account</p>
                             <p className="text-xs text-red-500">Permanently remove all data</p>
                         </div>
                         <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                     </button>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
