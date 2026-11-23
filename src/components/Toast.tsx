import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast = ({ toasts, onDismiss }: ToastProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/30 dark:bg-slate-900 dark:border-emerald-500/40'
                : isError
                ? 'bg-slate-900 text-rose-400 border-rose-500/30 dark:bg-slate-900 dark:border-rose-500/40'
                : 'bg-slate-900 text-blue-400 border-blue-500/30 dark:bg-slate-900 dark:border-blue-500/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />}
              {isError && <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 shrink-0 text-blue-500" />}
              <span className="text-slate-100">{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
