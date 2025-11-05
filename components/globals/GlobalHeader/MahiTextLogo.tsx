import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface MahiTextLogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
}

export const MahiTextLogo: React.FC<MahiTextLogoProps> = ({
  size = 'medium',
  showSubtitle = false,
}) => {
  const { colors, typography } = useTheme();

  const sizeMap = {
    small: { fontSize: 20, fontWeight: '700' },
    medium: { fontSize: 24, fontWeight: '700' },
    large: { fontSize: 32, fontWeight: '700' },
  };

  const currentSize = sizeMap[size];

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      fontSize: currentSize.fontSize,
      fontWeight: currentSize.fontWeight as any,
      fontFamily: typography.h1.fontFamily,
      color: colors.primary[500],
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 11,
      fontWeight: '400',
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginTop: 3,
      letterSpacing: 0.3,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MAHI</Text>
      {showSubtitle && (
        <Text style={styles.subtitle}>Fitness Accountability</Text>
      )}
    </View>
  );
};

