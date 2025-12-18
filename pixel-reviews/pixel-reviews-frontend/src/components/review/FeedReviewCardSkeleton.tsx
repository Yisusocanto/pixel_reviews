"use client";

import { Skeleton } from "@heroui/react";

interface FeedReviewCardSkeletonProps {
  className?: string;
}

export default function FeedReviewCardSkeleton({
  className,
}: FeedReviewCardSkeletonProps) {
  return (
    <div
      className={`relative min-h-80 md:min-h-96 w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a] px-2 sm:px-4 py-3 ${className}`}
    >
      <div className="absolute inset-0 bg-linear-to-br from-white/2 via-transparent to-white/2" />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-[#0f0f0f] border border-white/8 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
          {/* Game Cover Skeleton */}
          <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0f] via-transparent to-transparent z-10" />
            <Skeleton className="w-full h-full rounded-none" />
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 md:p-6">
            {/* Game Title & Rating Skeleton */}
            <div className="mb-3 sm:mb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-6 sm:h-7 md:h-8 w-48 sm:w-56 md:w-64 rounded-lg" />
                  <div className="h-px w-12 sm:w-16 bg-linear-to-r from-white/40 to-transparent mt-1" />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <Skeleton className="h-5 sm:h-6 w-28 sm:w-32 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Review Title Skeleton */}
            <Skeleton className="h-7 sm:h-8 md:h-10 lg:h-12 w-full max-w-md rounded-lg mb-2 md:mb-4" />

            {/* Review Content Skeleton */}
            <div className="mb-3 sm:mb-4 space-y-2">
              <Skeleton className="h-4 sm:h-5 md:h-6 w-full rounded-lg" />
              <Skeleton className="h-4 sm:h-5 md:h-6 w-full rounded-lg" />
              <Skeleton className="h-4 sm:h-5 md:h-6 w-3/4 rounded-lg" />
            </div>

            {/* Author & Date Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-white/8">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 sm:h-3.5 w-12 rounded-md" />
                  <Skeleton className="h-4 sm:h-5 w-24 rounded-md" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 sm:h-3.5 w-16 rounded-md" />
                  <Skeleton className="h-4 sm:h-5 w-20 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none" />
    </div>
  );
}
