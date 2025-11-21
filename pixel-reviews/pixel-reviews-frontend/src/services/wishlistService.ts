import axiosInstance from "@/config/axiosConfig";

export const addToWishlist = async (gameID: number, userID: number) => {
  const { data } = await axiosInstance.post("/wishlist/add_to_wishlist", {
    game_id: gameID,
    user_id: userID,
  });
  return data;
};

export const removeFromWishlist = async (gameID: number, userID: number) => {
  const { data } = await axiosInstance.post("/wishlist/remove_from_wishlist", {
    game_id: gameID,
    user_id: userID,
  });
  return data;
};
