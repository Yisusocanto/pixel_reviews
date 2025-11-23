import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/userTypes";
import { useSession } from "@/hooks/fetching/auth/useSession";
import { useLogOut } from "@/hooks/fetching/auth/useLogOut";

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
  user: User | undefined;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
  children: ReactNode;
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const { data: user, isLoading, isError } = useSession();

  const { mutate: logoutMutate } = useLogOut();

  const isAuthenticated = !!user && !isError;

  const logout = () => {
    logoutMutate();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        logout,
        isLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
