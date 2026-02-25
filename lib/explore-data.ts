import { tmdb, getBackdropUrl, getPosterUrl, getLogoUrl, type TMDBMovie, type TMDBTVShow } from "@/lib/tmdb";

const CACHE_TTL = 3600 * 1000; // 1 hour
const DETAILS_CACHE_TTL = 86400 * 1000; // 24 hours

let top10MoviesCache: { data: Top10Item[]; timestamp: number } | null = null;
let top10TVShowsCache: { data: Top10Item[]; timestamp: number } | null = null;
let trendingMoviesCache: { data: HeroMovie[]; timestamp: number } | null = null;
let popularMoviesCache: { data: HeroMovie[]; timestamp: number } | null = null;
let nowPlayingMoviesCache: { data: HeroMovie[]; timestamp: number } | null = null;
let popularMoviesCardsCache: { data: MovieCardData[]; timestamp: number } | null = null;
let popularTVShowsCardsCache: { data: TVShowCardData[]; timestamp: number } | null = null;

export interface HeroMovie {
  id: number;
  title: string;
  overview: string;
  backdropUrl: string;
  logoUrl: string | null;
  releaseYear: string;
  voteAverage: number;
}

export interface Top10Item {
  id: number;
  tmdbId: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  logoUrl: string | null;
  year: string;
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

export async function getTop10Movies(): Promise<Top10Item[]> {
  // Check cache first
  if (top10MoviesCache && Date.now() - top10MoviesCache.timestamp < CACHE_TTL) {
    return top10MoviesCache.data;
  }

  try {
    const response = await tmdb.getTrendingMovies("week");

    const filteredMovies = response.results
      .filter(
        (movie): movie is TMDBMovie & { backdrop_path: string; poster_path: string } =>
          movie.backdrop_path !== null && movie.poster_path !== null,
      )
      .slice(0, 10);

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
          tmdbId: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterUrl: getPosterUrl(movie.poster_path, "large") as string,
          backdropUrl: getBackdropUrl(movie.backdrop_path, "large") as string,
          logoUrl,
          year: movie.release_date ? movie.release_date.split("-")[0] : "",
          voteAverage: Math.round(movie.vote_average * 10) / 10,
        };
      }),
    );

    // Update cache
    top10MoviesCache = { data: moviesWithLogos, timestamp: Date.now() };
    return moviesWithLogos;
  } catch (error) {
    console.error("Failed to fetch top 10 movies:", error);
    return [];
  }
}

export async function getTop10TVShows(): Promise<Top10Item[]> {
  // Check cache first
  if (top10TVShowsCache && Date.now() - top10TVShowsCache.timestamp < CACHE_TTL) {
    return top10TVShowsCache.data;
  }

  try {
    const response = await tmdb.getTrendingTVShows("week");

    const filteredShows = response.results
      .filter(
        (show): show is TMDBTVShow & { backdrop_path: string; poster_path: string } =>
          show.backdrop_path !== null && show.poster_path !== null,
      )
      .slice(0, 10);

    const showsWithLogos = await Promise.all(
      filteredShows.map(async (show) => {
        let logoUrl: string | null = null;

        try {
          const images = await tmdb.getTVImages(show.id);
          const logo =
            images.logos.find((l) => l.iso_639_1 === "en") || images.logos[0];
          if (logo) {
            logoUrl = getLogoUrl(logo.file_path, "w500");
          }
        } catch {
          // If logo fetch fails, we'll just use the title
        }

        return {
          id: show.id,
          tmdbId: show.id,
          title: show.name,
          overview: show.overview,
          posterUrl: getPosterUrl(show.poster_path, "large") as string,
          backdropUrl: getBackdropUrl(show.backdrop_path, "large") as string,
          logoUrl,
          year: show.first_air_date ? show.first_air_date.split("-")[0] : "",
          voteAverage: Math.round(show.vote_average * 10) / 10,
        };
      }),
    );

    // Update cache
    top10TVShowsCache = { data: showsWithLogos, timestamp: Date.now() };
    return showsWithLogos;
  } catch (error) {
    console.error("Failed to fetch top 10 TV shows:", error);
    return [];
  }
}

export async function getTrendingMovies(limit = 10): Promise<HeroMovie[]> {
  if (trendingMoviesCache && Date.now() - trendingMoviesCache.timestamp < CACHE_TTL) {
    return trendingMoviesCache.data.slice(0, limit);
  }

  try {
    const response = await tmdb.getTrendingMovies("week");

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
            "large",
          ) as string,
          logoUrl,
          releaseYear: movie.release_date
            ? movie.release_date.split("-")[0]
            : "",
          voteAverage: Math.round(movie.vote_average * 10) / 10,
        };
      }),
    );

    trendingMoviesCache = { data: moviesWithLogos, timestamp: Date.now() };
    return moviesWithLogos;
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    return [];
  }
}

export async function getPopularMovies(limit = 20): Promise<HeroMovie[]> {
  if (popularMoviesCache && Date.now() - popularMoviesCache.timestamp < CACHE_TTL) {
    return popularMoviesCache.data.slice(0, limit);
  }

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
            "large",
          ) as string,
          logoUrl,
          releaseYear: movie.release_date
            ? movie.release_date.split("-")[0]
            : "",
          voteAverage: Math.round(movie.vote_average * 10) / 10,
        };
      }),
    );

    popularMoviesCache = { data: moviesWithLogos, timestamp: Date.now() };
    return moviesWithLogos;
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return [];
  }
}

export async function getNowPlayingMovies(limit = 20): Promise<HeroMovie[]> {
  if (nowPlayingMoviesCache && Date.now() - nowPlayingMoviesCache.timestamp < CACHE_TTL) {
    return nowPlayingMoviesCache.data.slice(0, limit);
  }

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
            "large",
          ) as string,
          logoUrl,
          releaseYear: movie.release_date
            ? movie.release_date.split("-")[0]
            : "",
          voteAverage: Math.round(movie.vote_average * 10) / 10,
        };
      }),
    );

    nowPlayingMoviesCache = { data: moviesWithLogos, timestamp: Date.now() };
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

    const result = filteredMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      posterUrl: getPosterUrl(movie.poster_path, "medium") as string,
      releaseYear: movie.release_date ? movie.release_date.split("-")[0] : "",
      voteAverage: Math.round(movie.vote_average * 10) / 10,
    }));

    popularMoviesCardsCache = { data: result, timestamp: Date.now() };
    return result;
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return [];
  }
}

export async function getPopularTVShowsCards(limit = 20): Promise<TVShowCardData[]> {
  if (popularTVShowsCardsCache && Date.now() - popularTVShowsCardsCache.timestamp < CACHE_TTL) {
    return popularTVShowsCardsCache.data.slice(0, limit);
  }
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

    popularTVShowsCardsCache = { data: showsWithDetails, timestamp: Date.now() };
    return showsWithDetails;
  } catch (error) {
    console.error("Failed to fetch popular TV shows:", error);
    return [];
  }
}
