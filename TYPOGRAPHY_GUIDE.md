# 📝 Typography Guide - Mahi App

## Overview

This guide documents the typography system used throughout the Mahi app, including recent improvements to font sizes and font weights for better visual hierarchy and readability.

---

## 🎨 Base Typography System

### **Typography Scale:**

```typescript
// Base Typography (defined in theme/ThemeProvider.tsx)
const createTypography = (textColor: string, fontFamily: string = 'Outfit'): Typography => ({
  fontFamily,
  h1: {
    fontSize: 32,
    fontWeight: '600',  // SemiBold (reduced from '700' Bold)
    fontFamily: 'Outfit_600SemiBold',
    color: textColor,
  },
  h2: {
    fontSize: 24,
    fontWeight: '500',  // Medium (reduced from '600' SemiBold)
    fontFamily: 'Outfit_500Medium',
    color: textColor,
  },
  h3: {
    fontSize: 20,
    fontWeight: '500',  // Medium (unchanged)
    fontFamily: 'Outfit_500Medium',
    color: textColor,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',  // Regular (unchanged)
    fontFamily: 'Outfit_400Regular',
    color: textColor,
  },
});
```

### **Font Weight Changes (2024 Update):**
- **h1**: Changed from `'700'` (Bold) to `'600'` (SemiBold) - Less aggressive, more refined
- **h2**: Changed from `'600'` (SemiBold) to `'500'` (Medium) - Softer, more approachable
- **h3**: Remains `'500'` (Medium) - Unchanged
- **body**: Remains `'400'` (Regular) - Unchanged

---

## 📏 Common Usage Patterns

### **Screen Titles (h1):**
```typescript
// Hero titles, main screen headers
fontSize: typography.h1.fontSize - 4,  // 28px (reduced from 32px)
fontWeight: typography.h1.fontWeight as any,  // '600' (SemiBold)
letterSpacing: 0.5,
lineHeight: (typography.h1.fontSize - 4) * 1.2,
```

### **Section Titles (h2):**
```typescript
// Section headers, modal titles
fontSize: typography.h2.fontSize - 3,  // 21px (reduced from 24px)
// OR
fontSize: typography.h2.fontSize - 4,  // 20px (for bottom sheets)
fontWeight: typography.h2.fontWeight as any,  // '500' (Medium)
letterSpacing: 0.3,
lineHeight: (typography.h2.fontSize - 3) * 1.2,
```

### **Card Titles (h3):**
```typescript
// Card titles, feature titles
fontSize: typography.h3.fontSize - 4,  // 16px (reduced from 20px)
fontWeight: typography.h3.fontWeight as any,  // '500' (Medium)
letterSpacing: 0.15,
lineHeight: (typography.h3.fontSize - 4) * 1.2,
```

### **Body Text:**
```typescript
// Standard body text, descriptions
fontSize: typography.body.fontSize - 2,  // 14px (reduced from 16px)
// OR
fontSize: typography.body.fontSize - 3,  // 13px (for smaller descriptions)
fontWeight: typography.body.fontWeight as any,  // '400' (Regular)
letterSpacing: 0.15,
lineHeight: (typography.body.fontSize - 2) * 1.3,
```

### **Button Text:**
```typescript
// Primary and secondary buttons
fontSize: typography.body.fontSize - 1,  // 15px (reduced from 16px)
fontWeight: '600',  // SemiBold (reduced from '700' Bold)
letterSpacing: 0.2,
```

### **Small Text / Captions:**
```typescript
// Captions, metadata, timestamps
fontSize: 12,
fontWeight: '400',  // Regular
letterSpacing: 0.15,
lineHeight: 12 * 1.3,
```

---

## 🎯 Component-Specific Guidelines

### **Feed Posts:**
```typescript
// Username
fontSize: typography.body.fontSize - 2,  // 14px
fontWeight: typography.h2.fontWeight as any,  // '500' (Medium)
letterSpacing: 0.15,

// Caption
fontSize: typography.body.fontSize - 2,  // 14px
fontWeight: '400',  // Regular
letterSpacing: 0.15,
lineHeight: (typography.body.fontSize - 2) * 1.3,
```

### **Profile Headers:**
```typescript
// Profile name
fontSize: typography.h2.fontSize - 3,  // 21px
fontWeight: typography.h2.fontWeight as any,  // '500' (Medium)
letterSpacing: 0.15,

// Username
fontSize: typography.body.fontSize - 2,  // 14px
fontWeight: typography.body.fontWeight as any,  // '400' (Regular)
letterSpacing: 0.15,
```

### **Bottom Sheets:**
```typescript
// Sheet titles
fontSize: typography.h2.fontSize - 4,  // 20px
fontWeight: typography.h2.fontWeight as any,  // '500' (Medium)
letterSpacing: 0.3,
lineHeight: (typography.h2.fontSize - 4) * 1.2,

// Button text
fontSize: typography.body.fontSize - 1,  // 15px
fontWeight: '600',  // SemiBold
letterSpacing: 0.2,
```

### **Navigation:**
```typescript
// Navigation items
fontSize: typography.body.fontSize - 2,  // 14px
fontWeight: typography.body.fontWeight as any,  // '400' (Regular)
letterSpacing: 0.15,

// Active navigation
fontWeight: '500',  // Medium (reduced from '600')
```

---

## ✨ Letter Spacing Guidelines

### **Standard Letter Spacing:**
- **Titles (h1, h2)**: `0.3` to `0.5` - More spacing for emphasis
- **Card Titles (h3)**: `0.15` - Subtle spacing
- **Body Text**: `0.15` - Standard readability
- **Button Text**: `0.2` - Slightly more for clarity
- **Small Text**: `0.15` - Maintains readability

---

## 📐 Line Height Guidelines

### **Standard Line Heights:**
- **Titles**: `fontSize * 1.2` - Tighter for headings
- **Body Text**: `fontSize * 1.3` to `fontSize * 1.5` - More breathing room
- **Small Text**: `fontSize * 1.3` - Balanced for small sizes

---

## 🎨 Visual Hierarchy

### **Size Hierarchy:**
1. **Hero Titles (h1 - 4px)**: 28px - Largest, most prominent
2. **Section Titles (h2 - 3px)**: 21px - Clear section breaks
3. **Card Titles (h3 - 4px)**: 16px - Card-level emphasis
4. **Body Text (body - 2px)**: 14px - Standard reading size
5. **Small Text**: 12px - Metadata, captions

### **Weight Hierarchy:**
1. **Boldest**: `'600'` (SemiBold) - h1 titles, buttons
2. **Medium**: `'500'` (Medium) - h2, h3 titles, active states
3. **Regular**: `'400'` (Regular) - Body text, standard content

---

## 🔄 Migration Notes

### **What Changed:**
- All h1 titles: Reduced from `'700'` to `'600'` font weight
- All h2 titles: Reduced from `'600'` to `'500'` font weight
- Most titles: Reduced font size by 3-4px for better proportions
- Most body text: Reduced font size by 2-3px for better readability
- Button text: Reduced from `'700'` to `'600'` font weight

### **Why These Changes:**
- **Less Aggressive**: Softer font weights create a more approachable, modern feel
- **Better Hierarchy**: Reduced sizes create clearer visual distinction between elements
- **Improved Readability**: Smaller, lighter text is easier to scan and read
- **More Refined**: Overall appearance is more polished and less "AI-generated"

---

## 📱 Responsive Considerations

### **Screen Size Adaptations:**
- **Small Screens**: Maintain reduced sizes, ensure minimum 12px for readability
- **Large Screens**: Sizes remain consistent, spacing may increase
- **Tablets**: Consider slightly larger sizes if needed, but maintain hierarchy

---

## ✅ Best Practices

1. **Always use typography scale**: Never hardcode font sizes, use `typography.h1.fontSize`, etc.
2. **Apply reductions consistently**: Use `-2`, `-3`, or `-4` reductions based on context
3. **Maintain letter spacing**: Add appropriate `letterSpacing` for polish
4. **Set line heights**: Always define `lineHeight` for better readability
5. **Use font weights from theme**: Reference `typography.h2.fontWeight` rather than hardcoding
6. **Test readability**: Ensure text remains readable at reduced sizes
7. **Maintain hierarchy**: Keep clear distinction between title levels

---

## 🎯 Quick Reference

```typescript
// Copy-paste ready patterns:

// Hero Title
fontSize: typography.h1.fontSize - 4,
fontWeight: typography.h1.fontWeight as any,
letterSpacing: 0.5,
lineHeight: (typography.h1.fontSize - 4) * 1.2,

// Section Title
fontSize: typography.h2.fontSize - 3,
fontWeight: typography.h2.fontWeight as any,
letterSpacing: 0.3,
lineHeight: (typography.h2.fontSize - 3) * 1.2,

// Card Title
fontSize: typography.h3.fontSize - 4,
fontWeight: typography.h3.fontWeight as any,
letterSpacing: 0.15,
lineHeight: (typography.h3.fontSize - 4) * 1.2,

// Body Text
fontSize: typography.body.fontSize - 2,
fontWeight: typography.body.fontWeight as any,
letterSpacing: 0.15,
lineHeight: (typography.body.fontSize - 2) * 1.3,

// Button Text
fontSize: typography.body.fontSize - 1,
fontWeight: '600',
letterSpacing: 0.2,
```

---

**📝 This typography system ensures consistent, refined, and readable text throughout the Mahi app!**

