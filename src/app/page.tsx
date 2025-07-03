"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getLatestPosts, LatestPost } from "@/utils/posts";
import AdBanner from "@/components/ads/AdBanner";
import {
  Calendar,
  User,
  ArrowRight,
  Heart,
  MessageCircle,
  Star,
  Sparkles,
} from "lucide-react";

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
  category = "",
}: {
  post: LatestPost;
  title: string;
  showImage?: boolean;
  className?: string;
  category?: string;
}) => {
  if (!post) return null;

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "k-blogs":
        return "from-pink-400 to-purple-500";
      case "k-info":
        return "from-blue-400 to-cyan-500";
      case "k-culture":
        return "from-green-400 to-teal-500";
      case "k-enter":
        return "from-orange-400 to-red-500";
      case "k-promo":
        return "from-yellow-400 to-orange-500";
      case "k-actor":
        return "from-purple-400 to-pink-500";
      case "k-pop":
        return "from-pink-400 to-rose-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  return (
    <Link
      href={getBoardPathFromPost(post)}
      className={`group block relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-pink-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${className}`}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {showImage && post.imageUrl && (
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(
                  category
                )}`}
              >
                {title}
              </span>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar size={12} />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {truncateText(post.content, 120)}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <User size={12} />
                <span className="font-medium">{post.authorName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-xs text-pink-500">
                  <Heart size={12} />
                  <span>12</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-blue-500">
                  <MessageCircle size={12} />
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>
          <ArrowRight
            size={20}
            className="text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-12 bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl mb-8"></div>
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Sparkles size={32} className="text-pink-500 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Welcome to K-YAYO
          </h1>
          <Sparkles size={32} className="text-purple-500 animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the latest in K-Culture, K-Pop, and everything Korean! Join
          our vibrant community of fans worldwide.
        </p>
      </div>

      {/* K-Blogs Section */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full"></div>
          <h2 className="text-3xl font-bold text-gray-800">K-Blogs</h2>
          <Star size={24} className="text-yellow-500" />
        </div>

        {/* Mobile: 1개씩, Tablet: 2개씩, PC: 4개씩 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {latestPosts?.kBlogs.news[0] && (
            <LatestPostCard
              post={latestPosts.kBlogs.news[0]}
              title="News"
              showImage={true}
              category="K-Blogs"
            />
          )}
          {latestPosts?.kBlogs.event[0] && (
            <LatestPostCard
              post={latestPosts.kBlogs.event[0]}
              title="Event"
              showImage={true}
              category="K-Blogs"
            />
          )}
          {latestPosts?.kBlogs.politic[0] && (
            <LatestPostCard
              post={latestPosts.kBlogs.politic[0]}
              title="Politic"
              showImage={true}
              category="K-Blogs"
            />
          )}
          {latestPosts?.kBlogs.freeBoard[0] && (
            <LatestPostCard
              post={latestPosts.kBlogs.freeBoard[0]}
              title="Free Board"
              category="K-Blogs"
            />
          )}
        </div>

        {/* 광고 */}
        <AdBanner type="horizontal" className="mb-8" />
      </section>

      {/* Boards Section */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full"></div>
          <h2 className="text-3xl font-bold text-gray-800">Boards</h2>
          <Heart size={24} className="text-pink-500" />
        </div>

        {/* Mobile: 1개씩, Tablet: 2개씩, PC: 3개씩 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts?.boards.kInfo[0] && (
            <LatestPostCard
              post={latestPosts.boards.kInfo[0]}
              title="K-Info"
              category="K-Info"
            />
          )}
          {latestPosts?.boards.kCulture[0] && (
            <LatestPostCard
              post={latestPosts.boards.kCulture[0]}
              title="K-Culture"
              category="K-Culture"
            />
          )}
          {latestPosts?.boards.kEnter[0] && (
            <LatestPostCard
              post={latestPosts.boards.kEnter[0]}
              title="K-Enter"
              category="K-Enter"
            />
          )}
          {latestPosts?.boards.kPromo[0] && (
            <LatestPostCard
              post={latestPosts.boards.kPromo[0]}
              title="K-Promo"
              category="K-Promo"
            />
          )}
          {latestPosts?.boards.kActor[0] && (
            <LatestPostCard
              post={latestPosts.boards.kActor[0]}
              title="K-ACTOR"
              category="K-ACTOR"
            />
          )}
          {latestPosts?.boards.kPop[0] && (
            <LatestPostCard
              post={latestPosts.boards.kPop[0]}
              title="K-POP"
              category="K-POP"
            />
          )}
        </div>
      </section>
    </div>
  );
}
