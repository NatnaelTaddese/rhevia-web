import { tmdb } from "@/lib/tmdb";

export async function getTrendingMovies() {
  // Fetch popular movies as trending
  const response = await tmdb.movie_lists.popular({
    page: 1,
  });

  // Return first 8 movies for the carousel
  return response.results.slice(0, 8);
}
