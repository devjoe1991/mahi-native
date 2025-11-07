import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '../../store/navigation-context';
import { GlobalHeader } from '../../components/globals/GlobalHeader';
import { BottomTabBar, TabType } from '../../components/bottomTabBar';
import { getAllUsers } from '../../data/user';
import { UserData } from '../userProfileScreen/types';

interface LeaderboardItem {
  user: UserData;
  rank: number;
  streak: number;
}

export const NearbyScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('nearby');
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  const handleTabPress = (tab: TabType) => {
    if (tab === 'home') {
      navigate('HomeScreen');
    } else if (tab === 'messages') {
      navigate('MessagesScreen');
    } else {
      setActiveTab(tab);
    }
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleNotificationsPress = () => {
    navigate('NotificationsScreen');
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      try {
        const users = await getAllUsers();
        const sorted = users
          .filter((user: UserData) => (user.streak_days || 0) > 0)
          .sort((a: UserData, b: UserData) => (b.streak_days || 0) - (a.streak_days || 0))
          .slice(0, 10)
          .map((user: UserData, index: number) => ({
            user,
            rank: index + 1,
            streak: user.streak_days || 0,
          }));
        setLeaderboard(sorted);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const features = [
    {
      icon: 'people',
      title: 'Find Nearby Users',
      description: 'Connect with fitness enthusiasts in your area',
      color: colors.brand.blue,
    },
    {
      icon: 'people-circle',
      title: 'Join Local Groups',
      description: 'Discover workout groups and communities nearby',
      color: colors.brand.purple,
    },
    {
      icon: 'location',
      title: 'Location-Based Feeds',
      description: 'See what people in your area are up to',
      color: colors.brand.cyan,
    },
    {
      icon: 'calendar',
      title: 'Group Challenges',
      description: 'Participate in local fitness challenges',
      color: colors.brand.orange,
    },
    {
      icon: 'walk',
      title: 'Meetup Events',
      description: 'Join group workouts and meetups',
      color: colors.brand.green,
    },
    {
      icon: 'trophy',
      title: 'Local Leaderboards',
      description: 'Compete with people in your neighborhood',
      color: colors.brand.yellow,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    content: {
      flex: 1,
      paddingBottom: 100,
    },
    heroSection: {
      padding: spacing.lg,
      alignItems: 'center',
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    heroIcon: {
      marginBottom: spacing.md,
    },
    heroTitle: {
      fontSize: typography.h1.fontSize,
      fontWeight: typography.h1.fontWeight as any,
      fontFamily: typography.h1.fontFamily,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
      letterSpacing: 0.5,
      lineHeight: typography.h1.fontSize * 1.2,
    },
    heroSubtitle: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      textAlign: 'center',
      marginBottom: 0,
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.5,
      paddingHorizontal: spacing.md,
    },
    comingSoonBadge: {
      backgroundColor: colors.brand.blue,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: 50,
      marginTop: spacing.sm,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    comingSoonText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      fontWeight: '700',
      color: colors.background.primary,
      letterSpacing: 0.5,
    },
    featuresSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.lg,
      letterSpacing: 0.5,
      lineHeight: typography.h2.fontSize * 1.2,
    },
    featureCard: {
      backgroundColor: colors.background.primary500,
      borderRadius: 24,
      padding: spacing.lg,
      marginBottom: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    featureIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: typography.h3.fontSize,
      fontWeight: typography.h3.fontWeight as any,
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      letterSpacing: 0.2,
      lineHeight: typography.h3.fontSize * 1.2,
    },
    featureDescription: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.5,
    },
    leaderboardSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      marginBottom: spacing.lg,
    },
    leaderboardCard: {
      backgroundColor: colors.background.primary500,
      borderRadius: 24,
      padding: spacing.lg,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    leaderboardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    leaderboardItemLast: {
      borderBottomWidth: 0,
    },
    rankBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      backgroundColor: colors.background.primary,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    rankBadgeTop: {
      backgroundColor: colors.brand.yellow,
    },
    rankText: {
      fontSize: typography.h3.fontSize,
      fontWeight: '700',
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
    },
    rankTextTop: {
      color: colors.background.primary,
    },
    leaderboardUserInfo: {
      flex: 1,
    },
    leaderboardUsername: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.4,
    },
    leaderboardStreak: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    leaderboardStreakText: {
      fontSize: 12,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      marginLeft: spacing.xs,
      letterSpacing: 0.2,
      lineHeight: 12 * 1.3,
    },
  });

  return (
    <View style={styles.container}>
      <GlobalHeader
        onSearchPress={handleSearchPress}
        onNotificationsPress={handleNotificationsPress}
        onMenuPress={handleMenuPress}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="location"
              size={80}
              color={colors.brand.cyan}
            />
          </View>
          <Text style={styles.heroTitle}>Connect Nearby</Text>
          <Text style={styles.heroSubtitle}>
            Find fitness enthusiasts, join local groups, and discover workout communities in your area
          </Text>
        </View>

        {/* Leaderboard Section */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Top Streaks</Text>
          {loadingLeaderboard ? (
            <View style={styles.leaderboardCard}>
              <ActivityIndicator size="large" color={colors.brand.blue} style={{ padding: spacing.xl }} />
            </View>
          ) : leaderboard.length > 0 ? (
            <View style={styles.leaderboardCard}>
              {leaderboard.map((item, index) => (
                <Pressable
                  key={item.user._id}
                  style={[
                    styles.leaderboardItem,
                    index === leaderboard.length - 1 && styles.leaderboardItemLast,
                  ]}
                  onPress={() => navigate('UserProfileScreen', { userId: item.user._id })}
                >
                  <View
                    style={[
                      styles.rankBadge,
                      item.rank <= 3 && styles.rankBadgeTop,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rankText,
                        item.rank <= 3 && styles.rankTextTop,
                      ]}
                    >
                      {item.rank}
                    </Text>
                  </View>
                  <View style={styles.leaderboardUserInfo}>
                    <Text style={styles.leaderboardUsername}>
                      {item.user.fullName || item.user.username}
                    </Text>
                    <View style={styles.leaderboardStreak}>
                      <Ionicons name="flame" size={14} color={colors.brand.orange} />
                      <Text style={styles.leaderboardStreakText}>
                        {item.streak} day streak
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {/* Coming Soon Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          {features.slice(0, 4).map((feature, index) => (
            <Pressable key={index} style={styles.featureCard}>
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: feature.color + '20' },
                ]}
              >
                <Ionicons
                  name={feature.icon as any}
                  size={28}
                  color={feature.color}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

