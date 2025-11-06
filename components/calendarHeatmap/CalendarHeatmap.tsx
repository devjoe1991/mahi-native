import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface CalendarHeatmapProps {
  streakDays: number;
  daysInMonth?: number;
}

/**
 * Simple calendar heatmap showing streak consistency
 * Similar to GitHub contribution graph
 */
export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  streakDays,
  daysInMonth = 30,
}) => {
  const { colors, spacing, typography } = useTheme();

  // Generate calendar days - simple representation
  // In real app, would show actual posting history
  const generateDays = () => {
    const days = [];
    const today = new Date();
    const currentDay = today.getDate();
    
    for (let i = 0; i < daysInMonth; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(currentDay - (daysInMonth - 1 - i));
      
      // Simple logic: show active days based on streak
      // In real app, check actual post dates
      const isActive = i >= (daysInMonth - streakDays) && streakDays > 0;
      
      days.push({
        date: dayDate,
        isActive,
        isToday: i === daysInMonth - 1,
      });
    }
    
    return days;
  };

  const days = generateDays();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
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
    legend: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      justifyContent: 'space-between',
    },
    legendText: {
      fontSize: 10,
      fontFamily: typography.body.fontFamily,
      color: colors.text.muted,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Streak Calendar</Text>
      <View>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => (
              <View
                key={dayIndex}
                style={[
                  styles.day,
                  day.isActive ? styles.dayActive : styles.dayInactive,
                  day.isToday && styles.dayToday,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={{ flexDirection: 'row', gap: spacing.xs }}>
          <View style={[styles.day, styles.dayInactive]} />
          <View style={[styles.day, styles.dayActive]} />
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
};

