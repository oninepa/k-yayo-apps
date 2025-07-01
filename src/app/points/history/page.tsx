"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/userService";
import { Coins, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { PointTransaction } from "@/types/auth";

const PointHistoryPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return;

      try {
        const history = await UserService.getPointTransactions(user.uid, 50);
        setTransactions(history);
      } catch (error) {
        console.error("Failed to load transaction history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  const getTransactionIcon = (type: "earn" | "spend") => {
    return type === "earn" ? (
      <TrendingUp className="text-green-600" size={16} />
    ) : (
      <TrendingDown className="text-red-600" size={16} />
    );
  };

  const getTransactionTypeDisplayName = (type: string) => {
    switch (type) {
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
        return type;
    }
  };

  const getTransactionDescription = (transaction: PointTransaction) => {
    switch (transaction.reason) {
      case "post":
        return "게시글 작성";
      case "comment":
        return "댓글 작성";
      case "reply":
        return "대댓글 작성";
      case "like":
        return "좋아요";
      case "dislike":
        return "싫어요";
      case "purchase":
        return "아이템 구매";
      case "admin_grant":
        return "관리자 지급";
      case "admin_deduct":
        return "관리자 차감";
      default:
        return transaction.description || "기타";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Coins className="text-yellow-500" size={24} />
            <h1 className="text-2xl font-bold">Transaction History</h1>
          </div>

          {/* Current Points */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Current Points</p>
                <p className="text-2xl font-bold text-blue-800">
                  {userData?.points || 0} Points
                </p>
              </div>
              <Coins className="text-blue-600" size={32} />
            </div>
          </div>

          {/* Transaction List */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto mb-4" size={48} />
                <p>No transaction history found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">
                          {getTransactionTypeDisplayName(transaction.reason)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "earn"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "earn" ? "+" : "-"}
                        {transaction.amount} Points
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointHistoryPage;
