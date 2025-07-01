"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      <div className="p-4">
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
      <div className="p-4">
        <div className="text-center py-10">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <p className="text-gray-500">Failed to load board items</p>
        </div>
      </div>
    );
  }

  if (boardItems.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center py-10">
          <p className="text-gray-500">No board items found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold capitalize mb-4">
        {subCategory.replace(/-/g, " ")}
      </h1>
      <ul className="space-y-2">
        {boardItems.map((item, index) => {
          const boardName = parseBoardName(item);
          const boardSlug = slugify(boardName);
          return (
            <li key={`${boardSlug}-${index}`}>
              <Link
                href={`/${category}/${subCategory}/${boardSlug}`}
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {boardName}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
