import React from 'react';
import { Calendar, Play, MapPin, Sparkles, Image as ImageIcon } from 'lucide-react';
import { MediaItem, TimelineEvent } from '../types/album';

interface TimelineViewProps {
  events: TimelineEvent[];
  onOpenItem: (item: MediaItem) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events, onOpenItem }) => {
  if (events.length === 0) {
    return (
      <div className="py-20 text-center rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-8 transition-colors">
        <Calendar className="w-12 h-12 text-stone-400 dark:text-stone-500 mx-auto mb-3 stroke-[1.5]" />
        <h3 className="font-serif-display text-xl font-bold text-stone-800 dark:text-stone-200">
          No timeline events found
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Add photos and videos to see your family timeline unfold.
        </p>
      </div>
    );
  }

  // Group events by Year for clear hierarchical structure
  const yearGroups = events.reduce((acc, event) => {
    if (!acc[event.year]) {
      acc[event.year] = [];
    }
    acc[event.year].push(event);
    return acc;
  }, {} as Record<number, TimelineEvent[]>);

  const years = Object.keys(yearGroups)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="text-center mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Chronological Keepsake</span>
        </div>
        <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100">
          The Family Timeline
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto">
          Every chapter, season, and milestone captured through the passage of time.
        </p>
      </div>

      {/* Vertical Timeline Structure */}
      <div className="relative pl-6 sm:pl-10 space-y-16">
        {/* Continuous Vertical Timeline Line */}
        <div className="absolute left-2.5 sm:left-4.5 top-3 bottom-3 w-0.5 bg-stone-200 dark:bg-stone-800" />

        {years.map((year) => (
          <div key={year} className="relative space-y-8">
            
            {/* Year Node Header */}
            <div className="flex items-center gap-4">
              <div className="relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-800 dark:bg-amber-700 text-white flex items-center justify-center font-serif-display font-bold text-base sm:text-lg shadow-sm -ml-4 sm:-ml-5">
                {year.toString().slice(-2)}
              </div>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                {year}
              </h3>
            </div>

            {/* Events in this year */}
            <div className="space-y-8 sm:space-y-10 pl-4 sm:pl-6">
              {yearGroups[year].map((event) => {
                const photos = event.items.filter(i => i.type === 'image');
                const videos = event.items.filter(i => i.type === 'video');

                return (
                  <div
                    key={event.dateKey}
                    className="relative rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all"
                  >
                    {/* Branch Point Dot on Timeline */}
                    <div className="absolute -left-7.5 sm:-left-9.5 top-6 w-3 h-3 rounded-full bg-amber-600 border-2 border-[#FAF8F5] dark:border-[#141210] shadow-xs" />

                    {/* Date and Metadata */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
                      <div>
                        <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                          {event.monthName}
                        </div>
                        <h4 className="font-serif-display text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                          {event.dateLabel}
                        </h4>
                      </div>

                      <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                        {photos.length > 0 && <span>{photos.length} {photos.length === 1 ? 'photo' : 'photos'}</span>}
                        {photos.length > 0 && videos.length > 0 && <span aria-hidden="true">·</span>}
                        {videos.length > 0 && <span>{videos.length} {videos.length === 1 ? 'video' : 'videos'}</span>}
                      </div>
                    </div>

                    {/* Representative Thumbnails Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {event.items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onOpenItem(item)}
                          className="group relative aspect-square rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60 cursor-pointer shadow-2xs hover:scale-[1.02] transition-transform"
                        >
                          <img
                            src={item.thumbnail || item.url}
                            alt={item.caption || item.name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover memory-image-zoom"
                          />

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Video Play Badge */}
                          {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                                <Play className="w-3.5 h-3.5 fill-white translate-x-0.5" />
                              </div>
                            </div>
                          )}

                          {/* Hover Caption */}
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-[11px] font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.caption || item.name}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* First event caption summary */}
                    {event.items[0]?.caption && (
                      <p className="mt-3 text-xs text-stone-600 dark:text-stone-400 line-clamp-1 italic font-serif-display">
                        "{event.items[0].caption}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
