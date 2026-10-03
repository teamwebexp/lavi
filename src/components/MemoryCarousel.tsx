import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react';
import { MediaItem } from '../types/album';

interface MemoryCarouselProps {
  items: MediaItem[];
  onOpenItem: (item: MediaItem) => void;
}

export const MemoryCarousel: React.FC<MemoryCarouselProps> = ({ items, onOpenItem }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -offset : offset,
        behavior: 'smooth',
      });
    }
  };

  const featuredItems = items.filter(i => i.featured || i.isSpecialMoment).slice(0, 10);
  const displayItems = featuredItems.length >= 3 ? featuredItems : items.slice(0, 8);

  if (displayItems.length === 0) return null;

  return (
    <section className="py-10 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Scroll Arrows */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Highlights</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
              Featured Memories
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll memories left"
              className="p-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-2xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll memories right"
              className="p-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-2xs transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1"
        >
          {displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenItem(item)}
              className="group snap-start shrink-0 w-68 sm:w-80 cursor-pointer rounded-2xl overflow-hidden bg-white border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={item.thumbnail || item.url}
                  alt={item.caption || item.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover memory-image-zoom"
                />
                
                {/* Gradient Scrim for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Video Play Indicator */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </div>
                  </div>
                )}

                {/* Duration Badge for Videos */}
                {item.type === 'video' && item.duration && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[11px] font-mono-num text-white">
                    {item.duration}
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-1">
                <div className="text-[11px] text-stone-500 font-medium">
                  {new Date(item.createdTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {item.location && <span> · {item.location}</span>}
                </div>
                <h4 className="font-serif-display text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                  {item.caption || item.name}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
