import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEY_FAVORITES } from '../config/albumConfig';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading favorites from localStorage', e);
    }
    return new Set();
  });

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error('Error saving favorites to localStorage', e);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.has(id);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    totalFavorites: favorites.size,
  };
}
