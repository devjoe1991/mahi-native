import React, { Fragment, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';
import { BottomTabBarProps, TabItem, TabType } from './types';
import { TabBarSvg } from './TabBarSvg';
import { PlusButton } from './PlusButton';

// Re-export TabType for convenience
export type { TabType } from './types';

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
  const { colors, theme } = useTheme();
  const [tabBarHeight, setTabBarHeight] = useState(80);
  const [plusButtonPressed, setPlusButtonPressed] = useState(false);

  const tabs: TabItem[] = [
    { id: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
    { id: 'nearby', icon: 'location-outline', activeIcon: 'location', label: 'Nearby' },
    { id: 'plus', icon: 'add-circle', activeIcon: 'add-circle', label: 'Create', isPlus: true },
    { id: 'reels', icon: 'play-outline', activeIcon: 'play', label: 'Reels' },
    { id: 'messages', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', label: 'Messages' },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: 'transparent',
      position: 'relative',
      zIndex: 20,
      minHeight: 64,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    tab: {
      flex: 1,
    },
    tabPressable: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      padding: 15,
    },
    iconContainer: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      zIndex: 15,
    },
    tabBarWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 20,
      backgroundColor: 'transparent',
    },
  });

  const handleTabPress = (tab: TabType) => {
    if (plusButtonPressed) {
      setPlusButtonPressed(false);
    }
    onTabPress(tab);
  };

  const handlePlusPress = () => {
    setPlusButtonPressed(!plusButtonPressed);
    onTabPress('plus');
  };

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = activeTab === tab.id;
    const iconName = isActive && tab.activeIcon ? tab.activeIcon : tab.icon;

    // Combined animation styles for active tabs (transform + opacity in one)
    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: isActive ? withTiming(-10) : withTiming(0) },
          { translateY: isActive ? withTiming(-6) : withTiming(0) },
        ],
        opacity: isActive ? withTiming(1) : withTiming(0.6), // Increased opacity for inactive icons
      };
    });

    // Plus button in center (index 2)
    if (tab.isPlus && index === 2) {
      return (
        <View
          key={tab.id}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              transform: [{ translateY: -(56 / 2 + 12) }], // Increased upward offset for floating effect
            }}
          >
            <PlusButton
              pressed={plusButtonPressed}
              onPress={handlePlusPress}
            />
          </View>
        </View>
      );
    }

    return (
      <View key={tab.id} style={styles.tab}>
        <Pressable onPress={() => handleTabPress(tab.id)}>
          <View style={styles.tabPressable}>
            <Animated.View style={[styles.iconContainer, animatedStyles]}>
              <Ionicons
                name={iconName}
                size={24}
                color={isActive ? colors.primary[500] : colors.text.secondary}
              />
            </Animated.View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <Fragment>
      {plusButtonPressed && (
        <Animated.View
          style={styles.backdrop}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Pressable
            onPress={() => setPlusButtonPressed(false)}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}
      <View style={styles.tabBarWrapper}>
        <View style={{ position: 'relative', width: '100%', minHeight: 70 }}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <TabBarSvg height={tabBarHeight || 70} />
          </View>
          <View
            style={styles.container}
            onLayout={(e) => {
              const newHeight = e.nativeEvent.layout.height;
              if (newHeight !== tabBarHeight) {
                setTabBarHeight(newHeight);
              }
            }}
          >
            {tabs.map((tab, index) => renderTab(tab, index))}
          </View>
        </View>
      </View>
    </Fragment>
  );
};

