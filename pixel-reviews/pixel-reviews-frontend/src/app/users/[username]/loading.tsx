import { Card, Skeleton } from "@heroui/react";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* Profile Card Skeleton */}
      <div className="w-full mt-6">
        <Card className="max-w-3/4 mx-auto flex flex-col md:flex-row gap-4 py-6 px-4 md:py-10 md:px-8">
          {/* Avatar Section */}
          <div className="flex-1 flex flex-col items-center gap-4">
            <Skeleton className="size-30 md:size-45 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          {/* Info Section */}
          <div className="flex-4 flex flex-col gap-4">
            <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 rounded-lg mx-auto md:mx-0" />
            <Skeleton className="h-5 w-full max-w-md rounded-lg mx-auto md:mx-0" />
            <Skeleton className="h-5 w-3/4 max-w-sm rounded-lg mx-auto md:mx-0" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-2 items-center md:items-start">
                <Skeleton className="h-5 w-36 rounded-md" />
                <Skeleton className="h-5 w-44 rounded-md" />
              </div>
              <div className="flex flex-col gap-2 items-center md:items-start">
                <Skeleton className="h-5 w-32 rounded-md" />
                <Skeleton className="h-5 w-40 rounded-md" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full max-w-3/4 mx-auto">
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1 p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          </Card>
          <Card className="flex-1 p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
