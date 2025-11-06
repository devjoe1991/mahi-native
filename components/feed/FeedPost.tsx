import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { PostData } from '../../screens/userProfileScreen/types';
import { useAuth } from '../../store/auth-context';
import { useBottomSheet } from '../globals/globalBottomSheet';
import { getUserById } from '../../data/user';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const POST_HORIZONTAL_MARGIN = 16; // Horizontal margin on each side
const MAX_IMAGE_HEIGHT = 350; // Reduced maximum image height
const IMAGE_ASPECT_RATIO = 4 / 3; // Image aspect ratio
// Calculate max width based on aspect ratio and max height
const MAX_IMAGE_WIDTH = MAX_IMAGE_HEIGHT * IMAGE_ASPECT_RATIO;
// Container width should match the image width exactly (screen width minus margins, capped at max)
const POST_WIDTH = Math.min(SCREEN_WIDTH - (POST_HORIZONTAL_MARGIN * 2), MAX_IMAGE_WIDTH);

// Motivational colors - Purple and Aura accents
const MOTIVATIONAL_PURPLE = '#8B5CF6';
const AURA_BLUE = '#2176AE';

interface FeedPostProps {
  post: PostData;
  onPress?: () => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({ post, onPress }) => {
  const { colors, spacing, typography, theme } = useTheme();
  const { userData } = useAuth();
  const { openSheet } = useBottomSheet();
  const [postAuthorStreak, setPostAuthorStreak] = React.useState<number | null>(null);

  // Fetch post author's streak
  React.useEffect(() => {
    const fetchAuthorStreak = async () => {
      try {
        const author = await getUserById(post.userId);
        setPostAuthorStreak(author?.streak_days || null);
      } catch (error) {
        // Silently fail - streak badge is optional
      }
    };
    fetchAuthorStreak();
  }, [post.userId]);

  const styles = StyleSheet.create({
    container: {
      width: POST_WIDTH,
      alignSelf: 'center',
      backgroundColor: colors.background.secondary,
      marginBottom: spacing.lg,
      marginHorizontal: POST_HORIZONTAL_MARGIN, // Consistent horizontal margin
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: theme === 'dark' ? 0 : 1,
      borderColor: theme === 'dark' ? 'transparent' : colors.border.primary,
      // Refined shadow for depth and elegance
      shadowColor: theme === 'dark' ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme === 'dark' ? 0.4 : 0.08,
      shadowRadius: theme === 'dark' ? 12 : 16,
      elevation: theme === 'dark' ? 8 : 4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md + spacing.xs,
      paddingBottom: spacing.md,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginRight: spacing.md,
      backgroundColor: colors.primary[500],
      // Refined border with subtle glow
      borderWidth: 2.5,
      borderColor: theme === 'dark' 
        ? `${colors.brand.blue}60` 
        : `${colors.brand.purple}40`,
      shadowColor: theme === 'dark' ? colors.brand.blue : colors.brand.purple,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    headerText: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    username: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.brand.orange,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: spacing.xs,
      shadowColor: colors.brand.orange,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    streakText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600',
      color: colors.background.primary,
      marginLeft: 2,
    },
    image: {
      width: POST_WIDTH, // Match container width exactly
      height: Math.min(POST_WIDTH / IMAGE_ASPECT_RATIO, MAX_IMAGE_HEIGHT), // Calculate height, cap at max
      resizeMode: 'cover',
    },
    footer: {
      padding: spacing.md + spacing.xs,
      paddingTop: spacing.md,
    },
    caption: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    stats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
    },
    statText: {
      fontSize: 12,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    commentButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing.md,
    },
    // Motivational accent for interactive elements
    heartIcon: {
      // Subtle purple/blue tint for motivational feel
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

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        {avatarSource ? (
          <Image source={avatarSource} style={styles.avatar} />
        ) : (
          <View style={styles.avatar} />
        )}
        <View style={styles.headerText}>
          <Text style={styles.username}>{userData?.username || 'joe'}</Text>
          {postAuthorStreak !== null && postAuthorStreak > 0 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={12} color={colors.background.primary} />
              <Text style={styles.streakText}>{postAuthorStreak}</Text>
            </View>
          )}
        </View>
      </View>
      
      <Image source={imageSource} style={styles.image} />
      
      <View style={styles.footer}>
        <View style={styles.stats}>
          <Pressable style={styles.heartIcon}>
            <Ionicons 
              name="heart-outline" 
              size={22} 
              color={theme === 'dark' ? colors.brand.red : colors.brand.pink} 
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
              color={theme === 'dark' ? colors.brand.blue : colors.brand.blue100} 
            />
            <Text style={styles.statText}>{post.comments || 0}</Text>
          </Pressable>
        </View>
        {post.caption && (
          <Text style={styles.caption}>
            <Text style={styles.username}>{userData?.username || 'joe'}</Text> {post.caption}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

