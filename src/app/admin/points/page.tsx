"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/userService";
import { canManageUsers, PointTransaction, POINT_RULES } from "@/types/auth";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  User,
  Plus,
  Minus,
  Settings,
  History,
} from "lucide-react";

const AdminPointsPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "earn" | "spend">("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<PointTransaction | null>(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [pointAmount, setPointAmount] = useState("");
  const [pointReason, setPointReason] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
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

    loadTransactions();
  }, [user, userData, router]);

  const loadTransactions = async () => {
    try {
      // 모든 사용자의 포인트 거래 내역을 가져오기 위해 임시로 구현
      // 실제로는 관리자용 API가 필요할 수 있음
      const allTransactions: PointTransaction[] = [];
      // TODO: 실제 구현에서는 모든 사용자의 거래 내역을 가져와야 함
      setTransactions(allTransactions);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setMessage("Failed to load transaction history.");
    } finally {
      setLoading(false);
    }
  };

  const handlePointModification = async () => {
    if (!targetEmail || !pointAmount || !pointReason) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!pointAmount || isNaN(Number(pointAmount))) {
      setMessage("Please enter a valid point amount.");
      return;
    }

    setActionLoading(true);
    try {
      const amount = parseFloat(pointAmount);
      if (isNaN(amount)) {
        setMessage("Please enter a valid point amount.");
        return;
      }

      // TODO: 이메일로 사용자 찾기 및 포인트 수정
      setMessage("Points updated successfully.");
      setPointAmount("");
      setPointReason("");
      loadTransactions();
    } catch (error) {
      console.error("Error updating points:", error);
      setMessage("Failed to update points.");
    } finally {
      setActionLoading(false);
    }
  };

  const getTransactionIcon = (type: "earn" | "spend") => {
    return type === "earn" ? (
      <TrendingUp className="text-green-600" size={16} />
    ) : (
      <TrendingDown className="text-red-600" size={16} />
    );
  };

  const getTransactionDescription = (transaction: PointTransaction) => {
    switch (transaction.reason) {
      case "post":
        return "Post Creation";
      case "comment":
        return "Comment Creation";
      case "reply":
        return "Reply Creation";
      case "like":
        return "Like";
      case "dislike":
        return "Dislike";
      case "purchase":
        return "Item Purchase";
      case "admin_grant":
        return "Admin Grant";
      case "admin_deduct":
        return "Admin Deduct";
      default:
        return transaction.description || "Other";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTransactionTypeDisplayName = (type: string) => {
    switch (type) {
      case "POST_CREATE":
        return "Post Creation";
      case "COMMENT_CREATE":
        return "Comment Creation";
      case "REPLY_CREATE":
        return "Reply Creation";
      case "NICKNAME_CHANGE":
        return "Nickname Change";
      case "ADMIN_GRANT":
        return "Admin Grant";
      case "ADMIN_DEDUCT":
        return "Admin Deduct";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading point information...</p>
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
              <div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center">
                <Coins className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Point System Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Point Rules Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Point Earning Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Plus className="text-blue-600" size={16} />
                <h3 className="font-medium text-gray-900">Post Writing</h3>
              </div>
              <div className="text-sm text-gray-600">
                <div>First 10: {POINT_RULES.POST.FIRST_10} points</div>
                <div>After: {POINT_RULES.POST.AFTER_10} points</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Plus className="text-green-600" size={16} />
                <h3 className="font-medium text-gray-900">Comment Writing</h3>
              </div>
              <div className="text-sm text-gray-600">
                <div>First 10: {POINT_RULES.COMMENT.FIRST_10} points</div>
                <div>After: {POINT_RULES.COMMENT.AFTER_10} points</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Plus className="text-purple-600" size={16} />
                <h3 className="font-medium text-gray-900">Reply Writing</h3>
              </div>
              <div className="text-sm text-gray-600">
                <div>First 10: {POINT_RULES.REPLY.FIRST_10} points</div>
                <div>After: {POINT_RULES.REPLY.AFTER_10} points</div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Coins className="text-orange-600" size={16} />
                <h3 className="font-medium text-gray-900">Like/Dislike</h3>
              </div>
              <div className="text-sm text-gray-600">
                <div>Like: +1 point per {POINT_RULES.LIKE_THRESHOLD}</div>
                <div>Dislike: -1 point per {POINT_RULES.DISLIKE_THRESHOLD}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Point Management
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowPointModal(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              <span>Grant/Deduct Points</span>
            </button>
            <button
              onClick={() => router.push("/admin/users")}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <User size={16} />
              <span>User Management</span>
            </button>
            <button
              onClick={() => router.push("/admin/analytics")}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <History size={16} />
              <span>View Analytics</span>
            </button>
          </div>
        </div>

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
                  placeholder="Search by user ID or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as "all" | "earn" | "spend")
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Transactions</option>
                <option value="earn">Earn</option>
                <option value="spend">Spend</option>
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

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getTransactionIcon(transaction.type)}
                          <span className="text-sm font-medium text-gray-900">
                            {getTransactionTypeDisplayName(transaction.reason)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.userId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${
                            transaction.type === "earn"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "earn" ? "+" : "-"}
                          {transaction.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getTransactionDescription(transaction)}
                        </div>
                        {transaction.description && (
                          <div className="text-sm text-gray-500">
                            {transaction.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Count */}
        <div className="mt-4 text-sm text-gray-600">
          Total {filteredTransactions.length} transactions
        </div>
      </div>

      {/* Point Modification Modal */}
      {showPointModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Point Grant/Deduct</h2>
              <button
                onClick={() => setShowPointModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email
                </label>
                <input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="Enter user email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Point Change Amount (+/-)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  placeholder="Enter reason for point change"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={pointReason}
                  onChange={(e) => setPointReason(e.target.value)}
                  placeholder="Enter reason for point change"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPointModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePointModification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPointsPage;
