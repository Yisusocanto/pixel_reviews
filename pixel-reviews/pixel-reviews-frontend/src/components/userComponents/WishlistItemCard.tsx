import { useAuth } from "@/context/AuthContextProvider";
// Components
import { Card } from "../luxe/card";
import { Calendar, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
// Services
import { removeFromWishlist } from "@/services/wishlistService";
// Types
import type { WishlistItem } from "@/types/wishlistType";
// Utils
import { dateFormatter } from "@/utils/dateFormatter";
import { Button } from "../ui/button";

interface WishlistItemCardProps {
  wishlistItem: WishlistItem;
  ownProfile: boolean;
}

function WishlistItemCard({ wishlistItem, ownProfile }: WishlistItemCardProps) {
  const { userData, setUserData } = useAuth();
  const displayErrorToast = (e: any) => {
    toast.error("Error", {
      description: `Error removing from the wishlist ${e}`,
      duration: 5000,
    });
  };
  const handleRemoveFromWishlist = async () => {
    if (userData) {
      try {
        const response = await removeFromWishlist(
          wishlistItem.game.game_id,
          userData?.user_id
        );
        setUserData(response.data.user);
      } catch (error: any) {
        displayErrorToast(error);
      }
    }
  };
  return (
    <div>
      <Toaster theme="dark" richColors={true} />
      <Card className="flex flex-col md:flex-row gap-4 bg-(--accent-color)">
        <div className="flex-1">
          <img
            src={wishlistItem.game.imageURL}
            alt="game's cover"
            className="rounded-lg shadow-2xl object-cover h-full m-auto"
          />
        </div>
        <div className="flex flex-4 flex-row">
          <div className="flex flex-4 flex-col gap-4">
            <h3 className="text-2xl text-primary font-orbitron font-bold ">
              <Link
                to={`/games/${wishlistItem.game.slug}`}
                className="hover:text-primary-muted"
              >
                {wishlistItem.game.title}
              </Link>
            </h3>
            <div className="flex gap-2 items-center">
              <Star size={16} className="text-yellow-300" />
              <span className="text-sm sm:text-base">
                Average Rating: {wishlistItem.game.averageRating}/5
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Calendar size={16} />
              <span className="text-sm sm:text-base">
                Added at {dateFormatter(wishlistItem.addedAt)}
              </span>
            </div>
          </div>
          {ownProfile && (
            <div className="flex flex-1 justify-end">
              <Button variant="ghost" onClick={handleRemoveFromWishlist}>
                <Heart className="text-destructive fill-destructive size-6" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default WishlistItemCard;
