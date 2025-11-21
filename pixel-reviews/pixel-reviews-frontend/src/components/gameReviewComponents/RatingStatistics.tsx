import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from "@/components/ui/card";
import { RatingComponent } from "@/components/ui/rating";
// Types
import type { Game } from "@/types/gameTypes";

interface RatingStatisticsProps {
  gameData?: Game;
  classname?: string;
}

export default function RatingStatistics({
  gameData,
  classname = "",
}: RatingStatisticsProps) {
  const ratings = Array.isArray(gameData?.ratings) ? gameData!.ratings : [];

  const counts = [0, 0, 0, 0, 0, 0];
  for (const r of ratings) {
    const score = Number((r as any)?.score ?? r);
    if (Number.isFinite(score) && score >= 1 && score <= 5) {
      counts[score] += 1;
    }
  }

  const totalFromProp = Number(gameData?.totalRatings);
  const totalRatings =
    Number.isFinite(totalFromProp) && totalFromProp > 0
      ? Math.round(totalFromProp)
      : counts.slice(1).reduce((a, b) => a + b, 0);

  const formatPct = (count: number) =>
    totalRatings > 0 ? Number(((count / totalRatings) * 100).toFixed(1)) : 0;

  const statistics = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: counts[stars] ?? 0,
    percentage: formatPct(counts[stars] ?? 0),
  }));

  return (
    <Card className={`w-full max-w-sm ${classname}`}>
      <CardHeader className="min-h-auto border-b-0 pt-6">
        <CardHeading>
          <CardTitle>Users Reviews Summary</CardTitle>
          <CardDescription>
            Based on {gameData?.totalRatings} reviews
          </CardDescription>
        </CardHeading>
      </CardHeader>
      <CardContent className="space-y-3">
        {statistics.map((item) => (
          <div
            key={item.stars}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-medium w-2">{item.stars}</span>
              <RatingComponent rating={item.stars} />
            </div>
            <div className="flex items-center gap-0.5 text-sm text-muted-foreground">
              <span>{item.count}</span>
              <span>({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
