"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { canManageUsers } from "@/types/auth";
import {
  Settings,
  Shield,
  Coins,
  Globe,
  ArrowLeft,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxPostsPerDay: number;
  maxCommentsPerDay: number;
  pointRules: {
    postFirst10: number;
    postAfter10: number;
    commentFirst10: number;
    commentAfter10: number;
    replyFirst10: number;
    replyAfter10: number;
    likeThreshold: number;
    dislikeThreshold: number;
    nicknameChangeCost: number;
  };
  security: {
    requireEmailVerification: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    enable2FA: boolean;
  };
  features: {
    enableTranslation: boolean;
    enableFileUpload: boolean;
    enableNotifications: boolean;
    enableAnalytics: boolean;
  };
}

const AdminSettingsPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "K-YAYO",
    siteDescription: "한국 문화 및 엔터테인먼트 커뮤니티",
    maintenanceMode: false,
    registrationEnabled: true,
    maxPostsPerDay: 10,
    maxCommentsPerDay: 50,
    pointRules: {
      postFirst10: 0.1,
      postAfter10: 0.05,
      commentFirst10: 0.05,
      commentAfter10: 0.03,
      replyFirst10: 0.02,
      replyAfter10: 0.01,
      likeThreshold: 100,
      dislikeThreshold: 100,
      nicknameChangeCost: 10,
    },
    security: {
      requireEmailVerification: true,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      enable2FA: false,
    },
    features: {
      enableTranslation: true,
      enableFileUpload: true,
      enableNotifications: true,
      enableAnalytics: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
      return;
    }

    // 권한 확인
    if (!canManageUsers(userData?.role || "MEMBER")) {
      router.push("/admin");
      return;
    }

    loadSettings();
  }, [user, userData, router]);

  const loadSettings = async () => {
    try {
      // TODO: 실제 Firebase에서 설정을 가져오는 로직 구현
      // 현재는 기본값 사용
      setLoading(false);
    } catch (error) {
      console.error("Failed to load settings:", error);
      setMessage("Failed to load settings.");
      setMessageType("error");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: 실제 Firebase에 설정을 저장하는 로직 구현
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 지연

      setMessage("Settings have been saved.");
      setMessageType("success");
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage("Failed to save settings.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (
      confirm("Are you sure you want to reset all settings to default values?")
    ) {
      loadSettings();
      setMessage("Settings have been reset.");
      setMessageType("info");
    }
  };

  const updateSettings = (path: string, value: any) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const keys = path.split(".");
      let current: any = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
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
              <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                <Settings className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Site Settings</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <RefreshCw size={16} />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : messageType === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              {messageType === "success" ? (
                <CheckCircle size={16} />
              ) : messageType === "error" ? (
                <AlertTriangle size={16} />
              ) : (
                <Settings size={16} />
              )}
              <p>{message}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">
                General Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => updateSettings("siteName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) =>
                    updateSettings("siteDescription", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Maintenance Mode
                  </label>
                  <p className="text-xs text-gray-500">
                    Temporarily disable the site
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      updateSettings("maintenanceMode", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Allow Registration
                  </label>
                  <p className="text-xs text-gray-500">
                    Allow new users to register
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.registrationEnabled}
                    onChange={(e) =>
                      updateSettings("registrationEnabled", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Maximum Posts
                  </label>
                  <input
                    type="number"
                    value={settings.maxPostsPerDay}
                    onChange={(e) =>
                      updateSettings("maxPostsPerDay", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Maximum Comments
                  </label>
                  <input
                    type="number"
                    value={settings.maxCommentsPerDay}
                    onChange={(e) =>
                      updateSettings(
                        "maxCommentsPerDay",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="text-red-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">보안 설정</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Verification Required
                  </label>
                  <p className="text-xs text-gray-500">
                    Require email verification for signup
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.requireEmailVerification}
                    onChange={(e) =>
                      updateSettings(
                        "security.requireEmailVerification",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Two-Factor Authentication
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable 2FA for administrator accounts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.enable2FA}
                    onChange={(e) =>
                      updateSettings("security.enable2FA", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Login Attempts
                  </label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) =>
                      updateSettings(
                        "security.maxLoginAttempts",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      updateSettings(
                        "security.sessionTimeout",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Point Rules */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Coins className="text-yellow-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">
                Point Rules
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    First 10 Posts
                  </label>
                  <p className="text-xs text-gray-500">
                    Points earned for the first 10 posts of the day
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.pointRules.postFirst10}
                  onChange={(e) =>
                    updateSettings(
                      "pointRules.postFirst10",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Posts After First 10
                  </label>
                  <p className="text-xs text-gray-500">
                    Points earned for posts after the first 10
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.pointRules.postAfter10}
                  onChange={(e) =>
                    updateSettings(
                      "pointRules.postAfter10",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    First 10 Comments
                  </label>
                  <p className="text-xs text-gray-500">
                    Points earned for the first 10 comments of the day
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.pointRules.commentFirst10}
                  onChange={(e) =>
                    updateSettings(
                      "pointRules.commentFirst10",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Comments After First 10
                  </label>
                  <p className="text-xs text-gray-500">
                    Points earned for comments after the first 10
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.pointRules.commentAfter10}
                  onChange={(e) =>
                    updateSettings(
                      "pointRules.commentAfter10",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nickname Change Cost
                  </label>
                  <p className="text-xs text-gray-500">
                    Points required to change nickname
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.pointRules.nicknameChangeCost}
                  onChange={(e) =>
                    updateSettings(
                      "pointRules.nicknameChangeCost",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="text-green-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Features</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Translation Feature
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable multi-language translation feature
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.features.enableTranslation}
                    onChange={(e) =>
                      updateSettings(
                        "features.enableTranslation",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    File Upload
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable image and file upload feature
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.features.enableFileUpload}
                    onChange={(e) =>
                      updateSettings(
                        "features.enableFileUpload",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Notification Feature
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable push notifications and email notifications
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.features.enableNotifications}
                    onChange={(e) =>
                      updateSettings(
                        "features.enableNotifications",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Analytics Collection
                  </label>
                  <p className="text-xs text-gray-500">
                    Collect user behavior analytics and statistics
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.features.enableAnalytics}
                    onChange={(e) =>
                      updateSettings(
                        "features.enableAnalytics",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
