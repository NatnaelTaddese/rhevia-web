import { tmdb, getBackdropUrl, getPosterUrl, getLogoUrl } from "@/lib/tmdb";
import type { TMDBWatchProvider } from "@/lib/tmdb";

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
  try {
    const [details, images] = await Promise.all([
      tmdb.getTVShowDetails(tvId),
      tmdb.getTVImages(tvId).catch(() => ({ logos: [] })),
    ]);

    const logo = images.logos.find((l) => l.iso_639_1 === "en") || images.logos[0];

    const firstAirYear = details.first_air_date ? details.first_air_date.split("-")[0] : "";
    const lastAirYear = details.last_air_date ? details.last_air_date.split("-")[0] : null;

    return {
      id: details.id,
      name: details.name,
      tagline: details.tagline,
      overview: details.overview,
      backdropUrl: getBackdropUrl(details.backdrop_path, "original"),
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
  } catch (error) {
    console.error("Failed to fetch TV show details:", error);
    return null;
  }
}

export async function getShowVideosData(tvId: number): Promise<ShowVideo[]> {
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

    return trailers.map((video) => ({
      id: video.id,
      key: video.key,
      name: video.name,
      type: video.type,
      official: video.official,
      site: video.site,
    }));
  } catch (error) {
    console.error("Failed to fetch TV show videos:", error);
    return [];
  }
}

export async function getShowCreditsData(tvId: number): Promise<ShowCredits> {
  try {
    const response = await tmdb.getTVCredits(tvId);

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
          ["Director", "Writer", "Screenplay", "Producer", "Executive Producer", "Creator"].includes(member.job)
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
    console.error("Failed to fetch TV show credits:", error);
    return { cast: [], crew: [] };
  }
}

export async function getSimilarShowsData(tvId: number, limit = 20): Promise<SimilarShow[]> {
  try {
    const response = await tmdb.getSimilarTVShows(tvId);

    return response.results
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
  } catch (error) {
    console.error("Failed to fetch similar TV shows:", error);
    return [];
  }
}

export async function getSeasonEpisodesData(tvId: number, seasonNumber: number): Promise<SeasonEpisodes | null> {
  try {
    const season = await tmdb.getTVSeasonDetails(tvId, seasonNumber);

    return {
      seasonNumber: season.season_number,
      seasonName: season.name,
      episodes: season.episodes.map((ep) => ({
        id: ep.id,
        name: ep.name,
        overview: ep.overview,
        episodeNumber: ep.episode_number,
        seasonNumber: ep.season_number,
        stillUrl: ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : null,
        airDate: ep.air_date,
        runtime: ep.runtime,
        voteAverage: Math.round(ep.vote_average * 10) / 10,
      })),
    };
  } catch (error) {
    console.error(`Failed to fetch season ${seasonNumber}:`, error);
    return null;
  }
}

export async function getShowInfoData(tvId: number): Promise<ShowInfo> {
  try {
    const [details, contentRatings, watchProvidersResponse] = await Promise.all([
      tmdb.getTVShowDetails(tvId),
      tmdb.getTVContentRatings(tvId).catch(() => ({ results: [] })),
      tmdb.getTVWatchProviders(tvId).catch(() => null),
    ]);

    const usRating = contentRatings.results.find((r) => r.iso_3166_1 === "US");
    const ageRating = usRating?.rating || null;

    const usProviders = watchProvidersResponse?.results?.["US"];
    const imageUrlPrefix = "https://image.tmdb.org/t/p/w92";

    const formatProviders = (providers: TMDBWatchProvider[] | undefined): WatchProvider[] =>
      (providers || []).map((p) => ({
        name: p.provider_name,
        logoUrl: `${imageUrlPrefix}${p.logo_path}`,
      }));

    const formattedProviders: ShowWatchProviders | null = usProviders
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
