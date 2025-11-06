# Global Bottom Sheet (Expo + React Native)

A single, universal bottom sheet powered by `react-native-modal` that you can open from anywhere. Dynamic content (Comments, Settings, Streak Update), drag-to-close, keyboard-safe input, and full theme support via ThemeProvider.

## Features
- One globally mounted `<GlobalBottomSheetProvider />`
- `openSheet(type, props?)` and `closeSheet()` from any component
- Dynamic height based on content
- Drag down to dismiss, smooth animations
- Scrollable content with keyboard-safe input area
- Safe Area aware
- Blur + dim backdrop, light/dark theme aware
- Remains mounted (persists across navigation)
- Easy to extend with new sheet types

## 1) Wrap the App

Already wired in `App.tsx`:

```tsx
import { GlobalBottomSheetProvider } from './components/globals/globalBottomSheet';

<SafeAreaProvider>
  <ThemeProvider>
    <AuthProvider>
      <GlobalBottomSheetProvider>
        <NavigationProvider />
      </GlobalBottomSheetProvider>
    </AuthProvider>
  </ThemeProvider>
</SafeAreaProvider>
```

## 2) Open from Anywhere

```tsx
import { useBottomSheet } from '../../components/globals/globalBottomSheet';

const Example = () => {
  const { openSheet, closeSheet } = useBottomSheet();
  return (
    <Button 
      title="Comments" 
      onPress={() => openSheet('COMMENTS', { postId: '123' })} 
    />
  );
};
```

Available sheet types:
- `openSheet('SETTINGS')` - Settings sheet
- `openSheet('PROFILE_EDIT', { userId: '1' })` - Profile editing (redirects to EditProfileScreen)
- `openSheet('STREAK_UPDATE', { userId: '1', onSaved: () => {} })` - Quick streak post upload
- `openSheet('COMMENTS', { postId: '123' })` - Comments on a post
- `closeSheet()` - Close the current sheet

## 3) Add New Sheet Types

1. Update `components/globals/globalBottomSheet/types.ts`:
```ts
export type SheetType = 'NONE' | 'COMMENTS' | 'SETTINGS' | 'PROFILE_EDIT' | 'STREAK_UPDATE' | 'NEW_TYPE';

export type NewTypeSheetProps = {
  // your props
};

export type SheetPropsMap = {
  // ... existing types
  NEW_TYPE: NewTypeSheetProps;
};
```

2. Create a view component: `components/globals/globalBottomSheet/views/NewTypeSheet.tsx`
3. Map it in `components/globals/globalBottomSheet/context.tsx`:
```tsx
if (sheetType === 'NEW_TYPE') {
  const { NewTypeSheet } = require('./views/NewTypeSheet');
  return <NewTypeSheet {...(sheetProps as any)} />;
}
```

## Design & Theme
- Uses `useTheme()` for colors, spacing, typography
- No hardcoded colors; aligns with project theme rules
- Smooth, modern interactions; accessible contrast in light/dark
- Responsive to screen size and safe areas

## API
- `openSheet(type, props?)` - Open a sheet with optional props
- `closeSheet()` - Close the current sheet
- `isOpen` - Boolean indicating if sheet is open
- `type` - Current sheet type

## Notes
- Uses `react-native-modal` for the modal component
- Keyboard-aware with `KeyboardAvoidingView`
- Scrollable content with dynamic height calculation
- Safe area aware for bottom padding

One sheet. Many views. Clean, fast, future‑proof.


## Features
- One globally mounted `<GlobalBottomSheetProvider />`
- `openSheet(type, props?)` and `closeSheet()` from any component
- Dynamic height based on content
- Drag down to dismiss, smooth animations
- Scrollable content with keyboard-safe input area
- Safe Area aware
- Blur + dim backdrop, light/dark theme aware
- Remains mounted (persists across navigation)
- Easy to extend with new sheet types

## 1) Wrap the App

Add to `App.tsx`:

```tsx
import { GlobalBottomSheetProvider } from './components/globals/GlobalBottomSheet';

<SafeAreaProvider>
  <ThemeProvider>
    <AuthProvider>
      <GlobalBottomSheetProvider>
        <NavigationProvider />
      </GlobalBottomSheetProvider>
    </AuthProvider>
  </ThemeProvider>
</SafeAreaProvider>
```

## 2) Open from Anywhere

```tsx
import { useBottomSheet } from '../../components/globals/GlobalBottomSheet';

const Example = () => {
  const { openSheet, closeSheet } = useBottomSheet();
  return (
    <Button 
      title="Comments" 
      onPress={() => openSheet('COMMENTS', { postId: '123' })} 
    />
  );
};
```

Available sheet types:
- `openSheet('SETTINGS')` - Settings sheet
- `openSheet('PROFILE_EDIT', { userId: '1' })` - Profile editing
- `openSheet('STREAK_UPDATE', { userId: '1', onSaved: () => {} })` - Quick streak post upload
- `openSheet('COMMENTS', { postId: '123' })` - Comments on a post
- `closeSheet()` - Close the current sheet

## 3) Add New Sheet Types

1. Update `components/globals/GlobalBottomSheet/types.ts`:
```ts
export type SheetType = 'NONE' | 'COMMENTS' | 'SETTINGS' | 'PROFILE_EDIT' | 'STREAK_UPDATE' | 'NEW_TYPE';

export type NewTypeSheetProps = {
  // your props
};

export type SheetPropsMap = {
  // ... existing types
  NEW_TYPE: NewTypeSheetProps;
};
```

2. Create a view component: `components/globals/GlobalBottomSheet/views/NewTypeSheet.tsx`
3. Map it in `components/globals/GlobalBottomSheet/context.tsx`:
```tsx
if (sheetType === 'NEW_TYPE') {
  const { NewTypeSheet } = require('./views/NewTypeSheet');
  return <NewTypeSheet {...(sheetProps as any)} />;
}
```

## Design & Theme
- Uses `useTheme()` for colors, spacing, typography
- No hardcoded colors; aligns with project theme rules
- Smooth, modern interactions; accessible contrast in light/dark
- Responsive to screen size and safe areas

## API
- `openSheet(type, props?)` - Open a sheet with optional props
- `closeSheet()` - Close the current sheet
- `isOpen` - Boolean indicating if sheet is open
- `type` - Current sheet type

## Notes
- Uses `react-native-modal` for the modal component
- Keyboard-aware with `KeyboardAvoidingView`
- Scrollable content with dynamic height calculation
- Safe area aware for bottom padding

One sheet. Many views. Clean, fast, future‑proof.

