# 📋 Profile Component - Instagram-Like Profile System

## 📋 Overview

The Profile component provides an Instagram-like user profile system for social accountability, displaying a user's streak-based posts, followers, and following. It follows a lightweight, minimal component architecture, using mock data for the frontend-only phase, with a clear path for future Supabase backend integration.

---

## 🎯 Component Purpose

The Profile component serves as the central hub for a user's public presence within the app, allowing them to:
- **Display Identity** - Showcase profile picture, name, and username
- **View Statistics** - Display post count, followers, and following count
- **Browse Content** - View streak-based posts in grid format (images) or reels format (portrait videos)
- **Accountability** - Visual representation of fitness and healthy lifestyle commitment

---

## 🎨 Design Specifications

### **Visual Design:**
- **Layout** - Clean, modern, minimalist with white background
- **Profile Header** - Large circular profile picture, prominent name and username
- **Statistics Display** - Clear numerical display of posts, followers, following
- **Content Navigation** - Tab system to switch between "Images" (grid) and "VIDS" (reels)
- **Image Grid** - Square post thumbnails in grid layout (Instagram-style)
- **Reels System** - Vertical scrollable feed for portrait video content

### **Mock User Profile:**
- **Name:** Joe John
- **Username:** @joe
- **Profile Picture:** Circular image with blue/green lighting effect
- **Statistics:**
  - 255 Posts
  - 14.6k Followers
  - 378 Following

---

## 🏗️ Component Architecture

### **Component Structure:**
```
components/feature/Profile/
├── index.tsx                    # Main Profile component
├── ProfileHeader.tsx            # Profile picture, name, username, stats
├── ProfileTabs.tsx              # Images/VIDS tab navigation
├── PostGrid.tsx                 # Grid layout for image posts
├── PostReels.tsx                # Vertical scroll for video posts
└── types.ts                     # TypeScript interfaces
```

### **Component Hierarchy:**
```
Profile (Main Component)
├── GlobalHeader                 # Navigation and settings
├── ProfileHeader
│   ├── ProfilePicture
│   ├── UserInfo (name, username)
│   └── Statistics (posts, followers, following)
├── ProfileTabs
│   ├── Images Tab
│   └── VIDS Tab
└── Content Area
    ├── PostGrid (when Images tab active)
    └── PostReels (when VIDS tab active)
```

---

## 🎨 Theme Integration

### **Colors:**
```typescript
const profileStyles = {
  light: {
    background: colors.background.primary,      // Aura White
    text: colors.text.primary,                  // Shadow Gray
    border: colors.border.primary,              // Subtle borders
    tabActive: colors.primary[500],             // Spirit Blue
  },
  dark: {
    background: colors.background.primary,      // Dark background
    text: colors.text.primary,                  // Light text
    border: colors.border.primary,              // Subtle borders
    tabActive: colors.primary[500],             // Spirit Blue
  }
};
```

### **Typography:**
```typescript
// Profile name
fontSize: typography.h2.fontSize,
fontWeight: typography.h2.fontWeight as any,

// Username
fontSize: typography.body.fontSize,
fontWeight: typography.body.fontWeight as any,

// Statistics
fontSize: typography.body.fontSize,
fontWeight: typography.body.fontWeight as any,
```

---

## 📱 Component Implementation

### **Profile Component:**
```typescript
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { GlobalHeader } from '@/components/globals/GlobalHeader';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTabs } from './ProfileTabs';
import { PostGrid } from './PostGrid';
import { PostReels } from './PostReels';

type TabType = 'images' | 'vids';

interface ProfileProps {
  userId: string;
}

export const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const { colors, spacing } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('images');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <GlobalHeader />
      <ScrollView style={styles.content}>
        <ProfileHeader userId={userId} />
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'images' ? (
          <PostGrid userId={userId} />
        ) : (
          <PostReels userId={userId} />
        )}
      </ScrollView>
    </View>
  );
};
```

### **ProfileHeader Component:**
```typescript
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface ProfileHeaderProps {
  userId: string;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId }) => {
  const { colors, spacing, typography } = useTheme();
  
  // Mock data - will be replaced with API call
  const profile: UserProfile = {
    id: userId,
    name: 'Joe John',
    username: '@joe',
    profilePicture: 'https://example.com/profile.jpg',
    postsCount: 255,
    followersCount: 14600,
    followingCount: 378,
  };

  const styles = StyleSheet.create({
    container: {
      padding: spacing.md,
      alignItems: 'center',
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: spacing.sm,
    },
    name: {
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight as any,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    username: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight as any,
      color: colors.text.secondary,
      marginBottom: spacing.md,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: spacing.lg,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight as any,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    statLabel: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.caption.fontWeight as any,
      color: colors.text.secondary,
    },
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: profile.profilePicture }} style={styles.profilePicture} />
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.username}>{profile.username}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.postsCount}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatNumber(profile.followersCount)}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
    </View>
  );
};

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};
```

### **ProfileTabs Component:**
```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

type TabType = 'images' | 'vids';

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  const { colors, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    tabText: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight as any,
      color: colors.text.secondary,
    },
    tabTextActive: {
      color: colors.primary[500],
      fontWeight: '600' as any,
    },
    activeIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: colors.primary[500],
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('images')}
      >
        <Text style={[styles.tabText, activeTab === 'images' && styles.tabTextActive]}>
          Images
        </Text>
        {activeTab === 'images' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('vids')}
      >
        <Text style={[styles.tabText, activeTab === 'vids' && styles.tabTextActive]}>
          VIDS
        </Text>
        {activeTab === 'vids' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
};
```

### **PostGrid Component:**
```typescript
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface PostGridProps {
  userId: string;
}

interface Post {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
}

export const PostGrid: React.FC<PostGridProps> = ({ userId }) => {
  const { colors, spacing } = useTheme();

  // Mock data - will be replaced with API call
  const posts: Post[] = [
    { id: '1', imageUrl: 'https://example.com/post1.jpg' },
    { id: '2', imageUrl: 'https://example.com/post2.jpg' },
    { id: '3', imageUrl: 'https://example.com/post3.jpg' },
    { id: '4', imageUrl: 'https://example.com/post4.jpg' },
    // ... more posts
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    postItem: {
      width: '33.33%',
      aspectRatio: 1,
      padding: 1,
    },
    postImage: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.background.secondary,
    },
  });

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};
```

### **PostReels Component:**
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface PostReelsProps {
  userId: string;
}

export const PostReels: React.FC<PostReelsProps> = ({ userId }) => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      padding: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholder: {
      fontSize: 16,
      color: colors.text.secondary,
    },
  });

  // Placeholder for reels - will be implemented later
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Reels coming soon...</Text>
    </View>
  );
};
```

---

## 🔄 Mock Data Architecture

### **Current Phase (Mock Data):**
```typescript
// Mock data structure mirrors Supabase schema
interface UserProfile {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  type: 'image' | 'video';
}

// Mock data service
const mockProfileService = {
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    // Return mock data for Joe John
    return {
      id: userId,
      name: 'Joe John',
      username: '@joe',
      profilePicture: 'https://example.com/profile.jpg',
      postsCount: 255,
      followersCount: 14600,
      followingCount: 378,
    };
  },
  getUserPosts: async (userId: string, type: 'image' | 'video'): Promise<Post[]> => {
    // Return mock posts array
    return [];
  },
};
```

### **Future Phase (Supabase Integration):**
```typescript
// API Service Layer (Mock → Supabase)
interface ProfileApiService {
  getUserProfile: (userId: string) => Promise<UserProfile>;
  getUserPosts: (userId: string, type: 'image' | 'video') => Promise<Post[]>;
}

// Future: Replace mock with Supabase
const profileService: ProfileApiService = {
  getUserProfile: async (userId) => {
    // Future: return supabase.from('users').select('*').eq('id', userId).single();
    return mockProfileService.getUserProfile(userId);
  },
  getUserPosts: async (userId, type) => {
    // Future: return supabase.from('posts').select('*').eq('user_id', userId).eq('type', type);
    return mockProfileService.getUserPosts(userId, type);
  },
};
```

---

## 🔐 Security Architecture (Future Ready)

### **API Endpoints (Future Supabase):**
- `GET /users/{userId}/profile` - Get user profile data
- `GET /users/{userId}/posts` - Get user posts (filtered by type)
- `GET /users/{userId}/followers` - Get followers list
- `GET /users/{userId}/following` - Get following list

### **Security Considerations:**
- All endpoints will require authentication
- User data access controlled via Row Level Security (RLS)
- Profile visibility settings (public/private)
- Rate limiting on all endpoints

---

## 📱 Responsive Design

### **Screen Adaptations:**
- **Small Screens:** 3-column grid for posts
- **Large Screens:** 3-column grid maintained
- **Tablets:** Optional 4-column grid for larger screens
- **Profile Picture:** Scales appropriately across screen sizes

---

## ✨ Features

### **Core Features:**
- ✅ **Profile Display** - Name, username, profile picture
- ✅ **Statistics** - Posts, followers, following counts
- ✅ **Tab Navigation** - Switch between Images and VIDS
- ✅ **Image Grid** - 3-column grid layout for posts
- ✅ **Reels System** - Vertical scroll for portrait videos (placeholder)
- ✅ **Theme Support** - Full light/dark mode support
- ✅ **Mock Data** - Lightweight mock data service layer

### **Future Features:**
- 🔜 **Video Reels** - Full vertical scroll implementation
- 🔜 **Post Interactions** - Like, comment, share
- 🔜 **Follow/Unfollow** - User follow functionality
- 🔜 **Edit Profile** - Profile editing capabilities

---

## 🚀 Implementation Guidelines

### **Component Requirements:**
1. ✅ **Theme Integration** - Use `useTheme` hook from `../../theme/ThemeProvider`
2. ✅ **TypeScript** - Full type safety with interfaces
3. ✅ **Mock Data Ready** - Service layer for easy Supabase transition
4. ✅ **Lightweight** - Minimal dependencies, simple components
5. ✅ **Responsive** - Adapts to all screen sizes
6. ✅ **Performance** - Efficient rendering with FlatList for grid

### **Best Practices:**
- Keep components small and focused
- Use FlatList for efficient post rendering
- Extract typography properties individually
- Use explicit property access for theme values
- Follow TypeScript styling rules from rules.md
- Maintain mock data structure matching Supabase schema

---

## 🎯 Mock User: Joe John

### **Profile Data:**
```typescript
const mockJoeJohnProfile = {
  id: 'joe-john-123',
  name: 'Joe John',
  username: '@joe',
  profilePicture: 'https://example.com/joe-john-profile.jpg',
  postsCount: 255,
  followersCount: 14600,
  followingCount: 378,
};
```

### **Usage:**
```typescript
// In Profile component
<Profile userId="joe-john-123" />
```

---

**🎨 The Profile component provides a clean, Instagram-like experience for viewing user profiles and their streak-based fitness content!**

