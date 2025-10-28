import type { Review, Rating } from "@/types/gameTypes";

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
  createdAt: string;
  reviews?: Array<Review>;
  ratings?: Array<Rating>;
}
