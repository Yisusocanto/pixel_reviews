import { Heart } from "lucide-react";
import { Card } from "@heroui/react";

interface WishlistStatsCardsProps {
  wishlistCount: number;
}

function WishlistStatsCards({ wishlistCount }: WishlistStatsCardsProps) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-6 justify-center">
        <Card className="border flex flex-col w-sm items-center gap-2 p-4">
          <Heart className="text-pink-500" size={36} />
          <span className="font-bold text-4xl">{wishlistCount}</span>
          <span>Total games in the wishlist</span>
        </Card>
      </div>
    </div>
  );
}

export default WishlistStatsCards;
