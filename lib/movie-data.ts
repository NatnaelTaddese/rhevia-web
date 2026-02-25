import { tmdb, getBackdropUrl, getPosterUrl, getLogoUrl } from "@/lib/tmdb";
import type { TMDBWatchProvider } from "@/lib/tmdb";

const DETAILS_CACHE_TTL = 86400 * 1000; // 24 hours
const movieDetailsCache = new Map<number, { data: MovieDetails; timestamp: number }>();
const movieVideosCache = new Map<number, { data: MovieVideo[]; timestamp: number }>();
const movieCastCache = new Map<number, { data: MovieCast[]; timestamp: number }>();
const movieCreditsCache = new Map<number, { data: MovieCredits; timestamp: number }>();
const movieCollectionCache = new Map<number, { data: MovieCollection | null; timestamp: number }>();
const similarMoviesCache = new Map<number, { data: SimilarMovie[]; timestamp: number }>();
const recommendedMoviesCache = new Map<number, { data: SimilarMovie[]; timestamp: number }>();
const movieInfoCache = new Map<number, { data: MovieInfo; timestamp: number }>();

export interface MovieDetails {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  backdropUrl: string | null;
  posterUrl: string | null;
  logoUrl: string | null;
  releaseDate: string;
  releaseYear: string;
  runtime: number;
  voteAverage: number;
  voteCount: number;
  genres: { id: number; name: string }[];
  status: string;
  budget: number;
  revenue: number;
  originalLanguage: string;
  productionCompanies: {
    id: number;
    name: string;
    logoUrl: string | null;
  }[];
  collectionId: number | null;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  type: string;
  official: boolean;
  site: string;
}

export interface MovieCast {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
  order: number;
}

export interface MovieCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profileUrl: string | null;
}

export interface MovieCredits {
  cast: MovieCast[];
  crew: MovieCrew[];
}

export interface CollectionMovie {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string;
  voteAverage: number;
}

export interface MovieCollection {
  id: number;
  name: string;
  movies: CollectionMovie[];
}

export interface SimilarMovie {
  id: number;
  title: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseYear: string;
  voteAverage: number;
  overview: string;
}

export interface WatchProvider {
  name: string;
  logoUrl: string;
}

export interface MovieWatchProviders {
  link: string;
  stream: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
}

export interface MovieInfo {
  originalLanguage: string;
  spokenLanguages: string[];
  ageRating: string | null;
  watchProviders: MovieWatchProviders | null;
  productionCompanies: {
    id: number;
    name: string;
    logoUrl: string | null;
  }[];
}

export async function getMovieDetailsData(movieId: number): Promise<MovieDetails | null> {
  const cached = movieDetailsCache.get(movieId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const [details, images] = await Promise.all([
      tmdb.getMovieDetails(movieId),
      tmdb.getMovieImages(movieId).catch(() => ({ logos: [] })),
    ]);

    const logo = images.logos.find((l) => l.iso_639_1 === "en") || images.logos[0];

    const result = {
      id: details.id,
      title: details.title,
      tagline: details.tagline,
      overview: details.overview,
      backdropUrl: getBackdropUrl(details.backdrop_path, "large"),
      posterUrl: getPosterUrl(details.poster_path, "large"),
      logoUrl: logo ? getLogoUrl(logo.file_path, "w500") : null,
      releaseDate: details.release_date,
      releaseYear: details.release_date ? details.release_date.split("-")[0] : "",
      runtime: details.runtime,
      voteAverage: Math.round(details.vote_average * 10) / 10,
      voteCount: details.vote_count,
      genres: details.genres,
      status: details.status,
      budget: details.budget,
      revenue: details.revenue,
      originalLanguage: details.original_language,
      productionCompanies: details.production_companies.map((c) => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logo_path ? getLogoUrl(c.logo_path, "w185") : null,
      })),
      collectionId: details.belongs_to_collection?.id ?? null,
    };

    movieDetailsCache.set(movieId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    return null;
  }
}

export async function getMovieVideosData(movieId: number): Promise<MovieVideo[]> {
  const cached = movieVideosCache.get(movieId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await tmdb.getMovieVideos(movieId);

    const trailers = response.results
      .filter(
        (video) =>
          video.site === "YouTube" &&
          (video.type === "Trailer" || video.type === "Teaser")
      )
      .sort((a, b) => {
        if (a.official !== b.official) return a.official ? -1 : 1;
        if (a.type !== b.type) return a.type === "Trailer" ? -1 : 1;
        return 0;
      });

    const result = trailers.map((video) => ({
      id: video.id,
      key: video.key,
      name: video.name,
      type: video.type,
      official: video.official,
      site: video.site,
    }));

    movieVideosCache.set(movieId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch movie videos:", error);
    return [];
  }
}

export async function getMovieCastData(movieId: number, limit = 20): Promise<MovieCast[]> {
  const cached = movieCastCache.get(movieId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data.slice(0, limit);
  }

  try {
    const response = await tmdb.getMovieCredits(movieId);

    const result = response.cast
      .sort((a, b) => a.order - b.order)
      .slice(0, limit)
      .map((member) => ({
        id: member.id,
        name: member.name,
        character: member.character,
        profileUrl: member.profile_path
          ? getPosterUrl(member.profile_path, "medium")
          : null,
        order: member.order,
      }));

    movieCastCache.set(movieId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch movie cast:", error);
    return [];
  }
}

export async function getMovieCreditsData(movieId: number): Promise<MovieCredits> {
  const cached = movieCreditsCache.get(movieId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await tmdb.getMovieCredits(movieId);

    const result = {
      cast: response.cast
        .sort((a, b) => a.order - b.order)
        .slice(0, 20)
        .map((member) => ({
          id: member.id,
          name: member.name,
          character: member.character,
          profileUrl: member.profile_path
            ? getPosterUrl(member.profile_path, "medium")
            : null,
          order: member.order,
        })),
      crew: response.crew
        .filter((member) =>
          ["Director", "Writer", "Screenplay", "Producer", "Executive Producer"].includes(member.job)
        )
        .slice(0, 10)
        .map((member) => ({
          id: member.id,
          name: member.name,
          job: member.job,
          department: member.department,
          profileUrl: member.profile_path
            ? getPosterUrl(member.profile_path, "medium")
            : null,
        })),
    };

    movieCreditsCache.set(movieId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch movie credits:", error);
    return { cast: [], crew: [] };
  }
}

export async function getMovieCollectionData(collectionId: number): Promise<MovieCollection | null> {
  const cached = movieCollectionCache.get(collectionId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const collection = await tmdb.getCollection(collectionId);

    const result = {
      id: collection.id,
      name: collection.name,
      movies: collection.parts
        .sort((a, b) => a.release_date.localeCompare(b.release_date))
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          posterUrl: getPosterUrl(movie.poster_path, "medium"),
          releaseDate: movie.release_date,
          voteAverage: Math.round(movie.vote_average * 10) / 10,
        })),
    };

    movieCollectionCache.set(collectionId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    return null;
  }
}

export async function getSimilarMoviesData(movieId: number, limit = 20): Promise<SimilarMovie[]> {
  const cached = similarMoviesCache.get(movieId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data.slice(0, limit);
  }

  try {
    const response = await tmdb.getSimilarMovies(movieId);

    const result = response.results
      .filter((movie) => movie.poster_path)
      .slice(0, limit)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        posterUrl: getPosterUrl(movie.poster_path, "medium"),
        backdropUrl: getBackdropUrl(movie.backdrop_path, "large"),
        releaseYear: movie.release_date ? movie.release_date.split("-")[0] : "",
        voteAverage: Math.round(movie.vote_average * 10) / 10,
        overview: movie.overview,
      }));

    similarMoviesCache.set(movieId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch similar movies:", error);
    return [];
  }
}

export async function getRecommendedMoviesData(movieId: number, limit = 20): Promise<SimilarMovie[]> {
  const cached = recommendedMoviesCache.get(movieId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data.slice(0, limit);
  }

  try {
    const response = await tmdb.getMovieRecommendations(movieId);

    const result = response.results
      .filter((movie) => movie.poster_path)
      .slice(0, limit)
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        posterUrl: getPosterUrl(movie.poster_path, "medium"),
        backdropUrl: getBackdropUrl(movie.backdrop_path, "large"),
        releaseYear: movie.release_date ? movie.release_date.split("-")[0] : "",
        voteAverage: Math.round(movie.vote_average * 10) / 10,
        overview: movie.overview,
      }));

    recommendedMoviesCache.set(movieId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch recommended movies:", error);
    return [];
  }
}

export async function getMovieInfoData(movieId: number): Promise<MovieInfo> {
  const cached = movieInfoCache.get(movieId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const [details, releaseDates, watchProvidersResponse] = await Promise.all([
      tmdb.getMovieDetails(movieId),
      tmdb.getMovieReleaseDates(movieId).catch(() => ({ results: [] })),
      tmdb.getMovieWatchProviders(movieId).catch(() => null),
    ]);

    // Get US age rating
    const usRelease = releaseDates.results.find((r) => r.iso_3166_1 === "US");
    const theatricalRelease = usRelease?.release_dates.find((r) => r.type === 3);
    const ageRating = theatricalRelease?.certification || null;

    // Get US watch providers
    const usProviders = watchProvidersResponse?.results?.["US"];
    const formatProviders = (providers: TMDBWatchProvider[] | undefined): WatchProvider[] =>
      (providers || []).map((p) => ({
        name: p.provider_name,
        logoUrl: getLogoUrl(p.logo_path, "w185") as string,
      }));

    const formattedProviders: MovieWatchProviders | null = usProviders
      ? {
          link: usProviders.link,
          stream: formatProviders(usProviders.flatrate),
          rent: formatProviders(usProviders.rent),
          buy: formatProviders(usProviders.buy),
        }
      : null;

    const result = {
      originalLanguage: details.original_language,
      spokenLanguages: details.spoken_languages.map((l) => l.english_name),
      ageRating,
      watchProviders: formattedProviders,
      productionCompanies: details.production_companies.map((c) => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logo_path ? getLogoUrl(c.logo_path, "w185") : null,
      })),
    };

    movieInfoCache.set(movieId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch movie info:", error);
    return {
      originalLanguage: "",
      spokenLanguages: [],
      ageRating: null,
      watchProviders: null,
      productionCompanies: [],
    };
  }
}
