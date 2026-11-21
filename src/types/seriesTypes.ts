import type { User } from "./authTypes";

export interface SeriesItem {
  _id: string;
  slug: string;
  author: User;
  title: string;
  category: string;
  createdAt: string;
  description: string;
  status: "ongoing" | "completed" | "archived";
}
