# iOS Compliance Checklist (Nov 2025)

This document tracks the items Apple reviews for App Store submissions. Update each section before every release.

## Build & Signing
- [ ] `bundleIdentifier` = `com.mahitechnologies.Mahinativeapp`
- [ ] Increment `expo.ios.buildNumber` before uploading a new build
- [ ] EAS production profile points to the correct Apple Team ID
- [ ] Archive created with latest Xcode/Xcode Cloud or `eas build --platform ios`

## Privacy & Data
- [x] `PrivacyInfo.xcprivacy` declares every accessed API and collected data type
- [x] `Info.plist` only includes permissions actually used (Calendar, Contacts, Camera, Photos)
- [x] `NSPrivacyPolicyURL` resolves to a live privacy policy page
- [x] Remove unused keys (`NSHealth*`, `NSMicrophone*`, `NSReminders*`)
- [ ] Confirm App Tracking Transparency isn't required (no advertising SDKs)

## Store Listing Assets
- [ ] App icon 1024x1024 (no transparency)
- [ ] iPhone 6.7\" / 6.5\" / 5.5\" screenshots
- [ ] iPad Pro 12.9\" screenshots (if supporting iPad)
- [ ] App preview video (optional but recommended)

## Metadata & Content
- [ ] Age rating questionnaire updated (most fitness apps are 12+)
- [ ] Privacy policy + support URL set in App Store Connect
- [ ] Accurate description of Calendar/Contacts usage
- [ ] Demo account provided for review (email/password documented internally)

## Testing & Review Notes
- [ ] TestFlight build verified on physical devices (latest iOS + iPadOS)
- [ ] Push notification, contacts lookup, calendar sync tested end-to-end
- [ ] Review notes describe any special configuration (e.g., location-specific content)

## Pre-Submission Sanity Checks
- [ ] `expo-doctor` returns no blocking issues
- [ ] `pnpm test` / smoke tests pass
- [ ] `pnpm expo-doctor` completed on CI (attach logs)
- [ ] Crash-free startup verified via Xcode Organizer or Sentry (if configured)

Keep this checklist with each release tag so we can prove due diligence if the review team asks for clarification.
