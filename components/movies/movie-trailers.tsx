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
import type { MovieVideo } from "@/lib/movie-data";

interface MovieTrailersProps {
  videos: MovieVideo[];
}

export function MovieTrailers({ videos }: MovieTrailersProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<MovieVideo | null>(null);

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
  }, [videos]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 400;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  if (!videos.length) return null;

  return (
    <section className="relative py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Trailers
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
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className={cn(
                  "group relative shrink-0 rounded-2xl overflow-hidden",
                  "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
                  "transition-all duration-300 ease-out",
                  "hover:ring-white/20",
                )}
              >
                <div className="relative aspect-video w-72 sm:w-80">
                  <Image
                    src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name}
                    fill
                    sizes="(max-width: 640px) 288px, 320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <HugeiconsIcon
                        icon={PlayIcon}
                        strokeWidth={3}
                        className="size-6 text-white ml-1"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-sm font-medium text-white line-clamp-2">
                      {video.name}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {video.type} {video.official && "• Official"}
                    </p>
                  </div>
                </div>
              </button>
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

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
              title={selectedVideo.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 size-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
