"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
  runTransaction,
  increment,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";

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

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const { user } = useAuth();
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  // Fetch replies for this comment
  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("parentId", "==", comment.id),
      orderBy("createdAt", "asc") // Show replies in chronological order
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const repliesData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Comment)
      );
      setReplies(repliesData);
    });

    return () => unsubscribe();
  }, [comment.id]);

  // 좋아요/싫어요 처리 함수
  const handleLike = async () => {
    if (!user) return;

    const commentRef = doc(db, "comments", comment.id);
    const userId = user.uid;

    try {
      await runTransaction(db, async (transaction) => {
        const commentDoc = await transaction.get(commentRef);
        if (!commentDoc.exists()) {
          throw "Comment does not exist!";
        }

        const currentLikes = commentDoc.data().likes || [];
        const currentDislikes = commentDoc.data().dislikes || [];

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

        transaction.update(commentRef, {
          likes: newLikes,
          dislikes: newDislikes,
        });
      });
    } catch (error) {
      console.error("Error updating like: ", error);
    }
  };

  const handleDislike = async () => {
    if (!user) return;

    const commentRef = doc(db, "comments", comment.id);
    const userId = user.uid;

    try {
      await runTransaction(db, async (transaction) => {
        const commentDoc = await transaction.get(commentRef);
        if (!commentDoc.exists()) {
          throw "Comment does not exist!";
        }

        const currentLikes = commentDoc.data().likes || [];
        const currentDislikes = commentDoc.data().dislikes || [];

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

        transaction.update(commentRef, {
          likes: newLikes,
          dislikes: newDislikes,
        });
      });
    } catch (error) {
      console.error("Error updating dislike: ", error);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      const postRef = doc(db, "posts", comment.postId);

      // Run a transaction to add the reply and update the count
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw "Post does not exist!";
        }

        const newReplyRef = doc(collection(db, "comments"));
        transaction.set(newReplyRef, {
          boardPath: comment.boardPath,
          postId: comment.postId,
          content: replyContent,
          authorId: user.uid,
          authorName: user.displayName || "Anonymous",
          authorPhotoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          likes: [],
          dislikes: [],
          parentId: comment.id, // Set the parent ID to the current comment's ID
        });

        // Increment the comment count on the post
        transaction.update(postRef, { commentCount: increment(1) });
      });
      setReplyContent("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Error adding reply: ", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleUpdateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !user ||
      !editedContent.trim() ||
      editedContent.trim() === comment.content
    ) {
      setIsEditing(false);
      return;
    }

    try {
      const commentRef = doc(db, "comments", comment.id);
      await updateDoc(commentRef, { content: editedContent });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comment: ", error);
    }
  };

  const handleDeleteComment = async () => {
    if (!user) return;
    if (
      window.confirm(
        "Are you sure you want to delete this comment? This will also delete all replies."
      )
    ) {
      try {
        const postRef = doc(db, "posts", comment.postId);
        const commentRef = doc(db, "comments", comment.id);

        // Find all replies to this comment to calculate the decrement amount
        const repliesQuery = query(
          collection(db, "comments"),
          where("parentId", "==", comment.id)
        );
        const repliesSnapshot = await getDocs(repliesQuery);
        const numDeletions = 1 + repliesSnapshot.size;

        // Use a transaction to ensure atomicity
        await runTransaction(db, async (transaction) => {
          const postDoc = await transaction.get(postRef);
          if (!postDoc.exists()) {
            throw "Post does not exist!";
          }

          // Delete all replies
          repliesSnapshot.forEach((replyDoc) => {
            transaction.delete(replyDoc.ref);
          });

          // Delete the parent comment
          transaction.delete(commentRef);

          // Decrement the comment count
          transaction.update(postRef, {
            commentCount: increment(-numDeletions),
          });
        });
      } catch (error) {
        console.error("Error deleting comment: ", error);
      }
    }
  };

  const isLiked = user && comment.likes?.includes(user.uid);
  const isDisliked = user && comment.dislikes?.includes(user.uid);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {comment.authorPhotoURL ? (
            <img
              className="w-10 h-10 rounded-full"
              src={comment.authorPhotoURL}
              alt={comment.authorName}
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="font-semibold">{comment.authorName}</p>
            {user && user.uid === comment.authorId && !isEditing && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={handleDeleteComment}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <p className="text-gray-700 whitespace-pre-wrap mt-1">
              {comment.content}
            </p>
          ) : (
            <form onSubmit={handleUpdateComment} className="mt-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
              ></textarea>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center space-x-4 mt-2 text-gray-500">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 hover:text-blue-500 ${
                isLiked ? "text-blue-500" : ""
              }`}
            >
              <ThumbsUp size={16} /> <span>{comment.likes?.length || 0}</span>
            </button>
            <button
              onClick={handleDislike}
              className={`flex items-center space-x-1 hover:text-red-500 ${
                isDisliked ? "text-red-500" : ""
              }`}
            >
              <ThumbsDown size={16} />{" "}
              <span>{comment.dislikes?.length || 0}</span>
            </button>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center space-x-1 hover:text-gray-800"
            >
              <MessageSquare size={16} /> <span>Reply</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-4 ml-12">
          <textarea
            className="w-full p-2 border rounded-md"
            rows={2}
            placeholder={`Replying to ${comment.authorName}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            required
          ></textarea>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isSubmittingReply}
            >
              {isSubmittingReply ? "Posting..." : "Post Reply"}
            </button>
          </div>
        </form>
      )}

      {/* Replies (Recursive) */}
      {replies.length > 0 && (
        <div className="mt-4 ml-8 space-y-4 border-l-2 border-gray-200 pl-4">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
