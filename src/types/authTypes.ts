export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  role: "user" | "author" | "admin";
  website?: string;
  profile_img?: {
    url: string;
    public_id: string;
  };
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  token?: string;
  isVerified?: boolean;
  followersCount?: number;
  followingCount?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface AuthPageProps {
  initialMode?: "login" | "register";
}
