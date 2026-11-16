export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "author" | "admin";
  bio?: string;
  website?: string;
  profile_img?: {
    url: string;
    public_id: string;
  };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  followersCount?: number;
  followingCount?: number;
  isVerified?: boolean;
  token?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthModalOpen: boolean;
}
