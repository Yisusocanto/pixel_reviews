import ProfileCard from "@/components/user/ProfileCard";
import UserTabs from "@/components/user/UserTabs";
import { getUserData } from "@/services/userService";
import { User } from "@/types/userTypes";
import axios from "axios";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import StatsCardsSkeleton from "@/components/user/StatsCardsSkeleton";

interface UserProfileLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfileLayout({
  children,
  params,
}: UserProfileLayoutProps) {
  const { username } = await params;
  let data;

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
      <div className="w-full flex flex-col gap-4">
        <UserTabs username={username} />
        <Suspense
          fallback={
            <div className="w-full max-w-3/4 mx-auto">
              <StatsCardsSkeleton />
            </div>
          }
        >
          <div className="w-full">{children}</div>
        </Suspense>
      </div>
    </div>
  );
}
