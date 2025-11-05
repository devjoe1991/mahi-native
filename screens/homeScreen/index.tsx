import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { BottomTabBar, TabType } from '../../components/bottomTabBar';
import { GlobalHeader } from '../../components/globals/GlobalHeader';

export const HomeScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    headerContainer: {
      zIndex: 10,
    },
    content: {
      flex: 1,
      padding: spacing.md,
      paddingTop: spacing.lg,
      paddingBottom: 100, // Space for tab bar
    },
    text: {
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
    },
  });

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    // Handle navigation logic here
  };

  const handleSearchPress = () => {
    // Handle search navigation
    console.log('Search pressed');
  };

  const handleNotificationsPress = () => {
    // Handle notifications navigation
    console.log('Notifications pressed');
  };

  const handleMenuPress = () => {
    // Handle menu/sidebar toggle
    console.log('Menu pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <GlobalHeader
          onSearchPress={handleSearchPress}
          onNotificationsPress={handleNotificationsPress}
          onMenuPress={handleMenuPress}
          showUnreadBadge={true}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Home Screen</Text>
      </View>
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

