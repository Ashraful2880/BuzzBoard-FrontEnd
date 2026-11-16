import type { User } from "./authTypes";

export interface SeriesItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author: User;
  category: string;
  status: "ongoing" | "completed" | "archived";
  createdAt: string;
}
