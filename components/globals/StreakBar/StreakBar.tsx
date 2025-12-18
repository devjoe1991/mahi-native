import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
const TEXT_HEIGHT = 50; // Space for text label (fontSize 10 + marginTop + padding) - increased for proper spacing
export const CONTAINER_HEIGHT = ITEM_SIZE + TRANSLATE_VALUE + TEXT_HEIGHT + 30; // Increased buffer to prevent text cutoff

interface StreakBarProps {
  streaks: StreakData[];
  onStreakPress?: (streak: StreakData) => void;
}

// Get ombre gradient colors based on streak index - Creates smooth color transition
const getOmbreGradientColors = (
  index: number,
  totalStreaks: number,
  isLocked: boolean,
  streakDays: number,
  colors: any,
  theme: 'light' | 'dark'
): string[] => {
  if (isLocked) {
    const lockedColor = theme === 'dark' ? colors.border.primary : colors.text.secondary;
    return [lockedColor, lockedColor];
  }

  // Milestone colors (every 10 days) - Special gold gradient
  const isMilestone = streakDays > 0 && streakDays % 10 === 0;
  if (isMilestone) {
    return [colors.brand.yellow, colors.brand.orange]; // Gold to orange gradient
  }

  // Color progression based on streak days - More vibrant as streak grows
  if (streakDays >= 30) {
    return [colors.brand.purpleDark, colors.brand.purple]; // Deep purple to purple gradient
  }
  if (streakDays >= 14) {
    return [colors.brand.magenta, colors.brand.purple]; // Magenta to purple gradient
  }
  if (streakDays >= 7) {
    return [colors.brand.orange, colors.brand.magenta]; // Orange to magenta gradient
  }

  // Ombre gradient based on position in streak list
  // Creates smooth transition from blue -> cyan -> purple -> green -> orange
  const normalizedIndex = index / Math.max(totalStreaks - 1, 1); // 0 to 1
  
  if (normalizedIndex <= 0.2) {
    // Blue to cyan (first 20%)
    const t = normalizedIndex / 0.2;
    return [colors.brand.blue, colors.brand.cyan];
  } else if (normalizedIndex <= 0.4) {
    // Cyan to light blue (20-40%)
    const t = (normalizedIndex - 0.2) / 0.2;
    return [colors.brand.cyan, colors.brand.blue100];
  } else if (normalizedIndex <= 0.6) {
    // Light blue to purple (40-60%)
    const t = (normalizedIndex - 0.4) / 0.2;
    return [colors.brand.blue100, colors.brand.purple];
  } else if (normalizedIndex <= 0.8) {
    // Purple to green (60-80%)
    const t = (normalizedIndex - 0.6) / 0.2;
    return [colors.brand.purple, colors.brand.green];
  } else {
    // Green to orange (80-100%)
    const t = (normalizedIndex - 0.8) / 0.2;
    return [colors.brand.green, colors.brand.orange];
  }
};

// Get single color for locked state or fallback
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
  // For non-locked, return the primary purple color
  return colors.brand.purple;
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
      minHeight: CONTAINER_HEIGHT,
      backgroundColor: colors.background.primary,
      width: '100%',
      paddingBottom: 0, // No bottom padding
      marginBottom: -spacing.xs, // Negative margin for additional spacing reduction
      overflow: 'visible',
    },
    countdownContainer: {
      paddingHorizontal: spacing.md,
      paddingTop: 0,
      paddingBottom: 0,
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
          paddingVertical: 0,
          paddingHorizontal: SCREEN_WIDTH / 2 - ITEM_SIZE / 2,
          paddingBottom: 0, // No padding for minimal spacing
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

          const gradientColors = getOmbreGradientColors(
            index,
            streaks.length,
            item.isLocked,
            item.streak_days,
            colors,
            theme
          );

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
                  marginVertical: 2,
                  marginBottom: spacing.xs, // Reduced bottom margin for compact feel
                  overflow: 'visible', // Allow elements to overflow the circle
                }}
              >
                {item.isLocked ? (
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 60,
                      backgroundColor: streakColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: item.isCurrentUser ? 3.5 : 2.5,
                      borderColor: item.isCurrentUser 
                        ? colors.primary[500] 
                        : colors.border.primary,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                      opacity: 0.65,
                    }}
                  >
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
                  </View>
                ) : (
                  <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: item.isCurrentUser ? 3.5 : 2.5,
                      borderColor: item.isCurrentUser 
                        ? colors.primary[500] 
                        : colors.border.primary,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8,
                    }}
                  >
                    {item.type === 'add_story' ? (
                      <Ionicons name={item.icon as any} size={30} color={colors.background.primary} />
                    ) : (
                      <Text style={{ fontSize: 32, textAlign: 'center' }}>
                        {getProgressionEmoji(item.streak_days)}
                      </Text>
                    )}
                  </LinearGradient>
                )}

                {/* Level badge - positioned outside the circle */}
                {item.streak_level > 0 && !item.isLocked && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      backgroundColor: colors.background.primary,
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                      elevation: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: gradientColors[0],
                        fontFamily: typography.body.fontFamily,
                      }}
                    >
                      {item.streak_level}
                    </Text>
                  </View>
                )}

                {/* Lock badge for locked items */}
                {item.isLocked && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                      elevation: 5,
                    }}
                  >
                    <Ionicons name="lock-closed" size={12} color={colors.background.primary} />
                  </View>
                )}

                <Text
                  style={{
                    fontSize: 10,
                    color: colors.text.primary,
                    textAlign: 'center',
                    marginTop: spacing.xs,
                    paddingTop: 0,
                    paddingBottom: spacing.xs,
                    marginBottom: 0,
                    fontWeight: '600',
                    fontFamily: typography.body.fontFamily,
                    minHeight: 20, // Reduced minimum height for compact feel
                    lineHeight: 14,
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

