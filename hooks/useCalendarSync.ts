import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from '../store/auth-context';
import { syncTodayStreak } from '../utils/calendarSync';
import { hasCalendarPermissions } from '../utils/healthIntegration';

/**
 * Hook to automatically sync streaks to device calendar
 * Syncs when:
 * - App comes to foreground
 * - User data changes (streak updated)
 * - On mount (if user is authenticated)
 */
export const useCalendarSync = () => {
  const { userData, isAuthenticated } = useAuth();
  const appState = useRef(AppState.currentState);
  const lastSyncedDate = useRef<string | null>(null);

  const syncStreak = async () => {
    if (!isAuthenticated || !userData?._id || !userData?.streak_days) {
      return;
    }

    // Check if we've already synced today
    const today = new Date().toISOString().split('T')[0];
    if (lastSyncedDate.current === today) {
      return;
    }

    // Check calendar permissions
    const hasPermission = await hasCalendarPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      await syncTodayStreak(userData._id, userData.streak_days);
      lastSyncedDate.current = today;
      console.log('Streak synced to calendar:', userData.streak_days);
    } catch (error) {
      console.error('Error syncing streak to calendar:', error);
    }
  };

  useEffect(() => {
    // Sync on mount if authenticated
    if (isAuthenticated && userData) {
      syncStreak();
    }
  }, [isAuthenticated, userData?._id, userData?.streak_days]);

  useEffect(() => {
    // Listen for app state changes
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        syncStreak();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, userData?._id, userData?.streak_days]);
};

