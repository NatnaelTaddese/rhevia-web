"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayIcon,
  InformationCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import type { MovieResultItem } from "@lorenzopant/tmdb";

interface HeroCarouselProps {
  movies: MovieResultItem[];
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((prevIndex) => {
        let nextIndex = prevIndex + newDirection;
        if (nextIndex < 0) nextIndex = movies.length - 1;
        if (nextIndex >= movies.length) nextIndex = 0;
        return nextIndex;
      });
    },
    [movies.length]
  );

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [paginate]);

  const currentMovie = movies[currentIndex];
  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : null;

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[900px] overflow-hidden">
      {/* Background Image */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0"
        >
          {backdropUrl ? (
            <Image
              src={backdropUrl}
              alt={currentMovie.title}
              fill
              priority
              className="object-cover object-top"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900" />
          )}
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-16 md:pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                {currentMovie.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
                {currentMovie.vote_average > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    {currentMovie.vote_average.toFixed(1)}
                  </span>
                )}
                {currentMovie.release_date && (
                  <span>{new Date(currentMovie.release_date).getFullYear()}</span>
                )}
              </div>

              {/* Overview */}
              <p className="text-base md:text-lg text-white/70 mb-8 line-clamp-3 max-w-xl">
                {currentMovie.overview}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <Link href={`/movies/${currentMovie.id}`}>
                  <Button
                    size="lg"
                    className="gap-2 bg-white text-black hover:bg-white/90 rounded-full px-8"
                  >
                    <HugeiconsIcon icon={PlayIcon} strokeWidth={2} />
                    Play
                  </Button>
                </Link>
                <Link href={`/movies/${currentMovie.id}`}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full px-8 backdrop-blur-sm"
                  >
                    <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
                    More Info
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute right-4 md:right-8 bottom-16 md:bottom-24 flex items-center gap-2">
            <button
              onClick={() => paginate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
              aria-label="Previous slide"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
            </button>
            <button
              onClick={() => paginate(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
              aria-label="Next slide"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center gap-2 mt-8">
            {movies.slice(0, 8).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
