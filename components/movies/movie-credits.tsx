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
import type { MovieCredits } from "@/lib/movie-data";

interface MovieCreditsProps {
  credits: MovieCredits;
}

export function MovieCreditsSection({ credits }: MovieCreditsProps) {
  const castScrollRef = useRef<HTMLDivElement>(null);
  const crewScrollRef = useRef<HTMLDivElement>(null);
  const [castScrollState, setCastScrollState] = useState({ left: false, right: true });
  const [crewScrollState, setCrewScrollState] = useState({ left: false, right: true });

  const checkScroll = (ref: React.RefObject<HTMLDivElement | null>, setter: (state: { left: boolean; right: boolean }) => void) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setter({
      left: scrollLeft > 0,
      right: scrollLeft < scrollWidth - clientWidth - 10,
    });
  };

  useEffect(() => {
    checkScroll(castScrollRef, setCastScrollState);
    checkScroll(crewScrollRef, setCrewScrollState);
    const handleResize = () => {
      checkScroll(castScrollRef, setCastScrollState);
      checkScroll(crewScrollRef, setCrewScrollState);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [credits]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (!ref.current) return;
    const scrollAmount = 300;
    ref.current.scrollTo({
      left: ref.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });
  };

  if (!credits.cast.length && !credits.crew.length) return null;

  return (
    <section className="relative py-8 md:py-12 space-y-8">
      <div className="container mx-auto px-4">
        {/* Cast */}
        {credits.cast.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Top Billed Cast
              </h2>

              <div
                className={cn(
                  "flex h-10 items-center gap-0.5 rounded-full bg-black/80 px-1",
                  "backdrop-blur-xl shadow-xl ring-2 ring-white/10",
                )}
              >
                <button
                  onClick={() => scroll(castScrollRef, "left")}
                  disabled={!castScrollState.left}
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
                  onClick={() => scroll(castScrollRef, "right")}
                  disabled={!castScrollState.right}
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
                ref={castScrollRef}
                onScroll={() => checkScroll(castScrollRef, setCastScrollState)}
                className={cn(
                  "flex gap-5 overflow-x-auto scrollbar-hide p-4",
                  "scroll-smooth",
                )}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {credits.cast.map((member) => (
                  <Link
                    key={member.id}
                    href="#"
                    className="group flex flex-col items-center shrink-0"
                  >
                    <div
                      className={cn(
                        "relative size-20 rounded-full overflow-hidden shrink-0",
                        "bg-black/80 shadow-lg ring-2 ring-white/10",
                        "group-hover:ring-white/20 transition-all",
                      )}
                    >
                      {member.profileUrl ? (
                        <Image
                          src={member.profileUrl}
                          alt={member.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <span className="text-2xl text-white/20">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-center max-w-[100px]">
                      <p className="text-sm font-medium text-white group-hover:text-white/80 transition-colors line-clamp-1">
                        {member.name}
                      </p>
                      <p className="text-xs text-white/50 line-clamp-2 min-h-[2rem]">
                        {member.character}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Edge blur masks */}
              <div
                aria-hidden="true"
                style={
                  {
                    "--left-fade-width": castScrollState.left ? "48px" : "0px",
                    "--right-fade-width": castScrollState.right ? "48px" : "0px",
                  } as React.CSSProperties
                }
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 right-0 z-10",
                  "before:absolute before:inset-y-0 before:left-0 before:transition-[width,opacity] before:duration-300 before:content-['']",
                  "after:absolute after:inset-y-0 after:right-0 after:transition-[width,opacity] after:duration-300 after:content-['']",
                  "before:w-[var(--left-fade-width)] after:w-[var(--right-fade-width)]",
                  castScrollState.left ? "before:opacity-100" : "before:opacity-0",
                  castScrollState.right ? "after:opacity-100" : "after:opacity-0",
                  "before:from-background before:bg-gradient-to-r before:to-transparent",
                  "after:from-background after:bg-gradient-to-l after:to-transparent",
                )}
              />
            </div>
          </div>
        )}

        {/* Crew */}
        {credits.crew.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Crew
              </h2>

              <div
                className={cn(
                  "flex h-10 items-center gap-0.5 rounded-full bg-black/80 px-1",
                  "backdrop-blur-xl shadow-xl ring-2 ring-white/10",
                )}
              >
                <button
                  onClick={() => scroll(crewScrollRef, "left")}
                  disabled={!crewScrollState.left}
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
                  onClick={() => scroll(crewScrollRef, "right")}
                  disabled={!crewScrollState.right}
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
                ref={crewScrollRef}
                onScroll={() => checkScroll(crewScrollRef, setCrewScrollState)}
                className={cn(
                  "flex gap-3 overflow-x-auto scrollbar-hide p-4",
                  "scroll-smooth",
                )}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {credits.crew.map((member) => (
                  <div
                    key={`${member.id}-${member.job}`}
                    className="group flex items-center gap-3 px-3 py-2 rounded-xl bg-black/40 ring-1 ring-white/5 hover:ring-white/10 transition-all shrink-0"
                  >
                    <div className="relative size-10 rounded-full overflow-hidden bg-white/5 shrink-0">
                      {member.profileUrl ? (
                        <Image
                          src={member.profileUrl}
                          alt={member.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-sm text-white/30">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white whitespace-nowrap">
                        {member.name}
                      </p>
                      <p className="text-xs text-white/50 whitespace-nowrap">
                        {member.job}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edge blur masks */}
              <div
                aria-hidden="true"
                style={
                  {
                    "--left-fade-width": crewScrollState.left ? "48px" : "0px",
                    "--right-fade-width": crewScrollState.right ? "48px" : "0px",
                  } as React.CSSProperties
                }
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 right-0 z-10",
                  "before:absolute before:inset-y-0 before:left-0 before:transition-[width,opacity] before:duration-300 before:content-['']",
                  "after:absolute after:inset-y-0 after:right-0 after:transition-[width,opacity] after:duration-300 after:content-['']",
                  "before:w-[var(--left-fade-width)] after:w-[var(--right-fade-width)]",
                  crewScrollState.left ? "before:opacity-100" : "before:opacity-0",
                  crewScrollState.right ? "after:opacity-100" : "after:opacity-0",
                  "before:from-background before:bg-gradient-to-r before:to-transparent",
                  "after:from-background after:bg-gradient-to-l after:to-transparent",
                )}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
