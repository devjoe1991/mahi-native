import React, { useEffect, useState } from 'react';
import { useAuth } from '../../store/auth-context';
import { useGlobalModal } from '../globals/globalModal';
import { hasPostedToday, isRestDay } from '../../data/streakCheck';

interface DailyCheckInTriggerProps {
  onComplete?: () => void;
  delay?: number; // Delay before showing (ms)
}

/**
 * Trigger component that checks if user needs daily check-in
 * Only shows modal if user hasn't posted today and it's not a rest day
 */
export const DailyCheckInTrigger: React.FC<DailyCheckInTriggerProps> = ({
  onComplete,
  delay = 3000,
}) => {
  const { userData } = useAuth();
  const { openModal } = useGlobalModal();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkAndShow = async () => {
      if (!userData?._id || hasChecked) return;

      try {
        // Check if user has posted today
        const postedToday = await hasPostedToday(userData._id);
        
        // Check if today is a rest day
        const restDay = await isRestDay(userData._id);

        // Only show if:
        // 1. User has an active streak
        // 2. User hasn't posted today
        // 3. Today is not a rest day
        if (
          userData.streak_days &&
          userData.streak_days > 0 &&
          !postedToday &&
          !restDay
        ) {
          setTimeout(() => {
            openModal('DAILY_CHECK_IN', {
              onPostNow: () => {
                onComplete?.();
              },
            });
            setHasChecked(true);
          }, delay);
        } else {
          setHasChecked(true);
        }
      } catch (error) {
        console.error('Error checking daily check-in:', error);
        setHasChecked(true);
      }
    };

    checkAndShow();
  }, [userData, hasChecked, delay, openModal, onComplete]);

  // This component doesn't render anything
  return null;
};

