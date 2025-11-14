import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { useOnboarding } from '../../../store/onboarding-context';

interface OTPConfirmationScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const OTPConfirmationScreen: React.FC<OTPConfirmationScreenProps> = ({ onNext, onBack }) => {
  const { colors, spacing, typography } = useTheme();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);

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
    emailText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.primary[500],
      fontWeight: '600',
      marginBottom: spacing.xl,
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.sm,
    },
    otpInput: {
      width: 45,
      height: 60,
      backgroundColor: colors.background.primary500,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border.primary,
      textAlign: 'center',
      fontSize: 24,
      fontWeight: '600',
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
    },
    otpInputFocused: {
      borderColor: colors.primary[500],
      borderWidth: 2,
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    resendText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginRight: spacing.xs,
    },
    resendButton: {
      padding: spacing.xs,
    },
    resendButtonText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.primary[500],
      fontWeight: '600',
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

  // Development mode: allow skipping OTP validation
  const isOtpComplete = true;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      // Focus last filled input
      const lastFilledIndex = Math.min(index + pastedOtp.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    // Development mode: allow proceeding without OTP verification
    const otpCode = otp.join('') || '123456';
    updateOnboardingData({ otpCode, otpVerified: true });
    onNext();
  };

  const handleResend = () => {
    // TODO: Resend OTP via Supabase
    Alert.alert('OTP Resent', 'A new verification code has been sent to your email.');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.title}>Verify Your Email</Text>
        </View>
        <Text style={styles.subtitle}>
          We've sent a verification code to:
        </Text>
        <Text style={styles.emailText}>{onboardingData.email}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[styles.otpInput]}
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <Pressable style={styles.resendButton} onPress={handleResend}>
            <Text style={styles.resendButtonText}>Resend</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

