export interface GlobalHeaderProps {
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  showUnreadBadge?: boolean;
  unreadCount?: number;
  hasStreakNotification?: boolean; // If true, icon turns orange
}

export interface IconButtonProps {
  icon: string;
  onPress: () => void;
  badge?: boolean;
  badgeCount?: number;
  iconColor?: string; // Custom icon color (e.g., orange for streak notifications)
}

