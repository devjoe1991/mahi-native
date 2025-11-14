import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, StatusBar } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface WelcomeAuthScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({ onLogin, onSignUp }) => {
  const { colors, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      flex: 1,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Increased opacity for stronger dim effect
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    content: {
      width: '100%',
      alignItems: 'center',
    },
    title: {
      fontSize: 96,
      fontWeight: '700',
      fontFamily: typography.h1.fontFamily,
      color: colors.background.primary,
      textAlign: 'center',
      marginBottom: spacing.md,
      letterSpacing: 3,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    subtitle: {
      fontSize: typography.body.fontSize + 2,
      fontFamily: typography.body.fontFamily,
      color: colors.background.primary,
      textAlign: 'center',
      marginBottom: spacing.xl * 2,
      lineHeight: (typography.body.fontSize + 2) * 1.5,
      paddingHorizontal: spacing.md,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    buttonsContainer: {
      width: '100%',
      maxWidth: 400,
    },
    primaryButton: {
      backgroundColor: colors.primary[500],
      paddingVertical: 20,
      paddingHorizontal: spacing.xl * 2,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      marginBottom: spacing.md,
    },
    primaryButtonText: {
      color: colors.background.primary,
      fontSize: 18,
      fontWeight: '700',
      fontFamily: typography.h2.fontFamily,
      letterSpacing: 0.5,
    },
    secondaryButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingVertical: 20,
      paddingHorizontal: spacing.xl * 2,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      borderWidth: 2,
      borderColor: colors.background.primary,
    },
    secondaryButtonText: {
      color: colors.background.primary,
      fontSize: 18,
      fontWeight: '700',
      fontFamily: typography.h2.fontFamily,
      letterSpacing: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../../assets/mahi-welcomescreen-background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>MAHI</Text>
            <Text style={styles.subtitle}>
              Build your fitness streak, connect with others, and achieve your goals one day at a time.
            </Text>
            
            <View style={styles.buttonsContainer}>
              <Pressable style={styles.primaryButton} onPress={onSignUp}>
                <Text style={styles.primaryButtonText}>Create Account</Text>
              </Pressable>
              
              <Pressable style={styles.secondaryButton} onPress={onLogin}>
                <Text style={styles.secondaryButtonText}>Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

