"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ShowInfo } from "@/lib/show-data";

interface ShowInfoCardProps {
  info: ShowInfo;
}

export function ShowInfoCard({ info }: ShowInfoCardProps) {
  const hasProviders =
    info.watchProviders &&
    (info.watchProviders.stream.length > 0 ||
      info.watchProviders.rent.length > 0);

  return (
    <div
      className={cn(
        "sticky top-24 rounded-2xl p-5 space-y-5",
        "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
      )}
    >
      {/* Spoken Languages */}
      {info.spokenLanguages.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-1">
            Spoken Languages
          </h3>
          <p className="text-sm text-white line-clamp-1">
            {info.spokenLanguages.join(", ")}
          </p>
        </div>
      )}

      {/* Age Rating */}
      {info.ageRating && (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-1">
            Age Rating
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-xs text-white font-medium">
            {info.ageRating}
          </span>
        </div>
      )}

      {/* Watch Providers */}
      {hasProviders && info.watchProviders && (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2">
            Where to Watch
          </h3>

          {info.watchProviders.stream.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-white/50 mb-1.5">Stream</p>
              <div className="flex flex-wrap gap-1.5">
                {info.watchProviders.stream.map((provider) => (
                  <div
                    key={provider.name}
                    className="relative size-7 rounded-lg overflow-hidden ring-1 ring-white/10"
                  >
                    <Image
                      src={provider.logoUrl}
                      alt={provider.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {info.watchProviders.rent.length > 0 && (
            <div>
              <p className="text-xs text-white/50 mb-1.5">Rent</p>
              <div className="flex flex-wrap gap-1.5">
                {info.watchProviders.rent.map((provider) => (
                  <div
                    key={provider.name}
                    className="relative size-7 rounded-lg overflow-hidden ring-1 ring-white/10"
                  >
                    <Image
                      src={provider.logoUrl}
                      alt={provider.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Networks */}
      {info.networks.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-1">
            Networks
          </h3>
          <p className="text-sm text-white line-clamp-1">
            {info.networks.map((n) => n.name).join(", ")}
          </p>
        </div>
      )}

      {/* Production Companies */}
      {info.productionCompanies.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wide mb-1">
            Production
          </h3>
          <p className="text-sm text-white line-clamp-1">
            {info.productionCompanies.map((c) => c.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
