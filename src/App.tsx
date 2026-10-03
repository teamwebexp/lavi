import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MemoryCarousel } from './components/MemoryCarousel';
import { LifeCounterCard } from './components/LifeCounterCard';
import { MemoryOfTheDay } from './components/MemoryOfTheDay';
import { SearchAndFilters } from './components/SearchAndFilters';
import { MediaGrid } from './components/MediaGrid';
import { TimelineView } from './components/TimelineView';
import { FamilyTimeView } from './components/FamilyTimeView';
import { LightboxModal } from './components/LightboxModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorState } from './components/ErrorState';
import { ToastNotification } from './components/ToastNotification';

import { MediaItem, FilterState, MonthGroup, AlbumStats } from './types/album';
import { useFavorites } from './hooks/useFavorites';
import { useLifeCounter } from './hooks/useLifeCounter';
import { useTheme } from './hooks/useTheme';
import { 
  fetchAlbumMedia, 
  groupMediaByMonth, 
  buildTimeline, 
  findMemoryOfTheDay,
  calculateStats,
  getCachedAlbum
} from './services/albumService';
import { ALBUM_TITLE, ALBUM_SUBTITLE } from './config/albumConfig';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<AlbumStats>({
    totalItems: 0,
    totalPhotos: 0,
    totalVideos: 0,
    latestUploadDate: null,
    earliestUploadDate: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Lightbox modal item
  const [activeLightboxItem, setActiveLightboxItem] = useState<MediaItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom Hooks
  const { favorites, toggleFavorite, isFavorite, totalFavorites } = useFavorites();
  const lifeCounter = useLifeCounter();
  const { isDarkMode, toggleTheme } = useTheme();

  // Search & Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    mediaType: 'all',
    year: 'all',
    month: 'all',
    sortOrder: 'newest',
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Initial load
  const loadAlbumData = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    const result = await fetchAlbumMedia(forceRefresh);

    if (result.success) {
      setItems(result.items);
      setStats(result.stats);
      if (forceRefresh) {
        showToast('Album updated with latest memories!');
      }
    } else {
      // Fetch failed, check if we have cached items
      if (result.items && result.items.length > 0) {
        setItems(result.items);
        setStats(result.stats);
        if (forceRefresh) {
          showToast('Could not fetch new data. Displaying cached memories.');
        }
      } else {
        setErrorMessage(result.error || 'Failed to sync memories');
      }
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, [showToast]);

  useEffect(() => {
    loadAlbumData(false);
  }, [loadAlbumData]);

  // Featured Item for Hero Section
  const featuredItem = useMemo(() => {
    return items.find(i => i.isSpecialMoment || i.featured) || items[0] || null;
  }, [items]);

  // Memory of the Day
  const memoryOfTheDayData = useMemo(() => {
    return findMemoryOfTheDay(items);
  }, [items]);

  // Chronological timeline
  const timelineEvents = useMemo(() => {
    return buildTimeline(items);
  }, [items]);

  // Available Years for filter dropdown
  const availableYears = useMemo(() => {
    const yearSet = new Set<string>();
    items.forEach(item => {
      const d = new Date(item.createdTime);
      if (!isNaN(d.getTime())) {
        yearSet.add(d.getFullYear().toString());
      }
    });
    return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
  }, [items]);

  // Tab-specific filter adjustments
  const effectiveFilters = useMemo(() => {
    const f = { ...filters };
    if (activeTab === 'videos') {
      f.mediaType = 'video';
    } else if (activeTab === 'favorites') {
      f.mediaType = 'favorites';
    }
    return f;
  }, [filters, activeTab]);

  // Filtered Items computation
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Text Search
      if (effectiveFilters.search.trim()) {
        const q = effectiveFilters.search.toLowerCase();
        const matchesCaption = item.caption?.toLowerCase().includes(q);
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesLocation = item.location?.toLowerCase().includes(q);
        if (!matchesCaption && !matchesName && !matchesLocation) {
          return false;
        }
      }

      // 2. Media Type Filter
      if (effectiveFilters.mediaType === 'image' && item.type !== 'image') {
        return false;
      }
      if (effectiveFilters.mediaType === 'video' && item.type !== 'video') {
        return false;
      }
      if (effectiveFilters.mediaType === 'favorites' && !favorites.has(item.id)) {
        return false;
      }

      // 3. Year Filter
      const d = new Date(item.createdTime);
      if (effectiveFilters.year !== 'all') {
        if (d.getFullYear().toString() !== effectiveFilters.year) {
          return false;
        }
      }

      // 4. Month Filter
      if (effectiveFilters.month !== 'all') {
        if ((d.getMonth() + 1).toString() !== effectiveFilters.month) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.createdTime).getTime();
      const timeB = new Date(b.createdTime).getTime();
      return effectiveFilters.sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [items, effectiveFilters, favorites]);

  // Group filtered items by month
  const monthGroups: MonthGroup[] = useMemo(() => {
    return groupMediaByMonth(filteredItems, effectiveFilters.sortOrder);
  }, [filteredItems, effectiveFilters.sortOrder]);

  const handleOpenItem = (item: MediaItem) => {
    setActiveLightboxItem(item);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setActiveLightboxItem(null);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExploreMemories = () => {
    setActiveTab('album');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCachedAlbum = () => {
    const cached = getCachedAlbum();
    if (cached) {
      setItems(cached.items);
      setStats(calculateStats(cached.items));
      setErrorMessage(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#121110] text-stone-800 dark:text-stone-100 pb-16 md:pb-0 transition-colors duration-200">
      
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={totalFavorites}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Error State Banner if API failed completely */}
        {errorMessage && items.length === 0 ? (
          <ErrorState
            errorMessage={errorMessage}
            onTryAgain={() => loadAlbumData(true)}
            onViewCached={handleViewCachedAlbum}
            hasCachedData={Boolean(getCachedAlbum())}
          />
        ) : isLoading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <LoadingSkeleton />
          </div>
        ) : (
          <>
            {/* VIEW 1: HOME PAGE */}
            {activeTab === 'home' && (
              <div className="space-y-12">
                {/* Hero Section with Mobile Optimized Animated Photo Slide Carousel */}
                <HeroSection
                  stats={stats}
                  lifeCounter={lifeCounter}
                  items={items}
                  featuredItem={featuredItem}
                  onExplore={handleExploreMemories}
                  onOpenItem={handleOpenItem}
                />

                {/* Below Hero: Featured Memories Carousel */}
                <MemoryCarousel
                  items={items}
                  onOpenItem={handleOpenItem}
                />

                {/* Editorial Milestone Sections */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
                  
                  {/* Memory of the Day */}
                  {memoryOfTheDayData && (
                    <MemoryOfTheDay
                      memoryData={memoryOfTheDayData}
                      onOpenItem={handleOpenItem}
                      isFavorite={isFavorite(memoryOfTheDayData.item.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  )}

                  {/* Life & Memory Live Counter Card */}
                  <LifeCounterCard
                    lifeCounter={lifeCounter}
                    totalMemories={stats.totalItems}
                  />

                  {/* Recent Memories Section Preview */}
                  <div className="pt-6">
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200/80 dark:border-stone-800">
                      <div>
                        <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Latest Additions</span>
                        </div>
                        <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                          Recent Moments
                        </h3>
                      </div>

                      <button
                        onClick={() => setActiveTab('album')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:text-amber-800 dark:hover:text-amber-400 transition-colors cursor-pointer group"
                      >
                        <span>View All {stats.totalItems} Memories</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <MediaGrid
                      groups={monthGroups.slice(0, 2)}
                      totalFilteredCount={filteredItems.length}
                      onOpenItem={handleOpenItem}
                      isFavorite={isFavorite}
                      onToggleFavorite={toggleFavorite}
                    />
                  </div>

                </div>
              </div>
            )}

            {/* VIEW 2: ALBUM (Combined Media Gallery) */}
            {activeTab === 'album' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-8">
                  <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">
                    Complete Collection
                  </div>
                  <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
                    The Family Archive
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                    All high-resolution photographs and motion videos arranged chronologically.
                  </p>
                </div>

                <SearchAndFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  availableYears={availableYears}
                  totalResultsCount={filteredItems.length}
                  favoritesCount={totalFavorites}
                />

                <MediaGrid
                  groups={monthGroups}
                  totalFilteredCount={filteredItems.length}
                  onOpenItem={handleOpenItem}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            )}

            {/* VIEW 3: TIMELINE PAGE */}
            {activeTab === 'timeline' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <TimelineView
                  events={timelineEvents}
                  onOpenItem={handleOpenItem}
                />
              </div>
            )}

            {/* VIEW 4: FAMILY TIME PAGE */}
            {activeTab === 'family-time' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <FamilyTimeView
                  items={items}
                  onOpenItem={handleOpenItem}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            )}

            {/* VIEW 5: VIDEOS ONLY */}
            {activeTab === 'videos' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-8">
                  <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">
                    Motion &amp; Sound
                  </div>
                  <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
                    Family Video Moments
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                    Live motion clips and home recordings that play directly in your browser.
                  </p>
                </div>

                <SearchAndFilters
                  filters={effectiveFilters}
                  onFilterChange={handleFilterChange}
                  availableYears={availableYears}
                  totalResultsCount={filteredItems.length}
                  favoritesCount={totalFavorites}
                />

                <MediaGrid
                  groups={monthGroups}
                  totalFilteredCount={filteredItems.length}
                  onOpenItem={handleOpenItem}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            )}

            {/* VIEW 6: FAVORITES */}
            {activeTab === 'favorites' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-8">
                  <div className="text-xs font-semibold text-rose-800 dark:text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                    <span>Cherished Keepsakes</span>
                  </div>
                  <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
                    Bookmarked Favorites
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                    Your starred memories, saved locally so they remain every time you return.
                  </p>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="py-20 text-center rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-8 max-w-md mx-auto transition-colors">
                    <Heart className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
                    <h3 className="font-serif-display text-xl font-bold text-stone-800 dark:text-stone-200">
                      No favorites yet
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                      Tap the heart icon on any photo or video to bookmark your most treasured family memories.
                    </p>
                  </div>
                ) : (
                  <MediaGrid
                    groups={monthGroups}
                    totalFilteredCount={filteredItems.length}
                    onOpenItem={handleOpenItem}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                  />
                )}
              </div>
            )}
          </>
        )}

      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-stone-200/70 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#121110] py-10 mt-16 text-center text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-serif-display text-base font-semibold text-stone-800 dark:text-stone-200">
            {ALBUM_TITLE}
          </p>
          <p className="text-stone-400 dark:text-stone-500">
            {ALBUM_SUBTITLE}
          </p>
          <div className="pt-2 text-[11px] text-stone-400 dark:text-stone-500">
            Personal Keepsake &amp; Google Drive Synchronized Media Album
          </div>
        </div>
      </footer>

      {/* Lightbox / Video Player Modal */}
      <LightboxModal
        item={activeLightboxItem}
        items={items}
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        onNavigate={(newItem) => setActiveLightboxItem(newItem)}
        isFavorite={activeLightboxItem ? isFavorite(activeLightboxItem.id) : false}
        onToggleFavorite={toggleFavorite}
        onShowToast={showToast}
      />

      {/* Toast Confirmation Notification */}
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

    </div>
  );
}
