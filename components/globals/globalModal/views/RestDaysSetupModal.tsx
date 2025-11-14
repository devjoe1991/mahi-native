import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useAuth } from '../../../../store/auth-context';
import { RestDaysSetupModalProps } from '../types';
import { RestDaysCalendar } from '../../../calendar/RestDaysCalendar';
import { syncAllRestDaysToCalendar, getRestDaysFromCalendar } from '../../../../utils/calendarSync';
import { hasCalendarPermissions, requestCalendarPermissions } from '../../../../utils/healthIntegration';

/**
 * Rest Days Setup Modal - Allow users to set rest days using a calendar
 * Only shows future dates, syncs with device calendar
 */
export const RestDaysSetupModal: React.FC<RestDaysSetupModalProps> = ({
  onSave,
  onCancel,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { userData, updateUserData } = useAuth();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Load existing rest days from user profile and device calendar
  useEffect(() => {
    const loadRestDays = async () => {
      setLoading(true);
      try {
        // Check calendar permissions
        const hasPermission = await hasCalendarPermissions();
        if (!hasPermission) {
          const granted = await requestCalendarPermissions();
          if (!granted) {
            // If no permission, just load from user profile
            if (userData?.rest_days) {
              // Convert day names to dates (for backward compatibility)
              // For now, we'll start fresh with dates
              setSelectedDates([]);
            }
            setLoading(false);
            return;
          }
        }

        // Load from device calendar
        const calendarRestDays = await getRestDaysFromCalendar();
        
        // Also check user profile for any existing rest days
        // For backward compatibility, we'll merge both sources
        const allRestDays = [...calendarRestDays];
        
        // Remove duplicates
        const uniqueDates = Array.from(
          new Set(
            allRestDays.map((d) => {
              const date = new Date(d);
              date.setHours(0, 0, 0, 0);
              return date.toISOString().split('T')[0];
            })
          )
        ).map((dateStr) => new Date(dateStr));

        setSelectedDates(uniqueDates);
      } catch (error) {
        console.error('Error loading rest days:', error);
        setSelectedDates([]);
      } finally {
        setLoading(false);
      }
    };

    loadRestDays();
  }, [userData]);

  const handleSave = async () => {
    setSyncing(true);
    try {
      // Sync to device calendar
      const hasPermission = await hasCalendarPermissions();
      if (hasPermission) {
        await syncAllRestDaysToCalendar(selectedDates);
      }

      // Convert dates to ISO strings for storage
      const restDaysData = selectedDates.map((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString();
      });

      // Save to user profile
      if (userData?._id) {
        await updateUserData({ rest_days: restDaysData });
      }

      // For backward compatibility, also pass as array of date strings
      onSave?.(restDaysData);
    } catch (error) {
      console.error('Error saving rest days:', error);
      Alert.alert('Error', 'Failed to save rest days. Please try again.');
    } finally {
      setSyncing(false);
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
      width: '95%',
      maxWidth: 500,
      maxHeight: '90%',
      borderWidth: 1,
      borderColor: colors.border.primary,
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    title: {
      fontSize: typography.h2.fontSize - 3,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    message: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    calendarContainer: {
      marginBottom: spacing.lg,
    },
    loadingContainer: {
      padding: spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 400,
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
      justifyContent: 'center',
      minHeight: 48,
    },
    primaryButton: {
      backgroundColor: colors.primary[500],
    },
    secondaryButton: {
      backgroundColor: colors.background.primary500,
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
    disabledButton: {
      opacity: 0.5,
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
            Plan ahead by selecting rest days for the year. These will sync with your device calendar.
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary[500]} />
              <Text style={styles.message}>Loading rest days...</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.calendarContainer}
              showsVerticalScrollIndicator={false}
            >
              <RestDaysCalendar
                selectedDates={selectedDates}
                onDatesChange={setSelectedDates}
                minDate={new Date()}
              />
            </ScrollView>
          )}

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={onCancel}
              disabled={syncing}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.primaryButton,
                syncing && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={syncing}
            >
              {syncing ? (
                <ActivityIndicator size="small" color={colors.background.primary} />
              ) : (
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  Save & Sync
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

