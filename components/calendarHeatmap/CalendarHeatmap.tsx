import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { getTodayLocal, formatDateLocal, normalizeDateLocal } from '../../utils/dateUtils';

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
    const today = getTodayLocal();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const joinDateObj = joinedDate ? normalizeDateLocal(joinedDate) : today;
    const joinMonth = new Date(joinDateObj.getFullYear(), joinDateObj.getMonth(), 1);
    
    const monthsList: Date[] = [];
    let current = new Date(currentMonth);
    
    // Generate months from join date to current month
    while (current >= joinMonth) {
      monthsList.push(new Date(current));
      current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    }
    
    // Reverse so oldest month is first, allowing users to swipe right to reveal past months on the left
    return monthsList.reverse();
  }, [joinedDate]);
  
  // Get current month index (most recent month)
  const [currentMonthIndex, setCurrentMonthIndex] = useState(Math.max(months.length - 1, 0));

  useEffect(() => {
    setCurrentMonthIndex(Math.max(months.length - 1, 0));
  }, [months.length]);

  // Calculate trophy milestone days (every 7 days: 7, 14, 21, 28, etc.)
  const getTrophyDays = (): Set<string> => {
    if (!lastPostDate || streakDays === 0) return new Set();
    
    try {
      const trophyDays = new Set<string>();
      const localLastPost = normalizeDateLocal(lastPostDate);
      
      if (isNaN(localLastPost.getTime())) {
        return new Set();
      }
      
      // Find all 7-day milestones in current streak
      for (let day = 7; day <= streakDays; day += 7) {
        const daysBack = streakDays - day;
        const trophyDate = new Date(localLastPost);
        trophyDate.setDate(trophyDate.getDate() - daysBack);
        
        if (!isNaN(trophyDate.getTime())) {
          trophyDays.add(formatDateLocal(trophyDate));
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
    
    const localLastPost = normalizeDateLocal(lastPostDate);
    
    const endDate = new Date(localLastPost);
    const startDate = new Date(localLastPost);
    startDate.setDate(startDate.getDate() - (streakDays - 1));
    
    return { startDate, endDate };
  };
  
  const streakPeriod = getCurrentStreakPeriod();
  
  // Create a set of post date strings for quick lookup (using local timezone)
  // Normalize all post dates to local timezone to prevent UTC conversion issues
  const postDateStrings = useMemo(() => {
    return new Set(
      postDates.map((date) => {
        // Handle both Date objects and ISO strings
        const dateObj = date instanceof Date ? date : new Date(date);
        const localDate = normalizeDateLocal(dateObj);
        return formatDateLocal(localDate);
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
          const localRestDate = normalizeDateLocal(restDay);
          restDaySet.add(formatDateLocal(localRestDate));
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
    const today = getTodayLocal();
    
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
      // Create date at midnight in local timezone
      const dayDate = new Date(year, month, day);
      // Normalize to ensure it's at midnight local time
      const normalizedDayDate = normalizeDateLocal(dayDate);
      
      // Use local date format for comparison (not UTC)
      const dateKey = formatDateLocal(normalizedDayDate);
      // Compare normalized dates to ensure accurate "today" detection
      const isToday = normalizedDayDate.getTime() === today.getTime();
      
      // Check if user posted on this day
      const hasPost = postDateStrings.has(dateKey);
      
      // Check if it's a rest day (date-based or day-of-week)
      const isRestDayDate = restDayStrings.has(dateKey);
      const dayOfWeek = normalizedDayDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const isRestDayOfWeek = restDays.includes(dayOfWeek);
      const isRestDay = isRestDayDate || isRestDayOfWeek;
      
      // Check if it's in current streak
      const isInStreak = streakPeriod && 
        normalizedDayDate >= streakPeriod.startDate && 
        normalizedDayDate <= streakPeriod.endDate;
      
      // Check if it's a trophy milestone day
      const isTrophyDay = trophyDays.has(dateKey);
      
      // Day is active (green) ONLY if user posted on this day
      const isActive = hasPost;
      
      days.push({
        date: normalizedDayDate,
        isActive,
        isToday,
        isTrophyDay: isTrophyDay && isActive, // Trophy only shows if there's a post
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
          isRestDay: false,
          isEmpty: true,
        });
      }
    }
    
    return days;
  };
  
  // Group days into weeks and reverse each week
  // This logic applies consistently to ALL months (past, present, and future)
  // With row-reverse CSS, we reverse the arrays so dates display 1, 2, 3... left to right
  // Example: Week [Nov 2, Nov 3, Nov 4, Nov 5, Nov 6, Nov 7, Nov 8] becomes
  //          [Nov 8, Nov 7, Nov 6, Nov 5, Nov 4, Nov 3, Nov 2]
  //          Then row-reverse displays it as [Nov 2, Nov 3, Nov 4, Nov 5, Nov 6, Nov 7, Nov 8] ✓
  const groupDaysIntoWeeks = (days: ReturnType<typeof generateMonthDays>) => {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      const week = days.slice(i, i + 7);
      // Reverse the week array so that when row-reverse displays it, dates read left-to-right chronologically
      weeks.push(week.reverse());
    }
    return weeks;
  };
  
  // Render a single month
  // This function is used for ALL months (past, present, and future as account ages)
  // The same reversed logic and row-reverse styling applies consistently to all months
  const renderMonth = (monthDate: Date, index: number) => {
    const days = generateMonthDays(monthDate);
    const weeks = groupDaysIntoWeeks(days);
    
    return (
      <View style={styles.monthItemWrapper}>
        <View style={styles.monthContainer}>
        <View style={styles.weeksContainer}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((day, dayIndex) => {
                if (day.isEmpty) {
                  return (
                    <View
                      key={dayIndex}
                      style={[
                        styles.dayEmpty,
                        dayIndex === 0 && styles.lastInRow, // With row-reverse, index 0 is the rightmost (last in row)
                      ]}
                    />
                  );
                }
                
                // Show trophy emoji for milestone days (only if there's a post)
                if (day.isTrophyDay && day.isActive) {
                  return (
                    <View
                      key={`${weekIndex}-${dayIndex}`}
                      style={[
                        styles.trophyDay,
                        day.isToday && styles.dayToday,
                        dayIndex === 0 && styles.lastInRow, // With row-reverse, index 0 is the rightmost (last in row)
                      ]}
                    >
                      <Text style={styles.trophyText}>🏆</Text>
                    </View>
                  );
                }
                
                // Regular day square
                // Today should always be highlighted with purple border (even if no post)
                // Green only shows when there's a post (day.isActive)
                // Purple background for rest days
                return (
                  <View
                    key={`${weekIndex}-${dayIndex}`}
                    style={[
                      styles.day,
                      day.isRestDay 
                        ? styles.dayRestDay 
                        : (day.isActive ? styles.dayActive : styles.dayInactive),
                      day.isToday && styles.dayToday,
                      dayIndex === 0 && styles.lastInRow, // With row-reverse, index 0 is the rightmost (last in row)
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumberText,
                        day.isToday && { color: colors.brand.purple, fontWeight: '700' },
                      ]}
                      allowFontScaling={false}
                    >
                      {day.date.getDate()}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        </View>
      </View>
    );
  };

  const daySize = 12;
  const dayGap = spacing.xl + 4; // 36px - slightly larger than spacing.xl (32px)
  // Calculate available width: screen width minus container margin and padding
  const containerWidth = SCREEN_WIDTH - spacing.md * 2; // Container width (minus margin)
  const availableWidth = containerWidth - (spacing.md * 2); // Available width (minus padding)
  const calculatedRowWidth = daySize * 7 + dayGap * 6;
  // Use the smaller of calculated width or available width to prevent overflow
  const rowWidth = Math.min(calculatedRowWidth, availableWidth);

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
      // row-reverse applies consistently to ALL months (past, present, future)
      // This ensures dates read left-to-right (1, 2, 3...) for all heatmaps
      flexDirection: 'row-reverse',
      justifyContent: 'center', // Center the week row content
      alignItems: 'center',
      marginBottom: spacing.xs,
      width: rowWidth,
      flexWrap: 'nowrap',
      alignSelf: 'center', // Center the week row within its container
    },
    day: {
      width: daySize,
      height: daySize,
      borderRadius: 2,
      marginRight: dayGap,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
      flexShrink: 0,
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
      width: daySize,
      height: daySize,
      marginRight: dayGap,
      flexShrink: 0,
    },
    dayNumberText: {
      fontSize: 7,
      fontWeight: '400',
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: daySize,
      opacity: 0.6,
      width: daySize,
      height: daySize,
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    monthItemWrapper: {
      width: containerWidth,
      alignItems: 'center',
      justifyContent: 'center',
    },
    monthContainer: {
      paddingHorizontal: spacing.md,
      width: '100%',
      overflow: 'visible',
      alignItems: 'center',
      justifyContent: 'center',
    },
    weeksContainer: {
      width: '100%',
      overflow: 'visible',
      alignItems: 'center',
      justifyContent: 'center', // Center weeks vertically within container
    },
    trophyDay: {
      width: daySize,
      height: daySize,
      borderRadius: 2,
      marginRight: dayGap,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brand.green,
      flexShrink: 0,
    },
    lastInRow: {
      marginRight: 0,
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
          length: containerWidth,
          offset: containerWidth * index,
          index,
        })}
        initialScrollIndex={months.length > 0 ? months.length - 1 : undefined}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / containerWidth);
          setCurrentMonthIndex(index);
        }}
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
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
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.day, styles.dayRestDay]} />
            <Text style={styles.legendText}>Rest day</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

