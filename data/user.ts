import { UserData } from '../screens/userProfileScreen/types';

/**
 * Mock user data for development
 * This will be replaced with Supabase data fetching
 */
export const MOCK_USER_DATA: UserData = {
  _id: '1',
  fullName: 'Joe John',
  username: 'joe',
  email: 'joe@example.com',
  bio: 'Fitness enthusiast | Daily streaks | Living my best life',
  occupation: 'Software Developer',
  picturePath: require('../assets/Jogger.jpg'), // Joe John's profile picture
  posts: 255,
  followers: 14600,
  followings: 378,
  streak_days: 1, // Current streak - Ready for Supabase: SELECT streak_days FROM profiles WHERE id = userId
  streak_level: 1, // Current level - Ready for Supabase: SELECT streak_level FROM profiles WHERE id = userId
};

/**
 * Mock users for testing other profiles
 */
export const MOCK_USERS: UserData[] = [
  MOCK_USER_DATA,
  {
    _id: '2',
    fullName: 'Sarah Smith',
    username: 'sarah',
    email: 'sarah@example.com',
    bio: 'Yoga instructor | Mindfulness advocate',
    occupation: 'Yoga Instructor',
    picturePath: undefined,
    posts: 189,
    followers: 8900,
    followings: 245,
  },
  {
    _id: '3',
    fullName: 'Mike Johnson',
    username: 'mike',
    email: 'mike@example.com',
    bio: 'Marathon runner | Fitness coach',
    occupation: 'Personal Trainer',
    picturePath: undefined,
    posts: 312,
    followers: 15200,
    followings: 456,
  },
];

/**
 * Get user by ID (mock function)
 * In real app, this would query Supabase
 */
export const getUserById = async (userId: string): Promise<UserData | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const user = MOCK_USERS.find((u) => u._id === userId);
  return user || null;
};

/**
 * Get current user (mock function)
 * In real app, this would get from Supabase Auth
 */
export const getCurrentUser = async (): Promise<UserData | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_USER_DATA;
};

