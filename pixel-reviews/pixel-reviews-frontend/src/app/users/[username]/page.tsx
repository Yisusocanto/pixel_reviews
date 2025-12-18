import ProfileCard from "@/components/user/ProfileCard";
import { getUserData } from "@/services/userService";
import { User } from "@/types/userTypes";
import { notFound } from "next/navigation";
import { Tabs } from "@heroui/react";
import StatsCards from "@/components/user/StatsCards";
import ProfileReviewCard from "@/components/review/ProfileReviewCard";
import WishlistStatsCards from "@/components/user/WishlistStatsCards";
import WishlistItemCard from "@/components/user/WishlistItemCard";
import axios from "axios";

interface UserProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

const tabsOptions = [
  { label: "Profile", id: "profile" },
  { label: "Reviews", id: "reviews" },
  { label: "Wishlist", id: "wishlist" },
];

async function page({ params }: UserProfilePageProps) {
  let data;
  const { username } = await params;
  try {
    data = await getUserData(username);
  } catch (error) {
    if (axios.isAxiosError(error) && error.status === 404) notFound();
    throw error;
  }
  const user: User = data.user;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full mt-6">
        <ProfileCard
          username={username}
          user={user}
          classname="max-w-3/4 mx-auto"
        />
      </div>
      <div className="w-full">
        <Tabs className="max-w-3/4 mx-auto">
          <Tabs.ListContainer>
            <Tabs.List aria-label="options">
              {tabsOptions.map((tab) => {
                return (
                  <Tabs.Tab id={tab.id} key={tab.id}>
                    {tab.label}
                    <Tabs.Indicator className="bg-accent" />
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel id={"profile"}>
            <StatsCards user={user} />
          </Tabs.Panel>
          <Tabs.Panel id={"reviews"} className="flex flex-col gap-4">
            {user.reviews?.map((review) => {
              return (
                <ProfileReviewCard
                  review={review}
                  username={username}
                  key={review.reviewID}
                />
              );
            })}
          </Tabs.Panel>
          <Tabs.Panel id={"wishlist"}>
            <WishlistStatsCards wishlistCount={user.wishlist?.length || 0} />
            <div className="flex  flex-col gap-4 mt-4">
              {user.wishlist?.map((wishlist) => {
                return (
                  <WishlistItemCard
                    key={wishlist.wishlistItemId}
                    wishlistItem={wishlist}
                    username={username}
                  />
                );
              })}
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default page;
