"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayIcon,
  InformationCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HeroMovie } from "@/lib/explore-data";

interface HeroCarouselProps {
  movies: HeroMovie[];
  autoPlayInterval?: number;
}

export function HeroCarousel({
  movies,
  autoPlayInterval = 8000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentMovie = movies[currentIndex];

  // Preload adjacent images
  useEffect(() => {
    const indicesToPreload = [
      currentIndex,
      (currentIndex + 1) % movies.length,
      (currentIndex - 1 + movies.length) % movies.length,
    ];

    indicesToPreload.forEach((index) => {
      if (!loadedImages.has(index)) {
        const img = new window.Image();
        img.src = movies[index].backdropUrl;
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, index]));
        };
      }
    });
  }, [currentIndex, movies, loadedImages]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;

      setIsTransitioning(true);
      setCurrentIndex(index);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [isTransitioning, currentIndex],
  );

  const goToNext = useCallback(() => {
    goToSlide((currentIndex + 1) % movies.length);
  }, [currentIndex, movies.length, goToSlide]);

  const goToPrevious = useCallback(() => {
    goToSlide((currentIndex - 1 + movies.length) % movies.length);
  }, [currentIndex, movies.length, goToSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, goToNext, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (!movies.length) return null;

  return (
    <section
      className="relative w-full h-[70vh] min-h-125 max-h-225 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Trending movies"
    >
      {/* Background Images */}
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
          aria-hidden={index !== currentIndex}
        >
          <Image
            src={movie.backdropUrl}
            alt={movie.title}
            fill
            priority={index === 0}
            className="object-cover object-top"
            sizes="100vw"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-2xl space-y-4">
            {/* Title with animation */}
            <h1
              key={currentMovie.id}
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold text-foreground",
                "animate-in fade-in slide-in-from-bottom-4 duration-500",
              )}
            >
              {currentMovie.title}
            </h1>

            {/* Meta Info */}
            <div
              key={`meta-${currentMovie.id}`}
              className={cn(
                "flex items-center gap-4 text-sm text-muted-foreground",
                "animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-yellow-500">★</span>
                <span className="font-medium text-foreground">
                  {currentMovie.voteAverage}
                </span>
              </span>
              {currentMovie.releaseYear && (
                <span>{currentMovie.releaseYear}</span>
              )}
            </div>

            {/* Overview */}
            <p
              key={`overview-${currentMovie.id}`}
              className={cn(
                "text-sm md:text-base text-muted-foreground line-clamp-3 max-w-xl",
                "animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150",
              )}
            >
              {currentMovie.overview}
            </p>

            {/* Action Buttons */}
            <div
              key={`actions-${currentMovie.id}`}
              className={cn(
                "flex items-center gap-3 pt-2",
                "animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200",
              )}
            >
              <Link
                href={`/movies/${currentMovie.id}`}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-6 h-8",
                  "bg-primary text-primary-foreground hover:bg-primary/80",
                  "text-xs/relaxed font-medium transition-all",
                )}
              >
                <HugeiconsIcon icon={PlayIcon} className="size-4" />
                Watch Now
              </Link>
              <Link
                href={`/movies/${currentMovie.id}`}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-6 h-8",
                  "border border-border bg-background/50 backdrop-blur-sm",
                  "hover:bg-input/50 hover:text-foreground",
                  "text-xs/relaxed font-medium transition-all",
                )}
              >
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  className="size-4"
                />
                More Info
              </Link>
            </div>

            {/* Pagination Dots */}
            <div
              className="flex items-center gap-2 pt-8"
              role="tablist"
              aria-label="Carousel navigation"
            >
              {movies.map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-1.5 bg-muted-foreground/50 hover:bg-muted-foreground",
                  )}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Go to slide ${index + 1}: ${movie.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 md:right-8 bottom-16 md:bottom-24 z-20 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          disabled={isTransitioning}
          className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
          aria-label="Previous slide"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          disabled={isTransitioning}
          className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
          aria-label="Next slide"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Button>
      </div>
    </section>
  );
}
