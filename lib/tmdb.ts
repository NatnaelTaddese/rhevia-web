const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Image size configurations
export const TMDB_IMAGE_SIZES = {
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    large: "h632",
    original: "original",
  },
} as const;

// Type definitions
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  video: boolean;
}

export interface TMDBImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBImagesResponse {
  id: number;
  backdrops: TMDBImage[];
  logos: TMDBImage[];
  posters: TMDBImage[];
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
}

export interface TMDBTVShowDetails {
  id: number;
  name: string;
  original_name: string;
  tagline: string;
  overview: string;
  first_air_date: string;
  last_air_date: string | null;
  in_production: boolean;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  status: string;
  type: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  genres: TMDBGenre[];
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  origin_country: string[];
  original_language: string;
  seasons: TMDBSeason[];
}

export interface TMDBSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  overview: string;
  air_date: string | null;
  poster_path: string | null;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface TMDBSeasonDetails {
  id: number;
  name: string;
  season_number: number;
  episodes: TMDBEpisode[];
}

export interface TMDBContentRatingsResponse {
  id: number;
  results: {
    iso_3166_1: string;
    rating: string;
  }[];
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  original_title: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  budget: number;
  revenue: number;
  status: string;
  genres: TMDBGenre[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  origin_country: string[];
  original_language: string;
  adult: boolean;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBVideosResponse {
  id: number;
  results: TMDBVideo[];
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBCreditsResponse {
  id: number;
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

export interface TMDBCollection {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    overview: string;
  }[];
}

export interface TMDBWatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface TMDBWatchProvidersResponse {
  id: number;
  results: {
    [countryCode: string]: {
      link: string;
      flatrate?: TMDBWatchProvider[];
      rent?: TMDBWatchProvider[];
      buy?: TMDBWatchProvider[];
    };
  };
}

export interface TMDBReleaseDate {
  certification: string;
  iso_639_1: string;
  note: string;
  release_date: string;
  type: number;
}

export interface TMDBReleaseDatesResponse {
  id: number;
  results: {
    iso_3166_1: string;
    release_dates: TMDBReleaseDate[];
  }[];
}

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  original_title: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  budget: number;
  revenue: number;
  status: string;
  genres: TMDBGenre[];
  belongs_to_collection: TMDBCollection | null;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  origin_country: string[];
  original_language: string;
  adult: boolean;
}

// Helper functions
export function getImageUrl(
  path: string | null,
  type: keyof typeof TMDB_IMAGE_SIZES,
  size: keyof (typeof TMDB_IMAGE_SIZES)[typeof type],
): string | null {
  if (!path) return null;
  const sizeValue =
    TMDB_IMAGE_SIZES[type][
      size as keyof (typeof TMDB_IMAGE_SIZES)[typeof type]
    ];
  return `${TMDB_IMAGE_BASE_URL}/${sizeValue}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: keyof typeof TMDB_IMAGE_SIZES.backdrop = "large",
): string | null {
  return getImageUrl(path, "backdrop", size);
}

export function getPosterUrl(
  path: string | null,
  size: keyof typeof TMDB_IMAGE_SIZES.poster = "medium",
): string | null {
  return getImageUrl(path, "poster", size);
}

export function getLogoUrl(
  path: string | null,
  size: "w185" | "w300" | "w500" | "original" = "w500",
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// API client
class TMDBClient {
  private get accessToken(): string {
    const token = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
    if (!token) {
      throw new Error(
        "TMDB API access token is not configured. Please set NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN in your .env file.",
      );
    }
    return token;
  }

  private async fetch<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);

    // Add query params
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      });

      if (!response.ok) {
        throw new Error(
          `TMDB API error: ${response.status} ${response.statusText}`,
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(
            `TMDB API request timed out after 10 seconds. Please check your network connection.`,
          );
        }
        // Re-throw with more context
        throw new Error(`TMDB API request failed: ${error.message}`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Trending
  async getTrendingMovies(
    timeWindow: "day" | "week" = "week",
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/trending/movie/${timeWindow}`,
      { page: page.toString() },
    );
  }

  async getTrendingTVShows(
    timeWindow: "day" | "week" = "week",
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetch<TMDBPaginatedResponse<TMDBTVShow>>(
      `/trending/tv/${timeWindow}`,
      { page: page.toString() },
    );
  }

  // Popular
  async getPopularMovies(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/popular", {
      page: page.toString(),
    });
  }

  async getPopularTVShows(
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetch<TMDBPaginatedResponse<TMDBTVShow>>("/tv/popular", {
      page: page.toString(),
    });
  }

  // Now Playing / On The Air
  async getNowPlayingMovies(
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/now_playing", {
      page: page.toString(),
    });
  }

  async getOnTheAirTVShows(
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetch<TMDBPaginatedResponse<TMDBTVShow>>("/tv/on_the_air", {
      page: page.toString(),
    });
  }

  // Top Rated
  async getTopRatedMovies(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/top_rated", {
      page: page.toString(),
    });
  }

  async getTopRatedTVShows(
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetch<TMDBPaginatedResponse<TMDBTVShow>>("/tv/top_rated", {
      page: page.toString(),
    });
  }

  // Upcoming
  async getUpcomingMovies(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/upcoming", {
      page: page.toString(),
    });
  }

  // Images (logos, backdrops, posters)
  async getMovieImages(
    movieId: number,
    includeLanguages = "en,null",
  ): Promise<TMDBImagesResponse> {
    return this.fetch<TMDBImagesResponse>(`/movie/${movieId}/images`, {
      include_image_language: includeLanguages,
    });
  }

  async getTVImages(
    tvId: number,
    includeLanguages = "en,null",
  ): Promise<TMDBImagesResponse> {
    return this.fetch<TMDBImagesResponse>(`/tv/${tvId}/images`, {
      include_image_language: includeLanguages,
    });
  }

  // Genres
  async getMovieGenres(): Promise<TMDBGenresResponse> {
    return this.fetch<TMDBGenresResponse>("/genre/movie/list");
  }

  async getTVGenres(): Promise<TMDBGenresResponse> {
    return this.fetch<TMDBGenresResponse>("/genre/tv/list");
  }

  // Search
  async searchMovies(
    query: string,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>("/search/movie", {
      query,
      page: page.toString(),
    });
  }

  async searchTVShows(
    query: string,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetch<TMDBPaginatedResponse<TMDBTVShow>>("/search/tv", {
      query,
      page: page.toString(),
    });
  }

  // TV Show Details
  async getTVShowDetails(tvId: number): Promise<TMDBTVShowDetails> {
    return this.fetch<TMDBTVShowDetails>(`/tv/${tvId}`);
  }

  // Movie Details
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return this.fetch<TMDBMovieDetails>(`/movie/${movieId}`);
  }

  // Movie Videos (trailers, etc.)
  async getMovieVideos(movieId: number): Promise<TMDBVideosResponse> {
    return this.fetch<TMDBVideosResponse>(`/movie/${movieId}/videos`);
  }

  // Movie Credits (cast & crew)
  async getMovieCredits(movieId: number): Promise<TMDBCreditsResponse> {
    return this.fetch<TMDBCreditsResponse>(`/movie/${movieId}/credits`);
  }

  // Collection
  async getCollection(collectionId: number): Promise<TMDBCollection> {
    return this.fetch<TMDBCollection>(`/collection/${collectionId}`);
  }

  // Similar Movies
  async getSimilarMovies(
    movieId: number,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/movie/${movieId}/similar`,
      { page: page.toString() },
    );
  }

  // Movie Recommendations
  async getMovieRecommendations(
    movieId: number,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/movie/${movieId}/recommendations`,
      { page: page.toString() },
    );
  }

  // Watch Providers
  async getMovieWatchProviders(movieId: number): Promise<TMDBWatchProvidersResponse> {
    return this.fetch<TMDBWatchProvidersResponse>(`/movie/${movieId}/watch/providers`);
  }

  // Release Dates (for age ratings)
  async getMovieReleaseDates(movieId: number): Promise<TMDBReleaseDatesResponse> {
    return this.fetch<TMDBReleaseDatesResponse>(`/movie/${movieId}/release_dates`);
  }

  // TV Show Videos
  async getTVVideos(tvId: number): Promise<TMDBVideosResponse> {
    return this.fetch<TMDBVideosResponse>(`/tv/${tvId}/videos`);
  }

  // TV Show Credits
  async getTVCredits(tvId: number): Promise<TMDBCreditsResponse> {
    return this.fetch<TMDBCreditsResponse>(`/tv/${tvId}/credits`);
  }

  // Similar TV Shows
  async getSimilarTVShows(
    tvId: number,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetch<TMDBPaginatedResponse<TMDBTVShow>>(
      `/tv/${tvId}/similar`,
      { page: page.toString() },
    );
  }

  // TV Show Recommendations
  async getTVRecommendations(
    tvId: number,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetch<TMDBPaginatedResponse<TMDBTVShow>>(
      `/tv/${tvId}/recommendations`,
      { page: page.toString() },
    );
  }

  // TV Watch Providers
  async getTVWatchProviders(tvId: number): Promise<TMDBWatchProvidersResponse> {
    return this.fetch<TMDBWatchProvidersResponse>(`/tv/${tvId}/watch/providers`);
  }

  // TV Content Ratings (for age ratings)
  async getTVContentRatings(tvId: number): Promise<TMDBContentRatingsResponse> {
    return this.fetch<TMDBContentRatingsResponse>(`/tv/${tvId}/content_ratings`);
  }

  // TV Season Details
  async getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<TMDBSeasonDetails> {
    return this.fetch<TMDBSeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
  }
}

// Export singleton instance
export const tmdb = new TMDBClient();
