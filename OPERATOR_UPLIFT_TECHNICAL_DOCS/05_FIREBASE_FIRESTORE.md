# FIREBASE & FIRESTORE ARCHITECTURE

## Database Structure & Security Rules

---

# 🔥 FIREBASE CONFIGURATION

## Project Setup
```javascript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "operatoruplift.firebaseapp.com",
  projectId: "operatoruplift",
  storageBucket: "operatoruplift.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXX"
};
```

## Services Used
- **Authentication**: Email/Password, Google OAuth, Anonymous
- **Firestore**: NoSQL database
- **Storage**: User avatars, achievement images
- **Analytics**: User engagement tracking
- **Cloud Functions**: Server-side operations (future)

---

# 📊 FIRESTORE DATA STRUCTURE

## Collection Hierarchy

### Primary Collections
```
firestore/
├── users/{userId}/                    # User profiles
│   ├── goals/{goalId}                 # Personal goals
│   ├── habits/{habitId}               # Habit tracking
│   ├── focusSessions/{sessionId}      # Focus timer sessions
│   ├── transactions/{transactionId}   # Token transactions
│   ├── aiInteractions/{interactionId} # AI chat history
│   ├── achievements/{achievementId}   # Unlocked achievements
│   ├── rewards/{rewardId}             # Earned rewards
│   │   └── treasure/{treasureId}      # Treasure chest items
│   ├── missions/{missionId}           # Active missions
│   ├── analytics/{analyticsId}        # User analytics
│   ├── settings/{settingId}           # User preferences
│   ├── aiProfile/{profileId}          # AI personality profile
│   ├── personalityProfiles/{profileId}# Personality assessments
│   ├── conversations/{conversationId} # Chat conversations
│   ├── aiConversations/{convId}       # AI conversations
│   ├── gamification/{gameId}          # Gamification data
│   ├── moods/{moodId}                 # Mood tracking
│   ├── protocolCounts/{protocolId}    # Protocol usage
│   ├── energy/{energyId}              # Energy levels
│   └── purchases/{purchaseId}         # Shop purchases
│
├── communityPosts/{postId}/           # Social posts
│   ├── comments/{commentId}           # Post comments
│   ├── likes/{userId}                 # Post likes
│   └── reports/{userId}               # Post reports
│
├── redemptions/{redemptionId}         # Point redemptions
├── redeemCounters/{counterId}         # Redemption counters
├── sharedGoals/{goalId}               # Collaborative goals
├── leaderboard/{entryId}              # Global leaderboard
├── achievements/{achievementId}       # Achievement catalog
├── shopItems/{itemId}                 # Shop catalog
├── communityTemplates/{templateId}    # Goal/habit templates
├── challenges/{challengeId}           # Active challenges
└── aiRateLimits/{userId}             # AI usage limits
```

---

# 🔐 SECURITY RULES BREAKDOWN

## Helper Functions

### isOwner(userId)
```javascript
function isOwner(userId) {
  return request.auth != null && request.auth.uid == userId;
}
```
**Purpose**: Verify user owns the document

### isValidUserData(data)
```javascript
function isValidUserData(data) {
  return data.keys().hasAll(['uid','email','displayName']) &&
         data.uid is string && 
         data.email is string && 
         data.displayName is string;
}
```
**Purpose**: Validate user profile structure

### isValidGoalData(data)
```javascript
function isValidGoalData(data) {
  return data.keys().hasAll(['userId','title','category']) &&
         data.userId is string && 
         data.title is string && 
         data.category is string;
}
```
**Purpose**: Validate goal structure

### isValidHabitData(data)
```javascript
function isValidHabitData(data) {
  return data.keys().hasAll(['name','frequency','category']) &&
         data.name is string &&
         data.frequency in ['daily','weekly','monthly','custom'] &&
         data.category in ['health','productivity','learning','mindfulness','social','other'];
}
```
**Purpose**: Validate habit structure with enums

### isValidFocusSessionData(data)
```javascript
function isValidFocusSessionData(data) {
  return data.keys().hasAll(['duration','startTime']) &&
         data.duration is number && 
         data.duration > 0 && 
         data.duration <= 14400 && // Max 4 hours
         data.startTime is timestamp;
}
```
**Purpose**: Validate focus session with limits

---

# 📝 DATA MODELS

## User Document
```typescript
interface UserDocument {
  // Identity
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  username?: string;
  
  // Stats
  level: number;
  xp: number;
  totalXP: number;
  streak: number;
  longestStreak: number;
  lastStreakUpdate: Timestamp;
  
  // Currency
  tokens: number;
  points: number;
  lifetimeTokens: number;
  lifetimePoints: number;
  
  // Gamification
  achievementCount: number;
  totalFocusMinutes: number;
  tasksCompleted: number;
  goalsCompleted: number;
  
  // Personality
  personalityType?: string;
  motivationType?: 'achievement' | 'growth' | 'social' | 'financial';
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic';
  stressResponse?: 'breaks' | 'push' | 'support' | 'organize';
  
  // Preferences
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  aiStyle: 'coach' | 'mentor' | 'friend' | 'strict';
  aiTone: 'encouraging' | 'neutral' | 'challenging';
  
  // Web3
  walletAddress?: string;
  walletLinked: boolean;
  walletVerified: boolean;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActive: Timestamp;
  onboardingCompleted: boolean;
  personalityAssessmentCompleted: boolean;
}
```

## Goal Document
```typescript
interface GoalDocument {
  // Core
  goalId?: string;
  userId: string;
  title: string;
  description?: string;
  category: 'health' | 'productivity' | 'learning' | 'mindfulness' | 'social' | 'other' | 'journey';
  
  // Progress
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number; // 0-100
  
  // Timeline
  startDate: Timestamp;
  targetDate: Timestamp;
  completedDate?: Timestamp;
  
  // Status
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  priority: 'low' | 'medium' | 'high';
  
  // Rewards
  xpReward: number;
  tokenReward?: number;
  
  // Sharing
  isPublic: boolean;
  sharedWith?: string[];
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  milestones?: Milestone[];
}
```

## Habit Document
```typescript
interface HabitDocument {
  // Core
  habitId?: string;
  userId: string;
  name: string;
  description?: string;
  category: 'health' | 'productivity' | 'learning' | 'mindfulness' | 'social' | 'other';
  
  // Schedule
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  customFrequency?: {
    times: number;
    period: 'day' | 'week' | 'month';
  };
  
  // Tracking
  completions: CompletionRecord[];
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  
  // Reminders
  reminderEnabled: boolean;
  reminderTime?: string; // "09:00"
  reminderDays?: number[]; // [1,2,3,4,5] for weekdays
  
  // Rewards
  xpPerCompletion: number;
  tokensPerStreak?: number;
  
  // Status
  isActive: boolean;
  isPaused: boolean;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastCompleted?: Timestamp;
}
```

## Focus Session Document
```typescript
interface FocusSessionDocument {
  // Core
  sessionId?: string;
  userId: string;
  
  // Timing
  startTime: Timestamp;
  endTime?: Timestamp;
  duration: number; // minutes
  pausedDuration: number; // minutes
  
  // Type
  type: 'focus' | 'break' | 'long_break';
  technique: 'pomodoro' | 'timeboxing' | 'deep_work' | 'custom';
  
  // Context
  goalId?: string;
  taskId?: string;
  habitId?: string;
  projectName?: string;
  
  // Completion
  completed: boolean;
  interrupted: boolean;
  interruptionReason?: string;
  
  // Rewards
  xpEarned: number;
  tokensEarned: number;
  pointsEarned: number;
  
  // Quality
  focusQuality?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  
  // Metadata
  createdAt: Timestamp;
  device?: string;
  location?: string;
}
```

## AI Interaction Document
```typescript
interface AIInteractionDocument {
  // Core
  interactionId?: string;
  userId: string;
  
  // Conversation
  messages: AIMessage[];
  context: {
    userLevel: number;
    currentStreak: number;
    recentAchievements: string[];
    activeGoals: string[];
    personalityProfile: object;
  };
  
  // Type
  type: 'motivation' | 'advice' | 'goal-breakdown' | 'chat' | 'analysis';
  provider: 'deepseek' | 'openai' | 'claude' | 'gemini' | 'huggingface';
  model: string;
  
  // Usage
  tokensUsed: number;
  responseTime: number; // ms
  
  // Quality
  userRating?: 1 | 2 | 3 | 4 | 5;
  wasHelpful?: boolean;
  
  // Metadata
  timestamp: Timestamp;
  sessionId?: string;
}
```

## Community Post Document
```typescript
interface CommunityPostDocument {
  // Core
  postId?: string;
  userId: string;
  text: string;
  
  // Media
  images?: string[];
  attachments?: Attachment[];
  
  // Engagement
  likes: number;
  likedBy: string[];
  comments: number;
  shares: number;
  
  // Type
  type: 'achievement' | 'goal' | 'question' | 'tip' | 'celebration' | 'general';
  tags?: string[];
  
  // Moderation
  flagged: boolean;
  flaggedCount: number;
  flaggedReasons?: string[];
  approved: boolean;
  
  // Visibility
  visibility: 'public' | 'friends' | 'team' | 'private';
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  editedAt?: Timestamp;
}
```

## Redemption Document
```typescript
interface RedemptionDocument {
  // Core
  redemptionId?: string;
  uid: string;
  
  // Transaction
  points: number;
  tokensReceived: number;
  conversionRate: number;
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Limits
  dailyTotal: number;
  weeklyTotal: number;
  
  // Blockchain
  transactionHash?: string;
  walletAddress?: string;
  
  // Metadata
  createdAt: Timestamp;
  processedAt?: Timestamp;
  completedAt?: Timestamp;
  failureReason?: string;
}
```

---

# 🔄 DATA FLOW PATTERNS

## User Registration Flow
```javascript
1. Firebase Auth creates user
2. Create /users/{uid} document
3. Initialize default stats
4. Create settings subcollection
5. Trigger onboarding modal
6. Save personality assessment
7. Set onboardingCompleted flag
```

## Focus Session Flow
```javascript
1. Start timer → Create session doc
2. Update every minute → Update duration
3. Pause → Update pausedDuration
4. Complete → Calculate rewards
5. Save to /users/{uid}/focusSessions
6. Update user stats (XP, tokens, streak)
7. Check achievements
8. Update daily/weekly aggregates
```

## Point Redemption Flow
```javascript
1. Check user balance
2. Validate daily/weekly limits
3. Check cooldown period
4. Create redemption request
5. Server-side validation
6. Process blockchain transaction
7. Update redemption status
8. Credit tokens to wallet
9. Update user balances
```

---

# 🛡️ SECURITY PATTERNS

## Owner-Only Access
```javascript
match /users/{userId} {
  allow read, create, update: if isOwner(userId);
  allow delete: if false; // Prevent accidental deletion
}
```

## Public Read, Owner Write
```javascript
match /leaderboard/{entryId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
    resource.data.userId == request.auth.uid;
}
```

## Immutable Records
```javascript
match /users/{userId}/purchases/{purchaseId} {
  allow read: if isOwner(userId);
  allow create: if isOwner(userId) && validPurchase();
  allow update, delete: if false; // Purchases are immutable
}
```

## Rate Limiting
```javascript
match /aiRateLimits/{userId} {
  allow read, write: if isOwner(userId);
  // Server function checks: requests < 100/day
}
```

---

# 🔄 MIGRATION CONSIDERATIONS

## For React/Next.js Migration

### Recommended Libraries
```bash
npm install firebase firebase-admin react-firebase-hooks
```

### Hook Examples
```typescript
// User authentication
import { useAuthState } from 'react-firebase-hooks/auth';
const [user, loading, error] = useAuthState(auth);

// Real-time data
import { useDocument } from 'react-firebase-hooks/firestore';
const [snapshot, loading, error] = useDocument(
  doc(db, 'users', userId)
);

// Collection query
import { useCollection } from 'react-firebase-hooks/firestore';
const [snapshot, loading, error] = useCollection(
  query(
    collection(db, 'users', userId, 'goals'),
    where('status', '==', 'active'),
    orderBy('priority', 'desc')
  )
);
```

### Context Provider
```typescript
const FirebaseContext = createContext<{
  auth: Auth;
  db: Firestore;
  user: User | null;
  loading: boolean;
}>({} as any);

export const FirebaseProvider: React.FC = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  
  return (
    <FirebaseContext.Provider value={{ auth, db, user, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};
```

---

# 📊 FIRESTORE INDEXES

## Required Composite Indexes
```
Collection: users/{userId}/goals
- Fields: status (asc), priority (desc)
- Fields: category (asc), createdAt (desc)

Collection: users/{userId}/focusSessions
- Fields: completed (asc), startTime (desc)
- Fields: type (asc), duration (desc)

Collection: communityPosts
- Fields: type (asc), createdAt (desc)
- Fields: userId (asc), createdAt (desc)

Collection: leaderboard
- Fields: timeframe (asc), xp (desc)
- Fields: teamId (asc), xp (desc)
```

---

# 🚀 OPTIMIZATION TIPS

## Query Optimization
1. **Use pagination**: Limit queries to 20-50 documents
2. **Index frequently queried fields**
3. **Denormalize data when appropriate**
4. **Use batch operations for multiple updates**
5. **Cache frequently accessed data locally**

## Cost Optimization
1. **Minimize document reads**: Use local caching
2. **Batch writes**: Up to 500 operations per batch
3. **Use field masks**: Only fetch needed fields
4. **Archive old data**: Move to cold storage
5. **Monitor usage**: Set up billing alerts

---

**Document Version**: 1.0.0
**Last Updated**: August 2025
**Collections**: 25+
**Security Rules**: 270 lines
