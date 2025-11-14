import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { useOnboarding } from '../../../store/onboarding-context';

interface NameScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const NameScreen: React.FC<NameScreenProps> = ({ onNext, onBack }) => {
  const { colors, spacing, typography } = useTheme();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [firstName, setFirstName] = useState(onboardingData.firstName);
  const [lastName, setLastName] = useState(onboardingData.lastName);

  // Development mode: allow skipping validation
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
      fontWeight: '600',
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
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
      letterSpacing: 0.3,
    },
    input: {
      backgroundColor: colors.background.primary500,
      padding: 15,
      borderRadius: 50,
      color: colors.text.primary,
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      borderWidth: 1,
      borderColor: colors.border.primary,
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.5,
      marginBottom: spacing.md,
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
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: colors.background.primary,
      fontSize: 18,
      fontWeight: '700',
      fontFamily: typography.h2.fontFamily,
      letterSpacing: 0.5,
    },
  });

  const handleNext = () => {
    // Development mode: allow proceeding without validation
    updateOnboardingData({ firstName: firstName.trim() || 'Test', lastName: lastName.trim() || 'User' });
    onNext();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.title}>What's your name?</Text>
        </View>
        <Text style={styles.subtitle}>
          We'll use this to personalize your experience
        </Text>

        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John"
          placeholderTextColor={colors.text.secondary}
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <Text style={styles.inputLabel}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Doe"
          placeholderTextColor={colors.text.secondary}
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

