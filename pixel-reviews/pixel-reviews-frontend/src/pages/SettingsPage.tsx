import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContextProvider";
// Components
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Card } from "../components/luxe/card";
import ProfileSettings from "@/components/settingsComponents/ProfileSettings";
import AuthSettings from "@/components/settingsComponents/AuthSettings";
import AvatarSettings from "@/components/settingsComponents/AvatarSettings";
import { User, Shield, ImageUp } from "lucide-react";

function SettingsPage() {
  const { tab } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();

  const currentTab = tab || "profile";
  const validTabs = ["profile", "avatar", "auth"];
  const activeTab = validTabs.includes(currentTab) ? currentTab : "profile";

  const handleTabChange = (value: string) => {
    navigate(`/settings/${value}`);
  };

  return (
    <div className="flex justify-center">
      <Tabs
        className="w-xs sm:w-sm md:w-xl my-4"
        defaultValue="profile"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="profile">
            <span className="flex gap-2 items-center">
              <User />
              Profile
            </span>
          </TabsTrigger>
          <TabsTrigger value="avatar">
            <span className="flex gap-2 items-center">
              <ImageUp />
              Avatar
            </span>
          </TabsTrigger>
          <TabsTrigger value="auth">
            <span className="flex gap-2 items-center">
              <Shield />
              Auth
            </span>
          </TabsTrigger>
          {/* {<TabsTrigger value="notifications">
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="data">
            <span>Data</span>
          </TabsTrigger>} */}
        </TabsList>
        <div>
          <TabsContent value="profile">
            <Card>
              <ProfileSettings user={userData || undefined} />
            </Card>
          </TabsContent>
          <TabsContent value="avatar">
            <Card>
              <AvatarSettings defaultAvatar={userData?.avatarUrl} />
            </Card>
          </TabsContent>
          <TabsContent value="auth">
            <Card>
              <AuthSettings />
            </Card>
          </TabsContent>
          {/* {<TabsContent value="notifications">noti content</TabsContent>
          <TabsContent value="data">data content</TabsContent>} */}
        </div>
      </Tabs>
    </div>
  );
}

export default SettingsPage;
