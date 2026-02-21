import { tmdb, getBackdropUrl, getPosterUrl, getLogoUrl, type TMDBMovie, type TMDBTVShow } from "@/lib/tmdb";

export interface HeroMovie {
  id: number;
  title: string;
  overview: string;
  backdropUrl: string;
  logoUrl: string | null;
  releaseYear: string;
  voteAverage: number;
}

export interface MovieCardData {
  id: number;
  title: string;
  posterUrl: string;
  releaseYear: string;
  voteAverage: number;
}

export interface TVShowCardData {
  id: number;
  title: string;
  posterUrl: string;
  airDateRange: string;
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

export async function getPopularMoviesCards(limit = 20): Promise<MovieCardData[]> {
  try {
    const response = await tmdb.getPopularMovies();

    const filteredMovies = response.results
      .filter(
        (movie): movie is TMDBMovie & { poster_path: string } =>
          movie.poster_path !== null,
      )
      .slice(0, limit);

    return filteredMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      posterUrl: getPosterUrl(movie.poster_path, "medium") as string,
      releaseYear: movie.release_date ? movie.release_date.split("-")[0] : "",
      voteAverage: Math.round(movie.vote_average * 10) / 10,
    }));
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return [];
  }
}

export async function getPopularTVShowsCards(limit = 20): Promise<TVShowCardData[]> {
  try {
    const response = await tmdb.getPopularTVShows();

    const filteredShows = response.results
      .filter(
        (show): show is TMDBTVShow & { poster_path: string } =>
          show.poster_path !== null,
      )
      .slice(0, limit);

    const showsWithDetails = await Promise.all(
      filteredShows.map(async (show) => {
        let airDateRange = "";
        const firstYear = show.first_air_date
          ? show.first_air_date.split("-")[0]
          : "";

        try {
          const details = await tmdb.getTVShowDetails(show.id);
          const firstYearDetail = details.first_air_date
            ? details.first_air_date.split("-")[0]
            : firstYear;
          const lastYear = details.last_air_date
            ? details.last_air_date.split("-")[0]
            : "";

          if (firstYearDetail) {
            if (details.in_production) {
              airDateRange = `${firstYearDetail} - Present`;
            } else if (lastYear && firstYearDetail !== lastYear) {
              airDateRange = `${firstYearDetail} - ${lastYear}`;
            } else {
              airDateRange = firstYearDetail;
            }
          }
        } catch (error) {
          console.error(`Failed to fetch details for TV show ${show.id}:`, error);
          airDateRange = firstYear;
        }

        return {
          id: show.id,
          title: show.name,
          posterUrl: getPosterUrl(show.poster_path, "medium") as string,
          airDateRange,
          voteAverage: Math.round(show.vote_average * 10) / 10,
        };
      }),
    );

    return showsWithDetails;
  } catch (error) {
    console.error("Failed to fetch popular TV shows:", error);
    return [];
  }
}
