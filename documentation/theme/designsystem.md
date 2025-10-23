# 🎨 Mahi Design System

## 📋 Overview

This is the comprehensive design system for Mahi, ensuring consistent, modern, and accessible design across all components and screens with full dark/light mode support. Mahi's design system is built to reflect the concept of a personal aura: ethereal, calming, and full of life. It's modern, minimalistic, and elegant, prioritizing a clean user experience that feels both intuitive and uplifting.

---

## 🎯 Design System Principles

### **Modern Design Philosophy:**
> **"Design is not just how it looks and feels. Design is how it works."** - Steve Jobs

### **Core Values:**
- 🎨 **Visual Delight** - Beautiful, modern design that feels alive and responsive
- 🌊 **Smooth Transitions** - Screen transitions crafted to be smooth and engaging
- ✨ **Interactive Animations** - Every interaction enhanced with subtle animations
- ⚡ **Real-time Feedback** - Immediate visual cues for all user actions
- 🌓 **Accessibility** - High contrast and readability in both themes
- 📱 **Responsiveness** - Adapts to all screen sizes and orientations
- 🎯 **User-Centric** - Intuitive and delightful user experience
- 🚀 **Performance** - Optimized for smooth animations and interactions

### **Modern Design Principles:**
- 🎨 **Minimalism** - Clean, uncluttered interfaces with purposeful elements
- 🔄 **Fluidity** - Seamless, natural interactions that feel intuitive
- 📱 **Mobile-First** - Designed for touch, gestures, and mobile context
- 🎯 **Purposeful** - Every element serves a clear user need
- 🌟 **Delightful** - Surprising moments that bring joy to the user
- ♿ **Inclusive** - Accessible to users of all abilities
- 🔮 **Future-Forward** - Anticipates user needs and trends

---

## 🎨 Color Palette

### **Modern Brand Colors:**
```typescript
const brandColors = {
  primary: '#0077B6',    // Spirit Blue - Main accent color, represents clarity, focus, and serenity
  secondary: '#00BFA5',  // Ember Green - Secondary accent color, symbolizes growth, health, and vitality
  accent: '#8B5CF6',     // Purple accent - Modern, vibrant, trustworthy
  warning: '#F59E0B',    // Warning Amber - Attention-grabbing, warm
  error: '#EF4444',      // Error Red - Clear, urgent, actionable
};

// Mahi Color Psychology:
// Spirit Blue: Clarity, focus, serenity, trust
// Ember Green: Growth, health, vitality, success
// Purple: Creativity, luxury, wisdom, mystery
// Amber: Energy, warmth, caution, optimism
// Red: Urgency, passion, danger, action
```

### **Light Mode Colors:**
```typescript
const lightColors = {
  // Backgrounds
  background: {
    primary: '#F5F5F5',     // Aura White - Main background, clean and breathable
    secondary: '#FFFDD0',   // Vapor Cream - Secondary background, soft and warm
    tertiary: '#F3F4F6',    // Tertiary background
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay
  },
  
  // Text
  text: {
    primary: '#333333',     // Shadow Gray - Main text, deep and readable
    secondary: '#6B7280',   // Secondary text
    tertiary: '#9CA3AF',    // Tertiary text
    inverse: '#FFFFFF',     // White text
    disabled: '#D1D5DB',   // Disabled text
  },
  
  // Borders
  border: {
    primary: '#E5E7EB',     // Main border
    secondary: '#D1D5DB',   // Secondary border
    focus: '#0077B6',       // Spirit Blue focus border
    error: '#EF4444',      // Error border
  },
  
  // Interactive
  interactive: {
    hover: '#F3F4F6',       // Hover state
    active: '#E5E7EB',      // Active state
    disabled: '#F9FAFB',    // Disabled state
  }
};
```

### **Dark Mode Colors:**
```typescript
const darkColors = {
  // Backgrounds
  background: {
    primary: '#111827',     // Main background (dark)
    secondary: '#1F2937',   // Secondary background
    tertiary: '#374151',    // Tertiary background
    overlay: 'rgba(0, 0, 0, 0.8)', // Modal overlay
  },
  
  // Text
  text: {
    primary: '#F9FAFB',     // Main text (light)
    secondary: '#D1D5DB',   // Secondary text
    tertiary: '#9CA3AF',    // Tertiary text
    inverse: '#111827',     // Dark text
    disabled: '#6B7280',    // Disabled text
  },
  
  // Borders
  border: {
    primary: '#374151',     // Main border
    secondary: '#4B5563',   // Secondary border
    focus: '#0077B6',       // Spirit Blue focus border
    error: '#F87171',       // Error border
  },
  
  // Interactive
  interactive: {
    hover: '#374151',       // Hover state
    active: '#4B5563',      // Active state
    disabled: '#1F2937',    // Disabled state
  }
};

#### **Streak System Colors**
* **Blue Mahi:** `#00BFA5` - Primary color for Streak 1, represents the beginning of the fitness journey
* **Milestone Red:** `#FF6B6B` - Used for milestone streaks (10, 20, 30, etc.), represents achievement and celebration
* **Locked Gray:** `#555555` - Used for locked streaks, represents unavailable content
* **Progression Teal:** `#4ECDC4` - Used for Streak 2, represents early progress
* **Progression Blue:** `#45B7D1` - Used for Streak 3, represents building momentum
* **Progression Purple:** `#6C5CE7` - Used for Streak 4, represents dedication
* **Progression Green:** `#00B894` - Used for Streak 5, represents commitment
* **Progression Orange:** `#E17055` - Used for Streak 6, represents advanced progress

#### **Monetization Colors**
* **Premium Gold:** `#FFD700` - Used for premium features, subscription highlights, and "BEST VALUE" badges
* **Premium Container:** `rgba(255,255,255,0.1)` - Semi-transparent white for premium option containers
* **Premium Border:** `#FFD700` - Gold border for subscription options

#### **Status & UI Colors**
* **Online Green:** `#00BFA5` - Green dots for online indicators on user avatars
* **Primary 300:** `#333333` - Used for borders and secondary elements
* **Cyan:** `#00BFA5` - Used for story borders and accent elements
* **White:** `#FFFFFF` - Pure white for text on dark backgrounds and icons

---

## 📝 Typography System

### **Modern Font Strategy:**
```typescript
const fonts = {
  primary: 'Poppins',        // Primary font - Modern, clean, highly readable
  secondary: 'System',       // Fallback system font - Consistent experience
  mono: 'SF Mono',          // Code and numbers - Modern, readable
};

// Mahi Typography Principles:
// - Poppins for modern, clean aesthetic
// - Consistent with Mahi's ethereal, calming brand
// - Optimized for readability across devices
// - Supports accessibility features (Dynamic Type, etc.)
```

### **Font Sizes:**
```typescript
const fontSizes = {
  xs: 12,      // Extra small
  sm: 14,      // Small
  base: 16,    // Base
  lg: 18,      // Large
  xl: 20,      // Extra large
  '2xl': 24,   // 2X large
  '3xl': 30,   // 3X large
  '4xl': 36,   // 4X large
};
```

### **Font Weights:**
```typescript
const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};
```

### **Modern Typography Scale:**
```typescript
const typography = {
  // Headlines - Bold, impactful, hierarchy
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 1.2,
    letterSpacing: -0.5,
    fontFamily: 'Poppins',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 1.3,
    letterSpacing: -0.25,
    fontFamily: 'Poppins',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 1.4,
    letterSpacing: 0,
    fontFamily: 'Poppins',
  },
  
  // Body Text - Readable, comfortable
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 1.5,
    letterSpacing: 0,
    fontFamily: 'Poppins',
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 1.5,
    letterSpacing: 0,
    fontFamily: 'Poppins',
  },
  
  // UI Elements - Clear, actionable
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 1.2,
    letterSpacing: 0.5,
    fontFamily: 'Poppins',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 1.4,
    letterSpacing: 0.25,
    fontFamily: 'Poppins',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 1.4,
    letterSpacing: 0.25,
    fontFamily: 'Poppins',
  }
};
```

---

## 📏 Spacing System

### **Modern Spacing Scale:**
```typescript
const spacing = {
  // Micro Spacing - Fine adjustments
  0: 0,      // No spacing
  1: 4,      // 4px - Micro adjustments
  2: 8,      // 8px - Small gaps
  
  // Base Spacing - Standard UI spacing
  3: 12,     // 12px - Compact spacing
  4: 16,     // 16px - Standard spacing (base unit)
  5: 20,     // 20px - Comfortable spacing
  6: 24,     // 24px - Generous spacing
  
  // Macro Spacing - Layout and sections
  8: 32,     // 32px - Section spacing
  10: 40,    // 40px - Large gaps
  12: 48,    // 48px - Major spacing
  16: 64,    // 64px - Section breaks
  20: 80,    // 80px - Page sections
  24: 96,    // 96px - Major layout
  32: 128,   // 128px - Page breaks
};

// Mahi Spacing Principles:
// - 4px base unit for consistent rhythm
// - Geometric progression for visual harmony
// - Responsive scaling for different screen sizes
// - Purposeful spacing that guides user attention
```

### **Component Spacing:**
```typescript
const componentSpacing = {
  // Padding
  padding: {
    xs: 4,      // Extra small
    sm: 8,      // Small
    md: 16,     // Medium
    lg: 24,     // Large
    xl: 32,     // Extra large
  },
  
  // Margins
  margin: {
    xs: 4,      // Extra small
    sm: 8,      // Small
    md: 16,     // Medium
    lg: 24,     // Large
    xl: 32,     // Extra large
  },
  
  // Gaps
  gap: {
    xs: 4,      // Extra small
    sm: 8,      // Small
    md: 16,     // Medium
    lg: 24,     // Large
    xl: 32,     // Extra large
  }
};
```

---

## 🔲 Border Radius

### **Modern Border Radius Scale:**
```typescript
const borderRadius = {
  none: 0,     // Sharp, angular - for technical elements
  sm: 4,       // Small - subtle rounding for buttons
  md: 8,       // Medium - standard UI elements
  lg: 12,      // Large - cards and containers
  xl: 16,      // Extra large - prominent elements
  '2xl': 20,   // 2X large - special containers
  '3xl': 24,   // 3X large - hero elements
  full: 9999,  // Fully rounded - avatars, pills
};

// Mahi Border Radius Principles:
// - Consistent with modern design trends
// - Creates visual hierarchy and grouping
// - Softens interfaces without being overly rounded
// - Maintains readability and functionality
```

### **Component Border Radius:**
```typescript
const componentBorderRadius = {
  button: 8,        // Buttons
  card: 12,         // Cards
  input: 8,         // Input fields
  modal: 16,        // Modals
  avatar: 9999,     // Avatars (circular)
  badge: 9999,     // Badges (circular)
};
```

---

### **User Interface Components**

All components are designed to feel spacious and uncluttered, with rounded corners to soften the overall aesthetic.

#### **Buttons**

* **Primary Button:** Filled with **Spirit Blue** with white text. Slightly rounded corners.
* **Secondary Button:** Outline in **Spirit Blue** with **Spirit Blue** text.
* **Positive Action Button:** Filled with **Ember Green** with white text. Used for "post streak" or "celebrate" actions.
* **Premium Button (5 Streaks):** Filled with **Blue Mahi** (`#00BFA5`) with white text.
* **Premium Button (10 Streaks):** Filled with **Spirit Blue** (`#0077B6`) with white text.
* **Subscription Button:** Semi-transparent with **Premium Gold** border and text.
* **Free Action Button:** Filled with **Premium Gold** with black text.

#### **Cards & Containers**

* **Background:** **Vapor Cream**
* **Borders:** Subtle 1px border in a lighter shade of **Shadow Gray** to separate elements without feeling heavy.
* **Corners:** All cards and containers have a 10px `border-radius` to create a soft, approachable feel.
* **Premium Container:** Semi-transparent white (`rgba(255,255,255,0.1)`) with 15px `border-radius` for premium options.
* **Streak Circles:** Dynamic colors based on streak level and status (unlocked/locked/milestone).

#### **Icons**

Icons are minimalistic, using simple, clean lines.

* **Color:** Typically **Shadow Gray** for clarity, with **Spirit Blue** or **Ember Green** used for active states or notifications.

#### **Streak System Components**

The streak system uses a progressive color scheme to represent user journey and achievement levels.

* **Streak Circles:** 
  - **Streak 1:** **Blue Mahi** (`#00BFA5`) - Beginning of fitness journey
  - **Streak 2:** **Progression Teal** (`#4ECDC4`) - Early progress
  - **Streak 3:** **Progression Blue** (`#45B7D1`) - Building momentum
  - **Streak 4:** **Progression Purple** (`#6C5CE7`) - Dedication
  - **Streak 5:** **Progression Green** (`#00B894`) - Commitment
  - **Streak 6:** **Progression Orange** (`#E17055`) - Advanced progress
  - **Milestones (10, 20, 30+):** **Milestone Red** (`#FF6B6B`) - Achievement celebration
  - **Locked Streaks:** **Locked Gray** (`#555555`) - Unavailable content

* **Progression Emojis:** Dynamic emoji indicators based on streak days
  - 🎯 (Day 0), 🔥 (Day 1), 💪 (Day 2), ⚡ (Day 3), 🚀 (Day 4)
  - ⭐ (Day 5), 🌟 (Day 6), 👑 (Day 7), 💎 (Day 8), 🏆 (Day 9)
  - 🎉 (Day 10), 🎊 (Day 20), 🎆 (Day 30), 🏅 (Day 31+)

#### **Monetization Components**

Premium features use a gold-based color scheme to indicate value and exclusivity.

* **Premium Modal Container:** Semi-transparent white background with rounded corners
* **Premium Buttons:** Color-coded based on package type
  - **5 Streaks:** **Blue Mahi** background with white text
  - **10 Streaks:** **Spirit Blue** background with white text
  - **Subscription:** Semi-transparent with **Premium Gold** border
* **Pricing Display:** **Premium Gold** text for subscription pricing
* **Value Badge:** **Premium Gold** "BEST VALUE" badge for subscription option

#### **Status Indicators**

* **Online Indicators:** **Online Green** (`#00BFA5`) dots on user avatars
* **Lock Indicators:** **Locked Gray** (`#555555`) padlock icons for locked streaks
* **Streak Level Badges:** Small numbered badges in **White** with **Shadow Gray** background

#### **Reaction Bar System**

* **Long-Press Heart Icon:** Hold down heart icon to reveal reaction bar
* **Common Emojis:** 5 fitness-themed emojis (❤️, 🔥, 💪, 👏, 🎉)
* **Plus Icon:** Opens emoji keyboard for custom emoji selection
* **Reaction Bar Design:** Short vertical bar with semi-transparent dark background (`rgba(0,0,0,0.8)`)
* **Layout:** Vertical column (50px wide × 200px tall) positioned attached to heart icon
* **Positioning:** Opens directly on top of heart icon (bottom: 50px, right: 0px)
* **Emoji Selection Behavior:** 
  - Tap emoji to react → Acts as a "like" with that specific emoji
  - Selected emoji replaces heart icon and persists until unpress
  - Tap emoji/heart again to remove reaction and return to unliked state
* **Reaction Bar Colors:** 
  - Background: `rgba(0,0,0,0.8)` - Dark semi-transparent overlay
  - Emoji Buttons: `rgba(255,255,255,0.1)` - Subtle white background (35×35px)
  - Plus Icon: White color for visibility
  - Border Radius: 20px for container, 15px for emoji buttons
* **User Interaction Flow:**
  1. Long-press heart → Reaction bar appears
  2. Select emoji → Emoji shows as "liked" reaction (persists)
  3. Tap emoji/heart again → Removes reaction, returns to unliked state
  4. Tap outside bar → Closes bar without changing reaction state

---

### **Imagery & Graphics**

* **Style:** Clean, minimalistic, and often abstract.
* **Aura Visuals:** Subtle, glowing gradients in **Spirit Blue** and **Ember Green** can be used as background effects or in hero sections to reinforce the app's core theme.
* **User Avatars:** Circular with a thin, glowing border that changes color based on the user's current streak level or chosen "aura" color.
