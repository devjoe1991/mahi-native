import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { PostData } from '../../screens/userProfileScreen/types';
import { useAuth } from '../../store/auth-context';
import { useBottomSheet } from '../globals/globalBottomSheet';
import { getUserById } from '../../data/user';
import { useNavigation } from '../../store/navigation-context';

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
      alignSelf: 'center',
      backgroundColor: colors.background.primary500,
      marginBottom: spacing.lg,
      marginHorizontal: POST_HORIZONTAL_MARGIN, // Consistent horizontal margin
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: theme === 'dark' ? 0 : 1,
      borderColor: theme === 'dark' ? 'transparent' : colors.border.primary,
      // Refined shadow for depth and elegance
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    imageContainer: {
      position: 'relative',
      width: POST_WIDTH,
    },
    image: {
      width: POST_WIDTH, // Match container width exactly
      height: Math.min(POST_WIDTH / IMAGE_ASPECT_RATIO, MAX_IMAGE_HEIGHT), // Calculate height, cap at max
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
      padding: spacing.lg,
      paddingTop: spacing.sm,
    },
    caption: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      fontWeight: '400',
      color: colors.text.primary,
      marginBottom: spacing.xs,
      letterSpacing: 0.15,
      lineHeight: (typography.body.fontSize - 2) * 1.3,
    },
    captionUsername: {
      fontSize: typography.body.fontSize - 2,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
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
      color: colors.text.secondary,
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
      </View>
      
      <View style={styles.footer}>
        <View style={styles.stats}>
          <View style={styles.statsLeft}>
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
          <Pressable style={styles.saveButton}>
            <Ionicons 
              name="bookmark-outline" 
              size={22} 
              color={colors.text.secondary} 
            />
          </Pressable>
        </View>
        {post.caption && (
          <Text style={styles.caption}>
            <Text style={styles.captionUsername} onPress={handleProfilePress}>{userData?.username || 'joe'}</Text> {post.caption}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

