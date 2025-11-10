import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider, useAuth } from './store/auth-context';
import { NavigationProvider } from './store/navigation-context';
import { AuthScreen } from './screens/onboardingScreen/AuthScreen';
import { useCalendarSync } from './hooks/useCalendarSync';

// Prevent the splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  // Sync streaks to calendar when authenticated
  useCalendarSync();

  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }

  return <NavigationProvider />;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
