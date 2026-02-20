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
  size: keyof (typeof TMDB_IMAGE_SIZES)[typeof type]
): string | null {
  if (!path) return null;
  const sizeValue = TMDB_IMAGE_SIZES[type][size as keyof (typeof TMDB_IMAGE_SIZES)[typeof type]];
  return `${TMDB_IMAGE_BASE_URL}/${sizeValue}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: keyof typeof TMDB_IMAGE_SIZES.backdrop = "large"
): string | null {
  return getImageUrl(path, "backdrop", size);
}

export function getPosterUrl(
  path: string | null,
  size: keyof typeof TMDB_IMAGE_SIZES.poster = "medium"
): string | null {
  return getImageUrl(path, "poster", size);
}

// API client
class TMDBClient {
  private apiKey: string;
  private accessToken: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY as string;
    this.accessToken = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN as string;
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);

    // Add query params
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  // Trending
  async getTrendingMovies(
    timeWindow: "day" | "week" = "week",
    page = 1
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>(
      `/trending/movie/${timeWindow}`,
      { page: page.toString() }
    );
  }

  async getTrendingTVShows(
    timeWindow: "day" | "week" = "week",
    page = 1
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetch<TMDBPaginatedResponse<TMDBTVShow>>(
      `/trending/tv/${timeWindow}`,
      { page: page.toString() }
    );
  }

  // Popular
  async getPopularMovies(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/popular", {
      page: page.toString(),
    });
  }

  async getPopularTVShows(page = 1): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetch<TMDBPaginatedResponse<TMDBTVShow>>("/tv/popular", {
      page: page.toString(),
    });
  }

  // Now Playing / On The Air
  async getNowPlayingMovies(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>("/movie/now_playing", {
      page: page.toString(),
    });
  }

  async getOnTheAirTVShows(page = 1): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
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

  async getTopRatedTVShows(page = 1): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
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
    page = 1
  ): Promise<TMDBPaginatedResponse<TMDBMovie>> {
    return this.fetch<TMDBPaginatedResponse<TMDBMovie>>("/search/movie", {
      query,
      page: page.toString(),
    });
  }

  async searchTVShows(
    query: string,
    page = 1
  ): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
    return this.fetch<TMDBPaginatedResponse<TMDBTVShow>>("/search/tv", {
      query,
      page: page.toString(),
    });
  }
}

// Export singleton instance
export const tmdb = new TMDBClient();
