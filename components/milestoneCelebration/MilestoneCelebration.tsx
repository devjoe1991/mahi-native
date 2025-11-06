import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface MilestoneCelebrationProps {
  streakDays: number;
  onClose: () => void;
}

const MILESTONES = [7, 14, 30, 60, 100];

/**
 * Check if current streak is a milestone
 */
export const isMilestone = (streakDays: number): boolean => {
  return MILESTONES.includes(streakDays);
};

/**
 * Get milestone message
 */
const getMilestoneMessage = (days: number): { title: string; message: string; emoji: string } => {
  switch (days) {
    case 7:
      return {
        title: 'Week Warrior! 🎉',
        message: 'You\'ve maintained your streak for a full week!',
        emoji: '🔥',
      };
    case 14:
      return {
        title: 'Two Week Champion! 🏆',
        message: 'Two weeks of consistency - you\'re unstoppable!',
        emoji: '💪',
      };
    case 30:
      return {
        title: 'Monthly Master! 🌟',
        message: 'A full month of dedication - incredible!',
        emoji: '⭐',
      };
    case 60:
      return {
        title: 'Two Month Legend! 👑',
        message: '60 days of commitment - you\'re a legend!',
        emoji: '👑',
      };
    case 100:
      return {
        title: 'Century Club! 💯',
        message: '100 days! You\'ve achieved something amazing!',
        emoji: '💯',
      };
    default:
      return {
        title: 'Milestone Achieved! 🎊',
        message: `You've reached ${days} days!`,
        emoji: '🎉',
      };
  }
};

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  streakDays,
  onClose,
}) => {
  const { colors, spacing, typography } = useTheme();
  const [visible, setVisible] = useState(false);
  const scale = useState(new Animated.Value(0))[0];
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isMilestone(streakDays)) {
      setVisible(true);
      // Celebration animation
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [streakDays]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      onClose();
    });
  };

  if (!visible || !isMilestone(streakDays)) {
    return null;
  }

  const milestone = getMilestoneMessage(streakDays);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: colors.background.primary,
      borderRadius: spacing.xl,
      padding: spacing.xl * 1.5,
      alignItems: 'center',
      width: '85%',
      maxWidth: 350,
      borderWidth: 2,
      borderColor: colors.brand.orange,
    },
    emoji: {
      fontSize: 64,
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.h1.fontSize,
      fontWeight: typography.h1.fontWeight as any,
      fontFamily: typography.h1.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    message: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    streakCount: {
      fontSize: typography.h2.fontSize,
      fontFamily: typography.h2.fontFamily,
      color: colors.brand.orange,
      fontWeight: typography.h2.fontWeight as any,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <Text style={styles.emoji}>{milestone.emoji}</Text>
          <Text style={styles.title}>{milestone.title}</Text>
          <Text style={styles.message}>{milestone.message}</Text>
          <Text style={styles.streakCount}>{streakDays} Days 🔥</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

