"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { notFound } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import Link from "next/link";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { canWriteToBlog } from "@/types/auth";

// Helper function to capitalize the first letter of a string
const capitalize = (s: string) => {
  if (typeof s !== "string" || s.length === 0) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Define the Post interface
interface Post {
  id: string;
  title: string;
  authorName: string;
  createdAt: Timestamp;
  commentCount: number;
  likes: string[];
}

export default function KBlogsBoardListPage({
  params,
}: {
  params: Promise<{ subCategory: string; board: string }>;
}) {
  const resolvedParams = React.use(params);
  const { subCategory, board } = resolvedParams;
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const boardPath = `k-blogs/${subCategory}/${board}`;

  // Fetch posts for this board
  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("boardPath", "==", boardPath),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const postsData = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Post)
        );
        setPosts(postsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [boardPath]);

  // Decode URI-encoded slugs
  const decodedSubCategory = decodeURIComponent(subCategory);
  const decodedBoard = decodeURIComponent(board);

  if (!decodedSubCategory || !decodedBoard) {
    notFound();
  }

  // 권한 확인
  const userRole =
    user?.email === "owner@example.com"
      ? "OWNER"
      : user?.email === "admin@example.com"
      ? "ADMIN"
      : "USER";
  const canWrite = canWriteToBlog(userRole, subCategory);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="text-sm text-gray-500 mb-4 flex items-center space-x-2">
        <span>K-Blogs</span>
        <span>--</span>
        <span>{capitalize(decodedSubCategory.replace(/-/g, " "))}</span>
        <span>--</span>
        <span className="font-semibold text-gray-700">
          {capitalize(decodedBoard.replace(/-/g, " "))}
        </span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {capitalize(decodedBoard.replace(/-/g, " "))}
        </h1>
        {user && canWrite && (
          <Link
            href={`/k-blogs/${subCategory}/${board}/write`}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Write Post
          </Link>
        )}
      </div>

      {/* 권한 안내 메시지 */}
      {user && !canWrite && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            Only owners and administrators can write posts in this section. You
            can still read posts and leave comments.
          </p>
        </div>
      )}

      {/* Posts List */}
      {isLoading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No posts yet.</p>
          {user && canWrite ? (
            <p className="text-gray-500">Be the first to write one!</p>
          ) : (
            <p className="text-gray-500">Check back later for new posts.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/k-blogs/${subCategory}/${board}/${post.id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {post.title}
              </h2>
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                <div className="flex items-center space-x-4">
                  <span>By {post.authorName}</span>
                  <span>{post.createdAt?.toDate().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    <ThumbsUp size={14} className="mr-1" />{" "}
                    {post.likes?.length || 0}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare size={14} className="mr-1" />{" "}
                    {post.commentCount || 0}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
