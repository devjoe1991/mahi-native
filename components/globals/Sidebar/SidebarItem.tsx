import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { useSidebar } from './SidebarContext';

interface SidebarItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color: string;
  badge?: number;
  onPress?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  color,
  badge,
  onPress,
}) => {
  const { colors, typography } = useTheme();
  const { closeSidebar } = useSidebar();

  const handlePress = () => {
    // Close sidebar first
    closeSidebar();
    
    // Call onPress after a short delay to allow sidebar to close
    setTimeout(() => {
      if (onPress) {
        onPress();
      }
    }, 100);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginVertical: 4,
      borderRadius: 12,
      backgroundColor: 'transparent',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${color}20`, // 20% opacity of the color
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    icon: {
      color: color,
    },
    textContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 16,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
    },
    badge: {
      backgroundColor: colors.primary[500],
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
      marginLeft: 8,
    },
    badgeText: {
      color: colors.background.primary,
      fontSize: 12,
      fontWeight: typography.body.fontWeight as any,
      fontFamily: typography.body.fontFamily,
    },
  });

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={color}
          style={styles.icon}
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

