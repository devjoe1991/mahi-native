import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { ProfileBodyProps } from './types';
import { Post } from './Post';
import { CollectionCard } from './CollectionCard';
import { PostData } from '../../screens/userProfileScreen/types';
import { getPostsByUserId } from '../../data/posts';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');

type TabType = 'images' | 'videos';

const PostsTab: React.FC<{ 
  userId: string; 
  refreshing?: boolean;
  onMomentumScrollBegin?: (event: any) => void;
  onMomentumScrollEnd?: (event: any) => void;
}> = ({
  userId,
  refreshing,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
}) => {
  const { colors, spacing } = useTheme();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [fetching, setFetching] = useState(true);
  const [errorFetching, setErrorFetching] = useState(false);

  const fetchPosts = async () => {
    try {
      setFetching(true);
      setErrorFetching(false);
      const userPosts = await getPostsByUserId(userId);
      setPosts(userPosts);
    } catch (error) {
      setErrorFetching(true);
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    if (refreshing) {
      fetchPosts();
    }
  }, [refreshing]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      minHeight: 0, // Important for FlatList scrolling
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reloadButton: {
      alignItems: 'center',
      marginTop: spacing.md,
    },
    reloadText: {
      color: colors.primary[500],
      fontWeight: '600',
      marginTop: spacing.sm,
    },
    postsGrid: {
      paddingHorizontal: spacing.md, // Proper horizontal padding
      paddingTop: spacing.xs,
      paddingBottom: 100, // Space for tab bar
    },
    emptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xl * 2,
    },
    emptyText: {
      color: colors.text.secondary,
      fontSize: 16,
    },
  });

  if (fetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (errorFetching) {
    return (
      <View style={styles.errorContainer}>
        <Pressable onPress={fetchPosts} style={styles.reloadButton}>
          <Ionicons name="reload-circle" color={colors.primary[500]} size={50} />
          <Text style={styles.reloadText}>Reload</Text>
        </Pressable>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={64} color={colors.text.secondary} />
        <Text style={styles.emptyText}>No posts yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <Post postData={item} />}
      numColumns={2}
      contentContainerStyle={styles.postsGrid}
      columnWrapperStyle={{ justifyContent: 'flex-start' }}
      showsVerticalScrollIndicator={false}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
    />
  );
};

const VideosTab: React.FC<{
  onMomentumScrollBegin?: (event: any) => void;
  onMomentumScrollEnd?: (event: any) => void;
}> = ({
  onMomentumScrollBegin,
  onMomentumScrollEnd,
}) => {
  const { colors, spacing } = useTheme();
  const videoCollections = [1, 2, 3, 4, 5, 6];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      minHeight: 0, // Important for FlatList scrolling
    },
    list: {
      paddingBottom: 100, // Space for tab bar
    },
    emptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xl * 2,
    },
    emptyText: {
      color: colors.text.secondary,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={videoCollections}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <CollectionCard
            title={`Collection ${item}`}
            images={[
              'https://via.placeholder.com/200x200?text=Video+1',
              'https://via.placeholder.com/200x200?text=Video+2',
              'https://via.placeholder.com/200x200?text=Video+3',
              'https://via.placeholder.com/200x200?text=Video+4',
            ]}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam-outline" size={64} color={colors.text.secondary} />
            <Text style={styles.emptyText}>No videos yet</Text>
          </View>
        }
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
    </View>
  );
};

export const ProfileBody: React.FC<ProfileBodyProps> = ({
  userId,
  refreshing,
  onRefresh,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
}) => {
  const { colors, spacing, typography } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('images');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      backgroundColor: colors.background.primary,
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
      textTransform: 'none',
    },
    activeTabText: {
      color: colors.text.primary,
      fontWeight: typography.h2.fontWeight as any,
    },
    content: {
      flex: 1,
      minHeight: 0, // Important for FlatList scrolling
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'images' && styles.activeTab]}
          onPress={() => setActiveTab('images')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'images' && styles.activeTabText,
            ]}
          >
            Images
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'videos' && styles.activeTabText,
            ]}
          >
            VIDS
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {activeTab === 'images' ? (
          <PostsTab 
            userId={userId} 
            refreshing={refreshing}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
        ) : (
          <VideosTab 
            onMomentumScrollBegin={onMomentumScrollBegin}
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
        )}
      </View>
    </View>
  );
};

