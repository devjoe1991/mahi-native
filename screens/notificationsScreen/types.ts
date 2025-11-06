// Notification Types
export type NotificationType = 
  | 'LIKE' 
  | 'COMMENT' 
  | 'FOLLOW' 
  | 'STREAK_AT_RISK' 
  | 'STREAK_LOSS_AVERSION'
  | 'MILESTONE';

export interface NotificationData {
  _id: string;
  userId: string; // User who triggered the notification (for LIKE, COMMENT, FOLLOW)
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  // Type-specific data
  postId?: string; // For LIKE, COMMENT
  postImageUrl?: string | number; // For LIKE, COMMENT - thumbnail
  // For streak notifications
  streakDays?: number;
  daysAway?: number; // For loss aversion
  longestStreak?: number;
}

