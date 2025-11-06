// User Profile Types
export interface UserData {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  bio?: string;
  occupation?: string;
  picturePath?: string | number; // Can be URI string or require() asset number
  posts?: number;
  followers?: number;
  followings?: number;
  streak_days?: number; // Current streak count - Ready for Supabase integration
  streak_level?: number; // Current streak level - Ready for Supabase integration
}

export interface PostData {
  _id: string;
  userId: string;
  imageUrl: string | number; // Can be URI string or require() asset number
  caption?: string;
  likes?: number;
  comments?: number;
  createdAt: string;
}

export interface UserProfileScreenProps {
  viewMode?: boolean; // If true, viewing another user's profile
  userId?: string; // User ID if viewing another user
  onNavigate?: (screen: string, params?: any) => void;
}

export interface EditProfileScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  onSave?: (userData: Partial<UserData>) => void;
}

