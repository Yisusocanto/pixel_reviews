"use client";

import AuthForm from "@/components/settings/AuthForm";
import AvatarSettings from "@/components/settings/AvatarSetting";
import ProfileForm from "@/components/settings/ProfileForm";
import { useAuth } from "@/providers/AuthProvider";
import { Card, Tabs } from "@heroui/react";
import { ImageUp, Shield, UserPenIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const settingOptions = [
  { label: "Profile", id: "profile", icon: <UserPenIcon size={16} /> },
  { label: "Avatar", id: "avatar", icon: <ImageUp size={16} /> },
  { label: "Auth", id: "auth", icon: <Shield size={16} /> },
];

function page() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) router.replace("/login");

  return (
    <div className="w-full">
      <Tabs className="w-xs sm:w-sm md:w-xl mx-auto mt-6">
        <Tabs.ListContainer>
          <Tabs.List>
            {settingOptions.map((option) => {
              return (
                <Tabs.Tab id={option.id} key={option.id}>
                  {option.icon}
                  {option.label}
                  <Tabs.Indicator className="bg-accent" />
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel id={"profile"}>
          <Card className="border">
            <ProfileForm user={user} />
          </Card>
        </Tabs.Panel>
        <Tabs.Panel id={"auth"}>
          <Card className="border">
            <AuthForm />
          </Card>
        </Tabs.Panel>
        <Tabs.Panel id={"avatar"}>
          <Card className="border">
            <AvatarSettings defaultAvatar={user?.avatarUrl} />
          </Card>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default page;
