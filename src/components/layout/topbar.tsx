"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, ArrowLeft, Globe, Menu, LogIn, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import UserProfile from "@/components/user/UserProfile";
import HamburgerMenu from "./HamburgerMenu";

const TopBar = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const isHomePage = pathname === "/";

  return (
    <>
      <div className="flex items-center justify-between h-14 px-4 bg-white border-b">
        {/* Left Section */}
        <div className="flex items-center space-x-4 w-1/3">
          {!isHomePage && (
            <>
              <button onClick={() => router.push("/")} aria-label="Go to home">
                <Home size={24} />
              </button>
              <button onClick={() => router.back()} aria-label="Go back">
                <ArrowLeft size={24} />
              </button>
            </>
          )}
        </div>

        {/* Center Section */}
        <div className="w-1/3 text-center">
          <h1 className="text-xl font-bold">K-YAYO</h1>{" "}
          {/* Placeholder for Title/Logo */}
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end space-x-4 w-1/3">
          <button aria-label="Select language">
            <Globe size={24} />
          </button>
          <button
            onClick={() => {
              console.log("Hamburger menu clicked");
              setIsHamburgerOpen(true);
            }}
            aria-label="Open menu"
            className="hover:text-blue-600 transition-colors"
          >
            <Menu size={24} />
          </button>
          {loading ? (
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <>
              <span className="text-sm font-medium hidden sm:block">
                {user.displayName}
              </span>
              <button
                onClick={() => setIsProfileOpen(true)}
                aria-label="User profile"
                className="hover:text-blue-600"
              >
                <User size={24} />
              </button>
            </>
          ) : (
            <Link href="/login" aria-label="Login">
              <LogIn size={24} />
            </Link>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Hamburger Menu */}
      <HamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
      />
    </>
  );
};

export default TopBar;
