import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export interface LatestPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: Timestamp;
  boardPath: string;
  imageUrl?: string;
  videoUrl?: string;
  attachments?: string[];
}

export const getLatestPosts = async (): Promise<{
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
}> => {
  const postsRef = collection(db, "posts");

  // K-Blogs 최신글 가져오기
  const kBlogsQueries = {
    news: query(
      postsRef,
      where("boardPath", ">=", "k-blogs/news"),
      where("boardPath", "<", "k-blogs/news\uf8ff"),
      orderBy("boardPath"),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
    event: query(
      postsRef,
      where("boardPath", ">=", "k-blogs/event"),
      where("boardPath", "<", "k-blogs/event\uf8ff"),
      orderBy("boardPath"),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
    politic: query(
      postsRef,
      where("boardPath", ">=", "k-blogs/politic"),
      where("boardPath", "<", "k-blogs/politic\uf8ff"),
      orderBy("boardPath"),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
    freeBoard: query(
      postsRef,
      where("boardPath", ">=", "k-blogs/free-board"),
      where("boardPath", "<", "k-blogs/free-board\uf8ff"),
      orderBy("boardPath"),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
  };

  // 게시판 최신글 가져오기
  const boardsQueries = {
    kInfo: query(
      postsRef,
      where("boardPath", ">=", "k-info"),
      where("boardPath", "<", "k-info\uf8ff"),
      orderBy("boardPath"),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
    kCulture: query(
      postsRef,
      where("boardPath", ">=", "k-culture"),
      where("boardPath", "<", "k-culture\uf8ff"),
      orderBy("boardPath"),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
    kEnter: query(
      postsRef,
      where("boardPath", ">=", "k-enter"),
      where("boardPath", "<", "k-enter\uf8ff"),
      orderBy("boardPath"),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
    kPromo: query(
      postsRef,
      where("boardPath", ">=", "k-promo"),
      where("boardPath", "<", "k-promo\uf8ff"),
      orderBy("boardPath"),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
    kActor: query(
      postsRef,
      where("boardPath", ">=", "k-actor"),
      where("boardPath", "<", "k-actor\uf8ff"),
      orderBy("boardPath"),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
    kPop: query(
      postsRef,
      where("boardPath", ">=", "k-pop"),
      where("boardPath", "<", "k-pop\uf8ff"),
      orderBy("boardPath"),
      orderBy("createdAt", "desc"),
      limit(1)
    ),
  };

  try {
    // K-Blogs 데이터 가져오기
    const kBlogsData = {
      news: (await getDocs(kBlogsQueries.news)).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LatestPost)
      ),
      event: (await getDocs(kBlogsQueries.event)).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LatestPost)
      ),
      politic: (await getDocs(kBlogsQueries.politic)).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LatestPost)
      ),
      freeBoard: (await getDocs(kBlogsQueries.freeBoard)).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LatestPost)
      ),
    };

    // 게시판 데이터 가져오기
    const boardsData = {
      kInfo: (await getDocs(boardsQueries.kInfo)).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LatestPost)
      ),
      kCulture: (await getDocs(boardsQueries.kCulture)).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LatestPost)
      ),
      kEnter: (await getDocs(boardsQueries.kEnter)).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LatestPost)
      ),
      kPromo: (await getDocs(boardsQueries.kPromo)).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LatestPost)
      ),
      kActor: (await getDocs(boardsQueries.kActor)).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LatestPost)
      ),
      kPop: (await getDocs(boardsQueries.kPop)).docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as LatestPost)
      ),
    };

    return {
      kBlogs: kBlogsData,
      boards: boardsData,
    };
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return {
      kBlogs: { news: [], event: [], politic: [], freeBoard: [] },
      boards: {
        kInfo: [],
        kCulture: [],
        kEnter: [],
        kPromo: [],
        kActor: [],
        kPop: [],
      },
    };
  }
};
