import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';
import { useTheme } from '../../theme/ThemeProvider';

interface RestDaysCalendarProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  minDate?: Date;
}

/**
 * Calendar component for selecting rest days
 * Only shows future dates
 */
export const RestDaysCalendar: React.FC<RestDaysCalendarProps> = ({
  selectedDates,
  onDatesChange,
  minDate = new Date(),
}) => {
  const { colors, spacing, typography } = useTheme();
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  // Convert selected dates to marked dates format
  useEffect(() => {
    const marked: { [key: string]: any } = {};
    
    selectedDates.forEach((date) => {
      const dateStr = date.toISOString().split('T')[0];
      marked[dateStr] = {
        selected: true,
        selectedColor: colors.primary[500],
        selectedTextColor: colors.background.primary,
        marked: true,
        dotColor: colors.background.primary,
      };
    });

    setMarkedDates(marked);
  }, [selectedDates, colors]);

  const onDayPress = (day: DateData) => {
    const pressedDate = new Date(day.dateString);
    const dateStr = day.dateString;

    // Check if date is already selected
    const isSelected = selectedDates.some(
      (d) => d.toISOString().split('T')[0] === dateStr
    );

    let newSelectedDates: Date[];

    if (isSelected) {
      // Remove date
      newSelectedDates = selectedDates.filter(
        (d) => d.toISOString().split('T')[0] !== dateStr
      );
    } else {
      // Add date
      newSelectedDates = [...selectedDates, pressedDate];
    }

    onDatesChange(newSelectedDates);
  };

  // Format min date for calendar
  const minDateStr = minDate.toISOString().split('T')[0];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.primary,
    },
    calendar: {
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: spacing.md,
      overflow: 'hidden',
    },
    headerText: {
      fontSize: typography.h3.fontSize,
      fontFamily: typography.h3.fontFamily,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    description: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginBottom: spacing.md,
      lineHeight: typography.body.fontSize * 1.5,
    },
    selectedCount: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginTop: spacing.md,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select Rest Days</Text>
      <Text style={styles.description}>
        Tap dates on the calendar to mark them as rest days. Only future dates are shown.
      </Text>
      
      <Calendar
        style={styles.calendar}
        current={minDateStr}
        minDate={minDateStr}
        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
        onDayPress={onDayPress}
        markedDates={markedDates}
        markingType="multi-dot"
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
          monthTextColor: colors.text.primary,
          indicatorColor: colors.primary[500],
          textDayFontFamily: typography.body.fontFamily,
          textMonthFontFamily: typography.h2.fontFamily,
          textDayHeaderFontFamily: typography.body.fontFamily,
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        enableSwipeMonths={true}
      />

      {selectedDates.length > 0 && (
        <Text style={styles.selectedCount}>
          {selectedDates.length} rest day{selectedDates.length !== 1 ? 's' : ''} selected
        </Text>
      )}
    </View>
  );
};

