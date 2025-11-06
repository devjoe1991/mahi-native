import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../store/auth-context';
import { EditProfileScreenProps, UserData } from './types';
import { RemoteImage } from '../../components/userProfile/RemoteImage';
import { ProfileHeaderComponent } from '../../components/userProfile/ProfileHeaderComponent';

const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  onNavigate,
  onSave,
}) => {
  const { colors, spacing, typography, theme } = useTheme();
  const { userData: currentUserData, updateUserData } = useAuth();
  const [profilePic, setProfilePic] = useState<string | number>(
    currentUserData?.picturePath || DEFAULT_AVATAR
  );
  const [showCamera, setShowCamera] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState<Partial<UserData>>({
    fullName: currentUserData?.fullName || '',
    username: currentUserData?.username || '',
    email: currentUserData?.email || '',
    bio: currentUserData?.bio || '',
    occupation: currentUserData?.occupation || '',
  });

  // Update form when user data changes
  useEffect(() => {
    if (currentUserData) {
      setUserData({
        fullName: currentUserData.fullName,
        username: currentUserData.username,
        email: currentUserData.email,
        bio: currentUserData.bio,
        occupation: currentUserData.occupation,
      });
      setProfilePic(currentUserData.picturePath || DEFAULT_AVATAR);
    }
  }, [currentUserData]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
    },
    avatarContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: spacing.lg,
    },
    avatarWrapper: {
      position: 'relative',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      resizeMode: 'cover',
    },
    editIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: spacing.xs,
      backgroundColor: colors.background.secondary,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.background.primary,
    },
    title: {
      fontSize: 18,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: colors.background.secondary,
      marginBottom: spacing.md,
      padding: spacing.md,
      borderRadius: 10,
      color: colors.text.primary,
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      margin: spacing.md,
      marginTop: spacing.lg,
    },
    button: {
      backgroundColor: colors.primary[500],
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: colors.background.primary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
  });

  const handleUpdate = async () => {
    try {
      setUploading(true);
      
      // Prepare FormData for file upload (ready for Supabase)
      const formData = new FormData();
      if (currentUserData?._id) {
        formData.append('_id', currentUserData._id);
      }
      formData.append('username', userData.username || '');
      formData.append('fullName', userData.fullName || '');
      formData.append('email', userData.email || '');
      formData.append('occupation', userData.occupation || '');
      formData.append('bio', userData.bio || '');
      
      if (profilePic && profilePic !== DEFAULT_AVATAR && typeof profilePic === 'string') {
        // In real app, append actual file for upload to Supabase Storage
        // Note: Local assets (require()) are handled separately, only string URIs go to FormData
        formData.append('picturePath', profilePic);
      }

      // Update user data via auth context (which will call Supabase in real app)
      const success = await updateUserData({
        ...userData,
        picturePath: profilePic !== DEFAULT_AVATAR ? profilePic : undefined,
      } as Partial<UserData>);

      if (success) {
        onSave?.(userData);
        onNavigate?.('UserProfileScreen');
      } else {
        console.error('Failed to update user data');
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleBackPress = () => {
    onNavigate?.('UserProfileScreen');
  };

  const handleCameraPress = () => {
    // In real app, open camera screen
    setShowCamera(true);
    // For now, just simulate selecting an image
    setTimeout(() => {
      setProfilePic('https://via.placeholder.com/150?text=New+Photo');
      setShowCamera(false);
    }, 500);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ProfileHeaderComponent
        onBackPress={handleBackPress}
        showSettingsButton={false}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          <Pressable style={styles.avatarWrapper} onPress={handleCameraPress}>
            <RemoteImage
              uri={profilePic}
              placeholder={DEFAULT_AVATAR}
              style={styles.avatar}
            />
            <View style={styles.editIconContainer}>
              <Ionicons
                name="camera-outline"
                size={20}
                color={colors.text.primary}
              />
            </View>
          </Pressable>
        </View>

        <Text style={styles.title}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor={colors.text.secondary}
          value={userData.fullName}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, fullName: text }))
          }
        />

        <Text style={styles.title}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor={colors.text.secondary}
          value={userData.username}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, username: text }))
          }
        />

        <Text style={styles.title}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@email.com"
          placeholderTextColor={colors.text.secondary}
          keyboardType="email-address"
          value={userData.email}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, email: text }))
          }
        />

        <Text style={styles.title}>Occupation</Text>
        <TextInput
          style={styles.input}
          placeholder="Software Developer"
          placeholderTextColor={colors.text.secondary}
          value={userData.occupation}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, occupation: text }))
          }
        />

        <Text style={styles.title}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell us about yourself..."
          placeholderTextColor={colors.text.secondary}
          multiline
          numberOfLines={4}
          value={userData.bio}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, bio: text }))
          }
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, uploading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>Update</Text>
        </Pressable>
      </View>

      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text
            style={[
              styles.title,
              { color: colors.background.primary, marginTop: spacing.md },
            ]}
          >
            Uploading...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

