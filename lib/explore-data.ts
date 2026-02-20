import { tmdb, getBackdropUrl, getLogoUrl, type TMDBMovie } from "@/lib/tmdb";

export interface HeroMovie {
  id: number;
  title: string;
  overview: string;
  backdropUrl: string;
  logoUrl: string | null;
  releaseYear: string;
  voteAverage: number;
}

export async function getTrendingMovies(limit = 10): Promise<HeroMovie[]> {
  try {
    const response = await tmdb.getTrendingMovies("week");

    // Filter movies that have backdrop images
    const filteredMovies = response.results
      .filter(
        (movie): movie is TMDBMovie & { backdrop_path: string } =>
          movie.backdrop_path !== null,
      )
      .slice(0, limit);

    // Fetch logos for each movie in parallel
    const moviesWithLogos = await Promise.all(
      filteredMovies.map(async (movie) => {
        let logoUrl: string | null = null;

        try {
          const images = await tmdb.getMovieImages(movie.id);
          // Get the first English logo, or any logo if no English one exists
          const logo =
            images.logos.find((l) => l.iso_639_1 === "en") || images.logos[0];
          if (logo) {
            logoUrl = getLogoUrl(logo.file_path, "w500");
          }
        } catch {
          // If logo fetch fails, we'll just use the title
        }

        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          backdropUrl: getBackdropUrl(
            movie.backdrop_path,
            "original",
          ) as string,
          logoUrl,
          releaseYear: movie.release_date
            ? movie.release_date.split("-")[0]
            : "",
          voteAverage: Math.round(movie.vote_average * 10) / 10,
        };
      }),
    );

    return moviesWithLogos;
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    return [];
  }
}

export async function getPopularMovies(limit = 20): Promise<HeroMovie[]> {
  try {
    const response = await tmdb.getPopularMovies();

    const filteredMovies = response.results
      .filter(
        (movie): movie is TMDBMovie & { backdrop_path: string } =>
          movie.backdrop_path !== null,
      )
      .slice(0, limit);

    const moviesWithLogos = await Promise.all(
      filteredMovies.map(async (movie) => {
        let logoUrl: string | null = null;

        try {
          const images = await tmdb.getMovieImages(movie.id);
          const logo =
            images.logos.find((l) => l.iso_639_1 === "en") || images.logos[0];
          if (logo) {
            logoUrl = getLogoUrl(logo.file_path, "w500");
          }
        } catch {
          // If logo fetch fails, we'll just use the title
        }

        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          backdropUrl: getBackdropUrl(
            movie.backdrop_path,
            "original",
          ) as string,
          logoUrl,
          releaseYear: movie.release_date
            ? movie.release_date.split("-")[0]
            : "",
          voteAverage: Math.round(movie.vote_average * 10) / 10,
        };
      }),
    );

    return moviesWithLogos;
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return [];
  }
}

export async function getNowPlayingMovies(limit = 20): Promise<HeroMovie[]> {
  try {
    const response = await tmdb.getNowPlayingMovies();

    const filteredMovies = response.results
      .filter(
        (movie): movie is TMDBMovie & { backdrop_path: string } =>
          movie.backdrop_path !== null,
      )
      .slice(0, limit);

    const moviesWithLogos = await Promise.all(
      filteredMovies.map(async (movie) => {
        let logoUrl: string | null = null;

        try {
          const images = await tmdb.getMovieImages(movie.id);
          const logo =
            images.logos.find((l) => l.iso_639_1 === "en") || images.logos[0];
          if (logo) {
            logoUrl = getLogoUrl(logo.file_path, "w500");
          }
        } catch {
          // If logo fetch fails, we'll just use the title
        }

        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          backdropUrl: getBackdropUrl(
            movie.backdrop_path,
            "original",
          ) as string,
          logoUrl,
          releaseYear: movie.release_date
            ? movie.release_date.split("-")[0]
            : "",
          voteAverage: Math.round(movie.vote_average * 10) / 10,
        };
      }),
    );

    return moviesWithLogos;
  } catch (error) {
    console.error("Failed to fetch now playing movies:", error);
    return [];
  }
}
