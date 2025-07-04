"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserService } from "@/services/userService";
import { User, getUserLevel, ADMIN_COLORS, canManageUsers } from "@/types/auth";
import { Crown, Edit, Coins, User as UserIcon, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    if (isOpen && authUser) {
      loadUserData();
    }
  }, [isOpen, authUser]);

  const loadUserData = async () => {
    if (!authUser) return;

    try {
      const userData = await UserService.getUser(authUser.uid);
      if (userData) {
        setUser(userData);
        setNewNickname(userData.nickname);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const handleNicknameChange = async () => {
    if (!user || !authUser) return;

    setIsLoading(true);
    setMessage("");

    try {
      const result = await UserService.changeNickname(
        authUser.uid,
        newNickname
      );
      if (result.success) {
        setUser((prev) => (prev ? { ...prev, nickname: newNickname } : null));
        setIsEditing(false);
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Failed to change nickname.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminClick = () => {
    const currentTime = Date.now();

    console.log("Admin click detected:", {
      currentTime,
      lastClickTime,
      adminClickCount,
    });

    // 3초 내에 클릭해야 함
    if (currentTime - lastClickTime > 3000) {
      setAdminClickCount(1);
      console.log("Reset click count to 1");
    } else {
      const newCount = adminClickCount + 1;
      setAdminClickCount(newCount);
      console.log("Increment click count to:", newCount);

      // 3번 클릭 시 권한 체크 후 이동
      if (newCount >= 3) {
        console.log("3 clicks detected! Checking permissions...");
        setAdminClickCount(0);

        // admin 페이지 접근 권한 체크
        if (
          user &&
          (user.role === "OWNER" ||
            user.role === "ADMIN" ||
            user.role === "NAVI_ADMIN" ||
            user.role === "CHANNEL_ADMIN" ||
            user.role === "BOARD_ADMIN")
        ) {
          console.log("Admin access granted, redirecting to admin page...");
          window.location.href = "/admin";
        } else {
          console.log("No admin access, redirecting to home page...");
          console.log("User role:", user?.role || "No role");
          // 권한이 없는 사용자는 홈페이지로 이동
          window.location.href = "/";
        }
        return;
      }
    }

    setLastClickTime(currentTime);
  };

  if (!isOpen || !user) return null;

  const userLevel = getUserLevel(user.points, user.isHonoraryMember);
  const adminColor = ADMIN_COLORS[user.role as keyof typeof ADMIN_COLORS];

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "OWNER":
        return "Owner";
      case "ADMIN":
        return "Administrator";
      case "NAVI_ADMIN":
        return "Navigation Admin";
      case "CHANNEL_ADMIN":
        return "Channel Admin";
      case "BOARD_ADMIN":
        return "Board Admin";
      case "MEMBER":
        return "Member";
      default:
        return role;
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* User Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <UserIcon className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                      maxLength={20}
                    />
                    <button
                      onClick={handleNicknameChange}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewNickname(user.nickname);
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{user.nickname}</span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          </div>

          {/* Role Display */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Shield size={20} style={{ color: adminColor || "#808080" }} />
            <span className="font-medium">{getRoleDisplayName(user.role)}</span>
          </div>

          {/* Points and Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Coins size={20} className="text-yellow-600" />
                <span className="font-medium">Points</span>
              </div>
              <span className="font-bold text-lg">
                {user.points.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Crown size={20} style={{ color: userLevel.color }} />
                <span className="font-medium">Level</span>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  {userLevel.icon} {userLevel.level}
                </div>
                <div className="text-xs text-gray-600">
                  {userLevel.description}
                </div>
              </div>
            </div>
          </div>

          {/* Nickname Change Information */}
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
            <div>Nickname change count: {user.nicknameChangeCount} times</div>
            {user.nicknameChangeCount === 0 && (
              <div className="text-green-600 mt-1">First change is free!</div>
            )}
            {user.nicknameChangeCount > 0 && (
              <div className="text-blue-600 mt-1">
                Next change requires 10 points.
              </div>
            )}
          </div>

          {/* Admin Only Information */}
          {canManageUsers(user.role) && (
            <div className="border-t pt-4">
              <h3
                className="font-semibold mb-2 cursor-default select-none"
                onClick={handleAdminClick}
                style={{ userSelect: "none" }}
                onMouseDown={(e) => e.preventDefault()}
              >
                Admin Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>Join Date: {user.createdAt.toLocaleDateString()}</div>
                <div>Last Login: {user.lastLoginAt.toLocaleDateString()}</div>

                {/* 관리 영역 표시 */}
                {user.managedAreas && user.managedAreas.length > 0 && (
                  <div>
                    <div className="font-medium text-blue-700 mb-1">
                      Managed Areas:
                    </div>
                    <div className="pl-2 space-y-1">
                      {user.managedAreas.map((area: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {area.includes("/") ? (
                            <span className="text-xs">
                              {area
                                .split("/")
                                .map((part: string, i: number) => (
                                  <span key={i}>
                                    {i > 0 && (
                                      <span className="text-gray-400"> → </span>
                                    )}
                                    {part.toUpperCase()}
                                  </span>
                                ))}
                            </span>
                          ) : (
                            <span className="text-xs">
                              {area.toUpperCase()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.includes("success") || message.includes("changed")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
