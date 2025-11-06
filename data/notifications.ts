import { NotificationData, NotificationType } from '../screens/notificationsScreen/types';
import { hasPostedToday, isRestDay } from './streakCheck';
import { getUserById } from './user';

/**
 * Mock notifications data
 * Ready for Supabase integration
 * 
 * In Supabase:
 * SELECT * FROM notifications 
 * WHERE user_id = $1 
 * ORDER BY created_at DESC
 */
export const getNotifications = async (userId: string): Promise<NotificationData[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  const notifications: NotificationData[] = [];

  // Check for streak notifications
  const postedToday = await hasPostedToday(userId);
  const restDay = await isRestDay(userId);
  const user = await getUserById(userId);

  // Add streak at risk notification if needed
  if (
    user?.streak_days &&
    user.streak_days > 0 &&
    !postedToday &&
    !restDay
  ) {
    notifications.push({
      _id: `streak_risk_${userId}`,
      userId: userId,
      type: 'STREAK_AT_RISK',
      message: `Your ${user.streak_days}-day streak is at risk! Post today to keep it alive.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      streakDays: user.streak_days,
    });
  }

  // Add loss aversion notification if close to longest streak
  if (user?.streak_days && user?.longest_streak) {
    const daysAway = user.longest_streak - user.streak_days;
    if (daysAway > 0 && daysAway <= 5) {
      notifications.push({
        _id: `loss_aversion_${userId}`,
        userId: userId,
        type: 'STREAK_LOSS_AVERSION',
        message: `You're ${daysAway} ${daysAway === 1 ? 'day' : 'days'} away from your longest streak of ${user.longest_streak} days!`,
        isRead: false,
        createdAt: new Date().toISOString(),
        streakDays: user.streak_days,
        daysAway,
        longestStreak: user.longest_streak,
      });
    }
  }

  // Add mock social notifications
  notifications.push(
    {
      _id: '1',
      userId: '2',
      type: 'LIKE',
      message: 'liked your post',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      postId: '1',
      postImageUrl: require('../assets/Jogger.jpg'),
    },
    {
      _id: '2',
      userId: '3',
      type: 'COMMENT',
      message: 'commented on your post',
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      postId: '1',
      postImageUrl: require('../assets/Jogger.jpg'),
    },
    {
      _id: '3',
      userId: '2',
      type: 'FOLLOW',
      message: 'started following you',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    }
  );

  // Sort by created_at DESC
  return notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * Get unread notification count
 * Ready for Supabase: SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
  const notifications = await getNotifications(userId);
  return notifications.filter((n) => !n.isRead).length;
};

/**
 * Check if user has streak-related unread notifications
 * Used to turn notification icon orange
 */
export const hasStreakNotification = async (userId: string): Promise<boolean> => {
  const notifications = await getNotifications(userId);
  return notifications.some(
    (n) =>
      !n.isRead &&
      (n.type === 'STREAK_AT_RISK' || n.type === 'STREAK_LOSS_AVERSION')
  );
};

