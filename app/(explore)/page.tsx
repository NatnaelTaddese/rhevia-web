import { Suspense } from "react";

import { HeroCarousel } from "@/components/explore/hero-carousel";
import { HeroSkeleton } from "@/components/explore/hero-skeleton";
import { getTrendingMovies } from "@/lib/explore-data";

// Force dynamic rendering to avoid TMDB API calls at build time
export const dynamic = "force-dynamic";

async function HeroSection() {
  const movies = await getTrendingMovies();

  if (!movies.length) {
    return (
      <section className="relative w-full h-[70vh] min-h-125 max-h-225 overflow-hidden">
        <div className="absolute inset-0 bg-muted" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
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

export default function Page() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
    </main>
  );
}
