import React, { useRef } from 'react';
import { View, StyleSheet, Text, Modal, Pressable, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { StreakData } from './types';

interface StreakModalProps {
  streak: StreakData;
  onClose: () => void;
  onNavigateToAddStory: () => void;
}

const getStreakColor = (
  level: number,
  feedType: string,
  isLocked: boolean,
  streakDays: number,
  colors: any,
  theme: 'light' | 'dark'
): string => {
  if (isLocked) {
    return theme === 'dark' ? colors.border.primary : colors.text.secondary;
  }

  const isMilestone = streakDays > 0 && streakDays % 10 === 0;
  if (isMilestone) {
    return '#EF4444';
  }

  const feedColors: Record<string, string> = {
    streak1: colors.primary[500],
    streak2: '#4ECDC4',
    streak3: '#45B7D1',
    streak4: '#8B5CF6',
    streak5: '#10B981',
    streak6: '#F59E0B',
    creation: colors.text.primary,
  };

  return feedColors[feedType] || colors.primary[500];
};

export const StreakModal: React.FC<StreakModalProps> = ({ streak, onClose, onNavigateToAddStory }) => {
  const { colors, spacing, typography, theme } = useTheme();
  const modalTranslateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          modalTranslateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(modalTranslateY, {
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            modalTranslateY.setValue(0);
          });
        } else {
          Animated.spring(modalTranslateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const streakColor = getStreakColor(
    streak.streak_level,
    streak.feedType,
    streak.isLocked,
    streak.streak_days,
    colors,
    theme
  );

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: colors.background.secondary,
      borderRadius: spacing.lg,
      padding: spacing.xl,
      alignItems: 'center',
      width: '90%',
      borderWidth: 1,
      borderColor: colors.border.primary,
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
      shadowRadius: 20,
      elevation: 20,
    },
    closeButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    iconCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: streakColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
      opacity: streak.isLocked ? 0.6 : 1,
      borderWidth: 3,
      borderColor: streakColor,
    },
    title: {
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    description: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginBottom: spacing.lg,
      textAlign: 'center',
      lineHeight: 22,
    },
    button: {
      backgroundColor: streakColor,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: spacing.md,
      marginTop: spacing.md,
    },
    buttonText: {
      color: colors.background.primary,
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      fontWeight: typography.body.fontWeight as any,
    },
    handle: {
      position: 'absolute',
      top: -10,
      width: 40,
      height: 4,
      backgroundColor: colors.border.primary,
      borderRadius: 2,
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!!streak}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: modalTranslateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.text.primary} />
          </Pressable>

          <View style={styles.iconCircle}>
            {streak.isLocked ? (
              <Ionicons name="lock-closed" size={44} color={colors.background.primary} />
            ) : (
              <Ionicons name={streak.icon as any} size={44} color={colors.background.primary} />
            )}
          </View>

          <Text style={styles.title}>
            {streak.isLocked ? `${streak.title} - LOCKED` : streak.title}
          </Text>

          <Text style={styles.description}>{streak.description}</Text>

          {streak.isLocked ? (
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text
                style={{
                  fontSize: typography.h2.fontSize,
                  fontFamily: typography.h2.fontFamily,
                  color: colors.primary[500],
                  marginBottom: spacing.md,
                }}
              >
                🔒 Locked Streak
              </Text>
              <Text
                style={{
                  fontSize: typography.body.fontSize,
                  fontFamily: typography.body.fontFamily,
                  color: colors.text.secondary,
                  textAlign: 'center',
                  marginBottom: spacing.lg,
                  lineHeight: 22,
                }}
              >
                Keep up your streak! Upload a post today to unlock this streak level.
              </Text>
              <Pressable style={styles.button} onPress={onNavigateToAddStory}>
                <Text style={styles.buttonText}>Upload Daily Post</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text
                style={{
                  fontSize: typography.h2.fontSize,
                  fontFamily: typography.h2.fontFamily,
                  color: streakColor,
                  marginBottom: spacing.lg,
                }}
              >
                {streak.streak_days} Days Streak
              </Text>
              <Pressable style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Open {streak.title} Feed</Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

