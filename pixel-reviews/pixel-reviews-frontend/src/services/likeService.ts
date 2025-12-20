import axiosInstance from "@/lib/axiosConfig";

export const toggleLike = async (reviewID: number) => {
  const { data } = await axiosInstance.post("/likes/toggle", {
    review_id: reviewID,
  });
  return data;
};
