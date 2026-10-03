import React, { useState } from 'react';
import { Play, Heart, Image as ImageIcon, MapPin } from 'lucide-react';
import { MediaItem } from '../types/album';

interface MediaCardProps {
  item: MediaItem;
  onOpen: (item: MediaItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onOpen,
  isFavorite,
  onToggleFavorite,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const formattedDate = new Date(item.createdTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={() => onOpen(item)}
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 shadow-2xs hover:shadow-lg card-hover-elevation transition-all duration-300 active:scale-[0.98] cursor-pointer flex flex-col"
    >
      {/* Visual Thumbnail Media Container */}
      <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-stone-100 dark:bg-stone-800">
        
        {/* Skeleton while loading */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-stone-200/70 dark:bg-stone-800/80 animate-pulse" />
        )}

        {hasError ? (
          // Elegant Fallback Container complying with Zero-Broken-Image Policy
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-stone-100 to-amber-50/50 dark:from-stone-900 dark:to-stone-800 text-stone-500 dark:text-stone-400 text-center">
            <ImageIcon className="w-8 h-8 text-amber-700/60 dark:text-amber-400/60 mb-2 stroke-[1.5]" />
            <p className="text-xs font-medium text-stone-700 dark:text-stone-300 line-clamp-1">{item.name}</p>
            <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">Click to view stream</span>
          </div>
        ) : (
          <img
            src={item.thumbnail || item.url}
            alt={item.caption || item.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover memory-image-zoom transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Darkening Scrim for Text Contrast on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-75 transition-opacity" />

        {/* Video Play Badge */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 group-hover:scale-110 group-hover:bg-amber-600/90 transition-all duration-300 shadow-md">
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Top-Right Favorite Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-md text-white transition-all cursor-pointer hover:scale-110 active:scale-90"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorite ? 'text-rose-500 fill-rose-500 animate-heart-pop' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Video Duration Badge */}
        {item.type === 'video' && item.duration && (
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[10px] font-mono-num font-medium text-white">
            {item.duration}
          </div>
        )}
      </div>

      {/* Card Info Bottom (Clean Unboxed Metadata) */}
      <div className="p-3 sm:p-4 space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
          <span>{formattedDate}</span>
          {item.location && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-stone-400 dark:text-stone-500 shrink-0" />
                <span className="truncate">{item.location}</span>
              </span>
            </>
          )}
        </div>

        <h4 className="font-serif-display text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
          {item.caption || item.name}
        </h4>
      </div>
    </div>
  );
};
