"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { UserService } from "@/services/userService";
import { User } from "@/types/auth";

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    if (!user) return;

    try {
      const data = await UserService.getUser(user.uid);
      if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const createOrUpdateUser = async (authUser: FirebaseUser) => {
    try {
      // Create or update user data
      const userData = await UserService.getUser(authUser.uid);

      if (!userData) {
        // Load user data
        await UserService.createOrUpdateUser(authUser.uid, {
          email: authUser.email || "",
          nickname: authUser.displayName || "Anonymous",
        });
      }
    } catch (error) {
      console.error("Failed to process user data:", error);
    }
  };

  const loadUserData = async () => {
    if (user) {
      try {
        // 사용자 데이터 로드
        const userData = await UserService.getUser(user.uid);
        setUserData(userData);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // 사용자 데이터 생성 또는 업데이트
          await UserService.createOrUpdateUser(firebaseUser.uid, {
            email: firebaseUser.email || "",
            nickname: firebaseUser.displayName || "Anonymous",
          });

          // 사용자 데이터 로드
          await loadUserData();
        } catch (error) {
          console.error("사용자 데이터 처리 실패:", error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // 초기 로드
      loadUserData();

      // 실시간 업데이트를 위한 주기적 새로고침 (5분마다)
      const interval = setInterval(() => {
        refreshUserData();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const value = {
    user,
    userData,
    loading,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
