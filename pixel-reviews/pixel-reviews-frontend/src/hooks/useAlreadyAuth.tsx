import { alreadyAuth } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//function that checks whether the user is authenticated or not
function useAlreadyAuth(reedirectPath: string) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const activeSession = await alreadyAuth();
      if (activeSession) {
        //If the user has an active session, redirect to the specified route
        navigate(reedirectPath);
      }
    };
    checkSession();
  }, [navigate, reedirectPath]);
}
export default useAlreadyAuth;
