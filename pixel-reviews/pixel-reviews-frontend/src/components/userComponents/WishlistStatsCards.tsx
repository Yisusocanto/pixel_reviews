import { Heart } from "lucide-react";
import { Card } from "../luxe/card";
// Types
import type { WishlistItem } from "@/types/wishlistType";

interface WishlistStatsCardsProps {
  wishlist?: Array<WishlistItem>;
}

function WishlistStatsCards({ wishlist }: WishlistStatsCardsProps) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-6 justify-center">
        <Card
          variant="default"
          className="flex flex-col w-sm items-center gap-2 p-4"
        >
          <Heart className="text-pink-500" size={36} />
          <span className="text-primary font-bold text-4xl">
            {wishlist?.length ?? 0}
          </span>
          <span>total games on the wishlist</span>
        </Card>
      </div>
    </div>
  );
}

export default WishlistStatsCards;
