"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationData } from "@/data/navigationData";
import {
  Sparkles,
  Heart,
  Music,
  Camera,
  Star,
  Users,
  BookOpen,
} from "lucide-react";

// 각 네비게이션에 맞는 아이콘 매핑
const navigationIcons = {
  "K-Info": BookOpen,
  "K-Culture": Heart,
  "K-Enter": Music,
  "K-Promo": Star,
  "K-ACTOR": Camera,
  "K-POP": Users,
  "K-Blogs": Sparkles,
};

const NavigationBar = () => {
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (navName: string) => {
    setActiveNav((prev) => (prev === navName ? null : navName));
  };

  // 스크롤이나 드래그 시 메뉴 닫기
  useEffect(() => {
    const handleScroll = () => {
      if (activeNav) {
        setActiveNav(null);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // 네비게이션 영역 내에서의 터치는 무시
      if (navRef.current && navRef.current.contains(e.target as Node)) {
        return;
      }
      if (activeNav) {
        setActiveNav(null);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // 네비게이션 영역 내에서의 클릭은 무시
      if (navRef.current && navRef.current.contains(e.target as Node)) {
        return;
      }
      if (activeNav) {
        setActiveNav(null);
      }
    };

    // 스크롤 이벤트 리스너
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 터치 이벤트 리스너 (모바일)
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    // 마우스 이벤트 리스너 (데스크톱)
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [activeNav]);

  useEffect(() => {
    setActiveNav(null);
  }, [pathname]);

  const activeNavItem = useMemo(
    () => navigationData.find((nav) => nav.name === activeNav),
    [activeNav]
  );

  return (
    <div
      ref={navRef}
      className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100"
    >
      <nav className="flex justify-around p-4">
        {navigationData.map((nav) => {
          const IconComponent =
            navigationIcons[nav.name as keyof typeof navigationIcons];
          const isActive = activeNav === nav.name;

          return (
            <button
              key={nav.name}
              onClick={() => handleNavClick(nav.name)}
              className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                isActive
                  ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-purple-600"
              }`}
            >
              <IconComponent
                size={20}
                className={isActive ? "animate-pulse" : ""}
              />
              <span className="text-xs font-semibold">{nav.name}</span>
            </button>
          );
        })}
      </nav>

      {activeNavItem && (
        <div className="p-6 bg-gradient-to-r from-pink-50 via-purple-50 to-cyan-50 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              {activeNavItem.name} Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {activeNavItem.subItems.map((subItem, index) => (
                <Link
                  key={subItem}
                  href={`${activeNavItem.path}/${subItem
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200 hover:border-pink-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="p-4 text-center">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {subItem}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
