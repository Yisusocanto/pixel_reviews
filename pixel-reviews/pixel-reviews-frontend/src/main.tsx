import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Orbitron
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/orbitron/900.css';

// Exo 2
import '@fontsource/exo-2/400.css';
import '@fontsource/exo-2/700.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false
    }
  
  }
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
      <ReactQueryDevtools/>
    </AuthContextProvider>
    </QueryClientProvider>
    
  </StrictMode>
);
