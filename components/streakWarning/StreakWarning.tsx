import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../store/auth-context';

interface StreakWarningProps {
  onDismiss?: () => void;
}

/**
 * Checks if user's streak is at risk (within 24 hours of reset)
 * Simple implementation: checks if last post was > 23 hours ago
 */
const isStreakAtRisk = (lastPostTime?: string): boolean => {
  if (!lastPostTime) return true; // No posts = at risk
  
  const lastPost = new Date(lastPostTime);
  const now = new Date();
  const hoursSinceLastPost = (now.getTime() - lastPost.getTime()) / (1000 * 60 * 60);
  
  // At risk if more than 23 hours since last post
  return hoursSinceLastPost >= 23;
};

export const StreakWarning: React.FC<StreakWarningProps> = ({ onDismiss }) => {
  const { colors, spacing, typography } = useTheme();
  const { userData } = useAuth();
  const [isAtRisk, setIsAtRisk] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if streak is at risk
    // In real app, would check last post time from database
    // For now, simulate check - user is at risk if they have a streak
    // TODO: Pass actual lastPostTime from user's most recent post
    const atRisk = userData?.streak_days && userData.streak_days > 0 
      ? isStreakAtRisk() // Would pass lastPostTime in real app
      : false;
    setIsAtRisk(atRisk);
  }, [userData]);

  if (!isAtRisk || dismissed) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.brand.orange,
      padding: spacing.md,
      margin: spacing.md,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.brand.orange,
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
        name="warning" 
        size={24} 
        color={colors.background.primary} 
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Streak at Risk! 🔥</Text>
        <Text style={styles.message}>
          Post today to maintain your {userData?.streak_days || 0} day streak!
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

