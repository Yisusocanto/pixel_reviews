import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContextProvider";
// Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, PencilLine } from "lucide-react";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import NotFoundPage from "./NotFoundPage";
import UserProfile from "@/components/userComponents/UserProfile";
import ProfileReviewCard from "@/components/gameReviewComponents/ProfileReviewCard";
import StatsCards from "@/components/userComponents/StatsCards";
// import WishlistStatsCards from "@/components/userComponents/WishlistStatsCards";
// Services
import { getUserData } from "@/services/userService";
// Types
import type { User } from "../types/userTypes";

function UserProfilePage() {
  const { username, tab } = useParams();
  const { userData } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userDataProfile, setUserDataProfile] = useState<User | null>(null);
  const navigate = useNavigate();

  const currentTab = tab || "profile";

  const validTabs = ["profile", "reviews"];
  const activeTab = validTabs.includes(currentTab) ? currentTab : "profile";

  useEffect(() => {
    const getUserProfileData = async () => {
      try {
        const response = await getUserData(username || "");
        setUserDataProfile(response.data.user_data);
      } catch (error: any) {
        if (error.response.status == 401) navigate("/auth/login");
        if (error.response.status == 404) {
          setError("404");
        }
      } finally {
        setLoading(false);
      }
    };
    getUserProfileData();
  }, []);

  const handleTabChange = (value: string) => {
    navigate(`/users/${username}/${value}`);
  };

  if (loading) {
    return <SpinnerComponent />;
  }

  if (error == "404") {
    return <NotFoundPage />;
  }

  return (
    <div className="p-8 mt-6">
      {username == userData?.username ? (
        <div className="w-full">
          <UserProfile user={userData} ownProfile={true} />
        </div>
      ) : (
        <div>
          <UserProfile user={userDataProfile} />
        </div>
      )}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full text-sm text-muted-foreground mt-4"
      >
        <TabsList className="grid w-full grid-cols-2" shape="pill">
          <TabsTrigger value="profile">
            <UserRound />
            Profile
          </TabsTrigger>
          {/* {<TabsTrigger value="notifications">
            <Library />
            Library
          </TabsTrigger>} */}
          <TabsTrigger value="reviews">
            <PencilLine />
            Reviews
          </TabsTrigger>
          {/* {<TabsTrigger value="wishlist">
            <Gift />
            Wishlist
          </TabsTrigger>} */}
        </TabsList>
        {/* Tabs Content */}
        <TabsContent value="profile">
          <div className="mt-8">
            {username == userData?.username ? (
              <StatsCards userData={userData || undefined} />
            ) : (
              <StatsCards userData={userDataProfile || undefined} />
            )}
          </div>
        </TabsContent>
        {/* {<TabsContent value="notifications">
          Content for Notifications
        </TabsContent>} */}
        <TabsContent value="reviews">
          <div className="flex flex-col gap-4">
            {username == userData?.username
              ? userData?.reviews?.map((review) => (
                  <ProfileReviewCard key={review.review_id} review={review} />
                ))
              : userDataProfile?.reviews?.map((review) => (
                  <ProfileReviewCard key={review.review_id} review={review} />
                ))}
          </div>
        </TabsContent>
        {/* {<TabsContent value="wishlist">
          <div>
            <WishlistStatsCards />
          </div>
        </TabsContent>} */}
      </Tabs>
    </div>
  );
}

export default UserProfilePage;
