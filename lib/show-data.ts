import { tmdb, getBackdropUrl, getPosterUrl, getLogoUrl } from "@/lib/tmdb";
import type { TMDBWatchProvider } from "@/lib/tmdb";

const DETAILS_CACHE_TTL = 86400 * 1000; // 24 hours
const showDetailsCache = new Map<number, { data: ShowDetails; timestamp: number }>();
const showVideosCache = new Map<number, { data: ShowVideo[]; timestamp: number }>();
const showCreditsCache = new Map<number, { data: ShowCredits; timestamp: number }>();
const similarShowsCache = new Map<number, { data: SimilarShow[]; timestamp: number }>();
const recommendedShowsCache = new Map<number, { data: SimilarShow[]; timestamp: number }>();
const showInfoCache = new Map<number, { data: ShowInfo; timestamp: number }>();
const seasonEpisodesCache = new Map<string, { data: SeasonEpisodes | null; timestamp: number }>(); // key: "tvId-seasonNumber"

export interface ShowDetails {
  id: number;
  name: string;
  tagline: string;
  overview: string;
  backdropUrl: string | null;
  posterUrl: string | null;
  logoUrl: string | null;
  firstAirDate: string;
  firstAirYear: string;
  lastAirDate: string | null;
  lastAirYear: string | null;
  inProduction: boolean;
  status: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRunTime: number[];
  voteAverage: number;
  voteCount: number;
  genres: { id: number; name: string }[];
  networks: {
    id: number;
    name: string;
    logoUrl: string | null;
  }[];
  originalLanguage: string;
  productionCompanies: {
    id: number;
    name: string;
    logoUrl: string | null;
  }[];
  seasons: ShowSeason[];
}

export interface ShowSeason {
  id: number;
  name: string;
  seasonNumber: number;
  episodeCount: number;
  overview: string;
  airDate: string | null;
  posterUrl: string | null;
}

export interface ShowVideo {
  id: string;
  key: string;
  name: string;
  type: string;
  official: boolean;
  site: string;
}

export interface ShowCast {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
  order: number;
}

export interface ShowCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profileUrl: string | null;
}

export interface ShowCredits {
  cast: ShowCast[];
  crew: ShowCrew[];
}

export interface SimilarShow {
  id: number;
  name: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  firstAirYear: string;
  voteAverage: number;
  overview: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episodeNumber: number;
  seasonNumber: number;
  stillUrl: string | null;
  airDate: string | null;
  runtime: number | null;
  voteAverage: number;
}

export interface SeasonEpisodes {
  seasonNumber: number;
  seasonName: string;
  episodes: Episode[];
}

export interface WatchProvider {
  name: string;
  logoUrl: string;
}

export interface ShowWatchProviders {
  link: string;
  stream: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
}

export interface ShowInfo {
  originalLanguage: string;
  spokenLanguages: string[];
  ageRating: string | null;
  watchProviders: ShowWatchProviders | null;
  networks: {
    id: number;
    name: string;
    logoUrl: string | null;
  }[];
  productionCompanies: {
    id: number;
    name: string;
    logoUrl: string | null;
  }[];
}

export async function getShowDetailsData(tvId: number): Promise<ShowDetails | null> {
  const cached = showDetailsCache.get(tvId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const [details, images] = await Promise.all([
      tmdb.getTVShowDetails(tvId),
      tmdb.getTVImages(tvId).catch(() => ({ logos: [] })),
    ]);

    const logo = images.logos.find((l) => l.iso_639_1 === "en") || images.logos[0];

    const firstAirYear = details.first_air_date ? details.first_air_date.split("-")[0] : "";
    const lastAirYear = details.last_air_date ? details.last_air_date.split("-")[0] : null;

    const result = {
      id: details.id,
      name: details.name,
      tagline: details.tagline,
      overview: details.overview,
      backdropUrl: getBackdropUrl(details.backdrop_path, "large"),
      posterUrl: getPosterUrl(details.poster_path, "large"),
      logoUrl: logo ? getLogoUrl(logo.file_path, "w500") : null,
      firstAirDate: details.first_air_date,
      firstAirYear,
      lastAirDate: details.last_air_date,
      lastAirYear,
      inProduction: details.in_production,
      status: details.status,
      numberOfSeasons: details.number_of_seasons,
      numberOfEpisodes: details.number_of_episodes,
      episodeRunTime: details.episode_run_time,
      voteAverage: Math.round(details.vote_average * 10) / 10,
      voteCount: details.vote_count,
      genres: details.genres,
      networks: details.networks.map((n) => ({
        id: n.id,
        name: n.name,
        logoUrl: n.logo_path ? getLogoUrl(n.logo_path, "w185") : null,
      })),
      originalLanguage: details.original_language,
      productionCompanies: details.production_companies.map((c) => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logo_path ? getLogoUrl(c.logo_path, "w185") : null,
      })),
      seasons: details.seasons
        .filter((s) => s.season_number > 0)
        .map((s) => ({
          id: s.id,
          name: s.name,
          seasonNumber: s.season_number,
          episodeCount: s.episode_count,
          overview: s.overview,
          airDate: s.air_date,
          posterUrl: getPosterUrl(s.poster_path, "medium"),
        })),
    };

    showDetailsCache.set(tvId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch TV show details:", error);
    return null;
  }
}

export async function getShowVideosData(tvId: number): Promise<ShowVideo[]> {
  const cached = showVideosCache.get(tvId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await tmdb.getTVVideos(tvId);

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

    showVideosCache.set(tvId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch TV show videos:", error);
    return [];
  }
}

export async function getShowCreditsData(tvId: number): Promise<ShowCredits> {
  const cached = showCreditsCache.get(tvId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await tmdb.getTVCredits(tvId);

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
          ["Director", "Writer", "Screenplay", "Producer", "Executive Producer", "Creator"].includes(member.job)
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

    showCreditsCache.set(tvId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch TV show credits:", error);
    return { cast: [], crew: [] };
  }
}

export async function getSimilarShowsData(tvId: number, limit = 20): Promise<SimilarShow[]> {
  const cached = similarShowsCache.get(tvId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data.slice(0, limit);
  }

  try {
    const response = await tmdb.getSimilarTVShows(tvId);

    const result = response.results
      .filter((show) => show.poster_path)
      .slice(0, limit)
      .map((show) => ({
        id: show.id,
        name: show.name,
        posterUrl: getPosterUrl(show.poster_path, "medium"),
        backdropUrl: getBackdropUrl(show.backdrop_path, "large"),
        firstAirYear: show.first_air_date ? show.first_air_date.split("-")[0] : "",
        voteAverage: Math.round(show.vote_average * 10) / 10,
        overview: show.overview,
      }));

    similarShowsCache.set(tvId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch similar TV shows:", error);
    return [];
  }
}

export async function getRecommendedShowsData(tvId: number, limit = 20): Promise<SimilarShow[]> {
  const cached = recommendedShowsCache.get(tvId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data.slice(0, limit);
  }

  try {
    const response = await tmdb.getTVRecommendations(tvId);

    const result = response.results
      .filter((show) => show.poster_path)
      .slice(0, limit)
      .map((show) => ({
        id: show.id,
        name: show.name,
        posterUrl: getPosterUrl(show.poster_path, "medium"),
        backdropUrl: getBackdropUrl(show.backdrop_path, "large"),
        firstAirYear: show.first_air_date ? show.first_air_date.split("-")[0] : "",
        voteAverage: Math.round(show.vote_average * 10) / 10,
        overview: show.overview,
      }));

    recommendedShowsCache.set(tvId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch recommended TV shows:", error);
    return [];
  }
}

export async function getShowInfoData(tvId: number): Promise<ShowInfo> {
  const cached = showInfoCache.get(tvId);
  if (cached && Date.now() - cached.timestamp < DETAILS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const [details, contentRatings, watchProvidersResponse] = await Promise.all([
      tmdb.getTVShowDetails(tvId),
      tmdb.getTVContentRatings(tvId).catch(() => ({ results: [] })),
      tmdb.getTVWatchProviders(tvId).catch(() => null),
    ]);

    const usRating = contentRatings.results.find((r) => r.iso_3166_1 === "US");
    const ageRating = usRating?.rating || null;

    const usProviders = watchProvidersResponse?.results?.["US"];

    const formatProviders = (providers: TMDBWatchProvider[] | undefined): WatchProvider[] =>
      (providers || []).map((p) => ({
        name: p.provider_name,
        logoUrl: getLogoUrl(p.logo_path, "w185") as string,
      }));

    const formattedProviders: ShowWatchProviders | null = usProviders
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
      networks: details.networks.map((n) => ({
        id: n.id,
        name: n.name,
        logoUrl: n.logo_path ? getLogoUrl(n.logo_path, "w185") : null,
      })),
      productionCompanies: details.production_companies.map((c) => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logo_path ? getLogoUrl(c.logo_path, "w185") : null,
      })),
    };

    showInfoCache.set(tvId, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Failed to fetch TV show info:", error);
    return {
      originalLanguage: "",
      spokenLanguages: [],
      ageRating: null,
      watchProviders: null,
      networks: [],
      productionCompanies: [],
    };
  }
}
