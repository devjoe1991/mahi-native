import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { BottomTabBar, TabType } from '../../components/bottomTabBar';

export const HomeScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    content: {
      flex: 1,
      padding: spacing.md,
    },
    text: {
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      color: colors.text.primary,
    },
  });

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    // Handle navigation logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Home Screen</Text>
      </View>
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

