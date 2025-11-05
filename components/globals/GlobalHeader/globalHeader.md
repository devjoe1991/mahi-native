# 📋 Global Header Component

## 📋 Overview

The Global Header is a lightweight, floating navigation component that appears at the top of screens. It features a pill-type floating navigation bar with circular icon buttons for settings and messages. The header adapts to different screen contexts while maintaining consistent design and functionality.

---

## 🎯 Component Purpose

The Global Header serves as:
- **Primary Navigation** - Pill-type floating navigation for main sections
- **Quick Actions** - Circular icon buttons for settings and messages
- **Brand Identity** - Consistent header across all screens
- **User Context** - Displays relevant navigation based on current screen

---

## 🎨 Design Specifications

### **Visual Design:**
- **Pill Navigation** - Floating pill-shaped navigation bar
- **Circular Icons** - Settings and messages as circular icon buttons
- **Floating Design** - Elevated above content with subtle shadow
- **Theme Aware** - Full light/dark mode support
- **Responsive** - Adapts to screen sizes and content

### **Theme Integration:**
```typescript
const headerTheme = {
  light: {
    background: colors.background.primary,      // Aura White
    pillBackground: colors.background.secondary, // Vapor Cream
    iconBackground: colors.background.primary,   // White
    text: colors.text.primary,                   // Shadow Gray
    border: colors.border.primary,               // Subtle border
    shadow: 'rgba(0, 0, 0, 0.1)',               // Subtle shadow
  },
  dark: {
    background: colors.background.primary,       // Dark background
    pillBackground: colors.background.secondary, // Darker background
    iconBackground: colors.background.secondary, // Dark background
    text: colors.text.primary,                   // Light text
    border: colors.border.primary,               // Subtle border
    shadow: 'rgba(0, 0, 0, 0.3)',               // Darker shadow
  }
};
```

---

## 🏗️ Component Architecture

### **Component Structure:**
```
components/globals/GlobalHeader/
├── index.ts                    # Main export
├── GlobalHeader.tsx            # Main header component
├── PillNavigation.tsx          # Pill navigation component
├── IconButton.tsx              # Circular icon button component
├── useGlobalHeader.ts          # Hook for header state
└── types.ts                    # TypeScript interfaces
```

### **Component Interface:**
```typescript
interface GlobalHeaderProps {
  // Navigation items for pill navigation
  navigationItems?: NavigationItem[];
  
  // Active navigation item
  activeItem?: string;
  
  // Callbacks
  onNavigationChange?: (item: string) => void;
  onSettingsPress?: () => void;
  onMessagesPress?: () => void;
  
  // Customization
  showPillNav?: boolean;        // Show/hide pill navigation
  showIcons?: boolean;          // Show/hide icon buttons
  title?: string;               // Optional title text
  
  // Styling
  variant?: 'default' | 'minimal'; // Header variant
}

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  route?: string;
}
```

---

## 🎨 Styling & Theming

### **Header Container:**
```typescript
const headerStyles = {
  container: {
    backgroundColor: colors.background.primary,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Pill Navigation
  pillContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 25,              // Pill shape
    padding: spacing.xs,
    marginHorizontal: spacing.sm,
  },
  pillItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillItemActive: {
    backgroundColor: colors.primary[500], // Spirit Blue
  },
  pillText: {
    ...typography.button,
    color: colors.text.primary,
  },
  pillTextActive: {
    color: colors.text.inverse,    // White text on active
    fontWeight: '600',
  },
  // Icon Buttons
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,              // Circular
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  iconButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
};
```

---

## 🎯 Usage Examples

### **Basic Usage:**
```typescript
import { GlobalHeader } from '@/components/globals/GlobalHeader';

const HomeScreen = () => {
  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'profile', label: 'Profile' },
  ];
  
  const handleNavigationChange = (item: string) => {
    // Navigate to selected screen
    console.log('Navigate to:', item);
  };
  
  const handleSettings = () => {
    // Open settings
    openBottomSheet(<SettingsView />);
  };
  
  const handleMessages = () => {
    // Open messages
    openBottomSheet(<MessagesView />);
  };
  
  return (
    <View style={{ flex: 1 }}>
      <GlobalHeader
        navigationItems={navigationItems}
        activeItem="home"
        onNavigationChange={handleNavigationChange}
        onSettingsPress={handleSettings}
        onMessagesPress={handleMessages}
      />
      {/* Screen content */}
    </View>
  );
};
```

### **Minimal Header (No Navigation):**
```typescript
<GlobalHeader
  variant="minimal"
  title="Settings"
  showPillNav={false}
  onSettingsPress={handleSettings}
  onMessagesPress={handleMessages}
/>
```

### **Custom Navigation:**
```typescript
const navigationItems = [
  { 
    id: 'feed', 
    label: 'Feed',
    icon: <FeedIcon />,
  },
  { 
    id: 'streaks', 
    label: 'Streaks',
    icon: <StreakIcon />,
  },
  { 
    id: 'progress', 
    label: 'Progress',
    icon: <ProgressIcon />,
  },
];
```

---

## 🎨 Component Breakdown

### **Pill Navigation:**
- **Container**: Rounded pill background (Vapor Cream in light mode)
- **Items**: Individual navigation items with active state
- **Active State**: Spirit Blue background with white text
- **Animation**: Smooth transition between active states (150ms)
- **Spacing**: Equal distribution of items

### **Circular Icon Buttons:**
- **Settings Icon**: Circular button on the right
- **Messages Icon**: Circular button next to settings
- **Size**: 40x40px circular buttons
- **Background**: Subtle background with border
- **Active State**: Spirit Blue background when active
- **Badge**: Optional notification badge for messages

---

## ✨ Features

### **Core Features:**
- ✅ **Pill Navigation** - Floating pill-shaped navigation bar
- ✅ **Circular Icons** - Settings and messages buttons
- ✅ **Active States** - Visual feedback for active navigation
- ✅ **Theme Support** - Full light/dark mode support
- ✅ **Smooth Animations** - 150ms transitions
- ✅ **Responsive Design** - Adapts to screen sizes
- ✅ **Floating Design** - Elevated with shadow
- ✅ **Flexible Layout** - Customizable content

### **Advanced Features:**
- ✅ **Badge Support** - Notification badges on icons
- ✅ **Custom Navigation** - Flexible navigation items
- ✅ **Variants** - Default and minimal variants
- ✅ **Accessibility** - Proper labels and roles

---

## 🎨 Interaction Patterns

### **Navigation:**
1. User taps navigation item
2. Active state animates (150ms)
3. Navigation callback fires
4. Screen updates (handled by parent)

### **Icon Buttons:**
1. User taps settings/messages icon
2. Button scales down (0.95) with haptic feedback
3. Action callback fires
4. Bottom sheet or screen navigation opens

### **Visual Feedback:**
- Active navigation item highlighted
- Icon buttons scale on press
- Smooth color transitions
- Haptic feedback on interactions

---

## 📱 Responsive Design

### **Screen Adaptations:**
- **Small Screens**: Compact spacing, smaller icons
- **Large Screens**: Generous spacing, larger icons
- **Tablets**: Wider pill navigation, more spacing
- **Landscape**: Maintains layout, adjusts spacing

### **Content Adaptation:**
- Navigation items adapt to available space
- Icons remain fixed size
- Text truncates if needed
- Layout remains balanced

---

## 🚀 Implementation Guidelines

### **Component Requirements:**
1. ✅ **Theme Integration** - Use `useTheme` hook
2. ✅ **TypeScript** - Full type safety
3. ✅ **Animations** - Smooth 150ms transitions
4. ✅ **Gestures** - Touch feedback and haptics
5. ✅ **Accessibility** - Proper labels and roles
6. ✅ **Performance** - Optimized rendering

### **Best Practices:**
- Keep navigation items to 3-5 items max
- Use clear, concise labels
- Provide visual feedback for all interactions
- Ensure icons are recognizable
- Test on various screen sizes
- Maintain consistent spacing

---

## 🔄 Mock Data Integration

### **Current Phase:**
- Navigation state managed locally
- Mock notification counts
- Settings and messages open bottom sheets
- Easy transition to real navigation when ready

### **Future Integration:**
```typescript
// Easy integration with navigation library
const handleNavigationChange = (item: string) => {
  // Current: Local state update
  // Future: navigation.navigate(item);
};
```

---

## 🎨 Header Variants

### **Default Variant:**
- Full header with pill navigation and icons
- Used on main screens (Home, Explore, Profile)

### **Minimal Variant:**
- Title with icon buttons only
- Used on detail screens (Settings, Messages)

---

**🎨 The Global Header provides consistent, beautiful navigation throughout Mahi!**

