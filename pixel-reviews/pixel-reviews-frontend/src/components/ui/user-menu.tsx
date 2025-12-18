"use client";

import { User } from "@/types/userTypes";
import {
  Avatar,
  Description,
  Dropdown,
  DropdownMenu,
  DropdownPopover,
  Label,
  Separator,
} from "@heroui/react";
import { LogOutIcon } from "lucide-react";
import NextLink from "next/link";
import { useLogOut } from "@/hooks/fetching/auth/useLogOut";
import {
  getUserMenuMainLinks,
  userMenuSettingsLink,
} from "@/constants/navigation";

interface UserMenuProps {
  user: User;
}

function UserMenu({ user }: UserMenuProps) {
  const { mutate: logOut } = useLogOut();
  const links = getUserMenuMainLinks(user);

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar>
          {user.avatarUrl && (
            <Avatar.Image alt="user avatar" src={user.avatarUrl} />
          )}
          <Avatar.Fallback>YI</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <DropdownPopover className={"border"}>
        <DropdownMenu>
          <Dropdown.Section>
            <Dropdown.Item>
              <div className="flex flex-col">
                <Label>{user.username}</Label>
                <Description>{user.email}</Description>
              </div>
            </Dropdown.Item>
          </Dropdown.Section>
          <Separator />
          <Dropdown.Section>
            {links.map((link) => {
              return (
                <Dropdown.Item key={link.label}>
                  {link.icon}
                  <NextLink href={link.href} className="w-full">
                    {link.label}
                  </NextLink>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Section>
          <Separator />
          <Dropdown.Section>
            <Dropdown.Item>
              {userMenuSettingsLink.icon}
              <NextLink href={userMenuSettingsLink.href} className="w-full">
                {userMenuSettingsLink.label}
              </NextLink>
            </Dropdown.Item>
          </Dropdown.Section>
          <Separator />
          <Dropdown.Section>
            <Dropdown.Item
              key="logout"
              className="text-danger"
              onPress={() => logOut()}
            >
              <div className="flex items-center gap-2">
                <LogOutIcon size={18} />
                Log out
              </div>
            </Dropdown.Item>
          </Dropdown.Section>
        </DropdownMenu>
      </DropdownPopover>
    </Dropdown>
  );
}

export default UserMenu;
