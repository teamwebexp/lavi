import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Share2, 
  Download, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Calendar, 
  MapPin, 
  Info,
  Clock,
  Check,
  PlayCircle,
  PauseCircle,
  Tv
} from 'lucide-react';
import { MediaItem } from '../types/album';
import { ENABLE_DOWNLOADS } from '../config/albumConfig';

const SLIDESHOW_INTERVAL_MS = 5000;

interface LightboxModalProps {
  item: MediaItem | null;
  items: MediaItem[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (item: MediaItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onShowToast: (message: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  isOpen,
  onClose,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  onShowToast,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Auto-Play Slideshow State (5-second transitions)
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [slideshowProgress, setSlideshowProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch swipe state for mobile navigation
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentIndex = item ? items.findIndex(i => i.id === item.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < items.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onNavigate(items[currentIndex - 1]);
    } else if (items.length > 0) {
      onNavigate(items[items.length - 1]); // Loop back
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(items[currentIndex + 1]);
    } else if (items.length > 0) {
      onNavigate(items[0]); // Loop to start
    }
  };

  const toggleSlideshow = () => {
    setIsSlideshowActive(prev => {
      const nextState = !prev;
      if (nextState) {
        onShowToast('Slideshow started · 5s interval');
      } else {
        onShowToast('Slideshow paused');
      }
      return nextState;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSlideshowActive(false);
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ' && item?.type === 'video' && !videoError) {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        toggleSlideshow();
      } else if (e.key === ' ' && item?.type === 'image') {
        e.preventDefault();
        toggleSlideshow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, hasPrev, hasNext, item, videoError]);

  // Slideshow 5-second automatic progression
  useEffect(() => {
    if (!isSlideshowActive || !isOpen || items.length <= 1) {
      setSlideshowProgress(0);
      return;
    }

    // If a video is actively playing, wait until it ends
    if (isPlaying) {
      setSlideshowProgress(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / SLIDESHOW_INTERVAL_MS) * 100);
      setSlideshowProgress(progress);

      if (elapsed >= SLIDESHOW_INTERVAL_MS) {
        clearInterval(interval);
        // Automatically transition to the next memory (loops to start when reached end)
        const nextIdx = (currentIndex + 1) % items.length;
        onNavigate(items[nextIdx]);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isSlideshowActive, isOpen, currentIndex, items, isPlaying, onNavigate]);

  // Reset video and progress state when item changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVideoError(false);
    setSlideshowProgress(0);
  }, [item?.id]);

  // Turn off slideshow and re-enable scroll when modal closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsSlideshowActive(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: item.caption || item.name,
      text: `Memories: ${item.caption || item.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        onShowToast('Link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (e) {
        onShowToast('Could not copy link');
      }
    }
  };

  const handleDownload = () => {
    if (!ENABLE_DOWNLOADS) return;
    const a = document.createElement('a');
    a.href = item.url;
    a.download = item.name || 'memory-media';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast(`Downloading ${item.name}...`);
  };

  // Mobile Touch Swipe Navigation Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && hasNext) {
      // Swiped Left -> Go Next
      handleNext();
    } else if (distance < -minSwipeDistance && hasPrev) {
      // Swiped Right -> Go Prev
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formattedDate = new Date(item.createdTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slideshow 5s Progress Bar */}
      {isSlideshowActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
          <div 
            className="h-full bg-amber-400 transition-all duration-75 ease-linear"
            style={{ width: `${slideshowProgress}%` }}
          />
        </div>
      )}

      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20">
        
        {/* Left: Item Counter & Date */}
        <div className="text-white text-xs sm:text-sm flex items-center gap-2">
          <div>
            <span className="font-mono-num font-semibold text-amber-300">
              {currentIndex + 1}
            </span>
            <span className="text-stone-400"> of </span>
            <span className="font-mono-num text-stone-300">
              {items.length}
            </span>
            <span className="hidden sm:inline text-stone-500"> · </span>
            <span className="hidden sm:inline text-stone-300">{formattedDate}</span>
          </div>

          {isSlideshowActive && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Slideshow playing (5s)</span>
            </span>
          )}
        </div>

        {/* Right: Actions (Slideshow, Heart, Share, Download, Info, Close) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Auto-Play Slideshow Toggle */}
          <button
            onClick={toggleSlideshow}
            aria-label={isSlideshowActive ? 'Pause Slideshow' : 'Start Auto-Play Slideshow (5s)'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              isSlideshowActive
                ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/50'
                : 'hover:bg-white/10 text-white bg-white/5 border border-white/10'
            }`}
            title={isSlideshowActive ? 'Pause Slideshow (Space or S)' : 'Start Hands-Free Slideshow (5s transitions)'}
          >
            {isSlideshowActive ? (
              <>
                <PauseCircle className="w-4 h-4 text-stone-950" />
                <span className="hidden sm:inline">Pause (5s)</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Slideshow</span>
              </>
            )}
          </button>

          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(item.id)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            title="Favorite"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            aria-label="Share memory"
            className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            title="Share"
          >
            {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
          </button>

          {/* Download (if enabled) */}
          {ENABLE_DOWNLOADS && (
            <button
              onClick={handleDownload}
              aria-label="Download media"
              className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Download Media"
            >
              <Download className="w-5 h-5" />
            </button>
          )}

          {/* Info Drawer Toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            aria-label="Toggle details drawer"
            className={`p-2.5 rounded-full transition-colors cursor-pointer ${
              showInfo ? 'bg-amber-600 text-white' : 'hover:bg-white/10 text-white'
            }`}
            title="Memory Details"
          >
            <Info className="w-5 h-5" />
          </button>

          {/* Close Lightbox */}
          <button
            onClick={onClose}
            aria-label="Close viewer"
            className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer ml-1"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Center Media Viewport */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        
        {/* Left Arrow Navigation */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            aria-label="Previous memory"
            className="hidden sm:flex absolute left-4 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white items-center justify-center transition-all cursor-pointer border border-white/10 hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Arrow Navigation */}
        {hasNext && (
          <button
            onClick={handleNext}
            aria-label="Next memory"
            className="hidden sm:flex absolute right-4 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white items-center justify-center transition-all cursor-pointer border border-white/10 hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Media Renderer: Photo vs Video */}
        {item.type === 'video' ? (
          <div className="relative max-w-5xl w-full max-h-[75vh] flex flex-col items-center justify-center">
            {videoError && item.driveId ? (
              <iframe
                src={`https://drive.google.com/file/d/${item.driveId}/preview`}
                className="w-full h-[65vh] max-w-4xl rounded-2xl border-0 shadow-2xl bg-black"
                allow="autoplay; fullscreen"
                title={item.caption || item.name}
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={item.url}
                  poster={item.thumbnail}
                  playsInline
                  onClick={togglePlayPause}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={() => {
                    if (item.driveId) {
                      setVideoError(true);
                    }
                  }}
                  onEnded={() => setIsPlaying(false)}
                  className="max-h-[70vh] max-w-full rounded-2xl shadow-2xl object-contain cursor-pointer"
                />

                {/* Custom Overlay Play Button when paused */}
                {!isPlaying && (
                  <div 
                    onClick={togglePlayPause}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer pointer-events-auto"
                  >
                    <div className="w-18 h-18 rounded-full bg-black/60 backdrop-blur-xs border border-white/40 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl">
                      <Play className="w-8 h-8 fill-white translate-x-1" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="relative max-w-5xl max-h-[80vh] flex items-center justify-center">
            <img
              key={item.id}
              src={item.url}
              alt={item.caption || item.name}
              referrerPolicy="no-referrer"
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl transition-all duration-700 ease-out animate-in fade-in"
            />
          </div>
        )}

        {/* Collapsible Info Drawer Overlay */}
        {showInfo && (
          <div className="absolute top-4 right-4 sm:right-6 w-80 max-w-[calc(100vw-32px)] bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-2xl p-5 text-white shadow-2xl z-30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="font-serif-display text-lg font-bold text-amber-200">Memory Details</span>
              <button
                onClick={() => setShowInfo(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-300">
              <div>
                <span className="text-stone-500 block">Name:</span>
                <span className="text-stone-200 font-medium truncate block">{item.name}</span>
              </div>

              <div>
                <span className="text-stone-500 block">Date &amp; Time:</span>
                <span className="text-stone-200 font-medium">{formattedDate}</span>
              </div>

              {item.location && (
                <div>
                  <span className="text-stone-500 block">Location:</span>
                  <span className="text-stone-200 font-medium">{item.location}</span>
                </div>
              )}

              {item.type === 'video' && item.duration && (
                <div>
                  <span className="text-stone-500 block">Duration:</span>
                  <span className="text-stone-200 font-medium font-mono-num">{item.duration}</span>
                </div>
              )}

              {item.caption && (
                <div>
                  <span className="text-stone-500 block">Story:</span>
                  <span className="text-stone-200 italic font-serif-display text-sm leading-relaxed block">
                    "{item.caption}"
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar: Caption & Video Player Controls */}
      <div className="px-4 sm:px-8 py-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 space-y-3">
        
        {/* Custom Video Controls (if video) */}
        {item.type === 'video' && (
          <div className="max-w-3xl mx-auto space-y-2">
            
            {/* Scrubber Progress Bar */}
            <div className="flex items-center gap-3 text-xs text-white">
              <span className="font-mono-num text-[11px] w-10 text-right text-stone-300">
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-stone-700/60"
              />

              <span className="font-mono-num text-[11px] w-10 text-stone-400">
                {formatTime(duration)}
              </span>
            </div>

            {/* Play/Pause, Mute, Fullscreen */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                </button>

                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              <div>
                <button
                  onClick={toggleFullscreen}
                  aria-label="Toggle Fullscreen"
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Caption & Location Footer */}
        <div className="max-w-3xl mx-auto text-center space-y-1">
          <h3 className="font-serif-display text-lg sm:text-xl font-bold text-white leading-snug">
            {item.caption || item.name}
          </h3>

          <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
            <span>{formattedDate}</span>
            {item.location && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{item.location}</span>
                </span>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
