import { Suspense } from "react";

import { HeroCarousel } from "@/components/explore/hero-carousel";
import { HeroSkeleton } from "@/components/explore/hero-skeleton";
import { PopularMoviesSection } from "@/components/explore/popular-movies-section";
import { PopularSeriesSection } from "@/components/explore/popular-series-section";
import { getTrendingMovies, getPopularMoviesCards, getPopularTVShowsCards } from "@/lib/explore-data";

export const dynamic = "force-dynamic";

async function HeroSection() {
  const movies = await getTrendingMovies();

  if (!movies.length) {
    return (
      <section className="relative w-full h-[70vh] min-h-125 max-h-225 overflow-hidden">
        <div className="absolute inset-0 bg-muted" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-muted-foreground">
              Unable to load trending movies
            </h2>
            <p className="text-sm text-muted-foreground">
              Please check your connection and try again later
            </p>
          </div>
        </div>
      </section>
    );
  }

  return <HeroCarousel movies={movies} />;
}

async function PopularMoviesSectionWrapper() {
  const movies = await getPopularMoviesCards(20);
  return <PopularMoviesSection movies={movies} />;
}

async function PopularSeriesSectionWrapper() {
  const series = await getPopularTVShowsCards(20);
  return <PopularSeriesSection series={series} />;
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={null}>
        <PopularMoviesSectionWrapper />
      </Suspense>
      <Suspense fallback={null}>
        <PopularSeriesSectionWrapper />
      </Suspense>
    </main>
  );
}
