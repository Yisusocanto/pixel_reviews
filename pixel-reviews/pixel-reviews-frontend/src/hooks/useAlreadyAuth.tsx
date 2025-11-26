import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContextProvider";

/**
 * The function `useAlreadyAuth` checks for an active session and navigates to the home page if one
 * exists.
 */
function useAlreadyAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed");
    }
  }, [isAuthenticated, navigate]);
}

export default useAlreadyAuth;
