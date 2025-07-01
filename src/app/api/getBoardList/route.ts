import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subCategory");

  if (!category || !subCategory) {
    return NextResponse.json(
      { error: "Category and subCategory are required" },
      { status: 400 }
    );
  }

  try {
    // public/data 경로에서 파일 읽기
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      category,
      `${subCategory}.txt`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const boardItems = fileContent
      .split("\n")
      .filter((line) => line.trim() !== "");

    return NextResponse.json({ boardItems });
  } catch (error) {
    console.error("Error reading board list:", error);
    return NextResponse.json(
      { error: "Failed to read board list" },
      { status: 500 }
    );
  }
}
