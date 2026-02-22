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
import { ShowInfoCard } from "./show-info-card";
import type { ShowDetails, ShowInfo } from "@/lib/show-data";

interface ShowHeroProps {
  show: ShowDetails;
  showInfo: ShowInfo;
}

function formatAirDateRange(firstYear: string, lastYear: string | null, inProduction: boolean): string {
  if (!firstYear) return "";
  if (inProduction) return `${firstYear} - Present`;
  if (lastYear && firstYear !== lastYear) return `${firstYear} - ${lastYear}`;
  return firstYear;
}

function formatEpisodeRuntime(minutes: number[]): string {
  if (!minutes.length) return "";
  const avg = Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length);
  const hours = Math.floor(avg / 60);
  const mins = avg % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function ShowHero({ show, showInfo }: ShowHeroProps) {
  const [watched, setWatched] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const { state: copyState, copy } = useCopyToClipboard();

  return (
    <section className="relative w-full min-h-[90vh] sm:min-h-[70vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {show.backdropUrl && (
          <Image
            src={show.backdropUrl}
            alt={show.name}
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
        <div className="flex gap-8 items-end justify-between">
          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-6">
            {/* Logo or Title */}
            {show.logoUrl ? (
              <div className="relative h-20 md:h-28 w-full max-w-md">
                <Image
                  src={show.logoUrl}
                  alt={show.name}
                  fill
                  className="object-contain object-left"
                />
              </div>
            ) : (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                {show.name}
              </h1>
            )}

            {/* Tagline */}
            {show.tagline && (
              <p className="text-md sm:text-lg md:text-xl text-white/40">
                &quot;{show.tagline}&quot;
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-white font-medium">
                  {show.voteAverage}
                </span>
                <span className="text-white/40">
                  ({show.voteCount.toLocaleString()})
                </span>
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{formatAirDateRange(show.firstAirYear, show.lastAirYear, show.inProduction)}</span>
              {show.numberOfSeasons > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span>{show.numberOfSeasons} Season{show.numberOfSeasons !== 1 ? "s" : ""}</span>
                </>
              )}
              {show.episodeRunTime.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span>{formatEpisodeRuntime(show.episodeRunTime)}</span>
                </>
              )}
            </div>

            {/* Genres */}
            {show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {show.genres.map((genre) => (
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
            {show.overview && (
              <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl line-clamp-4 font-sf-pro">
                {show.overview}
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

          {/* Sidebar - Desktop Only */}
          <aside className="hidden xl:block w-80 shrink-0 pb-8">
            <ShowInfoCard info={showInfo} />
          </aside>
        </div>
      </div>
    </section>
  );
}
