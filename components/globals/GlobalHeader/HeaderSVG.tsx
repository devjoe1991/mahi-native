import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../../../theme/ThemeProvider';

interface HeaderSVGProps {
  headerHeight: number;
  storyHeight?: number;
}

export const HeaderSVG: React.FC<HeaderSVGProps> = ({ 
  headerHeight, 
  storyHeight = 0 
}) => {
  const { colors, theme } = useTheme();
  const { width: WIDTH } = Dimensions.get('screen');
  const HEIGHT = Math.max(headerHeight, 60) + storyHeight;
  const CURVE_DEPTH = 25; // Increased curve depth for better visibility
  const CURVE_START = HEIGHT; // Curve starts at the bottom edge

  const controlPointX = WIDTH / 2;
  const controlPointY = HEIGHT + CURVE_DEPTH; // Control point for smooth curve

  // Path: Start at top-left, go straight across top, then curve down smoothly at bottom
  const path = `
    M0,0
    L${WIDTH},0
    L${WIDTH},${CURVE_START}
    Q${controlPointX},${controlPointY} 0,${CURVE_START}
    Z
  `;

  const styles = StyleSheet.create({
    svg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: -CURVE_DEPTH, // Extend below to show curve
      zIndex: 0,
    },
  });

  return (
    <Svg
      style={styles.svg}
      width={WIDTH}
      height={HEIGHT + CURVE_DEPTH}
      viewBox={`0 0 ${WIDTH} ${HEIGHT + CURVE_DEPTH}`}
      preserveAspectRatio="none"
    >
      <Path 
        d={path} 
        fill={colors.background.secondary}
        stroke="transparent"
        strokeWidth={0}
      />
    </Svg>
  );
};



const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -20, // Extend below to show curve
  },
});

