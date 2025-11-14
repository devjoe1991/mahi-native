import { PostData } from '../screens/userProfileScreen/types';

/**
 * Generate mock posts for a 21-day streak
 * Creates posts for each day of the current streak to show on calendar
 */
const generateStreakPosts = (): PostData[] => {
  const posts: PostData[] = [];
  const today = new Date();
  today.setHours(12, 0, 0, 0); // Set to noon for consistency
  
  // Generate posts for the last 21 days (current streak)
  for (let i = 0; i < 21; i++) {
    const postDate = new Date(today);
    postDate.setDate(postDate.getDate() - i);
    
    posts.push({
      _id: `streak-${i + 1}`,
      userId: '1',
      imageUrl: require('../assets/Jogger.jpg'),
      caption: i === 0 
        ? 'Beautiful autumn run in the park! 🍂🏃‍♂️' 
        : `Day ${21 - i} of my streak! 💪`,
      likes: Math.floor(Math.random() * 200) + 50,
      comments: Math.floor(Math.random() * 30) + 5,
      createdAt: postDate.toISOString(),
    });
  }
  
  // Add some older posts (not in current streak) to show past activity
  for (let i = 21; i < 30; i++) {
    const postDate = new Date(today);
    postDate.setDate(postDate.getDate() - i);
    
    posts.push({
      _id: `past-${i + 1}`,
      userId: '1',
      imageUrl: 'https://via.placeholder.com/400x400?text=Post+' + (i + 1),
      caption: `Past workout from ${postDate.toLocaleDateString()}`,
      likes: Math.floor(Math.random() * 150) + 30,
      comments: Math.floor(Math.random() * 20) + 2,
      createdAt: postDate.toISOString(),
    });
  }
  
  return posts;
};

/**
 * Mock posts data for development
 * This will be replaced with Supabase data fetching
 */
export const MOCK_POSTS: PostData[] = generateStreakPosts();

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

