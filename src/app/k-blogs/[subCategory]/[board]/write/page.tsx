"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { canWriteToBlog } from "@/types/auth";
import { Image, Video, File, X } from "lucide-react";

export default function KBlogsWritePostPage({
  params,
}: {
  params: Promise<{ subCategory: string; board: string }>;
}) {
  const resolvedParams = React.use(params);
  const { subCategory, board } = resolvedParams;
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 미디어 파일 상태
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // This should not be reached due to AuthGuard, but as a safeguard:
    router.push("/login");
    return null;
  }

  // 권한 확인
  const userRole =
    user?.email === "owner@example.com"
      ? "OWNER"
      : user?.email === "admin@example.com"
      ? "ADMIN"
      : "USER";
  const canWrite = canWriteToBlog(userRole, subCategory);

  if (!canWrite) {
    router.push(`/k-blogs/${subCategory}/${board}`);
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (images.length + imageFiles.length > 3) {
      setError("최대 3장의 이미지만 업로드할 수 있습니다.");
      return;
    }

    setImages((prev) => [...prev, ...imageFiles]);
    setError(null);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("동영상 파일만 업로드할 수 있습니다.");
      return;
    }

    setVideo(file);
    setError(null);
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    setError(null);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const boardPath = `k-blogs/${subCategory}/${board}`;

      // 실제 구현에서는 파일을 Firebase Storage에 업로드하고 URL을 가져와야 함
      const imageUrls: string[] = []; // 이미지 업로드 후 URL 배열
      const videoUrl: string | null = null; // 비디오 업로드 후 URL
      const attachmentUrls: string[] = []; // 첨부파일 업로드 후 URL 배열

      await addDoc(collection(db, "posts"), {
        boardPath,
        title,
        content,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorPhotoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        likes: [],
        dislikes: [],
        commentCount: 0,
        imageUrls,
        videoUrl,
        attachmentUrls,
      });

      router.push(`/k-blogs/${subCategory}/${board}`);
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={10}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images (Maximum 3)
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Image size={16} className="mr-2" />
              Select Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-500">{images.length}/3</span>
          </div>
          {images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 비디오 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video (30 seconds or less)
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Video size={16} className="mr-2" />
              Select Video
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
            {video && (
              <button
                type="button"
                onClick={removeVideo}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
          {video && (
            <div className="mt-2">
              <video
                src={URL.createObjectURL(video)}
                controls
                className="max-w-md rounded border"
              />
            </div>
          )}
        </div>

        {/* 첨부파일 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <File size={16} className="mr-2" />
              Select File
              <input
                type="file"
                multiple
                onChange={handleAttachmentUpload}
                className="hidden"
              />
            </label>
          </div>
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
