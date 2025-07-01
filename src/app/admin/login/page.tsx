"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { Shield, Eye, EyeOff, AlertCircle, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserService } from "@/services/userService";

const AdminLoginPage = () => {
  const router = useRouter();
  const { user, userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 실제 운영 환경에서는 이 이메일들을 Firebase에 등록해야 함
  const adminEmails = ["info@k-yayo.com", "k.yayoinfo@gmail.com"];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    // Check if email is in admin list
    if (!adminEmails.includes(formData.email)) {
      setError("Access denied. This email is not authorized for admin access.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // Redirect to admin dashboard
      router.push("/admin");
    } catch (error: any) {
      console.error("Admin login failed:", error);

      if (error.code === "auth/user-not-found") {
        setError(
          "Admin account not found. Please contact the system administrator."
        );
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 임시 관리자 권한 부여 함수 - 개발 모드에서만 사용
  const makeCurrentUserAdmin = async () => {
    if (!user) {
      setError("No user logged in.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 현재 사용자의 권한을 확인
      if (
        userData?.role === "BOARD_ADMIN" ||
        userData?.role === "CHANNEL_ADMIN" ||
        userData?.role === "NAVI_ADMIN"
      ) {
        setError("You already have admin access. Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
        return;
      }

      // MEMBER만 ADMIN으로 변경 가능
      if (userData?.role !== "MEMBER") {
        setError("Only members can be promoted to admin.");
        return;
      }

      await UserService.changeOwnRole(user.uid, "ADMIN");

      // AuthContext의 userData를 새로고침
      await refreshUserData();

      setError("Current user has been made admin successfully!");

      // 2초 후 Admin 대시보드로 이동
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (error) {
      console.error("Failed to make user admin:", error);
      setError("Failed to make user admin.");
    } finally {
      setLoading(false);
    }
  };

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    router.push("/login");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="text-white" size={32} />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the admin dashboard
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Current User Info - 보안 강화 */}
          {user && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <User size={16} />
                <span className="font-medium">Current User:</span>
              </div>

              {/* 이메일 마스킹 처리 */}
              <p className="text-sm text-gray-600">
                {user.email
                  ? `${user.email.split("@")[0].substring(0, 3)}***@${
                      user.email.split("@")[1]
                    }`
                  : "Unknown"}
              </p>

              {/* 권한 정보는 간단히만 표시 */}
              <p className="text-sm text-gray-600">
                Status:{" "}
                {userData?.role === "ADMIN" || userData?.role === "OWNER"
                  ? "Authorized"
                  : "Unauthorized"}
              </p>

              {/* 이미 관리자인 경우 */}
              {(userData?.role === "ADMIN" || userData?.role === "OWNER") && (
                <div className="mt-2">
                  <button
                    onClick={() => router.push("/admin")}
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                  >
                    Go to Admin Dashboard
                  </button>
                </div>
              )}

              {/* 임시 관리자 권한 부여 버튼 - 개발 모드에서만 표시 */}
              {userData?.role !== "ADMIN" &&
                userData?.role !== "OWNER" &&
                process.env.NODE_ENV === "development" && (
                  <button
                    onClick={makeCurrentUserAdmin}
                    disabled={loading}
                    className="mt-2 px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 disabled:opacity-50"
                  >
                    Make Current User Admin (Dev Only)
                  </button>
                )}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="text-red-500" size={20} />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400" size={20} />
                  ) : (
                    <Eye className="text-gray-400" size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Admin Info - 보안 강화 */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Authorized Admin Emails (Dev Only):
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                {adminEmails.map((email) => (
                  <li key={email} className="font-mono">
                    {email}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-blue-600 mt-2">
                Password: Kkss@555666 (Dev Only)
              </p>
            </div>
          )}

          {/* Back to Main */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to main site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
