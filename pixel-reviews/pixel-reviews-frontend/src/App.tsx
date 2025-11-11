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
import SettingsPage from "./pages/SettingsPage";
import PasswordRecovery from "./pages/PasswordRecovery";
import PasswordReset from "./pages/PasswordReset";
import NotFoundPage from "./pages/NotFoundPage";
//components
import Background from "./components/commonsComponents/Background";
import NavBar from "./components/commonsComponents/NavBar";
import { Footer } from "./components/commonsComponents/Footer";
import SpinnerComponent from "./components/commonsComponents/SpinnerComponent";
//Context and Config
import { useAuth } from "./context/AuthContextProvider";
import { setupAxiosInterceptors } from "./config/axiosConfig";
// Analytics
import { Analytics } from "@vercel/analytics/react";

function App() {
  const { logoutFunction, loading } = useAuth();

  //The interceptor is inicializated
  useEffect(() => {
    setupAxiosInterceptors(logoutFunction);
  }, []);

  if (loading) {
    return <SpinnerComponent />;
  }

  return (
    <div className="min-h-screen flex flex-col font-exo">
      <Analytics />
      <Background />
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/logout" element={<LogOutPage />} />
        <Route path="/auth/password_recovery" element={<PasswordRecovery />} />
        <Route path="/auth/password_reset" element={<PasswordReset />} />

        <Route path="/users/:username/" element={<UserProfilePage />} />
        <Route path="/users/:username/:tab" element={<UserProfilePage />} />

        <Route path="/search/:gameTitle" element={<SearchGamesResultPage />} />
        <Route path="/games/:slug" element={<GameDetailsPage />} />

        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/:tab" element={<SettingsPage />} />

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
