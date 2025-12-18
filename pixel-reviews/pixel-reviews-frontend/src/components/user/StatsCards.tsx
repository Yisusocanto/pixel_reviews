import { User } from "@/types/userTypes";
import { Card } from "@heroui/react";
import { Gamepad2, MessageSquare, Star } from "lucide-react";

interface StatsCardsProps {
  user: User;
}

function StatsCards({ user }: StatsCardsProps) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 justify-between">
      <Card className="border flex flex-row justify-between gap-4 p-7 w-full">
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-lg">Total Reviews</h3>
          <span className="font-bold text-4xl">{user?.totalReviews}</span>
        </div>
        <div className="flex items-center">
          <div className="bg-purple-400/20 p-3 rounded-xl">
            <MessageSquare size={36} />
          </div>
        </div>
      </Card>
      <Card className="border flex flex-row justify-between gap-4 p-7  w-full">
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-lg">Average Ratings</h3>
          <span className="font-bold text-4xl">
            {user?.averageRating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Star className="text-yellow-400" size={14} /> de 5
          </span>
        </div>
        <div className="flex items-center">
          <div className="bg-yellow-400/10 p-3 rounded-xl">
            <Star size={36} className="text-yellow-400" />
          </div>
        </div>
      </Card>
      <Card className="border flex flex-row justify-between gap-4 p-7 w-full">
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-lg">Total Ratings</h3>
          <span className="font-bold text-4xl">{user?.totalRatings}</span>
        </div>
        <div className="flex items-center">
          <div className="bg-blue-400/10 p-3 rounded-xl">
            <Gamepad2 size={36} className="text-blue-500" />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StatsCards;
