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
      borderRadius: 24,
      padding: spacing.xl,
      width: '90%',
      maxWidth: 400,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      overflow: 'hidden',
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
      letterSpacing: 0.5,
      lineHeight: typography.h2.fontSize * 1.2,
    },
    message: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      textAlign: 'center',
      marginBottom: spacing.lg,
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.5,
    },
    streakInfo: {
      fontSize: typography.h3.fontSize,
      fontFamily: typography.h3.fontFamily,
      color: colors.brand.orange,
      marginBottom: spacing.lg,
      textAlign: 'center',
      letterSpacing: 0.5,
      lineHeight: typography.h3.fontSize * 1.2,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.md,
      width: '100%',
      marginBottom: spacing.sm,
    },
    button: {
      flex: 1,
      paddingVertical: 20,
      paddingHorizontal: 24,
      borderRadius: 50,
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
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
      fontSize: 18,
      fontFamily: typography.body.fontFamily,
      fontWeight: '700',
      letterSpacing: 0.5,
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

