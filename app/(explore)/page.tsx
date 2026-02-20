import { Suspense } from "react";
import { HeroCarousel } from "@/components/explore/hero-carousel";
import { HeroSkeleton } from "@/components/explore/hero-skeleton";
import { getTrendingMovies } from "@/lib/explore-data";

async function HeroSection() {
  const movies = await getTrendingMovies();
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
