import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { useOnboarding } from '../../../store/onboarding-context';

interface FitnessGoalsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general';

const fitnessGoals: { value: FitnessGoal; label: string; icon: string }[] = [
  { value: 'weight_loss', label: 'Weight Loss', icon: 'trending-down' },
  { value: 'muscle_gain', label: 'Muscle Gain', icon: 'barbell' },
  { value: 'endurance', label: 'Endurance', icon: 'fitness' },
  { value: 'flexibility', label: 'Flexibility', icon: 'body' },
  { value: 'general', label: 'General Fitness', icon: 'heart' },
];

export const FitnessGoalsScreen: React.FC<FitnessGoalsScreenProps> = ({ onNext, onBack }) => {
  const { colors, spacing, typography } = useTheme();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(
    onboardingData.fitnessGoal
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
    goalsContainer: {
      marginBottom: spacing.xl,
    },
    goalButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.primary500,
      padding: spacing.lg,
      borderRadius: 12,
      marginBottom: spacing.md,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    goalButtonSelected: {
      borderColor: colors.primary[500],
      backgroundColor: colors.background.primary500,
    },
    goalIcon: {
      marginRight: spacing.md,
    },
    goalText: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: typography.h3.fontFamily,
      color: colors.text.primary,
      letterSpacing: 0.3,
    },
    checkIcon: {
      marginLeft: 'auto',
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
    // Development mode: allow proceeding without selection
    updateOnboardingData({ fitnessGoal: selectedGoal || 'general' });
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
          <Text style={styles.title}>What's your goal?</Text>
        </View>
        <Text style={styles.subtitle}>
          Choose the primary fitness goal you want to focus on
        </Text>

        <View style={styles.goalsContainer}>
          {fitnessGoals.map((goal) => {
            const isSelected = selectedGoal === goal.value;
            return (
              <Pressable
                key={goal.value}
                style={[styles.goalButton, isSelected && styles.goalButtonSelected]}
                onPress={() => setSelectedGoal(goal.value)}
              >
                <Ionicons
                  name={goal.icon as any}
                  size={24}
                  color={isSelected ? colors.primary[500] : colors.text.secondary}
                  style={styles.goalIcon}
                />
                <Text style={styles.goalText}>{goal.label}</Text>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary[500]}
                    style={styles.checkIcon}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

