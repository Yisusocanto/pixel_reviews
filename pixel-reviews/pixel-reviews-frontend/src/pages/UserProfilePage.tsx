import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userProfile } from "../services/userDataService";
import { useAuth } from "../context/AuthContextProvider";
import type UserData from "../types/userTypes";

function UserProfilePage() {
  const { username } = useParams();
  const { userData } = useAuth();
  const [ userDataProfile, setUserDataProfile ] = useState<UserData | null>(
    null
  );

  useEffect(() => {
    const bringUserprofile = async () => {
      try {
        const response = await userProfile(username || "empty");
        setUserDataProfile(response.data);
        console.log(response)
      } catch (error: any) {
        console.log(error.response);
        if (error.response.status == 404) {
          return <h1>NO</h1>
        }
      }
    };
    bringUserprofile();
  }, []);

  return (
    <div>
      {username == userData?.username ? (
        <div>
          <h1>My Profile</h1>
          <h2>{userData?.username}</h2>
          <h2>{userData?.email}</h2>
        </div>
      ) : (
        <div>
          <h1>Profile</h1>
          <h2>{userDataProfile?.username}</h2>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;
