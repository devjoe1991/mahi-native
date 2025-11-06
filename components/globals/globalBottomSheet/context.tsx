import React, { createContext, useCallback, useContext, useMemo, useState, useRef, useEffect } from 'react';
import Modal from 'react-native-modal';
import { KeyboardAvoidingView, Platform, StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { SheetType, SheetPropsMap, OpenSheet } from './types';

type BottomSheetContextType = {
  openSheet: OpenSheet;
  closeSheet: () => void;
  isOpen: boolean;
  type: SheetType;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheet = () => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) throw new Error('useBottomSheet must be used within GlobalBottomSheetProvider');
  return ctx;
};

type Props = {
  children: React.ReactNode;
};

export const GlobalBottomSheetProvider: React.FC<Props> = ({ children }) => {
  const { colors, spacing } = useTheme();

  const [sheetType, setSheetType] = useState<SheetType>('NONE');
  const [sheetProps, setSheetProps] = useState<SheetPropsMap[SheetType]>({} as any);
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const bottomPadding = 100; // Space for bottom tab bar

  const openSheet = useCallback<OpenSheet>((type, props) => {
    setSheetType(type);
    setSheetProps((props as any) ?? ({} as any));
    setIsOpen(true);
    setContentHeight(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, sheetType]);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
  }, []);

  const content = useMemo(() => {
    if (sheetType === 'SETTINGS') {
      const { SettingsSheet } = require('./views/SettingsSheet');
      return <SettingsSheet />;
    }
    if (sheetType === 'PROFILE_EDIT') {
      const { ProfileEditSheet } = require('./views/ProfileEditSheet');
      return <ProfileEditSheet {...(sheetProps as any)} />;
    }
    if (sheetType === 'STREAK_UPDATE') {
      const { StreakUpdateSheet } = require('./views/StreakUpdateSheet');
      return <StreakUpdateSheet {...(sheetProps as any)} />;
    }
    if (sheetType === 'COMMENTS') {
      const { CommentsSheet } = require('./views/CommentsSheet');
      return <CommentsSheet {...(sheetProps as any)} />;
    }
    return null;
  }, [sheetType, sheetProps]);

  const handleContentSizeChange = useCallback((contentWidth: number, contentHeight: number) => {
    if (contentHeight > 0) {
      setContentHeight(contentHeight);
    }
  }, []);

  const windowHeight = Dimensions.get('window').height;
  const handleHeight = 16;
  const maxSheetHeight = windowHeight * 0.9;
  const dynamicHeight = contentHeight 
    ? Math.min(contentHeight + handleHeight, maxSheetHeight)
    : undefined;

  return (
    <BottomSheetContext.Provider value={{ openSheet, closeSheet, isOpen, type: sheetType }}>
      {children}
      <Modal
        isVisible={isOpen}
        onBackdropPress={closeSheet}
        onSwipeComplete={(e: any) => {
          const dir = (e && (e.swipeDirection || e.direction)) as string | undefined;
          if (dir === 'down') closeSheet();
        }}
        swipeDirection={['down']}
        style={styles.modal}
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={250}
        avoidKeyboard={true}
        propagateSwipe={true}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.background.secondary,
              borderTopLeftRadius: spacing.lg,
              borderTopRightRadius: spacing.lg,
              ...(dynamicHeight ? { height: dynamicHeight, maxHeight: maxSheetHeight } : { maxHeight: maxSheetHeight }),
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border.primary }]} />
          
          <KeyboardAvoidingView 
            style={styles.flex} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView 
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
              onContentSizeChange={handleContentSizeChange}
              showsVerticalScrollIndicator={contentHeight ? contentHeight + handleHeight > maxSheetHeight : true}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={contentHeight ? contentHeight + handleHeight > maxSheetHeight : true}
            >
              <View style={[styles.content, { backgroundColor: colors.background.secondary }]}>
                {content}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </BottomSheetContext.Provider>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    minHeight: 100,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  flex: { 
    flex: 1 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: { 
    flex: 1,
  },
});
