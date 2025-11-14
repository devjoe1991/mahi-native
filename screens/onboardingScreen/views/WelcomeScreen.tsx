import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const { colors, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    iconContainer: {
      marginBottom: spacing.xl,
    },
    icon: {
      fontSize: 80,
      color: colors.primary[500],
    },
    title: {
      fontSize: 32,
      fontWeight: '600',
      fontFamily: typography.h1.fontFamily,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.md,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.xl * 2,
      lineHeight: typography.body.fontSize * 1.5,
      paddingHorizontal: spacing.md,
    },
    button: {
      backgroundColor: colors.primary[500],
      paddingVertical: 20,
      paddingHorizontal: spacing.xl * 2,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 200,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      marginBottom: spacing.md,
    },
    buttonText: {
      color: colors.background.primary,
      fontSize: 18,
      fontWeight: '700',
      fontFamily: typography.h2.fontFamily,
      letterSpacing: 0.5,
    },
  });

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="flame" style={styles.icon} />
      </View>
      <Text style={styles.title}>Welcome to Mahi</Text>
      <Text style={styles.subtitle}>
        Build your fitness streak, connect with others, and achieve your goals one day at a time.
      </Text>
      <Pressable style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </SafeAreaView>
  );
};

