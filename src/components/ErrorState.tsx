import React from 'react';
import { AlertCircle, RefreshCw, Archive, Sparkles } from 'lucide-react';

interface ErrorStateProps {
  errorMessage?: string;
  onTryAgain: () => void;
  onViewCached: () => void;
  hasCachedData: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage,
  onTryAgain,
  onViewCached,
  hasCachedData,
}) => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-md mx-auto text-center rounded-3xl bg-white border border-stone-200/90 p-8 shadow-sm space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-100/70 text-amber-800 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h3 className="font-serif-display text-2xl font-bold text-stone-900">
          Unable to sync memories right now.
        </h3>

        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-sans-body">
          {errorMessage || 'A temporary network interruption prevented fetching the latest media from Google Drive.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onTryAgain}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          {hasCachedData && (
            <button
              onClick={onViewCached}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <Archive className="w-3.5 h-3.5 text-amber-700" />
              <span>View Cached Album</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
