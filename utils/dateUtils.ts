/**
 * Date Utilities
 * 
 * Provides consistent date handling using local timezone (not UTC)
 * This prevents timezone-related bugs where dates shift by a day
 */

/**
 * Get today's date in local timezone (not UTC)
 * This ensures consistent date handling across timezones
 */
export const getTodayLocal = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Format a date to YYYY-MM-DD string in local timezone (not UTC)
 * This prevents timezone shifts when comparing dates
 * 
 * @param date - The date to format
 * @returns Date string in YYYY-MM-DD format (local timezone)
 */
export const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Normalize a date to local timezone (ignore time component)
 * Creates a new Date object with only year, month, and day
 * 
 * @param date - The date to normalize
 * @returns New Date object with time set to midnight in local timezone
 */
export const normalizeDateLocal = (date: Date | string): Date => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

/**
 * Check if two dates are the same day (in local timezone)
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if both dates represent the same day
 */
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = normalizeDateLocal(date1);
  const d2 = normalizeDateLocal(date2);
  return d1.getTime() === d2.getTime();
};

/**
 * Check if a date is today (in local timezone)
 * 
 * @param date - The date to check
 * @returns True if the date is today
 */
export const isToday = (date: Date | string): boolean => {
  const today = getTodayLocal();
  return isSameDay(date, today);
};

