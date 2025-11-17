import React, { useId, useState } from "react";
import { SearchIcon } from "lucide-react";
// App logo
import logo from "@/assets/logo.png";
import UserMenu from "@/components/shadcn/user-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

//main
import { useAuth } from "@/context/AuthContextProvider";
import { useNavigate, Link } from "react-router-dom";

export default function NavBar() {
  const { activeSession, userData } = useAuth();
  const [inputValue, setInputValue] = useState<string>("");
  const navigate = useNavigate();
  const id = useId();

  // Navigation links array to be used in both desktop and mobile menus
  const loggedInNavigationLinks = [
    { href: "/", label: "Home", active: true },
    { href: `/users/${userData?.username}/wishlist`, label: "Wishlist" },
  ];

  const loggedOutNavigationLinks = [
    { href: "/", label: "Home", active: true },
    { href: "/auth/login", label: "Login" },
    { href: "/auth/signup", label: "Sign Up" },
  ];

  // Function that handles the search form
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search/${inputValue}`);
    }
  };

  // Function that handles the navigation using react-router-dom
  const handleClickNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetPath: string
  ) => {
    e.preventDefault();
    navigate(targetPath);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden text-white"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {activeSession
                    ? loggedInNavigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <NavigationMenuLink
                            onClick={(e) => handleClickNavigation(e, link.href)}
                            href={link.href}
                            className="py-1.5"
                            active={link.active}
                          >
                            {link.label}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))
                    : loggedOutNavigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <NavigationMenuLink
                            onClick={(e) => handleClickNavigation(e, link.href)}
                            href={link.href}
                            className="py-1.5"
                            active={link.active}
                          >
                            {link.label}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-primary hover:text-primary/90">
              <img
                src={logo}
                alt="website's logo"
                className="w-8 h-5 sm:h-8 mask-cover"
              />
            </Link>
          </div>
        </div>
        {/* Middle area */}
        <div className="grow">
          {/* Search form */}
          <div className="relative mx-auto w-full max-w-xs">
            <form onSubmit={handleSearch}>
              <Input
                id={id}
                className="peer h-8 ps-8 pe-10 text-white"
                placeholder="Search..."
                type="search"
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
              <div className="text-muted-foreground  absolute inset-y-0 end-0 flex items-center justify-center ">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSearch}
                  type="submit"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Notification */}

          {/* User menu */}
          {activeSession ? <UserMenu /> : null}
        </div>
      </div>
      {/* Bottom navigation */}
      <div className="border-t py-2 max-md:hidden">
        {/* Navigation menu */}
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            {activeSession
              ? loggedInNavigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      onClick={(e) => handleClickNavigation(e, link.href)}
                      active={link.active}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))
              : loggedOutNavigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      onClick={(e) => handleClickNavigation(e, link.href)}
                      active={link.active}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
