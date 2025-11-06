import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../../theme/ThemeProvider';
import { useSidebar } from './SidebarContext';
import { SidebarItem } from './SidebarItem';
import { useAuth } from '../../../store/auth-context';
import { useBottomSheet } from '../globalBottomSheet';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.85;

interface SidebarProps {
  onNavigate?: (screen: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const { theme, toggleTheme, colors, spacing, typography } = useTheme();
  const { isOpen, closeSidebar } = useSidebar();
  const { userData } = useAuth();
  const { openSheet } = useBottomSheet();

  // Get user initials from fullName
  const getUserInitials = (fullName?: string) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    return userData?.fullName || userData?.username || 'User';
  };

  // Animation values
  const translateX = useSharedValue(-SIDEBAR_WIDTH);

  // Animated styles
  const animatedSidebarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Animation effects - Seamless, polished spring animation
  useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(0, {
        damping: 25, // Higher damping for smooth, controlled motion
        stiffness: 180, // Balanced stiffness for responsive but smooth feel
        mass: 0.8, // Slightly lighter mass for more natural movement
      });
    } else {
      translateX.value = withTiming(-SIDEBAR_WIDTH, { 
        duration: 220, // Slightly longer for smoother close
        easing: Easing.inOut(Easing.ease), // Smooth easing curve
      });
    }
  }, [isOpen, translateX]);

  // Navigation items with specified colors
  const navigationItems = [
    {
      icon: 'home' as keyof typeof Ionicons.glyphMap,
      title: 'Home',
      color: colors.primary[500],
      screenName: 'HomeScreen',
    },
    {
      icon: 'compass' as keyof typeof Ionicons.glyphMap,
      title: 'Explore',
      color: '#06B6D4', // Cyan
      screenName: 'ExploreScreen',
    },
    {
      icon: 'play-circle' as keyof typeof Ionicons.glyphMap,
      title: 'Reels',
      color: '#8B5CF6', // Purple
      screenName: 'ReelsScreen',
    },
    {
      icon: 'chatbubbles' as keyof typeof Ionicons.glyphMap,
      title: 'Messages',
      color: '#10B981', // Green
      badge: 3,
      screenName: 'MessagesScreen',
    },
    {
      icon: 'search' as keyof typeof Ionicons.glyphMap,
      title: 'Search',
      color: '#F59E0B', // Orange
      screenName: 'SearchScreen',
    },
    {
      icon: 'notifications' as keyof typeof Ionicons.glyphMap,
      title: 'Notifications',
      color: '#EC4899', // Magenta
      badge: 6,
      screenName: 'NotificationsScreen',
    },
    {
      icon: 'person' as keyof typeof Ionicons.glyphMap,
      title: 'Profile',
      color: '#F472B6', // Pink
      screenName: 'UserProfileScreen',
    },
    {
      icon: 'settings-outline' as keyof typeof Ionicons.glyphMap,
      title: 'Settings',
      color: '#EC4899', // Magenta
      onPress: () => {
        closeSidebar();
        setTimeout(() => {
          openSheet('SETTINGS');
        }, 100);
      },
    },
  ];

  const styles = StyleSheet.create({
    sidebar: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: SIDEBAR_WIDTH,
      height: '100%',
      backgroundColor: colors.background.secondary,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      paddingTop: 60, // Account for status bar
      paddingHorizontal: 20,
      paddingBottom: 40,
      zIndex: 1001,
      shadowColor: colors.primary[500],
      shadowOffset: {
        width: 5,
        height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
    },
    userProfile: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 16,
      backgroundColor: colors.background.primary,
      borderRadius: 16,
      marginBottom: 30,
      marginTop: 20,
      zIndex: 1,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    avatarText: {
      color: colors.background.primary,
      fontSize: 20,
      fontWeight: typography.h1.fontWeight as any,
      fontFamily: typography.h1.fontFamily,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: 4,
    },
    userStatus: {
      fontSize: 14,
      fontWeight: typography.body.fontWeight as any,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
    },
    navigationContainer: {
      flex: 1,
    },
    navigationTitle: {
      fontSize: 14,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.secondary,
      marginBottom: 16,
      marginLeft: 4,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    footer: {
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
      marginTop: 20,
    },
    footerTitle: {
      fontSize: 14,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.secondary,
      marginBottom: 16,
      marginLeft: 4,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    themeToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.background.primary,
      borderRadius: 12,
    },
    themeToggleLabel: {
      fontSize: 16,
      fontWeight: typography.body.fontWeight as any,
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 'auto',
    },
  });

  // Don't render if sidebar is not open
  if (!isOpen) {
    return null;
  }

  return (
    <Animated.View style={[styles.sidebar, animatedSidebarStyle]}>
      {/* User Profile Section */}
      <Pressable 
        style={styles.userProfile} 
        onPress={() => {
          closeSidebar();
          setTimeout(() => {
            if (onNavigate) {
              onNavigate('UserProfileScreen');
            }
          }, 100);
        }}
      >
        <View style={styles.avatar}>
          {userData?.picturePath ? (
            <Image
              source={
                typeof userData.picturePath === 'number'
                  ? userData.picturePath
                  : { uri: userData.picturePath }
              }
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          ) : (
            <Text style={styles.avatarText}>
              {getUserInitials(userData?.fullName)}
            </Text>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{getDisplayName()}</Text>
          <Text style={styles.userStatus}>Active now</Text>
        </View>
        {/* Close Button - Inside Profile Section */}
        <Pressable 
          style={styles.closeButton} 
          onPress={(e) => {
            e.stopPropagation();
            closeSidebar();
          }}
        >
          <Ionicons 
            name="close" 
            size={24} 
            color={colors.background.primary}
          />
        </Pressable>
      </Pressable>

      {/* Navigation Items */}
      <ScrollView style={styles.navigationContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.navigationTitle}>Navigation</Text>
        {navigationItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            title={item.title}
            color={item.color}
            badge={item.badge}
            onPress={() => {
              if (item.onPress) {
                item.onPress();
              } else if (onNavigate && item.screenName) {
                onNavigate(item.screenName);
              }
            }}
          />
        ))}
      </ScrollView>

      {/* Footer with Theme Toggle */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Settings</Text>
        <Pressable 
          style={styles.themeToggleContainer}
          onPress={toggleTheme}
        >
          <Text style={styles.themeToggleLabel}>Theme</Text>
          <Ionicons 
            name={theme === 'dark' ? 'moon' : 'sunny'} 
            size={20} 
            color={colors.text.primary}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
};

