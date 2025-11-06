import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface ProfileHeaderComponentProps {
  onBackPress?: () => void;
  onSettingsPress?: () => void;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
}

export const ProfileHeaderComponent: React.FC<ProfileHeaderComponentProps> = ({
  onBackPress,
  onSettingsPress,
  showBackButton = true,
  showSettingsButton = true,
}) => {
  const { colors, spacing } = useTheme();
  const { width: SCREEN_WIDTH } = Dimensions.get('screen');

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: 'transparent',
    },
    safeArea: {
      backgroundColor: 'transparent',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 50,
    },
    button: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    leftContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.leftContainer}>
            {showBackButton && (
              <Pressable style={styles.button} onPress={onBackPress}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.text.primary}
                />
              </Pressable>
            )}
          </View>
          <View style={styles.rightContainer}>
            {showSettingsButton && (
              <Pressable style={styles.button} onPress={onSettingsPress}>
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={colors.text.primary}
                />
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

