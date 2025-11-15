import type { Review, Rating } from "@/types/gameTypes";
import type { WishlistItem } from "./wishlistType";
export interface User {
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
  user_id: number;
  email: string;
  username: string;
  name: string;
  lastname: string;
  birthday: string;
  location: string;
  bio: string;
  website: string;
  avatarUrl: string
  createdAt: string;
  reviews?: Array<Review>;
  ratings?: Array<Rating>;
  wishlist?: Array<WishlistItem>
}
