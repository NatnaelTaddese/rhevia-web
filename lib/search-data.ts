"use server";

import { tmdb, getPosterUrl, type TMDBMovie, type TMDBTVShow } from "./tmdb";
import type { MovieCardData } from "@/components/explore/movie-card";
import type { SeriesCardData } from "@/components/explore/series-card";

function formatMovieCard(movie: TMDBMovie): MovieCardData {
  return {
    id: movie.id,
    title: movie.title,
    posterUrl: getPosterUrl(movie.poster_path, "medium") || "",
    releaseYear: movie.release_date?.split("-")[0] || "",
    voteAverage: Math.round(movie.vote_average * 10) / 10,
  };
}

function formatSeriesCard(show: TMDBTVShow): SeriesCardData {
  return {
    id: show.id,
    title: show.name,
    posterUrl: getPosterUrl(show.poster_path, "medium") || "",
    airDateRange: show.first_air_date?.split("-")[0] || "",
    voteAverage: Math.round(show.vote_average * 10) / 10,
  };
}

export async function searchContent(query: string): Promise<{
  movies: MovieCardData[];
  shows: SeriesCardData[];
}> {
  if (!query.trim()) {
    return { movies: [], shows: [] };
  }

  try {
    const [moviesResponse, showsResponse] = await Promise.all([
      tmdb.searchMovies(query, 1),
      tmdb.searchTVShows(query, 1),
    ]);

    return {
      movies: moviesResponse.results.slice(0, 10).map(formatMovieCard),
      shows: showsResponse.results.slice(0, 10).map(formatSeriesCard),
    };
  } catch (error) {
    console.error("Search failed:", error);
    return { movies: [], shows: [] };
  }
}
