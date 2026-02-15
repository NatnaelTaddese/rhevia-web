"use client";

import { TMDB, type TMDBOptions } from "@lorenzopant/tmdb";
import type React from "react";
import { createContext, useContext, useMemo } from "react";

type TmdbContextType = { tmdb: TMDB };
const TmdbContext = createContext<TmdbContextType | undefined>(undefined);

interface TMDBProviderProps {
  apiKey: string;
  options?: TMDBOptions;
  children: React.ReactNode;
}

// Provider for client components, receives apiKey as prop
export function TMDBProvider({ apiKey, options, children }: TMDBProviderProps) {
  const tmdb = useMemo(
    () => new TMDB(apiKey, { ...options }),
    [apiKey, options],
  );
  return (
    <TmdbContext.Provider value={{ tmdb }}>{children}</TmdbContext.Provider>
  );
}

export function useTmdb() {
  const context = useContext(TmdbContext);
  if (!context) {
    throw new Error("useTmdb must be used within a TmdbProvider");
  }
  return context.tmdb;
}
