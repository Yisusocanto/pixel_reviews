import axiosInstance from "@/config/axiosConfig";
import type { AxiosResponse } from "axios";

export const addToWishlist = async (
  gameID: number,
  userID: number
): Promise<AxiosResponse> => {
  const response = axiosInstance.post("/wishlist/add_to_wishlist", {
    game_id: gameID,
    user_id: userID,
  });
  return response;
};

export const removeFromWishlist = async (
  gameID: number,
  userID: number
): Promise<AxiosResponse> => {
  const response = axiosInstance.post("/wishlist/remove_from_wishlist", {
    game_id: gameID,
    user_id: userID,
  });
  return response;
};
