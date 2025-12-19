import axiosInstance from "@/lib/axiosConfig";

export const toggleWishlistItem = async (gameID: number) => {
  const { data } = await axiosInstance.post("/wishlist/toggle", {
    game_id: gameID,
  });
  return data;
};
