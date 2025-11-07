import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { NotificationData } from '../../screens/notificationsScreen/types';
import { getUserById } from '../../data/user';
import { useAuth } from '../../store/auth-context';

interface NotificationCardProps {
  notification: NotificationData;
  onPress?: (notification: NotificationData) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { userData } = useAuth();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      if (notification.type !== 'STREAK_AT_RISK' && notification.type !== 'STREAK_LOSS_AVERSION') {
        const fetchedUser = await getUserById(notification.userId);
        setUser(fetchedUser);
      }
    };
    fetchUser();
  }, [notification]);

  const getIcon = () => {
    switch (notification.type) {
      case 'LIKE':
        return 'heart';
      case 'COMMENT':
        return 'chatbubble';
      case 'FOLLOW':
        return 'person-add';
      case 'STREAK_AT_RISK':
        return 'flame';
      case 'STREAK_LOSS_AVERSION':
        return 'trophy';
      case 'MILESTONE':
        return 'star';
      default:
        return 'notifications';
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case 'LIKE':
        return colors.brand.red;
      case 'COMMENT':
        return colors.brand.blue;
      case 'FOLLOW':
        return colors.brand.green;
      case 'STREAK_AT_RISK':
        return colors.brand.orange;
      case 'STREAK_LOSS_AVERSION':
        return colors.brand.purple;
      case 'MILESTONE':
        return colors.brand.yellow;
      default:
        return colors.text.primary;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: spacing.lg,
      backgroundColor: notification.isRead
        ? colors.background.primary
        : colors.background.primary500,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      marginHorizontal: spacing.md,
      marginVertical: spacing.xs,
      borderRadius: 20,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: getIconColor() + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      borderWidth: 2,
      borderColor: getIconColor() + '30',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    content: {
      flex: 1,
      minWidth: 0, // Allow content to shrink properly
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.xs,
      flexWrap: 'wrap',
      flex: 1,
    },
    username: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginRight: spacing.xs,
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.4,
    },
    message: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.5,
      flex: 1,
      flexShrink: 1,
      paddingRight: spacing.xs, // Add padding to prevent text cutoff
    },
    time: {
      fontSize: 12,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginTop: spacing.xs,
      letterSpacing: 0.2,
      lineHeight: 12 * 1.3,
    },
    thumbnail: {
      width: 50,
      height: 50,
      borderRadius: 15,
      marginLeft: spacing.md,
    },
    followButton: {
      backgroundColor: colors.brand.blue,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: 50,
      marginTop: spacing.sm, // Increased margin for better spacing
      alignSelf: 'flex-start', // Align button to the left
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    followButtonText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.background.primary,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    unreadIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.brand.blue,
      marginLeft: spacing.xs,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 2,
    },
  });

  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress?.(notification)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIcon() as any} size={20} color={getIconColor()} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          {notification.type === 'STREAK_AT_RISK' || notification.type === 'STREAK_LOSS_AVERSION' ? (
            <Text style={styles.message}>{notification.message}</Text>
          ) : (
            <>
              <Text style={styles.username}>{user?.username || 'User'}</Text>
              <Text style={styles.message}>{notification.message}</Text>
            </>
          )}
          {!notification.isRead && <View style={styles.unreadIndicator} />}
        </View>
        <Text style={styles.time}>{formatTime(notification.createdAt)}</Text>
        {notification.type === 'FOLLOW' && (
          <Pressable style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow Back</Text>
          </Pressable>
        )}
      </View>
      {(notification.type === 'LIKE' || notification.type === 'COMMENT') &&
        notification.postImageUrl && (
          <Image
            source={
              typeof notification.postImageUrl === 'number'
                ? notification.postImageUrl
                : { uri: notification.postImageUrl }
            }
            style={styles.thumbnail}
          />
        )}
    </Pressable>
  );
};

