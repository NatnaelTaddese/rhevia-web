"use client";

import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { MovieCard } from "@/components/explore/movie-card";
import type { MovieCollection } from "@/lib/movie-data";

interface MovieCollectionProps {
  collection: MovieCollection;
  currentMovieId: number;
}

export function MovieCollectionSection({ collection, currentMovieId }: MovieCollectionProps) {
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
  }, [collection.movies]);

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

  if (!collection.movies.length) return null;

  return (
    <section className="relative py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Part of {collection.name}
            </h2>
            <p className="text-sm text-white/50 mt-1">
              The films may share a continuing storyline
            </p>
          </div>

          <div
            className={cn(
              "flex h-10 items-center gap-0.5 rounded-full bg-black/80 px-1",
              "backdrop-blur-xl shadow-xl ring-2 ring-white/10",
            )}
          >
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-all duration-200",
                "text-white/60 hover:bg-white/10 hover:text-white",
                "disabled:opacity-30 disabled:pointer-events-none",
              )}
              aria-label="Scroll left"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                strokeWidth={3}
                className="size-4"
              />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-all duration-200",
                "text-white/60 hover:bg-white/10 hover:text-white",
                "disabled:opacity-30 disabled:pointer-events-none",
              )}
              aria-label="Scroll right"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={3}
                className="size-4"
              />
            </button>
          </div>
        </div>

        <div className="relative">
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
            {collection.movies.map((movie) => {
              const isCurrentMovie = movie.id === currentMovieId;

              return (
                <div key={movie.id} className="relative shrink-0">
                  <MovieCard
                    movie={{
                      id: movie.id,
                      title: movie.title,
                      posterUrl: movie.posterUrl ?? "",
                      releaseYear: movie.releaseDate ? movie.releaseDate.split("-")[0] : "",
                      voteAverage: movie.voteAverage,
                    }}
                    className={isCurrentMovie ? "pointer-events-none" : ""}
                  />
                  {isCurrentMovie && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-1 bg-white text-black text-xs font-semibold rounded-full shadow-lg">
                        You are here
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Edge blur masks */}
          <div
            aria-hidden="true"
            style={
              {
                "--left-fade-width": canScrollLeft ? "48px" : "0px",
                "--right-fade-width": canScrollRight ? "48px" : "0px",
              } as React.CSSProperties
            }
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 right-0 z-10",
              "before:absolute before:inset-y-0 before:left-0 before:transition-[width,opacity] before:duration-300 before:content-['']",
              "after:absolute after:inset-y-0 after:right-0 after:transition-[width,opacity] after:duration-300 after:content-['']",
              "before:w-[var(--left-fade-width)] after:w-[var(--right-fade-width)]",
              canScrollLeft ? "before:opacity-100" : "before:opacity-0",
              canScrollRight ? "after:opacity-100" : "after:opacity-0",
              "before:from-background before:bg-gradient-to-r before:to-transparent",
              "after:from-background after:bg-gradient-to-l after:to-transparent",
            )}
          />
        </div>
      </div>
    </section>
  );
}
