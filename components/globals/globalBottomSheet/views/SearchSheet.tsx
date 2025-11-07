import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useBottomSheet } from '../context';
import { useNavigation } from '../../../../store/navigation-context';
import { getAllUsers } from '../../../../data/user';
import { UserData } from '../../../../screens/userProfileScreen/types';

interface SearchResult {
  id: string;
  type: 'user' | 'screen';
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  screenName?: string;
  userId?: string;
  avatar?: any;
}

const AVAILABLE_SCREENS = [
  { name: 'HomeScreen', displayName: 'Home', keywords: ['home', 'feed', 'main'], icon: 'home' as const },
  { name: 'MessagesScreen', displayName: 'Messages', keywords: ['messages', 'message', 'chat', 'chats'], icon: 'chatbubbles' as const },
  { name: 'NearbyScreen', displayName: 'Nearby', keywords: ['nearby', 'location', 'local', 'near'], icon: 'location' as const },
  { name: 'DiaryScreen', displayName: 'Diary', keywords: ['diary', 'journal', 'mahi', 'my mahi'], icon: 'book' as const },
  { name: 'NotificationsScreen', displayName: 'Notifications', keywords: ['notifications', 'notification', 'alerts', 'notifs'], icon: 'notifications' as const },
  { name: 'UserProfileScreen', displayName: 'Profile', keywords: ['profile', 'my profile', 'account'], icon: 'person' as const },
  { name: 'SETTINGS', displayName: 'Settings', keywords: ['settings', 'setting', 'preferences', 'options'], icon: 'settings-outline' as const, isSheet: true },
];

export const SearchSheet: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { closeSheet, openSheet } = useBottomSheet();
  const { navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    // Search features/settings
    AVAILABLE_SCREENS.forEach((screen) => {
      if (screen.keywords.some(keyword => keyword.includes(lowerQuery) || lowerQuery.includes(keyword))) {
        searchResults.push({
          id: `screen-${screen.name}`,
          type: 'screen',
          title: screen.displayName,
          icon: screen.icon,
          screenName: screen.name,
        });
      }
    });

    // Search users
    users.forEach((user) => {
      const fullName = (user.fullName || '').toLowerCase();
      const username = (user.username || '').toLowerCase();
      
      if (
        fullName.includes(lowerQuery) ||
        username.includes(lowerQuery) ||
        lowerQuery.includes(username) ||
        lowerQuery.includes(fullName.split(' ')[0])
      ) {
        searchResults.push({
          id: `user-${user._id}`,
          type: 'user',
          title: user.fullName || user.username,
          subtitle: `@${user.username}`,
          userId: user._id,
          avatar: user.picturePath,
        });
      }
    });

    setResults(searchResults);
  }, [users]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, search]);

  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'screen' && result.screenName) {
      closeSheet();
      setTimeout(() => {
        if (result.screenName === 'SETTINGS') {
          // Open settings sheet instead of navigating
          openSheet('SETTINGS');
        } else {
          navigate(result.screenName as any);
        }
      }, 100);
    } else if (result.type === 'user' && result.userId) {
      closeSheet();
      setTimeout(() => {
        navigate('UserProfileScreen', { userId: result.userId });
      }, 100);
    }
  };

  const renderResult = ({ item }: { item: SearchResult }) => {
    return (
      <Pressable
        style={styles.resultItem}
        onPress={() => handleResultPress(item)}
        android_ripple={{ color: colors.primary[500] + '20' }}
      >
        {item.type === 'user' ? (
          <>
            {item.avatar ? (
              <Image source={item.avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color={colors.text.muted} />
              </View>
            )}
            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary[500] + '20' }]}>
              <Ionicons
                name={item.icon || 'home'}
                size={24}
                color={colors.primary[500]}
              />
            </View>
            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>{item.title}</Text>
            </View>
          </>
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
      </Pressable>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    searchContainer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    searchInput: {
      backgroundColor: colors.background.primary500,
      borderRadius: 50,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
      borderWidth: 1,
      borderColor: colors.border.primary,
      letterSpacing: 0.2,
    },
    resultsContainer: {
      flex: 1,
      paddingTop: spacing.sm,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: spacing.md,
    },
    avatarPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.background.primary500,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    resultContent: {
      flex: 1,
    },
    resultTitle: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
      letterSpacing: 0.2,
    },
    resultSubtitle: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      letterSpacing: 0.2,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xl * 2,
    },
    emptyText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    emptyIcon: {
      marginBottom: spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users, settings..."
          placeholderTextColor={colors.text.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
          returnKeyType="search"
        />
      </View>

      {searchQuery.trim() ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderResult}
          style={styles.resultsContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="search-outline"
                size={48}
                color={colors.text.muted}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="search-outline"
            size={48}
            color={colors.text.muted}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>Search for users or features</Text>
        </View>
      )}
    </View>
  );
};

