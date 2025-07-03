"use client";

import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  runTransaction,
  increment,
  updateDoc,
} from "firebase/firestore";
import { notFound, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import CommentItem from "@/components/board/CommentItem";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AdBanner from "@/components/ads/AdBanner";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Image,
  Video,
  File,
  Download,
  FileText,
} from "lucide-react";

// Define interfaces
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  createdAt: Timestamp;
  likes: string[];
  dislikes: string[];
  commentCount: number;
  imageUrls?: string[];
  videoUrl?: string;
  attachmentUrls?: string[];
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string | null;
  createdAt: Timestamp;
  likes: string[];
  dislikes: string[];
  parentId: string | null;
  postId: string;
  boardPath: string;
}

export default function PostPage() {
  const params = useParams();
  const { category, subCategory, board, postId } = params as {
    category: string;
    subCategory: string;
    board: string;
    postId: string;
  };

  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 내비게이션 경로 생성
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: category, href: `/${category}` },
    { label: subCategory, href: `/${category}/${subCategory}` },
    { label: board, href: `/${category}/${subCategory}/${board}` },
    { label: post?.title || "Post" },
  ];

  // Fetch the post data
  useEffect(() => {
    if (!postId) return;
    const postRef = doc(db, "posts", postId);

    const unsubscribe = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        setPost({ id: doc.id, ...doc.data() } as Post);
      } else {
        notFound();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  // Fetch comments for the post
  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("postId", "==", postId),
      where("parentId", "==", null), // Only fetch top-level comments
      orderBy("createdAt", "desc") // Show newest comments first
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Comment)
      );
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId]);

  // 게시글 좋아요/싫어요 처리 함수
  const handlePostLike = async () => {
    if (!user || !post) return;

    const postRef = doc(db, "posts", postId);
    const userId = user.uid;

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw "Post does not exist!";
        }

        const currentLikes = postDoc.data().likes || [];
        const currentDislikes = postDoc.data().dislikes || [];

        let newLikes = [...currentLikes];
        let newDislikes = [...currentDislikes];

        // 이미 좋아요를 눌렀다면 취소
        if (currentLikes.includes(userId)) {
          newLikes = currentLikes.filter((id: string) => id !== userId);
        } else {
          // 좋아요 추가하고 싫어요가 있다면 제거
          if (!currentLikes.includes(userId)) {
            newLikes.push(userId);
          }
          newDislikes = currentDislikes.filter((id: string) => id !== userId);
        }

        transaction.update(postRef, {
          likes: newLikes,
          dislikes: newDislikes,
        });
      });
    } catch (error) {
      console.error("Error updating post like: ", error);
    }
  };

  const handlePostDislike = async () => {
    if (!user || !post) return;

    const postRef = doc(db, "posts", postId);
    const userId = user.uid;

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw "Post does not exist!";
        }

        const currentLikes = postDoc.data().likes || [];
        const currentDislikes = postDoc.data().dislikes || [];

        let newLikes = [...currentLikes];
        let newDislikes = [...currentDislikes];

        // 이미 싫어요를 눌렀다면 취소
        if (currentDislikes.includes(userId)) {
          newDislikes = currentDislikes.filter((id: string) => id !== userId);
        } else {
          // 싫어요 추가하고 좋아요가 있다면 제거
          if (!currentDislikes.includes(userId)) {
            newDislikes.push(userId);
          }
          newLikes = currentLikes.filter((id: string) => id !== userId);
        }

        transaction.update(postRef, {
          likes: newLikes,
          dislikes: newDislikes,
        });
      });
    } catch (error) {
      console.error("Error updating post dislike: ", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const postRef = doc(db, "posts", postId);

      // Run a transaction to add the comment and update the count atomically
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw "Document does not exist!";
        }

        // Add the new comment
        const newCommentRef = doc(collection(db, "comments"));
        transaction.set(newCommentRef, {
          boardPath: `${category}/${subCategory}/${board}`,
          postId: postId,
          content: newComment,
          authorId: user.uid,
          authorName: user.displayName || "Anonymous",
          authorPhotoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          likes: [],
          dislikes: [],
          parentId: null,
        });

        // Increment the comment count on the post
        transaction.update(postRef, { commentCount: increment(1) });
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 max-w-4xl mx-auto">Loading post...</div>;
  }

  if (!post) {
    return notFound();
  }

  const isLiked = user && post.likes?.includes(user.uid);
  const isDisliked = user && post.dislikes?.includes(user.uid);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Navigation Path */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Post Content */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-4">
          By {post.authorName} on{" "}
          {post.createdAt?.toDate().toLocaleDateString()}
        </div>

        <div className="prose max-w-none whitespace-pre-wrap mb-4 text-2xl font-bold text-gray-900 leading-relaxed">
          {post.content}
        </div>

        {/* Image Display */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Image size={20} className="mr-2" />
              Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {post.imageUrls.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Display */}
        {post.videoUrl && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Video size={20} className="mr-2" />
              Video
            </h3>
            <video
              src={post.videoUrl}
              controls
              className="w-full max-w-2xl rounded-lg shadow-md"
            />
          </div>
        )}

        {/* File Attachments */}
        {post.attachmentUrls && post.attachmentUrls.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <File size={20} className="mr-2" />
              Attachments
            </h3>
            <div className="space-y-2">
              {post.attachmentUrls.map((attachmentUrl, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium">
                    Attachment {index + 1}
                  </span>
                  <a
                    href={attachmentUrl}
                    download
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Download size={16} className="mr-1" />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Like/Dislike Buttons */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={handlePostLike}
            className={`flex items-center space-x-1 px-3 py-1 rounded ${
              isLiked
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ThumbsUp size={16} />
            <span>{post.likes?.length || 0}</span>
          </button>
          <button
            onClick={handlePostDislike}
            className={`flex items-center space-x-1 px-3 py-1 rounded ${
              isDisliked
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ThumbsDown size={16} />
            <span>{post.dislikes?.length || 0}</span>
          </button>
        </div>
      </div>

      {/* Advertisement */}
      <AdBanner type="horizontal" className="mb-6" />

      {/* Comment Form */}
      {user && (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Enter your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Comments</h2>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
