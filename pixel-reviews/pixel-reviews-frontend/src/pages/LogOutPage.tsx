import { useEffect } from "react";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import { useLogOut } from "@/hooks/fetching/auth/useLogOut";

function LogOutPage() {
  const { mutate: logOutUser } = useLogOut();

  useEffect(() => {
    logOutUser();
  }, []);

  return <SpinnerComponent />;
}

export default LogOutPage;
