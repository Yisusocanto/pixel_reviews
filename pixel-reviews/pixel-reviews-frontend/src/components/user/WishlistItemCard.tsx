"use client";

import { Star, Calendar, Trash, EllipsisVertical } from "lucide-react";
import { Card, Label } from "@heroui/react";
import { Dropdown } from "@heroui/react";
import { useAuth } from "@/providers/AuthProvider";
import { orbitron } from "@/fonts/fonts";
import Link from "next/link";
import Image from "next/image";
import { dateFormatter } from "@/lib/dateFormatter";
import { useRemoveFromWishlist } from "@/hooks/fetching/wishlist/useWishlist";
import { WishlistItem } from "@/types/wishlistType";

interface WishlistItemCardProps {
  wishlistItem: WishlistItem;
  username: string;
}

function WishlistItemCard({ username, wishlistItem }: WishlistItemCardProps) {
  const { user } = useAuth();
  const ownWishlist = user?.username === username;

  const { mutate: removeFromWishlist } = useRemoveFromWishlist(
    wishlistItem.game.slug
  );

  const handleRemoveFromWishlist = async () => {
    if (user) {
      removeFromWishlist(wishlistItem.wishlistItemId);
    }
  };

  return (
    <div>
      <Card className="border flex flex-col md:flex-row gap-4">
        {/* Cover Image*/}
        <div className="shrink-0 relative w-full h-48 md:w-72 md:h-48">
          {wishlistItem.game && (
            <Link
              href={`/games/${wishlistItem.game.slug}`}
              className="relative block w-full h-full"
            >
              <Image
                src={wishlistItem.game.imageURL || "/default-cover.png"}
                alt="Game cover"
                fill
                className="rounded-lg shadow-2xl object-cover overflow-hidden transition-all ease-in-out hover:scale-105 duration-300 hover:shadow-xl"
                sizes="(max-width: 768px) 100vw, 288px"
              />
            </Link>
          )}
        </div>
        <div className="flex justify-between w-full">
          <div className="flex-8 flex flex-col gap-4">
            {/* Game title and genre badges */}
            <div className="flex gap-2">
              <h3
                className={`${orbitron.className} text-2xl font-bold hover:text-muted`}
              >
                <Link href={`/games/${wishlistItem.game?.slug}`}>
                  {wishlistItem.game?.title}
                </Link>
              </h3>
            </div>
            {/* rating and created date */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1">
                <Star size={18} color="yellow" className="fill-yellow-400" />
                <span className="text-sm">
                  <span className="text-primary font-bold text-lg">
                    {wishlistItem.game.averageRating}
                  </span>
                  /5
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span className="text-sm">
                  {dateFormatter(wishlistItem.addedAt)}
                </span>
              </div>
            </div>
          </div>
          {ownWishlist && (
            <div className="flex-1 flex items-start justify-end">
              <Dropdown>
                <Dropdown.Trigger>
                  <EllipsisVertical />
                </Dropdown.Trigger>
                <Dropdown.Popover className={"border"}>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={handleRemoveFromWishlist}
                      className="text-danger hover:bg-default-hover"
                    >
                      <Trash size={16} />
                      <Label className="text-danger text-base">
                        Remove from wishlist
                      </Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default WishlistItemCard;
