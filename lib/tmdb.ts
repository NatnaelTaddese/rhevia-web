const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Cache TTL configuration (in seconds)
// Different data types have different freshness requirements
const CACHE_TTL = {
  // Static data - rarely changes
  movieDetails: 172800, // 48 hours
  showDetails: 172800, // 48 hours
  credits: 86400, // 24 hours
  images: 86400, // 24 hours (posters, backdrops, logos)
  videos: 86400, // 24 hours
  collection: 172800, // 48 hours
  
  // Semi-static data - changes occasionally
  similar: 43200, // 12 hours
  recommended: 43200, // 12 hours
  
  // Dynamic data - changes more frequently
  trending: 7200, // 2 hours
  popular: 14400, // 4 hours
  nowPlaying: 7200, // 2 hours
  onTheAir: 7200, // 2 hours
  topRated: 28800, // 8 hours
  upcoming: 28800, // 8 hours
  watchProviders: 86400, // 24 hours
  genres: 604800, // 1 week
} as const;

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
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
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

export interface TMDBProvidersListResponse {
  results: TMDBWatchProvider[];
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

// In-flight request deduplication cache
// Prevents duplicate API calls when multiple components request the same data
const inFlightRequests = new Map<string, Promise<unknown>>();

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

  private async fetchWithDeduplication<T>(
    endpoint: string,
    params: Record<string, string> = {},
    cacheDuration: number,
  ): Promise<T> {
    // Create a unique cache key from endpoint + params
    const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    const cacheKey = url.toString();

    // Check if there's already an in-flight request for this URL
    const existingRequest = inFlightRequests.get(cacheKey);
    if (existingRequest) {
      return existingRequest as Promise<T>;
    }

    // Create the request
    const requestPromise = this.executeFetch<T>(cacheKey, cacheDuration);

    // Store in in-flight cache
    inFlightRequests.set(cacheKey, requestPromise);

    // Clean up after request completes (success or failure)
    requestPromise
      .then(() => {
        inFlightRequests.delete(cacheKey);
      })
      .catch(() => {
        inFlightRequests.delete(cacheKey);
      });

    return requestPromise;
  }

  private async executeFetch<T>(url: string, cacheDuration: number): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        next: {
          revalidate: cacheDuration, // Use dynamic cache duration based on data type
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
        throw new Error(`TMDB API request failed: ${error.message}`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Trending (dynamic - 2 hours)
  async getTrendingMovies(
    timeWindow: "day" | "week" = "week",
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBMovie>>(
      `/trending/movie/${timeWindow}`,
      { page: page.toString() },
      CACHE_TTL.trending,
    );
  }

  async getTrendingTVShows(
    timeWindow: "day" | "week" = "week",
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBTVShow>>(
      `/trending/tv/${timeWindow}`,
      { page: page.toString() },
      CACHE_TTL.trending,
    );
  }

  // Popular (4 hours)
  async getPopularMovies(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBMovie>>(
      "/movie/popular",
      { page: page.toString() },
      CACHE_TTL.popular,
    );
  }

  async getPopularTVShows(
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBTVShow>>(
      "/tv/popular",
      { page: page.toString() },
      CACHE_TTL.popular,
    );
  }

  // Now Playing / On The Air (2 hours)
  async getNowPlayingMovies(
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBMovie>>(
      "/movie/now_playing",
      { page: page.toString() },
      CACHE_TTL.nowPlaying,
    );
  }

  async getOnTheAirTVShows(
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBTVShow>>(
      "/tv/on_the_air",
      { page: page.toString() },
      CACHE_TTL.onTheAir,
    );
  }

  // Top Rated (8 hours)
  async getTopRatedMovies(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBMovie>>(
      "/movie/top_rated",
      { page: page.toString() },
      CACHE_TTL.topRated,
    );
  }

  async getTopRatedTVShows(
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBTVShow>>(
      "/tv/top_rated",
      { page: page.toString() },
      CACHE_TTL.topRated,
    );
  }

  // Upcoming (8 hours)
  async getUpcomingMovies(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBMovie>>(
      "/movie/upcoming",
      { page: page.toString() },
      CACHE_TTL.upcoming,
    );
  }

  // Images (24 hours)
  async getMovieImages(
    movieId: number,
    includeLanguages = "en,null",
  ): Promise<TMDBImagesResponse> {
    return this.fetchWithDeduplication<TMDBImagesResponse>(
      `/movie/${movieId}/images`,
      { include_image_language: includeLanguages },
      CACHE_TTL.images,
    );
  }

  async getTVImages(
    tvId: number,
    includeLanguages = "en,null",
  ): Promise<TMDBImagesResponse> {
    return this.fetchWithDeduplication<TMDBImagesResponse>(
      `/tv/${tvId}/images`,
      { include_image_language: includeLanguages },
      CACHE_TTL.images,
    );
  }

  // Genres (1 week)
  async getMovieGenres(): Promise<TMDBGenresResponse> {
    return this.fetchWithDeduplication<TMDBGenresResponse>(
      "/genre/movie/list",
      {},
      CACHE_TTL.genres,
    );
  }

  async getTVGenres(): Promise<TMDBGenresResponse> {
    return this.fetchWithDeduplication<TMDBGenresResponse>(
      "/genre/tv/list",
      {},
      CACHE_TTL.genres,
    );
  }

  // Search (no cache - always fresh)
  async searchMovies(
    query: string,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBMovie>>(
      "/search/movie",
      { query, page: page.toString() },
      0, // No cache for search
    );
  }

  async searchTVShows(
    query: string,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBTVShow>>(
      "/search/tv",
      { query, page: page.toString() },
      0, // No cache for search
    );
  }

  // TV Show Details (48 hours)
  async getTVShowDetails(tvId: number): Promise<TMDBTVShowDetails> {
    return this.fetchWithDeduplication<TMDBTVShowDetails>(
      `/tv/${tvId}`,
      {},
      CACHE_TTL.showDetails,
    );
  }

  // Movie Details (48 hours)
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return this.fetchWithDeduplication<TMDBMovieDetails>(
      `/movie/${movieId}`,
      {},
      CACHE_TTL.movieDetails,
    );
  }

  // Movie Videos (24 hours)
  async getMovieVideos(movieId: number): Promise<TMDBVideosResponse> {
    return this.fetchWithDeduplication<TMDBVideosResponse>(
      `/movie/${movieId}/videos`,
      {},
      CACHE_TTL.videos,
    );
  }

  // Movie Credits (24 hours)
  async getMovieCredits(movieId: number): Promise<TMDBCreditsResponse> {
    return this.fetchWithDeduplication<TMDBCreditsResponse>(
      `/movie/${movieId}/credits`,
      {},
      CACHE_TTL.credits,
    );
  }

  // Collection (48 hours)
  async getCollection(collectionId: number): Promise<TMDBCollection> {
    return this.fetchWithDeduplication<TMDBCollection>(
      `/collection/${collectionId}`,
      {},
      CACHE_TTL.collection,
    );
  }

  // Similar Movies (12 hours)
  async getSimilarMovies(
    movieId: number,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBMovie>>(
      `/movie/${movieId}/similar`,
      { page: page.toString() },
      CACHE_TTL.similar,
    );
  }

  // Movie Recommendations (12 hours)
  async getMovieRecommendations(
    movieId: number,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBMovie>>(
      `/movie/${movieId}/recommendations`,
      { page: page.toString() },
      CACHE_TTL.recommended,
    );
  }

  // Watch Providers (24 hours)
  async getMovieWatchProviders(
    movieId: number,
  ): Promise<TMDBWatchProvidersResponse> {
    return this.fetchWithDeduplication<TMDBWatchProvidersResponse>(
      `/movie/${movieId}/watch/providers`,
      {},
      CACHE_TTL.watchProviders,
    );
  }

  // Release Dates (24 hours)
  async getMovieReleaseDates(
    movieId: number,
  ): Promise<TMDBReleaseDatesResponse> {
    return this.fetchWithDeduplication<TMDBReleaseDatesResponse>(
      `/movie/${movieId}/release_dates`,
      {},
      CACHE_TTL.movieDetails,
    );
  }

  // TV Show Videos (24 hours)
  async getTVVideos(tvId: number): Promise<TMDBVideosResponse> {
    return this.fetchWithDeduplication<TMDBVideosResponse>(
      `/tv/${tvId}/videos`,
      {},
      CACHE_TTL.videos,
    );
  }

  // TV Show Credits (24 hours)
  async getTVCredits(tvId: number): Promise<TMDBCreditsResponse> {
    return this.fetchWithDeduplication<TMDBCreditsResponse>(
      `/tv/${tvId}/credits`,
      {},
      CACHE_TTL.credits,
    );
  }

  // Similar TV Shows (12 hours)
  async getSimilarTVShows(
    tvId: number,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBTVShow>>(
      `/tv/${tvId}/similar`,
      { page: page.toString() },
      CACHE_TTL.similar,
    );
  }

  // TV Show Recommendations (12 hours)
  async getTVRecommendations(
    tvId: number,
    page = 1,
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetchWithDeduplication<TMDBPaginatedResponse<TMDBTVShow>>(
      `/tv/${tvId}/recommendations`,
      { page: page.toString() },
      CACHE_TTL.recommended,
    );
  }

  // TV Watch Providers (24 hours)
  async getTVWatchProviders(
    tvId: number,
  ): Promise<TMDBWatchProvidersResponse> {
    return this.fetchWithDeduplication<TMDBWatchProvidersResponse>(
      `/tv/${tvId}/watch/providers`,
      {},
      CACHE_TTL.watchProviders,
    );
  }

  // TV Content Ratings (48 hours)
  async getTVContentRatings(
    tvId: number,
  ): Promise<TMDBContentRatingsResponse> {
    return this.fetchWithDeduplication<TMDBContentRatingsResponse>(
      `/tv/${tvId}/content_ratings`,
      {},
      CACHE_TTL.showDetails,
    );
  }

  // TV Season Details (48 hours)
  async getTVSeasonDetails(
    tvId: number,
    seasonNumber: number,
  ): Promise<TMDBSeasonDetails> {
    return this.fetchWithDeduplication<TMDBSeasonDetails>(
      `/tv/${tvId}/season/${seasonNumber}`,
      {},
      CACHE_TTL.showDetails,
    );
  }

  // Watch Providers List (24 hours)
  async getWatchProvidersList(
    type: "movie" | "tv" = "movie",
  ): Promise<TMDBProvidersListResponse> {
    return this.fetchWithDeduplication<TMDBProvidersListResponse>(
      `/watch/providers/${type}`,
      { watch_region: "US" },
      CACHE_TTL.watchProviders,
    );
  }
}

// Export singleton instance
export const tmdb = new TMDBClient();

// Export cache TTL for use in other parts of the app
export { CACHE_TTL };