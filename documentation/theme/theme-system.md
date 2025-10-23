# 🎨 Mahi Theme System - Dark/Light Mode

## 📋 Overview

This document defines the comprehensive theming system for Mahi, ensuring every component, screen, and dynamic element supports responsive dark/light mode with modern design principles. Mahi's theme system reflects the concept of a personal aura: ethereal, calming, and full of life.

---

## 🎯 Theme Requirements

### **Core Principles:**
- 🌓 **Universal Support** - Every component must support both themes
- 📱 **Responsive Design** - Adapts to all screen sizes
- 🎨 **Modern Aesthetics** - Contemporary design language
- ♿ **Accessibility** - High contrast and readability
- 🔄 **Smooth Transitions** - Animated theme switching
- 🎯 **Consistent Experience** - Unified design across all screens

---

## 🎨 Color System

### **Light Mode Colors:**
```typescript
const lightTheme = {
  // Primary Colors
  primary: {
    50: '#F0F9FF',   // Lightest blue
    100: '#E0F2FE',  // Very light blue
    200: '#BAE6FD',  // Light blue
    300: '#7DD3FC',  // Medium light blue
    400: '#38BDF8',  // Medium blue
    500: '#0077B6',  // Main blue (Spirit Blue)
    600: '#0284C7',  // Dark blue
    700: '#0369A1',  // Darker blue
    800: '#075985',  // Very dark blue
    900: '#0C4A6E',  // Darkest blue
  },
  
  // Secondary Colors
  secondary: {
    50: '#F0FDF4',   // Lightest green
    100: '#DCFCE7',  // Very light green
    200: '#BBF7D0',  // Light green
    300: '#86EFAC',  // Medium light green
    400: '#4ADE80',  // Medium green
    500: '#00BFA5',  // Main green (Ember Green)
    600: '#16A34A',  // Dark green
    700: '#15803D',  // Darker green
    800: '#166534',  // Very dark green
    900: '#14532D',  // Darkest green
  },
  
  // Neutral Colors
  neutral: {
    0: '#FFFFFF',    // Pure white
    50: '#F9FAFB',   // Lightest gray
    100: '#F3F4F6',  // Very light gray
    200: '#E5E7EB',  // Light gray
    300: '#D1D5DB',  // Medium light gray
    400: '#9CA3AF',  // Medium gray
    500: '#6B7280',  // Base gray
    600: '#4B5563',  // Dark gray
    700: '#374151',  // Darker gray
    800: '#1F2937',  // Very dark gray
    900: '#111827',  // Darkest gray
    950: '#000000',  // Pure black
  },
  
  // Semantic Colors
  success: '#10B981',    // Green
  warning: '#F59E0B',    // Amber
  error: '#EF4444',     // Red
  info: '#3B82F6',      // Blue
  
  // Background Colors
  background: {
    primary: '#F5F5F5',     // Aura White - Main background
    secondary: '#FFFDD0',   // Vapor Cream - Secondary background
    tertiary: '#F3F4F6',    // Tertiary background
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay background
  },
  
  // Text Colors
  text: {
    primary: '#333333',     // Shadow Gray - Main text
    secondary: '#6B7280',   // Secondary text
    tertiary: '#9CA3AF',    // Tertiary text
    inverse: '#FFFFFF',     // Inverse text
    disabled: '#D1D5DB',   // Disabled text
  },
  
  // Border Colors
  border: {
    primary: '#E5E7EB',     // Main border
    secondary: '#D1D5DB',   // Secondary border
    focus: '#0077B6',       // Spirit Blue focus border
    error: '#EF4444',       // Error border
  }
};
```

### **Dark Mode Colors:**
```typescript
const darkTheme = {
  // Primary Colors (same as light)
  primary: {
    50: '#0C4A6E',   // Darkest blue
    100: '#075985',  // Very dark blue
    200: '#0369A1',  // Darker blue
    300: '#0284C7',  // Dark blue
    400: '#0077B6',  // Main blue (Spirit Blue)
    500: '#38BDF8',  // Medium blue
    600: '#7DD3FC',  // Medium light blue
    700: '#BAE6FD',  // Light blue
    800: '#E0F2FE',  // Very light blue
    900: '#F0F9FF',  // Lightest blue
  },
  
  // Secondary Colors (inverted)
  secondary: {
    50: '#14532D',   // Darkest green
    100: '#166534',  // Very dark green
    200: '#15803D',  // Darker green
    300: '#16A34A',  // Dark green
    400: '#00BFA5',  // Main green (Ember Green)
    500: '#4ADE80',  // Medium green
    600: '#86EFAC',  // Medium light green
    700: '#BBF7D0',  // Light green
    800: '#DCFCE7',  // Very light green
    900: '#F0FDF4',  // Lightest green
  },
  
  // Neutral Colors (inverted)
  neutral: {
    0: '#000000',    // Pure black
    50: '#111827',   // Darkest gray
    100: '#1F2937',  // Very dark gray
    200: '#374151',  // Darker gray
    300: '#4B5563',  // Dark gray
    400: '#6B7280',  // Medium gray
    500: '#9CA3AF',  // Base gray
    600: '#D1D5DB',  // Light gray
    700: '#E5E7EB',  // Medium light gray
    800: '#F3F4F6',  // Very light gray
    900: '#F9FAFB',  // Lightest gray
    950: '#FFFFFF',  // Pure white
  },
  
  // Semantic Colors (adjusted for dark)
  success: '#34D399',    // Lighter green
  warning: '#FBBF24',    // Lighter amber
  error: '#F87171',      // Lighter red
  info: '#60A5FA',       // Lighter blue
  
  // Background Colors
  background: {
    primary: '#111827',     // Main background (dark)
    secondary: '#1F2937',   // Secondary background
    tertiary: '#374151',    // Tertiary background
    overlay: 'rgba(0, 0, 0, 0.8)', // Overlay background
  },
  
  // Text Colors
  text: {
    primary: '#F9FAFB',     // Main text (light)
    secondary: '#D1D5DB',   // Secondary text
    tertiary: '#9CA3AF',    // Tertiary text
    inverse: '#111827',     // Inverse text
    disabled: '#6B7280',    // Disabled text
  },
  
  // Border Colors
  border: {
    primary: '#374151',     // Main border
    secondary: '#4B5563',   // Secondary border
    focus: '#0077B6',       // Spirit Blue focus border
    error: '#F87171',       // Error border
  }
};
```

---

## 🎨 Component Theme Structure

### **Base Component Theme:**
```typescript
interface ComponentTheme {
  // Background
  background: {
    primary: string;
    secondary: string;
    hover: string;
    active: string;
    disabled: string;
  };
  
  // Text
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  
  // Border
  border: {
    color: string;
    width: number;
    radius: number;
    focus: string;
  };
  
  // Shadow
  shadow: {
    color: string;
    offset: { x: number; y: number };
    blur: number;
    spread: number;
  };
  
  // Spacing
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}
```

---

## 📱 Screen-Specific Themes

### **Home Screen Theme:**
```typescript
const homeTheme = {
  light: {
    aura: {
      background: '#F5F5F5',
      primaryColor: '#0077B6',
      secondaryColor: '#00BFA5',
      glowColor: 'rgba(0, 119, 182, 0.3)',
    },
    moodSelector: {
      background: '#FFFFFF',
      border: '#E5E7EB',
      active: '#0077B6',
      text: '#333333',
    },
    streakCounter: {
      background: '#FFFDD0',
      border: '#0077B6',
      text: '#333333',
      accent: '#00BFA5',
    }
  },
  dark: {
    aura: {
      background: '#111827',
      primaryColor: '#38BDF8',
      secondaryColor: '#4ADE80',
      glowColor: 'rgba(56, 189, 248, 0.3)',
    },
    moodSelector: {
      background: '#1F2937',
      border: '#374151',
      active: '#38BDF8',
      text: '#F9FAFB',
    },
    streakCounter: {
      background: '#374151',
      border: '#38BDF8',
      text: '#F9FAFB',
      accent: '#4ADE80',
    }
  }
};
```

### **Aura Screen Theme:**
```typescript
const auraTheme = {
  light: {
    visualizer: {
      background: '#F5F5F5',
      auraColors: ['#0077B6', '#00BFA5', '#8B5CF6', '#F59E0B'],
      intensity: '#0077B6',
    },
    colorPicker: {
      background: '#FFFFFF',
      border: '#E5E7EB',
      active: '#0077B6',
    }
  },
  dark: {
    visualizer: {
      background: '#111827',
      auraColors: ['#38BDF8', '#4ADE80', '#A78BFA', '#FBBF24'],
      intensity: '#38BDF8',
    },
    colorPicker: {
      background: '#1F2937',
      border: '#374151',
      active: '#38BDF8',
    }
  }
};
```

---

## 🧩 Component Implementation

### **Theme Provider Setup:**
```typescript
// theme/ThemeProvider.tsx
import React, { createContext, useContext, useState } from 'react';
import { lightTheme, darkTheme } from './themes';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: typeof lightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const colors = theme === 'light' ? lightTheme : darkTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### **Component Usage:**
```typescript
// components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false 
}) => {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    button: {
      backgroundColor: variant === 'primary' ? colors.primary[500] : colors.neutral[100],
      borderColor: variant === 'primary' ? colors.primary[500] : colors.border.primary,
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      opacity: disabled ? 0.5 : 1,
    },
    text: {
      color: variant === 'primary' ? colors.text.inverse : colors.text.primary,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    }
  });
  
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
```

---

## 🎨 Design System Components

### **Typography:**
```typescript
const typography = {
  light: {
    h1: { fontSize: 32, fontWeight: '700', color: '#333333', fontFamily: 'Poppins' },
    h2: { fontSize: 24, fontWeight: '600', color: '#333333', fontFamily: 'Poppins' },
    h3: { fontSize: 20, fontWeight: '600', color: '#333333', fontFamily: 'Poppins' },
    body: { fontSize: 16, fontWeight: '400', color: '#333333', fontFamily: 'Poppins' },
    caption: { fontSize: 14, fontWeight: '400', color: '#6B7280', fontFamily: 'Poppins' },
  },
  dark: {
    h1: { fontSize: 32, fontWeight: '700', color: '#F9FAFB', fontFamily: 'Poppins' },
    h2: { fontSize: 24, fontWeight: '600', color: '#F9FAFB', fontFamily: 'Poppins' },
    h3: { fontSize: 20, fontWeight: '600', color: '#F9FAFB', fontFamily: 'Poppins' },
    body: { fontSize: 16, fontWeight: '400', color: '#F9FAFB', fontFamily: 'Poppins' },
    caption: { fontSize: 14, fontWeight: '400', color: '#9CA3AF', fontFamily: 'Poppins' },
  }
};
```

### **Spacing System:**
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### **Border Radius:**
```typescript
const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
```

---

## 🔄 Theme Switching

### **Smooth Transitions:**
```typescript
// theme/ThemeTransition.tsx
import { Animated } from 'react-native';

export const ThemeTransition = {
  duration: 300,
  easing: 'ease-in-out',
  
  // Animate color changes
  animateColor: (value: Animated.Value, fromColor: string, toColor: string) => {
    return Animated.timing(value, {
      toValue: 1,
      duration: ThemeTransition.duration,
      useNativeDriver: false,
    });
  }
};
```

### **Theme Persistence:**
```typescript
// theme/ThemeStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'mahi_theme';

export const saveTheme = async (theme: 'light' | 'dark') => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const loadTheme = async (): Promise<'light' | 'dark'> => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error('Error loading theme:', error);
    return 'light';
  }
};
```

---

## 📱 Responsive Design

### **Breakpoints:**
```typescript
const breakpoints = {
  xs: 0,      // Extra small devices
  sm: 576,    // Small devices
  md: 768,    // Medium devices
  lg: 992,    // Large devices
  xl: 1200,   // Extra large devices
};
```

### **Responsive Spacing:**
```typescript
const getResponsiveSpacing = (baseSpacing: number, screenWidth: number) => {
  if (screenWidth < breakpoints.sm) return baseSpacing * 0.75;
  if (screenWidth < breakpoints.md) return baseSpacing;
  if (screenWidth < breakpoints.lg) return baseSpacing * 1.25;
  return baseSpacing * 1.5;
};
```

---

## 🎯 Implementation Guidelines

### **Every Component Must:**
1. ✅ **Use useTheme hook** - Access theme colors and properties
2. ✅ **Support both themes** - Light and dark mode variants
3. ✅ **Handle transitions** - Smooth theme switching
4. ✅ **Be responsive** - Adapt to different screen sizes
5. ✅ **Maintain accessibility** - High contrast and readability
6. ✅ **Follow design system** - Consistent spacing, typography, colors

### **Every Screen Must:**
1. ✅ **Apply screen-specific theme** - Use appropriate color schemes
2. ✅ **Handle theme changes** - Update when theme switches
3. ✅ **Maintain layout** - Responsive design across themes
4. ✅ **Preserve functionality** - All features work in both themes
5. ✅ **Smooth transitions** - Animated theme switching

---

## 🚀 Ready to Implement

### **Next Steps:**
1. ✅ **Create ThemeProvider** - Set up theme context
2. ✅ **Define color systems** - Light and dark color palettes
3. ✅ **Create base components** - Button, Card, Text with theme support
4. ✅ **Implement screen themes** - Home, Aura, Streaks, etc.
5. ✅ **Add theme switching** - Toggle functionality
6. ✅ **Test responsiveness** - Ensure all screen sizes work

---

**🎨 Every component and screen will have beautiful, modern dark/light mode support!**

This theme system ensures Mahi will look stunning in both light and dark modes across all devices and screen sizes.