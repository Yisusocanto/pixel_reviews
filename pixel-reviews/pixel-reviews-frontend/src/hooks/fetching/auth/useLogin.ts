import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/services/authService";
import { useNavigate } from "react-router-dom";

interface LoginData {
  username: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data.user);
      navigate("/");
    },
  });
};
