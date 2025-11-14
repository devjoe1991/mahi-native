import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useBottomSheet } from '../context';
import { useAuth } from '../../../../store/auth-context';
import { StreakUpdateSheetProps } from '../types';

export const StreakUpdateSheet: React.FC<StreakUpdateSheetProps> = ({
  userId,
  onSaved,
  initialImage,
}) => {
  const { colors, spacing, typography, theme } = useTheme();
  const { closeSheet } = useBottomSheet();
  const { userData } = useAuth();

  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);

  // REMOVED: pickImage function - camera roll uploads not allowed
  // Users must take photos in real-time as proof of streak

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  }, []);

  const showImagePicker = useCallback(() => {
    // Only show camera option - no camera roll allowed
    Alert.alert(
      'Have you done your Mahi today?',
      'Take a photo now to prove you completed your daily goal.',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [takePhoto]);

  const onCancel = useCallback(() => {
    closeSheet();
    // Reset form
    setSelectedImage(null);
    setCaption('');
  }, [closeSheet]);

  const onSave = useCallback(async () => {
    if (!selectedImage && !caption.trim()) {
      closeSheet();
      return;
    }

    setLoading(true);
    try {
      // TODO: Upload image to Supabase Storage and create post
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const currentUserId = userId || userData?._id;
      const currentStreakDays = userData?.streak_days || 0;
      const newStreakDays = currentStreakDays + 1;
      
      console.log('Streak update:', {
        userId: currentUserId,
        image: selectedImage,
        caption: caption.trim(),
        streakDays: newStreakDays,
      });

      // Sync streak to device calendar
      try {
        const { syncTodayStreak } = await import('../../../../utils/calendarSync');
        await syncTodayStreak(currentUserId || '', newStreakDays);
      } catch (calendarError) {
        console.error('Failed to sync streak to calendar:', calendarError);
        // Don't block the save if calendar sync fails
      }

      onSaved?.();
      closeSheet();
      
      // Reset form
      setSelectedImage(null);
      setCaption('');
    } catch (error) {
      console.error('Failed to update streak:', error);
      Alert.alert('Error', 'Failed to update streak. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedImage, caption, userId, userData, onSaved, closeSheet]);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },
    title: {
      fontSize: typography.h2.fontSize - 3,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.md,
      letterSpacing: 0.5,
      lineHeight: (typography.h2.fontSize - 3) * 1.2,
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 24,
      backgroundColor: colors.background.primary,
      borderWidth: theme === 'dark' ? 0 : 1,
      borderColor: colors.border.primary,
      marginBottom: spacing.md,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imagePlaceholderText: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginTop: spacing.sm,
    },
    addImageButton: {
      backgroundColor: colors.background.primary500,
      borderWidth: 2,
      borderColor: colors.border.primary,
      borderStyle: 'dashed',
      borderRadius: 24,
      padding: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    addImageButtonText: {
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
    input: {
      backgroundColor: colors.background.primary500,
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: 16,
      padding: 15,
      color: colors.text.primary,
      fontSize: typography.body.fontSize - 2,
      fontFamily: typography.body.fontFamily,
      minHeight: 100,
      textAlignVertical: 'top',
      marginBottom: spacing.md,
      letterSpacing: 0.2,
      lineHeight: (typography.body.fontSize - 2) * 1.5,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: 20,
      paddingHorizontal: 24,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    cancelButton: {
      backgroundColor: colors.background.primary,
      borderWidth: 1.5,
      borderColor: colors.border.primary,
    },
    saveButton: {
      backgroundColor: colors.primary[500],
      shadowColor: colors.primary[500],
      shadowOpacity: 0.3,
    },
    buttonText: {
      fontSize: 18,
      fontFamily: typography.body.fontFamily,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    cancelButtonText: {
      color: colors.text.primary,
    },
    saveButtonText: {
      color: colors.background.primary,
    },
    removeImageButton: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      backgroundColor: colors.background.secondary,
      borderRadius: 20,
      padding: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Have you done your Mahi today? 🔥</Text>

      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <Pressable
            style={styles.removeImageButton}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={20} color={colors.text.primary} />
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.addImageButton} onPress={showImagePicker}>
          <Ionicons name="camera-outline" size={24} color={colors.text.primary} />
          <Text style={styles.addImageButtonText}>Take Photo Now</Text>
        </Pressable>
      )}

      <TextInput
        style={styles.input}
        placeholder="What did you do today? (optional)"
        placeholderTextColor={colors.text.secondary}
        value={caption}
        onChangeText={setCaption}
        multiline
        numberOfLines={4}
      />

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.saveButton]}
          onPress={onSave}
          disabled={loading || (!selectedImage && !caption.trim())}
        >
          <Text style={[styles.buttonText, styles.saveButtonText]}>
            {loading ? 'Posting...' : 'Post'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

