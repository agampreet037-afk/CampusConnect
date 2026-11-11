import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let colorClasses = 'bg-slate-900 text-white border-slate-800';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          colorClasses = 'bg-emerald-950 text-emerald-100 border-emerald-800/80 shadow-emerald-950/20';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClasses = 'bg-amber-950 text-amber-100 border-amber-800/80 shadow-amber-950/20';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'bg-rose-950 text-rose-100 border-rose-800/80 shadow-rose-950/20';
        } else {
          Icon = Info;
          colorClasses = 'bg-indigo-950 text-indigo-100 border-indigo-800/80 shadow-indigo-950/20';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${colorClasses}`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 shrink-0 opacity-90" />
              <p className="text-sm font-medium leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2 shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
