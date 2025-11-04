import { Ionicons } from '@expo/vector-icons';

export type TabType = 'home' | 'nearby' | 'plus' | 'reels' | 'messages';

export interface BottomTabBarProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export interface TabItem {
  id: TabType;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
  label: string;
  isPlus?: boolean;
}

