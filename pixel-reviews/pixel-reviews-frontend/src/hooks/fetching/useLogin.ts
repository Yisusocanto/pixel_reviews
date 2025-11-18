import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/authService";
import { useAuth } from "@/context/AuthContextProvider";
import { useNavigate } from "react-router-dom";

interface LoginData {
  username: string;
  password: string;
}

export const useLogin = () => {
  const { setActiveSession, setUserData } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: (data) => {
      setActiveSession(true);
      setUserData(data.user);
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Login error:", error);
    },
  });
};
