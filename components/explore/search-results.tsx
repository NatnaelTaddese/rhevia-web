"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Film01Icon, Loading03Icon, Tv01Icon } from "@hugeicons/core-free-icons";

import { MovieCard, type MovieCardData } from "./movie-card";
import { SeriesCard, type SeriesCardData } from "./series-card";
import { searchContent } from "@/lib/search-data";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  isOpen: boolean;
  searchQuery: string;
  onClose: () => void;
}

export function SearchResults({
  isOpen,
  searchQuery,
  onClose,
}: SearchResultsProps) {
  const [movies, setMovies] = useState<MovieCardData[]>([]);
  const [shows, setShows] = useState<SeriesCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setShows([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchContent(searchQuery);
        setMovies(results.movies);
        setShows(results.shows);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const hasResults = movies.length > 0 || shows.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "fixed left-1/2 top-20 -translate-x-1/2 z-50",
              "w-[calc(100%-2rem)] max-w-3xl max-h-[calc(100vh-8rem)]",
              "rounded-3xl bg-black/90 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
              "overflow-hidden",
            )}
          >
            <div className="overflow-y-auto p-6 max-h-[calc(100vh-8rem)]">
              {isLoading && (
                <div className="flex items-center justify-center py-16">
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    strokeWidth={2}
                    className="size-6 text-white/60 animate-spin"
                  />
                </div>
              )}

              {!isLoading && !hasResults && searchQuery && (
                <div className="text-center py-16">
                  <p className="text-white/60 text-sm">
                    No results found for &ldquo;{searchQuery}&rdquo;
                  </p>
                </div>
              )}

              {!isLoading && !searchQuery && (
                <div className="text-center py-16">
                  <p className="text-white/60 text-sm">
                    Start typing to search for movies and shows
                  </p>
                </div>
              )}

              {!isLoading && hasResults && (
                <div className="space-y-6">
                  {movies.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <HugeiconsIcon
                          icon={Film01Icon}
                          strokeWidth={2}
                          className="size-4 text-white/60"
                        />
                        <h2 className="text-sm font-medium text-white">
                          Movies
                        </h2>
                        <span className="text-xs text-white/40">
                          ({movies.length})
                        </span>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {movies.map((movie) => (
                          <MovieCard key={movie.id} movie={movie} />
                        ))}
                      </div>
                    </section>
                  )}

                  {shows.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <HugeiconsIcon
                          icon={Tv01Icon}
                          strokeWidth={2}
                          className="size-4 text-white/60"
                        />
                        <h2 className="text-sm font-medium text-white">
                          TV Shows
                        </h2>
                        <span className="text-xs text-white/40">
                          ({shows.length})
                        </span>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {shows.map((show) => (
                          <SeriesCard key={show.id} series={show} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
