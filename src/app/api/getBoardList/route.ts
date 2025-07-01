import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request, { params }: { params: { category: string; subCategory: string } }) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const subCategory = searchParams.get('subCategory');
  
  if (!category || !subCategory) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'data', category, `${subCategory}.txt`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const boardItems = fileContent.split('\n').filter(line => line.trim() !== '');
    return NextResponse.json({ boardItems });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}