import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";

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

export default function KBlogsSubCategoryPage({
  params,
}: {
  params: Promise<{ subCategory: string }>;
}) {
  const resolvedParams = React.use(params);
  const { subCategory } = resolvedParams;

  // Decode URI-encoded slug
  const decodedSubCategory = decodeURIComponent(subCategory);

  // public/data 경로 확인
  const dataDir = path.join(process.cwd(), "public", "data");
  if (!fs.existsSync(dataDir)) {
    console.error("Data directory not found:", dataDir);
    notFound();
  }

  const filePath = path.join(dataDir, "k-blogs", `${subCategory}.txt`);

  // 파일 존재 여부 확인
  if (!fs.existsSync(filePath)) {
    console.error("Blog list file not found:", filePath);
    notFound();
  }

  // 파일 읽기 전에 경로 확인
  console.log("Trying to read:", filePath);
  let blogItems: string[] = [];
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    blogItems = fileContent.split("\n").filter((line) => line.trim() !== "");
  } catch (error) {
    console.error("Error reading file:", error);
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-6 text-sm">
        <Link
          href="/k-blogs"
          className="text-gray-400 hover:text-purple-600 transition-colors hover:underline"
        >
          K-Blogs
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
        <p className="text-gray-600">Choose a blog to explore</p>
      </div>

      {/* Blog Items */}
      <div className="space-y-1">
        {blogItems.map((item, index) => {
          const blogName = parseBoardName(item);
          const blogSlug = slugify(blogName);
          return (
            <Link
              key={`${blogSlug}-${index}`}
              href={`/k-blogs/${subCategory}/${blogSlug}`}
              className="group block relative overflow-hidden rounded bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-pink-300 transition-all duration-300 hover:shadow-sm"
            >
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate flex-1">
                    {blogName}
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
