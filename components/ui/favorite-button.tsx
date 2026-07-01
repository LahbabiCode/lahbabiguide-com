'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface FavoriteButtonProps {
  id: string;
  type: 'tool' | 'credit' | 'directory' | 'article';
  className?: string;
  showLabel?: boolean;
}

export function FavoriteButton({ id, type, className, showLabel }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites(type);
  const active = isFavorite(id);

  if (!isLoaded) {
    return (
      <button 
        disabled
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-colors",
          "hover:bg-slate-100 text-slate-400 p-2 h-10 min-w-10 opacity-50",
          className
        )}
      >
        <Heart className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => toggleFavorite(id)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-colors relative",
        "hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        active ? "text-red-500 hover:bg-red-50" : "text-slate-500",
        showLabel ? "px-4 py-2" : "p-2 h-10 w-10",
        className
      )}
      title={active ? "Remove from favorites" : "Save to favorites"}
      aria-label={active ? "Remove from favorites" : "Save to favorites"}
      aria-pressed={active}
    >
      <motion.div
         initial={false}
         animate={{ scale: active ? [1, 1.2, 1] : 1 }}
         transition={{ duration: 0.3 }}
      >
        <Heart className={cn("w-5 h-5", active && "fill-current")} />
      </motion.div>
      {showLabel && <span>{active ? "Saved" : "Save"}</span>}
    </button>
  );
}
