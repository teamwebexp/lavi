import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Film
} from 'lucide-react';
import { MediaItem } from '../types/album';

interface HeroSlideCarouselProps {
  items: MediaItem[];
  onOpenItem: (item: MediaItem) => void;
}

const SLIDE_DURATION_MS = 6000;

export const HeroSlideCarousel: React.FC<HeroSlideCarouselProps> = ({
  items,
  onOpenItem,
}) => {
  // Select top featured and recent memories
  const slides = React.useMemo(() => {
    if (!items || items.length === 0) return [];
    const featured = items.filter(i => i.featured || i.isSpecialMoment);
    const pool = featured.length >= 4 ? featured : items;
    return pool.slice(0, 10);
  }, [items]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Touch swipe handling for mobile
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || isHovered || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, slides.length, currentIndex]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
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
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 25) {
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

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchCurrentXRef.current = null;
    isDraggingRef.current = false;
  };

  if (slides.length === 0) {
    return null;
  }

  const currentItem = slides[currentIndex];

  return (
    <div 
      className="relative w-full overflow-hidden bg-stone-950 text-white min-h-[440px] sm:min-h-[540px] lg:h-[640px] xl:h-[700px] select-none group cursor-pointer"
      onClick={() => onOpenItem(currentItem)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Full-Width Animated Slides - Pure, Vivid Photos Without Heavy Scrims */}
      <div className="absolute inset-0 overflow-hidden bg-stone-950">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const isPrev = (currentIndex - 1 + slides.length) % slides.length === index;
          const isNext = (currentIndex + 1) % slides.length === index;

          if (!isActive && !isPrev && !isNext) return null;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive 
                  ? 'opacity-100 z-10' 
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Blurred atmospheric backdrop to prevent harsh black bars for unique aspect ratios */}
              <div 
                className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-40 brightness-75"
                style={{ backgroundImage: `url(${slide.thumbnail || slide.url})` }}
              />

              {/* Crisp, full-width photo highlighting the real image */}
              <img
                src={slide.thumbnail || slide.url}
                alt={slide.caption || slide.name}
                referrerPolicy="no-referrer"
                loading={index === 0 ? 'eager' : 'lazy'}
                className={`relative w-full h-full object-contain sm:object-cover object-center select-none ${
                  isActive ? 'animate-ken-burns' : ''
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Very subtle bottom-edge scrim only so indicators remain visible without darkening the photo */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-15 pointer-events-none" />

      {/* Top Controls: Minimal Slide Counter & Play/Pause (Clean, Low Profile) */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 pointer-events-auto">
        {currentItem.type === 'video' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium border border-white/15 shadow-sm">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentItem.duration || 'Video'}</span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          className="p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white/90 hover:text-white border border-white/15 transition-all cursor-pointer"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
        </button>

        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-mono-num text-white/90 border border-white/15 shadow-sm">
          <span>{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="text-white/40 mx-1">/</span>
          <span>{String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Video Play Button in Center (Only for videos, subtle & clean) */}
      {currentItem.type === 'video' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/40 shadow-2xl group-hover:scale-110 group-hover:bg-amber-600/90 transition-all duration-300">
            <Play className="w-8 h-8 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Navigation Arrows on Screen Edges (Subtle, Translucent Glass) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-lg opacity-80 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 -translate-x-0.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next photo"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/35 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-lg opacity-80 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6 translate-x-0.5" />
          </button>
        </>
      )}

      {/* Continuous Animated Progress Bar at Top */}
      {isPlaying && !isHovered && slides.length > 1 && (
        <div className="absolute top-0 left-0 right-0 z-40 h-1 bg-white/20 overflow-hidden">
          <div 
            key={currentIndex}
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            style={{
              animation: `carouselProgress ${SLIDE_DURATION_MS}ms linear forwards`,
            }}
          />
        </div>
      )}

      {/* Bottom Minimal Interactive Dots */}
      <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2 pointer-events-auto">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? 'w-7 sm:w-9 h-2 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'w-2 h-2 bg-white/45 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
