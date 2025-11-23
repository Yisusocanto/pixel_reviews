import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logOut } from "@/services/authService";

export const useLogOut = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      navigate("/auth/login");
      queryClient.setQueryData(["authUser"], null);
    },
  });
};
