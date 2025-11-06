export type StreakType = 'add_story' | 'streak_1' | 'streak_2' | 'streak_3' | 'streak_4' | 'streak_5' | 'streak_6';

export type FeedType = 'creation' | 'streak1' | 'streak2' | 'streak3' | 'streak4' | 'streak5' | 'streak6';

export interface StreakData {
  id: number;
  type: StreakType;
  streak_days: number;
  streak_level: number;
  title: string;
  description: string;
  active: boolean;
  isCurrentUser: boolean;
  feedType: FeedType;
  icon: string;
  isUnlocked: boolean;
  isLocked: boolean;
  currentStreak?: boolean;
}

