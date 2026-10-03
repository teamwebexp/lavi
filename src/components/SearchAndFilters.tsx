import React from 'react';
import { Search, X, ArrowUpDown, Filter, Film, Image as ImageIcon, Heart, Calendar } from 'lucide-react';
import { FilterState, FilterType, SortOrder } from '../types/album';

interface SearchAndFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  availableYears: string[];
  totalResultsCount: number;
  favoritesCount: number;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  onFilterChange,
  availableYears,
  totalResultsCount,
  favoritesCount,
}) => {
  const months = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Top Search Input and Sort Order */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Instant Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search memories, places, captions..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 shadow-2xs transition-all text-stone-900 placeholder:text-stone-400"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side: Sort Toggle and Results Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-stone-500 font-medium">
            Showing <strong className="text-stone-800 font-mono-num">{totalResultsCount}</strong> {totalResultsCount === 1 ? 'memory' : 'memories'}
          </span>

          <button
            onClick={() => onFilterChange({ sortOrder: filters.sortOrder === 'newest' ? 'oldest' : 'newest' })}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-700" />
            <span>Sort: {filters.sortOrder === 'newest' ? 'Newest → Oldest' : 'Oldest → Newest'}</span>
          </button>
        </div>
      </div>

      {/* Second Row: Media Type Filter Tabs & Date Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        
        {/* Media Type Segmented Tabs */}
        <div className="inline-flex items-center p-1 bg-stone-200/60 rounded-xl">
          <button
            onClick={() => onFilterChange({ mediaType: 'all' })}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filters.mediaType === 'all'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Media
          </button>

          <button
            onClick={() => onFilterChange({ mediaType: 'image' })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filters.mediaType === 'image'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-3 h-3 text-amber-700" />
            <span>Photos</span>
          </button>

          <button
            onClick={() => onFilterChange({ mediaType: 'video' })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filters.mediaType === 'video'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Film className="w-3 h-3 text-amber-700" />
            <span>Videos</span>
          </button>

          <button
            onClick={() => onFilterChange({ mediaType: 'favorites' })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filters.mediaType === 'favorites'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Heart className={`w-3 h-3 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-stone-400'}`} />
            <span>Favorites</span>
            {favoritesCount > 0 && <span className="font-mono-num text-[11px] text-stone-500">({favoritesCount})</span>}
          </button>
        </div>

        {/* Date Filter Dropdowns (Year & Month) */}
        <div className="flex items-center gap-2">
          {/* Year Selector */}
          <select
            value={filters.year}
            onChange={(e) => onFilterChange({ year: e.target.value })}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer shadow-2xs"
          >
            <option value="all">All Years</option>
            {availableYears.map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>

          {/* Month Selector */}
          <select
            value={filters.month}
            onChange={(e) => onFilterChange({ month: e.target.value })}
            className="px-3 py-1.5 text-xs font-medium bg-white border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer shadow-2xs"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          {/* Reset Filters button if any active filter */}
          {(filters.search || filters.mediaType !== 'all' || filters.year !== 'all' || filters.month !== 'all') && (
            <button
              onClick={() => onFilterChange({ search: '', mediaType: 'all', year: 'all', month: 'all' })}
              className="text-xs text-amber-800 hover:underline px-1 cursor-pointer font-medium whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
