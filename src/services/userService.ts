import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  runTransaction,
  increment,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  User,
  PointTransaction,
  UserRole,
  POINT_RULES,
  getUserLevel,
} from "@/types/auth";

export class UserService {
  // 사용자 생성 또는 업데이트
  static async createOrUpdateUser(
    uid: string,
    userData: Partial<User>
  ): Promise<void> {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // 기존 사용자 업데이트
      await updateDoc(userRef, {
        ...userData,
        lastLoginAt: serverTimestamp(),
      });
    } else {
      // 새 사용자 생성
      const newUser: User = {
        uid,
        email: userData.email || "",
        nickname: userData.nickname || "Anonymous",
        nicknameEdited: false,
        points: 0,
        role: "MEMBER",
        isHonoraryMember: false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        nicknameChangeCount: 0,
        ...userData,
      };
      await setDoc(userRef, newUser);
    }
  }

  // 사용자 정보 가져오기
  static async getUser(uid: string): Promise<User | null> {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
      } as User;
    }
    return null;
  }

  // 프로필 업데이트
  static async updateUserProfile(
    uid: string,
    profileData: Partial<User>
  ): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...profileData,
      lastUpdatedAt: serverTimestamp(),
    });
  }

  // 닉네임 변경
  static async changeNickname(
    uid: string,
    newNickname: string
  ): Promise<{ success: boolean; message: string }> {
    const userRef = doc(db, "users", uid);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User not found.");
        }

        const userData = userDoc.data() as User;

        // 첫 번째 변경은 무료
        if (userData.nicknameChangeCount === 0) {
          transaction.update(userRef, {
            nickname: newNickname,
            nicknameChangeCount: increment(1),
          });
        } else {
          // 두 번째부터는 포인트 필요
          if (userData.points < POINT_RULES.NICKNAME_CHANGE_COST) {
            throw new Error(
              `Insufficient points. ${POINT_RULES.NICKNAME_CHANGE_COST} points required.`
            );
          }

          // 포인트 차감 및 닉네임 변경
          transaction.update(userRef, {
            nickname: newNickname,
            nicknameChangeCount: increment(1),
            points: increment(-POINT_RULES.NICKNAME_CHANGE_COST),
          });

          // 포인트 거래 기록
          const transactionRef = doc(collection(db, "pointTransactions"));
          transaction.set(transactionRef, {
            userId: uid,
            type: "spend",
            amount: POINT_RULES.NICKNAME_CHANGE_COST,
            reason: "purchase",
            description: "Nickname change",
            createdAt: serverTimestamp(),
          });
        }
      });

      return { success: true, message: "Nickname changed successfully." };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to change nickname.",
      };
    }
  }

  // 포인트 적립
  static async addPoints(
    userId: string,
    amount: number,
    reason: PointTransaction["reason"],
    postId?: string,
    commentId?: string
  ): Promise<void> {
    const userRef = doc(db, "users", userId);

    await runTransaction(db, async (transaction) => {
      // 사용자 포인트 업데이트
      transaction.update(userRef, {
        points: increment(amount),
      });

      // 포인트 거래 기록
      const transactionRef = doc(collection(db, "pointTransactions"));
      transaction.set(transactionRef, {
        userId,
        type: "earn",
        amount,
        reason,
        postId,
        commentId,
        createdAt: serverTimestamp(),
      });
    });
  }

  // 관리자가 포인트 지급/차감
  static async adminModifyPoints(
    adminId: string,
    userId: string,
    amount: number,
    description: string
  ): Promise<void> {
    const userRef = doc(db, "users", userId);

    await runTransaction(db, async (transaction) => {
      // 사용자 포인트 업데이트
      transaction.update(userRef, {
        points: increment(amount),
      });

      // 포인트 거래 기록
      const transactionRef = doc(collection(db, "pointTransactions"));
      transaction.set(transactionRef, {
        userId,
        type: amount > 0 ? "earn" : "spend",
        amount: Math.abs(amount),
        reason: amount > 0 ? "admin_grant" : "admin_deduct",
        adminId,
        description,
        createdAt: serverTimestamp(),
      });
    });
  }

  // 사용자 권한 변경 (관리자용)
  static async changeUserRole(
    adminId: string,
    userId: string,
    newRole: UserRole,
    managedAreas?: string[]
  ): Promise<void> {
    console.log("UserService.changeUserRole called", {
      adminId,
      userId,
      newRole,
      managedAreas,
    });

    const userRef = doc(db, "users", userId);

    const updateData: any = { role: newRole };

    // 새로운 managedAreas 구조 사용
    if (managedAreas && managedAreas.length > 0) {
      updateData.managedAreas = managedAreas;
      console.log("Using provided managedAreas:", managedAreas);
    } else {
      // 권한별 기본 관리 영역 설정
      let defaultManagedAreas: string[] = [];

      switch (newRole) {
        case "BOARD_ADMIN":
          defaultManagedAreas = [
            "k-info/history/history",
            "k-culture/cuisine/cuisine",
            "k-enter/movie/movie",
          ];
          break;
        case "CHANNEL_ADMIN":
          defaultManagedAreas = [
            "k-info/history",
            "k-culture/cuisine",
            "k-enter/movie",
          ];
          break;
        case "NAVI_ADMIN":
          defaultManagedAreas = ["k-info", "k-culture", "k-enter"];
          break;
        case "ADMIN":
        case "OWNER":
        case "MEMBER":
        default:
          defaultManagedAreas = [];
          break;
      }

      updateData.managedAreas = defaultManagedAreas;
      console.log("Using default managedAreas:", defaultManagedAreas);
    }

    console.log("Final updateData:", updateData);

    try {
      await updateDoc(userRef, updateData);
      console.log("User role updated successfully");

      // 관리자 활동 로그 기록
      const logData: any = {
        adminId,
        action: "role_change",
        targetUserId: userId,
        oldRole: (await getDoc(userRef)).data()?.role,
        newRole,
        createdAt: serverTimestamp(),
      };

      // managedAreas가 있을 때만 로그에 추가
      if (managedAreas && managedAreas.length > 0) {
        logData.managedAreas = managedAreas;
      } else if (updateData.managedAreas.length > 0) {
        logData.managedAreas = updateData.managedAreas;
      }

      await addDoc(collection(db, "adminLogs"), logData);
      console.log("Admin log created successfully");
    } catch (error) {
      console.error("Error in changeUserRole:", error);
      throw error;
    }
  }

  // 자기 자신의 권한 변경 (임시용)
  static async changeOwnRole(userId: string, newRole: UserRole): Promise<void> {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: newRole });
  }

  // 감사멤버 지정/해제
  static async toggleHonoraryMember(
    adminId: string,
    userId: string,
    isHonorary: boolean
  ): Promise<void> {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, { isHonoraryMember: isHonorary });

    // 관리자 활동 로그 기록
    await addDoc(collection(db, "adminLogs"), {
      adminId,
      action: "honorary_toggle",
      targetUserId: userId,
      isHonorary,
      createdAt: serverTimestamp(),
    });
  }

  // 사용자 목록 가져오기 (관리자용)
  static async getUsers(limit: number = 50): Promise<User[]> {
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        } as User;
      })
      .slice(0, limit);
  }

  // 포인트 거래 내역 가져오기
  static async getPointTransactions(
    userId: string,
    limit: number = 20
  ): Promise<PointTransaction[]> {
    const transactionsRef = collection(db, "pointTransactions");
    const q = query(transactionsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as PointTransaction;
      })
      .slice(0, limit);
  }

  // 사용자 통계 가져오기
  static async getUserStats(): Promise<{
    totalUsers: number;
    totalPoints: number;
    averagePoints: number;
    levelDistribution: Record<string, number>;
  }> {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    const users = querySnapshot.docs.map((doc) => doc.data() as User);
    const totalUsers = users.length;
    const totalPoints = users.reduce((sum, user) => sum + user.points, 0);
    const averagePoints = totalUsers > 0 ? totalPoints / totalUsers : 0;

    // 등급별 분포 계산
    const levelDistribution: Record<string, number> = {};
    users.forEach((user) => {
      const level = getUserLevel(user.points, user.isHonoraryMember);
      levelDistribution[level.level] =
        (levelDistribution[level.level] || 0) + 1;
    });

    return {
      totalUsers,
      totalPoints,
      averagePoints,
      levelDistribution,
    };
  }
}

// 별도 함수로 export
export const updateUserProfile = UserService.updateUserProfile;
export const changeNickname = UserService.changeNickname;
