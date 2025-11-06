import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useBottomSheet } from '../context';
import { useAuth } from '../../../../store/auth-context';
import { StreakUpdateSheetProps } from '../types';

export const StreakUpdateSheet: React.FC<StreakUpdateSheetProps> = ({ userId, onSaved }) => {
  const { colors, spacing, typography } = useTheme();
  const { closeSheet } = useBottomSheet();
  const { userData } = useAuth();

  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  }, []);

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
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [pickImage, takePhoto]);

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
      
      console.log('Streak update:', {
        userId: userId || userData?._id,
        image: selectedImage,
        caption: caption.trim(),
      });

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
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      fontFamily: typography.h2.fontFamily,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: spacing.md,
      backgroundColor: colors.background.primary,
      borderWidth: 1,
      borderColor: colors.border.primary,
      marginBottom: spacing.md,
      overflow: 'hidden',
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
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.secondary,
      marginTop: spacing.sm,
    },
    addImageButton: {
      backgroundColor: colors.background.primary,
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: spacing.md,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    addImageButtonText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
    input: {
      backgroundColor: colors.background.primary,
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: spacing.md,
      padding: spacing.md,
      color: colors.text.primary,
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      minHeight: 100,
      textAlignVertical: 'top',
      marginBottom: spacing.md,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    button: {
      flex: 1,
      padding: spacing.md,
      borderRadius: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: colors.background.primary,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    saveButton: {
      backgroundColor: colors.primary[500],
    },
    buttonText: {
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      fontWeight: typography.body.fontWeight as any,
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
      <Text style={styles.title}>Update Streak</Text>

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
          <Text style={styles.addImageButtonText}>Add Photo</Text>
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

