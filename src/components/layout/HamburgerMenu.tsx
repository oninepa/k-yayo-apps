"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/firebase/auth";
import {
  User,
  Settings,
  Mail,
  Shield,
  Coins,
  MessageSquare,
  FileText,
  LogOut,
  Edit,
  Bell,
  CreditCard,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { user, userData } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-[9999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white w-80 h-full shadow-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {/* User Profile Section */}
          {user && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-semibold">
                    {userData?.nickname || user.displayName}
                  </div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="space-y-1">
            {/* Personal Information */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/profile/edit");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <Edit size={20} />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/profile/email-verification");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <Mail size={20} />
              <span>Email Verification</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/profile/change-password");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <Shield size={20} />
              <span>Change Password</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/profile/delete-account");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-red-50 rounded-lg text-red-600"
            >
              <User size={20} />
              <span>Delete Account</span>
            </button>

            {/* Notification Settings */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/settings/ad-notifications");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <Bell size={20} />
              <span>Ad Notifications</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/settings/email-notifications");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <Mail size={20} />
              <span>Email Notifications</span>
            </button>

            {/* Point Shop */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/points/shop");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <Coins size={20} />
              <span>Point Shop</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/points/recharge");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <CreditCard size={20} />
              <span>Recharge Points</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/points/history");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <FileText size={20} />
              <span>Transaction History</span>
            </button>

            {/* Contact & Support */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/contact/feedback");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <MessageSquare size={20} />
              <span>Send Feedback</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/contact/support");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <MessageSquare size={20} />
              <span>Contact Support</span>
            </button>

            {/* Legal & Terms */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/legal/terms");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <FileText size={20} />
              <span>Terms of Service</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/legal/privacy");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <Shield size={20} />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/legal/notices");
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <Info size={20} />
              <span>Legal Notices</span>
            </button>

            {/* Admin Access - 보안상 제거됨 */}
            {/* Admin 접근은 직접 URL로만 가능: /admin/login */}

            {/* Logout */}
            {user && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-red-50 rounded-lg text-red-600"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
