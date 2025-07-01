"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react";

const DeleteAccountPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      alert("Please type 'DELETE' to confirm account deletion.");
      return;
    }

    setIsDeleting(true);
    try {
      // Firestore에서 사용자 데이터 삭제
      if (user.uid) {
        await deleteDoc(doc(db, "users", user.uid));
      }

      // Firebase Auth에서 사용자 계정 삭제
      await deleteUser(user);

      // 홈페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <Trash2 className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Delete Account
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Warning Section */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-red-600" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Warning: This action cannot be undone
                </h3>
                <p className="text-red-700 mt-1">
                  Deleting your account will permanently remove all your data,
                  including posts, comments, points, and profile information.
                </p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Account Information</h3>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Nickname:</strong> {userData?.nickname || "Not set"}
              </p>
              <p>
                <strong>Points:</strong> {userData?.points || 0}
              </p>
              <p>
                <strong>Member since:</strong>{" "}
                {userData?.createdAt?.toLocaleDateString() || "Unknown"}
              </p>
            </div>
          </div>

          {/* What will be deleted */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              What will be deleted:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Your profile information</li>
              <li>All your posts and comments</li>
              <li>Your points and transaction history</li>
              <li>Your account settings and preferences</li>
              <li>All associated data and files</li>
            </ul>
          </div>

          {/* Confirmation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Confirmation</h3>
            <p className="text-gray-700 mb-4">
              To confirm account deletion, please type <strong>DELETE</strong>{" "}
              in the field below:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={confirmText !== "DELETE" || isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
