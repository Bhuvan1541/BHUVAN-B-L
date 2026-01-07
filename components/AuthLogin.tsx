
import React, { useState } from 'react';
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, Brain, Stethoscope, UserCircle } from 'lucide-react';

interface AuthLoginProps {
  onLogin: (role: 'Doctor' | 'Patient') => void;
}

export const AuthLogin: React.FC<AuthLoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'Doctor' | 'Patient'>('Doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call authentication delay
    setTimeout(() => {
        onLogin(role);
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      {/* Left Panel - Brand & Visuals */}
      <div className="lg:w-1/2 bg-slate-900 relative flex flex-col justify-between p-8 lg:p-16 overflow-hidden min-h-[400px] lg:min-h-screen">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1631563019676-407164b50861?q=80&w=2070&auto=format&fit=crop" 
                alt="Medical AI DNA Background" 
                className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/80 to-slate-900/80 mix-blend-multiply"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
        </div>

        <div className="relative z-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-lg">
                    <Activity className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-3xl font-bold text-white tracking-tight">NeuroDiab</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-6 tracking-tight drop-shadow-md">
                Precision Health <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Powered by AI</span>
            </h2>
            <p className="text-slate-200 text-lg max-w-md leading-relaxed drop-shadow-sm">
                Experience the next generation of diabetes prediction. Our multimodal neural network analyzes clinical data and imaging in real-time.
            </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 hidden lg:grid mt-12 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-start gap-4 text-slate-100 bg-black/20 p-5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-black/30 transition-colors">
                <div className="p-2.5 bg-emerald-500/20 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <p className="font-semibold text-white text-lg">HIPAA Compliant</p>
                    <p className="text-sm text-slate-300 mt-1">Enterprise-grade encryption for all patient data.</p>
                </div>
            </div>
            <div className="flex items-start gap-4 text-slate-100 bg-black/20 p-5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-black/30 transition-colors">
                 <div className="p-2.5 bg-blue-500/20 rounded-xl">
                    <Brain className="w-6 h-6 text-blue-400" />
                </div>
                 <div>
                    <p className="font-semibold text-white text-lg">98.7% Accuracy</p>
                    <p className="text-sm text-slate-300 mt-1">Validated ensemble models powered by Gemini.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-slate-50 relative">
        <div className="w-full max-w-md animate-fade-in-up relative z-10">
            <div className="text-center lg:text-left mb-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h3>
                <p className="text-slate-500">Sign in to access the prediction dashboard.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white ring-1 ring-slate-100">
                {/* Role Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-8">
                    <button 
                        type="button"
                        onClick={() => setRole('Doctor')}
                        className={`flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                            role === 'Doctor' 
                            ? 'bg-white text-blue-700 shadow-md ring-1 ring-black/5 transform scale-[1.02]' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        <Stethoscope className="w-4 h-4" />
                        Medical Staff
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRole('Patient')}
                        className={`flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                            role === 'Patient' 
                            ? 'bg-white text-blue-700 shadow-md ring-1 ring-black/5 transform scale-[1.02]' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        <UserCircle className="w-4 h-4" />
                        Patient
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 bg-slate-100 rounded-md group-focus-within:bg-blue-50 transition-colors">
                                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                            </div>
                            <input 
                                type="email" 
                                required
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                placeholder={role === 'Doctor' ? "dr.devaa@neurodiab.com" : "patient@email.com"}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                            <button type="button" onClick={() => alert("Simulated: Check your email for a reset link.")} className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot password?</button>
                        </div>
                        <div className="relative group">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 bg-slate-100 rounded-md group-focus-within:bg-blue-50 transition-colors">
                                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                            </div>
                            <input 
                                type="password" 
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            <>Sign In <ArrowRight className="w-5 h-5" /></>
                        )}
                    </button>
                </form>
            </div>
            
            <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                By signing in, you agree to our Terms of Service. <br/>
                Protected by reCAPTCHA and the Google Privacy Policy.
            </p>
        </div>
      </div>
    </div>
  );
};
