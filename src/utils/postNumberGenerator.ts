import { navigationData } from "@/data/navigationData";

// 네비게이션 번호 매핑
const NAVIGATION_NUMBERS: Record<string, number> = {
  "k-info": 1,
  "k-culture": 2,
  "k-enter": 3,
  "k-promo": 4,
  "k-actor": 5,
  "k-pop": 6,
  "k-blogs": 7,
};

// 2차 하부리스트 번호 매핑 (public/data 폴더의 .txt 파일 순서)
const BOARD_NUMBERS: Record<string, Record<string, number>> = {
  "k-info": {
    history: 1,
    region: 2,
    tourism: 3,
    language: 4,
    university: 5,
    architecture: 6,
    international: 7,
  },
  "k-culture": {
    cuisine: 1,
    foods: 2,
    region: 3,
    tourism: 4,
    sports: 5,
    music: 6,
  },
  "k-enter": {
    movie: 1,
    drama: 2,
    webtoon: 3,
    animation: 4,
    youtuber: 5,
    game: 6,
  },
  "k-promo": {
    company: 1,
    doctor: 2,
    shopping: 3,
  },
  "k-actor": {
    man: 1,
    woman: 2,
  },
  "k-pop": {
    "idole-man": 1,
    "idole-woman": 2,
  },
  "k-blogs": {
    news: 1,
    politic: 2,
    event: 3,
    "free-board": 4,
  },
};

/**
 * 글 고유번호를 생성하는 함수
 * @param category 네비게이션 카테고리 (예: "k-pop")
 * @param subCategory 1차 하부리스트 (예: "idole-woman")
 * @param board 2차 하부리스트 (예: "blackpink")
 * @param postIndex 해당 게시판 내에서의 글 순서 (1부터 시작)
 * @returns 고유번호 문자열 (예: "6+02+001+1005")
 */
export const generatePostNumber = (
  category: string,
  subCategory: string,
  board: string,
  postIndex: number
): string => {
  // 1. 네비게이션 번호
  const navNumber = NAVIGATION_NUMBERS[category.toLowerCase()] || 0;

  // 2. 1차 하부리스트 번호 (navigationData에서 찾기)
  const navItem = navigationData.find(
    (item) => item.path.replace("/", "") === category.toLowerCase()
  );

  if (!navItem) {
    throw new Error(`Navigation item not found for category: ${category}`);
  }

  const subCategoryIndex = navItem.subItems.findIndex(
    (item) =>
      item.toLowerCase().replace(/\s+/g, "-") === subCategory.toLowerCase()
  );

  if (subCategoryIndex === -1) {
    throw new Error(`Sub-category not found: ${subCategory}`);
  }

  const subCategoryNumber = String(subCategoryIndex + 1).padStart(2, "0");

  // 3. 2차 하부리스트 번호 (BOARD_NUMBERS에서 찾기)
  const boardNumbers = BOARD_NUMBERS[category.toLowerCase()];
  if (!boardNumbers) {
    throw new Error(`Board numbers not found for category: ${category}`);
  }

  const boardNumber = boardNumbers[board.toLowerCase()];
  let boardNumberStr: string;
  if (!boardNumber) {
    // 만약 매핑에 없는 경우, 임시로 001 사용
    console.warn(`Board number not found for: ${board}, using 001 as fallback`);
    boardNumberStr = "001";
  } else {
    boardNumberStr = String(boardNumber).padStart(3, "0");
  }

  // 4. 글 번호
  const postNumber = String(postIndex).padStart(1, "0");

  return `${navNumber}${subCategoryNumber}${boardNumberStr}${postNumber}`;
};

/**
 * 카테고리별 번호를 가져오는 함수
 */
export const getNavigationNumber = (category: string): number => {
  return NAVIGATION_NUMBERS[category.toLowerCase()] || 0;
};

/**
 * 1차 하부리스트 번호를 가져오는 함수
 */
export const getSubCategoryNumber = (
  category: string,
  subCategory: string
): string => {
  const navItem = navigationData.find(
    (item) => item.path.replace("/", "") === category.toLowerCase()
  );

  if (!navItem) {
    return "00";
  }

  const subCategoryIndex = navItem.subItems.findIndex(
    (item) =>
      item.toLowerCase().replace(/\s+/g, "-") === subCategory.toLowerCase()
  );

  return String(subCategoryIndex + 1).padStart(2, "0");
};
