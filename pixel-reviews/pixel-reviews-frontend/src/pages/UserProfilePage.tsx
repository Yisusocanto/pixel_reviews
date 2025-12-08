import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContextProvider";
// Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, PencilLine, Gift } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import NotFoundPage from "./NotFoundPage";
import UserProfile from "@/components/userComponents/UserProfile";
import ProfileReviewCard from "@/components/gameReviewComponents/ProfileReviewCard";
import StatsCards from "@/components/userComponents/StatsCards";
import WishlistStatsCards from "@/components/userComponents/WishlistStatsCards";
import WishlistItemCard from "@/components/userComponents/WishlistItemCard";
// Services
import { useGetUser } from "@/hooks/fetching/users/useGetUser";

function UserProfilePage() {
  const { username, tab } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentTab = tab || "profile";

  const validTabs = ["profile", "reviews", "wishlist"];
  const activeTab = validTabs.includes(currentTab) ? currentTab : "profile";

  const { data, error, isError, isLoading } = useGetUser(username ?? "");

  const handleTabChange = (value: string) => {
    navigate(`/users/${username}/${value}`);
  };

  if (isLoading) {
    return (
      <div className="p-8 mt-6 space-y-4">
        <div className="flex flex-col md:flex-row w-full h-100 md:h-65 bg-main rounded-2xl p-10 gap-4">
          <div className="flex-1 flex flex-col items-center gap-4">
            <Skeleton className="rounded-full w-40 h-40 m-auto" />
          </div>
          <div className="flex-4 flex flex-col gap-10 justify-center">
            <div className="md:w-1/2">
              <Skeleton className="w-2/3 md:w-2/2 h-8 m-auto" />
            </div>
            <div className="md:w-1/3 flex flex-col gap-4 items-center">
              <Skeleton className="w-2/3 md:w-1/1 h-5" />
              <Skeleton className="w-2/3 md:w-1/1 h-5" />
            </div>
          </div>
        </div>
        <Skeleton className="w-full h-10 rounded-4xl" />
        <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-4 ">
          <Skeleton className="w-full h-40 rounded-2xl" />
          <Skeleton className="w-full h-40 rounded-2xl" />
          <Skeleton className="w-full h-40 rounded-2xl" />
        </div>
      </div>
    );
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

  const displayUser = username == user?.username ? user : data.user;

  return (
    <div className="p-8 mt-6">
      <UserProfile
        user={displayUser ?? undefined}
        ownProfile={username == user?.username}
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
                <ProfileReviewCard
                  key={review.review_id}
                  review={review}
                  ownReview={username == user?.username}
                />
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
                ownProfile={username == user?.username}
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
