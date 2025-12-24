import { User } from "@/types/userTypes";
import {
  UserPenIcon,
  BoltIcon,
  Instagram,
  Github,
  TextAlignStart,
  Gift,
} from "lucide-react";

export const loggedInNavigationLinks = [{ href: "/feed", label: "Feed" }];

export const loggedOutNavigationLinks = [
  { href: "/feed", label: "Feed" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
];

export const getUserMenuMainLinks = (user: User) => [
  {
    label: "Profile",
    href: `/users/${user.username}`,
    icon: <UserPenIcon size={18} />,
  },
  {
    label: "Reviews",
    href: `/users/${user.username}/reviews`,
    icon: <TextAlignStart size={18} />,
  },
  {
    label: "Wishlist",
    href: `/users/${user.username}/wishlist`,
    icon: <Gift size={18} />,
  },
];

export const userMenuSettingsLink = {
  label: "Settings",
  href: "/settings",
  icon: <BoltIcon size={18} />,
};

export const socialLinks = [
  {
    icon: <Instagram className="h-5 w-5" />,
    href: "https://www.instagram.com/yisus_daniel1984",
    label: "Instagram",
  },
  {
    icon: <Github className="h-5 w-5" />,
    href: "https://github.com/Yisusocanto",
    label: "GitHub",
  },
];
