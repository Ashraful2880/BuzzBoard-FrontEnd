export interface NotificationItem {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    name: string;
    profile_img?: { url: string };
  };
  type: "like" | "reaction" | "comment" | "reply" | "follow" | "system";
  post?: {
    _id: string;
    title: string;
    slug: string;
  } | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}
