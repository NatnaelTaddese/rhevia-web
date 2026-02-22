"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { getSeasonEpisodesData } from "@/lib/show-actions";
import type { ShowSeason, SeasonEpisodes } from "@/lib/show-data";

interface ShowEpisodesProps {
  seasons: ShowSeason[];
  initialSeasonData: Map<number, SeasonEpisodes>;
  showId: number;
}

function formatRuntime(minutes: number | null): string {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function EpisodeCardSkeleton() {
  return (
    <div
      className={cn(
        "relative shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden",
        "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
      )}
    >
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-video w-full bg-white/5 animate-pulse" />

      {/* Info Skeleton */}
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
        <div className="flex gap-3">
          <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
          <div className="h-3 w-12 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function EpisodeCard({ episode }: { episode: SeasonEpisodes["episodes"][0] }) {
  return (
    <div
      className={cn(
        "group relative shrink-0 w-64 sm:w-72 rounded-2xl overflow-hidden",
        "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
        "transition-all duration-300 ease-out",
        "hover:ring-white/20",
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-white/5">
        {episode.stillUrl ? (
          <Image
            src={episode.stillUrl}
            alt={episode.name}
            fill
            sizes="(max-width: 640px) 256px, 288px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HugeiconsIcon
              icon={PlayIcon}
              strokeWidth={2}
              className="size-8 text-white/20"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <HugeiconsIcon
              icon={PlayIcon}
              strokeWidth={3}
              className="size-5 text-white ml-0.5"
            />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white/80">
          {formatRuntime(episode.runtime)}
        </div>
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white/60 font-medium">
          E{episode.episodeNumber}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-sm font-medium text-white line-clamp-1 mb-1">
          {episode.name}
        </h4>
        <div className="flex items-center gap-3 text-xs text-white/40">
          {episode.airDate && (
            <span>{new Date(episode.airDate).toLocaleDateString()}</span>
          )}
          {episode.voteAverage > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                {episode.voteAverage}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ShowEpisodes({
  seasons,
  initialSeasonData,
  showId,
}: ShowEpisodesProps) {
  const [selectedSeason, setSelectedSeason] = useState(
    seasons.length > 0 ? seasons[0].seasonNumber.toString() : "",
  );
  const [seasonData, setSeasonData] = useState<Map<number, SeasonEpisodes>>(
    new Map(initialSeasonData),
  );
  const [loading, setLoading] = useState(false);

  const seasonScrollRef = useRef<HTMLDivElement>(null);
  const episodeScrollRef = useRef<HTMLDivElement>(null);

  const [canScrollSeasonLeft, setCanScrollSeasonLeft] = useState(false);
  const [canScrollSeasonRight, setCanScrollSeasonRight] = useState(true);
  const [canScrollEpisodeLeft, setCanScrollEpisodeLeft] = useState(false);
  const [canScrollEpisodeRight, setCanScrollEpisodeRight] = useState(true);

  const checkSeasonScroll = () => {
    if (!seasonScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = seasonScrollRef.current;
    setCanScrollSeasonLeft(scrollLeft > 0);
    setCanScrollSeasonRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const checkEpisodeScroll = () => {
    if (!episodeScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = episodeScrollRef.current;
    setCanScrollEpisodeLeft(scrollLeft > 0);
    setCanScrollEpisodeRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkSeasonScroll();
    window.addEventListener("resize", checkSeasonScroll);
    return () => window.removeEventListener("resize", checkSeasonScroll);
  }, [seasons]);

  useEffect(() => {
    checkEpisodeScroll();
    window.addEventListener("resize", checkEpisodeScroll);
  }, [seasonData, selectedSeason]);

  const scrollSeasons = (direction: "left" | "right") => {
    if (!seasonScrollRef.current) return;
    const scrollAmount = 200;
    seasonScrollRef.current.scrollTo({
      left:
        seasonScrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });
  };

  const scrollEpisodes = (direction: "left" | "right") => {
    if (!episodeScrollRef.current) return;
    const scrollAmount = 300;
    episodeScrollRef.current.scrollTo({
      left:
        episodeScrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });
  };

  const handleSeasonChange = async (seasonNumber: string) => {
    setSelectedSeason(seasonNumber);
    const num = parseInt(seasonNumber, 10);

    if (!seasonData.has(num)) {
      setLoading(true);
      try {
        const data = await getSeasonEpisodesData(showId, num);
        if (data) {
          setSeasonData((prev) => new Map(prev).set(num, data));
        }
      } catch (error) {
        console.error("Failed to fetch season data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!seasons.length) return null;

  const currentSeasonData = seasonData.get(parseInt(selectedSeason, 10));
  const seasonNeedsScroll = canScrollSeasonLeft || canScrollSeasonRight;

  return (
    <section className="relative py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          Episodes
        </h2>

        {/* Combined Island: Seasons + Episode Navigation */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Season Selection Island */}
          <div
            className={cn(
              "flex h-12 items-center gap-0 rounded-full px-1",
              "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
              seasonNeedsScroll ? "flex-1 min-w-0" : "",
            )}
          >
            {/* Left Scroll Button - Only show when scrollable */}
            {seasonNeedsScroll && (
              <button
                onClick={() => scrollSeasons("left")}
                disabled={!canScrollSeasonLeft}
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                  "text-white/60 hover:bg-white/10 hover:text-white",
                  "disabled:opacity-30 disabled:pointer-events-none",
                )}
                aria-label="Scroll seasons left"
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  strokeWidth={2}
                  className="size-5"
                />
              </button>
            )}

            {/* Scrollable Seasons */}
            <div
              className={cn(
                "relative",
                seasonNeedsScroll ? "flex-1 min-w-0" : "",
              )}
            >
              <div
                ref={seasonScrollRef}
                onScroll={checkSeasonScroll}
                className={cn(
                  "flex gap-1",
                  seasonNeedsScroll
                    ? "overflow-x-auto scrollbar-hide scroll-smooth"
                    : "",
                )}
                style={
                  seasonNeedsScroll
                    ? {
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }
                    : undefined
                }
              >
                {seasons.map((season) => {
                  const isSelected =
                    selectedSeason === season.seasonNumber.toString();
                  return (
                    <button
                      key={season.id}
                      onClick={() =>
                        handleSeasonChange(season.seasonNumber.toString())
                      }
                      className={cn(
                        "flex h-10 shrink-0 items-center justify-center px-4 rounded-full transition-all duration-200",
                        "text-sm font-medium",
                        isSelected
                          ? "bg-white text-black"
                          : "text-white/60 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      {season.name}
                    </button>
                  );
                })}
              </div>

              {/* Left Edge Fade */}
              {canScrollSeasonLeft && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-y-0 left-0 w-8 z-10",
                    "bg-gradient-to-r from-black/80 to-transparent",
                  )}
                />
              )}

              {/* Right Edge Fade */}
              {canScrollSeasonRight && seasonNeedsScroll && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-y-0 right-0 w-8 z-10",
                    "bg-gradient-to-l from-black/80 to-transparent",
                  )}
                />
              )}
            </div>

            {/* Right Scroll Button - Only show when scrollable */}
            {seasonNeedsScroll && (
              <button
                onClick={() => scrollSeasons("right")}
                disabled={!canScrollSeasonRight}
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                  "text-white/60 hover:bg-white/10 hover:text-white",
                  "disabled:opacity-30 disabled:pointer-events-none",
                )}
                aria-label="Scroll seasons right"
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="size-5"
                />
              </button>
            )}
          </div>

          {/* Episode Navigation Island */}
          <div
            className={cn(
              "flex h-12 items-center gap-0.5 rounded-full px-1 shrink-0",
              "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
            )}
          >
            <button
              onClick={() => scrollEpisodes("left")}
              disabled={!canScrollEpisodeLeft}
              className={cn(
                "flex size-10 items-center justify-center rounded-full transition-all duration-200",
                "text-white/60 hover:bg-white/10 hover:text-white",
                "disabled:opacity-30 disabled:pointer-events-none",
              )}
              aria-label="Scroll episodes left"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                strokeWidth={2}
                className="size-5"
              />
            </button>
            <button
              onClick={() => scrollEpisodes("right")}
              disabled={!canScrollEpisodeRight}
              className={cn(
                "flex size-10 items-center justify-center rounded-full transition-all duration-200",
                "text-white/60 hover:bg-white/10 hover:text-white",
                "disabled:opacity-30 disabled:pointer-events-none",
              )}
              aria-label="Scroll episodes right"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="size-5"
              />
            </button>
          </div>
        </div>

        {/* Episodes - Horizontal Scrollable */}
        <div className="relative">
          {loading ? (
            <div className={cn("flex gap-4 overflow-x-hidden p-4")}>
              {Array.from({ length: 4 }).map((_, i) => (
                <EpisodeCardSkeleton key={i} />
              ))}
            </div>
          ) : currentSeasonData ? (
            <>
              <div
                ref={episodeScrollRef}
                onScroll={checkEpisodeScroll}
                className={cn(
                  "flex gap-4 overflow-x-auto scrollbar-hide p-4",
                  "scroll-smooth",
                )}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {currentSeasonData.episodes.map((episode) => (
                  <EpisodeCard key={episode.id} episode={episode} />
                ))}
              </div>

              {/* Edge blur masks */}
              <div
                aria-hidden="true"
                style={
                  {
                    "--left-fade-width": canScrollEpisodeLeft ? "48px" : "0px",
                    "--right-fade-width": canScrollEpisodeRight
                      ? "48px"
                      : "0px",
                  } as React.CSSProperties
                }
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 right-0 z-10",
                  "before:absolute before:inset-y-0 before:left-0 before:transition-[width,opacity] before:duration-300 before:content-['']",
                  "after:absolute after:inset-y-0 after:right-0 after:transition-[width,opacity] after:duration-300 after:content-['']",
                  "before:w-[var(--left-fade-width)] after:w-[var(--right-fade-width)]",
                  canScrollEpisodeLeft
                    ? "before:opacity-100"
                    : "before:opacity-0",
                  canScrollEpisodeRight
                    ? "after:opacity-100"
                    : "after:opacity-0",
                  "before:from-background before:bg-gradient-to-r before:to-transparent",
                  "after:from-background after:bg-gradient-to-l after:to-transparent",
                )}
              />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
