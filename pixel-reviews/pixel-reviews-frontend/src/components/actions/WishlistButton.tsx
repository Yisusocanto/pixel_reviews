"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import { Game } from "@/types/gameTypes";
import { useAuth } from "@/providers/AuthProvider";
import { WishlistItem } from "@/types/wishlistType";
import { Heart } from "lucide-react";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/fetching/wishlist/useWishlist";

interface WishlistButtonProps {
  game?: Game;
}

function WishlistButton({ game }: WishlistButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [inWishlist, setInWishlist] = useState<boolean>(false);
  const [wishlistItemId, setWishlistItemId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user && game) {
      const foundGame = user.wishlist?.find((wishlistItem: WishlistItem) => {
        return wishlistItem.game.gameID == game.gameID;
      });

      if (foundGame) {
        setInWishlist(true);
        setWishlistItemId(foundGame.wishlistItemId);
      } else {
        setInWishlist(false);
        setWishlistItemId(null);
      }
    }
  }, [user, game]);

  const { mutate: addToWishlist, isPending: isAddToWishlistPending } =
    useAddToWishlist(game?.slug ?? "");
  const { mutate: removeFromWishlist, isPending: isRemoveFromWishlistPending } =
    useRemoveFromWishlist(game?.slug ?? "");

  const handleAddToWishlist = async () => {
    if (game && user) {
      addToWishlist(
        { gameID: game.gameID, userID: user.userID },
        {
          onSuccess: () => setInWishlist(true),
        }
      );
    } else router.push("/login");
  };

  const handleRemoveToWishlist = async () => {
    if (game && user && wishlistItemId) {
      removeFromWishlist(wishlistItemId, {
        onSuccess: () => {
          setInWishlist(false);
          setWishlistItemId(null);
        },
      });
    }
  };

  return (
    <Button
      variant="secondary"
      isPending={isAddToWishlistPending || isRemoveFromWishlistPending}
      onPress={inWishlist ? handleRemoveToWishlist : handleAddToWishlist}
      className={"text-danger text-lg"}
    >
      {({ isPending }) => (
        <>
          {isPending ? (
            <Spinner color="current" />
          ) : (
            <Heart
              size={16}
              className={`${inWishlist ? "fill-danger" : "fill-none"}`}
            />
          )}
          {inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        </>
      )}
    </Button>
  );
}

export default WishlistButton;
