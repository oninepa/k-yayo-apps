"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, ArrowLeft, Globe, Menu, User } from "lucide-react";

const TopBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  return (
    <div className="flex items-center justify-between h-14 px-4 bg-white border-b">
      {/* Left Section */}
      <div className="flex items-center space-x-4 w-1/3">
        {!isHomePage && (
          <>
            <button onClick={() => router.back()} aria-label="Go back">
              <ArrowLeft size={24} />
            </button>
            <button onClick={() => router.push("/")} aria-label="Go to home">
              <Home size={24} />
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
        <button aria-label="Open menu">
          <Menu size={24} />
        </button>
        <button aria-label="User profile">
          <User size={24} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
