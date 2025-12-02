import { AxiosError } from "axios";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Quitar Content-Type cuando el body es FormData para no romper el boundary
axiosInstance.interceptors.request.use((config: any) => {
  if (config && config.data && config.data instanceof FormData) {
    // el navegador/axios añadirá el Content-Type correcto con boundary
    if (config.headers) {
      delete config.headers["Content-Type"];
    }
  }
  return config;
});

// function that initializes the axios intercept
export const setupAxiosInterceptors = (onAuthError: () => void) => {
  axiosInstance.interceptors.response.use(
    // If the response is correct, the response is simply returned
    (response) => response,
    // If the response is an error, the context is updated to false
    (error: AxiosError) => {
      // Check if the error is 401 and NOT from the change password endpoint
      if (
        error.response?.status === 401 &&
        !error.config?.url?.includes("/settings/change_password") &&
        !error.config?.url?.includes("/auth/verify") &&
        !error.config?.url?.includes("/auth/password_reset") &&
        !error.config?.url?.includes("/auth/login")
      ) {
        onAuthError();
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
