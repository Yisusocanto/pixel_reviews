import axiosInstance from "@/lib/axiosConfig";
import type { Game } from "@/types/gameTypes";

interface GameDetails {
  game: Game | null;
}

export const getGameDetails = async (
  slug: string,
  cookieHeader?: string
): Promise<GameDetails> => {
  const { data } = await axiosInstance.get(`/games/${slug}`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });
  return data;
};

export const searchGames = async (gameTitle: string) => {
  const { data } = await axiosInstance.get(`/games/search/${gameTitle}`);
  return data;
};

export const inUserWishlist = async (gameID: number) => {
  const { data } = await axiosInstance.get(`/games/${gameID}/in_user_wishlist`);
  return data.inUserWishlist;
};
