'use client';

import { Star } from 'lucide-react';
import { useRatings } from '@/hooks/useRatings';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'motion/react';

interface RatingStarsProps {
  id: string;
  type: 'tool' | 'credit' | 'directory' | 'article';
  className?: string;
  initialAverage?: number;
  initialCount?: number;
}

export function RatingStars({ id, type, className, initialAverage = 0, initialCount = 0 }: RatingStarsProps) {
  const { getRating, submitRating, isLoaded } = useRatings(type);
  const currentRating = getRating(id);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isLoaded) {
    return (
      <div className={cn("flex flex-col items-center gap-1 opacity-50", className)}>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 text-slate-300" />
          ))}
        </div>
      </div>
    );
  }

  const handleRate = (score: number) => {
    submitRating(id, score);
  };

  const activeRating = hoverRating || currentRating;
  const displayAverage = currentRating > 0 
    ? (initialAverage * initialCount + currentRating) / (initialCount + (initialAverage > 0 ? 0 : 1)) // Very simple client-side approximation
    : initialAverage;

  return (
    <div className={cn("flex flex-col items-center sm:items-start gap-2", className)}>
      <div 
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            className={cn(
               "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm transition-colors",
               star <= activeRating ? "text-amber-400" : "text-slate-300 hover:text-amber-200"
            )}
            aria-label={`Rate ${star} out of 5 stars`}
          >
            <motion.div
               whileTap={{ scale: 0.8 }}
               initial={false}
               animate={currentRating === star && !hoverRating ? { scale: [1, 1.2, 1] } : {}}
            >
              <Star className={cn("w-6 h-6", star <= activeRating && "fill-current")} />
            </motion.div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        {initialCount > 0 && (
          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            {initialAverage.toFixed(1)} ({initialCount} reviews)
          </span>
        )}
        <span>
          {currentRating > 0 ? "Your rating saved" : "Click a star to rate"}
        </span>
      </div>
    </div>
  );
}
