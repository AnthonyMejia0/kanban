export type UserType = {
  id: string;
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string | null | undefined;
    username?: string | null | undefined;
  };
} | null;

export type ProfileType = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
};
