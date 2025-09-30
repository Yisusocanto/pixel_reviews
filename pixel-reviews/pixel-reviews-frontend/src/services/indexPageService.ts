import axiosInstance from "@/config/axiosConfig";
import type { AxiosResponse } from "axios";

export const indexPageData = async (): Promise<AxiosResponse> => {
  const response = await axiosInstance.get("/main");
  return response;
};
