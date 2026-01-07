
import React from 'react';
import { LayoutDashboard, Activity, History, BookOpen, Settings, LogOut, ShieldCheck, User } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userRole: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Predictor', icon: Activity },
    { id: 'history', label: 'Patient History', icon: History },
    { id: 'education', label: 'Resources', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-600 p-1.5 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">NeuroDiab</span>
        </div>
        <p className="text-xs text-slate-400 pl-11">v2.5 Multimodal</p>
      </div>

      <div className="p-4 flex items-center gap-3 bg-slate-800 mx-4 mt-4 rounded-lg">
         <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            {userRole === 'Doctor' ? 'DR' : 'PT'}
         </div>
         <div>
             <p className="text-sm font-medium">{userRole === 'Doctor' ? 'Dr. Devaa' : 'Jane Doe'}</p>
             <p className="text-xs text-slate-400">{userRole}</p>
         </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
         <div className="mb-4 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-900/30 p-2 rounded border border-emerald-900">
            <ShieldCheck className="w-3 h-3" />
            <span>HIPAA Compliant Env</span>
         </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
