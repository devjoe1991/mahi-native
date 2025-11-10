import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../store/auth-context';
import { OnboardingProvider } from '../../store/onboarding-context';
import { WelcomeAuthScreen } from './views/WelcomeAuthScreen';
import { LoginScreen } from './views/LoginScreen';
import { OnboardingScreen } from './OnboardingScreen';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'welcome' | 'login' | 'onboarding';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('welcome');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
  });

  // When authentication state changes, notify parent
  React.useEffect(() => {
    if (isAuthenticated) {
      onAuthSuccess();
    }
  }, [isAuthenticated, onAuthSuccess]);

  const handleLogin = () => {
    setAuthMode('login');
  };

  const handleSignUp = () => {
    setAuthMode('onboarding');
    // Reset onboarding step will be handled by OnboardingProvider when it mounts
  };

  const handleBackToWelcome = () => {
    setAuthMode('welcome');
  };

  const handleLoginSuccess = () => {
    // Auth context will update isAuthenticated, which triggers useEffect above
  };

  const handleOnboardingComplete = () => {
    // Auth context will update isAuthenticated after profile creation, which triggers useEffect above
  };

  const handleOnboardingBack = () => {
    // Go back to welcome screen from onboarding
    setAuthMode('welcome');
  };

  return (
    <View style={styles.container}>
      {authMode === 'welcome' ? (
        <WelcomeAuthScreen onLogin={handleLogin} onSignUp={handleSignUp} />
      ) : authMode === 'login' ? (
        <LoginScreen 
          onSignUp={handleSignUp} 
          onLoginSuccess={handleLoginSuccess}
          onBack={handleBackToWelcome}
        />
      ) : (
        <OnboardingProvider>
          <OnboardingScreen onComplete={handleOnboardingComplete} onBack={handleOnboardingBack} />
        </OnboardingProvider>
      )}
    </View>
  );
};

