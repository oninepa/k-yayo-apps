"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Helper function to capitalize the first letter of a string
const capitalize = (s: string) => {
  if (typeof s !== "string" || s.length === 0) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// 게시판 이름 파싱 함수
const parseBoardName = (line: string) => {
  const match = line.match(/^([^(]+)\s*\(([^)]+)\)$/);
  return match ? match[1].trim() : line.trim();
};

// URL 슬러그 생성 함수
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function SubCategoryPage({
  params,
}: {
  params: Promise<{ category: string; subCategory: string }>;
}) {
  const resolvedParams = React.use(params);
  const { category, subCategory } = resolvedParams;

  const [boardItems, setBoardItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Decode URI-encoded slugs
  const decodedCategory = decodeURIComponent(category);
  const decodedSubCategory = decodeURIComponent(subCategory);

  useEffect(() => {
    const loadBoardItems = async () => {
      try {
        console.log(`Loading board items for ${category}/${subCategory}`);
        const response = await fetch(
          `/api/getBoardList?category=${encodeURIComponent(
            category
          )}&subCategory=${encodeURIComponent(subCategory)}`
        );

        if (!response.ok) {
          console.error(`Failed to load board items: ${response.status}`);
          setError(`Failed to load board items: ${response.status}`);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (data.error) {
          console.error("API Error:", data.error);
          setError(data.error);
          setIsLoading(false);
          return;
        }

        console.log(`Loaded ${data.boardItems.length} board items`);
        setBoardItems(data.boardItems);
      } catch (error) {
        console.error("Error loading board items:", error);
        setError("Failed to load board items");
      } finally {
        setIsLoading(false);
      }
    };

    loadBoardItems();
  }, [category, subCategory]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-10">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <p className="text-gray-500">Failed to load board items</p>
        </div>
      </div>
    );
  }

  if (boardItems.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-10">
          <p className="text-gray-500">No board items found</p>
        </div>
      </div>
    );
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
        <span className="font-semibold text-gray-700 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          {capitalize(decodedSubCategory.replace(/-/g, " "))}
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {capitalize(decodedSubCategory.replace(/-/g, " "))}
        </h1>
        <p className="text-gray-600">Choose a board to explore</p>
      </div>

      {/* Board Items */}
      <div className="space-y-1">
        {boardItems.map((item, index) => {
          const boardName = parseBoardName(item);
          const boardSlug = slugify(boardName);
          return (
            <Link
              key={`${boardSlug}-${index}`}
              href={`/${category}/${subCategory}/${boardSlug}`}
              className="group block relative overflow-hidden rounded bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-pink-300 transition-all duration-300 hover:shadow-sm"
            >
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate flex-1">
                    {boardName}
                  </h3>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
