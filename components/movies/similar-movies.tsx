"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import type { SimilarMovie } from "@/lib/movie-data";

interface SimilarMoviesProps {
  movies: SimilarMovie[];
}

export function SimilarMoviesSection({ movies }: SimilarMoviesProps) {
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
  }, [movies]);

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

  if (!movies.length) return null;

  return (
    <section className="relative py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Similar Movies
          </h2>

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
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="group relative shrink-0"
              >
                <div
                  className={cn(
                    "relative aspect-2/3 w-36 sm:w-40 overflow-hidden rounded-2xl",
                    "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
                    "transition-all duration-300 ease-out",
                    "group-hover:ring-white/20 group-hover:scale-105",
                  )}
                >
                  {movie.posterUrl && (
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 144px, 160px"
                      className="object-cover"
                    />
                  )}

                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent",
                      "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    )}
                  />

                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 p-3",
                      "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                      "transition-all duration-300 ease-out",
                    )}
                  >
                    <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{movie.voteAverage}</span>
                      </span>
                      {movie.releaseYear && <span>{movie.releaseYear}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
