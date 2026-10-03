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
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-20 border-b border-stone-200/60 dark:border-stone-800 bg-gradient-to-b from-[#FAF8F5] via-[#F5EFE6]/30 to-[#FAF8F5] dark:from-[#141210] dark:via-[#1c1917]/50 dark:to-[#141210] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Editorial Typography + Mobile Optimized Animated Slide Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Subtitle, Key Action, and Life Days Counter */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400 tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/10 border border-amber-600/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin-slow" />
              <span>Living Digital Keepsake</span>
              <span aria-hidden="true">·</span>
              <span>Always Cherished</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 dark:text-stone-100 leading-[1.08] tracking-tight text-balance">
              {ALBUM_TITLE}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-sans-body max-w-xl mx-auto lg:mx-0">
              {ALBUM_SUBTITLE}
            </p>

            {/* Quick Live Counter Highlight */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/85 dark:bg-stone-900/85 backdrop-blur-xs border border-stone-200/80 dark:border-stone-800 shadow-xs max-w-xl mx-auto lg:mx-0 card-hover-elevation transition-all">
              <div className="text-xs text-stone-500 dark:text-stone-400 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-stone-700 dark:text-stone-200">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Days of Cherished Life &amp; Memories
                </span>
                <span className="text-[11px] text-stone-400 dark:text-stone-500 font-mono-num">
                  Since {lifeCounter.formattedTargetDate.split(',')[0]}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif-display text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-400 font-mono-num">
                  {lifeCounter.totalDays.toLocaleString()}
                </span>
                <span className="text-stone-600 dark:text-stone-400 text-sm font-medium">days</span>
                <span className="text-stone-400 dark:text-stone-600 text-xs">·</span>
                <span className="text-stone-500 dark:text-stone-400 text-xs font-mono-num">
                  {String(lifeCounter.hours).padStart(2, '0')}h {String(lifeCounter.minutes).padStart(2, '0')}m {String(lifeCounter.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-stone-900 dark:bg-amber-600 hover:bg-stone-800 dark:hover:bg-amber-500 active:scale-[0.98] transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap rounded-xl"
              >
                <span>Explore Memories</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>

          {/* Right Column: Mobile-Optimized Animated Photo Slide Carousel */}
          <div className="lg:col-span-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <HeroSlideCarousel
              items={items}
              onOpenItem={onOpenItem}
            />
          </div>
        </div>

        {/* Animated Statistics Bar (Photos, Videos, Memories, Days, Latest Upload) */}
        <div className="mt-14 pt-8 border-t border-stone-200/70 dark:border-stone-800">
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

      </div>
    </section>
  );
};
