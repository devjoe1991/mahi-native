import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { UserData } from '../../screens/userProfileScreen/types';
import { getAllUsers } from '../../data/user';

type LeaderboardPeriod = 'weekly' | 'monthly' | 'alltime';

interface LeaderboardProps {
  period?: LeaderboardPeriod;
  limit?: number;
}

interface LeaderboardItem {
  user: UserData;
  rank: number;
  streak: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  period = 'alltime',
  limit = 50 
}) => {
  const { colors, spacing, typography } = useTheme();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const users = await getAllUsers();
        // Sort by streak_days descending
        const sorted = users
          .filter((user: UserData) => (user.streak_days || 0) > 0)
          .sort((a: UserData, b: UserData) => (b.streak_days || 0) - (a.streak_days || 0))
          .slice(0, limit)
          .map((user: UserData, index: number) => ({
            user,
            rank: index + 1,
            streak: user.streak_days || 0,
          }));
        setLeaderboard(sorted);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period, limit]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    title: {
      fontSize: typography.h2.fontSize - 3,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
    },
    periodSelector: {
      flexDirection: 'row',
      marginTop: spacing.sm,
      gap: spacing.sm,
    },
    periodButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: 8,
      backgroundColor: colors.background.secondary,
    },
    periodButtonActive: {
      backgroundColor: colors.brand.blue,
    },
    periodButtonText: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
    },
    periodButtonTextActive: {
      color: colors.background.primary,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    rank: {
      width: 40,
      fontSize: typography.h3.fontSize - 4,
      fontWeight: typography.h3.fontWeight as any,
      fontFamily: typography.h3.fontFamily,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    rankTop: {
      color: colors.brand.orange,
    },
    userInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },
    username: {
      fontSize: typography.body.fontSize - 2,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
    },
    streakInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    streakText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      marginLeft: spacing.xs,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: spacing.xl * 2,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: spacing.xl * 2,
    },
    emptyText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
    },
  });

  const renderItem = ({ item }: { item: LeaderboardItem }) => (
    <View style={styles.item}>
      <Text style={[styles.rank, item.rank <= 3 && styles.rankTop]}>
        {item.rank}
      </Text>
      <View style={styles.userInfo}>
        <Text style={styles.username}>@{item.user.username}</Text>
        <View style={styles.streakInfo}>
          <Ionicons name="flame" size={16} color={colors.brand.orange} />
          <Text style={styles.streakText}>{item.streak} day streak</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand.blue} />
      </View>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No streaks yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.periodSelector}>
          {(['weekly', 'monthly', 'alltime'] as LeaderboardPeriod[]).map((p) => (
            <View
              key={p}
              style={[
                styles.periodButton,
                period === p && styles.periodButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  period === p && styles.periodButtonTextActive,
                ]}
              >
                {p === 'weekly' ? 'Week' : p === 'monthly' ? 'Month' : 'All Time'}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.user._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

