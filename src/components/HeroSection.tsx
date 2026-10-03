import React from 'react';
import { 
  ArrowDown, 
  Sparkles, 
  Calendar, 
  Image as ImageIcon, 
  Film, 
  Clock
} from 'lucide-react';
import { MediaItem, AlbumStats } from '../types/album';
import { LifeCounterData } from '../hooks/useLifeCounter';
import { ALBUM_TITLE, ALBUM_SUBTITLE } from '../config/albumConfig';
import { HeroSlideCarousel } from './HeroSlideCarousel';

interface HeroSectionProps {
  stats: AlbumStats;
  lifeCounter: LifeCounterData;
  items: MediaItem[];
  featuredItem?: MediaItem | null;
  onExplore: () => void;
  onOpenItem: (item: MediaItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  lifeCounter,
  items,
  onExplore,
  onOpenItem,
}) => {
  const formattedLatestDate = stats.latestUploadDate
    ? new Date(stats.latestUploadDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <section className="relative overflow-hidden border-b border-stone-200/60 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#141210] transition-colors">
      
      {/* Full-Width Animated Photo Slide Carousel - Zero Text Obstructing Photos */}
      <div className="w-full">
        <HeroSlideCarousel
          items={items}
          onOpenItem={onOpenItem}
        />
      </div>

      {/* Clean Minimal Title Header (Placed Below Carousel) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100">
            {ALBUM_TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {ALBUM_SUBTITLE}
          </p>
        </div>

        <button
          onClick={onExplore}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/80 rounded-xl shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>Explore Memories</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Animated Statistics Bar Below Full-Width Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-t border-stone-200/70 dark:border-stone-800/80">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 text-center sm:text-left">
          
          {/* Total Memories */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Total Memories
            </span>
            <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 font-mono-num">
              {stats.totalItems.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">Captured in time</p>
          </div>

          {/* Total Photos */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center justify-center sm:justify-start gap-1.5">
              <ImageIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Photos
            </span>
            <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 font-mono-num">
              {stats.totalPhotos.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">High-res moments</p>
          </div>

          {/* Total Videos */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Film className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Videos
            </span>
            <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 font-mono-num">
              {stats.totalVideos.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">Live motion clips</p>
          </div>

          {/* Days of Memories */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Days of Life
            </span>
            <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 font-mono-num">
              {lifeCounter.totalDays.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">~{lifeCounter.totalMonthsApprox} months</p>
          </div>

          {/* Latest Upload Date */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 space-y-1">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Latest Sync
            </span>
            <div className="text-lg sm:text-xl font-semibold text-stone-900 dark:text-stone-100 pt-0.5">
              {formattedLatestDate}
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">Auto-synced folder</p>
          </div>

        </div>
      </div>
    </section>
  );
};
