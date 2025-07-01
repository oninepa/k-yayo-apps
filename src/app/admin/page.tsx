"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Coins,
  LogOut,
} from "lucide-react";
import { logout } from "@/firebase/auth";

const AdminDashboardPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
      return;
    }

    // 5단계 권한 시스템에 따른 접근 제어
    if (
      userData &&
      (userData.role === "OWNER" ||
        userData.role === "ADMIN" ||
        userData.role === "NAVI_ADMIN" ||
        userData.role === "CHANNEL_ADMIN" ||
        userData.role === "BOARD_ADMIN")
    ) {
      setLoading(false);
    } else if (userData && userData.role === "MEMBER") {
      // 권한이 없는 경우 로그인 페이지로 이동
      router.push("/admin/login");
    }
  }, [user, userData, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const adminFeatures = [
    {
      id: "users",
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: <Users className="w-8 h-8" />,
      color: "bg-blue-500",
      href: "/admin/users",
      requiredRole: "ADMIN" as const, // OWNER, ADMIN만 접근 가능
    },
    {
      id: "content",
      title: "Content Management",
      description: "Manage posts, comments, and content",
      icon: <FileText className="w-8 h-8" />,
      color: "bg-green-500",
      href: "/admin/content",
      requiredRole: "BOARD_ADMIN" as const, // 모든 관리자 접근 가능
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View site statistics and reports",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "bg-purple-500",
      href: "/admin/analytics",
      requiredRole: "ADMIN" as const, // OWNER, ADMIN만 접근 가능
    },
    {
      id: "points",
      title: "Point System",
      description: "Manage point transactions and rules",
      icon: <Coins className="w-8 h-8" />,
      color: "bg-yellow-500",
      href: "/admin/points",
      requiredRole: "ADMIN" as const, // OWNER, ADMIN만 접근 가능
    },
    {
      id: "feedback",
      title: "User Feedback",
      description: "View and respond to user feedback",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "bg-orange-500",
      href: "/admin/feedback",
      requiredRole: "ADMIN" as const, // OWNER, ADMIN만 접근 가능
    },
    {
      id: "settings",
      title: "Site Settings",
      description: "Configure site settings and policies",
      icon: <Settings className="w-8 h-8" />,
      color: "bg-gray-500",
      href: "/admin/settings",
      requiredRole: "ADMIN" as const, // OWNER, ADMIN만 접근 가능
    },
  ];

  // 권한에 따른 기능 필터링
  const canAccessFeature = (requiredRole: string) => {
    if (!userData) return false;

    const roleHierarchy = {
      OWNER: 5,
      ADMIN: 4,
      NAVI_ADMIN: 3,
      CHANNEL_ADMIN: 2,
      BOARD_ADMIN: 1,
      MEMBER: 0,
    };

    const userRoleLevel =
      roleHierarchy[userData.role as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel =
      roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  const accessibleFeatures = adminFeatures.filter((feature) =>
    canAccessFeature(feature.requiredRole)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {userData?.nickname || user?.displayName}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to the Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Manage your site's content, users, and settings from this central
            location based on your permissions.
          </p>
          {userData && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Current Role:{" "}
                <span className="font-semibold">{userData.role}</span>
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Coins className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Points
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  New Feedback
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(feature.href)}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white`}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
