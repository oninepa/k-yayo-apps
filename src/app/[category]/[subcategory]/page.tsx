import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

// "English(Korean)" 형식에서 "English" 부분만 추출하는 헬퍼 함수
const parseBoardName = (line: string) => {
  const match = line.match(/^([^()]+)/);
  return match ? match[1].trim() : line.trim();
};

// URL에 사용하기 안전한 slug를 만드는 헬퍼 함수
const slugify = (text: string) => {
  return text.toLowerCase().replace(/\s+/g, "-");
};

export default function SubCategoryPage({
  params,
}: {
  params: { category: string; subCategory: string };
}) {
  const { category, subCategory } = params;
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    category,
    `${subCategory}.txt`
  );

  let boardItems: string[] = [];
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    boardItems = fileContent.split("\n").filter((line) => line.trim() !== "");
  } catch (error) {
    // .txt 파일이 없으면 404 페이지를 보여줍니다.
    notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold capitalize mb-4">
        {subCategory.replace(/-/g, " ")}
      </h1>
      <ul className="space-y-2">
        {boardItems.map((item) => {
          const boardName = parseBoardName(item);
          const boardSlug = slugify(boardName);
          return (
            <li key={boardSlug}>
              <Link
                href={`/${category}/${subCategory}/${boardSlug}`}
                className="block p-3 bg-white rounded-lg shadow hover:bg-gray-100 transition-colors"
              >
                {item}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
