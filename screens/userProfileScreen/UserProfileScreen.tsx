import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../store/auth-context';
import { UserProfileScreenProps } from './types';
import { ProfileHeader } from '../../components/userProfile/ProfileHeader';
import { ProfileBody } from '../../components/userProfile/ProfileBody';
import { ProfileHeaderSVG } from '../../components/userProfile/ProfileHeaderSVG';
import { ProfileHeaderComponent } from '../../components/userProfile/ProfileHeaderComponent';
import { getUserById } from '../../data/user';

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  viewMode = false,
  userId,
  onNavigate,
}) => {
  const { colors } = useTheme();
  const { userData: currentUserData } = useAuth();
  const [headerHeight, setHeaderHeight] = useState(150);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(currentUserData);
  const [loading, setLoading] = useState(false);

  // Fetch user data if viewing another user's profile
  useEffect(() => {
    const fetchUserData = async () => {
      if (viewMode && userId) {
        setLoading(true);
        try {
          const user = await getUserById(userId);
          if (user) {
            setUserData(user);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Use current user data
        setUserData(currentUserData);
      }
    };

    fetchUserData();
  }, [viewMode, userId, currentUserData]);

  if (!userData) {
    return null; // Or show loading/error state
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    headerContainer: {
      position: 'relative',
      zIndex: 1,
    },
    contentContainer: {
      flex: 1,
      zIndex: 2,
    },
  });

          const handleEditPress = () => {
            // Open profile edit via bottom sheet (which redirects to full screen)
            // Or navigate directly
            onNavigate?.('EditProfileScreen');
          };

  const handleMessagePress = () => {
    onNavigate?.('MessagesScreen', { userId: userData._id });
  };

  const handleBackPress = () => {
    onNavigate?.('HomeScreen');
  };

  const handleSettingsPress = () => {
    onNavigate?.('SettingsScreen');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ProfileHeaderComponent
        onBackPress={handleBackPress}
        onSettingsPress={handleSettingsPress}
        showBackButton={true} // Always show back button to go back to feed
        showSettingsButton={!viewMode}
      />
      <View style={styles.headerContainer}>
        <ProfileHeaderSVG headerHeight={headerHeight} />
        <View
          onLayout={(e) => {
            const height = e.nativeEvent.layout.height;
            setHeaderHeight(height / 2);
          }}
        >
          <ProfileHeader
            userData={userData}
            viewMode={viewMode}
            onEditPress={handleEditPress}
            onMessagePress={handleMessagePress}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <ProfileBody
          userId={userData._id}
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
        />
      </View>
    </SafeAreaView>
  );
};

