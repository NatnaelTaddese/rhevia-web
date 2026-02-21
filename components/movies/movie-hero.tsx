"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayIcon,
  ViewIcon,
  ViewOffSlashIcon,
  FavouriteIcon,
  CopyIcon,
  TickIcon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { MovieDetails } from "@/lib/movie-data";

interface MovieHeroProps {
  movie: MovieDetails;
}

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function MovieHero({ movie }: MovieHeroProps) {
  const [watched, setWatched] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const { state: copyState, copy } = useCopyToClipboard();

  return (
    <section className="relative w-full min-h-[90vh] sm:min-h-[70vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {movie.backdropUrl && (
          <Image
            src={movie.backdropUrl}
            alt={movie.title}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-16 min-h-screen sm:min-h-[80vh] flex flex-col justify-end">
        <div className="max-w-3xl space-y-6">
          {/* Logo or Title */}
          {movie.logoUrl ? (
            <div className="relative h-20 md:h-28 w-full max-w-md">
              <Image
                src={movie.logoUrl}
                alt={movie.title}
                fill
                className="object-contain object-left"
              />
            </div>
          ) : (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {movie.title}
            </h1>
          )}

          {/* Tagline */}
          {movie.tagline && (
            <p className="text-md sm:text-lg md:text-xl text-white/40">
              &quot;{movie.tagline}&quot;
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-white font-medium">
                {movie.voteAverage}
              </span>
              <span className="text-white/40">
                ({movie.voteCount.toLocaleString()})
              </span>
            </span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>{movie.releaseYear}</span>
            {movie.runtime > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{formatRuntime(movie.runtime)}</span>
              </>
            )}
          </div>

          {/* Genres */}
          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 text-xs font-medium text-white/80 bg-white/10 rounded-full select-none"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          {movie.overview && (
            <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl line-clamp-4 font-sf-pro">
              {movie.overview}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            {/* Play Button Island */}
            <div
              className={cn(
                "flex h-12 items-center rounded-full",
                "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
              )}
            >
              <Button size="lg" className="h-12 px-6 rounded-full gap-2">
                <HugeiconsIcon
                  icon={PlayIcon}
                  strokeWidth={3}
                  className="size-5"
                />
                Play
              </Button>
            </div>

            {/* Actions Island */}
            <div
              className={cn(
                "flex h-12 items-center gap-0.5 rounded-full px-1",
                "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
              )}
            >
              <Toggle
                pressed={watched}
                onPressedChange={setWatched}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full transition-all duration-200",
                  "text-white/60 hover:bg-white/10 hover:text-white",
                  "aria-pressed:bg-white/20 aria-pressed:text-white",
                )}
                aria-label="Mark as watched"
              >
                <HugeiconsIcon
                  icon={watched ? ViewOffSlashIcon : ViewIcon}
                  strokeWidth={2}
                  className="size-5"
                />
              </Toggle>
              <Toggle
                pressed={favourite}
                onPressedChange={setFavourite}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full transition-all duration-200",
                  "text-white/60 hover:bg-white/10 hover:text-white",
                  "aria-pressed:bg-white/20 aria-pressed:text-red-400",
                )}
                aria-label="Add to favourites"
              >
                <HugeiconsIcon
                  icon={FavouriteIcon}
                  strokeWidth={2}
                  className="size-5"
                  fill={favourite ? "red" : ""}
                />
              </Toggle>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Copy link"
                onClick={() => copy(window.location.href)}
              >
                <HugeiconsIcon
                  icon={
                    copyState === "done"
                      ? TickIcon
                      : copyState === "error"
                        ? CancelCircleIcon
                        : CopyIcon
                  }
                  strokeWidth={2}
                  className={cn(
                    "size-5",
                    copyState === "done" && "text-green-400",
                    copyState === "error" && "text-red-400",
                  )}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
