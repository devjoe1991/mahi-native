import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useAuth } from '../../../../store/auth-context';
import { DailyCheckInModalProps } from '../types';
import { useGlobalModal } from '../context';
import { useBottomSheet } from '../../globalBottomSheet';

/**
 * Global Daily Check-In Modal - "Have you done your Mahi today?"
 * Reusable component that can be opened from anywhere
 */
export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  onPostNow,
  onSetRestDays,
  onDismiss,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { userData } = useAuth();
  const { openModal } = useGlobalModal();
  const { openSheet } = useBottomSheet();

  const handlePostNow = () => {
    onDismiss?.();
    if (onPostNow) {
      onPostNow();
    } else {
      // Default behavior: open streak update sheet
      openSheet('STREAK_UPDATE', {
        userId: userData?._id,
        onSaved: () => {
          // Streak updated successfully
        },
      });
    }
  };

  const handleSetRestDays = () => {
    onDismiss?.();
    if (onSetRestDays) {
      onSetRestDays();
    } else {
      // Default behavior: open rest days setup modal
      openModal('REST_DAYS_SETUP', {
        onSave: (restDays) => {
          // TODO: Save rest days to backend
          console.log('Rest days saved:', restDays);
        },
      });
    }
  };

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
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
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
      marginBottom: spacing.sm,
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
    tertiaryButton: {
      backgroundColor: 'transparent',
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
    tertiaryButtonText: {
      color: colors.text.muted,
    },
  });

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
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
              style={[styles.button, styles.primaryButton]}
              onPress={handlePostNow}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                Post Now
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={onDismiss}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Later
              </Text>
            </Pressable>
          </View>
          <Pressable
            style={[styles.button, styles.tertiaryButton]}
            onPress={handleSetRestDays}
          >
            <Text style={[styles.buttonText, styles.tertiaryButtonText]}>
              Set your rest days
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

