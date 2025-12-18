import { Card } from "@heroui/react";
import { Heart } from "lucide-react";

interface CommunityCardProps {
  wishlistCount: number;
}

function CommunityCard({ wishlistCount }: CommunityCardProps) {
  return (
    <div className="w-full md:max-w-sm">
      <Card className="flex flex-col gap-4 bg-card border">
        <h3 className="text-lg">Community</h3>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Heart size={18} className="text-danger fill-danger" />
            <span className="text-lg">In Wishlist</span>
          </div>
          <span className="text-lg">{wishlistCount}</span>
        </div>
      </Card>
    </div>
  );
}

export default CommunityCard;
