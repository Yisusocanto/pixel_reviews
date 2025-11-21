import { useQuery } from "@tanstack/react-query";
import { getGameDetails, searchGames } from "@/services/gameService";

export const useGameDetails = (slug: string) => {
  return useQuery({
    queryKey: ["game", slug],
    queryFn: () => getGameDetails(slug),
    enabled: !!slug,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

export const useSearchGames = (gameTitle: string) => {
  return useQuery({
    queryKey: ["gameResults", gameTitle],
    queryFn: () => searchGames(gameTitle),
    enabled: !!gameTitle,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
