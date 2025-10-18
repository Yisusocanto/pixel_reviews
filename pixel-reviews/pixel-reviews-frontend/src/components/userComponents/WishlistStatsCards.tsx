import { Heart } from "lucide-react";
import { Card } from "../luxe/card";

function WishlistStatsCards() {
  return (
    <div className="flex flex-col">
      <div className="flex gap-6 justify-between">
        <Card
          variant="revealed-pointer"
          className="flex flex-col items-center gap-2 pu-4"
        >
          <Heart className="text-pink-500" size={36} />
          <span className="text-primary font-bold text-4xl">6</span>
          <span>Games Total</span>
        </Card>
        <Card
          variant="revealed-pointer"
          className="flex flex-col items-center gap-2 pu-4"
        >
          <Heart className="text-pink-500" size={36} />
          <span className="text-primary font-bold text-4xl">6</span>
          <span>Games Total</span>
        </Card>
        <Card
          variant="revealed-pointer"
          className="flex flex-col items-center gap-2 pu-4"
        >
          <Heart className="text-pink-500" size={36} />
          <span className="text-primary font-bold text-4xl">6</span>
          <span>Games Total</span>
        </Card>
        <Card
          variant="revealed-pointer"
          className="flex flex-col items-center gap-2 pu-4"
        >
          <Heart className="text-pink-500" size={36} />
          <span className="text-primary font-bold text-4xl">6</span>
          <span>Games Total</span>
        </Card>
        
      </div>
    </div>
  );
}

export default WishlistStatsCards;
