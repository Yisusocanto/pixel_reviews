import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContextProvider";
// Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, PencilLine, Gift } from "lucide-react";
import SpinnerComponent from "@/components/commonsComponents/SpinnerComponent";
import NotFoundPage from "./NotFoundPage";
import UserProfile from "@/components/userComponents/UserProfile";
import ProfileReviewCard from "@/components/gameReviewComponents/ProfileReviewCard";
import StatsCards from "@/components/userComponents/StatsCards";
import WishlistStatsCards from "@/components/userComponents/WishlistStatsCards";
import WishlistItemCard from "@/components/userComponents/WishlistItemCard";
// Services
import { useGetUser } from "@/hooks/fetching/useGetUser";

function UserProfilePage() {
  const { username, tab } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();

  const currentTab = tab || "profile";

  const validTabs = ["profile", "reviews", "wishlist"];
  const activeTab = validTabs.includes(currentTab) ? currentTab : "profile";

  const { data, error, isError, isLoading } = useGetUser(username ?? "");

  const handleTabChange = (value: string) => {
    navigate(`/users/${username}/${value}`);
  };

  if (isLoading) {
    return <SpinnerComponent />;
  }

  if (error && isError) {
    // @ts-ignore
    if (error.response.status == 404) return <NotFoundPage />;
    // @ts-ignore
    if (error.response.status == 401) navigate("/auth/login");
    // Unknown error component
  }

  if (!data) {
    return <h1>No results</h1>;
  }

  const displayUser = username == userData?.username ? userData : data.user;

  return (
    <div className="p-8 mt-6">
      <UserProfile
        user={displayUser ?? undefined}
        ownProfile={username == displayUser?.username}
      />
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full text-sm text-muted-foreground mt-4"
      >
        <TabsList className="grid w-full grid-cols-3" shape="pill">
          {/* Triggers tabs */}
          <TabsTrigger value="profile">
            <UserRound />
            Profile
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
        {/* Tabs Content */}
        <TabsContent value="profile">
          <div className="mt-8">
            <StatsCards user={displayUser ?? undefined} />
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="flex flex-col gap-4">
            {(() => {
              if (!displayUser?.reviews || displayUser?.reviews?.length === 0) {
                return (
                  <p className="text-center text-primary-muted mt-8">
                    This user has not written any reviews yet.
                  </p>
                );
              }

              return displayUser?.reviews.map((review) => (
                <ProfileReviewCard key={review.review_id} review={review} />
              ));
            })()}
          </div>
        </TabsContent>
        <TabsContent value="wishlist">
          <div className="flex flex-col gap-4">
            <WishlistStatsCards wishlist={displayUser?.wishlist} />
            {displayUser?.wishlist?.map((wishlistItem) => (
              <WishlistItemCard
                wishlistItem={wishlistItem}
                ownProfile={username == userData?.username}
                key={wishlistItem.wishlistItemId}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UserProfilePage;
