import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useAuth } from '../../../../store/auth-context';
import { RestDaysSetupModalProps } from '../types';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

/**
 * Rest Days Setup Modal - Allow users to set which days are rest days
 */
export const RestDaysSetupModal: React.FC<RestDaysSetupModalProps> = ({
  onSave,
  onCancel,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { userData, updateUserData } = useAuth();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Load existing rest days from user profile
  useEffect(() => {
    if (userData?.rest_days) {
      setSelectedDays(userData.rest_days);
    }
  }, [userData]);

  const toggleDay = (dayKey: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  const handleSave = async () => {
    // Save to user profile
    if (userData?._id) {
      await updateUserData({ rest_days: selectedDays });
    }
    onSave?.(selectedDays);
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
      borderWidth: 1,
      borderColor: colors.border.primary,
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
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
    dayRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      marginBottom: spacing.xs,
      borderRadius: spacing.md,
      backgroundColor: colors.background.secondary,
    },
    dayLabel: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.border.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxSelected: {
      backgroundColor: colors.brand.blue,
      borderColor: colors.brand.blue,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.lg,
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
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Set Your Rest Days</Text>
          <Text style={styles.message}>
            Select the days when you want to take a break from your streak
          </Text>
          <ScrollView style={{ maxHeight: 300 }}>
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDays.includes(day.key);
              return (
                <Pressable
                  key={day.key}
                  style={styles.dayRow}
                  onPress={() => toggleDay(day.key)}
                >
                  <Text style={styles.dayLabel}>{day.label}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={colors.background.primary}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

