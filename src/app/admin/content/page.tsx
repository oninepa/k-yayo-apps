"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { canManageContent } from "@/types/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  FileText,
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Eye,
  ArrowLeft,
  Calendar,
  User,
  AlertTriangle,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  boardPath: string;
  createdAt: any;
  updatedAt?: any;
  likes: number;
  dislikes: number;
  commentCount: number;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  postId: string;
  createdAt: any;
  likes: number;
  dislikes: number;
}

const AdminContentPage = () => {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [searchTerm, setSearchTerm] = useState("");
  const [boardFilter, setBoardFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<Post | Comment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
      return;
    }

    // 권한 확인
    if (!canManageContent(userData?.role || "MEMBER")) {
      router.push("/admin");
      return;
    }

    loadContent();
  }, [user, userData, router]);

  const loadContent = async () => {
    try {
      // 게시글 로드
      const postsRef = collection(db, "posts");
      const postsQuery = query(
        postsRef,
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Post[];
      setPosts(postsData);

      // 댓글 로드
      const commentsRef = collection(db, "comments");
      const commentsQuery = query(
        commentsRef,
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsData = commentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Comment[];
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to load content:", error);
      setMessage("콘텐츠를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setActionLoading(true);
    try {
      if (activeTab === "posts") {
        const post = selectedItem as Post;
        await deleteDoc(doc(db, "posts", post.id));
        setMessage("게시글이 삭제되었습니다.");
      } else {
        const comment = selectedItem as Comment;
        await deleteDoc(doc(db, "comments", comment.id));
        setMessage("댓글이 삭제되었습니다.");
      }

      setShowDeleteModal(false);
      setSelectedItem(null);
      loadContent(); // 목록 새로고침
    } catch (error) {
      console.error("Error deleting comment:", error);
      setMessage("Comment deleted successfully.");
    } finally {
      setActionLoading(false);
    }
  };

  const getBoardDisplayName = (boardPath: string): string => {
    const parts = boardPath.split("/");
    if (parts.length >= 3) {
      return `${parts[0]} > ${parts[1]} > ${parts[2]}`;
    }
    return boardPath;
  };

  const getUniqueBoards = (): string[] => {
    const boards = posts.map((post) => post.boardPath);
    return ["ALL", ...Array.from(new Set(boards))];
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBoard =
      boardFilter === "ALL" || post.boardPath === boardFilter;
    return matchesSearch && matchesBoard;
  });

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">콘텐츠를 불러오는 중...</p>
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
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Content Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "posts"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FileText size={16} />
                <span>Posts ({posts.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === "comments"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageSquare size={16} />
                <span>Comments ({comments.length})</span>
              </div>
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
                  placeholder={
                    activeTab === "posts"
                      ? "Search by title or author..."
                      : "Search by content or author..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {activeTab === "posts" && (
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={boardFilter}
                  onChange={(e) => setBoardFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {getUniqueBoards().map((board) => (
                    <option key={board} value={board}>
                      {board === "ALL"
                        ? "All Boards"
                        : getBoardDisplayName(board)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Content List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {activeTab === "posts" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Board
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {post.content.substring(0, 100)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {post.authorName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {getBoardDisplayName(post.boardPath)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <div>
                            👍 {post.likes} 👎 {post.dislikes}
                          </div>
                          <div>💬 {post.commentCount}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedItem(post);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={actionLoading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {comment.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {comment.authorName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {comment.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          👍 {comment.likes} 👎 {comment.dislikes}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedItem(comment);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={actionLoading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Content Count */}
        <div className="mt-4 text-sm text-gray-600">
          Total{" "}
          {activeTab === "posts"
            ? filteredPosts.length
            : filteredComments.length}
          {activeTab === "posts" ? " posts" : " comments"}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-red-600" size={24} />
              <h2 className="text-xl font-bold">Confirm Delete</h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this{" "}
                {activeTab === "posts" ? "post" : "comment"}?
              </p>
              {activeTab === "posts" ? (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    {(selectedItem as Post).title}
                  </p>
                  <p className="text-sm text-gray-600">
                    Author: {(selectedItem as Post).authorName}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {(selectedItem as Comment).content.substring(0, 100)}...
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Author: {(selectedItem as Comment).authorName}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContentPage;
