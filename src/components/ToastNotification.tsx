import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-stone-900/95 text-white shadow-xl backdrop-blur-md border border-stone-800 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
        <Check className="w-3.5 h-3.5" />
      </div>
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-stone-400 hover:text-white cursor-pointer text-xs"
      >
        ✕
      </button>
    </div>
  );
};
