"use server";

import { tmdb, getBackdropUrl } from "@/lib/tmdb";
import type { SeasonEpisodes } from "@/lib/show-data";

const DETAILS_CACHE_TTL = 86400 * 1000; // 24 hours
const seasonEpisodesCache = new Map<string, { data: SeasonEpisodes | null; timestamp: number }>();

export async function getSeasonEpisodesData(tvId: number, seasonNumber: number): Promise<SeasonEpisodes | null> {
  const cacheKey = `${tvId}-${seasonNumber}`;
  const cached = seasonEpisodesCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const season = await tmdb.getTVSeasonDetails(tvId, seasonNumber);

    const result = {
      seasonNumber: season.season_number,
      seasonName: season.name,
      episodes: season.episodes.map((ep) => ({
        id: ep.id,
        name: ep.name,
        overview: ep.overview,
        episodeNumber: ep.episode_number,
        seasonNumber: ep.season_number,
        stillUrl: getBackdropUrl(ep.still_path, "medium"),
        airDate: ep.air_date,
        runtime: ep.runtime,
        voteAverage: Math.round(ep.vote_average * 10) / 10,
      })),
    };

    seasonEpisodesCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error(`Failed to fetch season ${seasonNumber}:`, error);
    return null;
  }
}
