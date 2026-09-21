import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-3">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start space-x-3 transition-all transform duration-200 animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-700/80 shadow-emerald-950/50'
                : isError
                ? 'bg-rose-950/95 text-rose-100 border-rose-700/80 shadow-rose-950/50'
                : 'bg-slate-900/95 text-slate-100 border-slate-700 shadow-slate-950/50'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertTriangle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-teal-400" />}
            </div>

            <div className="flex-1 text-xs sm:text-sm">
              {toast.title && <div className="font-bold mb-0.5">{toast.title}</div>}
              <div className="leading-snug opacity-90">{toast.message}</div>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
