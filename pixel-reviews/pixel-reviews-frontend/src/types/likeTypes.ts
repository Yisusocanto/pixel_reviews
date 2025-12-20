import { Review } from "./gameTypes";
import { User } from "./userTypes";

interface Like {
  likeID: number;
  userID: number;
  reviewID: number;
  user?: User;
  review?: Review;
}
