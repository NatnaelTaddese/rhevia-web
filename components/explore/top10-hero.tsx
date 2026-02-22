"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlayIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import type { Top10Item } from "@/lib/explore-data";

interface Top10HeroProps {
  items: Top10Item[];
  type: "movie" | "series";
  autoPlayInterval?: number;
}

export function Top10Hero({
  items,
  type,
  autoPlayInterval = 8000,
}: Top10HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentItem = items[currentIndex];

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
    goToSlide((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, goToSlide]);

  const goToPrevious = useCallback(() => {
    goToSlide((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, goToSlide]);

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

  if (!items.length) return null;

  const href =
    type === "movie"
      ? `/movies/${currentItem.tmdbId}`
      : `/shows/${currentItem.tmdbId}`;

  return (
    <section
      className="relative w-full h-[90vh] sm:h-[70vh] sm:min-h-225 max-h-300 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Top 10 trending"
    >
      {/* Background Images */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
          aria-hidden={index !== currentIndex}
        >
          <Image
            src={item.backdropUrl}
            alt={item.title}
            fill
            priority={index === 0}
            className="object-cover object-top"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="flex items-end justify-between gap-8">
            {/* Left: Movie Info */}
            <div className="max-w-2xl space-y-4">
              {/* Logo or Title */}
              <div
                key={currentItem.id}
                className={cn(
                  "animate-in fade-in slide-in-from-bottom-4 duration-500",
                )}
              >
                {currentItem.logoUrl ? (
                  <Image
                    src={currentItem.logoUrl}
                    alt={currentItem.title}
                    width={400}
                    height={200}
                    className="max-w-75 md:max-w-100 lg:max-w-125 max-h-40 md:max-h-50 h-auto object-contain object-left drop-shadow-lg select-none"
                    priority
                  />
                ) : (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                    {currentItem.title}
                  </h1>
                )}
              </div>

              {/* Meta Info */}
              <div
                key={`meta-${currentItem.id}`}
                className="flex items-center gap-4 text-sm text-muted-foreground select-none"
              >
                <span className="flex items-center gap-1.5 justify-center">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium text-foreground">
                    {currentItem.voteAverage}
                  </span>
                </span>
                {currentItem.year && <span>{currentItem.year}</span>}
              </div>

              {/* Overview */}
              <p
                key={`overview-${currentItem.id}`}
                className="font-sf-pro text-sm md:text-base text-muted-foreground line-clamp-3 max-w-xl"
              >
                {currentItem.overview}
              </p>

              {/* Action Buttons */}
              <div
                key={`actions-${currentItem.id}`}
                className="font-sf-pro flex h-11 items-center gap-0.5 rounded-full bg-black/80 px-1 backdrop-blur-xl shadow-xl ring-2 ring-white/10 w-fit pt-0 mt-2 select-none"
              >
                <Link
                  href={href}
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
                  href={href}
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

              {/* Pagination Dots */}
              <div
                className="flex h-11 items-center gap-2 rounded-full bg-black/80 px-4 backdrop-blur-xl shadow-xl ring-2 ring-white/10 w-fit pt-0 mt-8"
                role="tablist"
                aria-label="Carousel navigation"
              >
                {items.slice(0, 10).map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-130",
                      index === currentIndex
                        ? "w-6 bg-white"
                        : "w-2 bg-white/30 hover:bg-white/50",
                    )}
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={`Go to slide ${index + 1}: ${item.title}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Ranking Number */}
            <div
              key={`rank-${currentItem.id}`}
              className={cn(
                "hidden sm:flex flex-col items-center justify-end pb-24",
                "animate-in fade-in slide-in-from-right-4 duration-500",
              )}
            >
              <div className="relative">
                <span
                  className={cn(
                    "text-[120px] md:text-[160px] lg:text-[200px] font-black leading-none",
                    "text-transparent bg-clip-text",
                    "bg-linear-to-b from-white/60 via-white/20 to-white/10",
                    "select-none drop-shadow-2xl",
                  )}
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  {currentIndex + 1}
                </span>
                <span
                  className={cn(
                    "absolute -bottom-2 left-1/2 -translate-x-1/2",
                    "text-xs font-medium text-white/40 uppercase tracking-widest font-sf-pro",
                  )}
                >
                  /week
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
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
