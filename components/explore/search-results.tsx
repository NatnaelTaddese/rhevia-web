"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Film01Icon,
  Loading03Icon,
  Tv01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import { MovieCard, type MovieCardData } from "./movie-card";
import { SeriesCard, type SeriesCardData } from "./series-card";
import { searchContent } from "@/lib/search-data";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  isOpen: boolean;
  searchQuery: string;
  onClose: () => void;
}

interface ScrollableSectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
  bgColor?: string;
}

function ScrollableSection({
  title,
  icon,
  count,
  children,
  bgColor = "bg-black/80",
}: ScrollableSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 320;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-medium text-white">{title}</h2>
          <span className="text-xs text-white/40">({count})</span>
        </div>

        <div
          className={cn(
            "flex h-8 items-center gap-0.5 rounded-full px-1",
            "backdrop-blur-xl shadow-xl ring-2 ring-white/10",
            bgColor,
          )}
        >
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "flex size-6 items-center justify-center rounded-full transition-all duration-200",
              "text-white/60 hover:bg-white/10 hover:text-white",
              "disabled:opacity-30 disabled:pointer-events-none",
            )}
            aria-label="Scroll left"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={3}
              className="size-3"
            />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "flex size-6 items-center justify-center rounded-full transition-all duration-200",
              "text-white/60 hover:bg-white/10 hover:text-white",
              "disabled:opacity-30 disabled:pointer-events-none",
            )}
            aria-label="Scroll right"
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={3}
              className="size-3"
            />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className={cn(
            "flex gap-4 overflow-x-auto scrollbar-hide p-4",
            "scroll-smooth",
          )}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {children}
        </div>

        <div
          aria-hidden="true"
          style={
            {
              "--left-fade-width": canScrollLeft ? "48px" : "0px",
              "--right-fade-width": canScrollRight ? "48px" : "0px",
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 right-0 z-20",
            "before:absolute before:inset-y-0 before:left-0 before:transition-[width,opacity] before:duration-300 before:content-['']",
            "after:absolute after:inset-y-0 after:right-0 after:transition-[width,opacity] after:duration-300 after:content-['']",
            "before:w-[var(--left-fade-width)] after:w-[var(--right-fade-width)]",
            canScrollLeft ? "before:opacity-100" : "before:opacity-0",
            canScrollRight ? "after:opacity-100" : "after:opacity-0",
            "before:from-black after:from-black before:bg-gradient-to-r before:to-transparent after:bg-gradient-to-l after:to-transparent",
          )}
        />
      </div>
    </section>
  );
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
                    <ScrollableSection
                      title="Movies"
                      count={movies.length}
                      icon={
                        <HugeiconsIcon
                          icon={Film01Icon}
                          strokeWidth={2}
                          className="size-4 text-white/60"
                        />
                      }
                      bgColor="bg-white/5"
                    >
                      {movies.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movies/${movie.id}`}
                          onClick={onClose}
                        >
                          <MovieCard movie={movie} />
                        </Link>
                      ))}
                    </ScrollableSection>
                  )}

                  {shows.length > 0 && (
                    <ScrollableSection
                      title="TV Shows"
                      count={shows.length}
                      icon={
                        <HugeiconsIcon
                          icon={Tv01Icon}
                          strokeWidth={2}
                          className="size-4 text-white/60"
                        />
                      }
                      bgColor="bg-white/5"
                    >
                      {shows.map((show) => (
                        <Link
                          key={show.id}
                          href={`/shows/${show.id}`}
                          onClick={onClose}
                        >
                          <SeriesCard series={show} />
                        </Link>
                      ))}
                    </ScrollableSection>
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
