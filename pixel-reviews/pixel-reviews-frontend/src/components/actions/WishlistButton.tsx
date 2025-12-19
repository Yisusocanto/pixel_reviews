"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import { useAuth } from "@/providers/AuthProvider";
import { Heart } from "lucide-react";
import { useToggleWishlistItem } from "@/hooks/fetching/wishlist/useWishlist";
import { toast } from "sonner";

interface WishlistButtonProps {
  inUserWishlist: boolean;
  gameID: number;
}

function WishlistButton({ gameID, inUserWishlist }: WishlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const [inWishlist, setInWishlist] = useState<boolean>(inUserWishlist);
  const router = useRouter();

  const { mutate: toggleWishlistItem, isPending } = useToggleWishlistItem();

  const handleToggleWishlistItem = async () => {
    if (!isAuthenticated) router.push("/login");

    toggleWishlistItem(gameID, {
      onSuccess: () => {
        setInWishlist(!inWishlist);
        toast.success(
          `Game ${inWishlist ? "removed from the" : "added to the"} wishlist.`,
          { duration: 5000 }
        );
      },
    });
  };

  return (
    <Button
      variant="secondary"
      isPending={isPending}
      onPress={handleToggleWishlistItem}
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
