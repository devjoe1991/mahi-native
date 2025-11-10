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
  iconColor,
}) => {
  const { colors, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginLeft: 12,
      position: 'relative',
    },
    badge: {
      backgroundColor: colors.primary[500],
      position: 'absolute',
      right: 0,
      top: 0,
      width: 10,
      height: 10,
      borderRadius: 5,
      zIndex: 1,
      borderWidth: 2,
      borderColor: colors.background.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    badgeWithCount: {
      backgroundColor: colors.primary[500],
      position: 'absolute',
      right: -6,
      top: -6,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      paddingHorizontal: 6,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      borderWidth: 2,
      borderColor: colors.background.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    badgeText: {
      fontSize: 10,
      fontFamily: typography.h2.fontFamily,
      color: colors.background.primary,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
  });

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      android_ripple={{ color: colors.primary[500] + '20' }}
    >
      <Ionicons
        name={icon as any}
        size={25}
        color={iconColor || colors.text.primary}
      />
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

