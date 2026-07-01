'use client';

import { useState, useEffect } from 'react';

// A generic hook for managing favorites with local storage fallback
export function useFavorites(targetType: 'tool' | 'credit' | 'directory' | 'article') {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from local storage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // 1. Load from local storage
        const stored = localStorage.getItem(`lg_favorites_${targetType}`);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }

        // 2. Attempt to load from API (merging or replacing)
        const response = await fetch(`/api/user/favorites?type=${targetType}`);
        if (response.ok) {
          const data = await response.json();
          if (data.favorites && data.favorites.length > 0) {
            // If logged in and has favorites, we use those as primary
            setFavorites(data.favorites);
            // Also update local storage to keep them in sync
            localStorage.setItem(`lg_favorites_${targetType}`, JSON.stringify(data.favorites));
          }
        }
      } catch (err) {
        console.error('Failed to load favorites', err);
      }
      setIsLoaded(true);
    };

    loadFavorites();
  }, [targetType]);

  // Synchronize favorites with a mock API / local storage
  const syncFavorites = async (newFavorites: string[]) => {
    try {
      localStorage.setItem(`lg_favorites_${targetType}`, JSON.stringify(newFavorites));
      // Future: if user is logged in, sync to /api/user/favorites
      await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: targetType, ids: newFavorites }),
      }).catch(() => {
        // Silently fail if API is not set up or user is not logged in
      });
    } catch (err) {
      console.error('Failed to save favorites', err);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const newFavs = isFav ? prev.filter((f) => f !== id) : [...prev, id];
      syncFavorites(newFavs);
      return newFavs;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
