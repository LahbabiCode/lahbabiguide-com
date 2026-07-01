'use client';

import { useState, useEffect } from 'react';

type RatingsState = Record<string, number>; // Maps ID to user score

export function useRatings(targetType: 'tool' | 'credit' | 'directory' | 'article') {
  const [ratings, setRatings] = useState<RatingsState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        // 1. Local storage load
        const stored = localStorage.getItem(`lg_ratings_${targetType}`);
        if (stored) {
          setRatings(JSON.parse(stored));
        }

        // 2. API load
        const response = await fetch(`/api/user/ratings?type=${targetType}`);
        if (response.ok) {
          const data = await response.json();
          if (data.ratings && Object.keys(data.ratings).length > 0) {
            setRatings(data.ratings);
            localStorage.setItem(`lg_ratings_${targetType}`, JSON.stringify(data.ratings));
          }
        }
      } catch (err) {
        console.error('Failed to load ratings', err);
      }
      setIsLoaded(true);
    };

    loadRatings();
  }, [targetType]);

  const submitRating = async (id: string, score: number) => {
    setRatings((prev) => {
      const next = { ...prev, [id]: score };
      try {
        localStorage.setItem(`lg_ratings_${targetType}`, JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save rating locally', err);
      }
      return next;
    });

    // Fire-and-forget sync to backend
    await fetch('/api/user/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: targetType, id, score }),
    }).catch(() => {
      // Ignore network errors or unauthenticated state
    });
  };

  const getRating = (id: string) => ratings[id] || 0;

  return { ratings, submitRating, getRating, isLoaded };
}
