import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../../theme/ThemeProvider';
import { useOnboarding } from '../../../store/onboarding-context';

interface DateOfBirthScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const DateOfBirthScreen: React.FC<DateOfBirthScreenProps> = ({ onNext, onBack }) => {
  const { colors, spacing, typography } = useTheme();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [date, setDate] = useState<Date>(
    onboardingData.dateOfBirth || new Date(new Date().setFullYear(new Date().getFullYear() - 25))
  );
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  // Development mode: always valid
  const isValid = true;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollContent: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    backButton: {
      padding: spacing.sm,
      marginRight: spacing.md,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      fontFamily: typography.h1.fontFamily,
      color: colors.text.primary,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginBottom: spacing.xl,
      lineHeight: typography.body.fontSize * 1.5,
    },
    datePickerContainer: {
      backgroundColor: colors.background.primary500,
      borderRadius: 12,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      alignItems: 'center',
    },
    dateDisplay: {
      fontSize: 24,
      fontWeight: '600',
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    dateLabel: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
    },
    pickerButton: {
      backgroundColor: colors.primary[500],
      paddingVertical: 12,
      paddingHorizontal: spacing.lg,
      borderRadius: 50,
      marginTop: spacing.md,
    },
    pickerButtonText: {
      color: colors.background.primary,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: typography.body.fontFamily,
    },
    buttonContainer: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.lg,
      marginTop: 'auto',
    },
    button: {
      backgroundColor: colors.primary[500],
      paddingVertical: 20,
      paddingHorizontal: 24,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    buttonText: {
      color: colors.background.primary,
      fontSize: 18,
      fontWeight: '700',
      fontFamily: typography.h2.fontFamily,
      letterSpacing: 0.5,
    },
  });

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleNext = () => {
    // Development mode: allow proceeding without validation
    updateOnboardingData({ dateOfBirth: date || new Date() });
    onNext();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.title}>When's your birthday?</Text>
        </View>
        <Text style={styles.subtitle}>
          We use this to personalize your fitness journey
        </Text>

        <View style={styles.datePickerContainer}>
          <Text style={styles.dateDisplay}>{formatDate(date)}</Text>
          <Text style={styles.dateLabel}>Date of Birth</Text>
          
          {Platform.OS === 'android' && (
            <Pressable
              style={styles.pickerButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.pickerButtonText}>Select Date</Text>
            </Pressable>
          )}

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))}
            />
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

