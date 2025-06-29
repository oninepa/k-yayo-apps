export interface NavigationItem {
  name: string;
  path: string;
  type: "board" | "blog";
  subItems: string[];
}

export const navigationData: NavigationItem[] = [
  {
    name: "K-Info",
    path: "/k-info",
    type: "board",
    subItems: [
      "History",
      "Region",
      "Tourism",
      "Language",
      "University",
      "Architecture",
      "International",
    ],
  },
  {
    name: "K-Culture",
    path: "/k-culture",
    type: "board",
    subItems: ["Cuisine", "Foods", "Region", "Tourism", "Sports", "Music"],
  },
  {
    name: "K-Enter",
    path: "/k-enter",
    type: "board",
    subItems: ["Movie", "Drama", "Webtoon", "Animation", "Youtuber", "Game"],
  },
  {
    name: "K-Promo",
    path: "/k-promo",
    type: "board",
    subItems: ["Company", "Doctor", "Shopping"],
  },
  {
    name: "K-ACTOR",
    path: "/k-actor",
    type: "board",
    subItems: ["Man", "Woman"],
  },
  {
    name: "K-POP",
    path: "/k-pop",
    type: "board",
    subItems: ["Idole man", "Idole woman"],
  },
  {
    name: "K-Blogs",
    path: "/k-blogs",
    type: "blog",
    subItems: ["News", "Politic", "Event", "Free Board"],
  },
];
