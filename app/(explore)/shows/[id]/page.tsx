import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ShowHero } from "@/components/shows/show-hero";
import { ShowTrailers } from "@/components/shows/show-trailers";
import { ShowEpisodes } from "@/components/shows/show-episodes";
import { ShowCreditsSection } from "@/components/shows/show-credits";
import { RecommendedShowsSection } from "@/components/shows/recommended-shows";
import {
  getShowDetailsData,
  getShowVideosData,
  getShowCreditsData,
  getRecommendedShowsData,
  getShowInfoData,
} from "@/lib/show-data";
import { getSeasonEpisodesData } from "@/lib/show-actions";

export const dynamic = "force-dynamic";

interface ShowPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ShowContent({ id }: { id: number }) {
  const show = await getShowDetailsData(id);

  if (!show) {
    notFound();
  }

  const [videos, credits, recommendedShows, showInfo] = await Promise.all([
    getShowVideosData(id),
    getShowCreditsData(id),
    getRecommendedShowsData(id),
    getShowInfoData(id),
  ]);

  // Fetch first season data
  const initialSeasonData = new Map();
  if (show.seasons.length > 0) {
    const firstSeason = show.seasons[0];
    const seasonData = await getSeasonEpisodesData(id, firstSeason.seasonNumber);
    if (seasonData) {
      initialSeasonData.set(firstSeason.seasonNumber, seasonData);
    }
  }

  return (
    <>
      <ShowHero show={show} showInfo={showInfo} />
      <div className="container mx-auto px-4">
        {videos.length > 0 && <ShowTrailers videos={videos} />}
        {show.seasons.length > 0 && (
          <ShowEpisodes
            seasons={show.seasons}
            initialSeasonData={initialSeasonData}
            showId={id}
          />
        )}
        {(credits.cast.length > 0 || credits.crew.length > 0) && (
          <ShowCreditsSection credits={credits} />
        )}
        {recommendedShows.length > 0 && <RecommendedShowsSection shows={recommendedShows} />}
      </div>
    </>
  );
}

function ShowSkeleton() {
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

export default async function ShowPage({ params }: ShowPageProps) {
  const { id } = await params;
  const showId = parseInt(id, 10);

  if (isNaN(showId)) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Suspense fallback={<ShowSkeleton />}>
        <ShowContent id={showId} />
      </Suspense>
    </main>
  );
}
