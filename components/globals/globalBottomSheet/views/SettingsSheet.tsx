import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useBottomSheet } from '../context';
import { useNavigation } from '../../../../store/navigation-context';

export const SettingsSheet: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { closeSheet } = useBottomSheet();
  const { navigate } = useNavigation();

  const settingsItems = [
    {
      icon: 'person-outline' as keyof typeof Ionicons.glyphMap,
      label: 'Edit Profile',
      onPress: () => {
        closeSheet();
        setTimeout(() => {
          navigate('EditProfileScreen');
        }, 100);
      },
    },
    {
      icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
      label: 'Notifications',
      onPress: () => {
        closeSheet();
        console.log('Notifications');
      },
    },
    {
      icon: 'lock-closed-outline' as keyof typeof Ionicons.glyphMap,
      label: 'Privacy',
      onPress: () => {
        closeSheet();
        console.log('Privacy');
      },
    },
    {
      icon: 'log-out-outline' as keyof typeof Ionicons.glyphMap,
      label: 'Logout',
      onPress: () => {
        closeSheet();
        console.log('Logout');
      },
    },
  ];

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },
    title: {
      fontSize: typography.h2.fontSize - 3,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    icon: {
      marginRight: spacing.md,
    },
    label: {
      flex: 1,
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {settingsItems.map((item, index) => (
        <Pressable
          key={index}
          style={styles.item}
          onPress={item.onPress}
        >
          <Ionicons
            name={item.icon}
            size={24}
            color={colors.text.primary}
            style={styles.icon}
          />
          <Text style={styles.label}>{item.label}</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.secondary}
          />
        </Pressable>
      ))}
    </View>
  );
};
