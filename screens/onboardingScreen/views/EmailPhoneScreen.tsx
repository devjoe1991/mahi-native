import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { useOnboarding } from '../../../store/onboarding-context';

interface EmailPhoneScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const EmailPhoneScreen: React.FC<EmailPhoneScreenProps> = ({ onNext, onBack }) => {
  const { colors, spacing, typography } = useTheme();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [email, setEmail] = useState(onboardingData.email);
  const [phone, setPhone] = useState(onboardingData.phone || '');

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
    inputLabelOptional: {
      fontSize: 12,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
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
    updateOnboardingData({
      email: email.trim() || 'test@example.com',
      phone: phone.trim() || undefined,
    });
    onNext();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.title}>Contact Info</Text>
        </View>
        <Text style={styles.subtitle}>
          We'll use this to verify your account and keep you updated
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={styles.inputLabel}>Email</Text>
          <Text style={styles.inputLabelOptional}> (required)</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          placeholderTextColor={colors.text.secondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={styles.inputLabel}>Phone</Text>
          <Text style={styles.inputLabelOptional}> (optional)</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="+44 123 456 7890"
          placeholderTextColor={colors.text.secondary}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
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

