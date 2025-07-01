export type UserRole =
  | "OWNER"
  | "ADMIN"
  | "NAVI_ADMIN"
  | "CHANNEL_ADMIN"
  | "BOARD_ADMIN"
  | "MEMBER";

export interface User {
  uid: string;
  email: string;
  nickname: string;
  nicknameEdited: boolean;
  points: number;
  role: UserRole;
  managedAreas?: string[]; // 관리 영역 (예: "k-info/history/history", "k-culture/cuisine")
  isHonoraryMember: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  nicknameChangeCount: number;
  // 프로필 추가 정보
  address?: {
    country: string;
    city: string;
    postalCode: string;
  };
  phone?: string;
  birthDate?: string;
  gender?: string;
  lastUpdatedAt?: Date;
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: "earn" | "spend";
  amount: number;
  reason:
    | "post"
    | "comment"
    | "reply"
    | "like"
    | "dislike"
    | "purchase"
    | "admin_grant"
    | "admin_deduct";
  postId?: string;
  commentId?: string;
  adminId?: string;
  description?: string;
  createdAt: Date;
}

export interface UserLevel {
  level: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
  description: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPermissions {
  canWriteNews: boolean;
  canWritePolitic: boolean;
  canWriteEvent: boolean;
  canWriteFreeBoard: boolean;
  canEditOwnPosts: boolean;
  canDeleteOwnPosts: boolean;
  canEditAllPosts: boolean;
  canDeleteAllPosts: boolean;
}

export const getBlogPermissions = (role: UserRole): BlogPermissions => {
  switch (role) {
    case "OWNER":
    case "ADMIN":
      return {
        canWriteNews: true,
        canWritePolitic: true,
        canWriteEvent: true,
        canWriteFreeBoard: true,
        canEditOwnPosts: true,
        canDeleteOwnPosts: true,
        canEditAllPosts: true,
        canDeleteAllPosts: true,
      };
    case "NAVI_ADMIN":
    case "CHANNEL_ADMIN":
    case "BOARD_ADMIN":
      return {
        canWriteNews: false,
        canWritePolitic: false,
        canWriteEvent: false,
        canWriteFreeBoard: true,
        canEditOwnPosts: true,
        canDeleteOwnPosts: true,
        canEditAllPosts: false,
        canDeleteAllPosts: false,
      };
    case "MEMBER":
    default:
      return {
        canWriteNews: false,
        canWritePolitic: false,
        canWriteEvent: false,
        canWriteFreeBoard: true,
        canEditOwnPosts: true,
        canDeleteOwnPosts: true,
        canEditAllPosts: false,
        canDeleteAllPosts: false,
      };
  }
};

export const canWriteToBlog = (
  userRole: UserRole,
  subCategory: string
): boolean => {
  if (userRole === "OWNER" || userRole === "ADMIN") return true;
  if (subCategory === "free-board") return true;
  return false;
};

export const canManageUsers = (userRole: UserRole): boolean => {
  return ["OWNER", "ADMIN"].includes(userRole);
};

export const canManageContent = (userRole: UserRole): boolean => {
  return [
    "OWNER",
    "ADMIN",
    "NAVI_ADMIN",
    "CHANNEL_ADMIN",
    "BOARD_ADMIN",
  ].includes(userRole);
};

export const canAppointAdmins = (userRole: UserRole): boolean => {
  return ["OWNER", "ADMIN", "NAVI_ADMIN", "CHANNEL_ADMIN"].includes(userRole);
};

export const USER_LEVELS: UserLevel[] = [
  {
    level: "새싹멤버",
    minPoints: 0,
    maxPoints: 4.999,
    icon: "🌱",
    color: "#8B4513",
    description: "새로 시작한 멤버",
  },
  {
    level: "일반멤버",
    minPoints: 5,
    maxPoints: 29.999,
    icon: "👑",
    color: "#808080",
    description: "회색왕관 - 기본 멤버",
  },
  {
    level: "성실멤버",
    minPoints: 30,
    maxPoints: 59.999,
    icon: "👑",
    color: "#FFD700",
    description: "노란왕관 - 성실한 멤버",
  },
  {
    level: "열심멤버",
    minPoints: 60,
    maxPoints: 99.999,
    icon: "👑",
    color: "#C0C0C0",
    description: "실버왕관 - 열심히 활동하는 멤버",
  },
  {
    level: "우수멤버",
    minPoints: 100,
    maxPoints: 199.999,
    icon: "👑",
    color: "#FFD700",
    description: "골드왕관 - 우수한 멤버",
  },
  {
    level: "최고멤버",
    minPoints: 200,
    maxPoints: 499.999,
    icon: "👑",
    color: "#FFD700",
    description: "번쩍번쩍왕관 - 최고 등급 멤버",
  },
];

export const ADMIN_COLORS = {
  OWNER: "#FFD700", // 금색
  ADMIN: "#C0C0C0", // 은색
  NAVI_ADMIN: "#CD7F32", // 청동
  CHANNEL_ADMIN: "#008000", // 녹색
  BOARD_ADMIN: "#808080", // 회색
  MEMBER: "#6B7280", // 회색 (일반 멤버)
};

export const getUserLevel = (
  points: number,
  isHonorary: boolean = false
): UserLevel => {
  if (isHonorary) {
    return {
      level: "감사멤버",
      minPoints: 0,
      maxPoints: Infinity,
      icon: "🍃",
      color: "#228B22",
      description: "초록이파리 - 명예직 멤버",
    };
  }

  return (
    USER_LEVELS.find(
      (level) => points >= level.minPoints && points <= level.maxPoints
    ) || USER_LEVELS[0]
  );
};

export const POINT_RULES = {
  POST: {
    FIRST_10: 0.1,
    AFTER_10: 0.05,
  },
  COMMENT: {
    FIRST_10: 0.05,
    AFTER_10: 0.03,
  },
  REPLY: {
    FIRST_10: 0.02,
    AFTER_10: 0.01,
  },
  LIKE_THRESHOLD: 100,
  DISLIKE_THRESHOLD: 100,
  NICKNAME_CHANGE_COST: 10,
};
