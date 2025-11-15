import type { User } from "@/types/userTypes";
import type { WishlistItem } from "./wishlistType";

export interface Game {
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
  game_id: number;
  title: string;
  slug: string;
  releaseDate: string;
  imageURL: string;
  description: string;
  developers?: Array<Developer>;
  publishers?: Array<Publisher>;
  ratings?: Array<Rating>;
  reviews?: Array<Review>;
  wishlist?: Array<WishlistItem>
}

export interface SearchedGame {
  title: string;
  slug: string;
  releaseDate: string;
  imageURL: string;
}

export interface Developer {
  developer_id: number;
  name: string;
  slug: string;
  games?: Array<Game>;
}

export interface Publisher {
  publisher_id: number;
  name: string;
  slug: string;
  games?: Array<Game>;
}

export interface Rating {
  rating_id: number;
  score: number;
  createdAt: string;
  game?: Game;
  author?: User;
  review?: Review;
}

export interface Review {
  review_id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  game?: Game;
  author?: User;
  rating?: Rating;
}
