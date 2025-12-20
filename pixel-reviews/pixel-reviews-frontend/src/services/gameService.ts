import axiosInstance from "@/lib/axiosConfig";
import type { Game } from "@/types/gameTypes";

interface GameDetails {
  game: Game | null;
}

export const getGameDetails = async (
  slug: string,
  cookieHeader?: string
): Promise<GameDetails> => {
  const { data } = await axiosInstance.get(`/main/games/${slug}`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });
  return data;
};

export const searchGames = async (gameTitle: string) => {
  const { data } = await axiosInstance.get(`/main/search/${gameTitle}`);
  return data;
};
