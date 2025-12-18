"use client";

import React, { useState } from "react";
import { SearchIcon, Menu, X } from "lucide-react";
import { InputGroup, Button, TextField } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  loggedInNavigationLinks,
  loggedOutNavigationLinks,
} from "@/constants/navigation";
import NextLink from "next/link";
import Image from "next/image";
import UserMenu from "@/components/ui/user-menu";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const currentLinks = isAuthenticated
    ? loggedInNavigationLinks
    : loggedOutNavigationLinks;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search/${searchValue.trim()}`);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md supports-backdrop-filter:bg-black/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6 justify-between gap-4 mx-auto">
        {/* Left Side: Mobile Menu & Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            isIconOnly
            className="md:hidden text-white"
            onPress={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          <NextLink href="/feed" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Pixel Reviews Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-lg hidden sm:block text-white">
              Pixel Reviews
            </span>
          </NextLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-4 ml-4">
            {currentLinks.map((link, index) => (
              <NextLink
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:bg-default-hover px-3 py-2 rounded-2xl hover:text-primary ${
                  pathname === link.href
                    ? "text-primary bg-default"
                    : "text-muted-foreground/80 text-white/70"
                }`}
              >
                {link.label}
              </NextLink>
            ))}
          </nav>
        </div>

        {/* Center/Right: Search */}
        <div className="flex-1 flex justify-end md:justify-center max-w-sm ml-auto md:ml-0">
          <form onSubmit={handleSearch} className="w-full relative">
            <TextField aria-label="Search" className={"w-full"}>
              <InputGroup>
                <InputGroup.Prefix>
                  <SearchIcon size={16} />
                </InputGroup.Prefix>
                <InputGroup.Input
                  aria-label="Search"
                  placeholder="Search..."
                  type="search"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
              </InputGroup>
            </TextField>
          </form>
        </div>

        {/* Right Side: User Menu */}
        <div className="flex items-center gap-2 justify-end min-w-[32px]">
          {isAuthenticated && user ? (
            <UserMenu user={user} />
          ) : (
            /* Placeholder for when user is not logged in, if extra buttons needed elsewhere */
            <div className="w-px" />
          )}
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 absolute top-16 left-0 w-full p-4 flex flex-col gap-4 shadow-lg min-h-screen z-50">
          <nav className="flex flex-col gap-2">
            {currentLinks.map((link, index) => (
              <NextLink
                key={index}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg font-medium py-2 transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-white/80"
                }`}
              >
                {link.label}
              </NextLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
