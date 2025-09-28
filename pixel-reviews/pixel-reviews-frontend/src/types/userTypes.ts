import type {Review, Rating} from "@/types/gameTypes"

export interface User {
  user_id: number;
  email: string;
  username: string;
  name: string;
  lastname: string;
  birthday: string;
  createdAt: string;
  reviews?: Array<Review>
  ratings?: Array<Rating>
}

