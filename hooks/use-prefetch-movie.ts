"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  getMovieDetailsData,
  getMovieVideosData,
  getMovieCreditsData,
  getMovieCollectionData,
  getRecommendedMoviesData,
  getMovieInfoData,
} from "@/lib/movie-data";
import { STALE_TIMES } from "@/components/providers/react-query-provider";
import type { MovieDetails } from "@/lib/movie-data";

export function usePrefetchMovie() {
  const queryClient = useQueryClient();

  const prefetchMovie = useCallback(
    async (movieId: number) => {
      // Prefetch all the data needed for the movie detail page
      // This makes navigation instant when user clicks

      // Prefetch movie details (most important - load first)
      await queryClient.prefetchQuery({
        queryKey: ["movie", movieId, "details"],
        queryFn: () => getMovieDetailsData(movieId),
        staleTime: STALE_TIMES.movieDetails,
      });

      // Prefetch videos (trailers)
      await queryClient.prefetchQuery({
        queryKey: ["movie", movieId, "videos"],
        queryFn: () => getMovieVideosData(movieId),
        staleTime: STALE_TIMES.videos,
      });

      // Prefetch credits (cast & crew)
      await queryClient.prefetchQuery({
        queryKey: ["movie", movieId, "credits"],
        queryFn: () => getMovieCreditsData(movieId),
        staleTime: STALE_TIMES.credits,
      });

      // Prefetch recommended movies
      await queryClient.prefetchQuery({
        queryKey: ["movie", movieId, "recommended"],
        queryFn: () => getRecommendedMoviesData(movieId),
        staleTime: STALE_TIMES.recommended,
      });

      // Prefetch movie info (watch providers, age rating)
      await queryClient.prefetchQuery({
        queryKey: ["movie", movieId, "info"],
        queryFn: () => getMovieInfoData(movieId),
        staleTime: STALE_TIMES.watchProviders,
      });

      // Also prefetch collection if we have the movie details cached
      const movieDetails = queryClient.getQueryData<MovieDetails>(["movie", movieId, "details"]);
      if (movieDetails?.collectionId) {
        await queryClient.prefetchQuery({
          queryKey: ["collection", movieDetails.collectionId],
          queryFn: () => getMovieCollectionData(movieDetails.collectionId!),
          staleTime: STALE_TIMES.collection,
        });
      }
    },
    [queryClient]
  );

  return { prefetchMovie };
}