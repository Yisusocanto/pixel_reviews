import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContextProvider";
import { logOut } from "@/services/authService";

export const useLogOut = () => {
  const { setUserData, setActiveSession } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      setUserData(null), setActiveSession(false);
      navigate("/auth/login");
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};
