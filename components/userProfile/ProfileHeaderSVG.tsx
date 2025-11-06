import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';

interface ProfileHeaderSVGProps {
  headerHeight: number;
}

export const ProfileHeaderSVG: React.FC<ProfileHeaderSVGProps> = ({
  headerHeight,
}) => {
  const { colors } = useTheme();
  const { width: WIDTH } = Dimensions.get('screen');
  const HEIGHT = Math.max(headerHeight, 60);
  const CURVE_DEPTH = 20;
  const CURVE_START = HEIGHT - 2;

  const controlPointX = WIDTH / 2;
  const controlPointY = HEIGHT + CURVE_DEPTH;

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
      bottom: -20,
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

