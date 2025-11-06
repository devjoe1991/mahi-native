import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';

interface TabBarSvgProps {
  height: number;
}

export const TabBarSvg: React.FC<TabBarSvgProps> = ({ height }) => {
  const { colors, theme } = useTheme();
  const { width: WIDTH } = Dimensions.get('screen');
  const HEIGHT = Math.max(height || 80, 60);
  const SPACE = 10;
  const BUTTON_WIDTH = 50;
  const MIDPOINT1X = WIDTH / 2 - BUTTON_WIDTH / 2 - SPACE;
  const MIDPOINT2X = WIDTH / 2 + BUTTON_WIDTH / 2 + SPACE;
  const MIDPOINTY = BUTTON_WIDTH / 2 + SPACE;

  const radius = 10;

  const path = `
    M0,0
    L${MIDPOINT1X - radius},0
    A${radius},${radius} 0 0,1 ${MIDPOINT1X},${radius}
    A${MIDPOINTY},${MIDPOINTY} 0 0,0 ${WIDTH / 2},${MIDPOINTY}
    A${MIDPOINTY},${MIDPOINTY} 0 0,0 ${MIDPOINT2X},${radius}
    A${radius},${radius} 0 0,1 ${MIDPOINT2X + radius},0
    L${WIDTH},0
    L${WIDTH},${HEIGHT}
    L0,${HEIGHT}
    Z
  `;

  const styles = StyleSheet.create({
    svg: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      shadowColor: colors.text.primary, // Theme-aware shadow color
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: theme === 'dark' ? 0.3 : 0.05,
      shadowRadius: 4,
      elevation: 4,
    },
  });

  return (
    <Svg
      style={styles.svg}
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
    >
      <Path 
        d={path} 
        fill={colors.background.primary}
        stroke={colors.border.primary}
        strokeWidth={StyleSheet.hairlineWidth}
      />
    </Svg>
  );
};

