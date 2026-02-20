import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[900px] overflow-hidden">
      {/* Background Skeleton */}
      <div className="absolute inset-0">
        <Skeleton className="w-full h-full" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content Skeleton */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-2xl space-y-6">
            {/* Title Skeleton */}
            <Skeleton className="h-16 md:h-20 lg:h-24 w-3/4" />
            
            {/* Meta Info Skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>

            {/* Overview Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-xl" />
              <Skeleton className="h-4 w-5/6 max-w-xl" />
              <Skeleton className="h-4 w-4/6 max-w-xl" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-36 rounded-full" />
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center gap-2 pt-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-1.5 w-1.5 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows Skeleton */}
      <div className="absolute right-4 md:right-8 bottom-16 md:bottom-24 flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </section>
  );
}
