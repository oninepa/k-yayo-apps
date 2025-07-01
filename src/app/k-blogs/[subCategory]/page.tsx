import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";
import fs from "fs";

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
    <div className="p-4">
      <h1 className="text-2xl font-bold capitalize mb-4">
        {subCategory.replace(/-/g, " ")}
      </h1>
      <ul className="space-y-2">
        {blogItems.map((item, index) => {
          const blogName = parseBoardName(item);
          const blogSlug = slugify(blogName);
          return (
            <li key={`${blogSlug}-${index}`}>
              <Link
                href={`/k-blogs/${subCategory}/${blogSlug}`}
                className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {blogName}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
