import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../store/auth-context';
import { useBottomSheet } from '../globals/globalBottomSheet';

interface DailyCheckInProps {
  onComplete?: () => void;
}

/**
 * Daily check-in prompt - "Have you done your Mahi today?"
 * Shows once per day, can be dismissed
 */
export const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onComplete }) => {
  const { colors, spacing, typography } = useTheme();
  const { userData } = useAuth();
  const { openSheet } = useBottomSheet();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissedToday, setDismissedToday] = useState(false);

  useEffect(() => {
    // Check if user has posted today
    // In real app, check last post date from database
    const checkIfNeedsPrompt = () => {
      // Use AsyncStorage or similar in React Native (localStorage not available)
      // For now, just check if user has a streak and show prompt
      // TODO: Implement proper storage check with AsyncStorage
      if (userData?.streak_days && userData.streak_days > 0) {
        // Show prompt after a delay
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    checkIfNeedsPrompt();
  }, [userData]);

  const handleYes = () => {
    setShowPrompt(false);
    setDismissedToday(true);
    // TODO: Save dismissal with AsyncStorage
    openSheet('STREAK_UPDATE', {
      userId: userData?._id,
      onSaved: () => {
        onComplete?.();
      },
    });
  };

  const handleLater = () => {
    setShowPrompt(false);
    setDismissedToday(true);
    // TODO: Save dismissal with AsyncStorage
  };

  if (!showPrompt || dismissedToday) {
    return null;
  }

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    container: {
      backgroundColor: colors.background.primary,
      borderRadius: spacing.lg,
      padding: spacing.xl,
      width: '90%',
      maxWidth: 400,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    icon: {
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
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
    streakInfo: {
      fontSize: typography.h3.fontSize,
      fontFamily: typography.h3.fontFamily,
      color: colors.brand.orange,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.md,
      width: '100%',
    },
    button: {
      flex: 1,
      padding: spacing.md,
      borderRadius: spacing.md,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: colors.brand.blue,
    },
    secondaryButton: {
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    buttonText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      fontWeight: typography.body.fontWeight as any,
    },
    primaryButtonText: {
      color: colors.background.primary,
    },
    secondaryButtonText: {
      color: colors.text.primary,
    },
  });

  return (
    <Modal
      visible={showPrompt}
      transparent
      animationType="fade"
      onRequestClose={handleLater}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Ionicons
            name="flame"
            size={48}
            color={colors.brand.orange}
            style={styles.icon}
          />
          <Text style={styles.title}>Have you done your Mahi today? 🔥</Text>
          <Text style={styles.message}>
            Keep your {userData?.streak_days || 0} day streak going!
          </Text>
          {userData?.streak_days && userData.streak_days > 0 && (
            <Text style={styles.streakInfo}>
              {userData.streak_days} day streak 🔥
            </Text>
          )}
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={handleLater}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Later
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={handleYes}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                Post Now
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

