import StatsCards from "@/components/user/StatsCards";
import { getUserData } from "@/services/userService";
import { User } from "@/types/userTypes";
import { notFound } from "next/navigation";
import axios from "axios";

interface UserProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { username } = await params;
  let data;

  try {
    data = await getUserData(username);
  } catch (error) {
    if (axios.isAxiosError(error) && error.status === 404) notFound();
    throw error;
  }
  const user: User = data.user;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: user.username,
      image: user.avatarUrl,
      description: user.bio,
    },
  };

  return (
    <div className="max-w-3/4 mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StatsCards user={user} />
    </div>
  );
}
