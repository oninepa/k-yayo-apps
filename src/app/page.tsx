"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getLatestPosts, LatestPost } from "@/utils/posts";
import AdBanner from "@/components/ads/AdBanner";
import { Calendar, User, ArrowRight } from "lucide-react";

interface LatestPostsData {
  kBlogs: {
    news: LatestPost[];
    event: LatestPost[];
    politic: LatestPost[];
    freeBoard: LatestPost[];
  };
  boards: {
    kInfo: LatestPost[];
    kCulture: LatestPost[];
    kEnter: LatestPost[];
    kPromo: LatestPost[];
    kActor: LatestPost[];
    kPop: LatestPost[];
  };
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString();
};

const getBoardPathFromPost = (post: LatestPost) => {
  const pathParts = post.boardPath.split("/");
  if (pathParts[0] === "k-blogs") {
    return `/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}/${post.id}`;
  } else {
    return `/${pathParts[0]}/${pathParts[1]}/${pathParts[2]}/${post.id}`;
  }
};

const LatestPostCard = ({
  post,
  title,
  showImage = false,
  className = "",
}: {
  post: LatestPost;
  title: string;
  showImage?: boolean;
  className?: string;
}) => {
  if (!post) return null;

  return (
    <Link
      href={getBoardPathFromPost(post)}
      className={`block p-4 border rounded-lg hover:bg-gray-50 transition-colors ${className}`}
    >
      <div className="flex items-start space-x-3">
        {showImage && post.imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-16 h-16 object-cover rounded-md"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
            <span className="font-semibold text-blue-600">{title}</span>
            <span>•</span>
            <span className="flex items-center">
              <Calendar size={12} className="mr-1" />
              {formatDate(post.createdAt)}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <User size={12} className="mr-1" />
              {post.authorName}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {truncateText(post.content, 120)}
          </p>
        </div>
        <ArrowRight size={16} className="text-gray-400 flex-shrink-0" />
      </div>
    </Link>
  );
};

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<LatestPostsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const posts = await getLatestPosts();
        setLatestPosts(posts);
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">K-YAYO</h1>

      {/* K-Blogs Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">K-Blogs</h2>

        {/* Mobile: 1개씩, Tablet: 2개씩, PC: 4개씩 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {latestPosts?.kBlogs.news[0] && (
            <LatestPostCard
              post={latestPosts.kBlogs.news[0]}
              title="News"
              showImage={true}
            />
          )}
          {latestPosts?.kBlogs.event[0] && (
            <LatestPostCard
              post={latestPosts.kBlogs.event[0]}
              title="Event"
              showImage={true}
            />
          )}
          {latestPosts?.kBlogs.politic[0] && (
            <LatestPostCard
              post={latestPosts.kBlogs.politic[0]}
              title="Politic"
              showImage={true}
            />
          )}
          {latestPosts?.kBlogs.freeBoard[0] && (
            <LatestPostCard
              post={latestPosts.kBlogs.freeBoard[0]}
              title="Free Board"
            />
          )}
        </div>

        {/* 광고 */}
        <AdBanner type="horizontal" className="mb-6" />
      </section>

      {/* Boards Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-green-600">Boards</h2>

        {/* Mobile: 1개씩, Tablet: 2개씩, PC: 3개씩 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestPosts?.boards.kInfo[0] && (
            <LatestPostCard post={latestPosts.boards.kInfo[0]} title="K-Info" />
          )}
          {latestPosts?.boards.kCulture[0] && (
            <LatestPostCard
              post={latestPosts.boards.kCulture[0]}
              title="K-Culture"
            />
          )}
          {latestPosts?.boards.kEnter[0] && (
            <LatestPostCard
              post={latestPosts.boards.kEnter[0]}
              title="K-Enter"
            />
          )}
          {latestPosts?.boards.kPromo[0] && (
            <LatestPostCard
              post={latestPosts.boards.kPromo[0]}
              title="K-Promo"
            />
          )}
          {latestPosts?.boards.kActor[0] && (
            <LatestPostCard
              post={latestPosts.boards.kActor[0]}
              title="K-ACTOR"
            />
          )}
          {latestPosts?.boards.kPop[0] && (
            <LatestPostCard post={latestPosts.boards.kPop[0]} title="K-POP" />
          )}
        </div>
      </section>
    </div>
  );
}
