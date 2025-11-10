import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface CalendarHeatmapProps {
  streakDays: number;
  lastPostDate?: Date | null;
  restDays?: string[];
  postDates?: Date[]; // Dates when user posted/completed Mahi
  joinedDate?: Date | null; // Date when user joined
}

/**
 * Calendar heatmap showing streak consistency with trophy milestones
 * Similar to GitHub contribution graph
 * Shows months from when user joined, swipeable to view previous months
 * Shows trophy emoji (🏆) on every 7th day of streak (7, 14, 21, 28, etc.)
 */
export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  streakDays,
  lastPostDate,
  restDays = [],
  postDates = [],
  joinedDate = null,
}) => {
  const { colors, spacing, typography } = useTheme();
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  
  // Get all months from join date to current month
  const months = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const joinDateObj = joinedDate ? new Date(joinedDate) : new Date(today);
    joinDateObj.setHours(0, 0, 0, 0);
    const joinMonth = new Date(joinDateObj.getFullYear(), joinDateObj.getMonth(), 1);
    
    const monthsList: Date[] = [];
    let current = new Date(currentMonth);
    
    // Generate months from join date to current month
    while (current >= joinMonth) {
      monthsList.push(new Date(current));
      current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    }
    
    return monthsList;
  }, [joinedDate]);
  
  // Get current month index (most recent month)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  // Calculate trophy milestone days (every 7 days: 7, 14, 21, 28, etc.)
  const getTrophyDays = (): Set<string> => {
    if (!lastPostDate || streakDays === 0) return new Set();
    
    try {
      const trophyDays = new Set<string>();
      const localLastPost = new Date(lastPostDate);
      localLastPost.setHours(0, 0, 0, 0);
      
      if (isNaN(localLastPost.getTime())) {
        return new Set();
      }
      
      // Find all 7-day milestones in current streak
      for (let day = 7; day <= streakDays; day += 7) {
        const daysBack = streakDays - day;
        const trophyDate = new Date(localLastPost.getTime() - daysBack * 24 * 60 * 60 * 1000);
        trophyDate.setHours(0, 0, 0, 0);
        
        if (!isNaN(trophyDate.getTime())) {
          trophyDays.add(trophyDate.toISOString().split('T')[0]);
        }
      }
      
      return trophyDays;
    } catch (e) {
      console.warn('Error calculating trophy days:', e);
      return new Set();
    }
  };
  
  const trophyDays = getTrophyDays();
  
  // Calculate current streak period
  const getCurrentStreakPeriod = (): { startDate: Date; endDate: Date } | null => {
    if (!lastPostDate || streakDays === 0) return null;
    
    const localLastPost = new Date(lastPostDate);
    localLastPost.setHours(0, 0, 0, 0);
    
    const endDate = new Date(localLastPost);
    const startDate = new Date(localLastPost);
    startDate.setTime(startDate.getTime() - (streakDays - 1) * 24 * 60 * 60 * 1000);
    
    return { startDate, endDate };
  };
  
  const streakPeriod = getCurrentStreakPeriod();
  
  // Create a set of post date strings for quick lookup
  const postDateStrings = useMemo(() => {
    return new Set(
      postDates.map((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
      })
    );
  }, [postDates]);
  
  // Create a set of rest day date strings for quick lookup
  // Supports both date-based (ISO strings) and day-of-week (backward compatibility)
  const restDayStrings = useMemo(() => {
    const restDaySet = new Set<string>();
    
    restDays.forEach((restDay: string) => {
      // Check if it's a date string (ISO format)
      if (restDay.includes('T') || restDay.match(/^\d{4}-\d{2}-\d{2}/)) {
        try {
          const restDate = new Date(restDay);
          restDate.setHours(0, 0, 0, 0);
          restDaySet.add(restDate.toISOString().split('T')[0]);
        } catch {
          // Invalid date, skip
        }
      }
      // Otherwise, treat as day of week (backward compatibility)
      // We'll handle day-of-week rest days when generating month days
    });
    
    return restDaySet;
  }, [restDays]);

  // Generate days for a specific month
  const generateMonthDays = (monthDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get first day of week for the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    const days: Array<{
      date: Date;
      isActive: boolean;
      isToday: boolean;
      isTrophyDay: boolean;
      isRestDay: boolean;
      isEmpty: boolean;
    }> = [];
    
    // Add empty days at the start to align with week start
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        date: new Date(),
        isActive: false,
        isToday: false,
        isTrophyDay: false,
        isRestDay: false,
        isEmpty: true,
      });
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayDate = new Date(year, month, day);
      dayDate.setHours(0, 0, 0, 0);
      
      const dateKey = dayDate.toISOString().split('T')[0];
      const isToday = dayDate.getTime() === today.getTime();
      
      // Check if user posted on this day
      const hasPost = postDateStrings.has(dateKey);
      
      // Check if it's a rest day (date-based or day-of-week)
      const isRestDayDate = restDayStrings.has(dateKey);
      const dayOfWeek = dayDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const isRestDayOfWeek = restDays.includes(dayOfWeek);
      const isRestDay = isRestDayDate || isRestDayOfWeek;
      
      // Check if it's in current streak
      const isInStreak = streakPeriod && 
        dayDate >= streakPeriod.startDate && 
        dayDate <= streakPeriod.endDate;
      
      // Check if it's a trophy milestone day
      const isTrophyDay = trophyDays.has(dateKey);
      
      // Day is active if user posted (either in current streak or past posts)
      const isActive = hasPost;
      
      days.push({
        date: dayDate,
        isActive,
        isToday,
        isTrophyDay: isTrophyDay && isActive,
        isRestDay,
        isEmpty: false,
      });
    }
    
    // Pad to complete last week
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        days.push({
          date: new Date(),
          isActive: false,
          isToday: false,
          isTrophyDay: false,
          isEmpty: true,
        });
      }
    }
    
    return days;
  };
  
  // Group days into weeks
  const groupDaysIntoWeeks = (days: ReturnType<typeof generateMonthDays>) => {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };
  
  // Render a single month
  const renderMonth = (monthDate: Date, index: number) => {
    const days = generateMonthDays(monthDate);
    const weeks = groupDaysIntoWeeks(days);
    
    return (
      <View style={[styles.monthContainer, { width: SCREEN_WIDTH - spacing.md * 2 }]}>
        <View>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((day, dayIndex) => {
                if (day.isEmpty) {
                  return <View key={dayIndex} style={styles.dayEmpty} />;
                }
                
                // Show trophy emoji for milestone days
                if (day.isTrophyDay && day.isActive) {
                  return (
                    <View
                      key={dayIndex}
                      style={[
                        styles.trophyDay,
                        day.isToday && styles.dayToday,
                      ]}
                    >
                      <Text style={styles.trophyText}>🏆</Text>
                    </View>
                  );
                }
                
                // Regular day square - mark rest days as purple
                return (
                  <View
                    key={dayIndex}
                    style={[
                      styles.day,
                      day.isRestDay 
                        ? styles.dayRestDay 
                        : (day.isActive ? styles.dayActive : styles.dayInactive),
                      day.isToday && styles.dayToday,
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      padding: spacing.md,
      backgroundColor: colors.background.secondary,
      borderRadius: spacing.md,
      margin: spacing.md,
    },
    title: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    day: {
      width: 12,
      height: 12,
      borderRadius: 2,
      marginHorizontal: 1,
    },
    dayActive: {
      backgroundColor: colors.brand.green,
    },
    dayInactive: {
      backgroundColor: colors.background.primary500,
    },
    dayRestDay: {
      backgroundColor: colors.brand.purple,
    },
    dayToday: {
      borderWidth: 2,
      borderColor: colors.brand.purple,
    },
    dayEmpty: {
      width: 12,
      height: 12,
      marginHorizontal: 1,
    },
    monthContainer: {
      paddingHorizontal: spacing.md,
    },
    trophyDay: {
      width: 12,
      height: 12,
      borderRadius: 2,
      marginHorizontal: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brand.green,
    },
    trophyText: {
      fontSize: 10,
    },
    legend: {
      marginTop: spacing.md,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
    },
    legendTitle: {
      fontSize: 11,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    legendText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
      marginLeft: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Streak Calendar</Text>
      <FlatList
        data={months}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `month-${item.getFullYear()}-${item.getMonth()}-${index}`}
        renderItem={({ item, index }) => renderMonth(item, index)}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH - spacing.md * 2,
          offset: (SCREEN_WIDTH - spacing.md * 2) * index,
          index,
        })}
        initialScrollIndex={0}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (SCREEN_WIDTH - spacing.md * 2));
          setCurrentMonthIndex(index);
        }}
      />
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.day, styles.dayInactive]} />
            <Text style={styles.legendText}>No post</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.day, styles.dayActive]} />
            <Text style={styles.legendText}>Posted</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.trophyText}>🏆</Text>
            <Text style={styles.legendText}>7-day milestone</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

