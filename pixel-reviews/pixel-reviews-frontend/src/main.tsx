import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextProvider";
// Orbitron
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/700.css';
import '@fontsource/orbitron/900.css';

// Exo 2
import '@fontsource/exo-2/400.css';
import '@fontsource/exo-2/700.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>
);
