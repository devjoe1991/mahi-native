import React from 'react';
import { View, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { PostProps } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const GRID_PADDING = 16; // Horizontal padding for grid
const GRID_GAP = 2; // Gap between posts
const POST_WIDTH = (SCREEN_WIDTH - (GRID_PADDING * 2) - GRID_GAP) / 2; // Proper 2-column grid sizing

// Motivational colors - Purple and Aura accents
const MOTIVATIONAL_PURPLE = '#8B5CF6';
const AURA_BLUE = '#2176AE';

export const Post: React.FC<PostProps> = ({ postData, onPress }) => {
  const { colors, spacing, theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: POST_WIDTH,
      height: POST_WIDTH, // Square container
      marginBottom: GRID_GAP,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: colors.background.secondary,
      // Subtle aura shadow for motivational feel
      shadowColor: theme === 'dark' ? AURA_BLUE : MOTIVATIONAL_PURPLE,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme === 'dark' ? 0.15 : 0.06,
      shadowRadius: 4,
      elevation: 2,
      // Subtle border with aura tint
      borderWidth: 1,
      borderColor: theme === 'dark' ? `${AURA_BLUE}20` : `${MOTIVATIONAL_PURPLE}15`,
    },
    image: {
      width: '100%',
      height: '100%', // Fill container completely
      resizeMode: 'cover', // Cover to fill the square without distortion
    },
  });

  // Handle both local assets (number) and remote URIs (string)
  const imageSource = typeof postData.imageUrl === 'number' 
    ? postData.imageUrl 
    : { uri: postData.imageUrl };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image source={imageSource} style={styles.image} />
    </Pressable>
  );
};

