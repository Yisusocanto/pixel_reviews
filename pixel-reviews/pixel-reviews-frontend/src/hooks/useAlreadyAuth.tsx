import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContextProvider";

//function that checks whether the user is authenticated or not
function useAlreadyAuth() {
  const { activeSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeSession) {
      navigate("/");
    }
  });
}

export default useAlreadyAuth;
