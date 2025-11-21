import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/services/authService";

export const useSignUp = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: object) => signUp(formData),
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data.user);
      navigate("/");
    },
    onError: (error: any) => {
      console.log("Sign Up error: ", error);
    },
  });
};
