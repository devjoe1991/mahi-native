/**
 * Health Data & Calendar Integration
 * 
 * This module handles:
 * - Calendar event detection (workout bookings)
 * - Health data integration (when available)
 * - Smart reminders based on scheduled workouts
 */

import * as Calendar from 'expo-calendar';

export interface WorkoutEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
  isWorkout: boolean; // Detected as workout based on keywords
}

export interface HealthData {
  steps?: number;
  activeMinutes?: number;
  workouts?: Array<{
    type: string;
    startDate: Date;
    endDate: Date;
    calories?: number;
  }>;
}

/**
 * Request calendar permissions
 */
export const requestCalendarPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting calendar permissions:', error);
    return false;
  }
};

/**
 * Check if calendar permissions are granted
 */
export const hasCalendarPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking calendar permissions:', error);
    return false;
  }
};

/**
 * Get all calendars
 */
export const getCalendars = async () => {
  try {
    const hasPermission = await hasCalendarPermissions();
    if (!hasPermission) {
      const granted = await requestCalendarPermissions();
      if (!granted) {
        return [];
      }
    }
    return await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  } catch (error) {
    console.error('Error getting calendars:', error);
    return [];
  }
};

/**
 * Detect if an event is a workout based on keywords
 */
const WORKOUT_KEYWORDS = [
  'workout', 'gym', 'fitness', 'training', 'exercise', 'run', 'running',
  'yoga', 'pilates', 'cycling', 'swim', 'swimming', 'crossfit', 'boxing',
  'martial arts', 'tennis', 'basketball', 'soccer', 'football', 'hiking',
  'walk', 'jog', 'strength', 'cardio', 'spin', 'dance', 'zumba', 'class',
  'session', 'practice', 'match', 'game', 'race', 'marathon', 'triathlon'
];

const isWorkoutEvent = (title: string, notes?: string): boolean => {
  const searchText = `${title} ${notes || ''}`.toLowerCase();
  return WORKOUT_KEYWORDS.some(keyword => searchText.includes(keyword));
};

/**
 * Fetch upcoming workout events from calendar
 */
export const getUpcomingWorkouts = async (
  daysAhead: number = 7
): Promise<WorkoutEvent[]> => {
  try {
    const hasPermission = await hasCalendarPermissions();
    if (!hasPermission) {
      const granted = await requestCalendarPermissions();
      if (!granted) {
        return [];
      }
    }

    const calendars = await getCalendars();
    if (calendars.length === 0) {
      return [];
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + daysAhead);

    const events = await Calendar.getEventsAsync(
      calendars.map(cal => cal.id),
      startDate,
      endDate
    );

    const workoutEvents: WorkoutEvent[] = events
      .filter(event => {
        const isWorkout = isWorkoutEvent(event.title, event.notes);
        return isWorkout;
      })
      .map(event => ({
        id: event.id,
        title: event.title,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        location: event.location,
        notes: event.notes,
        isWorkout: true,
      }));

    return workoutEvents;
  } catch (error) {
    console.error('Error fetching workout events:', error);
    return [];
  }
};

/**
 * Get workouts scheduled for today
 */
export const getTodayWorkouts = async (): Promise<WorkoutEvent[]> => {
  const workouts = await getUpcomingWorkouts(1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return workouts.filter(workout => {
    const workoutDate = new Date(workout.startDate);
    workoutDate.setHours(0, 0, 0, 0);
    return workoutDate >= today && workoutDate < tomorrow;
  });
};

/**
 * Check if user has a workout scheduled today
 */
export const hasWorkoutToday = async (): Promise<boolean> => {
  const todayWorkouts = await getTodayWorkouts();
  return todayWorkouts.length > 0;
};

/**
 * Get next workout event
 */
export const getNextWorkout = async (): Promise<WorkoutEvent | null> => {
  const workouts = await getUpcomingWorkouts(30);
  if (workouts.length === 0) {
    return null;
  }

  const now = new Date();
  const upcoming = workouts.filter(w => w.startDate > now);
  if (upcoming.length === 0) {
    return null;
  }

  return upcoming.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
};

/**
 * Health Data Integration (Placeholder for future implementation)
 * 
 * When health data libraries are integrated, this will:
 * - Fetch steps, active minutes, workouts from Apple Health/Google Fit
 * - Cross-reference with calendar events
 * - Provide insights on workout completion
 */
export const getHealthData = async (
  startDate: Date,
  endDate: Date
): Promise<HealthData> => {
  // TODO: Implement health data fetching
  // This will require:
  // - iOS: react-native-health or Terra SDK
  // - Android: @react-native-community/google-fit or Terra SDK
  // - Or use Expo development build with custom native modules
  
  return {
    steps: undefined,
    activeMinutes: undefined,
    workouts: undefined,
  };
};

/**
 * Smart reminder logic
 * Checks if user has a workout scheduled and hasn't completed their Mahi
 */
export const shouldShowWorkoutReminder = async (): Promise<{
  shouldShow: boolean;
  workout?: WorkoutEvent;
  message?: string;
}> => {
  const nextWorkout = await getNextWorkout();
  if (!nextWorkout) {
    return { shouldShow: false };
  }

  const now = new Date();
  const timeUntilWorkout = nextWorkout.startDate.getTime() - now.getTime();
  const hoursUntilWorkout = timeUntilWorkout / (1000 * 60 * 60);

  // Show reminder if workout is within 2 hours
  if (hoursUntilWorkout <= 2 && hoursUntilWorkout > 0) {
    return {
      shouldShow: true,
      workout: nextWorkout,
      message: `You have "${nextWorkout.title}" coming up soon. Don't forget to complete your Mahi!`,
    };
  }

  // Show reminder if workout is today
  const todayWorkouts = await getTodayWorkouts();
  if (todayWorkouts.length > 0) {
    return {
      shouldShow: true,
      workout: todayWorkouts[0],
      message: `You have "${todayWorkouts[0].title}" scheduled today. Make sure to complete your Mahi!`,
    };
  }

  return { shouldShow: false };
};

