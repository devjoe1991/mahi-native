import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../store/auth-context';

interface LossAversionWarningProps {
  longestStreak?: number;
  onDismiss?: () => void;
}

/**
 * Shows "You're X days away from your longest streak" warning
 * Creates loss aversion psychology
 */
export const LossAversionWarning: React.FC<LossAversionWarningProps> = ({
  longestStreak,
  onDismiss,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { userData } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Calculate days away from longest streak
  const currentStreak = userData?.streak_days || 0;
  const longest = longestStreak || currentStreak;
  const daysAway = longest - currentStreak;

  // Only show if user is close to their longest streak (within 5 days)
  const shouldShow = currentStreak > 0 && daysAway > 0 && daysAway <= 5;

  if (!shouldShow || dismissed) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.brand.purple,
      padding: spacing.md,
      margin: spacing.md,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.brand.purple,
    },
    icon: {
      marginRight: spacing.sm,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.background.primary,
      marginBottom: spacing.xs,
    },
    message: {
      fontSize: typography.body.fontSize * 0.9,
      fontFamily: typography.body.fontFamily,
      color: colors.background.primary,
      opacity: 0.9,
    },
    closeButton: {
      marginLeft: spacing.sm,
      padding: spacing.xs,
    },
  });

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="trophy"
        size={24}
        color={colors.background.primary}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Beat Your Record! 🏆</Text>
        <Text style={styles.message}>
          You're {daysAway} {daysAway === 1 ? 'day' : 'days'} away from your longest streak of {longest} days!
        </Text>
      </View>
      <Pressable onPress={handleDismiss} style={styles.closeButton}>
        <Ionicons
          name="close"
          size={20}
          color={colors.background.primary}
        />
      </Pressable>
    </View>
  );
};

