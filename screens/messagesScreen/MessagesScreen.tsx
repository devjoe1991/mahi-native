import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../store/auth-context';
import { useNavigation } from '../../store/navigation-context';
import { ConversationData } from './types';
import { getConversations } from '../../data/messages';
import { getUserById } from '../../data/user';

export const MessagesScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { userData } = useAuth();
  const { navigate, goBack } = useNavigation();
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversations = async () => {
    if (!userData?._id) return;

    try {
      const data = await getConversations(userData._id);
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const handleConversationPress = (conversation: ConversationData) => {
    // TODO: Navigate to chat screen
    console.log('Open conversation:', conversation._id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderConversation = ({ item }: { item: ConversationData }) => {
    return (
      <Pressable
        style={styles.conversationItem}
        onPress={() => handleConversationPress(item)}
      >
        <View style={styles.avatarContainer}>
          {item.avatarUrl ? (
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatar, { backgroundColor: colors.background.primary500 }]} />
              {item.isOnline && <View style={styles.onlineIndicator} />}
            </View>
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {item.fullName?.charAt(0) || item.username.charAt(0).toUpperCase()}
              </Text>
              {item.isOnline && <View style={styles.onlineIndicator} />}
            </View>
          )}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.username} numberOfLines={1}>
              {item.fullName || item.username}
            </Text>
            <Text style={styles.time}>{formatTime(item.lastMessageTime)}</Text>
          </View>
          <View style={styles.messageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
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
      letterSpacing: 0.5,
      lineHeight: (typography.h2.fontSize - 3) * 1.2,
    },
    settingsButton: {
      padding: spacing.xs,
    },
    content: {
      flex: 1,
    },
    conversationItem: {
      flexDirection: 'row',
      padding: spacing.lg,
      backgroundColor: colors.background.primary500,
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
    avatarContainer: {
      marginRight: spacing.md,
    },
    avatarWrapper: {
      position: 'relative',
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.background.primary500,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    avatarPlaceholder: {
      backgroundColor: colors.brand.blue,
    },
    avatarText: {
      fontSize: 20,
      fontWeight: '700',
      fontFamily: typography.h2.fontFamily,
      color: colors.background.primary,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.brand.green,
      borderWidth: 2,
      borderColor: colors.background.primary,
    },
    conversationContent: {
      flex: 1,
      minWidth: 0,
    },
    conversationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    username: {
      fontSize: typography.body.fontSize - 2,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      flex: 1,
      letterSpacing: 0.2,
      lineHeight: (typography.body.fontSize - 2) * 1.4,
    },
    time: {
      fontSize: 12,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginLeft: spacing.sm,
      letterSpacing: 0.2,
      lineHeight: 12 * 1.3,
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    lastMessage: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      flex: 1,
      marginRight: spacing.sm,
      letterSpacing: 0.2,
      lineHeight: (typography.body.fontSize - 2) * 1.5,
    },
    unreadBadge: {
      backgroundColor: colors.brand.blue,
      borderRadius: 50,
      minWidth: 20,
      height: 20,
      paddingHorizontal: spacing.xs,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    unreadText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      fontWeight: '700',
      color: colors.background.primary,
      letterSpacing: 0.2,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      textAlign: 'center',
      marginTop: spacing.md,
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.5,
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
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brand.blue} />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.text.secondary} />
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={renderConversation}
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.brand.blue}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

