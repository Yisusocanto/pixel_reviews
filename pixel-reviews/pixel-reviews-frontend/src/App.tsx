import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameDetailsPage from "./pages/GameDetailsPage";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SearchGamesResultPage from "./pages/SearchGamesResultPage";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  return (
    <>
    <div className="min-h-screen bg-center bg-fixed bg-[url('/images/background.png')] bg-cover">
      <h1>Hola</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/user/:username" element={<UserProfilePage />} />
          <Route
            path="/search/:game_name"
            element={<SearchGamesResultPage />}
          />
          <Route path="/game:slug" element={<GameDetailsPage />} />
          <Route path="/prueba" element={<h1>Hola</h1>} />
          <Route path="/*" element={<h1>Pagina no existe</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
    </>
  );
}

export default App;
