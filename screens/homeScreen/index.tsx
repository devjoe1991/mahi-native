import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';
import { BottomTabBar, TabType } from '../../components/bottomTabBar';
import { GlobalHeader } from '../../components/globals/GlobalHeader';
import { FeedPost } from '../../components/feed';
import { getAllPosts } from '../../data/posts';
import { PostData } from '../userProfileScreen/types';
import { useBottomSheet } from '../../components/globals/globalBottomSheet';
import { useAuth } from '../../store/auth-context';
import { StreakBar, CONTAINER_HEIGHT } from '../../components/globals/StreakBar';
import { getStreakFeeds } from '../../data/streaks';

export const HomeScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { openSheet } = useBottomSheet();
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  // Reanimated shared values for scroll detection
  const StoryTranslate = useSharedValue(false); // true = hide, false = show
  const lastScrollY = useSharedValue(0);

  // Get streak data based on user's current streak
  const streakDays = userData?.streak_days || 1;
  const streaks = getStreakFeeds(streakDays);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Animated style for streak bar based on scroll direction
  const streakBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: StoryTranslate.value
        ? withTiming(-CONTAINER_HEIGHT, { duration: 250 })
        : withTiming(0, { duration: 250 }),
      opacity: StoryTranslate.value
        ? withTiming(0, { duration: 250 })
        : withTiming(1, { duration: 250 }),
    };
  });

  // Handle momentum scroll begin - detect scroll direction
  const handleMomentumScrollBegin = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    
    // Always show streak bar when near top (within 50px)
    if (scrollY <= 50) {
      StoryTranslate.value = false;
      return;
    }
    
    // Determine scroll direction
    if (scrollY > lastScrollY.value) {
      // Scrolling down - hide streak bar
      StoryTranslate.value = true;
    } else {
      // Scrolling up - show streak bar
      StoryTranslate.value = false;
    }
  };

  // Handle momentum scroll end - save final scroll position
  const handleMomentumScrollEnd = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    lastScrollY.value = scrollY;
    
    // Ensure streak bar is visible when at top
    if (scrollY <= 50) {
      StoryTranslate.value = false;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    headerContainer: {
      zIndex: 10,
    },
    streakBarContainer: {
      backgroundColor: colors.background.primary,
      // No visible border - clean separation
      marginBottom: 0, // No margin to prevent gap
    },
    content: {
      flex: 1,
      paddingBottom: 100, // Space for tab bar
    },
    feed: {
      paddingTop: spacing.md,
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

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tab: TabType) => {
    if (tab === 'plus') {
      openSheet('STREAK_UPDATE', {
        userId: userData?._id,
        onSaved: () => {
          fetchPosts();
        },
      });
    } else {
      setActiveTab(tab);
    }
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleNotificationsPress = () => {
    console.log('Notifications pressed');
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <GlobalHeader
          onSearchPress={handleSearchPress}
          onNotificationsPress={handleNotificationsPress}
          onMenuPress={handleMenuPress}
          showUnreadBadge={true}
        />
      </View>

      {/* Streak Bar - Hidden/Shown on scroll */}
      {streaks.length > 0 && (
        <Animated.View
          style={[styles.streakBarContainer, streakBarAnimatedStyle]}
        >
          <StreakBar streaks={streaks} />
        </Animated.View>
      )}

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        ) : posts.length > 0 ? (
          <ScrollView
            style={styles.feed}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.md }}
            onMomentumScrollBegin={handleMomentumScrollBegin}
            onMomentumScrollEnd={handleMomentumScrollEnd}
          >
            {posts.map((post) => (
              <FeedPost key={post._id} post={post} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        )}
      </View>
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};
