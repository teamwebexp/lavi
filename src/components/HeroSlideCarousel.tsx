import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Maximize2,
  Film
} from 'lucide-react';
import { MediaItem } from '../types/album';

interface HeroSlideCarouselProps {
  items: MediaItem[];
  onOpenItem: (item: MediaItem) => void;
}

const SLIDE_DURATION_MS = 5000;

export const HeroSlideCarousel: React.FC<HeroSlideCarouselProps> = ({
  items,
  onOpenItem,
}) => {
  // Select top 6 to 8 featured and recent memories
  const slides = React.useMemo(() => {
    if (!items || items.length === 0) return [];
    const featured = items.filter(i => i.featured || i.isSpecialMoment);
    const pool = featured.length >= 4 ? featured : items;
    return pool.slice(0, 8);
  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  // Touch swipe handling for mobile
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || isHovered || slides.length <= 1) return;

    const timer = setInterval(() => {
      setDirection('next');
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, slides.length, currentIndex]);

  const goToSlide = useCallback((index: number, dir?: 'next' | 'prev') => {
    setDirection(dir || (index > currentIndex ? 'next' : 'prev'));
    setCurrentIndex(index);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Touch Swipe Handlers (Optimized for Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (slides.length <= 1) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchCurrentXRef.current = touch.clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    // If scrolling mostly vertically, don't hijack swipe
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
      isDraggingRef.current = false;
      return;
    }

    touchCurrentXRef.current = touch.clientX;
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current || touchStartXRef.current === null || touchCurrentXRef.current === null) {
      isDraggingRef.current = false;
      return;
    }

    const deltaX = touchCurrentXRef.current - touchStartXRef.current;
    const swipeThreshold = 45; // Minimum px for swipe

    if (deltaX > swipeThreshold) {
      goToPrev();
    } else if (deltaX < -swipeThreshold) {
      goToNext();
    }

    // Reset touch coordinates
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchCurrentXRef.current = null;
    isDraggingRef.current = false;
  };

  if (slides.length === 0) {
    return (
      <div className="aspect-4/3 rounded-3xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-400">
        <Sparkles className="w-10 h-10 animate-pulse text-amber-500/50" />
      </div>
    );
  }

  const currentItem = slides[currentIndex];

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-lg border border-stone-200/90 dark:border-stone-800/80 bg-stone-900 group select-none transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 4:3 Aspect Ratio Container with Smooth Slide Animation */}
      <div className="relative aspect-4/3 sm:aspect-16/11 overflow-hidden bg-stone-950">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const isPrev = (currentIndex - 1 + slides.length) % slides.length === index;
          const isNext = (currentIndex + 1) % slides.length === index;

          // Render only active, prev and next for memory and rendering performance
          if (!isActive && !isPrev && !isNext) return null;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-95 z-0 pointer-events-none'
              }`}
            >
              {/* Image with subtle Ken Burns animated motion when active */}
              <img
                src={slide.thumbnail || slide.url}
                alt={slide.caption || slide.name}
                referrerPolicy="no-referrer"
                loading={index <= 1 ? 'eager' : 'lazy'}
                className={`w-full h-full object-cover select-none ${
                  isActive ? 'animate-ken-burns' : ''
                }`}
              />

              {/* Scrim Overlays for Depth, Contrast, and Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />
              <div className="absolute inset-0 bg-radial-[at_top_right] from-transparent via-transparent to-black/40" />
            </div>
          );
        })}

        {/* Top Floating Header: Category Tag & Slide Counter & Autoplay Button */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Badge: Photo / Video */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 dark:bg-stone-900/80 backdrop-blur-md text-white text-xs font-medium border border-white/15 pointer-events-auto shadow-xs">
            {currentItem.type === 'video' ? (
              <>
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>Motion Video {currentItem.duration ? `· ${currentItem.duration}` : ''}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured Memory</span>
              </>
            )}
          </div>

          {/* Right Controls: Play/Pause & Slide Counter */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Play/Pause Micro Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              className="p-1.5 rounded-full bg-black/60 dark:bg-stone-900/80 backdrop-blur-md text-white/90 hover:text-white border border-white/15 hover:bg-black/80 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>

            {/* Slide Index Counter Badge */}
            <div className="px-2.5 py-1 rounded-full bg-black/60 dark:bg-stone-900/80 backdrop-blur-md text-[11px] font-mono-num text-white/90 border border-white/15">
              <span>{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="text-white/40 mx-1">/</span>
              <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Center Video Play Icon (If current slide is a video) */}
        {currentItem.type === 'video' && (
          <div 
            onClick={() => onOpenItem(currentItem)}
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer group/play"
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-amber-600/90 hover:bg-amber-500 backdrop-blur-sm flex items-center justify-center text-white border-2 border-white/40 shadow-xl transition-all duration-300 group-hover/play:scale-110">
              <Play className="w-8 h-8 fill-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Bottom Editorial Content & View Action */}
        <div 
          onClick={() => onOpenItem(currentItem)}
          className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-7 text-white space-y-2 cursor-pointer transition-transform group-hover:translate-y-[-2px]"
        >
          {/* Date & Location Pill */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-amber-200/95 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {new Date(currentItem.createdTime).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {currentItem.location && (
              <>
                <span className="text-white/40">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {currentItem.location}
                </span>
              </>
            )}
          </div>

          {/* Slide Caption */}
          <h3 className="font-serif-display text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug tracking-tight text-white line-clamp-2 drop-shadow-sm">
            {currentItem.caption || currentItem.name}
          </h3>

          {/* Interactive Prompt Action */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-stone-300/90 group-hover:text-amber-200 flex items-center gap-1.5 transition-colors">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Tap to open in full screen</span>
            </span>

            {/* Mobile swipe helper cue */}
            <span className="text-[11px] text-stone-400 hidden sm:inline-block">
              Swipe or use arrows to navigate
            </span>
          </div>
        </div>

        {/* Navigation Arrows (Visible on hover on desktop, always accessible via touch/buttons) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 -translate-x-0.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 translate-x-0.5" />
            </button>
          </>
        )}

        {/* Continuous Animated Progress Bar at Top */}
        {isPlaying && !isHovered && slides.length > 1 && (
          <div className="absolute top-0 left-0 right-0 z-40 h-1 bg-white/20 overflow-hidden">
            <div 
              key={currentIndex}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
              style={{
                animation: `carouselProgress ${SLIDE_DURATION_MS}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Interactive Thumbnail & Dot Indicators (Great for Mobile Touch Navigation) */}
      <div className="p-3 bg-stone-950 border-t border-stone-800/80 flex items-center justify-between gap-3">
        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 h-2 bg-amber-400'
                  : 'w-2 h-2 bg-stone-700 hover:bg-stone-500'
              }`}
            />
          ))}
        </div>

        {/* Small Touch Helper */}
        <div className="text-[11px] text-stone-400 font-medium">
          {currentItem.type === 'video' ? 'Video Moment' : 'Photo Memory'}
        </div>
      </div>
    </div>
  );
};
