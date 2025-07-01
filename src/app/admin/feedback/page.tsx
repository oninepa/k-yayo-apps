"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { canManageUsers } from "@/types/auth";
import {
  MessageSquare,
  Search,
  Filter,
  ArrowLeft,
  Mail,
  User,
  Calendar,
  Star,
  Reply,
  Eye,
  EyeOff,
} from "lucide-react";

interface Feedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: "pending" | "replied" | "closed";
  createdAt: Date;
  repliedAt?: Date;
  replyMessage?: string;
}

const AdminFeedbackPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "replied" | "closed"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    loadFeedbacks();
  }, [user, userData, router]);

  const loadFeedbacks = async () => {
    try {
      // TODO: 실제 Firebase에서 피드백 데이터를 가져오는 로직 구현
      // 현재는 더미 데이터 사용
      const mockFeedbacks: Feedback[] = [
        {
          id: "1",
          name: "user1",
          email: "user1@example.com",
          subject: "The site is great but sometimes slow.",
          message: "The site is great but sometimes slow.",
          category: "general",
          status: "pending",
          createdAt: new Date("2024-01-15"),
        },
        {
          id: "2",
          name: "user2",
          email: "user2@example.com",
          subject: "Login sometimes fails.",
          message: "Login sometimes fails.",
          category: "bug",
          status: "replied",
          createdAt: new Date("2024-01-14"),
          repliedAt: new Date("2024-01-16"),
          replyMessage: "We are investigating this issue.",
        },
        {
          id: "3",
          name: "user3",
          email: "user3@example.com",
          subject: "Can you add dark mode?",
          message: "Can you add dark mode?",
          category: "feature",
          status: "closed",
          createdAt: new Date("2024-01-13"),
          repliedAt: new Date("2024-01-15"),
          replyMessage: "Dark mode will be added in the next update.",
        },
      ];
      setFeedbacks(mockFeedbacks);
    } catch (error) {
      console.error("Failed to load feedbacks:", error);
      setMessage("Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedFeedback) return;

    try {
      // TODO: 실제 Firebase에 답변 저장하는 로직 구현
      setMessage("Reply sent successfully.");
      setShowReplyModal(false);
      setReplyMessage("");
      // 목록 새로고침
    } catch (error) {
      console.error("Error sending reply:", error);
      setMessage("Failed to send reply.");
    }
  };

  const handleStatusChange = async (feedbackId: string, newStatus: string) => {
    try {
      // TODO: 실제 Firebase에 상태 변경하는 로직 구현
      setMessage("Status updated successfully.");
      // 목록 새로고침
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("Failed to update status.");
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "general":
        return "General";
      case "bug":
        return "Bug Report";
      case "feature":
        return "Feature Request";
      case "improvement":
        return "Improvement";
      case "other":
        return "Other";
      default:
        return category;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "replied":
        return "Replied";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || feedback.status === statusFilter;
    const matchesCategory =
      categoryFilter === "ALL" || feedback.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
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
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                <MessageSquare className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                User Feedback Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, subject, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "pending" | "replied" | "closed"
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Categories</option>
                <option value="general">General</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="improvement">Improvement</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Feedbacks List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFeedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {feedback.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {feedback.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {feedback.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCategoryDisplayName(feedback.category)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {feedback.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          feedback.status
                        )}`}
                      >
                        {getStatusDisplayName(feedback.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {feedback.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedFeedback(feedback);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={16} />
                        </button>
                        {feedback.status === "pending" && (
                          <button
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setShowReplyModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Reply size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Count */}
        <div className="mt-4 text-sm text-gray-600">
          총 {filteredFeedbacks.length}개의 피드백
        </div>
      </div>

      {/* Feedback Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">피드백 상세</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedFeedback.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedFeedback.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <p className="text-sm text-gray-900">
                  {selectedFeedback.subject}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <p className="text-sm text-gray-900">
                  {getCategoryDisplayName(selectedFeedback.category)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedFeedback.message}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <p className="text-sm text-gray-500">
                    {selectedFeedback.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedFeedback.status
                    )}`}
                  >
                    {getStatusDisplayName(selectedFeedback.status)}
                  </span>
                </div>
              </div>

              {selectedFeedback.replyMessage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reply
                  </label>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedFeedback.replyMessage}
                    </p>
                    {selectedFeedback.repliedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Reply Date:{" "}
                        {selectedFeedback.repliedAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <select
                  value={selectedFeedback.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedFeedback.id,
                      e.target.value as "pending" | "replied" | "closed"
                    )
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
                {selectedFeedback.status === "pending" && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowReplyModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Write Reply</h2>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Message
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900">
                    {selectedFeedback.message.substring(0, 200)}...
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reply Content
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Enter your reply..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={actionLoading}
                >
                  취소
                </button>
                <button
                  onClick={handleReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={actionLoading}
                >
                  {actionLoading ? "전송 중..." : "답변 전송"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPage;
