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

import { cn } from "@/lib/utils";
import type { HeroMovie } from "@/lib/explore-data";

interface HeroCarouselProps {
  movies: HeroMovie[];
  autoPlayInterval?: number;
}

export function HeroCarousel({
  movies,
  autoPlayInterval = 10000,
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
      className="relative w-full h-[90vh] sm:h-[70vh] sm:min-h-225 max-h-300 overflow-hidden"
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
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-background/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-2xl space-y-4">
            {/* Logo or Title with animation */}
            <div
              key={currentMovie.id}
              className={cn(
                "animate-in fade-in slide-in-from-bottom-4 duration-500",
              )}
            >
              {currentMovie.logoUrl ? (
                <Image
                  src={currentMovie.logoUrl}
                  alt={currentMovie.title}
                  width={400}
                  height={200}
                  className="max-w-75 md:max-w-100 lg:max-w-125 max-h-40 md:max-h-50 h-auto object-contain object-left drop-shadow-lg select-none"
                  priority
                />
              ) : (
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                  {currentMovie.title}
                </h1>
              )}
            </div>

            {/* Meta Info */}
            <div
              key={`meta-${currentMovie.id}`}
              className="flex items-center gap-4 text-sm text-muted-foreground select-none"
            >
              <span className="flex items-center gap-1.5 justify-center">
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
              className="font-sf-pro text-sm md:text-base text-muted-foreground line-clamp-3 max-w-xl"
            >
              {currentMovie.overview}
            </p>

            {/* Action Buttons - Dynamic Island Style */}
            <div
              key={`actions-${currentMovie.id}`}
              className="font-sf-pro flex h-11 items-center gap-0.5 rounded-full bg-black/80 px-1 backdrop-blur-xl shadow-xl ring-2 ring-white/10 w-fit pt-0 mt-2 select-none"
            >
              <Link
                href={`/movies/${currentMovie.id}`}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full px-4",
                  "bg-white text-black hover:bg-white/90",
                  "text-sm font-medium transition-all duration-200",
                )}
              >
                <HugeiconsIcon
                  icon={PlayIcon}
                  strokeWidth={3}
                  className="size-4"
                />
                Watch Now
              </Link>
              <Link
                href={`/movies/${currentMovie.id}`}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full px-4",
                  "text-white/60 hover:text-white hover:bg-white/10",
                  "text-sm font-medium transition-all duration-200",
                )}
              >
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  strokeWidth={3}
                  className="size-4"
                />
                More Info
              </Link>
            </div>

            {/* Pagination Dots - Dynamic Island Style */}
            <div
              className="flex h-11 items-center gap-2 rounded-full bg-black/80 px-4 backdrop-blur-xl shadow-xl ring-2 ring-white/10 w-fit pt-0 mt-8"
              role="tablist"
              aria-label="Carousel navigation"
            >
              {movies.map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-130",
                    index === currentIndex
                      ? "w-6 bg-white"
                      : "w-2 bg-white/30 hover:bg-white/50",
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

      {/* Navigation Arrows - Dynamic Island Style */}
      <div className="absolute right-4 md:right-8 bottom-16 md:bottom-24 z-20 flex h-11 items-center gap-0.5 rounded-full bg-black/80 px-1 backdrop-blur-xl shadow-xl ring-2 ring-white/10">
        <button
          onClick={goToPrevious}
          disabled={isTransitioning}
          className={cn(
            "flex size-9 items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
            "text-white/60 hover:bg-white/10 hover:text-white",
            "disabled:opacity-50 disabled:pointer-events-none",
          )}
          aria-label="Previous slide"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={3}
            className="size-4"
          />
        </button>
        <button
          onClick={goToNext}
          disabled={isTransitioning}
          className={cn(
            "flex size-9 items-center justify-center rounded-full transition-all duration-200",
            "text-white/60 hover:bg-white/10 hover:text-white",
            "disabled:opacity-50 disabled:pointer-events-none",
          )}
          aria-label="Next slide"
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            strokeWidth={3}
            className="size-4"
          />
        </button>
      </div>
    </section>
  );
}
