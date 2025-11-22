# Compliance Audit Findings & Fixes

**Date:** November 22, 2025  
**Status:** ✅ All Critical Issues Resolved

## Issues Found & Fixed

### 1. ❌ "Coming Soon" Placeholder Content (CRITICAL)
**Issue:** App showed non-functional features in UI  
**Location:** 
- `screens/nearbyScreen/NearbyScreen.tsx` - "Coming Soon" feature carousel
- `screens/diaryScreen/DiaryScreen.tsx` - "Coming Soon" feature carousel  
- `screens/onboardingScreen/views/LoginScreen.tsx` - "Password reset coming soon" alert

**Fix:** ✅ Removed all "Coming Soon" sections and replaced with functional alternatives

**Compliance Violation:**
- Apple App Store Review Guidelines 2.1: "Apps should not include placeholder content"
- Google Play Policy: "Don't mislead users about functionality"

---

### 2. ❌ Upfront Permission Requests During Onboarding (CRITICAL)
**Issue:** PrivacyPermissionsScreen requested all permissions upfront during onboarding  
**Location:** `screens/onboardingScreen/views/PrivacyPermissionsScreen.tsx`

**Fix:** ✅ 
- Removed PrivacyPermissionsScreen from onboarding flow
- Updated totalSteps from 6 to 5
- Permissions now requested contextually:
  - **Camera:** When user tries to take photo (StreakUpdateSheet, NotificationsScreen)
  - **Contacts:** When user tries to find friends (NearbyScreen - now checks permissions first)
  - **Calendar:** When user tries to sync calendar (DiaryScreen - already contextual)

**Compliance Violation:**
- Apple Human Interface Guidelines: "Request permissions only when needed, not upfront"
- Google Play Policy: "Request permissions in context of use"

---

### 3. ⚠️ Missing Permission Checks Before API Calls
**Issue:** NearbyScreen accessed contacts without checking permissions first  
**Location:** `screens/nearbyScreen/NearbyScreen.tsx:167`

**Fix:** ✅ Added permission check and request before `getContactsAsync()`

---

### 4. ✅ HealthKit Permissions Removed
**Status:** Already fixed in previous session
- Removed `NSHealthShareUsageDescription` and `NSHealthUpdateUsageDescription` from `app.json` and `Info.plist`
- HealthKit not implemented, so permissions removed

---

### 5. ✅ Microphone Permission Removed  
**Status:** Already fixed in previous session
- Removed from PrivacyPermissionsScreen
- Removed from onboarding context
- Not used in app

---

## Remaining Non-Critical Items

### Console.log Statements
**Status:** ⚠️ Non-blocking but should be cleaned up
- 74 console.log/error/warn statements found across 26 files
- Should be wrapped in `__DEV__` checks or removed for production
- **Action:** Low priority - can be done in cleanup pass

### TODO Comments
**Status:** ⚠️ Review needed
- Several TODO comments indicating incomplete features
- Most are in comments/docs, not user-facing
- **Action:** Review and prioritize implementation or remove

---

## Verification Checklist

- [x] No "Coming Soon" or placeholder content in UI
- [x] Permissions requested contextually, not upfront
- [x] All permission checks in place before API calls
- [x] HealthKit permissions removed (not implemented)
- [x] Microphone permissions removed (not used)
- [x] Privacy manifest updated (PrivacyInfo.xcprivacy)
- [x] App.json configured correctly
- [x] Info.plist has proper permission descriptions
- [x] TypeScript compiles without errors
- [ ] Console.log statements cleaned up (non-blocking)
- [ ] TODO comments reviewed (non-blocking)

---

## Next Steps for Store Submission

1. ✅ **Critical compliance issues resolved**
2. ⏳ Test permission flows on physical devices
3. ⏳ Verify all contextual permission requests work correctly
4. ⏳ Submit to TestFlight/Internal Testing
5. ⏳ Clean up console.log statements (optional)
6. ⏳ Review and address TODO comments (optional)

---

## Notes

- PrivacyPermissionsScreen file still exists but is no longer used in onboarding
- Permission-related fields remain in OnboardingData interface but are not shown to users
- All permissions are now requested when features are actually used, not upfront

