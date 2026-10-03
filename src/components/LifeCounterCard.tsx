import React from 'react';
import { Heart } from 'lucide-react';
import { LifeCounterData } from '../hooks/useLifeCounter';

interface LifeCounterCardProps {
  lifeCounter: LifeCounterData;
  totalMemories: number;
}

export const LifeCounterCard: React.FC<LifeCounterCardProps> = ({
  lifeCounter,
  totalMemories,
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-600/30" />
            <span>Cherished Milestones Counter</span>
          </div>
          <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Journey of Our Togetherness
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Tracking time since our special milestone: <strong className="text-stone-700 dark:text-stone-300">{lifeCounter.formattedTargetDate}</strong>
          </p>
        </div>
      </div>

      {/* Live Second-by-Second Counter Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 text-center transition-colors">
          <div className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 font-mono-num">
            {lifeCounter.days.toLocaleString()}
          </div>
          <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mt-1">
            Days
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 text-center transition-colors">
          <div className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 font-mono-num">
            {String(lifeCounter.hours).padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mt-1">
            Hours
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 text-center transition-colors">
          <div className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 font-mono-num">
            {String(lifeCounter.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mt-1">
            Minutes
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 text-center relative overflow-hidden transition-colors">
          <div className="font-serif-display text-3xl sm:text-4xl font-bold text-amber-700 dark:text-amber-400 font-mono-num animate-pulse">
            {String(lifeCounter.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs uppercase tracking-wider font-semibold text-amber-800 dark:text-amber-300 mt-1">
            Seconds
          </div>
        </div>
      </div>

      {/* Secondary Aggregated Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs">
        <div>
          <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Total Days:</span>
          <span className="font-medium text-stone-800 dark:text-stone-200 font-mono-num text-sm">
            {lifeCounter.totalDays.toLocaleString()} days
          </span>
        </div>
        <div>
          <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Total Weeks:</span>
          <span className="font-medium text-stone-800 dark:text-stone-200 font-mono-num text-sm">
            {lifeCounter.totalWeeks.toLocaleString()} weeks
          </span>
        </div>
        <div>
          <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Approx. Months:</span>
          <span className="font-medium text-stone-800 dark:text-stone-200 font-mono-num text-sm">
            ~{lifeCounter.totalMonthsApprox} months
          </span>
        </div>
        <div>
          <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Memories Uploaded:</span>
          <span className="font-medium text-stone-800 dark:text-stone-200 font-mono-num text-sm">
            {totalMemories.toLocaleString()} items
          </span>
        </div>
      </div>
    </div>
  );
};
