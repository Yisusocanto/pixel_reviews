import { Review } from "@/types/reviewTypes";

export interface Game {
  gameID: number;
  title: string;
  slug: string;
  releaseDate: string;
  imageURL: string;
  description: string;
  inUserWishlist: boolean;
  screenshots?: Array<string>;
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
  totalWishlist: number;
  developers?: Array<Developer>;
  publishers?: Array<Publisher>;
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
