import React, { useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { StreakData } from './types';
import { StreakModal } from './StreakModal';
import { useBottomSheet } from '../globalBottomSheet';
import { useNavigation } from '../../../store/navigation-context';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const ITEM_SIZE = SCREEN_WIDTH / 5;
const TRANSLATE_VALUE = ITEM_SIZE / 2;
export const CONTAINER_HEIGHT = ITEM_SIZE + TRANSLATE_VALUE + 10;

interface StreakBarProps {
  streaks: StreakData[];
  onStreakPress?: (streak: StreakData) => void;
}

// Get streak color based on level and state
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
    return '#EF4444'; // Error red for milestones
  }

  const feedColors: Record<string, string> = {
    streak1: colors.primary[500], // Spirit Blue
    streak2: '#4ECDC4', // Teal
    streak3: '#45B7D1', // Blue
    streak4: '#8B5CF6', // Purple
    streak5: '#10B981', // Green
    streak6: '#F59E0B', // Orange
    creation: colors.text.primary,
  };

  return feedColors[feedType] || colors.primary[500];
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
  const [selectedStreak, setSelectedStreak] = useState<StreakData | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<Animated.FlatList>(null);

  const handleStreakPress = (streak: StreakData) => {
    if (streak.type === 'add_story') {
      openSheet('STREAK_UPDATE', {
        userId: undefined,
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

  const styles = StyleSheet.create({
    container: {
      height: CONTAINER_HEIGHT,
      backgroundColor: colors.background.primary,
      width: '100%',
    },
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={streaks}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          height: CONTAINER_HEIGHT + 20,
          paddingHorizontal: SCREEN_WIDTH / 2 - ITEM_SIZE / 2,
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
                    marginTop: 5,
                    fontWeight: '600',
                    fontFamily: typography.body.fontFamily,
                  }}
                  numberOfLines={1}
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

