// Gamification Module
// Handles RPG elements, achievements, and game mechanics

class GamificationModule {
  constructor(core) {
    this.core = core;
    this.isInitialized = false;
    this.achievements = [];
    this.badges = [];
    this.quests = [];
    this.leaderboard = [];
  }

  async init() {
    if (this.isInitialized) {return;}

    console.log('🎮 Gamification Module initialized');
    this.isInitialized = true;

    // Load gamification data
    this.loadGamificationData();

    // Setup achievements
    this.setupAchievements();

    // Setup quests
    this.setupQuests();

    // Initialize user progress
    this.initializeUserProgress();
  }

  // Load gamification data from localStorage
  loadGamificationData() {
    try {
      const savedAchievements = localStorage.getItem('user-achievements');
      if (savedAchievements) {
        this.achievements = JSON.parse(savedAchievements);
      }

      const savedBadges = localStorage.getItem('user-badges');
      if (savedBadges) {
        this.badges = JSON.parse(savedBadges);
      }

      const savedQuests = localStorage.getItem('user-quests');
      if (savedQuests) {
        this.quests = JSON.parse(savedQuests);
      }
    } catch (error) {
      console.warn('Failed to load gamification data:', error);
    }
  }

  // Save gamification data to localStorage
  saveGamificationData() {
    try {
      localStorage.setItem('user-achievements', JSON.stringify(this.achievements));
      localStorage.setItem('user-badges', JSON.stringify(this.badges));
      localStorage.setItem('user-quests', JSON.stringify(this.quests));
    } catch (error) {
      console.warn('Failed to save gamification data:', error);
    }
  }

  // Setup achievements system
  setupAchievements() {
    const defaultAchievements = [
      {
        id: 'first-goal',
        title: 'First Steps',
        description: 'Create your first goal',
        icon: '🎯',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'goal-complete',
        title: 'Goal Crusher',
        description: 'Complete your first goal',
        icon: '🏆',
        unlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'streak-7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        unlocked: false,
        progress: 0,
        maxProgress: 7
      },
      {
        id: 'level-5',
        title: 'Rising Star',
        description: 'Reach level 5',
        icon: '⭐',
        unlocked: false,
        progress: 0,
        maxProgress: 5
      },
      {
        id: 'essence-500',
        title: 'Essence Collector',
        description: 'Earn 500 essence points',
        icon: '💎',
        unlocked: false,
        progress: 0,
        maxProgress: 500
      }
    ];

    // Merge with existing achievements
    this.achievements = this.mergeAchievements(this.achievements, defaultAchievements);
  }

  // Merge achievements
  mergeAchievements(existing, defaults) {
    const merged = [...defaults];

    existing.forEach(existingAchievement => {
      const index = merged.findIndex(a => a.id === existingAchievement.id);
      if (index !== -1) {
        merged[index] = { ...merged[index], ...existingAchievement };
      }
    });

    return merged;
  }

  // Setup quests system
  setupQuests() {
    const defaultQuests = [
      {
        id: 'daily-login',
        title: 'Daily Login',
        description: 'Log in for 3 consecutive days',
        icon: '📅',
        type: 'daily',
        progress: 0,
        maxProgress: 3,
        reward: { essence: 25, xp: 10 },
        completed: false
      },
      {
        id: 'goal-master',
        title: 'Goal Master',
        description: 'Complete 5 goals',
        icon: '🎯',
        type: 'milestone',
        progress: 0,
        maxProgress: 5,
        reward: { essence: 100, xp: 50 },
        completed: false
      }
    ];

    // Merge with existing quests
    this.quests = this.mergeQuests(this.quests, defaultQuests);
  }

  // Merge quests
  mergeQuests(existing, defaults) {
    const merged = [...defaults];

    existing.forEach(existingQuest => {
      const index = merged.findIndex(q => q.id === existingQuest.id);
      if (index !== -1) {
        merged[index] = { ...merged[index], ...existingQuest };
      }
    });

    return merged;
  }

  // Initialize user progress
  initializeUserProgress() {
    const { userData } = this.core.state;

    // Set default values if not present
    userData.level = userData.level || 1;
    userData.essence = userData.essence || 0;
    userData.xp = userData.xp || 0;
    userData.streak = userData.streak || 0;
    userData.totalGoals = userData.totalGoals || 0;
    userData.completedGoals = userData.completedGoals || 0;

    // Check achievements
    this.checkAchievements();

    // Check quests
    this.checkQuests();
  }

  // Check and update achievements
  checkAchievements() {
    const { userData } = this.core.state;
    const newAchievements = [];

    this.achievements.forEach(achievement => {
      if (achievement.unlocked) {return;}

      let progress = 0;

      switch (achievement.id) {
      case 'first-goal':
        progress = userData.totalGoals > 0 ? 1 : 0;
        break;
      case 'goal-complete':
        progress = userData.completedGoals > 0 ? 1 : 0;
        break;
      case 'streak-7':
        progress = Math.min(userData.streak, 7);
        break;
      case 'level-5':
        progress = Math.min(userData.level, 5);
        break;
      case 'essence-500':
        progress = Math.min(userData.essence, 500);
        break;
      }

      achievement.progress = progress;

      if (progress >= achievement.maxProgress && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        newAchievements.push(achievement);
      }
    });

    // Show new achievements
    newAchievements.forEach(achievement => {
      this.showAchievementUnlocked(achievement);
    });

    this.saveGamificationData();
  }

  // Check and update quests
  checkQuests() {
    const { userData } = this.core.state;
    const completedQuests = [];

    this.quests.forEach(quest => {
      if (quest.completed) {return;}

      let progress = 0;

      switch (quest.id) {
      case 'daily-login':
        // This would be updated by the auth module
        progress = quest.progress;
        break;
      case 'goal-master':
        progress = Math.min(userData.completedGoals, quest.maxProgress);
        break;
      }

      quest.progress = progress;

      if (progress >= quest.maxProgress && !quest.completed) {
        quest.completed = true;
        quest.completedAt = new Date().toISOString();
        completedQuests.push(quest);

        // Award rewards
        this.awardQuestRewards(quest);
      }
    });

    // Show completed quests
    completedQuests.forEach(quest => {
      this.showQuestCompleted(quest);
    });

    this.saveGamificationData();
  }

  // Award quest rewards
  awardQuestRewards(quest) {
    const { userData } = this.core.state;

    if (quest.reward.essence) {
      userData.essence = (userData.essence || 0) + quest.reward.essence;
    }

    if (quest.reward.xp) {
      userData.xp = (userData.xp || 0) + quest.reward.xp;
    }

    console.log(`🎁 Quest rewards awarded: +${quest.reward.essence} essence, +${quest.reward.xp} XP`);
  }

  // Show achievement unlocked notification
  showAchievementUnlocked(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            </div>
        `;

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);

    console.log(`🏆 Achievement unlocked: ${achievement.title}`);
  }

  // Show quest completed notification
  showQuestCompleted(quest) {
    const notification = document.createElement('div');
    notification.className = 'quest-notification';
    notification.innerHTML = `
            <div class="quest-content">
                <div class="quest-icon">${quest.icon}</div>
                <div class="quest-info">
                    <div class="quest-title">${quest.title}</div>
                    <div class="quest-description">${quest.description}</div>
                    <div class="quest-reward">+${quest.reward.essence} Essence, +${quest.reward.xp} XP</div>
                </div>
            </div>
        `;

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);

    console.log(`📜 Quest completed: ${quest.title}`);
  }

  // Add XP to user
  addXP(amount) {
    const { userData } = this.core.state;
    userData.xp = (userData.xp || 0) + amount;

    // Check for level up based on XP
    this.checkXPLevelUp();

    console.log(`📈 XP gained: +${amount} (Total: ${userData.xp})`);
  }

  // Check for level up based on XP
  checkXPLevelUp() {
    const { userData } = this.core.state;
    const currentLevel = userData.level || 1;
    const xp = userData.xp || 0;
    const xpPerLevel = 100;

    const newLevel = Math.floor(xp / xpPerLevel) + 1;

    if (newLevel > currentLevel) {
      userData.level = newLevel;
      this.showLevelUpCelebration(newLevel);
      console.log(`🚀 Level up! Now level ${newLevel}`);
    }
  }

  // Show level up celebration
  showLevelUpCelebration(level) {
    const celebration = document.createElement('div');
    celebration.className = 'level-up-celebration';
    celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🚀</div>
                <div class="celebration-title">Level Up!</div>
                <div class="celebration-message">You reached level ${level}</div>
                <div class="celebration-reward">New features unlocked!</div>
            </div>
        `;

    document.body.appendChild(celebration);

    setTimeout(() => {
      celebration.remove();
    }, 3000);
  }

  // Get user stats
  getUserStats() {
    const { userData } = this.core.state;
    return {
      level: userData.level || 1,
      essence: userData.essence || 0,
      xp: userData.xp || 0,
      streak: userData.streak || 0,
      totalGoals: userData.totalGoals || 0,
      completedGoals: userData.completedGoals || 0,
      achievements: this.achievements.filter(a => a.unlocked).length,
      totalAchievements: this.achievements.length,
      quests: this.quests.filter(q => q.completed).length,
      totalQuests: this.quests.length
    };
  }

  // Get achievements
  getAchievements() {
    return this.achievements;
  }

  // Get quests
  getQuests() {
    return this.quests;
  }

  // Get leaderboard (mock data)
  getLeaderboard() {
    return [
      { name: 'Player 1', level: 10, essence: 1500, xp: 1200 },
      { name: 'Player 2', level: 8, essence: 1200, xp: 900 },
      { name: 'Player 3', level: 6, essence: 800, xp: 600 },
      { name: 'Player 4', level: 4, essence: 500, xp: 400 },
      { name: 'Player 5', level: 2, essence: 200, xp: 150 }
    ];
  }

  // Update daily quests
  updateDailyQuests() {
    this.quests.forEach(quest => {
      if (quest.type === 'daily') {
        // Reset daily quests
        quest.progress = 0;
        quest.completed = false;
      }
    });

    this.saveGamificationData();
  }

  // Cleanup
  cleanup() {
    this.isInitialized = false;
    this.achievements = [];
    this.badges = [];
    this.quests = [];
    console.log('🎮 Gamification Module cleanup completed');
  }
}

export default GamificationModule;
