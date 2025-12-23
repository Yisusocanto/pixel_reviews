import type { User } from "@/types/userTypes";
import type { Game } from "@/types/gameTypes";

export interface WishlistItem {
  wishlistItemID: number;
  addedAt: string;
  user: User;
  game: Game;
}
