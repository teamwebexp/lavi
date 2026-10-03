import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-10 py-6 animate-pulse">
      {/* Month Section Header Skeleton */}
      <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
        <div className="h-8 w-48 bg-stone-200 rounded-lg" />
        <div className="h-4 w-28 bg-stone-200 rounded-md hidden sm:block" />
      </div>

      {/* Grid of Shimmer Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-white border border-stone-200/60 shadow-2xs flex flex-col"
          >
            <div className="aspect-square bg-stone-200/80" />
            <div className="p-3 sm:p-4 space-y-2">
              <div className="h-3 w-20 bg-stone-200 rounded" />
              <div className="h-4 w-36 bg-stone-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
