/**
 * Calendar Sync Utility
 * 
 * Handles two-way sync between Mahi app and device calendar:
 * 1. Sync streaks to device calendar (daily updates)
 * 2. Read rest days from device calendar
 * 3. Create/update calendar events for streaks
 */

import { Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import { hasCalendarPermissions, requestCalendarPermissions, getCalendars } from './healthIntegration';

const MAHI_CALENDAR_TITLE = 'Mahi Fitness Streaks';
const REST_DAY_EVENT_PREFIX = 'Rest Day';
const STREAK_EVENT_PREFIX = 'Mahi Streak';

/**
 * Get or create Mahi calendar
 */
export const getOrCreateMahiCalendar = async (): Promise<string | null> => {
  try {
    const hasPermission = await hasCalendarPermissions();
    if (!hasPermission) {
      const granted = await requestCalendarPermissions();
      if (!granted) {
        console.error('Calendar permission not granted');
        return null;
      }
    }

    const calendars = await getCalendars();
    
    // Check if Mahi calendar already exists
    const existingCalendar = calendars.find(
      (cal) => cal.title === MAHI_CALENDAR_TITLE
    );

    if (existingCalendar) {
      return existingCalendar.id;
    }

    // Create new Mahi calendar
    // Get default calendar source
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    const sourceId = defaultCalendar?.source?.id || defaultCalendar?.id;

    const newCalendarId = await Calendar.createCalendarAsync({
      title: MAHI_CALENDAR_TITLE,
      color: '#FF6B35', // Mahi brand color
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: sourceId,
      source: defaultCalendar?.source || defaultCalendar,
      name: MAHI_CALENDAR_TITLE,
      ownerAccount: 'personal',
      timeZone: 'UTC',
      allowsModifications: true,
      allowedAvailabilities: [Calendar.Availability.BUSY],
    });

    return newCalendarId;
  } catch (error) {
    console.error('Error getting/creating Mahi calendar:', error);
    return null;
  }
};

/**
 * Sync streak to device calendar
 * Creates or updates a calendar event for today's streak
 */
export const syncStreakToCalendar = async (
  userId: string,
  streakDays: number,
  date: Date = new Date()
): Promise<boolean> => {
  try {
    const calendarId = await getOrCreateMahiCalendar();
    if (!calendarId) {
      return false;
    }

    // Format date to start of day
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    const endDate = new Date(eventDate);
    endDate.setHours(23, 59, 59, 999);

    const eventTitle = `${STREAK_EVENT_PREFIX} - Day ${streakDays}`;
    const eventId = `mahi_streak_${userId}_${eventDate.toISOString().split('T')[0]}`;

    // Check if event already exists
    const existingEvents = await Calendar.getEventsAsync(
      [calendarId],
      eventDate,
      endDate
    );

    const existingEvent = existingEvents.find(
      (e) => e.title === eventTitle || e.id === eventId
    );

    if (existingEvent) {
      // Update existing event
      await Calendar.updateEventAsync(existingEvent.id, {
        title: eventTitle,
        startDate: eventDate,
        endDate: endDate,
        notes: `Mahi streak day ${streakDays}. Keep it up! 🔥`,
        allDay: true,
      });
    } else {
      // Create new event
      await Calendar.createEventAsync(calendarId, {
        title: eventTitle,
        startDate: eventDate,
        endDate: endDate,
        notes: `Mahi streak day ${streakDays}. Keep it up! 🔥`,
        allDay: true,
        timeZone: 'UTC',
      });
    }

    return true;
  } catch (error) {
    console.error('Error syncing streak to calendar:', error);
    return false;
  }
};

/**
 * Sync rest day to device calendar
 */
export const syncRestDayToCalendar = async (
  date: Date,
  isRestDay: boolean
): Promise<boolean> => {
  try {
    const calendarId = await getOrCreateMahiCalendar();
    if (!calendarId) {
      return false;
    }

    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    const endDate = new Date(eventDate);
    endDate.setHours(23, 59, 59, 999);

    const eventTitle = `${REST_DAY_EVENT_PREFIX} - Mahi`;
    const eventId = `mahi_rest_${eventDate.toISOString().split('T')[0]}`;

    // Check if event already exists
    const existingEvents = await Calendar.getEventsAsync(
      [calendarId],
      eventDate,
      endDate
    );

    const existingEvent = existingEvents.find(
      (e) => e.title.includes(REST_DAY_EVENT_PREFIX) || e.id === eventId
    );

    if (isRestDay) {
      if (existingEvent) {
        // Update existing event
        await Calendar.updateEventAsync(existingEvent.id, {
          title: eventTitle,
          startDate: eventDate,
          endDate: endDate,
          notes: 'Rest day - No Mahi required today. Recharge and recover! 💪',
          allDay: true,
        });
      } else {
        // Create new event
        await Calendar.createEventAsync(calendarId, {
          title: eventTitle,
          startDate: eventDate,
          endDate: endDate,
          notes: 'Rest day - No Mahi required today. Recharge and recover! 💪',
          allDay: true,
          timeZone: 'UTC',
        });
      }
    } else {
      // Remove rest day event if it exists
      if (existingEvent) {
        await Calendar.deleteEventAsync(existingEvent.id);
      }
    }

    return true;
  } catch (error) {
    console.error('Error syncing rest day to calendar:', error);
    return false;
  }
};

/**
 * Get rest days from device calendar
 * Reads all rest day events from Mahi calendar
 */
export const getRestDaysFromCalendar = async (
  startDate: Date = new Date(),
  endDate?: Date
): Promise<Date[]> => {
  try {
    const calendarId = await getOrCreateMahiCalendar();
    if (!calendarId) {
      return [];
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = endDate
      ? new Date(endDate)
      : new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    end.setHours(23, 59, 59, 999);

    const events = await Calendar.getEventsAsync([calendarId], start, end);

    const restDayEvents = events.filter((event) =>
      event.title.includes(REST_DAY_EVENT_PREFIX)
    );

    return restDayEvents.map((event) => new Date(event.startDate));
  } catch (error) {
    console.error('Error getting rest days from calendar:', error);
    return [];
  }
};

/**
 * Sync all rest days to device calendar
 */
export const syncAllRestDaysToCalendar = async (
  restDays: Date[]
): Promise<boolean> => {
  try {
    // First, get existing rest days from calendar
    const existingRestDays = await getRestDaysFromCalendar();

    // Create a set of rest day date strings for comparison
    const restDayStrings = new Set(
      restDays.map((d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date.toISOString().split('T')[0];
      })
    );

    const existingRestDayStrings = new Set(
      existingRestDays.map((d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date.toISOString().split('T')[0];
      })
    );

    // Remove rest days that are no longer selected
    for (const existingDate of existingRestDays) {
      const dateStr = existingDate.toISOString().split('T')[0];
      if (!restDayStrings.has(dateStr)) {
        await syncRestDayToCalendar(existingDate, false);
      }
    }

    // Add new rest days
    for (const restDay of restDays) {
      const dateStr = restDay.toISOString().split('T')[0];
      if (!existingRestDayStrings.has(dateStr)) {
        await syncRestDayToCalendar(restDay, true);
      }
    }

    return true;
  } catch (error) {
    console.error('Error syncing all rest days to calendar:', error);
    return false;
  }
};

/**
 * Sync today's streak to calendar (called daily)
 */
export const syncTodayStreak = async (
  userId: string,
  streakDays: number
): Promise<boolean> => {
  return await syncStreakToCalendar(userId, streakDays, new Date());
};

