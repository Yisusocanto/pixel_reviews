import { useState, useEffect, type Dispatch } from "react";
import { useAuth } from "@/context/AuthContextProvider";
// Components
import { Star, MessageCircle, Heart } from "lucide-react";
// import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
// Services
import { addToWishlist, removeFromWishlist } from "@/services/wishlistService";
// Types
import type { Game } from "@/types/gameTypes";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";

interface GameHeroProps {
  gameData?: Game;
  setGameData: Dispatch<Game>;
}

const GameHero = ({ gameData, setGameData }: GameHeroProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [inWishlist, setInWishlist] = useState<boolean>(false);
  const { userData, setUserData } = useAuth();

  useEffect(() => {
    // It is checked whether the game is already added to the user's wishlist.
    if (userData) {
      const game = userData.wishlist?.filter((wishlistItem) => {
        return wishlistItem.game.game_id == gameData?.game_id;
      });
      if (game && game.length > 0) {
        setInWishlist(true);
      } else {
        setInWishlist(false);
      }
    }
  }, []);

  const handleAddToWishlist = async () => {
    if (gameData && userData) {
      setLoading(true);
      try {
        const response = await addToWishlist(
          gameData?.game_id,
          userData?.user_id
        );
        setInWishlist(true);
        setGameData(response.data.game);
        setUserData(response.data.user);
        displaySuccessToast("added to");
      } catch (error: any) {
        displayErrorToast(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveToWishlist = async () => {
    if (gameData && userData) {
      setLoading(true);
      try {
        const response = await removeFromWishlist(
          gameData?.game_id,
          userData?.user_id
        );
        setInWishlist(false);
        setGameData(response.data.game);
        setUserData(response.data.user);
        displaySuccessToast("remove from");
      } catch (error: any) {
        displayErrorToast(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }
  };

  const displaySuccessToast = (action: string) => {
    toast.success(`Game ${action} the Wishlist successfully.`, {
      description: "The game has been added to the wishlist succesfully.",
      duration: 5000,
    });
  };

  const displayErrorToast = (error: string) => {
    toast.error("Error", {
      description: `Error adding/removing the game to/from the Wishlist: ${error}`,
      duration: 5000,
    });
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {loading ? <SpinnerComponent /> : null}
      <Toaster theme="dark" richColors={true} />
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${gameData?.imageURL})`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 via-40% to-transparent to-70% z-10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-12 px-8 md:px-20  lg:px-35 md:mx-8 text-primary">
        {/* Tags */}
        {/* <div className="flex gap-2 mb-4">
        <Badge variant={"secondary"} className="text-base">
          RPG
        </Badge>
        <Badge variant={"secondary"} className="text-base">
          Action
        </Badge>
        <Badge variant={"secondary"} className="text-base">
          Shooter
        </Badge>
        <Badge variant={"secondary"} className="text-base">
          Strategy
        </Badge>
      </div> */}

        {/* Title */}
        <h1 className="text-4xl font-bold font-orbitron mb-4">
          {gameData?.title}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" />
            <span className="text-4xl font-bold">
              {gameData?.averageRating.toFixed(1)}
            </span>
            <span className="text-xl text-primary-muted">/ 5</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="text-primary fill-primary" />
            <span className="text-base text-primary-muted">
              {gameData?.totalReviews} reviews
            </span>
          </div>
        </div>
        <div>
          <Button
            variant={"secondary"}
            className="px-2 py-3 text-lg font-semibold flex items-center gap-2 cursor-pointer shadow-2xl"
            onClick={inWishlist ? handleRemoveToWishlist : handleAddToWishlist}
          >
            <Heart
              
              className={`size-5 ${
                inWishlist
                  ? "text-destructive-secondary fill-destructive-secondary"
                  : "text-destructive-secondary"
              }`}
            />
            {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </Button>
        </div>
        {/* Buttons */}
        {/* {<div className="flex gap-4">
          <Button
            className="px-6 py-3 font-semibold flex items-center gap-2 cursor-pointer shadow-2xl"
            variant="shine"
          >
            <Download />
            Save in Library
          </Button>
          
        <Button className=" px-4 py-3 cursor-pointer shadow-2xl">
          <Link2 />
        </Button>
        </div>} */}
      </div>
    </div>
  );
};

export default GameHero;
