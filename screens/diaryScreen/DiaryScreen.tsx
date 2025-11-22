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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
import { RestDaysCalendar } from '../../components/calendar/RestDaysCalendar';
import { syncAllRestDaysToCalendar, getRestDaysFromCalendar } from '../../utils/calendarSync';
import { getPostsByUserId } from '../../data/posts';

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
  const [restDaysDates, setRestDaysDates] = useState<Date[]>([]);
  const [pendingRestDays, setPendingRestDays] = useState<Date[]>([]);
  const [restDaysDirty, setRestDaysDirty] = useState(false);
  const [loadingRestDays, setLoadingRestDays] = useState(false);
  const [postDates, setPostDates] = useState<Date[]>([]);
  const [restDaysSaved, setRestDaysSaved] = useState(false);
  const [savingRestDays, setSavingRestDays] = useState(false);

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
      onSave: async (restDays) => {
        console.log('Rest days saved:', restDays);
        // Reload rest days from calendar after save
        await loadRestDaysFromCalendar();
      },
    });
  };

  const normalizeRestDates = (dates: Date[]): Date[] => {
    return dates
      .map((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
      })
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
  };

  const areRestDayArraysEqual = (a: Date[], b: Date[]): boolean => {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i].getTime() !== b[i].getTime()) {
        return false;
      }
    }
    return true;
  };

  const loadRestDaysFromCalendar = async () => {
    setLoadingRestDays(true);
    try {
      const hasPermission = await hasCalendarPermissions();
      if (hasPermission) {
        const calendarRestDays = await getRestDaysFromCalendar();
        const normalized = normalizeRestDates(calendarRestDays);
        setRestDaysDates(normalized);
        setPendingRestDays(normalized);
        setRestDaysDirty(false);
      } else {
        // Load from user profile if no calendar permission
        if (userData?.rest_days) {
          const profileDates = userData.rest_days
            .filter((rd: string) => rd.includes('T') || rd.match(/^\d{4}-\d{2}-\d{2}/))
            .map((rd: string) => new Date(rd));
          const normalized = normalizeRestDates(profileDates);
          setRestDaysDates(normalized);
          setPendingRestDays(normalized);
          setRestDaysDirty(false);
        }
      }
    } catch (error) {
      console.error('Error loading rest days:', error);
    } finally {
      setLoadingRestDays(false);
    }
  };

  const handleRestDaysChange = (dates: Date[]) => {
    const normalized = normalizeRestDates(dates);
    setPendingRestDays(normalized);
    setRestDaysDirty(!areRestDayArraysEqual(normalized, restDaysDates));
    setRestDaysSaved(false);
  };

  const handleRestDaysSave = async () => {
    if (!restDaysDirty) {
      return;
    }

    setSavingRestDays(true);
    try {
      const hasPermission = await hasCalendarPermissions();
      if (hasPermission) {
        await syncAllRestDaysToCalendar(pendingRestDays);
      }

      const restDaysData = pendingRestDays.map((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString();
      });

      // TODO: Update user profile in Supabase
      // await updateUserData({ rest_days: restDaysData });

      setRestDaysDates(pendingRestDays);
      setRestDaysDirty(false);
      setRestDaysSaved(true);

      setTimeout(() => {
        setRestDaysSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving rest days:', error);
      Alert.alert('Error', 'Failed to save rest days. Please try again.');
    } finally {
      setSavingRestDays(false);
    }
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

  const loadPostDates = async () => {
    if (!userData?._id) return;
    
    try {
      const posts = await getPostsByUserId(userData._id);
      const dates = posts.map((post) => {
        const date = new Date(post.createdAt);
        date.setHours(0, 0, 0, 0);
        return date;
      });
      setPostDates(dates);
    } catch (error) {
      console.error('Error loading post dates:', error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
    loadRestDaysFromCalendar();
    loadPostDates();
  }, [userData?._id]);

  const quickActions = [
    {
      icon: 'flame',
      title: 'Update Streak',
      description: 'Post your daily Mahi to maintain your streak',
      color: colors.brand.orange,
      onPress: handleUpdateStreak,
    },
    {
      icon: 'calendar-outline',
      title: 'Set Rest Days',
      description: 'Choose which days you take rest from your streak',
      color: colors.brand.blue,
      onPress: handleSetRestDays,
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
      letterSpacing: 0.15,
      lineHeight: typography.body.fontSize * 1.3,
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
      borderRadius: 16,
      padding: spacing.md,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    actionCardCarousel: {
      backgroundColor: colors.background.primary500,
      borderRadius: 16,
      padding: spacing.md,
      marginRight: spacing.md,
      width: Dimensions.get('window').width - (spacing.lg * 2) - spacing.md, // Full width minus padding and margin
      height: Dimensions.get('window').width - (spacing.lg * 2) - spacing.md, // Make it square
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    actionsCarouselContent: {
      paddingRight: spacing.lg,
    },
    calendarSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      marginBottom: spacing.md,
    },
    calendarActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    savePillButton: {
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      borderRadius: 12,
      minWidth: 110,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    savePillButtonDisabled: {
      opacity: 0.5,
    },
    savePillButtonText: {
      color: colors.background.primary,
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    calendarHelperText: {
      color: colors.text.muted,
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      marginLeft: spacing.sm,
    },
    calendarCard: {
      backgroundColor: colors.background.primary500,
      borderRadius: 16,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
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
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    plusButtonGradient: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
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
      fontSize: typography.h3.fontSize - 4,
      fontWeight: typography.h3.fontWeight as any,
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      letterSpacing: 0.15,
      lineHeight: (typography.h3.fontSize - 4) * 1.2,
    },
    actionDescription: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      fontWeight: '400',
      color: colors.text.muted,
      letterSpacing: 0.15,
      lineHeight: (typography.body.fontSize - 2) * 1.3,
    },
    streakInfoCard: {
      backgroundColor: 'transparent',
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    streakInfoRow: {
      marginBottom: spacing.md,
    },
    streakInfoRowLast: {
      marginBottom: 0,
    },
    streakInfoLabelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    streakInfoLabel: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      letterSpacing: 0.15,
    },
    streakInfoValue: {
      fontSize: typography.h3.fontSize,
      fontWeight: '600',
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      letterSpacing: 0.15,
    },
    streakInfoValueHighlight: {
      color: colors.brand.orange,
    },
    progressBarContainer: {
      height: 4,
      backgroundColor: colors.background.primary500,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 2,
    },
    workoutCard: {
      backgroundColor: colors.background.primary500,
      borderRadius: 16,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border.primary,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
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
      letterSpacing: 0.15,
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
      fontSize: typography.body.fontSize - 2,
      fontWeight: '600',
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      letterSpacing: 0.15,
    },
    workoutTime: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      letterSpacing: 0.15,
    },
    workoutMoreText: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.brand.blue,
      marginTop: spacing.sm,
      textAlign: 'center',
      letterSpacing: 0.15,
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
        {/* Rest Days Calendar */}
        <View style={styles.calendarSection}>
          {loadingRestDays ? (
            <View style={{ padding: spacing.xl, alignItems: 'center' }}>
              <Text style={styles.actionDescription}>Loading rest days...</Text>
            </View>
          ) : (
            <>
              <RestDaysCalendar
                selectedDates={pendingRestDays}
                onDatesChange={handleRestDaysChange}
                minDate={new Date()}
                maxDaysAhead={30}
                streakDays={userData?.streak_days || 0}
                lastPostDate={userData?.last_post_date ? new Date(userData.last_post_date) : null}
                postDates={postDates}
                showSaveConfirmation={restDaysSaved}
              />
            </>
          )}
        </View>

        {/* Quick Actions - Swipeable */}
        <View style={styles.actionsSection}>
          <FlatList
            data={quickActions}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `action-${index}`}
            contentContainerStyle={styles.actionsCarouselContent}
            renderItem={({ item }) => {
              const isUpdateStreak = item.title === 'Update Streak';
              const isSetRestDays = item.title === 'Set Rest Days';
              const isSquareCard = isUpdateStreak || isSetRestDays;
              const cardWidth = Dimensions.get('window').width - (spacing.lg * 2) - spacing.md;
              const squareCardSize = cardWidth * 0.5; // 50% smaller
              
              return (
                <Pressable 
                  style={[
                    styles.actionCardCarousel,
                    isSquareCard && {
                      width: squareCardSize,
                      height: squareCardSize,
                      backgroundColor: colors.primary[500] + '15',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]} 
                  onPress={item.onPress}
                >
                  {isUpdateStreak ? (
                    <LinearGradient
                      colors={[colors.primary[500], colors.primary[500]]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.plusButtonGradient, { marginBottom: spacing.sm }]}
                    >
                      <Ionicons name="add" size={20} color={colors.background.primary} />
                    </LinearGradient>
                  ) : isSetRestDays ? (
                    <View
                      style={[
                        styles.actionIconContainer,
                        {
                          backgroundColor: colors.primary[500],
                          marginBottom: spacing.sm,
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                        },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={colors.background.primary}
                      />
                    </View>
                  ) : (
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: item.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>
                  )}
                  <View style={[styles.actionContent, isSquareCard && { alignItems: 'center' }]}>
                  <Text style={styles.actionTitle}>{item.title}</Text>
                  <Text style={styles.actionDescription}>
                    {item.description}
                  </Text>
                </View>
              </Pressable>
              );
            }}
          />
        </View>

        {/* Streak Info */}
        <View style={styles.actionsSection}>
          <View style={styles.streakInfoCard}>
            {/* Current Streak */}
            <View style={styles.streakInfoRow}>
              <View style={styles.streakInfoLabelContainer}>
                <Text style={styles.streakInfoLabel}>Current Streak</Text>
                <Text style={[styles.streakInfoValue, styles.streakInfoValueHighlight]}>
                  {currentStreak} days 🔥
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${Math.min((currentStreak / Math.max(longestStreak, 30)) * 100, 100)}%`,
                      backgroundColor: colors.brand.orange,
                    }
                  ]} 
                />
              </View>
            </View>

            {/* Longest Streak */}
            <View style={[styles.streakInfoRow, styles.streakInfoRowLast]}>
              <View style={styles.streakInfoLabelContainer}>
                <Text style={styles.streakInfoLabel}>Longest Streak</Text>
                <Text style={styles.streakInfoValue}>
                  {longestStreak} days
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: '100%',
                      backgroundColor: colors.brand.purple,
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

