import type { User } from "./authTypes";

export interface CommentItem {
  _id: string;
  post: string;
  author: User;
  content: string;
  parentComment?: string | null;
  likesCount: number;
  isEdited?: boolean;
  createdAt: string;
  replies?: CommentItem[];
}
