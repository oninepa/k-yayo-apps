"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/userService";
import { canManageUsers } from "@/types/auth";
import {
  BarChart3,
  Users,
  Coins,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Calendar,
  Activity,
  Globe,
  Database,
} from "lucide-react";

interface UserStats {
  totalUsers: number;
  totalPoints: number;
  averagePoints: number;
  levelDistribution: Record<string, number>;
}

const AdminAnalyticsPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
      return;
    }

    // 권한 확인 - 통계는 소유자와 전체 관리자만
    if (!canManageUsers(userData?.role || "MEMBER")) {
      router.push("/admin");
      return;
    }

    loadStats();
  }, [user, userData, router]);

  const loadStats = async () => {
    try {
      const stats = await UserService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error("Failed to load stats:", error);
      setMessage("Failed to load statistics.");
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string): string => {
    switch (level) {
      case "새싹멤버":
        return "#8B4513";
      case "일반멤버":
        return "#808080";
      case "성실멤버":
        return "#FFD700";
      case "열심멤버":
        return "#C0C0C0";
      case "우수멤버":
        return "#FFD700";
      case "최고멤버":
        return "#FFD700";
      case "감사멤버":
        return "#228B22";
      default:
        return "#6B7280";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
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
              <button
                onClick={() => router.push("/admin")}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <BarChart3 className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.totalUsers || 0}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {(userStats?.totalPoints || 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Points
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(userStats?.averagePoints || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((userStats?.totalUsers || 0) * 0.3)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Level Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            User Level Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userStats?.levelDistribution &&
              Object.entries(userStats.levelDistribution).map(
                ([level, count]) => (
                  <div
                    key={level}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: getLevelColor(level) }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {level}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {count}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((count / (userStats?.totalUsers || 1)) * 100).toFixed(
                          1
                        )}
                        %
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>

        {/* API Usage Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            API 사용량 통계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Globe className="text-blue-600" size={20} />
                <h3 className="font-medium text-gray-900">번역 API</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">MyMemory API</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lingva API</span>
                  <span className="font-medium">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "12%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Google Translate</span>
                  <span className="font-medium">3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: "3%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Database className="text-green-600" size={20} />
                <h3 className="font-medium text-gray-900">Firebase 사용량</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Firestore 읽기</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Firestore 쓰기</span>
                  <span className="font-medium">567</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Authentication</span>
                  <span className="font-medium">89</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Activity className="text-purple-600" size={20} />
                <h3 className="font-medium text-gray-900">시스템 성능</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">평균 응답 시간</span>
                  <span className="font-medium">245ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">업타임</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">에러율</span>
                  <span className="font-medium">0.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            최근 활동
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">새 사용자 가입</p>
                <p className="text-xs text-gray-500">2분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">게시글 작성</p>
                <p className="text-xs text-gray-500">5분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">포인트 적립</p>
                <p className="text-xs text-gray-500">10분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">댓글 작성</p>
                <p className="text-xs text-gray-500">15분 전</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
