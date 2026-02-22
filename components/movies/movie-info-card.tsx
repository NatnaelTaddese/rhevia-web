"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { MovieInfo } from "@/lib/movie-data";

interface MovieInfoCardProps {
  info: MovieInfo;
}

export function MovieInfoCard({ info }: MovieInfoCardProps) {
  const hasProviders =
    info.watchProviders &&
    (info.watchProviders.stream.length > 0 ||
      info.watchProviders.rent.length > 0);

  return (
    <div
      className={cn(
        "sticky top-24 rounded-2xl p-5 space-y-6",
        "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
      )}
    >
      {/* Spoken Languages */}
      {info.spokenLanguages.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
            Spoken Languages
          </h3>
          <p className="text-sm text-white">
            {info.spokenLanguages.slice(0, 3).join(", ")}
          </p>
        </div>
      )}

      {/* Age Rating */}
      {info.ageRating && (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
            Age Rating
          </h3>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/10 text-sm text-white font-medium">
            {info.ageRating}
          </span>
        </div>
      )}

      {/* Watch Providers */}
      {hasProviders && info.watchProviders && (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-3">
            Where to Watch
          </h3>

          {info.watchProviders.stream.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-white/50 mb-2">Stream</p>
              <div className="flex flex-wrap gap-2">
                {info.watchProviders.stream.map((provider) => (
                  <div
                    key={provider.name}
                    className="relative size-8 rounded-lg overflow-hidden ring-1 ring-white/10"
                  >
                    <Image
                      src={provider.logoUrl}
                      alt={provider.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {info.watchProviders.rent.length > 0 && (
            <div>
              <p className="text-xs text-white/50 mb-2">Rent</p>
              <div className="flex flex-wrap gap-2">
                {info.watchProviders.rent.map((provider) => (
                  <div
                    key={provider.name}
                    className="relative size-8 rounded-lg overflow-hidden ring-1 ring-white/10"
                  >
                    <Image
                      src={provider.logoUrl}
                      alt={provider.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Production Companies */}
      {info.productionCompanies.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-3">
            Production
          </h3>
          <div className="space-y-2">
            {info.productionCompanies.slice(0, 3).map((company) => (
              <div key={company.id} className="flex items-center gap-3">
                {company.logoUrl ? (
                  <div className="relative size-8 rounded-lg overflow-hidden ring-1 ring-white/10 bg-white/5">
                    <Image
                      src={company.logoUrl}
                      alt={company.name}
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="size-8 rounded-lg ring-1 ring-white/10 bg-white/5 flex items-center justify-center">
                    <span className="text-xs text-white/40">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                )}
                <p className="text-sm text-white/80">{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
