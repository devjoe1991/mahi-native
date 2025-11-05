import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { IconButtonProps } from './types';

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  badge = false,
  badgeCount,
}) => {
  const { colors, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginLeft: 10,
      position: 'relative',
    },
    badge: {
      backgroundColor: colors.primary[500],
      position: 'absolute',
      right: 2,
      top: 2,
      width: 8,
      height: 8,
      borderRadius: 4,
      zIndex: 1,
    },
    badgeWithCount: {
      backgroundColor: colors.primary[500],
      position: 'absolute',
      right: -4,
      top: -4,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      paddingHorizontal: 4,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    badgeText: {
      fontSize: 10,
      fontFamily: typography.h2.fontFamily,
      color: colors.background.primary,
      fontWeight: '600',
    },
  });

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      android_ripple={{ color: colors.primary[500] + '20' }}
    >
      <Ionicons name={icon as any} size={25} color={colors.text.primary} />
      {badge && (
        <View style={badgeCount ? styles.badgeWithCount : styles.badge}>
          {badgeCount && badgeCount > 0 && (
            <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

