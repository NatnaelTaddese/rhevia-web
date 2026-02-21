import { tmdb, getBackdropUrl, getPosterUrl, getLogoUrl } from "@/lib/tmdb";

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
