import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export const HomeScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      padding: spacing.md,
    },
    text: {
      ...typography.h2,
      color: colors.text.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
};

