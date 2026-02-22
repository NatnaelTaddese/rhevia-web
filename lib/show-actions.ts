"use server";

import { tmdb } from "@/lib/tmdb";
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
        stillUrl: ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : null,
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
