import { PostData } from '../screens/userProfileScreen/types';

/**
 * Mock posts data for development
 * This will be replaced with Supabase data fetching
 */
export const MOCK_POSTS: PostData[] = [
  {
    _id: '1',
    userId: '1', // Joe John's post
    imageUrl: require('../assets/Jogger.jpg'), // Joe John's jogger post
    caption: 'Beautiful autumn run in the park! 🍂🏃‍♂️',
    likes: 245,
    comments: 32,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    userId: '1',
    imageUrl: 'https://via.placeholder.com/400x400?text=Post+2',
    caption: 'Morning workout complete!',
    likes: 89,
    comments: 8,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    userId: '1',
    imageUrl: 'https://via.placeholder.com/400x400?text=Post+3',
    caption: 'Healthy meal prep Sunday',
    likes: 156,
    comments: 22,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '4',
    userId: '1',
    imageUrl: 'https://via.placeholder.com/400x400?text=Post+4',
    caption: 'New PR today! 🎉',
    likes: 203,
    comments: 31,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '5',
    userId: '1',
    imageUrl: 'https://via.placeholder.com/400x400?text=Post+5',
    caption: 'Rest day vibes',
    likes: 67,
    comments: 5,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6',
    userId: '1',
    imageUrl: 'https://via.placeholder.com/400x400?text=Post+6',
    caption: 'Weekend hike!',
    likes: 134,
    comments: 18,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Get posts by user ID (mock function)
 * In real app, this would query Supabase
 */
export const getPostsByUserId = async (userId: string): Promise<PostData[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return MOCK_POSTS.filter((post) => post.userId === userId);
};

/**
 * Get all posts for feed (mock function)
 * In real app, this would query Supabase
 */
export const getAllPosts = async (): Promise<PostData[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return MOCK_POSTS;
};

