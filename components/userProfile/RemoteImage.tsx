import React, { useState } from 'react';
import { Image, ImageProps, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface RemoteImageProps extends Omit<ImageProps, 'source'> {
  uri?: string | number; // Can be URI string or require() asset number
  placeholder?: string | number;
  showPlaceholder?: boolean;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
}

export const RemoteImage: React.FC<RemoteImageProps> = ({
  uri,
  placeholder,
  showPlaceholder = true,
  fallbackIcon = 'image-outline',
  style,
  ...props
}) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background.secondary,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholder: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background.secondary,
    },
    loadingContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // Handle local assets (number) vs remote URIs (string)
  const getImageSource = (img: string | number | undefined) => {
    if (!img) return null;
    if (typeof img === 'number') return img; // Local asset
    return { uri: img }; // Remote URI
  };

  const imageSource = getImageSource(uri);
  const placeholderSource = getImageSource(placeholder);

  // If no URI and no placeholder, show fallback
  if (!imageSource && !placeholderSource) {
    return (
      <View style={[styles.container, style]}>
        <Ionicons name={fallbackIcon} size={48} color={colors.text.secondary} />
      </View>
    );
  }

  // If error or no URI, show placeholder or fallback
  if (error || !imageSource) {
    if (placeholderSource) {
      return (
        <Image
          source={placeholderSource}
          style={[styles.image, style]}
          {...props}
        />
      );
    }
    return (
      <View style={[styles.placeholder, style]}>
        <Ionicons name={fallbackIcon} size={48} color={colors.text.secondary} />
      </View>
    );
  }

  // For local assets, don't show loading (they load instantly)
  const isLocalAsset = typeof uri === 'number';

  return (
    <View style={[styles.container, style]}>
      <Image
        source={imageSource}
        style={[styles.image, style]}
        onLoadStart={isLocalAsset ? undefined : handleLoadStart}
        onLoadEnd={isLocalAsset ? undefined : handleLoadEnd}
        onError={isLocalAsset ? undefined : handleError}
        {...props}
      />
      {loading && !isLocalAsset && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
        </View>
      )}
    </View>
  );
};

