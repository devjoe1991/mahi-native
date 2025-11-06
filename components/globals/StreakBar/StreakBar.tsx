import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { StreakData } from './types';
import { StreakModal } from './StreakModal';
import { useBottomSheet } from '../globalBottomSheet';
import { useNavigation } from '../../../store/navigation-context';
import { useAuth } from '../../../store/auth-context';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const ITEM_SIZE = SCREEN_WIDTH / 5;
const TRANSLATE_VALUE = ITEM_SIZE / 2;
const TEXT_HEIGHT = 20; // Space for text label (fontSize 10 + marginTop 5 + padding)
export const CONTAINER_HEIGHT = ITEM_SIZE + TRANSLATE_VALUE + TEXT_HEIGHT + 10; // Added TEXT_HEIGHT to prevent text cutoff

interface StreakBarProps {
  streaks: StreakData[];
  onStreakPress?: (streak: StreakData) => void;
}

// Get streak color based on level and state - Colors intensify as streak grows
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

  // Milestone colors (every 10 days) - Special colors
  const isMilestone = streakDays > 0 && streakDays % 10 === 0;
  if (isMilestone) {
    return colors.brand.yellow; // Gold for milestones
  }

  // Color progression based on streak days - More vibrant as streak grows
  if (streakDays >= 30) {
    return colors.brand.purpleDark; // Deep purple for 30+ days
  }
  if (streakDays >= 14) {
    return colors.brand.magenta; // Magenta for 14+ days
  }
  if (streakDays >= 7) {
    return colors.brand.orange; // Orange for 7+ days
  }

  // Base colors by feed type
  const feedColors: Record<string, string> = {
    streak1: colors.brand.blue, // Blue
    streak2: colors.brand.cyan, // Cyan
    streak3: colors.brand.blue100, // Light blue
    streak4: colors.brand.purple, // Purple
    streak5: colors.brand.green, // Green
    streak6: colors.brand.orange, // Orange
    creation: colors.text.primary,
  };

  return feedColors[feedType] || colors.brand.blue;
};

// Get progression emoji
const getProgressionEmoji = (streakDays: number): string => {
  if (streakDays === 0) return '🎯';
  if (streakDays === 1) return '🔥';
  if (streakDays === 2) return '💪';
  if (streakDays === 3) return '⚡';
  if (streakDays === 4) return '🚀';
  if (streakDays === 5) return '⭐';
  if (streakDays === 6) return '🌟';
  if (streakDays === 7) return '👑';
  if (streakDays === 8) return '💎';
  if (streakDays === 9) return '🏆';
  if (streakDays === 10) return '🎉';
  if (streakDays >= 31) return '🏅';
  return '🔥';
};

export const StreakBar: React.FC<StreakBarProps> = ({ streaks, onStreakPress }) => {
  const { colors, spacing, typography, theme } = useTheme();
  const { openSheet } = useBottomSheet();
  const { navigate } = useNavigation();
  const { userData } = useAuth();
  const [selectedStreak, setSelectedStreak] = useState<StreakData | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<Animated.FlatList>(null);

  // Calculate time until streak reset (midnight)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeUntilReset(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeUntilReset(`${minutes}m`);
      } else {
        setTimeUntilReset('Soon!');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleStreakPress = (streak: StreakData) => {
    if (streak.type === 'add_story') {
      // Open streak update sheet with Mahi prompt
      openSheet('STREAK_UPDATE', {
        userId: userData?._id,
        onSaved: () => {
          // Refresh streaks after update
          onStreakPress?.(streak);
        },
      });
    } else if (streak.isLocked) {
      setSelectedStreak(streak);
    } else {
      setSelectedStreak(streak);
    }
  };

  // Get current active streak for countdown display
  const currentStreak = userData?.streak_days || 0;

  const styles = StyleSheet.create({
    container: {
      height: CONTAINER_HEIGHT,
      backgroundColor: colors.background.primary,
      width: '100%',
      paddingBottom: spacing.xs,
      overflow: 'visible',
    },
    countdownContainer: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs,
      paddingBottom: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    countdownText: {
      fontSize: 11,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      marginLeft: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      {/* Countdown Timer */}
      {currentStreak > 0 && timeUntilReset && (
        <View style={styles.countdownContainer}>
          <Ionicons name="time-outline" size={14} color={colors.text.muted} />
          <Text style={styles.countdownText}>
            {timeUntilReset} until reset
          </Text>
        </View>
      )}
      <Animated.FlatList
        ref={flatListRef}
        data={streaks}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: spacing.xs, // Vertical padding to prevent text cutoff
          paddingHorizontal: SCREEN_WIDTH / 2 - ITEM_SIZE / 2,
          paddingBottom: spacing.sm, // Extra bottom padding for text labels
        }}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
            (index + 2) * ITEM_SIZE,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 0.8, 1, 0.8, 0.8],
          });
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, TRANSLATE_VALUE / 2, TRANSLATE_VALUE, TRANSLATE_VALUE / 2, 0],
          });

          const streakColor = getStreakColor(
            item.streak_level,
            item.feedType,
            item.isLocked,
            item.streak_days,
            colors,
            theme
          );

          return (
            <Pressable onPress={() => handleStreakPress(item)}>
              <Animated.View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{ translateY }, { scale }],
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  marginVertical: 5,
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 60,
                    backgroundColor: streakColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: item.isCurrentUser ? 3 : 2,
                    borderColor: item.isCurrentUser ? colors.primary[500] : streakColor,
                    shadowColor: streakColor,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: item.isLocked ? 0.1 : theme === 'dark' ? 0.3 : 0.2,
                    shadowRadius: 8,
                    elevation: 8,
                    opacity: item.isLocked ? 0.6 : 1,
                  }}
                >
                  {item.type === 'add_story' ? (
                    <Ionicons name={item.icon as any} size={30} color={colors.background.primary} />
                  ) : item.isLocked ? (
                    <View style={{ alignItems: 'center' }}>
                      <Ionicons
                        name="lock-closed"
                        size={25}
                        color={colors.background.primary}
                        style={{ marginBottom: 2 }}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: colors.background.primary,
                          textAlign: 'center',
                          fontFamily: typography.body.fontFamily,
                        }}
                      >
                        LOCKED
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: colors.background.primary,
                        textAlign: 'center',
                        fontFamily: typography.h2.fontFamily,
                      }}
                    >
                      {item.streak_days}
                    </Text>
                  )}

                  {item.active && !item.isLocked && (
                    <View
                      style={{
                        position: 'absolute',
                        right: 3,
                        bottom: 5,
                      }}
                    >
                      <Text style={{ fontSize: 16, textAlign: 'center' }}>
                        {getProgressionEmoji(item.streak_days)}
                      </Text>
                    </View>
                  )}

                  {item.streak_level > 0 && !item.isLocked && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 3,
                        right: 3,
                        backgroundColor: colors.background.primary,
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: 'bold',
                          color: streakColor,
                          fontFamily: typography.body.fontFamily,
                        }}
                      >
                        {item.streak_level}
                      </Text>
                    </View>
                  )}

                  {item.isLocked && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 3,
                        right: 3,
                        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name="lock-closed" size={12} color={colors.background.primary} />
                    </View>
                  )}
                </View>

                <Text
                  style={{
                    fontSize: 10,
                    color: colors.text.primary,
                    textAlign: 'center',
                    marginTop: spacing.xs,
                    paddingTop: spacing.xs, // Extra padding to prevent cutoff
                    fontWeight: '600',
                    fontFamily: typography.body.fontFamily,
                    minHeight: 16, // Ensure minimum height for text
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
              </Animated.View>
            </Pressable>
          );
        }}
      />

      {selectedStreak && (
        <StreakModal
          streak={selectedStreak}
          onClose={() => setSelectedStreak(null)}
          onNavigateToAddStory={() => {
            setSelectedStreak(null);
            openSheet('STREAK_UPDATE', {
              userId: undefined,
              onSaved: () => {},
            });
          }}
        />
      )}
    </View>
  );
};

