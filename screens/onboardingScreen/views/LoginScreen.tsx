import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAuth } from '../../../store/auth-context';

interface LoginScreenProps {
  onSignUp: () => void;
  onLoginSuccess: () => void;
  onBack?: () => void;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSignUp, onLoginSuccess, onBack }) => {
  const { colors, spacing, typography } = useTheme();
  const { authenticate } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValid = validateEmail(email.trim()) && password.length >= 6;

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
    headerContent: {
      flex: 1,
      alignItems: 'center',
    },
    iconContainer: {
      marginBottom: spacing.lg,
    },
    icon: {
      fontSize: 60,
      color: colors.primary[500],
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      fontFamily: typography.h1.fontFamily,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      textAlign: 'center',
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
    inputContainer: {
      position: 'relative',
      marginBottom: spacing.md,
    },
    input: {
      backgroundColor: colors.background.primary500,
      padding: 15,
      paddingRight: 50,
      borderRadius: 50,
      color: colors.text.primary,
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      borderWidth: 1,
      borderColor: colors.border.primary,
      letterSpacing: 0.2,
      lineHeight: typography.body.fontSize * 1.5,
    },
    passwordToggle: {
      position: 'absolute',
      right: 15,
      top: 15,
      padding: 5,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: spacing.xl,
      padding: spacing.xs,
    },
    forgotPasswordText: {
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
      marginBottom: spacing.md,
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
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: spacing.md,
    },
    signUpText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginRight: spacing.xs,
    },
    signUpButton: {
      padding: spacing.xs,
    },
    signUpButtonText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.primary[500],
      fontWeight: '600',
    },
  });

  const handleLogin = async () => {
    if (!isValid) return;

    setLoading(true);
    try {
      const success = await authenticate(email.trim(), password);
      if (success) {
        onLoginSuccess();
      } else {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          {onBack && (
            <Pressable style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </Pressable>
          )}
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="flame" style={styles.icon} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your fitness journey</Text>
          </View>
        </View>

        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          placeholderTextColor={colors.text.secondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.text.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <Pressable
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.text.secondary}
            />
          </Pressable>
        </View>

        <Pressable style={styles.forgotPassword} onPress={() => {
          // TODO: Implement forgot password flow
          Alert.alert('Forgot Password', 'Password reset feature coming soon!');
        }}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, (!isValid || loading) && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!isValid || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background.primary} />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <Pressable style={styles.signUpButton} onPress={onSignUp} disabled={loading}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

