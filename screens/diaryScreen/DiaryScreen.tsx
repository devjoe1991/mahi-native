import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '../../store/navigation-context';
import { useAuth } from '../../store/auth-context';
import { GlobalHeader } from '../../components/globals/GlobalHeader';
import { BottomTabBar, TabType } from '../../components/bottomTabBar';
import { useGlobalModal } from '../../components/globals/globalModal';
import { useBottomSheet } from '../../components/globals/globalBottomSheet';
import {
  getUpcomingWorkouts,
  getTodayWorkouts,
  getNextWorkout,
  requestCalendarPermissions,
  hasCalendarPermissions,
  WorkoutEvent,
} from '../../utils/healthIntegration';

export const DiaryScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { navigate } = useNavigation();
  const { userData } = useAuth();
  const { openModal } = useGlobalModal();
  const { openSheet } = useBottomSheet();
  const [activeTab, setActiveTab] = useState<TabType>('diary');
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<WorkoutEvent[]>([]);
  const [todayWorkouts, setTodayWorkouts] = useState<WorkoutEvent[]>([]);
  const [nextWorkout, setNextWorkout] = useState<WorkoutEvent | null>(null);
  const [calendarPermissionGranted, setCalendarPermissionGranted] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  const handleTabPress = (tab: TabType) => {
    if (tab === 'home') {
      navigate('HomeScreen');
    } else if (tab === 'messages') {
      navigate('MessagesScreen');
    } else if (tab === 'nearby') {
      navigate('NearbyScreen');
    } else {
      setActiveTab(tab);
    }
  };

  const handleSearchPress = () => {
    openSheet('SEARCH');
  };

  const handleNotificationsPress = () => {
    navigate('NotificationsScreen');
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleSetRestDays = () => {
    openModal('REST_DAYS_SETUP', {
      onSave: (restDays) => {
        console.log('Rest days saved:', restDays);
      },
    });
  };

  const handleUpdateStreak = () => {
    openSheet('STREAK_UPDATE', {
      userId: userData?._id,
      onSaved: () => {
        // Streak updated
      },
    });
  };

  const fetchWorkouts = async () => {
    setLoadingWorkouts(true);
    try {
      const hasPermission = await hasCalendarPermissions();
      if (!hasPermission) {
        setCalendarPermissionGranted(false);
        setLoadingWorkouts(false);
        return;
      }

      setCalendarPermissionGranted(true);
      const [upcoming, today, next] = await Promise.all([
        getUpcomingWorkouts(7),
        getTodayWorkouts(),
        getNextWorkout(),
      ]);

      setUpcomingWorkouts(upcoming);
      setTodayWorkouts(today);
      setNextWorkout(next);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoadingWorkouts(false);
    }
  };

  const handleConnectCalendar = async () => {
    const granted = await requestCalendarPermissions();
    if (granted) {
      setCalendarPermissionGranted(true);
      await fetchWorkouts();
      Alert.alert('Success', 'Calendar connected! We can now help you track your scheduled workouts.');
    } else {
      Alert.alert(
        'Permission Required',
        'Calendar access is needed to detect your scheduled workouts and help you complete your Mahi.'
      );
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const features = [
    {
      icon: 'fitness',
      title: 'Health Data Integration',
      description: 'Connect with Apple Health, Strava, and Garmin to track your workouts automatically',
      color: colors.brand.blue,
      comingSoon: true,
    },
    {
      icon: 'analytics',
      title: 'Progress Analytics',
      description: 'View detailed insights, trends, and progress over time',
      color: colors.brand.cyan,
      comingSoon: true,
    },
    {
      icon: 'calendar',
      title: 'Workout Calendar',
      description: 'See your workout history and plan ahead',
      color: colors.brand.purple,
      comingSoon: false,
    },
    {
      icon: 'trophy',
      title: 'Achievements & Milestones',
      description: 'Track your achievements and celebrate milestones',
      color: colors.brand.orange,
      comingSoon: true,
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
      padding: spacing.md,
      alignItems: 'center',
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },
    heroIcon: {
      marginBottom: spacing.sm,
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
    actionsSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.md,
      letterSpacing: 0.5,
      lineHeight: typography.h2.fontSize * 1.2,
    },
    actionCard: {
      backgroundColor: colors.background.primary500,
      borderRadius: 20,
      padding: spacing.md,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    actionIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: typography.h3.fontSize,
      fontWeight: typography.h3.fontWeight as any,
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      letterSpacing: 0.2,
      lineHeight: typography.h3.fontSize * 1.2,
    },
    actionDescription: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.5,
    },
    streakInfoCard: {
      backgroundColor: colors.background.primary500,
      borderRadius: 20,
      padding: spacing.md,
      marginBottom: spacing.sm,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    streakInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    streakInfoRowLast: {
      marginBottom: 0,
    },
    streakInfoLabel: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      letterSpacing: 0.2,
    },
    streakInfoValue: {
      fontSize: typography.h3.fontSize,
      fontWeight: '700',
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      letterSpacing: 0.2,
    },
    streakInfoValueHighlight: {
      color: colors.brand.orange,
    },
    featuresSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    carouselContent: {
      paddingRight: spacing.lg,
    },
    featureCardCarousel: {
      backgroundColor: colors.background.primary500,
      borderRadius: 20,
      padding: spacing.md,
      marginRight: spacing.md,
      width: Dimensions.get('window').width * 0.75,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      overflow: 'hidden',
      justifyContent: 'flex-start',
    },
    featureIconContainerCarousel: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    featureContentCarousel: {
      flex: 1,
    },
    featureTitleCarousel: {
      fontSize: typography.h3.fontSize,
      fontWeight: typography.h3.fontWeight as any,
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      letterSpacing: 0.2,
      lineHeight: typography.h3.fontSize * 1.2,
    },
    featureDescriptionCarousel: {
      fontSize: typography.body.fontSize - 1,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      letterSpacing: 0.2,
      lineHeight: (typography.body.fontSize - 1) * 1.4,
    },
    comingSoonBadge: {
      backgroundColor: colors.brand.blue,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 50,
      marginLeft: spacing.sm,
      alignSelf: 'flex-start',
    },
    comingSoonText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      fontWeight: '700',
      color: colors.background.primary,
      letterSpacing: 0.2,
    },
    workoutCard: {
      backgroundColor: colors.background.primary500,
      borderRadius: 20,
      padding: spacing.md,
      marginBottom: spacing.sm,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    workoutHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    workoutSectionTitle: {
      fontSize: typography.h3.fontSize,
      fontWeight: typography.h3.fontWeight as any,
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      marginLeft: spacing.sm,
      letterSpacing: 0.2,
    },
    workoutItem: {
      paddingVertical: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
    },
    workoutItemContent: {
      marginTop: spacing.sm,
    },
    workoutTitle: {
      fontSize: typography.body.fontSize,
      fontWeight: '600',
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      letterSpacing: 0.2,
    },
    workoutTime: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      letterSpacing: 0.2,
    },
    workoutMoreText: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.brand.blue,
      marginTop: spacing.sm,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    workoutEmptyText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      textAlign: 'center',
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.5,
    },
  });

  const currentStreak = userData?.streak_days || 0;
  const longestStreak = userData?.longest_streak || 0;
  const restDays = userData?.rest_days || [];

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
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="book"
              size={64}
              color={colors.brand.purple}
            />
          </View>
          <Text style={styles.heroTitle}>My Mahi Diary</Text>
          <Text style={styles.heroSubtitle}>
            Set up your Mahi, track your progress, and maintain your streak
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <Pressable style={styles.actionCard} onPress={handleUpdateStreak}>
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: colors.brand.orange + '20' },
              ]}
            >
              <Ionicons
                name="flame"
                size={24}
                color={colors.brand.orange}
              />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Update Streak</Text>
              <Text style={styles.actionDescription}>
                Post your daily Mahi to maintain your streak
              </Text>
            </View>
          </Pressable>

          <Pressable style={styles.actionCard} onPress={handleSetRestDays}>
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: colors.brand.blue + '20' },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={24}
                color={colors.brand.blue}
              />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Set Rest Days</Text>
              <Text style={styles.actionDescription}>
                Choose which days you take rest from your streak
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Streak Info */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.streakInfoCard}>
            <View style={styles.streakInfoRow}>
              <Text style={styles.streakInfoLabel}>Current Streak</Text>
              <Text style={[styles.streakInfoValue, styles.streakInfoValueHighlight]}>
                {currentStreak} days 🔥
              </Text>
            </View>
            <View style={styles.streakInfoRow}>
              <Text style={styles.streakInfoLabel}>Longest Streak</Text>
              <Text style={styles.streakInfoValue}>
                {longestStreak} days
              </Text>
            </View>
            <View style={[styles.streakInfoRow, styles.streakInfoRowLast]}>
              <Text style={styles.streakInfoLabel}>Rest Days</Text>
              <Text style={styles.streakInfoValue}>
                {restDays.length > 0 ? restDays.join(', ') : 'None set'}
              </Text>
            </View>
          </View>
        </View>

        {/* Calendar Integration */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Scheduled Workouts</Text>
          
          {!calendarPermissionGranted ? (
            <Pressable style={styles.actionCard} onPress={handleConnectCalendar}>
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: colors.brand.purple + '20' },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={colors.brand.purple}
                />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Connect Calendar</Text>
                <Text style={styles.actionDescription}>
                  Connect your calendar to detect scheduled workouts and get reminders
                </Text>
              </View>
            </Pressable>
          ) : (
            <>
              {todayWorkouts.length > 0 && (
                <View style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <Ionicons name="today" size={20} color={colors.brand.orange} />
                    <Text style={styles.workoutSectionTitle}>Today's Workouts</Text>
                  </View>
                  {todayWorkouts.map((workout) => (
                    <View key={workout.id} style={styles.workoutItem}>
                      <View style={styles.workoutItemContent}>
                        <Text style={styles.workoutTitle}>{workout.title}</Text>
                        <Text style={styles.workoutTime}>
                          {workout.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {workout.location && ` • ${workout.location}`}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {nextWorkout && nextWorkout.startDate > new Date() && (
                <View style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <Ionicons name="time-outline" size={20} color={colors.brand.blue} />
                    <Text style={styles.workoutSectionTitle}>Next Workout</Text>
                  </View>
                  <View style={styles.workoutItem}>
                    <View style={styles.workoutItemContent}>
                      <Text style={styles.workoutTitle}>{nextWorkout.title}</Text>
                      <Text style={styles.workoutTime}>
                        {nextWorkout.startDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                        {' • '}
                        {nextWorkout.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {nextWorkout.location && ` • ${nextWorkout.location}`}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {upcomingWorkouts.length > 0 && (
                <View style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <Ionicons name="calendar-outline" size={20} color={colors.brand.purple} />
                    <Text style={styles.workoutSectionTitle}>Upcoming (Next 7 Days)</Text>
                  </View>
                  {upcomingWorkouts.slice(0, 3).map((workout) => (
                    <View key={workout.id} style={styles.workoutItem}>
                      <View style={styles.workoutItemContent}>
                        <Text style={styles.workoutTitle}>{workout.title}</Text>
                        <Text style={styles.workoutTime}>
                          {workout.startDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                          {' • '}
                          {workout.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    </View>
                  ))}
                  {upcomingWorkouts.length > 3 && (
                    <Text style={styles.workoutMoreText}>
                      +{upcomingWorkouts.length - 3} more workouts
                    </Text>
                  )}
                </View>
              )}

              {upcomingWorkouts.length === 0 && todayWorkouts.length === 0 && (
                <View style={styles.workoutCard}>
                  <Text style={styles.workoutEmptyText}>
                    No workouts detected in your calendar. Add workout events to get reminders!
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Coming Soon Features - Horizontal Carousel */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <FlatList
            data={features}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `feature-${index}`}
            contentContainerStyle={styles.carouselContent}
            renderItem={({ item }) => (
              <Pressable style={styles.featureCardCarousel}>
                <View
                  style={[
                    styles.featureIconContainerCarousel,
                    { backgroundColor: item.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>
                <View style={styles.featureContentCarousel}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Text style={styles.featureTitleCarousel}>{item.title}</Text>
                    {item.comingSoon && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>SOON</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.featureDescriptionCarousel} numberOfLines={3}>
                    {item.description}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

