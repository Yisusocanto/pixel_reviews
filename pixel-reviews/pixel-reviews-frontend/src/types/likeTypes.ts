import { Review } from "@/types/reviewTypes";
import { User } from "@/types/userTypes";

export interface Like {
  likeID: number;
  userID: number;
  reviewID: number;
  user?: User;
  review?: Review;
}
