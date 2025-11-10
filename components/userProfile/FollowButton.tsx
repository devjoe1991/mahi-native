import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface FollowButtonProps {
  isFollowing?: boolean;
  onPress?: () => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  isFollowing = false,
  onPress,
}) => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    followButtonIcon: {
      position: 'relative',
    },
    plusIcon: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      backgroundColor: colors.background.primary,
      borderRadius: 8,
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
  });

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <View style={styles.followButtonIcon}>
        <Ionicons
          name={isFollowing ? "person" : "person-outline"}
          size={24}
          color={colors.text.primary}
        />
        {!isFollowing && (
          <View style={styles.plusIcon}>
            <Ionicons
              name="add"
              size={10}
              color={colors.text.primary}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

