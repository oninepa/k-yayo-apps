"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ArrowLeft,
  Globe,
  Menu,
  LogIn,
  User,
  Sparkles,
} from "lucide-react";
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
      <div className="flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm sticky top-0 z-50">
        {/* Left Section */}
        <div className="flex items-center space-x-3 w-1/3">
          {!isHomePage && (
            <>
              <button
                onClick={() => router.push("/")}
                aria-label="Go to home"
                className="p-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Home size={20} />
              </button>
              <button
                onClick={() => router.back()}
                aria-label="Go back"
                className="p-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ArrowLeft size={20} />
              </button>
            </>
          )}
        </div>

        {/* Center Section */}
        <div className="w-1/3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles size={24} className="text-pink-500 animate-pulse" />
            <h1 className="text-2xl font-bold gradient-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              K-YAYO
            </h1>
            <Sparkles size={24} className="text-purple-500 animate-pulse" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end space-x-3 w-1/3">
          <button
            aria-label="Select language"
            className="p-2 rounded-full bg-gradient-to-r from-green-400 to-teal-500 text-white hover:from-green-500 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Globe size={20} />
          </button>
          <button
            onClick={() => {
              console.log("Hamburger menu clicked");
              setIsHamburgerOpen(true);
            }}
            aria-label="Open menu"
            className="p-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Menu size={20} />
          </button>
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 animate-pulse-slow" />
          ) : user ? (
            <>
              <span className="text-sm font-semibold hidden sm:block text-gray-700 bg-white/50 px-3 py-1 rounded-full">
                {user.displayName}
              </span>
              <button
                onClick={() => setIsProfileOpen(true)}
                aria-label="User profile"
                className="p-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <User size={20} />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              aria-label="Login"
              className="p-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LogIn size={20} />
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
