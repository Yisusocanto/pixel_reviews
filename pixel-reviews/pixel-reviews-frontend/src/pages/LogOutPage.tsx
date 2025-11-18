import { useEffect } from "react";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import { useLogOut } from "@/hooks/fetching/useLogOut";

function LogOutPage() {
  const { mutate: loggOutUser } = useLogOut();

  useEffect(() => {
    loggOutUser();
  }, []);

  return <SpinnerComponent />;
}

export default LogOutPage;
