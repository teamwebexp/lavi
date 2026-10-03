import React from 'react';
import { Sparkles, Calendar, Play, Heart, ArrowRight } from 'lucide-react';
import { MediaItem } from '../types/album';

interface MemoryOfTheDayProps {
  memoryData: { item: MediaItem; daysAgoText: string } | null;
  onOpenItem: (item: MediaItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const MemoryOfTheDay: React.FC<MemoryOfTheDayProps> = ({
  memoryData,
  onOpenItem,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!memoryData) return null;
  const { item, daysAgoText } = memoryData;

  const formattedDate = new Date(item.createdTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50/70 via-stone-50 to-orange-50/40 dark:from-stone-900 dark:via-stone-900/90 dark:to-amber-950/20 border border-amber-200/60 dark:border-stone-800 p-6 sm:p-8 shadow-xs transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
        
        {/* Left Visual Preview Frame */}
        <div 
          onClick={() => onOpenItem(item)}
          className="md:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 border border-stone-300/60 dark:border-stone-700/60 shadow-xs cursor-pointer group"
        >
          <img
            src={item.thumbnail || item.url}
            alt={item.caption || item.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover memory-image-zoom"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-white translate-x-0.5" />
              </div>
            </div>
          )}

          <div className="absolute top-3 right-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:scale-110 transition-transform cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
            </button>
          </div>
        </div>

        {/* Right Editorial Story & Details */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Memory of the Day</span>
            </span>
            <span className="text-stone-300 dark:text-stone-600">·</span>
            <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
              {daysAgoText}
            </span>
          </div>

          <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
            {item.caption || item.name}
          </h3>

          <div className="text-xs text-stone-600 dark:text-stone-400 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
              {formattedDate}
            </span>
            {item.location && (
              <>
                <span className="text-stone-300 dark:text-stone-600">·</span>
                <span>{item.location}</span>
              </>
            )}
          </div>

          <p className="text-sm text-stone-600 dark:text-stone-300 font-serif-display italic leading-relaxed pt-1">
            "Some moments become memories before we even realize how special they are."
          </p>

          <div className="pt-2">
            <button
              onClick={() => onOpenItem(item)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 border border-stone-200/90 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Relive This Moment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
