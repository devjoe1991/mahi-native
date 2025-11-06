# 🔄 Supabase Migration Guide

This guide explains how to transition from the mock data system to Supabase. The current mock data structure is designed to mirror the Supabase schema, making the transition straightforward.

---

## 📋 Table of Contents

1. [Current Mock Data Structure](#current-mock-data-structure)
2. [Supabase Schema Mapping](#supabase-schema-mapping)
3. [Step-by-Step Migration](#step-by-step-migration)
4. [Code Replacement Examples](#code-replacement-examples)
5. [Environment Setup](#environment-setup)
6. [Testing Checklist](#testing-checklist)

---

## 📊 Current Mock Data Structure

### Files to Replace

- `data/user.ts` - User data and user-related functions
- `data/posts.ts` - Post data and post-related functions
- `store/auth-context.tsx` - Authentication context (uses mock data)

### Current Mock Functions

#### User Functions (`data/user.ts`)
- `getUserById(userId: string)` - Get user by ID
- `getCurrentUser()` - Get current authenticated user

#### Post Functions (`data/posts.ts`)
- `getPostsByUserId(userId: string)` - Get all posts for a user
- `getAllPosts()` - Get all posts for feed

#### Auth Context (`store/auth-context.tsx`)
- `authenticate(email, password)` - Mock login
- `updateUserData(updates)` - Mock user update
- `refreshUserData()` - Mock data refresh
- `logout()` - Clear user data

---

## 🗄️ Supabase Schema Mapping

### Database Tables

| Mock Data | Supabase Table | Key Fields |
|-----------|---------------|------------|
| `MOCK_USER_DATA` | `profiles` | `id`, `email`, `full_name`, `username`, `avatar_url`, `bio`, `occupation` |
| `MOCK_POSTS` | `posts` | `id`, `user_id`, `media_url`, `caption`, `likes_count`, `comments_count`, `created_at` |
| N/A | `follows` | `follower_id`, `following_id` |
| N/A | `post_likes` | `post_id`, `user_id` |
| N/A | `comments` | `id`, `post_id`, `user_id`, `content` |
| N/A | `messages` | `id`, `sender_id`, `receiver_id`, `content` |

### Field Name Mapping

| Mock Data Field | Supabase Field | Notes |
|----------------|----------------|-------|
| `_id` | `id` | UUID in Supabase |
| `fullName` | `full_name` | Snake case in DB |
| `picturePath` | `avatar_url` | URL string in Supabase Storage |
| `imageUrl` | `media_url` | URL string in Supabase Storage |
| `posts` | Calculated | Count from `posts` table |
| `followers` | Calculated | Count from `follows` table |
| `followings` | Calculated | Count from `follows` table |

---

## 🚀 Step-by-Step Migration

### Step 1: Install Supabase Client

```bash
pnpm add @supabase/supabase-js
```

### Step 2: Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 3: Update Environment Variables

Create `.env` (add to `.gitignore`):

```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Update `app.json` or `app.config.js`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": process.env.EXPO_PUBLIC_SUPABASE_URL,
      "supabaseAnonKey": process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
}
```

### Step 4: Replace User Data Functions

#### Before (`data/user.ts` - Mock):
```typescript
export const getUserById = async (userId: string): Promise<UserData | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = MOCK_USERS.find((u) => u._id === userId);
  return user || null;
};
```

#### After (`data/user.ts` - Supabase):
```typescript
import { supabase } from '../lib/supabase';
import { UserData } from '../screens/userProfileScreen/types';

export const getUserById = async (userId: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) return null;

    // Transform Supabase data to UserData format
    return {
      _id: data.id,
      fullName: data.full_name || '',
      username: data.username || '',
      email: data.email || '',
      bio: data.bio,
      occupation: data.occupation,
      picturePath: data.avatar_url,
      posts: data.posts_count || 0, // If you add a computed field
      followers: data.followers_count || 0,
      followings: data.followings_count || 0,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
```

### Step 5: Replace Post Data Functions

#### Before (`data/posts.ts` - Mock):
```typescript
export const getPostsByUserId = async (userId: string): Promise<PostData[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_POSTS.filter((post) => post.userId === userId);
};
```

#### After (`data/posts.ts` - Supabase):
```typescript
import { supabase } from '../lib/supabase';
import { PostData } from '../screens/userProfileScreen/types';

export const getPostsByUserId = async (userId: string): Promise<PostData[]> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    // Transform Supabase data to PostData format
    return data.map((post) => ({
      _id: post.id,
      userId: post.user_id,
      imageUrl: post.media_url,
      caption: post.caption || '',
      likes: post.likes_count || 0,
      comments: post.comments_count || 0,
      createdAt: post.created_at,
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};
```

### Step 6: Update Auth Context

#### Before (`store/auth-context.tsx` - Mock):
```typescript
const authenticate = useCallback(async (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (user) {
        setUserData(user);
        setIsAuthenticated(true);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 1000);
  });
}, []);
```

#### After (`store/auth-context.tsx` - Supabase):
```typescript
import { supabase } from '../lib/supabase';
import { UserData } from '../screens/userProfileScreen/types';

const authenticate = useCallback(async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) return false;

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;
    if (!profile) return false;

    // Transform to UserData format
    const userData: UserData = {
      _id: profile.id,
      fullName: profile.full_name || '',
      username: profile.username || '',
      email: profile.email || '',
      bio: profile.bio,
      occupation: profile.occupation,
      picturePath: profile.avatar_url,
      posts: 0, // Will be calculated
      followers: 0,
      followings: 0,
    };

    setUserData(userData);
    setIsAuthenticated(true);
    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}, []);
```

### Step 7: Update User Data Update Function

#### Before (`store/auth-context.tsx` - Mock):
```typescript
const updateUserData = useCallback(async (updates: Partial<UserData>): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userData) {
        const updatedUser = { ...userData, ...updates };
        setUserData(updatedUser);
        resolve(true);
      }
      resolve(false);
    }, 1000);
  });
}, [userData]);
```

#### After (`store/auth-context.tsx` - Supabase):
```typescript
const updateUserData = useCallback(async (updates: Partial<UserData>): Promise<boolean> => {
  if (!userData) return false;

  try {
    // Transform UserData format to Supabase format
    const supabaseUpdates: any = {};
    if (updates.fullName !== undefined) supabaseUpdates.full_name = updates.fullName;
    if (updates.username !== undefined) supabaseUpdates.username = updates.username;
    if (updates.email !== undefined) supabaseUpdates.email = updates.email;
    if (updates.bio !== undefined) supabaseUpdates.bio = updates.bio;
    if (updates.occupation !== undefined) supabaseUpdates.occupation = updates.occupation;
    if (updates.picturePath !== undefined) supabaseUpdates.avatar_url = updates.picturePath;

    const { error } = await supabase
      .from('profiles')
      .update(supabaseUpdates)
      .eq('id', userData._id);

    if (error) throw error;

    // Refresh user data
    await refreshUserData();
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
}, [userData]);
```

### Step 8: Handle Image Uploads

For profile pictures and post images, use Supabase Storage:

```typescript
// Upload image to Supabase Storage
const uploadImage = async (uri: string, bucket: 'avatars' | 'posts', userId: string): Promise<string | null> => {
  try {
    // Convert local URI to blob
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileExt = uri.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};
```

### Step 9: Update Streak Update Sheet

In `components/globals/globalBottomSheet/views/StreakUpdateSheet.tsx`:

```typescript
const onSave = useCallback(async () => {
  if (!selectedImage && !caption.trim()) {
    closeSheet();
    return;
  }

  setLoading(true);
  try {
    let mediaUrl = selectedImage;

    // Upload image if selected
    if (selectedImage && typeof selectedImage === 'string') {
      const uploadedUrl = await uploadImage(selectedImage, 'posts', userId || userData?._id || '');
      if (!uploadedUrl) {
        throw new Error('Failed to upload image');
      }
      mediaUrl = uploadedUrl;
    }

    // Create post in Supabase
    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: userId || userData?._id,
        media_url: mediaUrl,
        caption: caption.trim() || null,
      });

    if (error) throw error;

    onSaved?.();
    closeSheet();
    
    // Reset form
    setSelectedImage(null);
    setCaption('');
  } catch (error) {
    console.error('Failed to update streak:', error);
    Alert.alert('Error', 'Failed to update streak. Please try again.');
  } finally {
    setLoading(false);
  }
}, [selectedImage, caption, userId, userData, onSaved, closeSheet]);
```

---

## 🔧 Code Replacement Examples

### Example 1: Get Current User

**Mock:**
```typescript
const user = await getCurrentUser();
```

**Supabase:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
const profile = await getUserById(user.id);
```

### Example 2: Get User Posts

**Mock:**
```typescript
const posts = await getPostsByUserId('user1');
```

**Supabase:**
```typescript
const posts = await getPostsByUserId('user-uuid-here');
// Function already updated to use Supabase
```

### Example 3: Create Post

**Mock:**
```typescript
// Just console.log in mock
console.log('Post created:', postData);
```

**Supabase:**
```typescript
const { data, error } = await supabase
  .from('posts')
  .insert({
    user_id: userId,
    media_url: imageUrl,
    caption: caption,
  })
  .select()
  .single();
```

---

## 🌍 Environment Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Migrations

Apply the migration file:
```bash
supabase migration up
```

**Option B: Manual SQL Execution**
1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/20241001000001_create_mahi_app_tables.sql`
3. Paste and execute in the SQL editor
4. Verify tables are created: Dashboard → Table Editor

### 3. Set Up Storage Buckets

The migration creates `avatars` and `posts` buckets. Verify they exist in:
- Supabase Dashboard → Storage → Buckets

### 4. Configure RLS Policies

The migration includes RLS policies. Verify they're active:
- Supabase Dashboard → Authentication → Policies

---

## ✅ Testing Checklist

After migration, test the following:

### Authentication
- [ ] User can sign in with email/password
- [ ] User session persists on app restart
- [ ] User can sign out
- [ ] Error handling for invalid credentials

### User Profile
- [ ] View own profile
- [ ] View other user profiles
- [ ] Edit profile (name, username, bio, occupation)
- [ ] Upload profile picture
- [ ] Profile picture displays correctly

### Posts
- [ ] Create new post (streak update)
- [ ] View posts in feed
- [ ] View posts on profile
- [ ] Post images display correctly
- [ ] Like/unlike posts
- [ ] Comment on posts

### Data Consistency
- [ ] Post counts update correctly
- [ ] Follower/following counts update correctly
- [ ] Real-time updates work (if using Supabase Realtime)

---

## 🔄 Migration Strategy

### Option 1: Big Bang (Recommended for small apps)
1. Set up Supabase project
2. Replace all mock functions at once
3. Test thoroughly
4. Deploy

### Option 2: Gradual Migration
1. Keep mock data as fallback
2. Add Supabase functions alongside mock functions
3. Use feature flags to switch between mock/Supabase
4. Gradually migrate features one by one

Example with feature flag:
```typescript
const USE_SUPABASE = process.env.EXPO_PUBLIC_USE_SUPABASE === 'true';

export const getUserById = async (userId: string) => {
  if (USE_SUPABASE) {
    return getUserByIdSupabase(userId);
  } else {
    return getUserByIdMock(userId);
  }
};
```

---

## 📝 Notes

### Image Handling
- Local assets (require()) will continue to work
- Remote URIs will work with Supabase Storage URLs
- Update `picturePath` and `imageUrl` types to handle both during transition

### Type Safety
- Keep TypeScript interfaces in `screens/userProfileScreen/types.ts`
- Transform Supabase data to match these interfaces
- This ensures components don't need changes

### Error Handling
- Always wrap Supabase calls in try-catch
- Show user-friendly error messages
- Log errors for debugging

### Performance
- Use Supabase Realtime for live updates (optional)
- Consider caching frequently accessed data
- Use pagination for large lists (posts, comments)

---

## 🚨 Common Issues

### Issue: RLS Policy Blocks Query
**Solution:** Check that RLS policies allow the operation. Test in Supabase SQL editor first.

### Issue: Image Upload Fails
**Solution:** 
- Verify storage bucket exists
- Check bucket is public or user has upload permissions
- Verify file size limits

### Issue: Type Mismatches
**Solution:** 
- Use transformation functions to convert between Supabase format and app format
- Keep transformation logic in data layer, not components

---

## 📚 Additional Resources

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎯 Quick Reference: File Mapping

### Files to Update

| Current File | What to Change | Supabase Integration |
|--------------|----------------|---------------------|
| `data/user.ts` | Replace `getUserById()`, `getCurrentUser()` | Query `profiles` table |
| `data/posts.ts` | Replace `getPostsByUserId()`, `getAllPosts()` | Query `posts` table |
| `store/auth-context.tsx` | Replace `authenticate()`, `updateUserData()`, `refreshUserData()` | Use Supabase Auth + `profiles` table |
| `components/globals/globalBottomSheet/views/StreakUpdateSheet.tsx` | Update `onSave()` | Upload to Storage + insert into `posts` table |
| `components/userProfile/ProfileBody.tsx` | Already uses `getPostsByUserId()` | Will work automatically after data layer update |

### New Files to Create

| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Supabase client initialization |
| `.env` | Environment variables (add to `.gitignore`) |

### Files That Don't Need Changes

- All component files (they use the data layer abstraction)
- Theme files
- Navigation files
- UI component files

---

## 💡 Pro Tips

1. **Start with Authentication**: Get auth working first, then move to data fetching
2. **Test in Development**: Use Supabase's local development setup if possible
3. **Keep Mock Data**: Comment out mock functions instead of deleting them (useful for fallback)
4. **Use TypeScript**: The type system will catch many integration issues
5. **Monitor RLS**: Row Level Security policies are critical - test them thoroughly
6. **Storage Permissions**: Make sure storage buckets have correct public/private settings

---

**Last Updated:** 2024-11-06  
**Status:** Ready for Supabase Integration  
**Migration File:** `supabase/migrations/20241001000001_create_mahi_app_tables.sql`

