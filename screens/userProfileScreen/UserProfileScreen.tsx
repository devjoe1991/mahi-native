import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Pressable, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../store/auth-context';
import { UserProfileScreenProps } from './types';
import { ProfileHeader } from '../../components/userProfile/ProfileHeader';
import { ProfileBody } from '../../components/userProfile/ProfileBody';
import { ProfileHeaderSVG } from '../../components/userProfile/ProfileHeaderSVG';
import { ProfileHeaderComponent } from '../../components/userProfile/ProfileHeaderComponent';
import { getUserById, isFollowing, followUser, unfollowUser } from '../../data/user';
import { CalendarHeatmap } from '../../components/calendarHeatmap';
import { getPostsByUserId } from '../../data/posts';
import { PostData } from './types';
import { Post } from '../../components/userProfile/Post';

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  viewMode: propViewMode,
  userId,
  onNavigate,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { userData: currentUserData } = useAuth();
  const [headerHeight, setHeaderHeight] = useState(150);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(currentUserData);
  const [loading, setLoading] = useState(false);
  const [heatmapHeight, setHeatmapHeight] = useState(250); // Approximate height
  const [posts, setPosts] = useState<PostData[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'mahi'>('feed');
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Reanimated shared values for scroll detection
  const heatmapTranslate = useSharedValue(false); // true = hide, false = show
  const lastScrollY = useSharedValue(0);

  // Automatically determine viewMode: if userId is provided and different from current user, it's viewMode
  const viewMode = propViewMode !== undefined 
    ? propViewMode 
    : (userId !== undefined && userId !== currentUserData?._id);

  // Fetch user data if viewing another user's profile
  useEffect(() => {
    const fetchUserData = async () => {
      if (viewMode && userId) {
        setLoading(true);
        try {
          const user = await getUserById(userId);
          if (user) {
            setUserData(user);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Use current user data
        setUserData(currentUserData);
      }
    };

    fetchUserData();
  }, [viewMode, userId, currentUserData]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (userData?._id) {
        try {
          setFetchingPosts(true);
          const userPosts = await getPostsByUserId(userData._id);
          setPosts(userPosts);
        } catch (error) {
          console.error('Failed to fetch posts:', error);
        } finally {
          setFetchingPosts(false);
        }
      }
    };

    fetchPosts();
  }, [userData?._id, refreshing]);

  // Check if current user is following this user
  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (viewMode && userId && currentUserData?._id) {
        try {
          const following = await isFollowing(currentUserData._id, userId);
          setIsFollowingUser(following);
        } catch (error) {
          console.error('Failed to check follow status:', error);
        }
      }
    };

    checkFollowingStatus();
  }, [viewMode, userId, currentUserData?._id]);

  if (!userData) {
    return null; // Or show loading/error state
  }

  // Animated style for heatmap based on scroll direction
  const heatmapAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: heatmapTranslate.value
        ? withTiming(-heatmapHeight, { duration: 250 })
        : withTiming(0, { duration: 250 }),
      opacity: heatmapTranslate.value
        ? withTiming(0, { duration: 250 })
        : withTiming(1, { duration: 250 }),
    };
  });

  // Handle scroll - detect scroll direction
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    
    // Always show heatmap when near top (within 50px)
    if (scrollY <= 50) {
      heatmapTranslate.value = false;
      lastScrollY.value = scrollY;
      return;
    }
    
    // Determine scroll direction
    if (scrollY > lastScrollY.value) {
      // Scrolling down - hide heatmap
      heatmapTranslate.value = true;
    } else {
      // Scrolling up - show heatmap
      heatmapTranslate.value = false;
    }
    
    lastScrollY.value = scrollY;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    headerContainer: {
      position: 'relative',
      zIndex: 1,
    },
    contentContainer: {
      flex: 1,
      zIndex: 2,
      minHeight: 0, // Important for FlatList scrolling
    },
    heatmapContainer: {
      backgroundColor: colors.background.primary,
      overflow: 'hidden',
    },
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      backgroundColor: colors.background.primary,
      zIndex: 10,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeTab: {
      borderBottomWidth: 3,
      borderBottomColor: colors.primary[500],
    },
    tabText: {
      fontSize: 18,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
    },
    activeTabText: {
      color: colors.text.primary,
      fontWeight: typography.h2.fontWeight as any,
    },
    postsGrid: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs,
      paddingBottom: 100, // Space for tab bar
    },
    mahiStatsContainer: {
      padding: spacing.lg,
      paddingBottom: 100, // Space for tab bar
    },
    statCard: {
      backgroundColor: colors.background.primary500,
      borderRadius: 20,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    statRowLast: {
      marginBottom: 0,
    },
    statLabel: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
    },
    statValue: {
      fontSize: typography.h3.fontSize,
      fontFamily: typography.h3.fontFamily,
      fontWeight: typography.h3.fontWeight as any,
      color: colors.text.primary,
    },
    statTitle: {
      fontSize: typography.h2.fontSize,
      fontFamily: typography.h2.fontFamily,
      fontWeight: typography.h2.fontWeight as any,
      color: colors.text.primary,
      marginBottom: spacing.lg,
    },
  });

          const handleEditPress = () => {
            // Open profile edit via bottom sheet (which redirects to full screen)
            // Or navigate directly
            onNavigate?.('EditProfileScreen');
          };

  const handleMessagePress = () => {
    onNavigate?.('MessagesScreen', { userId: userData._id });
  };

  const handleBackPress = () => {
    onNavigate?.('HomeScreen');
  };

  const handleSettingsPress = () => {
    onNavigate?.('SettingsScreen');
  };

  const handleFollowPress = async () => {
    if (!currentUserData?._id || !userData?._id || isFollowLoading) {
      return;
    }

    setIsFollowLoading(true);
    try {
      if (isFollowingUser) {
        // Unfollow
        await unfollowUser(currentUserData._id, userData._id);
        setIsFollowingUser(false);
        // Update followers count
        setUserData((prev) => ({
          ...prev!,
          followers: Math.max(0, (prev?.followers || 0) - 1),
        }));
      } else {
        // Follow
        await followUser(currentUserData._id, userData._id);
        setIsFollowingUser(true);
        // Update followers count
        setUserData((prev) => ({
          ...prev!,
          followers: (prev?.followers || 0) + 1,
        }));
      }
    } catch (error) {
      console.error('Failed to follow/unfollow user:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ProfileHeaderComponent
        onBackPress={handleBackPress}
        onSettingsPress={handleSettingsPress}
        onFollowPress={handleFollowPress}
        showBackButton={true} // Always show back button to go back to feed
        showSettingsButton={!viewMode}
        showFollowButton={viewMode}
        isFollowing={isFollowingUser}
      />
      <View style={styles.headerContainer}>
        <ProfileHeaderSVG headerHeight={headerHeight} />
        <View
          onLayout={(e) => {
            const height = e.nativeEvent.layout.height;
            setHeaderHeight(height / 2);
          }}
        >
          <ProfileHeader
            userData={userData}
            viewMode={viewMode}
            isFollowing={isFollowingUser}
            onEditPress={handleEditPress}
            onMessagePress={handleMessagePress}
            onFollowPress={handleFollowPress}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Shared Heatmap - Global, scrolls with content */}
          <Animated.View
            style={[styles.heatmapContainer, heatmapAnimatedStyle]}
            onLayout={(e) => {
              const height = e.nativeEvent.layout.height;
              if (height > 0) {
                setHeatmapHeight(height);
              }
            }}
          >
            <CalendarHeatmap 
              streakDays={userData.streak_days || 0}
              lastPostDate={userData.last_post_date ? new Date(userData.last_post_date) : null}
              restDays={userData.rest_days || []}
            />
          </Animated.View>
          
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
              onPress={() => setActiveTab('feed')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'feed' && styles.activeTabText,
                ]}
              >
                Feed
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'mahi' && styles.activeTab]}
              onPress={() => setActiveTab('mahi')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'mahi' && styles.activeTabText,
                ]}
              >
                My Mahi
              </Text>
            </Pressable>
          </View>

          {/* Tab Content */}
          {activeTab === 'feed' ? (
            <View style={styles.postsGrid}>
              {posts.length > 0 ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                  {posts.map((post) => (
                    <View key={post._id} style={{ width: '50%', padding: spacing.xs }}>
                      <Post postData={post} />
                    </View>
                  ))}
                </View>
              ) : (
                !fetchingPosts && (
                  <View style={{ paddingVertical: spacing.xl * 2, alignItems: 'center' }}>
                    <Text style={{ color: colors.text.secondary, fontSize: 16 }}>
                      No posts yet
                    </Text>
                  </View>
                )
              )}
            </View>
          ) : (
            <View style={styles.mahiStatsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statTitle}>My Mahi Stats</Text>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Current Streak</Text>
                  <Text style={styles.statValue}>
                    {userData.streak_days || 0} 🔥
                  </Text>
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Longest Streak</Text>
                  <Text style={styles.statValue}>
                    {userData.longest_streak || 0} 🔥
                  </Text>
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Milestone Badges</Text>
                  <Text style={styles.statValue}>
                    {Math.floor((userData.streak_days || 0) / 7)} 🏆
                  </Text>
                </View>
                
                <View style={[styles.statRow, styles.statRowLast]}>
                  <Text style={styles.statLabel}>Total Posts</Text>
                  <Text style={styles.statValue}>
                    {posts.length}
                  </Text>
                </View>
              </View>
              
              {userData.rest_days && userData.rest_days.length > 0 && (
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Rest Days</Text>
                  <Text style={styles.statLabel}>
                    {userData.rest_days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

