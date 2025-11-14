import { PostData } from '../screens/userProfileScreen/types';
import { getAllPosts } from './posts';
import { getUserById } from './user';
import { getTodayLocal, formatDateLocal, normalizeDateLocal } from '../utils/dateUtils';

/**
 * Check if user has posted today
 * Ready for Supabase: Check last post date from database
 * 
 * In Supabase:
 * SELECT MAX(created_at) as last_post_date 
 * FROM posts 
 * WHERE user_id = $1
 */
export const hasPostedToday = async (userId: string): Promise<boolean> => {
  try {
    // Get all posts for user
    const allPosts = await getAllPosts();
    const userPosts = allPosts.filter((post) => post.userId === userId);
    
    if (userPosts.length === 0) {
      return false;
    }

    // Get most recent post
    const sortedPosts = userPosts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const lastPost = sortedPosts[0];

    // Check if last post was today (using local timezone)
    const lastPostDate = normalizeDateLocal(lastPost.createdAt);
    const today = getTodayLocal();

    return lastPostDate.getTime() === today.getTime();
  } catch (error) {
    console.error('Error checking if user posted today:', error);
    return false;
  }
};

/**
 * Get user's last post date
 * Ready for Supabase: SELECT MAX(created_at) FROM posts WHERE user_id = $1
 */
export const getLastPostDate = async (userId: string): Promise<Date | null> => {
  try {
    const allPosts = await getAllPosts();
    const userPosts = allPosts.filter((post) => post.userId === userId);
    
    if (userPosts.length === 0) {
      return null;
    }

    const sortedPosts = userPosts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return new Date(sortedPosts[0].createdAt);
  } catch (error) {
    console.error('Error getting last post date:', error);
    return null;
  }
};

/**
 * Check if today is a rest day for the user
 * Supports both date-based rest days (ISO strings) and day-of-week (backward compatibility)
 * Ready for Supabase: Check user's rest_days array from profiles table
 * 
 * In Supabase:
 * SELECT rest_days FROM profiles WHERE id = $1
 */
export const isRestDay = async (userId: string): Promise<boolean> => {
  try {
    // Get user profile with rest days
    const user = await getUserById(userId);
    const restDays = user?.rest_days || [];
    
    if (restDays.length === 0) {
      return false; // No rest days configured
    }

    const today = getTodayLocal();
    const todayStr = formatDateLocal(today);
    const todayDayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Check if today matches any rest day
    return restDays.some((restDay: string) => {
      // Check if it's a date string (ISO format)
      if (restDay.includes('T') || restDay.match(/^\d{4}-\d{2}-\d{2}/)) {
        try {
          const restDate = normalizeDateLocal(restDay);
          const restDateStr = formatDateLocal(restDate);
          return restDateStr === todayStr;
        } catch {
          return false;
        }
      }
      // Otherwise, treat as day of week (backward compatibility)
      return restDay.toLowerCase() === todayDayOfWeek;
    });
  } catch (error) {
    console.error('Error checking rest day:', error);
    return false;
  }
};

