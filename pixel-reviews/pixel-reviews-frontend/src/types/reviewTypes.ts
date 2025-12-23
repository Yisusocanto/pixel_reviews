import { Game } from "@/types/gameTypes";
import { User } from "@/types//userTypes";

export interface Rating {
  ratingID: number;
  score: number;
  createdAt: string;
  game?: Game;
  author?: User;
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
