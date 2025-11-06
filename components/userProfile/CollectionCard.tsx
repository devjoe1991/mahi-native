import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { CollectionCardProps } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const CARD_WIDTH = (SCREEN_WIDTH - 16) / 2 - 4;
const IMAGE_SIZE = CARD_WIDTH / 2;

export const CollectionCard: React.FC<CollectionCardProps> = ({
  title = 'Collection',
  images = [],
  onPress,
}) => {
  const { colors, spacing, typography } = useTheme();

  // Default images if none provided
  const displayImages = images.length > 0
    ? images.slice(0, 4)
    : [
        'https://via.placeholder.com/200x200?text=1',
        'https://via.placeholder.com/200x200?text=2',
        'https://via.placeholder.com/200x200?text=3',
        'https://via.placeholder.com/200x200?text=4',
      ];

  const styles = StyleSheet.create({
    container: {
      width: CARD_WIDTH,
      height: CARD_WIDTH,
      margin: spacing.xs,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.background.secondary,
    },
    grid: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    imageContainer: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
    },
    image: {
      width: '100%',
      height: '100%',
      opacity: 0.5,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: colors.text.primary,
      textAlign: 'center',
      fontWeight: typography.h2.fontWeight as any,
      fontSize: 18,
      fontFamily: typography.h2.fontFamily,
      textShadowColor: colors.text.primary,
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
  });

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.grid}>
        {displayImages.map((imageUri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        ))}
      </View>
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  );
};

