import axiosInstance from "@/config/axiosConfig";
import type { Game, Review, Rating } from "@/types/gameTypes";

interface GameDetails {
  game: Game | null;
  userRating: Rating | null;
  userReview: Review | null;
}

export const getGameDetails = async (slug: string): Promise<GameDetails> => {
  const { data } = await axiosInstance.get(`/main/games/${slug}`);
  return data;
};

export const searchGames = async (gameTitle: string) => {
  const { data } = await axiosInstance.get(`/main/search/${gameTitle}`);
  return data;
};
