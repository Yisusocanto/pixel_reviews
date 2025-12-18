import { Card, Skeleton } from "@heroui/react";

export default function SearchLoading() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-6 px-4">
      <main className="flex-1">
        <div className="mt-4">
          {/* Title Skeleton */}
          <div className="flex justify-center items-center gap-2 mb-8">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>

          {/* Grid of Game Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-fit m-auto">
                <Card className="flex flex-col h-full w-xs sm:w-xs xl:w-sm max-w-sm gap-4 p-0 overflow-hidden">
                  {/* Image Skeleton */}
                  <div className="w-full h-64 relative overflow-hidden">
                    <Skeleton className="w-full h-full rounded-none" />
                  </div>
                  {/* Content Skeleton */}
                  <div className="px-4 pb-4 space-y-2">
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16 rounded-md" />
                      <Skeleton className="h-4 w-24 rounded-md" />
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
