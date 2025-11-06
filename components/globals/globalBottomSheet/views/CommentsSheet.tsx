import React, { useCallback, useState, useRef } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TextInput, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/ThemeProvider';
import { CommentsSheetProps } from '../types';
import { useBottomSheet } from '../context';

export const CommentsSheet: React.FC<CommentsSheetProps> = ({ 
  postId, 
  initialComments, 
  onSubmitComment, 
  onToggleLike 
}) => {
  const { colors, spacing, typography } = useTheme();
  const { closeSheet } = useBottomSheet();
  const [text, setText] = useState('');
  const [comments, setComments] = useState(initialComments ?? []);
  const listRef = useRef<FlatList>(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    
    onSubmitComment?.(trimmed);
    const newComment = {
      id: Math.random().toString(36).slice(2),
      author: 'You',
      text: trimmed,
      liked: false,
    };
    setComments(prev => [newComment, ...prev]);
    setText('');
    Keyboard.dismiss();
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [text, onSubmitComment]);

  const renderItem = useCallback(({ item }: any) => {
    const liked = !!item.liked;
    const toggle = () => {
      const next = !liked;
      setComments(prev => prev.map(c => (c.id === item.id ? { ...c, liked: next } : c)));
      onToggleLike?.(item.id, next);
    };
    
    const itemStyles = StyleSheet.create({
      commentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: spacing.md + spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.primary,
        gap: spacing.sm,
      },
      commentTextWrap: {
        flex: 1,
      },
      author: {
        fontSize: typography.body.fontSize,
        fontWeight: typography.h2.fontWeight as any,
        fontFamily: typography.h2.fontFamily,
        color: colors.text.primary,
        marginBottom: spacing.xs,
      },
      commentText: {
        fontSize: typography.body.fontSize,
        fontFamily: typography.body.fontFamily,
        color: colors.text.secondary,
      },
      likeButton: {
        padding: spacing.xs,
      },
    });

    return (
      <View style={itemStyles.commentRow}>
        <View style={itemStyles.commentTextWrap}>
          <Text style={itemStyles.author}>{item.author}</Text>
          <Text style={itemStyles.commentText}>{item.text}</Text>
        </View>
        <Pressable onPress={toggle} style={itemStyles.likeButton}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? colors.primary[500] : colors.text.secondary}
          />
        </Pressable>
      </View>
    );
  }, [colors, typography, spacing, onToggleLike]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md + spacing.xs,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
      backgroundColor: colors.background.primary,
      gap: spacing.md,
    },
    input: {
      flex: 1,
      paddingHorizontal: spacing.md + spacing.xs,
      paddingVertical: spacing.md,
      borderWidth: 1.5,
      borderColor: colors.border.primary,
      borderRadius: 20,
      backgroundColor: colors.background.secondary,
      color: colors.text.primary,
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
    },
    sendButton: {
      backgroundColor: colors.primary[500],
      borderRadius: 20,
      padding: spacing.md,
      paddingHorizontal: spacing.lg,
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    sendButtonText: {
      color: colors.background.primary,
      fontSize: typography.body.fontSize,
      fontFamily: typography.body.fontFamily,
      fontWeight: typography.body.fontWeight as any,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={comments}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.md }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={{ padding: spacing.lg, alignItems: 'center' }}>
            <Text style={{ color: colors.text.secondary, fontFamily: typography.body.fontFamily }}>
              No comments yet. Be the first!
            </Text>
          </View>
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Add a comment..."
          placeholderTextColor={colors.text.secondary}
          style={styles.input}
        />
        <Pressable onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

