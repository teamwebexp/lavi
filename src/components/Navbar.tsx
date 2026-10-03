import React from 'react';
import { 
  Heart, 
  RotateCw, 
  SlidersHorizontal, 
  Sparkles, 
  Film, 
  Calendar, 
  BookHeart, 
  Image as ImageIcon,
  Home
} from 'lucide-react';
import { ALBUM_TITLE } from '../config/albumConfig';

export type ActiveTab = 'home' | 'album' | 'timeline' | 'family-time' | 'videos' | 'favorites';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSettings: () => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  onOpenSettings,
  favoritesCount,
}) => {
  return (
    <>
      {/* Desktop & Tablet Top Bar (Adhering strictly to 3-zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="font-serif-display text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
                {ALBUM_TITLE}
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links with subtle hover underlines */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'home' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
              }`}
            >
              Home
              {activeTab === 'home' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('album')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'album' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
              }`}
            >
              Album
              {activeTab === 'album' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'timeline' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
              }`}
            >
              Timeline
              {activeTab === 'timeline' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('family-time')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'family-time' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
              }`}
            >
              Family Time
              {activeTab === 'family-time' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'videos' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
              }`}
            >
              Videos
              {activeTab === 'videos' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'favorites' ? 'text-amber-800 font-semibold' : 'hover:text-stone-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="text-xs text-stone-500 font-mono-num">({favoritesCount})</span>
              )}
              {activeTab === 'favorites' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions (Refresh Album & Settings) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Album from Google Drive"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-300 hover:text-stone-900 shadow-xs transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">Refresh Album</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="Google Drive Sync & Milestone Settings"
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer focus:outline-none"
              aria-label="Album Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation (Ensures Family Time and Timeline are 100% accessible on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-lg border-t border-stone-200/90 px-2 py-1 shadow-lg">
        <div className="grid grid-cols-6 gap-1 max-w-md mx-auto items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'home' ? 'text-amber-800 font-medium' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('album')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'album' ? 'text-amber-800 font-medium' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ImageIcon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">Album</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'timeline' ? 'text-amber-800 font-medium' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('family-time')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'family-time' ? 'text-amber-800 font-medium' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookHeart className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">Family</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'videos' ? 'text-amber-800 font-medium' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Film className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">Videos</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors relative ${
              activeTab === 'favorites' ? 'text-amber-800 font-medium' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Heart className={`w-4 h-4 mb-0.5 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            <span className="text-[10px] leading-tight">Favs</span>
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
