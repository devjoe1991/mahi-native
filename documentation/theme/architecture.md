# 🏗️ Mahi Architecture - Visually Delightful Mobile Experience

## 📋 Overview

Mahi is a **lightweight social accountability fitness app** built entirely with React Native, designed to deliver a seamless, intuitive, and visually appealing mobile experience. Users create streak-based posts to hold themselves accountable for their fitness and healthy lifestyle routines. 

**Current Phase:** Frontend-only development with mock data, designed for easy transition to Supabase backend when ready.

This architecture document outlines the technical foundation for creating a visually delightful app with smooth transitions, interactive animations, and real-time feedback that celebrates daily effort and streaks.

---

## 🎯 Architecture Vision

### **Core Philosophy:**
> **"Not just functional, but visually delightful"**

Mahi focuses on delivering an exceptional user experience through:
- 🌊 **Smooth Transitions** - Screen transitions crafted to be smooth and engaging
- ✨ **Interactive Animations** - Every interaction enhanced with subtle animations
- ⚡ **Real-time Feedback** - Immediate visual cues for all user actions
- 🎨 **Visual Delight** - Beautiful, modern design that feels alive and responsive

---

## 🏗️ Technical Architecture

### **Technology Stack:**
```typescript
const techStack = {
  // Frontend Framework
  framework: 'React Native (Expo)',
  
  // Language & Type Safety
  language: 'TypeScript',
  
  // State Management
  state: 'React Context + Reducer',
  
  // Backend & Database
  backend: 'Supabase',
  database: 'PostgreSQL',
  
  // Authentication
  auth: 'Supabase Auth',
  
  // Real-time Features
  realtime: 'Supabase Realtime',
  
  // Media & Storage
  storage: 'Supabase Storage',
  
  // Push Notifications
  notifications: 'Expo Notifications',
  
  // Development & Deployment
  development: 'Expo Development Build',
  deployment: 'EAS Build + TestFlight/Google Play'
};
```

---

## 🎨 Visual Experience Architecture

### **Design System Foundation:**
```typescript
const visualArchitecture = {
  // Theme System
  themes: {
    light: 'Clean, modern light theme with Aura White and Vapor Cream',
    dark: 'Sophisticated dark theme with deep backgrounds',
    switching: 'Smooth 300ms transitions between themes'
  },
  
  // Animation System
  animations: {
    transitions: 'Smooth screen transitions',
    interactions: 'Subtle button and touch animations',
    feedback: 'Immediate visual response to actions',
    loading: 'Elegant loading states and skeletons'
  },
  
  // Responsive Design
  responsiveness: {
    breakpoints: 'xs, sm, md, lg, xl',
    adaptive: 'Components adapt to screen sizes',
    orientation: 'Portrait and landscape support'
  }
};
```

### **Animation & Transition System:**
```typescript
const animationArchitecture = {
  // Screen Transitions
  screenTransitions: {
    duration: '300ms',
    easing: 'ease-in-out',
    type: 'Slide, fade, scale combinations'
  },
  
  // Component Animations
  componentAnimations: {
    buttonPress: 'Scale down (0.95) with haptic feedback',
    cardHover: 'Subtle elevation and shadow changes',
    listItems: 'Staggered entrance animations',
    modals: 'Slide up with backdrop fade'
  },
  
  // Micro-interactions
  microInteractions: {
    loading: 'Skeleton screens and progress indicators',
    success: 'Checkmark animations and success states',
    error: 'Shake animations and error states',
    feedback: 'Immediate visual response to all actions'
  }
};
```

---

## 🌐 Global Components Architecture

### **Global Components Overview:**

Mahi uses global components that are accessible throughout the app for consistent UI patterns:

```typescript
const globalComponents = {
  // Global Bottom Sheet
  globalBottomSheet: {
    purpose: 'Swipe-up modal for flexible content presentation',
    useCases: [
      'View post comments',
      'Access settings',
      'Quick user profiles',
      'Action menus',
      'Any scrollable content'
    ],
    features: [
      'No height limit',
      'Scrollable content',
      'Swipe-up animation',
      'Backdrop dismiss',
      'Theme support'
    ],
    location: 'components/globals/GlobalBottomSheet/'
  },
  
  // Global Header
  globalHeader: {
    purpose: 'Consistent navigation header across screens',
    useCases: [
      'Main navigation',
      'Quick actions (settings, messages)',
      'Screen context',
      'Brand consistency'
    ],
    features: [
      'Pill navigation',
      'Circular icon buttons',
      'Floating design',
      'Active states',
      'Theme support'
    ],
    location: 'components/globals/GlobalHeader/'
  }
};
```

### **Global Components Pattern:**
- **Provider Pattern** - Global components use context providers
- **Hook-based** - Easy access via custom hooks (`useGlobalBottomSheet`, etc.)
- **Theme Integration** - Full light/dark mode support
- **Mock Data Ready** - Designed for easy backend integration

---

## 📱 Component Architecture

### **Component Hierarchy:**
```
Mahi App
├── 🎨 Theme System
│   ├── ThemeProvider
│   ├── useTheme Hook
│   └── Color/Spacing/Typography Systems
├── 🌐 Global Components (components/globals/)
│   ├── GlobalBottomSheet (Swipe-up modal for comments, settings, etc.)
│   ├── GlobalHeader (Pill navigation + circular icon buttons)
│   └── Global Components Provider
├── 🧩 Base Components
│   ├── UI Components (Button, Card, Input, etc.)
│   ├── Layout Components (Container, Grid, etc.)
│   └── Feedback Components (Loading, Toast, etc.)
├── 🔥 Feature Components
│   ├── Streak Components (StreakCounter, StreakCircle, StreakModal, etc.)
│   ├── Post Components (PostCard, ReactionBar, etc.)
│   └── User Components (UserProfile, Avatar, etc.)
├── 📱 Screen Components
│   ├── Home Screen
│   ├── Explore Screen
│   ├── Profile Screen
│   └── Onboarding Screen (with multiple views)
└── 🚀 App Navigation
    ├── Bottom Tab Navigation
    ├── Stack Navigation
    └── Modal Navigation
```

### **Component Design Principles:**
```typescript
interface ComponentArchitecture {
  // Visual Design
  visual: {
    themeSupport: 'Full light/dark mode support',
    responsive: 'Adapts to all screen sizes',
    accessible: 'High contrast and readability',
    consistent: 'Follows design system guidelines'
  },
  
  // Animation & Interaction
  interaction: {
    smoothTransitions: '300ms ease-in-out transitions',
    hapticFeedback: 'Tactile response to interactions',
    loadingStates: 'Skeleton screens and progress indicators',
    errorStates: 'Clear error messaging and recovery'
  },
  
  // Performance
  performance: {
    optimized: 'Efficient rendering and memory usage',
    lazyLoading: 'Components load as needed',
    caching: 'Smart data caching and persistence',
    smooth: '60fps animations and interactions'
  }
};
```

---

## 🔥 Streak & Social Architecture

### **Streak System:**
```typescript
const streakArchitecture = {
  // Streak Visualization
  streakVisualization: {
    circles: 'Color-coded streak circles with progression',
    levels: 'Sequential streak numbering (1, 2, 3, etc.)',
    locked: 'Padlocked future streaks with unlock requirements',
    milestones: 'Special colors for milestone streaks (10, 20, 30+)'
  },
  
  // Streak Progression
  streakProgression: {
    emojis: 'Dynamic emoji indicators (🎯🔥💪⚡🚀⭐🌟👑💎🏆🎉🎊🎆🏅)',
    unlock: 'Progressive unlock system for future streaks',
    premium: 'Premium unlock packages and Mahi+ subscription',
    insurance: 'Streak insurance system for protection'
  },
  
  // Social Features
  socialFeatures: {
    feed: 'Streak-based content discovery',
    reactions: 'Emoji reaction bar with long-press interaction',
    comments: 'Social interaction and community support',
    sharing: 'Post sharing and streak celebration'
  }
};
```

---

## 🔄 State Management Architecture

### **State Management Strategy:**
```typescript
const stateArchitecture = {
  // Global State
  globalState: {
    theme: 'Light/dark mode preference',
    user: 'Current user profile and settings',
    streaks: 'Current streak state and preferences',
    navigation: 'Navigation state and history'
  },
  
  // Feature State
  featureState: {
    streaks: 'Streak data and progression',
    posts: 'User posts and workout proof',
    social: 'Social interactions and reactions',
    premium: 'Premium features and subscription status'
  },
  
  // Local State
  localState: {
    components: 'Component-specific state',
    forms: 'Form data and validation',
    ui: 'UI state and interactions',
    animations: 'Animation state and transitions'
  }
};
```

---

## 🚀 Performance Architecture

### **Performance Optimization:**
```typescript
const performanceArchitecture = {
  // Rendering Performance
  rendering: {
    lazyLoading: 'Components load on demand',
    virtualization: 'Large lists use virtual scrolling',
    memoization: 'React.memo for expensive components',
    imageOptimization: 'Optimized images and caching'
  },
  
  // Animation Performance
  animations: {
    nativeDriver: 'Use native driver for smooth animations',
    gestureHandling: 'Optimized gesture recognition',
    transitionOptimization: 'Efficient screen transitions',
    memoryManagement: 'Proper cleanup of animation resources'
  },
  
  // Data Performance
  data: {
    caching: 'Smart data caching and persistence',
    pagination: 'Efficient data pagination',
    realtime: 'Optimized real-time updates',
    offline: 'Offline data synchronization'
  }
};
```

---

## 🔐 Security Architecture

### **Lightweight Development Phase (Current):**

Mahi is currently in **lightweight frontend-only development** using mock data. The architecture is designed for easy transition to Supabase backend when ready.

```typescript
const securityArchitecture = {
  // Current Phase: Mock Data
  currentPhase: {
    dataSource: 'Mock data (local TypeScript/JSON)',
    authentication: 'Mock user sessions (local state)',
    storage: 'Local state management (React Context)',
    api: 'Mock API service layer (prepared for Supabase)',
    transition: 'Easy migration path to Supabase'
  },
  
  // Future Phase: Supabase Integration
  futurePhase: {
    authentication: 'Supabase Auth with social login',
    database: 'Supabase PostgreSQL (via secure API endpoints)',
    storage: 'Supabase Storage for media',
    realtime: 'Supabase Realtime for live updates',
    security: 'Row Level Security (RLS) policies',
    api: 'Edge Functions for custom logic'
  },
  
  // Data Privacy (Applies to Both Phases)
  dataPrivacy: {
    wellness: 'Granular wellness data privacy controls',
    profile: 'Privacy settings for profile visibility',
    gdpr: 'GDPR compliance and data protection',
    local: 'Secure local storage for sensitive data (AsyncStorage)'
  },
  
  // Content Security (Applies to Both Phases)
  contentSecurity: {
    dataValidation: 'Input validation and sanitization',
    secureStorage: 'Secure local storage for sensitive data',
    apiSecurity: 'API security and rate limiting (when backend ready)',
    userData: 'User data protection and anonymization'
  }
};
```

### **Mock Data Architecture:**

```typescript
// Mock data structure mirrors Supabase schema for easy transition
const mockDataStructure = {
  // User Profiles
  users: {
    id: 'string',
    username: 'string',
    avatar: 'string',
    streak: 'number',
    // Mirrors Supabase users table
  },
  
  // Streak Posts
  posts: {
    id: 'string',
    userId: 'string',
    content: 'string',
    image: 'string',
    createdAt: 'date',
    // Mirrors Supabase posts table
  },
  
  // Comments
  comments: {
    id: 'string',
    postId: 'string',
    userId: 'string',
    content: 'string',
    createdAt: 'date',
    // Mirrors Supabase comments table
  }
};

// API Service Layer (Mock → Supabase)
interface ApiService {
  // Mock implementation now, Supabase implementation later
  getUsers: () => Promise<User[]>;
  getPosts: () => Promise<Post[]>;
  getComments: (postId: string) => Promise<Comment[]>;
  createPost: (post: CreatePostInput) => Promise<Post>;
  // Same interface for both mock and Supabase
}
```

### **Migration Path to Supabase:**

```typescript
// Phase 1: Mock Data (Current)
// - Mock API service layer
// - Local state management
// - TypeScript interfaces ready

// Phase 2: Supabase Integration (Future)
// - Replace mock services with Supabase client
// - Add authentication flow
// - Implement Row Level Security
// - Add real-time subscriptions

// Transition Strategy:
// 1. Keep API service interface consistent
// 2. Swap implementation from mock → Supabase
// 3. Add authentication layer
// 4. Enable real-time features
// 5. Implement security policies
```

### **Security Best Practices (Current & Future):**

- ✅ **Input Validation** - Validate and sanitize all user inputs (even with mock data)
- ✅ **Type Safety** - TypeScript interfaces for all data structures
- ✅ **Secure Storage** - Use AsyncStorage for sensitive local data
- ✅ **API Abstraction** - Service layer for easy backend swap
- ✅ **Error Handling** - Proper error boundaries and handling
- 🔜 **Authentication** - Ready for Supabase Auth integration
- 🔜 **API Security** - Ready for rate limiting and security policies
- 🔜 **Data Encryption** - Ready for end-to-end encryption

---

## 📱 Screen Architecture

### **Screen Organization:**
```typescript
const screenArchitecture = {
  // Singular Screens (One screen = one folder)
  singularScreens: {
    home: {
      location: 'screens/home/index.tsx',
      purpose: 'Main dashboard with streak circles and fitness feed',
      components: ['GlobalHeader', 'StreakCircles', 'FeedList', 'PostCard'],
      globalComponents: ['GlobalHeader'],
    },
    explore: {
      location: 'screens/explore/index.tsx',
      purpose: 'Discover fitness content and users',
      components: ['GlobalHeader', 'SearchBar', 'ContentGrid', 'UserCards'],
      globalComponents: ['GlobalHeader'],
    },
    profile: {
      location: 'screens/profile/index.tsx',
      purpose: 'User profile and settings',
      components: ['GlobalHeader', 'ProfileHeader', 'StreakHistory', 'SettingsList'],
      globalComponents: ['GlobalHeader'],
    },
  },
  
  // Reusable Screens with Views (Multiple steps/views)
  reusableScreens: {
    onboarding: {
      location: 'screens/onboarding/index.tsx',
      purpose: 'User onboarding flow with multiple steps',
      views: [
        { name: 'EmailView', location: 'screens/onboarding/views/EmailView.tsx' },
        { name: 'PhoneView', location: 'screens/onboarding/views/PhoneView.tsx' },
        { name: 'PrivacyView', location: 'screens/onboarding/views/PrivacyView.tsx' },
      ],
      orchestrator: 'Main onboarding component manages view transitions',
    },
  },
};
```

### **Screen Structure:**
```typescript
const screenStructure = {
  // Home Screen
  home: {
    purpose: 'Main dashboard with streak circles and fitness feed',
    components: ['GlobalHeader', 'StreakCircles', 'FeedList', 'PostCard'],
    interactions: ['Streak interactions', 'Post creation', 'Social interactions'],
    animations: ['Streak animations', 'Feed transitions', 'Post celebrations'],
    globalComponents: {
      header: 'GlobalHeader with pill navigation',
      bottomSheet: 'GlobalBottomSheet for comments and actions',
    },
  },
  
  // Explore Screen
  explore: {
    purpose: 'Discover fitness content and users',
    components: ['GlobalHeader', 'SearchBar', 'ContentGrid', 'UserCards'],
    interactions: ['Content discovery', 'User browsing', 'Search functionality'],
    animations: ['Search animations', 'Content reveals', 'Filter transitions'],
    globalComponents: {
      header: 'GlobalHeader with pill navigation',
      bottomSheet: 'GlobalBottomSheet for user profiles',
    },
  },
  
  // Profile Screen
  profile: {
    purpose: 'User profile and settings',
    components: ['GlobalHeader', 'ProfileHeader', 'StreakHistory', 'SettingsList'],
    interactions: ['Profile editing', 'Streak viewing', 'Settings management'],
    animations: ['Profile transitions', 'Streak celebrations', 'Settings animations'],
    globalComponents: {
      header: 'GlobalHeader with settings icon',
      bottomSheet: 'GlobalBottomSheet for settings view',
    },
  },
  
  // Onboarding Screen (Reusable with Views)
  onboarding: {
    purpose: 'User onboarding flow with multiple steps',
    views: [
      { name: 'EmailView', step: 1, purpose: 'Email input and verification' },
      { name: 'PhoneView', step: 2, purpose: 'Phone input and verification' },
      { name: 'PrivacyView', step: 3, purpose: 'Privacy policy acceptance' },
    ],
    orchestrator: 'Main component manages view transitions and state',
    components: ['OnboardingViews', 'NavigationButtons', 'ProgressIndicator'],
    globalComponents: {
      bottomSheet: 'GlobalBottomSheet for help/terms (if needed)',
    },
  },
};
```

### **Screen Import Pattern:**
```typescript
// Example: screens/home/index.tsx
import { GlobalHeader } from '@/components/globals/GlobalHeader';
import { useGlobalBottomSheet } from '@/components/globals/GlobalBottomSheet';

// Example: screens/onboarding/index.tsx
import { EmailView } from './views/EmailView';
import { PhoneView } from './views/PhoneView';
import { PrivacyView } from './views/PrivacyView';
```

---

## 🎨 Visual Delight Implementation

### **Smooth Transitions:**
```typescript
const transitionImplementation = {
  // Screen Transitions
  screenTransitions: {
    slide: 'Slide left/right for tab navigation',
    fade: 'Fade in/out for modal presentations',
    scale: 'Scale animations for card interactions',
    combination: 'Combined slide + fade for complex transitions'
  },
  
  // Component Transitions
  componentTransitions: {
    button: 'Scale down (0.95) on press with haptic feedback',
    card: 'Subtle elevation change on hover/press',
    list: 'Staggered entrance animations for list items',
    modal: 'Slide up from bottom with backdrop fade'
  },
  
  // Loading Transitions
  loadingTransitions: {
    skeleton: 'Skeleton screens during data loading',
    progress: 'Progress indicators for long operations',
    shimmer: 'Shimmer effects for content loading',
    spinner: 'Elegant loading spinners and animations'
  }
};
```

### **Interactive Animations:**
```typescript
const animationImplementation = {
  // Touch Interactions
  touchAnimations: {
    press: 'Scale down (0.95) with haptic feedback',
    release: 'Scale back to 1.0 with smooth transition',
    longPress: 'Scale down (0.9) with different haptic pattern',
    swipe: 'Smooth swipe animations with momentum'
  },
  
  // Gesture Animations
  gestureAnimations: {
    pullToRefresh: 'Elastic pull animation with loading indicator',
    swipeToDelete: 'Smooth swipe with reveal animation',
    pinchToZoom: 'Smooth zoom with momentum and bounds',
    dragAndDrop: 'Smooth drag with drop zone highlighting'
  },
  
  // State Animations
  stateAnimations: {
    loading: 'Pulse animation for loading states',
    success: 'Checkmark animation with color change',
    error: 'Shake animation with error color',
    empty: 'Fade in animation for empty states'
  }
};
```

### **Real-time Feedback:**
```typescript
const feedbackImplementation = {
  // Visual Feedback
  visualFeedback: {
    buttonPress: 'Immediate scale and color change',
    formValidation: 'Real-time validation with color changes',
    networkStatus: 'Connection status indicators',
    auraUpdate: 'Smooth aura color and intensity updates'
  },
  
  // Haptic Feedback
  hapticFeedback: {
    light: 'Light haptic for subtle interactions',
    medium: 'Medium haptic for button presses',
    heavy: 'Heavy haptic for important actions',
    success: 'Success haptic pattern',
    error: 'Error haptic pattern'
  },
  
  // Audio Feedback
  audioFeedback: {
    buttonPress: 'Subtle button press sound',
    notification: 'Custom notification sounds',
    auraChange: 'Gentle aura transition sound',
    error: 'Error sound for failed actions'
  }
};
```

---

## 🚀 Development Architecture

### **Development Workflow:**
```typescript
const developmentArchitecture = {
  // Component Development
  componentDevelopment: {
    planning: 'Design analysis and component breakdown',
    implementation: 'TypeScript components with theme support',
    testing: 'Component testing with both themes',
    integration: 'Screen assembly and functionality testing'
  },
  
  // Screen Development
  screenDevelopment: {
    analysis: 'Screen design analysis and component identification',
    assembly: 'Component combination and screen layout',
    interactions: 'Touch and gesture handling implementation',
    animations: 'Screen-specific animations and transitions'
  },
  
  // Feature Development
  featureDevelopment: {
    aura: 'Aura visualization and interaction features',
    wellness: 'Mood tracking and wellness features',
    streaks: 'Streak tracking and progress features',
    performance: 'Optimization and smooth interactions'
  }
};
```

---

## 📊 Architecture Benefits

### **Technical Benefits:**
- 🚀 **Performance** - Optimized for smooth 60fps animations
- 🔄 **Scalability** - Modular architecture for easy feature addition
- 🛠️ **Maintainability** - Clean separation of concerns
- 🧪 **Testability** - Component-based testing approach

### **User Experience Benefits:**
- 🎨 **Visual Delight** - Beautiful, modern design with smooth animations
- ⚡ **Responsiveness** - Immediate feedback for all interactions
- 🌊 **Smooth Transitions** - Fluid navigation between screens
- 📱 **Intuitive** - Natural gestures and interactions

### **Development Benefits:**
- 🧩 **Component Reusability** - Shared components across screens
- 🎨 **Design Consistency** - Unified design system
- 🔧 **Easy Maintenance** - Clear architecture and documentation
- 🚀 **Rapid Development** - Efficient development workflow

---

## 🎯 Implementation Roadmap

### **Phase 1: Foundation**
1. ✅ **Theme System** - Light/dark mode with smooth transitions
2. ✅ **Base Components** - Button, Card, Input with animations
3. ✅ **Navigation** - Bottom tab navigation with transitions
4. ✅ **Aura Visualization** - Basic aura circle with color changes

### **Phase 2: Core Features**
1. 🏠 **Home Screen** - Dashboard with aura visualization
2. 🌟 **Aura Screen** - Detailed aura customization
3. 🔥 **Streaks Screen** - Streak tracking with progress
4. 📊 **Progress Screen** - Wellness insights and analytics

### **Phase 3: Advanced Features**
1. 💬 **Mood Tracking** - Advanced mood tracking with insights
2. 👤 **Profile** - User profiles with preferences
3. ⚙️ **Settings** - App configuration with smooth transitions
4. 🎪 **Wellness Features** - Advanced wellness tracking and insights

---

## 🚀 Ready to Build

### **Architecture Principles:**
- 🎨 **Visual Delight** - Every interaction is beautiful and smooth
- ⚡ **Real-time Feedback** - Immediate response to all user actions
- 🌊 **Smooth Transitions** - Fluid navigation and screen changes
- 📱 **Responsive Design** - Adapts beautifully to all screen sizes
- 🔄 **Consistent Experience** - Unified design language throughout

### **Development Guidelines:**
- 🧩 **Component-First** - Build reusable, themed components
- 🎨 **Animation-First** - Every interaction has smooth animations
- 📱 **Mobile-First** - Optimized for mobile experience
- 🔄 **Performance-First** - Smooth 60fps animations and interactions

---

**🎨 Mahi will be a visually delightful, smooth, and interactive mobile experience that users love to use!**

This architecture ensures every screen, component, and interaction is crafted for visual delight and smooth performance.