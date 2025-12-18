import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { PostData } from '../../screens/userProfileScreen/types';
import { useAuth } from '../../store/auth-context';
import { useBottomSheet } from '../globals/globalBottomSheet';
import { getUserById } from '../../data/user';
import { useNavigation } from '../../store/navigation-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const IMAGE_ASPECT_RATIO = 9 / 16; // 9:16 aspect ratio (vertical/portrait)
// Full width for full-screen experience
const POST_WIDTH = SCREEN_WIDTH;
// Calculate available height: screen height minus header (~100px) and tab bar (~80px)
const HEADER_HEIGHT = 100;
const TAB_BAR_HEIGHT = 80;
const FOOTER_OVERLAY_HEIGHT = 110; // Space needed for footer overlay
const AVAILABLE_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - TAB_BAR_HEIGHT;
// Reduce post height significantly to ensure footer overlay is fully visible above tab bar
// Footer overlay will be positioned on the bottom portion of the image
const POST_HEIGHT = AVAILABLE_HEIGHT - FOOTER_OVERLAY_HEIGHT; // Reserve space for footer
const IMAGE_HEIGHT = POST_HEIGHT; // Image fills container, footer overlays on it

interface FeedPostProps {
  post: PostData;
  onPress?: () => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({ post, onPress }) => {
  const { colors, spacing, typography, theme } = useTheme();
  const { userData } = useAuth();
  const { openSheet } = useBottomSheet();
  const { navigate } = useNavigation();
  const [postAuthorStreak, setPostAuthorStreak] = React.useState<number | null>(null);
  const [postAuthorTrophyCount, setPostAuthorTrophyCount] = React.useState<number>(0);

  // Fetch post author's streak and trophy count
  React.useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const author = await getUserById(post.userId);
        setPostAuthorStreak(author?.streak_days || null);
        // Calculate trophy count (every 7 days = 1 trophy)
        const trophyCount = author?.streak_days ? Math.floor(author.streak_days / 7) : 0;
        setPostAuthorTrophyCount(trophyCount);
      } catch (error) {
        // Silently fail - badges are optional
      }
    };
    fetchAuthorData();
  }, [post.userId]);

  const styles = StyleSheet.create({
    container: {
      width: POST_WIDTH,
      height: POST_HEIGHT,
      backgroundColor: colors.background.primary500,
      overflow: 'hidden',
      justifyContent: 'flex-end', // Ensure footer is positioned at bottom
    },
    imageContainer: {
      position: 'relative',
      width: POST_WIDTH,
      height: POST_HEIGHT,
    },
    image: {
      width: POST_WIDTH,
      height: POST_HEIGHT,
      resizeMode: 'cover',
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      // Add gradient overlay for better text readability
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: spacing.md,
      backgroundColor: colors.primary[500],
      borderWidth: 1,
      borderColor: colors.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    },
    headerText: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    username: {
      fontSize: typography.body.fontSize - 2,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.background.primary,
      letterSpacing: 0.15,
      lineHeight: (typography.body.fontSize - 2) * 1.3,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.brand.orange,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderRadius: 12,
      marginLeft: spacing.xs,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
      elevation: 2,
    },
    streakText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600',
      color: colors.background.primary,
      marginLeft: 3,
      letterSpacing: 0.1,
    },
    trophyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary[500],
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderRadius: 12,
      marginLeft: spacing.xs,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
      elevation: 2,
    },
    trophyEmoji: {
      fontSize: 10,
    },
    trophyText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600',
      color: colors.background.primary,
      marginLeft: 3,
      letterSpacing: 0.1,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 10, // Ensure footer is above image
      height: 110, // Fixed height to ensure consistency
    },
    caption: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      fontWeight: '400',
      color: colors.background.primary,
      marginBottom: spacing.xs,
      letterSpacing: 0.15,
      lineHeight: (typography.body.fontSize - 2) * 1.3,
      maxHeight: 50, // Limit caption height to ensure footer fits
    },
    captionUsername: {
      fontSize: typography.body.fontSize - 2,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.background.primary,
      letterSpacing: 0.15,
    },
    stats: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 0,
      marginBottom: spacing.xs,
    },
    statsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statText: {
      fontSize: 12,
      fontFamily: typography.body.fontFamily,
      color: colors.background.primary,
      marginLeft: spacing.xs,
      letterSpacing: 0.15,
      lineHeight: 12 * 1.3,
    },
    commentButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing.md,
    },
    saveButton: {
      padding: spacing.xs,
    },
    heartIcon: {
      // Interactive element styling
    },
  });

  // Handle both local assets (number) and remote URIs (string)
  const imageSource = typeof post.imageUrl === 'number' 
    ? post.imageUrl 
    : { uri: post.imageUrl };

  // Get user avatar - for now use Joe John's data from auth context
  // In real app, fetch post author's data
  const avatarSource = userData?.picturePath
    ? typeof userData.picturePath === 'number'
      ? userData.picturePath
      : { uri: userData.picturePath }
    : null;

  const handleProfilePress = () => {
    navigate('UserProfileScreen', { userId: post.userId, viewMode: true });
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
        <View style={styles.header}>
          <Pressable onPress={handleProfilePress}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatar} />
            ) : (
              <View style={styles.avatar} />
            )}
          </Pressable>
          <View style={styles.headerText}>
            <Pressable onPress={handleProfilePress}>
              <Text style={styles.username}>{userData?.username || 'joe'}</Text>
            </Pressable>
            {postAuthorStreak !== null && postAuthorStreak > 0 && (
              <View style={styles.streakBadge}>
                <Ionicons name="flame" size={12} color={colors.background.primary} />
                <Text style={styles.streakText}>{postAuthorStreak}</Text>
              </View>
            )}
            {postAuthorTrophyCount > 0 && (
              <View style={styles.trophyBadge}>
                <Text style={styles.trophyEmoji}>🏆</Text>
                <Text style={styles.trophyText}>{postAuthorTrophyCount}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.footer}>
        <View style={styles.stats}>
          <View style={styles.statsLeft}>
            <Pressable style={styles.heartIcon}>
              <Ionicons 
                name="heart-outline" 
                size={22} 
                color={colors.background.primary} 
              />
            </Pressable>
            <Text style={styles.statText}>{post.likes || 0}</Text>
            <Pressable
              style={styles.commentButton}
              onPress={() => openSheet('COMMENTS', { postId: post._id })}
            >
              <Ionicons 
                name="chatbubble-outline" 
                size={22} 
                color={colors.background.primary} 
              />
              <Text style={styles.statText}>{post.comments || 0}</Text>
            </Pressable>
          </View>
            <Pressable style={styles.saveButton}>
            <Ionicons 
              name="bookmark-outline" 
              size={22} 
              color={colors.background.primary} 
            />
          </Pressable>
        </View>
        {post.caption && (
          <Text style={styles.caption} numberOfLines={2} ellipsizeMode="tail">
            <Text style={styles.captionUsername} onPress={handleProfilePress}>{userData?.username || 'joe'}</Text> {post.caption}
          </Text>
        )}
        </View>
      </View>
    </Pressable>
  );
};

