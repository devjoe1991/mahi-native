# Android Compliance Checklist (Nov 2025)

Use this list before every Google Play submission.

## Build & Signing
- [ ] `expo.android.package` = `com.mahitechnologies.Mahinativeapp`
- [ ] Increment `versionCode` before each release build
- [ ] Use Play App Signing or upload the correct `.aab` from `eas build --platform android`
- [ ] Verify keystore is backed up and stored in 1Password

## Data Safety & Privacy
- [ ] Google Play Data Safety form matches `PrivacyInfo.xcprivacy` + privacy policy
- [ ] Permissions requested in `app.json` match in-app usage (Calendar, Contacts, Camera, Media)
- [ ] No placeholder/"coming soon" permissions inside the UI
- [ ] Privacy policy URL accessible over HTTPS

## Policy Requirements
- [ ] Target/compile SDK 34, minimum SDK 24+
- [ ] Background location not requested (and not needed)
- [ ] Ads & monetization declarations completed (not applicable if no ads)
- [ ] Content rating questionnaire submitted for the current release

## Functionality Tests
- [ ] Internal test track build validated on Pixel (Android 14) and Samsung (Android 15 beta)
- [ ] Calendar sync, contacts search, and camera capture succeed without crashes
- [ ] Predictive back gesture checked on Android 15 (set to true only when UX is ready)
- [ ] Google Play Console pre-launch report reviewed (no critical issues)

## Release Packaging
- [ ] Store listing screenshots for phone + optional tablet form factors
- [ ] Feature graphic 1024x500 provided
- [ ] Short + full description updated with latest feature set
- [ ] Changelog summarizes user-facing fixes/improvements

Document exceptions or policy clarifications inside this file when you submit so we maintain an audit trail.
