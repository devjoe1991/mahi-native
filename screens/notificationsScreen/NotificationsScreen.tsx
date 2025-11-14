import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../store/auth-context';
import { NotificationCard } from '../../components/notifications';
import { NotificationData } from './types';
import { getNotifications } from '../../data/notifications';
import { useGlobalModal } from '../../components/globals/globalModal';
import { useBottomSheet } from '../../components/globals/globalBottomSheet';
import { useNavigation } from '../../store/navigation-context';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable } from 'react-native';

export const NotificationsScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { userData } = useAuth();
  const { openModal } = useGlobalModal();
  const { openSheet } = useBottomSheet();
  const { goBack } = useNavigation();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    if (!userData?._id) return;

    try {
      const data = await getNotifications(userData._id);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleNotificationPress = async (notification: NotificationData) => {
    // Handle streak notifications - open camera
    if (
      notification.type === 'STREAK_AT_RISK' ||
      notification.type === 'STREAK_LOSS_AVERSION'
    ) {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'We need camera permissions to take photos for your streak.'
        );
        return;
      }

      // Open camera directly (no camera roll option)
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Open streak update sheet with the photo
        openSheet('STREAK_UPDATE', {
          userId: userData?._id,
          initialImage: result.assets[0].uri,
          onSaved: () => {
            fetchNotifications(); // Refresh notifications
          },
        });
      }
    } else if (notification.type === 'FOLLOW') {
      // Navigate to user profile
      // TODO: Navigate to user profile
      console.log('Navigate to user profile:', notification.userId);
    } else if (notification.postId) {
      // Open post details or comments
      if (notification.type === 'COMMENT') {
        openSheet('COMMENTS', { postId: notification.postId });
      }
      // TODO: Handle LIKE - maybe show post details
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md + spacing.xs,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      backgroundColor: colors.background.primary,
    },
    backButton: {
      padding: spacing.xs,
      marginRight: spacing.sm,
    },
    headerTitle: {
      fontSize: typography.h2.fontSize - 3,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
    },
    settingsButton: {
      padding: spacing.xs,
    },
    content: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Activity</Text>
        <View style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand.blue} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={64} color={colors.text.secondary} />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.brand.blue}
            />
          }
        >
          {notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onPress={handleNotificationPress}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

