import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userProfile } from "@/services/userDataService";
import { useAuth } from "@/context/AuthContextProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, UserRound, Gift, PencilLine } from "lucide-react";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import UserProfile from "@/components/userComponents/UserProfile";
import ProfileReviewCard from "@/components/gameReviewComponents/ProfileReviewCard";
import type { User } from "../types/userTypes";

function UserProfilePage() {
  const { username, tab } = useParams();
  const { userData } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userDataProfile, setUserDataProfile] = useState<User | null>(null);
  const navigate = useNavigate();

  const currentTab = tab || "profile";

  const validTabs = ["profile", "notifications", "reviews", "trophies"];
  const activeTab = validTabs.includes(currentTab) ? currentTab : "profile";

  useEffect(() => {
    const bringUserprofile = async () => {
      try {
        const response = await userProfile(username || "");
        setUserDataProfile(response.data.user_data);
        console.log(response.data);
      } catch (error: any) {
        console.log(error.response);
        if (error.response.status == 401) navigate("/auth/login");
        if (error.response.status == 404) {
          setError(error.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };
    bringUserprofile();
  }, []);

  const handleTabChange = (value: string) => {
    navigate(`/users/${username}/${value}`);
  };

  if (loading) {
    return <SpinnerComponent />;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="p-8 mt-6">
      {username == userData?.username ? (
        <UserProfile user={userData} ownProfile={true} />
      ) : (
        <UserProfile user={userDataProfile} />
      )}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full text-sm text-muted-foreground mt-4"
      >
        <TabsList className="grid w-full grid-cols-4" shape="pill">
          <TabsTrigger value="profile">
            <UserRound />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <PencilLine />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="wishlist">
            <Gift />
            Wishlist
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">Content for Profile</TabsContent>
        <TabsContent value="notifications">
          Content for Notifications
        </TabsContent>
        <TabsContent value="reviews">
          <div className="flex flex-col gap-4">
            {userDataProfile?.reviews?.map((review) => (
              <ProfileReviewCard review={review} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="wishlist">Content for wishlist</TabsContent>
      </Tabs>
    </div>
  );
}

export default UserProfilePage;
