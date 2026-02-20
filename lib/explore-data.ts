import { tmdb, getBackdropUrl, type TMDBMovie } from "@/lib/tmdb";

export interface HeroMovie {
  id: number;
  title: string;
  overview: string;
  backdropUrl: string;
  releaseYear: string;
  voteAverage: number;
}

export async function getTrendingMovies(limit = 10): Promise<HeroMovie[]> {
  try {
    const response = await tmdb.getTrendingMovies("week");

    // Filter movies that have backdrop images and transform them
    const movies = response.results
      .filter(
        (movie): movie is TMDBMovie & { backdrop_path: string } =>
          movie.backdrop_path !== null,
      )
      .slice(0, limit)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        backdropUrl: getBackdropUrl(movie.backdrop_path, "original") as string,
        releaseYear: movie.release_date ? movie.release_date.split("-")[0] : "",
        voteAverage: Math.round(movie.vote_average * 10) / 10,
      }));

    return movies;
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    return [];
  }
}

export async function getPopularMovies(limit = 20): Promise<HeroMovie[]> {
  try {
    const response = await tmdb.getPopularMovies();

    const movies = response.results
      .filter(
        (movie): movie is TMDBMovie & { backdrop_path: string } =>
          movie.backdrop_path !== null,
      )
      .slice(0, limit)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        backdropUrl: getBackdropUrl(movie.backdrop_path, "original") as string,
        releaseYear: movie.release_date ? movie.release_date.split("-")[0] : "",
        voteAverage: Math.round(movie.vote_average * 10) / 10,
      }));

    return movies;
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return [];
  }
}

export async function getNowPlayingMovies(limit = 20): Promise<HeroMovie[]> {
  try {
    const response = await tmdb.getNowPlayingMovies();

    const movies = response.results
      .filter(
        (movie): movie is TMDBMovie & { backdrop_path: string } =>
          movie.backdrop_path !== null,
      )
      .slice(0, limit)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        backdropUrl: getBackdropUrl(movie.backdrop_path, "original") as string,
        releaseYear: movie.release_date ? movie.release_date.split("-")[0] : "",
        voteAverage: Math.round(movie.vote_average * 10) / 10,
      }));

    return movies;
  } catch (error) {
    console.error("Failed to fetch now playing movies:", error);
    return [];
  }
}
