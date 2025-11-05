import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme/ThemeProvider';
import { useSidebar } from '../Sidebar';

interface AnimatedHamburgerMenuProps {
  size?: number;
}

export const AnimatedHamburgerMenu: React.FC<AnimatedHamburgerMenuProps> = ({
  size = 30,
}) => {
  const { colors } = useTheme();
  const { isOpen, toggleSidebar } = useSidebar();
  
  // Line animation values
  const line1Rotation = useSharedValue(0);
  const line1TranslateY = useSharedValue(0);
  const line2Opacity = useSharedValue(1);
  const line3Rotation = useSharedValue(0);
  const line3TranslateY = useSharedValue(0);

  // Animated styles for line 1 (top line)
  const line1AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${line1Rotation.value}deg` },
        { translateY: line1TranslateY.value },
      ],
    };
  });

  // Animated styles for line 2 (middle line)
  const line2AnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: line2Opacity.value,
    };
  });

  // Animated styles for line 3 (bottom line)
  const line3AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${line3Rotation.value}deg` },
        { translateY: line3TranslateY.value },
      ],
    };
  });

  // Sync hamburger animation with sidebar state
  useEffect(() => {
    if (isOpen) {
      // Open animation (hamburger to X)
      line1Rotation.value = withSpring(45, { damping: 12, stiffness: 200 });
      line1TranslateY.value = withSpring(6, { damping: 12, stiffness: 200 });
      line2Opacity.value = withTiming(0, { duration: 200 });
      line3Rotation.value = withSpring(-45, { damping: 12, stiffness: 200 });
      line3TranslateY.value = withSpring(-6, { damping: 12, stiffness: 200 });
    } else {
      // Close animation (X to hamburger)
      line1Rotation.value = withSpring(0, { damping: 12, stiffness: 200 });
      line1TranslateY.value = withSpring(0, { damping: 12, stiffness: 200 });
      line2Opacity.value = withTiming(1, { duration: 200 });
      line3Rotation.value = withSpring(0, { damping: 12, stiffness: 200 });
      line3TranslateY.value = withSpring(0, { damping: 12, stiffness: 200 });
    }
  }, [isOpen, line1Rotation, line1TranslateY, line2Opacity, line3Rotation, line3TranslateY]);

  const styles = StyleSheet.create({
    container: {
      width: size + 10, // Increased touchable area
      height: size + 10, // Increased touchable area
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      zIndex: 100, // Ensure it's above everything
    },
    lineContainer: {
      width: size * 0.6,
      height: size * 0.4,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    line: {
      width: '100%',
      height: 2,
      backgroundColor: colors.text.primary,
      borderRadius: 1,
    },
  });

  return (
    <Pressable 
      onPress={toggleSidebar} 
      style={styles.container}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase hit area
    >
      <View style={styles.lineContainer}>
        <Animated.View style={[styles.line, line1AnimatedStyle]} />
        <Animated.View style={[styles.line, line2AnimatedStyle]} />
        <Animated.View style={[styles.line, line3AnimatedStyle]} />
      </View>
    </Pressable>
  );
};

