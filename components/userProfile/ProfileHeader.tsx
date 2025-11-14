import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { ProfileHeaderProps, ProfileStatProps } from './types';
import { RemoteImage } from './RemoteImage';

const { width: SCREEN_WIDTH } = Dimensions.get('screen');
const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

const ProfileStat: React.FC<ProfileStatProps> = ({ text, subText, onPress }) => {
  const { colors, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    text: {
      fontWeight: typography.body.fontWeight as any,
      fontSize: 25,
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
    },
    subText: {
      fontSize: 12,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
    },
  });

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.subText}>{subText}</Text>
    </Pressable>
  );
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userData,
  viewMode = false,
  isFollowing = false,
  onEditPress,
  onMessagePress,
  onFollowPress,
}) => {
  const { colors, spacing, typography, theme } = useTheme();
  const profilePic = userData.picturePath || DEFAULT_AVATAR;

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      margin: spacing.lg,
      paddingTop: spacing.xl,
    },
    avatarContainer: {
      width: 150,
      height: 150,
      marginHorizontal: spacing.md,
      position: 'relative',
    },
    avatar: {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 3,
      borderColor: colors.background.primary,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    avatarImage: {
      borderRadius: 75,
    },
    editButton: {
      position: 'absolute',
      right: 0,
      bottom: 5,
      backgroundColor: colors.background.primary,
      padding: spacing.md,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.border.primary,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    messageButton: {
      position: 'absolute',
      left: 0,
      top: 5,
      backgroundColor: colors.background.primary,
      padding: spacing.md,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.border.primary,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    name: {
      fontWeight: typography.h2.fontWeight as any,
      fontSize: 25,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginTop: spacing.md,
      letterSpacing: 0.15,
    },
    username: {
      fontSize: 15,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginTop: spacing.xs,
      letterSpacing: 0.15,
    },
    followButton: {
      marginTop: spacing.md,
      paddingVertical: 10,
      paddingHorizontal: spacing.xl,
      borderRadius: 12,
      backgroundColor: colors.primary[500],
      borderWidth: 1,
      borderColor: colors.primary[500],
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    followingButton: {
      backgroundColor: colors.background.primary500,
      borderColor: colors.border.primary,
    },
    followButtonText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      fontWeight: '600' as any,
      color: colors.text.primary,
      letterSpacing: 0.2,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.lg,
      backgroundColor: colors.background.secondary,
      borderRadius: 16,
      marginHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      width: SCREEN_WIDTH - spacing.md * 2,
      borderWidth: theme === 'dark' ? 0 : 1,
      borderColor: colors.border.primary,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === 'dark' ? 0.15 : 0.08,
      shadowRadius: theme === 'dark' ? 8 : 8,
      elevation: theme === 'dark' ? 4 : 3,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <ImageBackground
          style={styles.avatar}
          imageStyle={styles.avatarImage}
          source={
            typeof profilePic === 'number' 
              ? profilePic 
              : typeof profilePic === 'string' && profilePic
              ? { uri: profilePic }
              : { uri: DEFAULT_AVATAR }
          }
        >
          {!viewMode && (
            <Pressable style={styles.editButton} onPress={onEditPress}>
              <Ionicons
                name="create-outline"
                size={25}
                color={colors.text.primary}
              />
            </Pressable>
          )}
          {viewMode && (
            <Pressable style={styles.messageButton} onPress={onMessagePress}>
              <Ionicons
                name="chatbubble-ellipses"
                size={30}
                color={colors.text.primary}
              />
            </Pressable>
          )}
        </ImageBackground>
      </View>

      <Text style={styles.name}>{userData.fullName}</Text>
      <Text style={styles.username}>@{userData.username}</Text>
      {userData.bio && (
        <Text
          style={[
            styles.username,
            {
              marginTop: spacing.sm,
              textAlign: 'center',
              paddingHorizontal: spacing.lg,
            },
          ]}
        >
          {userData.bio}
        </Text>
      )}

      {/* Follow Button - Only show in viewMode */}
      {viewMode && onFollowPress && (
        <Pressable
          style={[
            styles.followButton,
            isFollowing && styles.followingButton,
          ]}
          onPress={onFollowPress}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      )}

      <View style={styles.statsContainer}>
        <ProfileStat
          text={`${Math.floor((userData.streak_days || 0) / 7)} 🏆`}
          subText="Milestones"
        />
        <ProfileStat
          text={String(userData.followers || 0)}
          subText="Followers"
        />
        <ProfileStat
          text={String(userData.followings || 0)}
          subText="Followings"
        />
        <ProfileStat
          text={`${userData.streak_days || 0} 🔥`}
          subText="Streak"
        />
      </View>
    </View>
  );
};

