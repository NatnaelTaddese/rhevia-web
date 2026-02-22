"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  getShowDetailsData,
  getShowVideosData,
  getShowCreditsData,
  getRecommendedShowsData,
  getShowInfoData,
} from "@/lib/show-data";
import { STALE_TIMES } from "@/components/providers/react-query-provider";

export function usePrefetchShow() {
  const queryClient = useQueryClient();

  const prefetchShow = useCallback(
    async (showId: number) => {
      // Prefetch all the data needed for the show detail page
      // This makes navigation instant when user clicks

      // Prefetch show details (most important - load first)
      await queryClient.prefetchQuery({
        queryKey: ["show", showId, "details"],
        queryFn: () => getShowDetailsData(showId),
        staleTime: STALE_TIMES.showDetails,
      });

      // Prefetch videos (trailers)
      await queryClient.prefetchQuery({
        queryKey: ["show", showId, "videos"],
        queryFn: () => getShowVideosData(showId),
        staleTime: STALE_TIMES.videos,
      });

      // Prefetch credits (cast & crew)
      await queryClient.prefetchQuery({
        queryKey: ["show", showId, "credits"],
        queryFn: () => getShowCreditsData(showId),
        staleTime: STALE_TIMES.credits,
      });

      // Prefetch recommended shows
      await queryClient.prefetchQuery({
        queryKey: ["show", showId, "recommended"],
        queryFn: () => getRecommendedShowsData(showId),
        staleTime: STALE_TIMES.recommended,
      });

      // Prefetch show info (watch providers, age rating)
      await queryClient.prefetchQuery({
        queryKey: ["show", showId, "info"],
        queryFn: () => getShowInfoData(showId),
        staleTime: STALE_TIMES.watchProviders,
      });
    },
    [queryClient]
  );

  return { prefetchShow };
}