import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useBottomSheet } from '../context';
import { useNavigation } from '../../../../store/navigation-context';
import { ProfileEditSheetProps } from '../types';

export const ProfileEditSheet: React.FC<ProfileEditSheetProps> = ({ userId }) => {
  const { colors, spacing, typography } = useTheme();
  const { closeSheet } = useBottomSheet();
  const { navigate } = useNavigation();

  React.useEffect(() => {
    closeSheet();
    setTimeout(() => {
      navigate('EditProfileScreen');
    }, 100);
  }, [closeSheet, navigate]);

  const styles = StyleSheet.create({
    container: {
      padding: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Opening profile editor...</Text>
    </View>
  );
};
