# 📋 Global Bottom Sheet Component

## 📋 Overview

The Global Bottom Sheet is a reusable, lightweight component that provides a swipe-up modal interface with no height limit and scrollable content. It's used throughout the app for viewing comments, settings, and other interactive content that needs a flexible, accessible presentation.

---

## 🎯 Component Purpose

The Global Bottom Sheet serves as a flexible container for:
- **Post Comments** - View and interact with comments on streak posts (fetches comment data dynamically)
- **Settings** - Access app settings and preferences
- **User Profiles** - Quick profile views
- **Actions** - Context menus and action sheets
- **Content Views** - Any content that needs a swipe-up presentation

**Data Fetching:** The bottom sheet fetches data based on what the user needs to interact with. For example, when viewing comments, it fetches the comments for that specific post. This keeps the component lightweight and data-driven.

---

## 🎨 Design Specifications

### **Visual Design:**
- **Swipe-up Animation** - Smooth slide-up from bottom with backdrop fade
- **No Height Limit** - Content determines height (up to screen height)
- **Scrollable Content** - Internal scrollable area for long content
- **Backdrop** - Semi-transparent overlay that closes on tap
- **Drag Handle** - Visual indicator at top for dragging gesture

### **Theme Integration:**
```typescript
const bottomSheetTheme = {
  light: {
    background: colors.background.primary,      // Aura White
    backdrop: 'rgba(0, 0, 0, 0.5)',            // Semi-transparent overlay
    handle: colors.neutral[400],                // Handle indicator
    border: colors.border.primary,              // Subtle border
  },
  dark: {
    background: colors.background.secondary,    // Dark background
    backdrop: 'rgba(0, 0, 0, 0.8)',            // Darker overlay
    handle: colors.neutral[600],                // Handle indicator
    border: colors.border.primary,              // Subtle border
  }
};
```

---

## 🏗️ Component Architecture

### **Component Structure:**
```
components/globals/GlobalBottomSheet/
├── index.ts                    # Main export
├── GlobalBottomSheet.tsx       # Main component
├── GlobalBottomSheetProvider.tsx  # Context provider
├── useGlobalBottomSheet.ts     # Hook for using bottom sheet
└── types.ts                    # TypeScript interfaces
```

### **Component Interface:**
```typescript
interface GlobalBottomSheetProps {
  // Content to display
  content: React.ReactNode;
  
  // Visibility control
  isVisible: boolean;
  onClose: () => void;
  
  // Customization
  title?: string;
  snapPoints?: number[];        // Optional snap points (if needed)
  enablePanDownToClose?: boolean; // Enable swipe down to close
  enableContentPanningGesture?: boolean; // Enable content scrolling
  
  // Animation
  animationDuration?: number;   // Default: 300ms
  backdropOpacity?: number;     // Default: 0.5
}

// Hook interface
interface UseGlobalBottomSheet {
  openBottomSheet: (content: React.ReactNode, options?: BottomSheetOptions) => void;
  closeBottomSheet: () => void;
  isOpen: boolean;
}
```

---

## 🎨 Styling & Theming

### **Bottom Sheet Container:**
```typescript
const bottomSheetStyles = {
  container: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderBottomWidth: 0,
    maxHeight: '90%',           // Max 90% of screen height
    minHeight: 200,             // Minimum height
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.neutral[400],
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
};
```

### **Animation Specifications:**
- **Slide Up**: 300ms ease-out animation
- **Backdrop Fade**: 300ms fade-in/out
- **Drag Gesture**: Smooth follow during drag
- **Snap Behavior**: Snap to nearest valid position on release

---

## 🎯 Usage Examples

### **Basic Usage:**
```typescript
import { useGlobalBottomSheet } from '@/components/globals/GlobalBottomSheet';

const MyScreen = () => {
  const { openBottomSheet, closeBottomSheet } = useGlobalBottomSheet();
  
  const handleViewComments = () => {
    openBottomSheet(
      <CommentsList postId="post-123" />
    );
  };
  
  return (
    <Button onPress={handleViewComments} title="View Comments" />
  );
};
```

### **Comments View:**
```typescript
const CommentsView = ({ postId }: { postId: string }) => {
  const { colors, spacing } = useTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Fetch comments (mock data or API)
  useEffect(() => {
    // Mock: fetchComments(postId).then(setComments);
  }, [postId]);
  
  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={{ ...typography.h2, color: colors.text.primary }}>
        Comments
      </Text>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </ScrollView>
  );
};
```

### **Settings View:**
```typescript
const SettingsView = () => {
  const { colors, spacing } = useTheme();
  
  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={{ ...typography.h2, color: colors.text.primary }}>
        Settings
      </Text>
      <SettingsList />
    </ScrollView>
  );
};
```

---

## 🔄 Provider Setup

### **App.tsx Integration:**
```typescript
import { GlobalBottomSheetProvider } from '@/components/globals/GlobalBottomSheet';

export default function App() {
  return (
    <ThemeProvider>
      <GlobalBottomSheetProvider>
        {/* Your app screens */}
      </GlobalBottomSheetProvider>
    </ThemeProvider>
  );
}
```

---

## ✨ Features

### **Core Features:**
- ✅ **Swipe-up Animation** - Smooth slide from bottom
- ✅ **No Height Limit** - Content-driven height
- ✅ **Scrollable Content** - Internal ScrollView for long content
- ✅ **Backdrop Dismiss** - Tap backdrop to close
- ✅ **Drag to Close** - Swipe down to dismiss
- ✅ **Theme Support** - Full light/dark mode support
- ✅ **Smooth Animations** - 300ms transitions
- ✅ **Gesture Handling** - Smooth drag gestures

### **Advanced Features:**
- ✅ **Snap Points** - Optional snap positions (if needed)
- ✅ **Custom Content** - Any React component as content
- ✅ **Keyboard Handling** - Adjusts for keyboard appearance
- ✅ **Accessibility** - Proper accessibility labels

---

## 🎨 Interaction Patterns

### **Opening:**
1. User triggers action (tap button, etc.)
2. Backdrop fades in (300ms)
3. Bottom sheet slides up from bottom (300ms)
4. Content becomes scrollable

### **Closing:**
1. User swipes down OR taps backdrop
2. Bottom sheet slides down (300ms)
3. Backdrop fades out (300ms)
4. Component unmounts

### **Content Interaction:**
- Content area is fully scrollable
- Drag handle at top for gesture control
- Backdrop tap closes sheet
- Swipe down gesture closes sheet

---

## 📱 Responsive Design

### **Screen Adaptations:**
- **Small Screens**: Maximum 90% height
- **Large Screens**: Maximum 80% height
- **Tablets**: Maximum 70% height with centered positioning
- **Landscape**: Adapts to available space

---

## 🚀 Implementation Guidelines

### **Component Requirements:**
1. ✅ **Theme Integration** - Use `useTheme` hook
2. ✅ **TypeScript** - Full type safety
3. ✅ **Animations** - Smooth 300ms transitions
4. ✅ **Gestures** - React Native Gesture Handler
5. ✅ **Accessibility** - Proper labels and roles
6. ✅ **Performance** - Optimized rendering

### **Best Practices:**
- Use for content that needs flexible presentation
- Keep content components lightweight
- Ensure content is scrollable for long lists
- Provide clear close actions
- Use appropriate backdrop opacity
- Test on various screen sizes

---

## 🔄 Mock Data Integration

### **Current Phase:**
- Uses mock data for comments, settings, etc.
- Data structure mirrors future Supabase schema
- Easy transition to API calls when backend ready

### **Future Integration:**
```typescript
// Easy swap from mock to API
const fetchComments = async (postId: string) => {
  // Current: return mockComments;
  // Future: return supabase.from('comments').select('*').eq('post_id', postId);
};
```

---

**🎨 The Global Bottom Sheet provides a flexible, beautiful way to present content throughout Mahi!**

