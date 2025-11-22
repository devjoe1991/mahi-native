# Data Collection Inventory

Mapping of every piece of user data we request as of November 2025.

| Surface | Data | Purpose | Storage | Shared With |
| --- | --- | --- | --- | --- |
| Onboarding | First name, last name | Personalize experience, account lookup | Supabase (planned) / local context during onboarding | Not shared |
| Onboarding | Email address | Account login + notifications | Supabase auth (planned) | Not shared |
| Onboarding | Phone number (optional) | Account recovery and SMS reminders | Secure backend (planned) | Twilio/MessageBird (future) |
| Onboarding | Date of birth | Age-gating for community interactions | Secure backend (planned) | Not shared |
| Onboarding | Fitness goal | Tailor recommendations | Secure backend (planned) | Not shared |
| Contacts permission | Device contacts metadata (names, emails) | Friend discovery | Processed on-device, only selected entries sent to backend (future) | Not shared without explicit action |
| Calendar permission | Event titles/time windows | Detect upcoming workouts | Stored locally for reminders; not uploaded | Not shared |
| Camera permission | Photos taken inside app | Profile + streak content | Uploaded to secure storage when published | Not shared |

## Actions Required Before Launch
1. Finalize backend storage locations (Supabase schemas + storage buckets)
2. Document retention + deletion policy for each data class
3. Ensure privacy policy mirrors this inventory
4. Update Google Play Data Safety + Apple privacy manifest whenever this table changes
