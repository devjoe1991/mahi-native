import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useOnboarding } from '../../store/onboarding-context';
import { useAuth } from '../../store/auth-context';
import { WelcomeScreen } from './views/WelcomeScreen';
import { NameScreen } from './views/NameScreen';
import { EmailPhoneScreen } from './views/EmailPhoneScreen';
import { OTPConfirmationScreen } from './views/OTPConfirmationScreen';
import { DateOfBirthScreen } from './views/DateOfBirthScreen';
import { FitnessGoalsScreen } from './views/FitnessGoalsScreen';
import { PrivacyPermissionsScreen } from './views/PrivacyPermissionsScreen';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { colors } = useTheme();
  const { currentStep, setCurrentStep, totalSteps, onboardingData } = useOnboarding();
  const { authenticate } = useAuth();
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // TODO: Create Supabase auth user and profile
      // 1. Sign up with email (already done in OTP step)
      // 2. Verify OTP (already done)
      // 3. Create profile with all onboarding data
      // 4. Set onboarding_completed = true
      
      // For now, simulate API call and authenticate user
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Authenticate user (this will set isAuthenticated = true)
      // In real app, this would be done automatically after profile creation
      await authenticate(onboardingData.email, 'temp-password');
      
      // After successful profile creation, call onComplete
      onComplete();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen onNext={handleNext} />;
      case 1:
        return <NameScreen onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <EmailPhoneScreen onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <OTPConfirmationScreen onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <DateOfBirthScreen onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <FitnessGoalsScreen onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <PrivacyPermissionsScreen onNext={handleNext} onBack={handleBack} />;
      default:
        return <WelcomeScreen onNext={handleNext} />;
    }
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  return <View style={styles.container}>{renderStep()}</View>;
};

