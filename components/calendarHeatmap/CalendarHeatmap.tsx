import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface CalendarHeatmapProps {
  streakDays: number;
  lastPostDate?: Date | null;
  restDays?: string[];
  daysInMonth?: number;
}

/**
 * Calendar heatmap showing streak consistency with trophy milestones
 * Similar to GitHub contribution graph
 * Shows trophy emoji (🏆) on every 7th day of streak (7, 14, 21, 28, etc.)
 */
export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  streakDays,
  lastPostDate,
  restDays = [],
  daysInMonth = 30, // Show last 30 days (viewable)
}) => {
  const { colors, spacing, typography } = useTheme();

  // Calculate trophy milestone days in current streak
  const getTrophyDaysInStreak = (): Date[] => {
    if (!lastPostDate || streakDays === 0) return [];
    
    try {
      const trophyDays: Date[] = [];
      // Use user's local timezone
      const localLastPost = new Date(lastPostDate);
      localLastPost.setHours(0, 0, 0, 0);
      
      // Validate date
      if (isNaN(localLastPost.getTime())) {
        return [];
      }
      
      // Find all 7-day milestones in current streak (7, 14, 21, 28, etc.)
      for (let day = 7; day <= streakDays; day += 7) {
        // Use milliseconds for safer date calculation
        const daysBack = streakDays - day;
        const trophyDate = new Date(localLastPost.getTime() - daysBack * 24 * 60 * 60 * 1000);
        trophyDate.setHours(0, 0, 0, 0);
        
        // Validate date before adding
        if (!isNaN(trophyDate.getTime())) {
          trophyDays.push(trophyDate);
        }
      }
      
      return trophyDays;
    } catch (e) {
      console.warn('Error calculating trophy days:', e);
      return [];
    }
  };

  // Generate calendar days with trophy milestones
  const generateDays = () => {
    const days = [];
    const today = new Date();
    // Use user's local timezone
    const localToday = new Date(today);
    localToday.setHours(0, 0, 0, 0);
    
    // Get trophy milestone days (in local timezone)
    const trophyDays = getTrophyDaysInStreak();
    const trophyDayKeys = trophyDays.map(d => {
      try {
        return d.toISOString().split('T')[0];
      } catch (e) {
        return '';
      }
    }).filter(Boolean);
    
    // Calculate current streak period (in local timezone)
    let streakStartDate: Date | null = null;
    if (lastPostDate && streakDays > 0) {
      try {
        const localLastPost = new Date(lastPostDate);
        localLastPost.setHours(0, 0, 0, 0);
        streakStartDate = new Date(localLastPost);
        // Use milliseconds for safer date calculation
        streakStartDate.setTime(streakStartDate.getTime() - (streakDays - 1) * 24 * 60 * 60 * 1000);
      } catch (e) {
        // Invalid date, skip streak calculation
        streakStartDate = null;
      }
    }
    
    for (let i = 0; i < daysInMonth; i++) {
      try {
        // Use milliseconds for safer date calculation
        // All dates in user's local timezone
        const daysAgo = daysInMonth - 1 - i;
        const dayDate = new Date(localToday.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        dayDate.setHours(0, 0, 0, 0);
        
        // Validate date before using
        if (isNaN(dayDate.getTime())) {
          // Still add a placeholder day to maintain grid structure
          days.push({
            date: new Date(),
            isActive: false,
            isToday: false,
            isTrophyDay: false,
            isRestDay: false,
            isEmpty: true,
          });
          continue;
        }
        
        const dateKey = dayDate.toISOString().split('T')[0];
        
        // Check if day is in current streak (compare in local timezone)
        const isInStreak = streakStartDate && 
          dayDate >= streakStartDate && 
          dayDate <= localToday &&
          i >= (daysInMonth - streakDays);
        
        // Check if it's a rest day
        const dayOfWeek = dayDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const isRestDay = restDays.includes(dayOfWeek);
        
        // Check if it's a trophy milestone day
        const isTrophyDay = trophyDayKeys.includes(dateKey);
        
        days.push({
          date: dayDate, // Store local date
          isActive: isInStreak || false,
          isToday: i === daysInMonth - 1,
          isTrophyDay,
          isRestDay,
          isEmpty: false,
        });
      } catch (e) {
        // Still add a placeholder day to maintain grid structure
        days.push({
          date: new Date(),
          isActive: false,
          isToday: false,
          isTrophyDay: false,
          isRestDay: false,
          isEmpty: true,
        });
        console.warn('Invalid date in calendar heatmap:', e);
      }
    }
    
    return days;
  };

  const days = generateDays();
  const weeks = [];
  
  // Group days into weeks (7 days per week)
  for (let i = 0; i < days.length; i += 7) {
    const week = days.slice(i, i + 7);
    // Ensure each week has exactly 7 days (pad with empty days if needed)
    while (week.length < 7) {
      week.push({
        date: new Date(),
        isActive: false,
        isToday: false,
        isTrophyDay: false,
        isRestDay: false,
        isEmpty: true,
      });
    }
    weeks.push(week);
  }

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
    dayToday: {
      borderWidth: 1,
      borderColor: colors.brand.blue,
    },
    trophyDay: {
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trophyText: {
      fontSize: 12,
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
      <View>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              // Show trophy emoji for milestone days
              if (day.isTrophyDay && day.isActive && !day.isEmpty) {
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
              
              // Regular day square - always show, even if inactive
              return (
                <View
                  key={dayIndex}
                  style={[
                    styles.day,
                    day.isActive ? styles.dayActive : styles.dayInactive,
                    day.isToday && styles.dayToday,
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
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

