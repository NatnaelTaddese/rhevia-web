"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface MovieCardData {
  id: number;
  title: string;
  posterUrl: string;
  releaseYear: string;
  voteAverage: number;
}

interface MovieCardProps {
  movie: MovieCardData;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className={cn(
        "group relative block shrink-0 hover:scale-110 transition-all delay-150 ease-in",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-2/3 w-36 sm:w-40 overflow-hidden rounded-2xl",
          "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
          "transition-all duration-300 ease-out",
          "group-hover:ring-white/20",
        )}
      >
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 144px, 160px"
          className="object-cover"
        />

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
  );
}
