import { AxiosError } from "axios";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// function that initializes the axios intercept
export const setupAxiosInterceptors = (onAuthError: () => void) => {
  axiosInstance.interceptors.response.use(
    // If the response is correct, the response is simply returned
    (response) => response,
    // If the response is an error, the context is updated to false
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        onAuthError();
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
