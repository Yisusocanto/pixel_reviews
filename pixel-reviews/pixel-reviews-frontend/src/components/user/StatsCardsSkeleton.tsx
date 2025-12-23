import { Card, Skeleton } from "@heroui/react";

export default function StatsCardsSkeleton() {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 xl:gap-6 justify-between">
      {[...Array(4)].map((_, i) => (
        <Card
          key={i}
          className="border flex flex-row justify-between items-center gap-4 p-7 w-full"
        >
          <div className="flex flex-col items-start gap-2 w-full">
            <Skeleton className="rounded-lg w-24 h-5" />
            <Skeleton className="rounded-lg w-16 h-8" />
          </div>
          <div className="flex items-center">
            <Skeleton className="rounded-xl w-12 h-12" />
          </div>
        </Card>
      ))}
    </div>
  );
}
