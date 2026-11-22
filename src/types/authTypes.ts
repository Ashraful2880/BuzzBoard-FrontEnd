export interface User {
  _id: string;
  name: string;
  bio?: string;
  email: string;
  token?: string;
  website?: string;
  isVerified?: boolean;
  followersCount?: number;
  followingCount?: number;
  role: "user" | "author" | "admin";
  profile_img?: {
    url: string;
    public_id: string;
  };
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface AuthPageProps {
  initialMode?: "login" | "register";
}
