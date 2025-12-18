"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError;
        const status = axiosError?.response?.status;

        // Do not retry on client errors (4xx)
        if (status && status >= 400 && status < 500) {
          return false;
        }

        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

interface TanstackProviderProps {
  children: React.ReactNode;
}

function TanstackProvider({ children }: TanstackProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default TanstackProvider;
