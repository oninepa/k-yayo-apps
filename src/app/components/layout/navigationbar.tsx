"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { navigationData } from "@/data/navigationData";

const NavigationBar = () => {
  const [activeNav, setActiveNav] = useState<string | null>(null);

  const handleNavClick = (navName: string) => {
    setActiveNav((prev) => (prev === navName ? null : navName));
  };

  const activeNavItem = useMemo(
    () => navigationData.find((nav) => nav.name === activeNav),
    [activeNav]
  );

  return (
    <div className="bg-white shadow-md">
      <nav className="flex justify-around p-2 border-b">
        {navigationData.map((nav) => (
          <button
            key={nav.name}
            onClick={() => handleNavClick(nav.name)}
            className={`text-sm font-semibold transition-colors ${
              activeNav === nav.name
                ? "text-blue-500"
                : "text-gray-700 hover:text-blue-500"
            }`}
          >
            {nav.name}
          </button>
        ))}
      </nav>

      {activeNavItem && (
        <div className="p-2 bg-gray-50 border-b">
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1 text-center">
            {activeNavItem.subItems.map((subItem) => (
              <li key={subItem}>
                <Link
                  href={`${activeNavItem.path}/${subItem
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="block p-1.5 text-base font-medium text-gray-800 hover:bg-gray-200 rounded transition-colors"
                >
                  {subItem}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
