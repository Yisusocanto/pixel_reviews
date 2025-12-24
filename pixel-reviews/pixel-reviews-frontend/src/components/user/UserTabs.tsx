"use client";

import { Tabs } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface UserTabsProps {
  username: string;
}

export default function UserTabs({ username }: UserTabsProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(`/users/${username}`);
    router.prefetch(`/users/${username}/reviews`);
    router.prefetch(`/users/${username}/wishlist`);
  }, [username, router]);

  // Determine current tab based on pathname
  let currentTab = "overview";
  if (pathname.includes("/reviews")) {
    currentTab = "reviews";
  } else if (pathname.includes("/wishlist")) {
    currentTab = "wishlist";
  }

  const handleSelectionChange = (key: React.Key) => {
    const keyString = key as string;
    if (keyString === "overview") {
      router.replace(`/users/${username}`);
    } else {
      router.replace(`/users/${username}/${keyString}`);
    }
  };

  return (
    <div className="flex flex-col">
      <Tabs
        aria-label="User Profile Options"
        selectedKey={currentTab}
        onSelectionChange={handleSelectionChange}
        className="w-full max-w-3/4 mx-auto"
      >
        <Tabs.ListContainer className="w-full">
          <Tabs.List>
            <Tabs.Tab id="overview" key="overview">
              Overview
              <Tabs.Indicator className="bg-accent" />
            </Tabs.Tab>
            <Tabs.Tab id="reviews" key="reviews">
              Reviews
              <Tabs.Indicator className="bg-accent" />
            </Tabs.Tab>
            <Tabs.Tab id="wishlist" key="wishlist">
              Wishlist
              <Tabs.Indicator className="bg-accent" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
    </div>
  );
}
