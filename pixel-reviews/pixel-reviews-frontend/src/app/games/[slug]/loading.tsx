import { Card, Skeleton } from "@heroui/react";

export default function GameLoading() {
  return (
    <div>
      {/* Game Hero Skeleton */}
      <div className="relative w-full h-[70vh] overflow-hidden bg-[#0f0f0f]">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/50 via-40% to-transparent to-70% z-10" />
        <div className="relative z-20 flex flex-col justify-end h-full pb-8 w-full md:w-3/4 mx-auto px-4 md:px-8 gap-4">
          <Skeleton className="h-10 w-72 sm:w-96 rounded-lg" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-6 w-28 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 w-full md:w-3/4 mx-auto px-4 md:px-0 mt-8">
        {/* Left Side - Tabs */}
        <div className="flex-2 w-full md:mx-8">
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>

          {/* About Card Skeleton */}
          <Card className="p-4 mb-6">
            <Skeleton className="h-6 w-32 mb-4 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </Card>

          {/* Screenshots Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-7 w-32 mb-4 rounded-lg" />
            <div className="flex gap-2 overflow-hidden">
              <Skeleton className="h-32 w-48 rounded-lg shrink-0" />
              <Skeleton className="h-32 w-48 rounded-lg shrink-0" />
              <Skeleton className="h-32 w-48 rounded-lg shrink-0" />
            </div>
          </div>
        </div>

        {/* Right Side - Cards */}
        <div className="flex-1 flex flex-col gap-4 items-center md:mx-8">
          {/* Rating Card Skeleton */}
          <Card className="w-full md:max-w-sm p-4 flex flex-col items-center gap-4">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-16 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-5 w-24 rounded-md" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-md" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </Card>

          {/* Info Card Skeleton */}
          <Card className="w-full md:max-w-sm p-4 flex flex-col gap-4">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-5 w-36 rounded-md" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-5 w-32 rounded-md" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>
          </Card>

          {/* Community Card Skeleton */}
          <Card className="w-full md:max-w-sm p-4 flex flex-col gap-4">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-md" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
