import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../theme/ThemeProvider';
import { useOnboarding } from '../../../store/onboarding-context';

interface PrivacyPermissionsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const PrivacyPermissionsScreen: React.FC<PrivacyPermissionsScreenProps> = ({
  onNext,
  onBack,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [calendarPermission, setCalendarPermission] = useState(
    onboardingData.calendarPermission
  );
  const [cameraPermission, setCameraPermission] = useState(onboardingData.cameraPermission);
  const [microphonePermission, setMicrophonePermission] = useState(
    onboardingData.microphonePermission
  );

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
    permissionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.primary500,
      padding: spacing.lg,
      borderRadius: 12,
      marginBottom: spacing.md,
    },
    permissionIcon: {
      marginRight: spacing.md,
    },
    permissionContent: {
      flex: 1,
    },
    permissionTitle: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.xs,
      letterSpacing: 0.3,
    },
    permissionDescription: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      lineHeight: typography.body.fontSize * 1.4,
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

  const requestCalendarPermission = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setCalendarPermission(status === 'granted');
      updateOnboardingData({ calendarPermission: status === 'granted' });
    } catch (error) {
      console.error('Calendar permission error:', error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
      updateOnboardingData({ cameraPermission: status === 'granted' });
    } catch (error) {
      console.error('Camera permission error:', error);
    }
  };

  const requestMicrophonePermission = async () => {
    // Note: Microphone permission is marked as "coming soon" in the UI
    // This will be implemented in a future update with proper permission handling
    Alert.alert(
      'Microphone Permission', 
      'Microphone permission will be available in a future update. This feature is coming soon!'
    );
  };

  const handlePermissionToggle = async (type: 'calendar' | 'camera' | 'microphone') => {
    switch (type) {
      case 'calendar':
        if (!calendarPermission) {
          await requestCalendarPermission();
        } else {
          setCalendarPermission(false);
          updateOnboardingData({ calendarPermission: false });
        }
        break;
      case 'camera':
        if (!cameraPermission) {
          await requestCameraPermission();
        } else {
          setCameraPermission(false);
          updateOnboardingData({ cameraPermission: false });
        }
        break;
      case 'microphone':
        if (!microphonePermission) {
          await requestMicrophonePermission();
        } else {
          setMicrophonePermission(false);
          updateOnboardingData({ microphonePermission: false });
        }
        break;
    }
  };

  const handleNext = () => {
    updateOnboardingData({
      calendarPermission,
      cameraPermission,
      microphonePermission,
    });
    onNext();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.title}>Privacy & Permissions</Text>
        </View>
        <Text style={styles.subtitle}>
          Grant permissions to enhance your Mahi experience
        </Text>

        <View style={styles.permissionItem}>
          <Ionicons
            name="calendar-outline"
            size={28}
            color={colors.primary[500]}
            style={styles.permissionIcon}
          />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Calendar Access</Text>
            <Text style={styles.permissionDescription}>
              Detect scheduled workouts and help you complete your daily goals
            </Text>
          </View>
          <Switch
            value={calendarPermission}
            onValueChange={() => handlePermissionToggle('calendar')}
            trackColor={{ false: colors.border.primary, true: colors.primary[500] }}
            thumbColor={colors.background.primary}
          />
        </View>

        <View style={styles.permissionItem}>
          <Ionicons
            name="camera-outline"
            size={28}
            color={colors.primary[500]}
            style={styles.permissionIcon}
          />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Camera Access</Text>
            <Text style={styles.permissionDescription}>
              Take photos for your streak updates and profile picture
            </Text>
          </View>
          <Switch
            value={cameraPermission}
            onValueChange={() => handlePermissionToggle('camera')}
            trackColor={{ false: colors.border.primary, true: colors.primary[500] }}
            thumbColor={colors.background.primary}
          />
        </View>

        <View style={styles.permissionItem}>
          <Ionicons
            name="mic-outline"
            size={28}
            color={colors.primary[500]}
            style={styles.permissionIcon}
          />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Microphone Access</Text>
            <Text style={styles.permissionDescription}>
              Record audio for video posts
            </Text>
          </View>
          <Switch
            value={microphonePermission}
            onValueChange={() => handlePermissionToggle('microphone')}
            trackColor={{ false: colors.border.primary, true: colors.primary[500] }}
            thumbColor={colors.background.primary}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Complete Setup</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

