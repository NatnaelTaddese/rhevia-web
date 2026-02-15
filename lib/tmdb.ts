import { TMDB } from "@lorenzopant/tmdb";

export const tmdb = new TMDB(process.env.NEXT_PUBLIC_TMDB_API_KEY as string);
