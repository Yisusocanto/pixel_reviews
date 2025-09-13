import type { AxiosResponse } from "axios";
import axiosInstance from "../config/axiosConfig";

//requests functions
export const signUp = async (data: object): Promise<AxiosResponse> => {
  const response = await axiosInstance.post("/auth/sign_up", data);
  return response;
};

export const login = async (data: object): Promise<AxiosResponse> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response;
};

export const logOut = async (): Promise<AxiosResponse> => {
  const response = await axiosInstance.get("/auth/logout");
  return response;
};
