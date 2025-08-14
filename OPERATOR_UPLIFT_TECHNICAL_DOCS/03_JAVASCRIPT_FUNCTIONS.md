# JAVASCRIPT FUNCTIONS & INTEGRATIONS

## Complete Function Inventory & Documentation

---

# 📋 FUNCTION CATEGORIES

## 1. INITIALIZATION FUNCTIONS

### initParticles()
**Purpose**: Initialize particle background effects using tsParticles library
**Dependencies**: tsparticles.bundle.min.js
**Configuration**:
```javascript
{
  particles: {
    number: { value: 50 },
    color: { value: "#f97316" },
    opacity: { value: 0.3 },
    size: { value: 3 },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true
    }
  }
}
```

### initSounds()
**Purpose**: Initialize Tone.js audio system for sound effects
**Sound Types**:
- click: UI interactions
- success: Task completion, achievements
- notification: Alerts
- levelUp: Level progression
- achievement: Achievement unlock

### initAnimations()
**Purpose**: Initialize GSAP animations and UI effects
**Animations**:
- Card hover effects
- Button press animations
- Modal transitions
- Achievement notifications
- Progress bar animations

### refreshServiceWorker()
**Purpose**: Force service worker update and activation
**Process**:
1. Check for waiting service worker
2. Send SKIP_WAITING message
3. Listen for activation
4. Reload page on activation

---

## 2. AUTHENTICATION FUNCTIONS

### showAuth()
**Purpose**: Display authentication container
**Actions**:
- Hide main app
- Show auth forms
- Reset form states

### showLoginForm() / showRegisterForm() / showForgotPassword()
**Purpose**: Toggle between auth form states
**Transitions**:
- Fade animations
- Form validation reset
- Error message clearing

### handleLogin(email, password)
**Purpose**: Firebase email/password authentication
**Process**:
```javascript
1. Validate inputs
2. Call firebase.auth().signInWithEmailAndPassword()
3. Handle success: Load user data
4. Handle errors: Show error toast
```

### handleRegister(email, password, username)
**Purpose**: Create new user account
**Process**:
```javascript
1. Validate inputs (email, password strength, username)
2. Create auth account
3. Create Firestore user document
4. Initialize user stats
5. Trigger onboarding
```

### handleGoogleSignIn()
**Purpose**: Google OAuth authentication
**Features**:
- Popup authentication
- Fallback to redirect on popup block
- Auto-create user profile
- Tone.js audio context start

### bindPhantomSignIn()
**Purpose**: Initialize Phantom wallet sign-in button
**Process**:
1. Detect Phantom wallet
2. Add click listener
3. Request wallet connection
4. Sign verification message
5. Link wallet to account

---

## 3. USER DATA MANAGEMENT

### loadUserData()
**Purpose**: Load user profile and stats from Firebase
**Data Loaded**:
```javascript
{
  username, avatar, level, xp, totalXP,
  streak, longestStreak, tokens, points,
  achievements, preferences, personality
}
```
**Side Effects**:
- Update UI displays
- Check onboarding status
- Load daily rewards
- Initialize tooltips

### updateUserDisplay(userData)
**Purpose**: Update all UI elements with user data
**Updates**:
- Username display
- Level/XP progress
- Token count
- Streak counter
- Achievement badges

### loadDemoData()
**Purpose**: Load mock data for demo mode
**Mock Data**:
```javascript
{
  username: "Demo User",
  level: 5,
  xp: 450,
  streak: 7,
  tokens: 250,
  points: 1500
}
```

---

## 4. NAVIGATION & VIEWS

### navigate(view)
**Purpose**: SPA navigation system
**Views**:
- dashboard: Mission Control
- burn: Focus Timer
- goals: Goals & Objectives
- habits: Habit Tracker
- ai-chat: AI Assistant
- social: Social Hub
- leaderboard: Leaderboard
- achievements: Achievements
- wallet: Token Wallet
- analytics: Performance Analytics
- settings: Settings

### loadViewContent(view)
**Purpose**: Dynamically load view content
**Process**:
1. Hide all views
2. Check if view exists
3. Create view if needed
4. Show selected view
5. Initialize view-specific features

### View Creation Functions
- `createGoalsView()`: Goals management interface
- `createHabitsView()`: Habit tracking interface
- `createAnalyticsView()`: Analytics dashboard
- `createBurnView()`: Focus timer interface
- `createCommunityView()`: Social features
- `createLeaderboardView()`: Rankings display
- `createAchievementsView()`: Achievement gallery
- `createSettingsView()`: Settings panel

---

## 5. REDEMPTION & WALLET FUNCTIONS

### loadRedeemRate()
**Purpose**: Fetch current point-to-token conversion rate
**API**: `GET /api/points/rate`
**Response**:
```javascript
{
  type: 'fixed' | 'dynamic',
  rate: number,
  pointUsd: number,
  caps: { daily: number, weekly: number }
}
```

### updateRedeemPreview()
**Purpose**: Calculate and display redemption preview
**Formula**:
- Fixed: `points * rate = tokens`
- Dynamic: `points * pointUsd = USD value`

### openRedeemModal() / closeRedeemModal()
**Purpose**: Manage redemption modal state
**Features**:
- Load current balance
- Update conversion rate
- Validate limits
- Show preview

### submitRedeem()
**Purpose**: Process point redemption
**Validation**:
1. Check minimum points (100)
2. Check maximum points (10000)
3. Verify daily/weekly caps
4. Check cooldown period
**API**: `POST /api/points/redeem`

### renderPendingRedemptions()
**Purpose**: Display redemption history
**Data Source**: Firebase subcollection
**Display**: Last 10 redemptions with status

---

## 6. PHANTOM WALLET FUNCTIONS

### connectPhantomWallet()
**Purpose**: Connect to Phantom wallet extension
**Process**:
```javascript
1. Check window.solana.isPhantom
2. Request connection
3. Get public key
4. Store in localStorage
5. Update UI
```

### linkWalletToAccount()
**Purpose**: Link wallet to Firebase account
**Process**:
1. Get wallet address
2. Fetch nonce from server
3. Sign message with wallet
4. Send signature to server
5. Verify and link

### unlinkWalletFromAccount()
**Purpose**: Remove wallet association
**API**: `POST /api/auth/phantom/unlink`

---

## 7. BURN FEED & TOKEN FUNCTIONS

### fetchBurnFeed()
**Purpose**: Load recent token burn transactions
**API**: `GET /burn-feed?mint={mint}&limit=20`
**Display**:
- Wallet address (truncated)
- Burn amount
- Timestamp

---

## 8. GAMIFICATION FUNCTIONS

### checkAchievement(type, value)
**Purpose**: Check if achievement criteria met
**Types**:
- streak: Daily streak milestones
- burns: Focus session count
- goals: Completed goals
- level: Level milestones
- tasks: Task completion
- social: Friend/team achievements

### unlockAchievement(achievement)
**Purpose**: Process achievement unlock
**Actions**:
1. Update achievement status
2. Show notification
3. Award XP/tokens
4. Save to Firebase
5. Play sound effect

### showAchievementNotification(achievement)
**Purpose**: Display achievement popup
**Features**:
- GSAP animations
- Confetti effect
- Auto-dismiss (5s)
- Share option

### checkDailyReward()
**Purpose**: Check for available daily reward
**Logic**:
```javascript
lastClaim !== today ? showDailyRewardModal() : null
```

### claimDailyReward()
**Purpose**: Process daily reward claim
**Rewards**:
- Day 1-7 cycle
- Increasing XP
- Bonus tokens on day 3, 5, 7
- Special items on day 7

---

## 9. FOCUS SESSION FUNCTIONS

### startBurnSession(duration = 25)
**Purpose**: Start focus timer session
**Features**:
- Default 25-minute sessions
- Pause/resume support
- Break suggestions
- Session persistence
- Real-time updates

### pauseBurnSession()
**Purpose**: Pause active session
**Actions**:
- Clear interval
- Save elapsed time
- Update UI state

### endBurnSession()
**Purpose**: Cancel session without rewards
**Cleanup**:
- Clear timers
- Reset UI
- Remove session data

### completeBurnSession()
**Purpose**: Successfully complete session
**Rewards**:
```javascript
{
  xp: Math.floor(duration / 5),
  tokens: Math.floor(duration / 60) * 25,
  points: Math.floor(duration / 5)
}
```

### checkActiveSessionAndResume()
**Purpose**: Resume session after page refresh
**Data**: localStorage session data

### formatTime(seconds)
**Purpose**: Format seconds to MM:SS display
**Example**: 1500 → "25:00"

---

## 10. TASK MANAGEMENT FUNCTIONS

### loadTodayTasks()
**Purpose**: Load and display today's tasks
**Source**: localStorage
**Features**:
- Skeleton loading
- Empty state
- Task aggregates

### addTodayTask()
**Purpose**: Add new task to today's list
**Validation**:
- Non-empty title
- Maximum 50 tasks
**Rewards**: 10 XP on completion

### toggleTodayTask(index)
**Purpose**: Mark task complete/incomplete
**Updates**:
- Task status
- Progress bar
- XP/points

### removeTodayTask(index)
**Purpose**: Delete task from list
**Confirmation**: None (immediate)

### updateTodayAggregates()
**Purpose**: Update task completion stats
**Calculates**:
- Completed count
- Total count
- Completion percentage

---

## 11. AI CHAT FUNCTIONS

### openAIChat() / closeAIChat()
**Purpose**: Manage AI chat modal
**Features**:
- Load conversation history
- Initialize AI provider
- Focus input field

### sendAIMessage()
**Purpose**: Send message to AI
**Process**:
1. Get user input
2. Add to chat display
3. Generate context
4. Call AI provider
5. Display response
6. Save conversation

### callDeepSeekAI(message)
**Purpose**: Call DeepSeek API
**Context Included**:
```javascript
{
  userLevel, currentStreak, recentAchievements,
  personalityProfile, currentGoals, focusHistory
}
```

### addChatMessage(text, sender, isTyping)
**Purpose**: Add message to chat display
**Features**:
- Typing indicator
- Markdown support
- Auto-scroll
- Timestamp

---

## 12. PERSONALITY & ASSESSMENT FUNCTIONS

### checkAndShowOnboarding()
**Purpose**: Check if onboarding needed
**Trigger**: New user detection
**Skip**: localStorage flag

### sendOnboardingMessage()
**Purpose**: Process onboarding chat
**Flow**:
1. Collect user responses
2. Analyze personality
3. Set preferences
4. Complete onboarding

### openPersonalityAssessment()
**Purpose**: Show assessment modal
**Questions**:
- Work style preference
- Motivation type
- Stress response
- Learning style
- Focus pattern

### submitPersonalityAssessment()
**Purpose**: Save assessment results
**Data Saved**:
```javascript
{
  bigFive: scores,
  motivationType: type,
  learningStyle: style,
  assessmentDate: timestamp
}
```

### renderAIInsights()
**Purpose**: Display personalized insights
**Sections**:
- Personality profile
- Adaptive suggestions
- Recommended actions

---

## 13. REWARD SYSTEM FUNCTIONS

### openLuckyWheel() / spinLuckyWheel()
**Purpose**: Lucky wheel mini-game
**Rewards Pool**:
```javascript
['10 XP', '25 Tokens', '50 XP', 'AI Credit',
 '50 Tokens', 'Achievement', 'Treasure Chest', '100 Points']
```
**Animation**: 3-second spin with easing

### openTreasureChest() / claimTreasure()
**Purpose**: Treasure chest rewards
**Rarity Tiers**:
- Common (60%): 10 XP, 5 Tokens
- Rare (30%): 50 XP, 25 Tokens
- Epic (9%): 100 XP, 50 Tokens
- Legendary (1%): 500 XP, 200 Tokens

---

## 14. UI UTILITY FUNCTIONS

### showToast(message, type)
**Purpose**: Display notification toast
**Types**:
- info: Blue
- success: Green
- warning: Orange
- error: Red
**Features**:
- Auto-dismiss (3s)
- Stack multiple toasts
- Sound effects

### toggleSidebar() / toggleMobileSidebar()
**Purpose**: Sidebar visibility control
**Breakpoints**:
- Desktop: Always visible
- Tablet: Collapsible
- Mobile: Overlay

### toggleSound()
**Purpose**: Enable/disable sound effects
**Persistence**: localStorage
**Affects**: All audio feedback

---

## 15. SETTINGS FUNCTIONS

### saveAISettings()
**Purpose**: Save AI preferences
**Settings**:
- AI style (coach/mentor/friend/strict)
- Response tone
- Context level

### saveNotificationSettings()
**Purpose**: Save notification preferences
**Options**:
- Daily reminders
- Streak alerts
- Achievement notifications
- Social updates

### initStatTooltips()
**Purpose**: Add tooltips to stat displays
**Tooltips**:
- Streak: "Focus ≥25 min/day"
- Tokens: "+25/hour, +100 at 4h"
- Points: "+10/task, +1/5min"

---

## 16. ANALYTICS FUNCTIONS

### updateFocusUIFromTodayMinutes()
**Purpose**: Update focus time display
**Calculates**:
- Hours and minutes
- Progress percentage
- Daily goal status

### renderActiveChallenge()
**Purpose**: Display active challenges
**Challenge Types**:
- Daily focus goal (4 hours)
- Task completion (5 tasks)
- Streak maintenance

### renderLeaderboardPreview()
**Purpose**: Show top 3 leaderboard
**Data Source**:
- Service API
- Fallback to mock data
**Features**:
- Skeleton loading
- Error retry

---

# 🔌 EXTERNAL INTEGRATIONS

## Firebase Integration
```javascript
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Auth state listener
auth.onAuthStateChanged((user) => {
  if (user) {
    loadUserData();
    showApp();
  } else {
    showAuth();
  }
});
```

## Tone.js Audio
```javascript
const synth = new Tone.Synth().toDestination();
const sounds = {
  click: () => synth.triggerAttackRelease("C4", "8n"),
  success: () => synth.triggerAttackRelease("E4", "8n"),
  notification: () => synth.triggerAttackRelease("G4", "8n")
};
```

## GSAP Animations
```javascript
gsap.from(element, {
  opacity: 0,
  y: 20,
  duration: 0.5,
  ease: "power2.out"
});
```

## tsParticles
```javascript
tsParticles.load("particles-container", {
  particles: { /* config */ },
  interactivity: { /* config */ }
});
```

---

# 📊 FUNCTION METRICS

## Total Functions: 99+
## Categories:
- Authentication: 8
- User Management: 5
- Navigation: 10
- Gamification: 15
- AI/Chat: 8
- Rewards: 6
- Tasks: 5
- Focus Timer: 7
- Settings: 4
- UI Utilities: 10
- Wallet/Web3: 5
- Analytics: 8
- Initialization: 4
- Modal Management: 15+

## Lines of JavaScript: ~2000
## External Libraries: 8
## API Endpoints: 20+

---

# 🔄 STATE MANAGEMENT

## localStorage Keys
```javascript
'uplift:user'           // User profile
'uplift:streak'         // Current streak
'uplift:todayMinutes'   // Today's focus time
'uplift:todayTasks'     // Today's task list
'uplift:activeSession'  // Active focus session
'uplift:wallet'         // Connected wallet
'uplift:lastDaily'      // Last daily reward
'uplift:aiStyle'        // AI preferences
'uplift:theme'          // Theme preference
'uplift:soundEnabled'   // Sound setting
'onboardingCompleted'   // Onboarding flag
```

## Session Storage
```javascript
'uplift:tempAuth'       // Temporary auth token
'uplift:navHistory'     // Navigation history
```

## Firebase Collections
```javascript
/users/{uid}            // User profiles
/users/{uid}/sessions   // Focus sessions
/users/{uid}/tasks      // Tasks
/users/{uid}/goals      // Goals
/users/{uid}/habits     // Habits
/users/{uid}/redemptions // Point redemptions
/leaderboard           // Global leaderboard
/teams                 // Team data
/achievements          // Achievement definitions
```

---

**Document Version**: 1.0.0
**Last Updated**: August 2025
**Total Functions Documented**: 99+
