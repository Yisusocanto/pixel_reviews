import axiosInstance from "../config/axiosConfig";

//requests functions
export const signUp = async (formData: object) => {
  const { data } = await axiosInstance.post("/auth/sign_up", formData);
  return data;
};

export const login = async (formData: object) => {
  const { data } = await axiosInstance.post("/auth/login", formData);
  return data;
};

export const logOut = async () => {
  const { data } = await axiosInstance.get("/auth/logout");
  return data;
};

export const passwordRecovery = async (email: string) => {
  const { data } = await axiosInstance.post("/auth/password_recovery", {
    email: email,
  });
  return data;
};

export const passwordReset = async (
  resetToken: string,
  newPassword: string
) => {
  const { data } = await axiosInstance.post("/auth/password_reset", {
    reset_token: resetToken,
    new_password: newPassword,
  });
  return data;
};
