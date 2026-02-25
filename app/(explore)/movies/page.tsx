import { Suspense } from "react";
import type { Metadata } from "next";

import { Top10Hero } from "@/components/explore/top10-hero";
import { StreamingCatalogSection } from "@/components/explore/streaming-catalog-section";
import { getTop10Movies } from "@/lib/explore-data";
import {
  getStreamingCatalogs,
  getProviderLogos,
  ALL_PROVIDERS,
  type StreamingProvider,
} from "@/lib/streaming-catalog";

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Movies",
};

async function Top10Section() {
  const items = await getTop10Movies();

  if (!items.length) return null;

  return <Top10Hero items={items} type="movie" />;
}

async function StreamingCatalogsGrid() {
  const [catalogs, providerLogos] = await Promise.all([
    getStreamingCatalogs("movie", ALL_PROVIDERS),
    getProviderLogos(),
  ]);

  return (
    <>
      {ALL_PROVIDERS.map((providerId) => {
        const logoData = providerLogos.get(providerId);
        const provider: StreamingProvider = {
          id: providerId,
          name: logoData?.name || providerId.toUpperCase(),
          logoUrl: logoData?.logoUrl || null,
          tmdbProviderId: 0,
        };

        const items = catalogs.get(providerId) || [];

        if (!items.length) return null;

        return (
          <StreamingCatalogSection
            key={providerId}
            provider={provider}
            items={items}
            type="movie"
          />
        );
      })}
    </>
  );
}

export default function MoviesPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <Top10Section />
      </Suspense>
      <Suspense fallback={null}>
        <StreamingCatalogsGrid />
      </Suspense>
    </main>
  );
}
