import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MovieHero } from "@/components/movies/movie-hero";
import { MovieTrailers } from "@/components/movies/movie-trailers";
import {
  getMovieDetailsData,
  getMovieVideosData,
} from "@/lib/movie-data";

export const dynamic = "force-dynamic";

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function MovieContent({ id }: { id: number }) {
  const [movie, videos] = await Promise.all([
    getMovieDetailsData(id),
    getMovieVideosData(id),
  ]);

  if (!movie) {
    notFound();
  }

  return (
    <>
      <MovieHero movie={movie} />
      {videos.length > 0 && <MovieTrailers videos={videos} />}
    </>
  );
}

function MovieSkeleton() {
  return (
    <section className="relative w-full min-h-[80vh] animate-pulse">
      <div className="absolute inset-0 bg-muted" />
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-16 min-h-[80vh] flex flex-col justify-end">
        <div className="max-w-3xl space-y-6">
          <div className="h-16 w-96 bg-white/10 rounded-lg" />
          <div className="h-6 w-64 bg-white/10 rounded" />
          <div className="flex gap-3">
            <div className="h-6 w-20 bg-white/10 rounded-full" />
            <div className="h-6 w-16 bg-white/10 rounded-full" />
            <div className="h-6 w-24 bg-white/10 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-white/10 rounded" />
            <div className="h-4 w-3/4 bg-white/10 rounded" />
            <div className="h-4 w-1/2 bg-white/10 rounded" />
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-12 w-28 bg-white/10 rounded-full" />
            <div className="h-12 w-36 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId)) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Suspense fallback={<MovieSkeleton />}>
        <MovieContent id={movieId} />
      </Suspense>
    </main>
  );
}
