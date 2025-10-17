import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

//pages
import GameDetailsPage from "./pages/GameDetailsPage";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SearchGamesResultPage from "./pages/SearchGamesResultPage";
import UserProfilePage from "./pages/UserProfilePage";
import LogOutPage from "./pages/LogOutPage";

//components
// import NavBarComponent from "./components/commonsComponents/NavBarComponent";

//Context and Config
import { useAuth } from "./context/AuthContextProvider";
import { setupAxiosInterceptors } from "./config/axiosConfig";
import NavBar from "./components/commonsComponents/NavBar";

function App() {
  const { logoutFunction, loading } = useAuth();

  //The interceptor is inicializated
  useEffect(() => {
    setupAxiosInterceptors(logoutFunction);
  }, []);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  return (
    <>
      <div id="background" className="dark min-h-screen font-exo">
        <NavBar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/users/:username/" element={<UserProfilePage />} />
          <Route path="/users/:username/:tab" element={<UserProfilePage />} />
          <Route
            path="/search/:gameTitle"
            element={<SearchGamesResultPage />}
          />
          <Route path="/games/:slug" element={<GameDetailsPage />} />
          <Route path="/auth/logout" element={<LogOutPage />} />
          <Route path="/prueba" element={<h1>Hola</h1>} />
          <Route path="/*" element={<h1>Pagina no existe</h1>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
