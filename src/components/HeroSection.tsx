import React from 'react';
import { 
  ArrowDown, 
  Sparkles, 
  RotateCw, 
  Play, 
  Calendar, 
  Image as ImageIcon, 
  Film, 
  Clock
} from 'lucide-react';
import { MediaItem, AlbumStats } from '../types/album';
import { LifeCounterData } from '../hooks/useLifeCounter';
import { ALBUM_TITLE, ALBUM_SUBTITLE } from '../config/albumConfig';

interface HeroSectionProps {
  stats: AlbumStats;
  lifeCounter: LifeCounterData;
  featuredItem: MediaItem | null;
  onExplore: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenItem: (item: MediaItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  lifeCounter,
  featuredItem,
  onExplore,
  onRefresh,
  isRefreshing,
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
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-stone-200/60 bg-gradient-to-b from-[#FAF8F5] via-[#F5EFE6]/30 to-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Editorial Typography + Large Featured Memory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Subtitle, Key Action, and Life Days Counter */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-800 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Living Digital Keepsake</span>
              <span aria-hidden="true">·</span>
              <span>Always Cherished</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 leading-[1.08] tracking-tight text-balance">
              {ALBUM_TITLE}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-sans-body max-w-xl mx-auto lg:mx-0">
              {ALBUM_SUBTITLE}
            </p>

            {/* Quick Live Counter Highlight */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-stone-200/80 shadow-xs max-w-xl mx-auto lg:mx-0">
              <div className="text-xs text-stone-500 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium text-stone-700">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Days of Cherished Life &amp; Memories
                </span>
                <span className="text-[11px] text-stone-400">Since {lifeCounter.formattedTargetDate.split(',')[0]}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif-display text-3xl sm:text-4xl font-bold text-amber-900 font-mono-num">
                  {lifeCounter.totalDays.toLocaleString()}
                </span>
                <span className="text-stone-600 text-sm font-medium">days</span>
                <span className="text-stone-400 text-xs">·</span>
                <span className="text-stone-500 text-xs font-mono-num">
                  {String(lifeCounter.hours).padStart(2, '0')}h {String(lifeCounter.minutes).padStart(2, '0')}m {String(lifeCounter.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 active:scale-[0.99] transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>Explore Memories</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 active:scale-[0.99] transition-all shadow-2xs cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-600' : 'text-stone-500'}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh Album'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Large Featured Memory Frame */}
          <div className="lg:col-span-6">
            {featuredItem ? (
              <div 
                onClick={() => onOpenItem(featuredItem)}
                className="group relative rounded-3xl overflow-hidden shadow-md bg-stone-100 border border-stone-200/90 cursor-pointer aspect-4/3 transition-all duration-300 hover:shadow-xl"
              >
                <img
                  src={featuredItem.thumbnail || featuredItem.url}
                  alt={featuredItem.caption || featuredItem.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover memory-image-zoom"
                />

                {/* Scrim Overlay for Contrast & Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity" />

                {/* Top Corner Badge if Video */}
                {featuredItem.type === 'video' && (
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Featured Video {featuredItem.duration ? `· ${featuredItem.duration}` : ''}</span>
                  </div>
                )}

                {/* Bottom Caption & Date Meta */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-amber-200/90">
                    <span>Featured Memory</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {new Date(featuredItem.createdTime).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {featuredItem.location && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{featuredItem.location}</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-serif-display text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-white line-clamp-2">
                    {featuredItem.caption || featuredItem.name}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-1">
                    Click to view in high-resolution player
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-4/3 rounded-3xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
                <ImageIcon className="w-12 h-12 stroke-[1.5]" />
              </div>
            )}
          </div>
        </div>

        {/* Animated Statistics Bar (Photos, Videos, Memories, Days, Latest Upload) */}
        <div className="mt-14 pt-8 border-t border-stone-200/70">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 text-center sm:text-left">
            
            {/* Total Memories */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-stone-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Total Memories
              </span>
              <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 font-mono-num">
                {stats.totalItems.toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400">Captured in time</p>
            </div>

            {/* Total Photos */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-stone-500 flex items-center justify-center sm:justify-start gap-1.5">
                <ImageIcon className="w-3 h-3 text-amber-600" />
                Photos
              </span>
              <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 font-mono-num">
                {stats.totalPhotos.toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400">High-res moments</p>
            </div>

            {/* Total Videos */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-stone-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Film className="w-3 h-3 text-amber-600" />
                Videos
              </span>
              <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 font-mono-num">
                {stats.totalVideos.toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400">Live motion clips</p>
            </div>

            {/* Days of Memories */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-stone-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Clock className="w-3 h-3 text-amber-600" />
                Days of Life
              </span>
              <div className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 font-mono-num">
                {lifeCounter.totalDays.toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400">~{lifeCounter.totalMonthsApprox} months</p>
            </div>

            {/* Latest Upload Date */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-1 space-y-1">
              <span className="text-xs font-medium text-stone-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Calendar className="w-3 h-3 text-amber-600" />
                Latest Sync
              </span>
              <div className="text-lg sm:text-xl font-semibold text-stone-900 pt-0.5">
                {formattedLatestDate}
              </div>
              <p className="text-[11px] text-stone-400">Auto-synced folder</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
