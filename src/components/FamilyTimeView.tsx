import React, { useRef } from 'react';
import { Heart, Sparkles, Play, Quote, Calendar, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { MediaItem } from '../types/album';

interface FamilyTimeViewProps {
  items: MediaItem[];
  onOpenItem: (item: MediaItem) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export const FamilyTimeView: React.FC<FamilyTimeViewProps> = ({
  items,
  onOpenItem,
  isFavorite,
  onToggleFavorite,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmt = carouselRef.current.clientWidth * 0.7;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth',
      });
    }
  };

  // Find featured items, featured video, and candid memories
  const featuredItem = items.find(i => i.isSpecialMoment || i.featured) || items[0];
  const featuredVideo = items.find(i => i.type === 'video') || items.find(i => i.id.includes('video'));
  const editorialPhotos = items.filter(i => i.id !== featuredItem?.id && i.type === 'image').slice(0, 6);
  const carouselItems = items.slice(0, 10);

  return (
    <div className="space-y-16 py-4">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-widest">
          <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600/30" />
          <span>Our Heart &amp; Home</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight text-balance">
          Family Time
        </h2>
        <p className="font-serif-display text-lg sm:text-xl text-stone-600 italic">
          "Family is where our story begins."
        </p>
      </div>

      {/* Hero Showcase: Large Featured Family Memory + Editorial Story */}
      {featuredItem && (
        <div className="rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            
            {/* Visual Photo (Col 7) */}
            <div 
              onClick={() => onOpenItem(featuredItem)}
              className="lg:col-span-7 relative min-h-[340px] sm:min-h-[460px] bg-stone-100 overflow-hidden cursor-pointer group"
            >
              <img
                src={featuredItem.thumbnail || featuredItem.url}
                alt={featuredItem.caption || featuredItem.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover memory-image-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

              {featuredItem.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white translate-x-0.5" />
                  </div>
                </div>
              )}

              <div className="absolute top-4 right-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(featuredItem.id);
                  }}
                  className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:scale-110 transition-transform cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(featuredItem.id) ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
                </button>
              </div>
            </div>

            {/* Editorial Story Text (Col 5) */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-white via-[#FAF8F5] to-amber-50/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                  <span className="text-amber-800 font-semibold uppercase tracking-wider">Featured Story</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {new Date(featuredItem.createdTime).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                  {featuredItem.caption || featuredItem.name}
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed font-sans-body">
                  These are the quiet afternoons and joyful gatherings that define who we are. 
                  Captured unscripted, preserved forever in our family archive.
                </p>

                {featuredItem.location && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{featuredItem.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onOpenItem(featuredItem)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer"
                >
                  <span>View Full Experience</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Family Quote Ribbon */}
      <div className="rounded-2xl bg-amber-50/60 border border-amber-200/50 p-6 sm:p-8 text-center max-w-3xl mx-auto shadow-2xs">
        <Quote className="w-7 h-7 text-amber-700/40 mx-auto mb-2" />
        <blockquote className="font-serif-display text-xl sm:text-2xl font-medium text-stone-800 leading-snug">
          "Some moments become memories before we even realize how special they are."
        </blockquote>
        <div className="text-xs text-stone-500 font-sans-body mt-2">
          From our family journal
        </div>
      </div>

      {/* Featured Video Spotlight + Magazine Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Featured Video Card (Col 6) */}
        {featuredVideo && (
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                Featured Motion Video
              </span>
              {featuredVideo.duration && (
                <span className="text-xs font-mono-num text-stone-500">{featuredVideo.duration}</span>
              )}
            </div>

            <div 
              onClick={() => onOpenItem(featuredVideo)}
              className="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200/90 shadow-md cursor-pointer group"
            >
              <img
                src={featuredVideo.thumbnail || featuredVideo.url}
                alt={featuredVideo.caption || featuredVideo.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover memory-image-zoom opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-stone-900 translate-x-0.5" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
                <h4 className="font-serif-display text-lg sm:text-xl font-bold leading-tight">
                  {featuredVideo.caption || featuredVideo.name}
                </h4>
                <div className="text-xs text-stone-300 mt-1">
                  Recorded {new Date(featuredVideo.createdTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editorial Asymmetric Magazine Photo Arrangement (Col 6) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Candid Snapshots
            </span>
            <span className="text-xs text-stone-500 font-serif-display italic">Cherished Moments</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {editorialPhotos.slice(0, 4).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onOpenItem(item)}
                className={`group relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 cursor-pointer shadow-2xs hover:shadow-md transition-all ${
                  idx === 0 ? 'aspect-4/3' : 'aspect-square'
                }`}
              >
                <img
                  src={item.thumbnail || item.url}
                  alt={item.caption || item.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover memory-image-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.caption || item.name}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Horizontal Memory Reel Carousel */}
      <div className="pt-8 border-t border-stone-200/80">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">
              Togetherness
            </span>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
              The Memory Reel
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-2xs transition-colors cursor-pointer"
              aria-label="Scroll reel left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 shadow-2xs transition-colors cursor-pointer"
              aria-label="Scroll reel right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4"
        >
          {carouselItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenItem(item)}
              className="group snap-start shrink-0 w-60 sm:w-72 rounded-2xl overflow-hidden bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={item.thumbnail || item.url}
                  alt={item.caption || item.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover memory-image-zoom"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/30">
                      <Play className="w-4 h-4 fill-white translate-x-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3.5 space-y-1">
                <div className="text-[11px] text-stone-500 font-medium">
                  {new Date(item.createdTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <h4 className="font-serif-display text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                  {item.caption || item.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
