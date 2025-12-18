import { AxiosError } from "axios";
import axios from "axios";
import { redirect } from "next/navigation";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config: any) => {
  if (config && config.data && config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  // If the response is correct, the response is simply returned
  (response) => response,
  // If the response is an error, the context is updated to false
  (error: AxiosError) => {
    // Check if the error is 401
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/settings/change_password") &&
      !error.config?.url?.includes("/auth/verify") &&
      !error.config?.url?.includes("/auth/password_reset") &&
      !error.config?.url?.includes("/auth/login")
    ) {
      redirect("/");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
