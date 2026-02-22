"use server";

import { tmdb, getBackdropUrl } from "@/lib/tmdb";
import type { SeasonEpisodes } from "@/lib/show-data";

export async function getSeasonEpisodesData(tvId: number, seasonNumber: number): Promise<SeasonEpisodes | null> {
  try {
    const season = await tmdb.getTVSeasonDetails(tvId, seasonNumber);

    return {
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
  } catch (error) {
    console.error(`Failed to fetch season ${seasonNumber}:`, error);
    return null;
  }
}
