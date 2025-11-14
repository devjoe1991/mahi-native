import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { getTodayLocal, formatDateLocal, normalizeDateLocal } from '../../utils/dateUtils';

interface RestDaysCalendarProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  minDate?: Date;
  maxDaysAhead?: number; // Maximum days ahead for rest day selection (default: 30)
  streakDays?: number;
  lastPostDate?: Date | null;
  postDates?: Date[]; // Dates when user posted/completed Mahi
  showSaveConfirmation?: boolean; // Show confirmation that rest days are saved
}

/**
 * Calendar component for selecting rest days and viewing streaks
 * Shows future dates for rest day selection
 * Shows past dates with streak markings and milestones
 */
export const RestDaysCalendar: React.FC<RestDaysCalendarProps> = ({
  selectedDates,
  onDatesChange,
  minDate,
  maxDaysAhead = 30,
  streakDays = 0,
  lastPostDate = null,
  postDates = [],
  showSaveConfirmation = false,
}) => {
  // Use local date for minDate if not provided
  const effectiveMinDate = minDate || getTodayLocal();
  const { colors, spacing, typography } = useTheme();
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [currentMonth, setCurrentMonth] = useState<Date>(minDate || getTodayLocal());

  // Calculate trophy milestone days (every 7 days: 7, 14, 21, 28, etc.)
  const getTrophyDays = (): Date[] => {
    if (!lastPostDate || streakDays === 0) return [];
    
    const trophyDays: Date[] = [];
    const localLastPost = normalizeDateLocal(lastPostDate);
    
    if (isNaN(localLastPost.getTime())) return [];
    
    // Find all 7-day milestones in current streak
    for (let day = 7; day <= streakDays; day += 7) {
      const daysBack = streakDays - day;
      const trophyDate = new Date(localLastPost);
      trophyDate.setDate(trophyDate.getDate() - daysBack);
      
      if (!isNaN(trophyDate.getTime())) {
        trophyDays.push(trophyDate);
      }
    }
    
    return trophyDays;
  };

  // Calculate current streak period
  const getCurrentStreakPeriod = (): { startDate: Date; endDate: Date } | null => {
    if (!lastPostDate || streakDays === 0) return null;
    
    const localLastPost = normalizeDateLocal(lastPostDate);
    
    const endDate = new Date(localLastPost);
    const startDate = new Date(localLastPost);
    startDate.setDate(startDate.getDate() - (streakDays - 1));
    
    return { startDate, endDate };
  };

  // Convert dates to marked dates format with streaks and milestones
  useEffect(() => {
    const marked: { [key: string]: any } = {};
    const today = getTodayLocal();
    
    // Mark streak days (past dates) first
    const streakPeriod = getCurrentStreakPeriod();
    const trophyDays = getTrophyDays();
    const trophyDayStrings = new Set(trophyDays.map(d => formatDateLocal(d)));
    
    postDates.forEach((postDate) => {
      const date = normalizeDateLocal(postDate);
      const dateStr = formatDateLocal(date);
      
      // Only mark past dates for streaks
      if (date >= today) {
        return;
      }
      
      // Check if it's in current streak
      const isInStreak = streakPeriod && date >= streakPeriod.startDate && date <= streakPeriod.endDate;
      const isTrophyDay = trophyDayStrings.has(dateStr);
      
      const dots: Array<{ key: string; color: string }> = [];
      let customStyles: any = {};
      let dotColor = colors.text.secondary;
      
      if (isTrophyDay) {
        // Trophy milestone day
        dots.push({ key: 'trophy', color: colors.brand.orange });
        customStyles = {
          container: {
            backgroundColor: colors.brand.orange + '20',
            borderRadius: 16,
          },
          text: {
            color: colors.text.primary,
            fontWeight: '700',
          },
        };
        dotColor = colors.brand.orange;
      }
      
      if (isInStreak) {
        // Active streak day
        dots.push({ key: 'streak', color: colors.brand.green });
        if (!isTrophyDay) {
          customStyles = {
            container: {
              backgroundColor: colors.brand.green + '15',
              borderRadius: 16,
            },
            text: {
              color: colors.text.primary,
            },
          };
          dotColor = colors.brand.green;
        }
      }
      
      if (dots.length === 0) {
        // Past post (not in current streak)
        dots.push({ key: 'post', color: colors.text.secondary });
      }
      
      marked[dateStr] = {
        marked: true,
        dotColor,
        customStyles,
        dots,
      };
    });

    // Mark rest days (show for both past and future dates)
    selectedDates.forEach((date) => {
      const normalizedDate = normalizeDateLocal(date);
      const dateStr = formatDateLocal(normalizedDate);
      // If this date already has markings, combine them
      if (marked[dateStr]) {
        // Add rest day dot to existing dots
        const existingDots = marked[dateStr].dots || [];
        marked[dateStr] = {
          ...marked[dateStr],
          selected: true,
          selectedColor: colors.primary[500],
          selectedTextColor: colors.background.primary,
          dots: [...existingDots, { key: 'rest', color: colors.background.primary }],
        };
      } else {
        marked[dateStr] = {
          selected: true,
          selectedColor: colors.primary[500],
          selectedTextColor: colors.background.primary,
          marked: true,
          dots: [{ key: 'rest', color: colors.background.primary }],
        };
      }
    });

    setMarkedDates(marked);
  }, [selectedDates, streakDays, lastPostDate, postDates, colors]);

  const onDayPress = (day: DateData) => {
    const pressedDate = normalizeDateLocal(new Date(day.dateString));
    const dateStr = day.dateString;
    const today = getTodayLocal();
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + maxDaysAhead);

    // Only allow selecting future dates for rest days (up to maxDaysAhead)
    if (pressedDate < today || pressedDate > maxDate) {
      return; // Don't allow selecting past dates or dates beyond maxDaysAhead
    }

    // Check if date is already selected
    const isSelected = selectedDates.some(
      (d) => formatDateLocal(normalizeDateLocal(d)) === dateStr
    );

    let newSelectedDates: Date[];

    if (isSelected) {
      // Remove date
      newSelectedDates = selectedDates.filter(
        (d) => formatDateLocal(normalizeDateLocal(d)) !== dateStr
      );
    } else {
      // Add date
      newSelectedDates = [...selectedDates, pressedDate];
    }

    onDatesChange(newSelectedDates);
  };

  // Format min and max dates for calendar
  const minDateLocal = normalizeDateLocal(effectiveMinDate);
  const minDateStr = formatDateLocal(minDateLocal);
  const maxDate = new Date(getTodayLocal());
  maxDate.setDate(maxDate.getDate() + maxDaysAhead);
  const maxDateStr = formatDateLocal(maxDate);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.primary,
    },
    calendar: {
      borderRadius: spacing.md,
      overflow: 'hidden',
    },
    customHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: spacing.xs,
      paddingBottom: spacing.xs,
    },
    monthYearContainer: {
      alignItems: 'center',
    },
    monthText: {
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      letterSpacing: 0.5,
      lineHeight: typography.h2.fontSize * 1.2,
    },
    yearText: {
      fontSize: typography.body.fontSize,
      fontWeight: '400',
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
      marginTop: 2,
    },
    selectedInfoContainer: {
      marginTop: spacing.md,
    },
    selectedCount: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    saveConfirmationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
    saveConfirmationText: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.brand.purple,
      marginLeft: spacing.xs,
    },
    legendContainer: {
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
    },
    legendRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: spacing.sm,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: spacing.xs,
    },
    legendText: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
    },
  });

  // Format month name
  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  // Get year from date
  const getYear = (date: Date): string => {
    return date.getFullYear().toString();
  };

  // Handle month change
  const onMonthChange = (month: DateData) => {
    setCurrentMonth(new Date(month.year, month.month - 1, 1));
  };

  const monthName = getMonthName(currentMonth);
  const year = getYear(currentMonth);
  const currentMonthStr = formatDateLocal(currentMonth);

  // Custom header renderer for the calendar
  const renderHeader = (date: Date) => {
    const displayMonth = getMonthName(date);
    const displayYear = getYear(date);
    
    return (
      <View style={styles.customHeaderContainer}>
        <View style={styles.monthYearContainer}>
          <Text style={styles.monthText}>{displayMonth}</Text>
          <Text style={styles.yearText}>{displayYear}</Text>
        </View>
      </View>
    );
  };

  // Custom day renderer to display month name instead of day number
  const renderDay = (day: DateData, state: string) => {
    if (!day) return null;
    
    const isDisabled = state === 'disabled';
    const isSelected = state === 'selected';
    const isToday = state === 'today';
    const date = new Date(day.dateString);
    const monthName = getMonthName(date);
    const dateStr = formatDateLocal(date);
    const markedDate = markedDates[dateStr];
    const dots = markedDate?.dots || [];
    
    return (
      <View style={{ flex: 1, height: 45, alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
        <Text
          style={{
            textAlign: 'center',
            color: isDisabled 
              ? colors.text.secondary + '40' 
              : isSelected 
                ? colors.background.primary 
                : isToday
                  ? colors.primary[500]
                  : colors.text.primary,
            fontSize: 12,
            fontFamily: typography.body.fontFamily,
            fontWeight: isToday ? '600' : '400',
            marginBottom: dots.length > 0 ? 2 : 0,
          }}
          accessibilityLabel={monthName}
          accessibilityHint={monthName}
          numberOfLines={1}
        >
          {monthName}
        </Text>
        {dots.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
            {dots.map((dot, index) => (
              <View
                key={`${dateStr}-dot-${index}`}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: dot.color,
                  marginLeft: index > 0 ? 3 : 0,
                }}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        current={currentMonthStr}
        minDate={undefined} // Show all dates (past and future) to see streaks
        maxDate={maxDateStr} // Limit rest day selection to maxDaysAhead days
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
        markedDates={markedDates}
        markingType="multi-dot"
        disableAllTouchEventsForDisabledDays={false}
        hideExtraDays={true}
        renderHeader={renderHeader}
        renderDay={renderDay}
        dateFormat="MMMM"
        theme={{
          backgroundColor: colors.background.primary,
          calendarBackground: colors.background.primary,
          textSectionTitleColor: colors.text.secondary,
          selectedDayBackgroundColor: colors.primary[500],
          selectedDayTextColor: colors.background.primary,
          todayTextColor: colors.primary[500],
          dayTextColor: colors.text.primary,
          textDisabledColor: colors.text.secondary + '40',
          dotColor: colors.primary[500],
          selectedDotColor: colors.background.primary,
          arrowColor: colors.primary[500],
          monthTextColor: 'transparent', // Hide default month text
          indicatorColor: colors.primary[500],
          textDayFontFamily: typography.body.fontFamily,
          textMonthFontFamily: typography.h2.fontFamily,
          textDayHeaderFontFamily: typography.body.fontFamily,
          textDayFontSize: 16,
          textMonthFontSize: 0, // Hide default month text
          textDayHeaderFontSize: 14,
        }}
        enableSwipeMonths={true}
      />

      {/* Line separator */}
      <View style={styles.legendContainer}>
      </View>

      {selectedDates.length > 0 && (
        <View style={styles.selectedInfoContainer}>
          <Text style={styles.selectedCount}>
            {selectedDates.length} rest day{selectedDates.length !== 1 ? 's' : ''} selected
          </Text>
          {showSaveConfirmation && (
            <View style={styles.saveConfirmationContainer}>
              <Ionicons name="checkmark-circle" size={16} color={colors.brand.purple} />
              <Text style={styles.saveConfirmationText}>
                Saved to profile & synced to calendar
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

