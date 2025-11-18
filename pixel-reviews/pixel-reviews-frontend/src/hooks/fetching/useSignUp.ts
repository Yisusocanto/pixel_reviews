import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContextProvider";
import { signUp } from "@/services/authService";

export const useSignUp = () => {
  const { setActiveSession, setUserData } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: object) => signUp(formData),
    onSuccess: (data) => {
      setActiveSession(true);
      setUserData(data.user);
      navigate("/");
    },
    onError: (error: any) => {
      console.log("Sign Up error: ", error);
    },
  });
};
