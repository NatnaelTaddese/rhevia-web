import { tmdb } from "@/lib/tmdb";

const STREAMING_CATALOG_BASE_URL = "https://7a82163c306e-stremio-netflix-catalog-addon.baby-beamup.club";

export interface StreamingCatalogItem {
  id: string;
  imdb_id: string;
  moviedb_id: number;
  name: string;
  type: "movie" | "series";
  poster: string;
  background: string;
  description: string;
  year: string;
  releaseInfo?: string;
  imdbRating: string;
  genres: string[];
  runtime: string;
  cast: string[];
  director: string[];
}

export interface StreamingProvider {
  id: string;
  name: string;
  logoUrl: string | null;
  tmdbProviderId: number;
}

const PROVIDER_NAME_MAP: Record<string, string> = {
  nfx: "Netflix",
  dnp: "Disney Plus",
  hbm: "HBO Max",
  amp: "Amazon Prime Video",
  atp: "Apple TV Plus",
  hlu: "Hulu",
  pmp: "Paramount Plus",
  pcp: "Peacock",
};

export const HOMEPAGE_PROVIDERS = ["nfx", "dnp", "hbm"];
export const ALL_PROVIDERS = ["nfx", "dnp", "hbm", "amp", "atp", "hlu", "pmp", "pcp"];

export interface StreamingCatalogMeta {
  id: string;
  name: string;
  posterUrl: string | null;
  year: string;
  voteAverage: number;
  tmdbId: number;
  type: "movie" | "series";
}

let providersCache: Map<string, StreamingProvider> | null = null;

async function getProvidersWithLogos(): Promise<Map<string, StreamingProvider>> {
  if (providersCache) {
    return providersCache;
  }

  try {
    const response = await tmdb.getWatchProvidersList("movie");
    const providers = new Map<string, StreamingProvider>();

    for (const [providerId, providerName] of Object.entries(PROVIDER_NAME_MAP)) {
      const tmdbProvider = response.results.find(
        (p) => p.provider_name.toLowerCase() === providerName.toLowerCase() ||
               p.provider_name.toLowerCase().includes(providerName.toLowerCase().replace(" plus", "")) ||
               providerName.toLowerCase().includes(p.provider_name.toLowerCase())
      );

      if (tmdbProvider) {
        providers.set(providerId, {
          id: providerId,
          name: tmdbProvider.provider_name,
          logoUrl: `https://image.tmdb.org/t/p/w92${tmdbProvider.logo_path}`,
          tmdbProviderId: tmdbProvider.provider_id,
        });
      } else {
        providers.set(providerId, {
          id: providerId,
          name: providerName,
          logoUrl: "",
          tmdbProviderId: 0,
        });
      }
    }

    providersCache = providers;
    return providers;
  } catch (error) {
    console.error("Failed to fetch providers:", error);
    
    const fallback = new Map<string, StreamingProvider>();
    for (const [providerId, providerName] of Object.entries(PROVIDER_NAME_MAP)) {
      fallback.set(providerId, {
        id: providerId,
        name: providerName,
        logoUrl: "",
        tmdbProviderId: 0,
      });
    }
    return fallback;
  }
}

export async function getStreamingProvider(providerId: string): Promise<StreamingProvider | undefined> {
  const providers = await getProvidersWithLogos();
  return providers.get(providerId);
}

export async function getAllStreamingProviders(): Promise<Map<string, StreamingProvider>> {
  return getProvidersWithLogos();
}

export async function getProviderLogos(): Promise<Map<string, { name: string; logoUrl: string | null }>> {
  const providers = await getProvidersWithLogos();
  const logos = new Map<string, { name: string; logoUrl: string | null }>();
  
  providers.forEach((provider, id) => {
    logos.set(id, { name: provider.name, logoUrl: provider.logoUrl });
  });
  
  return logos;
}

async function fetchStreamingCatalog(
  type: "movie" | "series",
  providerId: string
): Promise<StreamingCatalogMeta[]> {
  try {
    const response = await fetch(
      `${STREAMING_CATALOG_BASE_URL}/catalog/${type}/${providerId}.json`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} catalog for ${providerId}`);
    }

    const data = await response.json();

    return data.metas
      .filter((item: StreamingCatalogItem) => item.moviedb_id)
      .slice(0, 20)
      .map((item: StreamingCatalogItem) => ({
        id: item.id,
        name: item.name,
        posterUrl: item.poster,
        year: item.year || (item.releaseInfo ? item.releaseInfo.slice(0, 4) : ""),
        voteAverage: item.imdbRating ? parseFloat(item.imdbRating) : 0,
        tmdbId: item.moviedb_id,
        type: item.type,
      }));
  } catch (error) {
    console.error(`Failed to fetch streaming catalog: ${error}`);
    return [];
  }
}

export async function getStreamingCatalogs(
  type: "movie" | "series",
  providerIds: string[]
): Promise<Map<string, StreamingCatalogMeta[]>> {
  const results = new Map<string, StreamingCatalogMeta[]>();

  await Promise.all(
    providerIds.map(async (providerId) => {
      const catalog = await fetchStreamingCatalog(type, providerId);
      results.set(providerId, catalog);
    })
  );

  return results;
}
