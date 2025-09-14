import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../config/axiosConfig";
import type UserData from '../types/userTypes'
interface AuthContextType {
  activeSession: boolean;
  setActiveSession: (value: boolean) => void;
  logoutFunction: () => void;
  loading: boolean;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
  children: ReactNode;
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [activeSession, setActiveSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Checks if there is an active section when loading
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call to the endpoit wo verifies the token
        const response = await axiosInstance.get("/auth/verify");
        setUserData(response.data.user_data);
        // If the token is valid
        setActiveSession(true);
      } catch (error) {
        console.log("The user is not authenticated");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logoutFunction = () => {
    setActiveSession(false);
  };

  return (
    <AuthContext.Provider
      value={{
        activeSession,
        setActiveSession,
        logoutFunction,
        loading,
        userData,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
