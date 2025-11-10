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
  streak_days: 21, // Current streak - Ready for Supabase: SELECT streak_days FROM profiles WHERE id = userId (21 days = 3 milestone badges)
  streak_level: 7, // Current level - Ready for Supabase: SELECT streak_level FROM profiles WHERE id = userId
  longest_streak: 21, // Longest streak ever - For loss aversion warnings
  rest_days: [], // Rest days - Ready for Supabase: SELECT rest_days FROM profiles WHERE id = userId
};

/**
 * Mock users for testing other profiles
 */
export const MOCK_USERS: UserData[] = [
  MOCK_USER_DATA,
  {
    _id: '2',
    fullName: 'Maximus',
    username: 'maximus',
    email: 'maximus@example.com',
    bio: 'Yoga instructor | Mindfulness advocate',
    occupation: 'Yoga Instructor',
    picturePath: undefined,
    posts: 189,
    followers: 8900,
    followings: 245,
  },
  {
    _id: '3',
    fullName: 'Verity',
    username: 'verity',
    email: 'verity@example.com',
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

/**
 * Get all users for leaderboard
 */
export const getAllUsers = async (): Promise<UserData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  // Add some mock users with different streak values for leaderboard
  return [
    ...MOCK_USERS,
    {
      _id: '4',
      fullName: 'Alex Runner',
      username: 'alex',
      email: 'alex@example.com',
      bio: 'Daily runner',
      streak_days: 45,
      streak_level: 5,
      posts: 120,
      followers: 5000,
      followings: 200,
    },
    {
      _id: '5',
      fullName: 'Ellie',
      username: 'ellie',
      email: 'ellie@example.com',
      bio: 'Fitness coach',
      streak_days: 30,
      streak_level: 4,
      posts: 200,
      followers: 8000,
      followings: 300,
    },
  ];
};

/**
 * Mock follow relationships
 * In real app, this would be stored in Supabase follows table
 */
const MOCK_FOLLOWS: { followerId: string; followingId: string }[] = [
  // User 1 (current user) follows user 2
  { followerId: '1', followingId: '2' },
];

/**
 * Check if current user is following another user
 */
export const isFollowing = async (
  currentUserId: string,
  targetUserId: string
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_FOLLOWS.some(
    (f) => f.followerId === currentUserId && f.followingId === targetUserId
  );
};

/**
 * Follow a user
 */
export const followUser = async (
  currentUserId: string,
  targetUserId: string
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Check if already following
  const alreadyFollowing = MOCK_FOLLOWS.some(
    (f) => f.followerId === currentUserId && f.followingId === targetUserId
  );
  
  if (alreadyFollowing) {
    return false;
  }
  
  // Add follow relationship
  MOCK_FOLLOWS.push({ followerId: currentUserId, followingId: targetUserId });
  
  // Update follower count for target user
  const targetUser = MOCK_USERS.find((u) => u._id === targetUserId);
  if (targetUser) {
    targetUser.followers = (targetUser.followers || 0) + 1;
  }
  
  // Update following count for current user
  const currentUser = MOCK_USERS.find((u) => u._id === currentUserId);
  if (currentUser) {
    currentUser.followings = (currentUser.followings || 0) + 1;
  }
  
  return true;
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (
  currentUserId: string,
  targetUserId: string
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Find and remove follow relationship
  const index = MOCK_FOLLOWS.findIndex(
    (f) => f.followerId === currentUserId && f.followingId === targetUserId
  );
  
  if (index === -1) {
    return false;
  }
  
  MOCK_FOLLOWS.splice(index, 1);
  
  // Update follower count for target user
  const targetUser = MOCK_USERS.find((u) => u._id === targetUserId);
  if (targetUser && targetUser.followers && targetUser.followers > 0) {
    targetUser.followers = targetUser.followers - 1;
  }
  
  // Update following count for current user
  const currentUser = MOCK_USERS.find((u) => u._id === currentUserId);
  if (currentUser && currentUser.followings && currentUser.followings > 0) {
    currentUser.followings = currentUser.followings - 1;
  }
  
  return true;
};

