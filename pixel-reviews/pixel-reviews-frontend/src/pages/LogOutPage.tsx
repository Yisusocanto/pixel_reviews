import { logOut } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContextProvider";

function LogOutPage() {
  const navigate = useNavigate();
  const { setActiveSession } = useAuth();

  useEffect(() => {
    const logOutFunction = async () => {
      try {
        await logOut();
        setActiveSession(false);
      } catch (error: any) {
        console.log(error);
      } finally {
        navigate("/auth/login");
      }
    };
    logOutFunction();
  }, []);

  return <div>Cerrando Sesion...</div>;
}

export default LogOutPage;
