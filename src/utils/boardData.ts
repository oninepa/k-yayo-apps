// 게시판 데이터를 동적으로 불러오는 유틸리티 함수

export interface BoardData {
  name: string;
  path: string;
  boards: string[];
}

export interface NavigationData {
  name: string;
  path: string;
  channels: BoardData[];
}

// 실제 게시판 데이터 구조 (public/data 폴더 기반)
export const getNavigationData = (): NavigationData[] => [
  {
    name: "K-Info",
    path: "k-info",
    channels: [
      { name: "History", path: "history", boards: [] },
      { name: "Region", path: "region", boards: [] },
      { name: "Tourism", path: "tourism", boards: [] },
      { name: "Language", path: "language", boards: [] },
      { name: "University", path: "university", boards: [] },
      { name: "Architecture", path: "architecture", boards: [] },
      { name: "International", path: "international", boards: [] },
    ],
  },
  {
    name: "K-Culture",
    path: "k-culture",
    channels: [
      { name: "Cuisine", path: "cuisine", boards: [] },
      { name: "Foods", path: "foods", boards: [] },
      { name: "Region", path: "region", boards: [] },
      { name: "Tourism", path: "tourism", boards: [] },
      { name: "Sports", path: "sports", boards: [] },
      { name: "Music", path: "music", boards: [] },
    ],
  },
  {
    name: "K-Enter",
    path: "k-enter",
    channels: [
      { name: "Movie", path: "movie", boards: [] },
      { name: "Drama", path: "drama", boards: [] },
      { name: "Webtoon", path: "webtoon", boards: [] },
      { name: "Animation", path: "animation", boards: [] },
      { name: "Youtuber", path: "youtuber", boards: [] },
      { name: "Game", path: "game", boards: [] },
    ],
  },
  {
    name: "K-Promo",
    path: "k-promo",
    channels: [
      { name: "Company", path: "company", boards: [] },
      { name: "Doctor", path: "doctor", boards: [] },
      { name: "Shopping", path: "shopping", boards: [] },
    ],
  },
  {
    name: "K-ACTOR",
    path: "k-actor",
    channels: [
      { name: "Man", path: "man", boards: [] },
      { name: "Woman", path: "woman", boards: [] },
    ],
  },
  {
    name: "K-POP",
    path: "k-pop",
    channels: [
      { name: "Idole man", path: "idole-man", boards: [] },
      { name: "Idole woman", path: "idole-woman", boards: [] },
    ],
  },
  {
    name: "K-Blogs",
    path: "k-blogs",
    channels: [
      { name: "News", path: "news", boards: [] },
      { name: "Politic", path: "politic", boards: [] },
      { name: "Event", path: "event", boards: [] },
      { name: "Free Board", path: "free-board", boards: [] },
    ],
  },
];

// 실제 데이터 파일에서 게시판 목록을 동적으로 불러오는 함수
export const loadBoardList = async (
  navigation: string,
  channel: string
): Promise<string[]> => {
  try {
    console.log(`Loading board list for ${navigation}/${channel}`);
    const response = await fetch(`/data/${navigation}/${channel}.txt`);
    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      console.warn(
        `Failed to load board list for ${navigation}/${channel}: ${response.status}`
      );
      return [];
    }

    const text = await response.text();
    console.log(`Loaded text: ${text.substring(0, 200)}...`);

    const lines = text.split("\n").filter((line) => line.trim() !== "");
    console.log(`Found ${lines.length} lines`);

    // 영어(한국어) 형식에서 영어 부분만 추출하여 게시판 이름으로 사용
    const boards = lines.map((line) => {
      const match = line.match(/^([^(]+)/);
      const boardName = match
        ? match[1].trim().toLowerCase().replace(/\s+/g, "-")
        : line.trim().toLowerCase().replace(/\s+/g, "-");
      console.log(`Processing line: "${line}" -> "${boardName}"`);
      return boardName;
    });

    console.log(`Final boards: ${boards.slice(0, 5).join(", ")}...`);
    return boards;
  } catch (error) {
    console.error(
      `Error loading board list for ${navigation}/${channel}:`,
      error
    );
    return [];
  }
};

// 선택된 경로에 따른 관리 영역 생성
export const getManagedArea = (
  navigation: string,
  channel?: string,
  board?: string
): string => {
  if (!navigation) return "";

  if (board && channel) {
    return `${navigation}/${channel}/${board}`;
  }

  if (channel) {
    return `${navigation}/${channel}`;
  }

  return navigation;
};

// 관리 영역에서 네비게이션, 채널, 게시판 정보 추출
export const parseManagedArea = (
  managedArea: string
): {
  navigation: string;
  channel?: string;
  board?: string;
} => {
  const parts = managedArea.split("/");

  if (parts.length === 1) {
    return { navigation: parts[0] };
  }

  if (parts.length === 2) {
    return { navigation: parts[0], channel: parts[1] };
  }

  if (parts.length === 3) {
    return { navigation: parts[0], channel: parts[1], board: parts[2] };
  }

  return { navigation: "" };
};

// 관리 영역의 표시 이름 생성
export const getManagedAreaDisplayName = (
  managedArea: string,
  navigationData: NavigationData[]
): string => {
  const { navigation, channel, board } = parseManagedArea(managedArea);

  const navData = navigationData.find((nav) => nav.path === navigation);
  if (!navData) return managedArea;

  if (!channel) {
    return navData.name;
  }

  const channelData = navData.channels.find((ch) => ch.path === channel);
  if (!channelData) return managedArea;

  if (!board) {
    return `${navData.name} > ${channelData.name}`;
  }

  return `${navData.name} > ${channelData.name} > ${board}`;
};
