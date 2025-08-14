# GAMIFICATION & REWARD SYSTEMS

## Complete Game Mechanics Documentation

---

# 🎮 GAMIFICATION OVERVIEW

## Core Game Loop
```
Daily Login → Set Goals → Focus Sessions → Complete Tasks → 
Earn Rewards → Level Up → Unlock Features → Social Sharing → Repeat
```

## Psychological Principles
1. **Variable Reward Schedule**: Randomized rewards to maintain engagement
2. **Loss Aversion**: Streak system creates fear of losing progress
3. **Social Proof**: Leaderboards and community features
4. **Progress Illusion**: Multiple progress bars and metrics
5. **Endowment Effect**: Earned tokens feel more valuable
6. **Zeigarnik Effect**: Incomplete tasks create mental tension
7. **Commitment Bias**: Public goals increase follow-through

---

# 📊 XP & LEVELING SYSTEM

## XP Sources
```javascript
const xpSources = {
  // Focus Sessions
  focusMinute: 0.2,           // Per minute of focus
  focusSessionComplete: 10,    // Bonus for completing session
  focusHour: 25,              // Bonus per hour
  deepWork: 50,               // 90+ minute session
  
  // Tasks
  taskComplete: 10,           // Per task
  taskStreak: 5,              // Bonus per 5 tasks
  dailyTaskGoal: 25,          // Complete daily task target
  
  // Goals
  goalMilestone: 50,          // Per milestone
  goalComplete: 100,          // Goal completion
  goalStreak: 25,             // Weekly goal progress
  
  // Social
  postCreated: 5,             // Community post
  postLiked: 1,               // Receive like
  commentMade: 3,             // Add comment
  friendReferred: 100,        // Refer new user
  
  // Achievements
  achievementCommon: 25,      // Common achievement
  achievementRare: 50,        // Rare achievement
  achievementEpic: 100,       // Epic achievement
  achievementLegendary: 500,  // Legendary achievement
  
  // Daily Activities
  dailyLogin: 5,              // Daily login
  dailyChallenge: 30,         // Complete daily challenge
  weeklyChallenge: 100,       // Complete weekly challenge
};
```

## Level Calculation
```javascript
function calculateLevel(totalXP) {
  // Exponential curve: each level requires more XP
  const baseXP = 100;
  const multiplier = 1.5;
  
  let level = 1;
  let requiredXP = baseXP;
  let cumulativeXP = 0;
  
  while (cumulativeXP + requiredXP <= totalXP) {
    cumulativeXP += requiredXP;
    level++;
    requiredXP = Math.floor(baseXP * Math.pow(multiplier, level - 1));
  }
  
  return {
    level: level,
    currentLevelXP: totalXP - cumulativeXP,
    nextLevelXP: requiredXP,
    progress: (totalXP - cumulativeXP) / requiredXP
  };
}
```

## Level Rewards
```javascript
const levelRewards = {
  5: { tokens: 50, unlock: 'custom_themes' },
  10: { tokens: 100, unlock: 'advanced_analytics' },
  15: { tokens: 200, unlock: 'ai_personalities' },
  20: { tokens: 300, unlock: 'team_creation' },
  25: { tokens: 500, unlock: 'premium_challenges', badge: 'quarter_master' },
  30: { tokens: 750, unlock: 'mentor_status' },
  40: { tokens: 1000, unlock: 'custom_rewards' },
  50: { tokens: 2000, unlock: 'legendary_status', badge: 'level_legend' },
  75: { tokens: 5000, unlock: 'founder_perks' },
  100: { tokens: 10000, unlock: 'master_tier', badge: 'centurion' }
};
```

---

# 🏆 ACHIEVEMENT SYSTEM

## Achievement Categories
```javascript
const achievementCategories = {
  focus: {
    firstBurn: { 
      id: 'first-burn',
      name: 'First Burn',
      description: 'Complete your first focus session',
      icon: '🔥',
      xp: 25,
      rarity: 'common'
    },
    hourOfPower: {
      id: 'hour-power',
      name: 'Hour of Power',
      description: 'Focus for 60 minutes straight',
      icon: '⚡',
      xp: 50,
      rarity: 'rare'
    },
    deepDive: {
      id: 'deep-dive',
      name: 'Deep Dive',
      description: 'Focus for 4 hours in one day',
      icon: '🌊',
      xp: 100,
      rarity: 'epic'
    },
    zenMaster: {
      id: 'zen-master',
      name: 'Zen Master',
      description: '100 total focus hours',
      icon: '🧘',
      xp: 500,
      rarity: 'legendary'
    }
  },
  
  streak: {
    weekWarrior: {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: '7 day streak',
      icon: '⚔️',
      xp: 50,
      tokens: 25,
      rarity: 'rare'
    },
    monthlyMaster: {
      id: 'monthly-master',
      name: 'Monthly Master',
      description: '30 day streak',
      icon: '📅',
      xp: 200,
      tokens: 100,
      rarity: 'epic'
    },
    centuryClub: {
      id: 'century-club',
      name: 'Century Club',
      description: '100 day streak',
      icon: '💯',
      xp: 1000,
      tokens: 500,
      rarity: 'legendary'
    }
  },
  
  social: {
    firstFriend: {
      id: 'first-friend',
      name: 'First Friend',
      description: 'Add your first friend',
      icon: '🤝',
      xp: 25,
      rarity: 'common'
    },
    teamPlayer: {
      id: 'team-player',
      name: 'Team Player',
      description: 'Join or create a team',
      icon: '👥',
      xp: 50,
      rarity: 'rare'
    },
    influencer: {
      id: 'influencer',
      name: 'Influencer',
      description: 'Get 100 likes on your posts',
      icon: '⭐',
      xp: 100,
      rarity: 'epic'
    }
  },
  
  special: {
    earlyBird: {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete 5 sessions before 7 AM',
      icon: '🌅',
      xp: 50,
      rarity: 'rare'
    },
    nightOwl: {
      id: 'night-owl',
      name: 'Night Owl',
      description: 'Complete 5 sessions after 10 PM',
      icon: '🦉',
      xp: 50,
      rarity: 'rare'
    },
    perfectWeek: {
      id: 'perfect-week',
      name: 'Perfect Week',
      description: 'Complete all daily goals for 7 days',
      icon: '✨',
      xp: 100,
      tokens: 50,
      rarity: 'epic'
    }
  }
};
```

## Achievement Unlock Logic
```javascript
function checkAchievements(user, action, value) {
  const unlocked = [];
  
  switch(action) {
    case 'focus_complete':
      if (user.totalSessions === 1) {
        unlocked.push('first-burn');
      }
      if (value >= 60) {
        unlocked.push('hour-power');
      }
      if (user.todayFocusMinutes >= 240) {
        unlocked.push('deep-dive');
      }
      if (user.totalFocusHours >= 100) {
        unlocked.push('zen-master');
      }
      break;
      
    case 'streak_update':
      if (value === 7) unlocked.push('week-warrior');
      if (value === 30) unlocked.push('monthly-master');
      if (value === 100) unlocked.push('century-club');
      break;
      
    case 'social_action':
      if (action === 'friend_added' && user.friendCount === 1) {
        unlocked.push('first-friend');
      }
      if (action === 'team_joined') {
        unlocked.push('team-player');
      }
      break;
  }
  
  return unlocked;
}
```

---

# 💰 TOKEN ECONOMY

## Token Distribution
```javascript
const tokenEconomy = {
  // Earning Rates
  earning: {
    focusHour: 25,              // Per hour of focus
    dailyGoal: 100,             // Complete 4-hour daily goal
    weeklyBonus: 500,           // 7-day streak bonus
    achievement: 'variable',     // Based on rarity
    challenge: 'variable',       // Based on difficulty
    referral: 200,              // Per referred user
    teamWin: 150                // Team challenge victory
  },
  
  // Spending Options
  spending: {
    themeUnlock: 100,           // Custom themes
    aiCredits: 50,              // 10 AI interactions
    profileBadge: 200,          // Special badges
    booster: 150,               // 2x XP for 1 hour
    skipDay: 300,               // Maintain streak
    treasureKey: 100            // Open bonus chest
  },
  
  // Redemption
  redemption: {
    minPoints: 100,             // Minimum redemption
    maxPoints: 10000,           // Maximum per transaction
    rate: 0.5,                  // UPLIFT per point
    dailyCap: 5000,             // Daily limit
    weeklyCap: 20000            // Weekly limit
  }
};
```

## Token Flow
```
User Actions → Earn Tokens → Accumulate Balance → 
↓
Spend in Shop ← OR → Redeem for UPLIFT → External Wallet
↓
Unlock Features ← OR → Trade/Hold/Stake
```

---

# 🎯 DAILY REWARD SYSTEM

## Daily Login Rewards
```javascript
const dailyRewards = [
  { day: 1, xp: 10, tokens: 0, bonus: null },
  { day: 2, xp: 20, tokens: 0, bonus: null },
  { day: 3, xp: 30, tokens: 10, bonus: 'lucky_spin' },
  { day: 4, xp: 40, tokens: 0, bonus: null },
  { day: 5, xp: 50, tokens: 25, bonus: 'treasure_chest' },
  { day: 6, xp: 60, tokens: 0, bonus: null },
  { day: 7, xp: 100, tokens: 50, bonus: 'mystery_box' }
];

function claimDailyReward(user) {
  const today = new Date().toDateString();
  const lastClaim = user.lastDailyReward;
  
  if (lastClaim === today) {
    return { error: 'already_claimed' };
  }
  
  // Check if consecutive day or reset
  const daysSinceLastClaim = getDaysDifference(lastClaim, today);
  let currentDay = daysSinceLastClaim === 1 ? 
    (user.dailyRewardDay % 7) + 1 : 1;
  
  const reward = dailyRewards[currentDay - 1];
  
  return {
    day: currentDay,
    xp: reward.xp,
    tokens: reward.tokens,
    bonus: reward.bonus,
    nextDay: currentDay === 7 ? 1 : currentDay + 1
  };
}
```

---

# 🎰 LUCKY WHEEL SYSTEM

## Wheel Configuration
```javascript
const luckyWheel = {
  segments: [
    { id: 1, reward: '10 XP', weight: 25, color: '#gray' },
    { id: 2, reward: '25 Tokens', weight: 20, color: '#blue' },
    { id: 3, reward: '50 XP', weight: 15, color: '#green' },
    { id: 4, reward: 'AI Credit', weight: 10, color: '#purple' },
    { id: 5, reward: '50 Tokens', weight: 10, color: '#orange' },
    { id: 6, reward: 'Achievement', weight: 8, color: '#yellow' },
    { id: 7, reward: 'Treasure Chest', weight: 7, color: '#red' },
    { id: 8, reward: '100 Points', weight: 5, color: '#gold' }
  ],
  
  cooldown: 24 * 60 * 60 * 1000, // 24 hours
  freeSpins: 1, // Per day
  tokenCost: 50 // For additional spins
};

function spinWheel(user) {
  // Check cooldown
  const lastSpin = user.lastWheelSpin;
  const timeSince = Date.now() - lastSpin;
  
  if (timeSince < luckyWheel.cooldown && user.freeSpinsToday >= luckyWheel.freeSpins) {
    // Check if user wants to pay
    if (user.tokens < luckyWheel.tokenCost) {
      return { error: 'cooldown_active', timeLeft: luckyWheel.cooldown - timeSince };
    }
    // Deduct tokens for extra spin
    user.tokens -= luckyWheel.tokenCost;
  }
  
  // Calculate weighted random result
  const result = weightedRandom(luckyWheel.segments);
  
  // Apply reward
  applyWheelReward(user, result);
  
  return {
    segment: result.id,
    reward: result.reward,
    animation: generateSpinAnimation(result.id)
  };
}
```

---

# 🎁 TREASURE CHEST SYSTEM

## Chest Rarity Tiers
```javascript
const treasureChests = {
  common: {
    probability: 0.60,
    rewards: {
      xp: { min: 10, max: 25 },
      tokens: { min: 5, max: 15 },
      items: ['basic_badge', 'theme_preview']
    },
    animation: 'bronze_open'
  },
  
  rare: {
    probability: 0.30,
    rewards: {
      xp: { min: 50, max: 100 },
      tokens: { min: 25, max: 50 },
      items: ['rare_badge', 'ai_credits_5', 'xp_boost_1h']
    },
    animation: 'silver_open'
  },
  
  epic: {
    probability: 0.09,
    rewards: {
      xp: { min: 100, max: 250 },
      tokens: { min: 50, max: 100 },
      items: ['epic_badge', 'ai_credits_10', 'xp_boost_3h', 'streak_freeze']
    },
    animation: 'gold_open'
  },
  
  legendary: {
    probability: 0.01,
    rewards: {
      xp: { min: 500, max: 1000 },
      tokens: { min: 200, max: 500 },
      items: ['legendary_badge', 'ai_unlimited_24h', 'double_tokens_week', 'exclusive_theme']
    },
    animation: 'diamond_open'
  }
};

function openTreasureChest() {
  const roll = Math.random();
  let tier;
  
  if (roll < 0.01) tier = 'legendary';
  else if (roll < 0.10) tier = 'epic';
  else if (roll < 0.40) tier = 'rare';
  else tier = 'common';
  
  const chest = treasureChests[tier];
  const rewards = {
    tier: tier,
    xp: randomBetween(chest.rewards.xp.min, chest.rewards.xp.max),
    tokens: randomBetween(chest.rewards.tokens.min, chest.rewards.tokens.max),
    item: chest.rewards.items[Math.floor(Math.random() * chest.rewards.items.length)]
  };
  
  return rewards;
}
```

---

# 🏅 CHALLENGE SYSTEM

## Challenge Types
```javascript
const challenges = {
  daily: {
    focusGoal: {
      name: 'Daily Focus Goal',
      description: 'Complete 4 hours of focus',
      target: 240, // minutes
      reward: { xp: 50, tokens: 100 },
      reset: 'daily'
    },
    taskMaster: {
      name: 'Task Master',
      description: 'Complete 5 tasks',
      target: 5,
      reward: { xp: 30, tokens: 25 },
      reset: 'daily'
    },
    earlyBird: {
      name: 'Early Bird',
      description: 'Start a session before 7 AM',
      target: 1,
      reward: { xp: 25, tokens: 15 },
      reset: 'daily'
    }
  },
  
  weekly: {
    marathonWeek: {
      name: 'Marathon Week',
      description: 'Focus for 20 hours',
      target: 1200, // minutes
      reward: { xp: 200, tokens: 500 },
      reset: 'weekly'
    },
    socialButterfly: {
      name: 'Social Butterfly',
      description: 'Interact with 10 community posts',
      target: 10,
      reward: { xp: 100, tokens: 150 },
      reset: 'weekly'
    },
    perfectWeek: {
      name: 'Perfect Week',
      description: 'Complete daily goal every day',
      target: 7,
      reward: { xp: 300, tokens: 750 },
      reset: 'weekly'
    }
  },
  
  special: {
    monthlyMission: {
      name: 'Monthly Mission',
      description: 'Variable monthly challenge',
      target: 'dynamic',
      reward: { xp: 1000, tokens: 2000, badge: 'monthly_champion' },
      reset: 'monthly'
    }
  }
};
```

---

# 📈 LEADERBOARD SYSTEM

## Leaderboard Types
```javascript
const leaderboards = {
  global: {
    timeframes: ['daily', 'weekly', 'monthly', 'all-time'],
    metrics: ['xp', 'tokens', 'streak', 'focus_hours'],
    size: 100
  },
  
  friends: {
    scope: 'user.friendsList',
    metrics: ['xp', 'streak'],
    size: 50
  },
  
  team: {
    scope: 'user.teamId',
    metrics: ['collective_xp', 'average_focus', 'challenges_won'],
    size: 20
  },
  
  regional: {
    scope: 'user.region',
    metrics: ['xp', 'tokens'],
    size: 100
  }
};

function calculateLeaderboardPosition(userId, leaderboardType, metric) {
  const leaderboard = getLeaderboard(leaderboardType);
  const userScore = getUserMetric(userId, metric);
  
  let position = 1;
  for (const entry of leaderboard) {
    if (entry.score > userScore) position++;
  }
  
  return {
    position: position,
    total: leaderboard.length,
    percentile: ((leaderboard.length - position) / leaderboard.length) * 100,
    nearbyUsers: getNearbyUsers(leaderboard, position)
  };
}
```

---

# 🎮 ENGAGEMENT MECHANICS

## Streak System
```javascript
const streakSystem = {
  minimum: 25, // Minutes per day to maintain
  grace: 1, // Allowed skip days
  
  bonuses: {
    7: { xp: 50, tokens: 25 },
    30: { xp: 200, tokens: 100 },
    100: { xp: 1000, tokens: 500 },
    365: { xp: 10000, tokens: 5000, badge: 'year_dedication' }
  },
  
  protection: {
    freezeItem: 'streak_freeze',
    cost: 300, // tokens
    duration: 24 // hours
  }
};

function updateStreak(user) {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  const lastActive = user.lastActiveDay;
  
  if (lastActive === today) {
    return user.streak; // Already updated today
  }
  
  if (lastActive === yesterday && user.todayMinutes >= streakSystem.minimum) {
    // Continue streak
    user.streak++;
    checkStreakBonuses(user);
  } else if (user.hasStreakFreeze) {
    // Use freeze
    user.hasStreakFreeze = false;
  } else {
    // Break streak
    user.streak = user.todayMinutes >= streakSystem.minimum ? 1 : 0;
  }
  
  user.lastActiveDay = today;
  return user.streak;
}
```

---

# 🔮 PSYCHOLOGICAL HOOKS

## Variable Reward Schedule
```javascript
const variableRewards = {
  focus: {
    // Random bonus XP (10-50) every 3-7 sessions
    bonusXP: () => {
      const sessions = getUserSessionCount();
      if (sessions % randomBetween(3, 7) === 0) {
        return randomBetween(10, 50);
      }
      return 0;
    }
  },
  
  tasks: {
    // Surprise token reward (5-25) on random task completion
    surpriseTokens: () => {
      if (Math.random() < 0.1) { // 10% chance
        return randomBetween(5, 25);
      }
      return 0;
    }
  },
  
  login: {
    // Mystery reward on random logins
    mysteryReward: () => {
      if (Math.random() < 0.05) { // 5% chance
        return selectRandomReward(['xp_boost', 'tokens_50', 'treasure_key']);
      }
      return null;
    }
  }
};
```

## FOMO Mechanics
```javascript
const fomoMechanics = {
  limitedTime: {
    dailyChallenge: '24 hours',
    weekendBonus: '48 hours',
    flashSale: '1 hour'
  },
  
  exclusive: {
    betaBadges: 'First 1000 users',
    founderPerks: 'Early supporters only',
    seasonalThemes: 'Available this month only'
  },
  
  social: {
    friendProgress: 'Your friend just passed you!',
    teamChallenge: 'Your team needs you!',
    trending: '100 users completed this today'
  }
};
```

---

**Document Version**: 1.0.0
**Last Updated**: August 2025
**Total Game Mechanics**: 20+
**Reward Types**: 15+
**Psychological Principles**: 10+
