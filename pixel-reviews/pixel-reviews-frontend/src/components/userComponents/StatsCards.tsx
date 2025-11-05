// Components
import { Card } from "../luxe/card";
import { Clock8, Gamepad2, MessageSquare, Star } from "lucide-react";
// Types
import type { User } from "@/types/userTypes";
import { useEffect } from "react";

interface StatisticsProps {
  userData?: User;
}

function StatsCards({ userData }: StatisticsProps) {
  useEffect(()=>console.log(userData))
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        <Card variant="default" className="flex justify-between gap-4 p-7">
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-lg">Total Reviews</h3>
            <span className="text-primary font-bold text-4xl">
              {userData?.totalReviews}
            </span>
            {/* {<span className="text-green-500">+12 este mes</span>} */}
          </div>
          <div className="flex items-center">
            <div className="bg-accent p-3 rounded-xl">
              <MessageSquare size={36} />
            </div>
          </div>
        </Card>
        <Card variant="default" className="flex justify-between gap-4 p-7">
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-lg">Average Ratings</h3>
            <span className="text-primary font-bold text-4xl">
              {userData?.averageRating}
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
        <Card variant="default" className="flex justify-between gap-4 p-7">
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-lg">Total Ratings</h3>
            <span className="text-primary font-bold text-4xl">
              {userData?.totalRatings}
            </span>
            {/* {<span className="text-green-500">+12 este mes</span>} */}
          </div>
          <div className="flex items-center">
            <div className="bg-blue-400/10 p-3 rounded-xl">
              <Gamepad2 size={36} className="text-blue-500" />
            </div>
          </div>
        </Card>
        {/* {<Card
          variant="default"
          className="flex justify-between gap-4 p-7"
        >
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-lg">Played Hours</h3>
            <span className="text-primary font-bold text-4xl">400</span>
          </div>
          <div className="flex items-center">
            <div className="bg-purple-400/10 p-3 rounded-xl">
              <Clock8 size={36} className="text-purple-500" />
            </div>
          </div>
        </Card>} */}
      </div>
    </div>
  );
}

export default StatsCards;
