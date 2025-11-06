import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { GlobalHeaderProps } from './types';
import { HeaderSVG } from './HeaderSVG';
import { AnimatedHamburgerMenu } from './AnimatedHamburgerMenu';
import { MahiTextLogo } from './MahiTextLogo';
import { IconButton } from './IconButton';

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  onSearchPress,
  onNotificationsPress,
  onMenuPress,
  showUnreadBadge = false,
  unreadCount,
}) => {
  const { colors, spacing } = useTheme();
  const { width: SCREEN_WIDTH } = Dimensions.get('screen');
  const [headerHeight, setHeaderHeight] = useState(80);

  // Responsive spacing based on screen width
  const horizontalPadding = SCREEN_WIDTH < 375 ? spacing.md : spacing.lg;
  const horizontalMargin = SCREEN_WIDTH < 375 ? spacing.md : spacing.lg;

  // Menu press is now handled directly by AnimatedHamburgerMenu via sidebar context
  // This callback is kept for backwards compatibility if needed
  const handleMenuPress = () => {
    onMenuPress?.();
  };

  const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: 'transparent', // Transparent to show curve
      zIndex: 10,
      overflow: 'visible',
      paddingBottom: 25, // Allow space for curve
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 0,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      paddingHorizontal: horizontalMargin, // Use padding instead of margin for proper positioning
      minHeight: 75,
      position: 'relative',
      width: '100%',
      overflow: 'visible',
    },
    leftContainer: {
      position: 'absolute',
      left: horizontalMargin, // Position from container's left edge (which is now at screen edge)
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 100, // Increased to ensure it's above SVG and other elements
      justifyContent: 'center',
    },
    centerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      zIndex: 2,
      paddingHorizontal: spacing.md,
    },
    rightContainer: {
      position: 'absolute',
      right: horizontalMargin, // Match left container positioning
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 2,
      justifyContent: 'center',
    },
    svgContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: -25, // Extend below to show curve
      zIndex: 0,
      overflow: 'visible',
    },
  });

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
    <View
      style={styles.container}
      onLayout={(e) => {
        setHeaderHeight(e.nativeEvent.layout.height);
      }}
    >
      <View style={styles.svgContainer}>
        <HeaderSVG headerHeight={headerHeight} />
      </View>

      <View style={styles.leftContainer}>
        <AnimatedHamburgerMenu
            size={SCREEN_WIDTH < 375 ? 26 : 30}
        />
      </View>

      <View style={styles.centerContainer}>
          <MahiTextLogo 
            size={SCREEN_WIDTH < 375 ? 'medium' : 'large'} 
            showSubtitle={true} 
          />
      </View>

      <View style={styles.rightContainer}>
        <IconButton
          icon="search"
          onPress={onSearchPress || (() => {})}
        />
        <IconButton
          icon="notifications-outline"
          onPress={onNotificationsPress || (() => {})}
          badge={showUnreadBadge}
          badgeCount={unreadCount}
        />
      </View>
    </View>
    </SafeAreaView>
  );
};

