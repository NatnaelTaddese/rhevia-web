import { tmdb, getBackdropUrl, getPosterUrl, getLogoUrl } from "@/lib/tmdb";
import type { TMDBWatchProvider } from "@/lib/tmdb";

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
  try {
    const [details, images] = await Promise.all([
      tmdb.getMovieDetails(movieId),
      tmdb.getMovieImages(movieId).catch(() => ({ logos: [] })),
    ]);

    const logo = images.logos.find((l) => l.iso_639_1 === "en") || images.logos[0];

    return {
      id: details.id,
      title: details.title,
      tagline: details.tagline,
      overview: details.overview,
      backdropUrl: getBackdropUrl(details.backdrop_path, "original"),
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
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    return null;
  }
}

export async function getMovieVideosData(movieId: number): Promise<MovieVideo[]> {
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

    return trailers.map((video) => ({
      id: video.id,
      key: video.key,
      name: video.name,
      type: video.type,
      official: video.official,
      site: video.site,
    }));
  } catch (error) {
    console.error("Failed to fetch movie videos:", error);
    return [];
  }
}

export async function getMovieCastData(movieId: number, limit = 20): Promise<MovieCast[]> {
  try {
    const response = await tmdb.getMovieCredits(movieId);

    return response.cast
      .sort((a, b) => a.order - b.order)
      .slice(0, limit)
      .map((member) => ({
        id: member.id,
        name: member.name,
        character: member.character,
        profileUrl: member.profile_path
          ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
          : null,
        order: member.order,
      }));
  } catch (error) {
    console.error("Failed to fetch movie cast:", error);
    return [];
  }
}

export async function getMovieCreditsData(movieId: number): Promise<MovieCredits> {
  try {
    const response = await tmdb.getMovieCredits(movieId);

    return {
      cast: response.cast
        .sort((a, b) => a.order - b.order)
        .slice(0, 20)
        .map((member) => ({
          id: member.id,
          name: member.name,
          character: member.character,
          profileUrl: member.profile_path
            ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
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
            ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
            : null,
        })),
    };
  } catch (error) {
    console.error("Failed to fetch movie credits:", error);
    return { cast: [], crew: [] };
  }
}

export async function getMovieCollectionData(collectionId: number): Promise<MovieCollection | null> {
  try {
    const collection = await tmdb.getCollection(collectionId);

    return {
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
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    return null;
  }
}

export async function getSimilarMoviesData(movieId: number, limit = 20): Promise<SimilarMovie[]> {
  try {
    const response = await tmdb.getSimilarMovies(movieId);

    return response.results
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
  } catch (error) {
    console.error("Failed to fetch similar movies:", error);
    return [];
  }
}

export async function getRecommendedMoviesData(movieId: number, limit = 20): Promise<SimilarMovie[]> {
  try {
    const response = await tmdb.getMovieRecommendations(movieId);

    return response.results
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
  } catch (error) {
    console.error("Failed to fetch recommended movies:", error);
    return [];
  }
}

export async function getMovieInfoData(movieId: number): Promise<MovieInfo> {
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
    const imageUrlPrefix = "https://image.tmdb.org/t/p/w92";

    const formatProviders = (providers: TMDBWatchProvider[] | undefined): WatchProvider[] =>
      (providers || []).map((p) => ({
        name: p.provider_name,
        logoUrl: `${imageUrlPrefix}${p.logo_path}`,
      }));

    const formattedProviders: MovieWatchProviders | null = usProviders
      ? {
          link: usProviders.link,
          stream: formatProviders(usProviders.flatrate),
          rent: formatProviders(usProviders.rent),
          buy: formatProviders(usProviders.buy),
        }
      : null;

    return {
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
