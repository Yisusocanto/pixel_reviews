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

export const passwordRecovery = async (email: string) => {
  const response = await axiosInstance.post("/auth/password_recovery", {
    email: email,
  });
  return response;
};

export const passwordReset = async (
  resetToken: string,
  newPassword: string
) => {
  const response = await axiosInstance.post("/auth/password_reset", {
    reset_token: resetToken,
    new_password: newPassword,
  });
  return response;
};
