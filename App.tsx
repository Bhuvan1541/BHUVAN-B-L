
import React, { useState } from 'react';
import { PatientData, DEFAULT_PATIENT_DATA, PredictionResult } from './types';
import { PatientForm } from './components/PatientForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { Sidebar } from './components/Sidebar';
import { AuthLogin } from './components/AuthLogin';
import { EducationPanel } from './components/EducationPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { analyzeDiabetesRisk } from './services/geminiService';
import { LayoutGrid, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'Doctor' | 'Patient'>('Doctor');

  // App State
  const [currentView, setCurrentView] = useState('dashboard');
  const [patientData, setPatientData] = useState<PatientData>(DEFAULT_PATIENT_DATA);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (role: 'Doctor' | 'Patient') => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setResult(null);
    setHistory([]);
    setCurrentView('dashboard');
  };

  const handleInputChange = (key: keyof PatientData, value: any) => {
    setPatientData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeDiabetesRisk(patientData);
      setResult(data);
      setHistory(prev => [data, ...prev]);
      setCurrentView('dashboard'); // Ensure we see result
    } catch (err: any) {
      console.error("Analysis Error:", err);
      let errorMessage = "Failed to analyze data.";
      if (err.message.includes("API Key")) {
        errorMessage = "API Key is missing. Please configuration your environment.";
      } else if (err.message.includes("No data")) {
        errorMessage = "The AI model did not return a valid response. Please try again.";
      } else if (err.message.includes("JSON")) {
          errorMessage = "Data parsing error. The model response was malformed. Please try again.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistoryDetail = (record: PredictionResult) => {
    setResult(record);
    setCurrentView('dashboard');
  };

  const handleFeedback = (id: string, rating: number, comment: string) => {
    // Update local state history with feedback
    setHistory(prev => prev.map(item => 
        item.id === id 
        ? { ...item, feedback: { rating, comment, timestamp: new Date().toISOString() } } 
        : item
    ));
    // If currently viewing this result, update it too
    if (result && result.id === id) {
        setResult(prev => prev ? { ...prev, feedback: { rating, comment, timestamp: new Date().toISOString() } } : null);
    }
  };

  if (!isAuthenticated) {
    return <AuthLogin onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onLogout={handleLogout}
        userRole={userRole}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
            
            {/* Dashboard View */}
            {currentView === 'dashboard' && (
                <>
                    {!result && (
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900">New Prediction</h2>
                            <p className="text-slate-600 mt-2">
                                Configure the multimodal inputs below. The ensemble network will process clinical data, lifestyle factors, sensor metrics, and imaging simultaneously.
                            </p>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Input Form Section (Hidden if result shows, optional toggle could be added) */}
                        <section className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-500 ${result ? 'hidden' : 'block'}`}>
                           <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                                <LayoutGrid className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-slate-800">Multimodal Data Entry</h3>
                           </div>
                           
                           <PatientForm 
                              data={patientData} 
                              onChange={handleInputChange} 
                              onSubmit={handleAnalysis}
                              isLoading={loading}
                              onBulkChange={setPatientData}
                           />
                        </section>

                        {error && (
                          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center justify-between gap-4 animate-fade-in">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                            <button 
                                onClick={handleAnalysis}
                                className="flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-bold transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" /> Retry
                            </button>
                          </div>
                        )}

                        {/* Results Section */}
                        {result && (
                          <section className="animate-fade-in">
                             <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">Prediction Analysis</h2>
                                    <p className="text-slate-500 text-sm mt-1">
                                        ID: {result.id} • {new Date(result.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <button 
                                  onClick={() => setResult(null)}
                                  className="text-sm bg-white border border-slate-300 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                                >
                                  Start New Analysis
                                </button>
                             </div>
                             <ResultsDashboard 
                                result={result} 
                                patientData={patientData} 
                                onFeedback={handleFeedback}
                             />
                          </section>
                        )}
                    </div>
                </>
            )}

            {/* History View */}
            {currentView === 'history' && (
                <HistoryPanel history={history} onViewDetail={handleViewHistoryDetail} />
            )}

            {/* Education View */}
            {currentView === 'education' && (
                <EducationPanel />
            )}

             {/* Settings View */}
             {currentView === 'settings' && (
                <SettingsPanel userRole={userRole} />
            )}
        </div>
      </main>
    </div>
  );
}
