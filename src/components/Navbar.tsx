import React from 'react';
import { 
  Heart, 
  Sun,
  Moon,
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
  favoritesCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <>
      {/* Desktop & Tablet Top Bar (Adhering strictly to 3-zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 dark:bg-[#141210]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
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
              <span className="font-serif-display text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                {ALBUM_TITLE}
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links with subtle hover underlines */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
            <button
              onClick={() => setActiveTab('home')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'home' ? 'text-amber-800 dark:text-amber-400 font-semibold' : 'hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Home
              {activeTab === 'home' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 dark:bg-amber-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('album')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'album' ? 'text-amber-800 dark:text-amber-400 font-semibold' : 'hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Album
              {activeTab === 'album' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 dark:bg-amber-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'timeline' ? 'text-amber-800 dark:text-amber-400 font-semibold' : 'hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Timeline
              {activeTab === 'timeline' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 dark:bg-amber-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('family-time')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'family-time' ? 'text-amber-800 dark:text-amber-400 font-semibold' : 'hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Family Time
              {activeTab === 'family-time' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 dark:bg-amber-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeTab === 'videos' ? 'text-amber-800 dark:text-amber-400 font-semibold' : 'hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Videos
              {activeTab === 'videos' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 dark:bg-amber-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'favorites' ? 'text-amber-800 dark:text-amber-400 font-semibold' : 'hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono-num">({favoritesCount})</span>
              )}
              {activeTab === 'favorites' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700 dark:bg-amber-500 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: Primary action - Working Dark Mode Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 text-xs font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white shadow-2xs transition-all cursor-pointer whitespace-nowrap"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-stone-600" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation (Ensures Family Time and Timeline are 100% accessible on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 dark:bg-[#141210]/95 backdrop-blur-lg border-t border-stone-200/90 dark:border-stone-800 px-2 py-1 shadow-lg transition-colors">
        <div className="grid grid-cols-6 gap-1 max-w-md mx-auto items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'home' ? 'text-amber-800 dark:text-amber-400 font-medium' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('album')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'album' ? 'text-amber-800 dark:text-amber-400 font-medium' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">Album</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'timeline' ? 'text-amber-800 dark:text-amber-400 font-medium' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('family-time')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'family-time' ? 'text-amber-800 dark:text-amber-400 font-medium' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookHeart className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">Family</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${
              activeTab === 'videos' ? 'text-amber-800 dark:text-amber-400 font-medium' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Film className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">Videos</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors relative ${
              activeTab === 'favorites' ? 'text-amber-800 dark:text-amber-400 font-medium' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
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
