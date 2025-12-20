import type { User } from "@/types/userTypes";
import type { WishlistItem } from "./wishlistType";

export interface Game {
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
  totalWishlist: number;
  gameID: number;
  title: string;
  slug: string;
  releaseDate: string;
  imageURL: string;
  screenshots?: Array<string>;
  description: string;
  inUserWishlist: boolean;
  developers?: Array<Developer>;
  publishers?: Array<Publisher>;
  ratings?: Array<Rating>;
  reviews?: Array<Review>;
}

export interface SearchedGame {
  title: string;
  slug: string;
  releaseDate: string;
  imageURL: string;
}

export interface Developer {
  developerID: number;
  name: string;
  slug: string;
  games?: Array<Game>;
}

export interface Publisher {
  publisherID: number;
  name: string;
  slug: string;
  games?: Array<Game>;
}

export interface Rating {
  ratingID: number;
  score: number;
  createdAt: string;
  game?: Game;
  author?: User;
  review?: Review;
}

export interface Review {
  reviewID: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  totalLikes: number;
  game?: Game;
  author?: User;
  rating?: Rating;
}
