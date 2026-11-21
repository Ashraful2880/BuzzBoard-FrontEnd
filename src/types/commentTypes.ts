import type { User } from "./authTypes";

export interface CommentItem {
  _id: string;
  post: string;
  author: User;
  content: string;
  createdAt: string;
  likesCount: number;
  isEdited?: boolean;
  replies?: CommentItem[];
  parentComment?: string | null;
}
