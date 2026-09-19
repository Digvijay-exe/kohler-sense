import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastMessage } from '../../types';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#c29b38] shrink-0" />;
      case 'error':
        return <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-sky-500 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40';
      case 'warning':
        return 'border-[#c29b38]/60';
      case 'error':
        return 'border-rose-500/50';
      default:
        return 'border-sky-500/40';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`pointer-events-auto relative overflow-hidden bg-white/95 dark:bg-[#151516]/95 backdrop-blur-md rounded-xl p-3.5 shadow-xl border ${getBorderColor()} text-zinc-900 dark:text-white`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5">{getIcon()}</div>
          <div>
            <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
            {toast.description && (
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug">
                {toast.description}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 rounded-md cursor-pointer transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Auto-dismiss progress bar animation */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-0.5 bg-[#c29b38]"
      />
    </motion.div>
  );
};
