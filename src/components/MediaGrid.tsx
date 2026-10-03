import React, { useState } from 'react';
import { Calendar, Image as ImageIcon, Film, Heart } from 'lucide-react';
import { MediaItem, MonthGroup } from '../types/album';
import { MediaCard } from './MediaCard';

interface MediaGridProps {
  groups: MonthGroup[];
  totalFilteredCount: number;
  onOpenItem: (item: MediaItem) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  groups,
  totalFilteredCount,
  onOpenItem,
  isFavorite,
  onToggleFavorite,
}) => {
  // Batch pagination to support hundreds/thousands of photos smoothly
  const [displayBatchLimit, setDisplayBatchLimit] = useState(36);

  if (totalFilteredCount === 0) {
    return (
      <div className="py-20 text-center rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-8 transition-colors">
        <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 mb-3">
          <ImageIcon className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="font-serif-display text-xl font-bold text-stone-800 dark:text-stone-200">
          No memories found
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
          Try adjusting your search terms, date filters, or media type selection.
        </p>
      </div>
    );
  }

  // Count items across groups to respect batch limit
  let renderedCount = 0;

  return (
    <div className="space-y-12">
      {groups.map((group) => {
        if (renderedCount >= displayBatchLimit) return null;

        const remainingLimit = displayBatchLimit - renderedCount;
        const visibleItems = group.items.slice(0, remainingLimit);
        renderedCount += visibleItems.length;

        if (visibleItems.length === 0) return null;

        const photoCount = group.items.filter(i => i.type === 'image').length;
        const videoCount = group.items.filter(i => i.type === 'video').length;

        return (
          <section key={group.monthKey} className="space-y-5">
            {/* Automatic Month Header (e.g., September 2026) */}
            <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-3">
              <div className="flex items-baseline gap-3">
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                  {group.label}
                </h3>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {group.items.length} {group.items.length === 1 ? 'memory' : 'memories'}
                </span>
              </div>

              {/* Clean Unboxed Metadata with Typographic Separator */}
              <div className="text-xs text-stone-500 dark:text-stone-400 hidden sm:flex items-center gap-2">
                <span>{photoCount} photos</span>
                <span aria-hidden="true">·</span>
                <span>{videoCount} videos</span>
              </div>
            </div>

            {/* Responsive Media Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {visibleItems.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onOpen={onOpenItem}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Pagination: Load More button if total items exceed batch limit */}
      {totalFilteredCount > displayBatchLimit && (
        <div className="text-center pt-6 pb-4">
          <button
            onClick={() => setDisplayBatchLimit(prev => prev + 36)}
            className="px-6 py-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-sm font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 shadow-2xs transition-colors cursor-pointer"
          >
            Load More Memories ({totalFilteredCount - displayBatchLimit} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
