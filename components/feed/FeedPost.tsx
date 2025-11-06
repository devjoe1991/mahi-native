import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { PostData } from '../../screens/userProfileScreen/types';
import { useAuth } from '../../store/auth-context';
import { useBottomSheet } from '../globals/globalBottomSheet';

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

  const styles = StyleSheet.create({
    container: {
      width: POST_WIDTH,
      alignSelf: 'center',
      backgroundColor: colors.background.secondary,
      marginBottom: spacing.md,
      marginHorizontal: POST_HORIZONTAL_MARGIN, // Consistent horizontal margin
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border.primary,
      // Subtle aura shadow for motivational feel
      shadowColor: theme === 'dark' ? AURA_BLUE : MOTIVATIONAL_PURPLE,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === 'dark' ? 0.2 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: spacing.sm,
      backgroundColor: colors.primary[500],
      // Subtle aura border
      borderWidth: 2,
      borderColor: theme === 'dark' ? `${AURA_BLUE}40` : `${MOTIVATIONAL_PURPLE}30`,
    },
    headerText: {
      flex: 1,
    },
    username: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
    },
    image: {
      width: POST_WIDTH, // Match container width exactly
      height: Math.min(POST_WIDTH / IMAGE_ASPECT_RATIO, MAX_IMAGE_HEIGHT), // Calculate height, cap at max
      resizeMode: 'cover',
    },
    footer: {
      padding: spacing.md,
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
      marginTop: spacing.xs,
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
        </View>
      </View>
      
      <Image source={imageSource} style={styles.image} />
      
      <View style={styles.footer}>
        <View style={styles.stats}>
          <Pressable style={styles.heartIcon}>
            <Ionicons 
              name="heart-outline" 
              size={20} 
              color={theme === 'dark' ? `${AURA_BLUE}CC` : `${MOTIVATIONAL_PURPLE}CC`} 
            />
          </Pressable>
          <Text style={styles.statText}>{post.likes || 0}</Text>
          <Pressable
            style={styles.commentButton}
            onPress={() => openSheet('COMMENTS', { postId: post._id })}
          >
            <Ionicons 
              name="chatbubble-outline" 
              size={20} 
              color={theme === 'dark' ? `${AURA_BLUE}CC` : `${MOTIVATIONAL_PURPLE}CC`} 
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

