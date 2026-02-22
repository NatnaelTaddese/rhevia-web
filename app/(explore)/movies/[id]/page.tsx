import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

import { MovieHero } from "@/components/movies/movie-hero";
import { MovieTrailers } from "@/components/movies/movie-trailers";
import { MovieCollectionSection } from "@/components/movies/movie-collection";
import { MovieCreditsSection } from "@/components/movies/movie-credits";
import { RecommendedMoviesSection } from "@/components/movies/recommended-movies";
import {
  getMovieDetailsData,
  getMovieVideosData,
  getMovieCreditsData,
  getMovieCollectionData,
  getRecommendedMoviesData,
  getMovieInfoData,
} from "@/lib/movie-data";

export const dynamic = "force-dynamic";

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (isNaN(movieId)) {
    return { title: "Movie Not Found" };
  }

  const movie = await getMovieDetailsData(movieId);

  if (!movie) {
    return { title: "Movie Not Found" };
  }

  return {
    title: movie.title,
  };
}

async function MovieContent({ id }: { id: number }) {
  const movie = await getMovieDetailsData(id);

  if (!movie) {
    notFound();
  }

  const [videos, credits, collection, recommendedMovies, movieInfo] = await Promise.all([
    getMovieVideosData(id),
    getMovieCreditsData(id),
    movie.collectionId ? getMovieCollectionData(movie.collectionId) : Promise.resolve(null),
    getRecommendedMoviesData(id),
    getMovieInfoData(id),
  ]);

  return (
    <>
      <MovieHero movie={movie} movieInfo={movieInfo} />
      <div className="container mx-auto px-4">
        {videos.length > 0 && <MovieTrailers videos={videos} />}
        {collection && (
          <MovieCollectionSection collection={collection} currentMovieId={id} />
        )}
        {(credits.cast.length > 0 || credits.crew.length > 0) && (
          <MovieCreditsSection credits={credits} />
        )}
        {recommendedMovies.length > 0 && <RecommendedMoviesSection movies={recommendedMovies} />}
      </div>
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
