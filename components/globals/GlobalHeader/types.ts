export interface GlobalHeaderProps {
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  showUnreadBadge?: boolean;
  unreadCount?: number;
}

export interface IconButtonProps {
  icon: string;
  onPress: () => void;
  badge?: boolean;
  badgeCount?: number;
}

