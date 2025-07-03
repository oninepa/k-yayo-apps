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
import { generatePostNumber } from "@/utils/postNumberGenerator";

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

export default function BoardListPage({
  params,
}: {
  params: Promise<{ category: string; subCategory: string; board: string }>;
}) {
  const resolvedParams = React.use(params);
  const { category, subCategory, board } = resolvedParams;
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const boardPath = `${category}/${subCategory}/${board}`;

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
  const decodedCategory = decodeURIComponent(category);
  const decodedSubCategory = decodeURIComponent(subCategory);
  const decodedBoard = decodeURIComponent(board);

  if (!decodedCategory || !decodedSubCategory || !decodedBoard) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-6 text-sm">
        <Link
          href={`/${category}`}
          className="text-gray-400 hover:text-purple-600 transition-colors hover:underline"
        >
          {capitalize(decodedCategory.replace(/-/g, " "))}
        </Link>
        <span className="text-gray-300">•</span>
        <Link
          href={`/${category}/${subCategory}`}
          className="text-gray-500 hover:text-purple-600 transition-colors hover:underline"
        >
          {capitalize(decodedSubCategory.replace(/-/g, " "))}
        </Link>
        <span className="text-gray-300">•</span>
        <span className="font-semibold text-gray-700 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          {capitalize(decodedBoard.replace(/-/g, " "))}
        </span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {capitalize(decodedBoard.replace(/-/g, " "))}
          </h1>
          <p className="text-gray-600">
            Share your thoughts and connect with fans
          </p>
        </div>
        {user && (
          <Link
            href={`/${category}/${subCategory}/${board}/write`}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>✏️</span>
            <span>Write Post</span>
          </Link>
        )}
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">
            Be the first to share your thoughts!
          </p>
          {user && (
            <Link
              href={`/${category}/${subCategory}/${board}/write`}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>✏️</span>
              <span>Write First Post</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-0.5">
          {posts.map((post, index) => {
            const postNumber = generatePostNumber(
              category,
              subCategory,
              board,
              posts.length - index
            );
            return (
              <Link
                key={post.id}
                href={`/${category}/${subCategory}/${board}/${post.id}`}
                className="group block relative overflow-hidden rounded bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-pink-300 transition-all duration-300 hover:shadow-sm"
              >
                <div className="px-4 py-3 h-16">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
                      #{postNumber}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors truncate flex-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm flex-shrink-0">
                      <div className="flex items-center space-x-1 text-pink-500">
                        <ThumbsUp size={16} />
                        <span className="font-medium">
                          {post.likes?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-500">
                        <MessageSquare size={16} />
                        <span className="font-medium">
                          {post.commentCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
