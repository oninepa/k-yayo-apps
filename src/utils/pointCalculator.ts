import { UserService } from "@/services/userService";
import { POINT_RULES } from "@/types/auth";

export class PointCalculator {
  // 글 작성 포인트 계산
  static async calculatePostPoints(
    userId: string,
    postCount: number
  ): Promise<number> {
    if (postCount <= 10) {
      return POINT_RULES.POST.FIRST_10;
    } else {
      return POINT_RULES.POST.AFTER_10;
    }
  }

  // 댓글 작성 포인트 계산
  static async calculateCommentPoints(
    userId: string,
    commentCount: number
  ): Promise<number> {
    if (commentCount <= 10) {
      return POINT_RULES.COMMENT.FIRST_10;
    } else {
      return POINT_RULES.COMMENT.AFTER_10;
    }
  }

  // 대댓글 작성 포인트 계산
  static async calculateReplyPoints(
    userId: string,
    replyCount: number
  ): Promise<number> {
    if (replyCount <= 10) {
      return POINT_RULES.REPLY.FIRST_10;
    } else {
      return POINT_RULES.REPLY.AFTER_10;
    }
  }

  // 좋아요/싫어요 포인트 계산 (게시글 작성자에게)
  static async calculateReactionPoints(
    postAuthorId: string,
    likeCount: number,
    dislikeCount: number,
    postId: string
  ): Promise<{ likePoints: number; dislikePoints: number }> {
    let likePoints = 0;
    let dislikePoints = 0;

    // 좋아요 100개 이상 시 1점 지급 (1회만)
    if (likeCount >= POINT_RULES.LIKE_THRESHOLD) {
      // 이미 지급되었는지 확인 (실제로는 별도 테이블에서 관리)
      likePoints = 1;
    }

    // 싫어요 100개 이상 시 1점 차감 (1회만)
    if (dislikeCount >= POINT_RULES.DISLIKE_THRESHOLD) {
      dislikePoints = -1;
    }

    return { likePoints, dislikePoints };
  }

  // 사용자 활동 통계 가져오기
  static async getUserActivityCounts(userId: string): Promise<{
    postCount: number;
    commentCount: number;
    replyCount: number;
  }> {
    // Firestore에서 사용자의 활동 수를 가져오는 로직
    // 실제 구현에서는 posts, comments 컬렉션에서 쿼리
    return {
      postCount: 0, // 실제로는 쿼리 결과
      commentCount: 0, // 실제로는 쿼리 결과
      replyCount: 0, // 실제로는 쿼리 결과
    };
  }

  // 포인트 적립 처리
  static async awardPoints(
    userId: string,
    reason: "post" | "comment" | "reply" | "like" | "dislike",
    postId?: string,
    commentId?: string
  ): Promise<void> {
    let points = 0;

    switch (reason) {
      case "post":
        const postCount = 0; // 실제로는 사용자의 글 수를 가져와야 함
        points = await this.calculatePostPoints(userId, postCount);
        break;
      case "comment":
        const commentCount = 0; // 실제로는 사용자의 댓글 수를 가져와야 함
        points = await this.calculateCommentPoints(userId, commentCount);
        break;
      case "reply":
        const replyCount = 0; // 실제로는 사용자의 대댓글 수를 가져와야 함
        points = await this.calculateReplyPoints(userId, replyCount);
        break;
      case "like":
      case "dislike":
        // 좋아요/싫어요는 게시글 작성자에게만 포인트 지급
        return;
    }

    if (points > 0) {
      await UserService.addPoints(userId, points, reason, postId, commentId);
    }
  }

  // 일일 포인트 계산 배치 작업 (관리자가 수동 실행)
  static async calculateDailyPoints(): Promise<void> {
    // 모든 사용자에 대해 포인트를 계산하고 적립하는 배치 작업
    // 실제 구현에서는 Cloud Functions나 별도 서버에서 실행
    console.log("일일 포인트 계산 배치 작업 실행");
  }
}
