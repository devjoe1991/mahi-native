import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Animated } from 'react-native';
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
  const scrollY = useRef(new Animated.Value(0)).current;
  const streakBarOpacity = useRef(new Animated.Value(1)).current;
  const streakBarTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

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

  // Handle scroll to hide/show streak bar
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const scrollingDown = currentScrollY > lastScrollY.current;
        const scrollingUp = currentScrollY < lastScrollY.current;

        if (scrollingDown && currentScrollY > 50) {
          // Hide streak bar when scrolling down
          Animated.parallel([
            Animated.timing(streakBarOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(streakBarTranslateY, {
              toValue: -CONTAINER_HEIGHT,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        } else if (scrollingUp || currentScrollY <= 50) {
          // Show streak bar when scrolling up or near top
          Animated.parallel([
            Animated.timing(streakBarOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(streakBarTranslateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );

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
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
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
          style={[
            styles.streakBarContainer,
            {
              opacity: streakBarOpacity,
              transform: [{ translateY: streakBarTranslateY }],
            },
          ]}
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
          <Animated.ScrollView
            style={styles.feed}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.md }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {posts.map((post) => (
              <FeedPost key={post._id} post={post} />
            ))}
          </Animated.ScrollView>
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
