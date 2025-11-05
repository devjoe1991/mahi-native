import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';

interface PlusButtonProps {
  pressed: boolean;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

export const PlusButton: React.FC<PlusButtonProps> = ({
  pressed,
  onPress,
  onPressIn,
  onPressOut,
}) => {
  const { colors } = useTheme();

  const rotation = useSharedValue(0);
  const rotationAnimation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  React.useEffect(() => {
    rotation.value = withSpring(pressed ? 135 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [pressed, rotation]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.container}
    >
      <LinearGradient
        colors={[colors.primary[500], colors.primary[500]]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Animated.View style={[styles.iconContainer, rotationAnimation]}>
          <Ionicons name="add" size={24} color={colors.background.primary} />
        </Animated.View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

