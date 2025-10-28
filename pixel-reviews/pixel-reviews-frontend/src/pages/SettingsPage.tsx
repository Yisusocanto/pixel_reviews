import { useParams, useNavigate } from "react-router-dom";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Card } from "../components/luxe/card";

import ProfileSettings from "@/components/settingsComponents/ProfileSettings";
import { useAuth } from "@/context/AuthContextProvider";
import AuthSettings from "@/components/settingsComponents/AuthSettings";

function SettingsPage() {
  const { tab } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();

  const currentTab = tab || "profile";
  const validTabs = ["profile", "avatar", "auth", "notifications", "data"];
  const activeTab = validTabs.includes(currentTab) ? currentTab : "profile";

  const handleTabChange = (value: string) => {
    navigate(`/settings/${value}`);
  };

  return (
    <div className="w-2xl m-auto">
      <Tabs
        className="w-full my-4"
        defaultValue="profile"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="avatar">
            <span>Avatar</span>
          </TabsTrigger>
          <TabsTrigger value="auth">
            <span>Auth</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="data">
            <span>Data</span>
          </TabsTrigger>
        </TabsList>
        <div>
          <TabsContent value="profile">
            <Card>
              <ProfileSettings user={userData || undefined} />
            </Card>
          </TabsContent>
          <TabsContent value="avatar">Avatar content</TabsContent>
          <TabsContent value="auth">
            <Card>
              <AuthSettings />
            </Card>
          </TabsContent>
          <TabsContent value="notifications">noti content</TabsContent>
          <TabsContent value="data">data content</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default SettingsPage;
