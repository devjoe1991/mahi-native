import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { BottomTabBarProps, TabItem, TabType } from './types';

// Re-export TabType for convenience
export type { TabType } from './types';

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
  const { colors, spacing } = useTheme();

  const tabs: TabItem[] = [
    { id: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
    { id: 'nearby', icon: 'location-outline', activeIcon: 'location', label: 'Nearby' },
    { id: 'plus', icon: 'add-circle', activeIcon: 'add-circle', label: 'Create', isPlus: true },
    { id: 'reels', icon: 'play-outline', activeIcon: 'play', label: 'Reels' },
    { id: 'messages', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', label: 'Messages' },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.xs,
      alignItems: 'center',
      justifyContent: 'space-around',
      shadowColor: colors.text.primary, // Theme-aware shadow
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xs,
    },
    plusTab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xs,
    },
    icon: {
      color: colors.text.secondary,
    },
    iconActive: {
      color: colors.primary[500], // Spirit Blue
    },
    plusIcon: {
      color: colors.primary[500], // Spirit Blue for plus button
    },
  });

  const handleTabPress = (tab: TabType) => {
    // Optional: Add haptic feedback later if desired
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabPress(tab);
  };

  const renderTab = (tab: TabItem) => {
    const isActive = activeTab === tab.id;
    const iconName = isActive && tab.activeIcon ? tab.activeIcon : tab.icon;
    
    // Plus icon is larger and always uses primary color for hierarchy
    if (tab.isPlus) {
      return (
        <TouchableOpacity
          key={tab.id}
          style={styles.plusTab}
          onPress={() => handleTabPress(tab.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={iconName}
            size={32}
            style={styles.plusIcon}
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tab}
        onPress={() => handleTabPress(tab.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={iconName}
          size={24}
          style={isActive ? styles.iconActive : styles.icon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {tabs.map(renderTab)}
    </View>
  );
};

