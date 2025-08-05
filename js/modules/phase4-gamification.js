/**
 * Phase 4: Advanced Gamification System
 * Implements RPG progression, enhanced goal management, and social features
 */

const Phase4Gamification = {
    // === CORE GAMIFICATION STATE ===
    state: {
        userLevel: 1,
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        achievements: [],
        badges: [],
        skillPoints: 0,
        character: {
            name: 'Operator',
            avatar: 'default',
            equipment: [],
            skills: {
                productivity: 0,
                health: 0,
                learning: 0,
                creativity: 0,
                social: 0
            }
        },
        quests: {
            daily: [],
            weekly: [],
            completed: []
        },
        rewards: {
            unlocked: [],
            available: []
        }
    },

    // === XP & LEVELING SYSTEM ===
    xpSystem: {
        // XP requirements for each level (exponential growth)
        getLevelXP(level) {
            return Math.floor(100 * Math.pow(1.5, level - 1));
        },

        // Calculate total XP needed for a level
        getTotalXPForLevel(level) {
            let total = 0;
            for (let i = 1; i <= level; i++) {
                total += this.getLevelXP(i);
            }
            return total;
        },

        // Add XP and handle level ups
        addXP(amount, reason = 'Activity') {
            const oldLevel = Phase4Gamification.state.userLevel;
            Phase4Gamification.state.totalXP += amount;
            
            // Check for level up
            const newLevel = this.calculateLevel(Phase4Gamification.state.totalXP);
            if (newLevel > oldLevel) {
                this.handleLevelUp(newLevel, oldLevel);
            }

            // Log XP gain
            console.log(`🎯 XP Gained: +${amount} (${reason}) - Total: ${Phase4Gamification.state.totalXP}`);
            
            // Update UI
            Phase4Gamification.ui.updateXPDisplay();
            Phase4Gamification.ui.showXPGain(amount, reason);
        },

        // Calculate current level based on total XP
        calculateLevel(totalXP) {
            let level = 1;
            let xpNeeded = 0;
            
            while (xpNeeded <= totalXP) {
                xpNeeded += this.getLevelXP(level);
                level++;
            }
            
            return level - 1;
        },

        // Handle level up events
        handleLevelUp(newLevel, oldLevel) {
            const levelDiff = newLevel - oldLevel;
            Phase4Gamification.state.userLevel = newLevel;
            Phase4Gamification.state.skillPoints += levelDiff * 2;
            
            // Unlock new features
            Phase4Gamification.rewards.unlockLevelRewards(newLevel);
            
            // Show celebration
            Phase4Gamification.ui.showLevelUpCelebration(newLevel);
            
            console.log(`🎉 LEVEL UP! You are now level ${newLevel}!`);
            
            // Trigger achievement check
            Phase4Gamification.achievements.checkLevelAchievements(newLevel);
        }
    },

    // === ACHIEVEMENT SYSTEM ===
    achievements: {
        // Achievement definitions
        definitions: {
            firstGoal: {
                id: 'firstGoal',
                name: 'First Steps',
                description: 'Complete your first goal',
                icon: '🎯',
                xpReward: 50,
                category: 'goals'
            },
            goalStreak: {
                id: 'goalStreak',
                name: 'Goal Getter',
                description: 'Complete goals for 7 days in a row',
                icon: '🔥',
                xpReward: 200,
                category: 'streaks'
            },
            level10: {
                id: 'level10',
                name: 'Dedicated Operator',
                description: 'Reach level 10',
                icon: '⭐',
                xpReward: 500,
                category: 'progression'
            },
            habitMaster: {
                id: 'habitMaster',
                name: 'Habit Master',
                description: 'Maintain a habit for 30 days',
                icon: '💪',
                xpReward: 300,
                category: 'habits'
            },
            focusChampion: {
                id: 'focusChampion',
                name: 'Focus Champion',
                description: 'Complete 10 focus sessions',
                icon: '🎯',
                xpReward: 150,
                category: 'focus'
            }
        },

        // Check and award achievements
        checkLevelAchievements(level) {
            if (level >= 10 && !this.isAchieved('level10')) {
                this.award('level10');
            }
        },

        checkGoalAchievements(goalCount, streak) {
            if (goalCount === 1 && !this.isAchieved('firstGoal')) {
                this.award('firstGoal');
            }
            
            if (streak >= 7 && !this.isAchieved('goalStreak')) {
                this.award('goalStreak');
            }
        },

        checkHabitAchievements(habitStreak) {
            if (habitStreak >= 30 && !this.isAchieved('habitMaster')) {
                this.award('habitMaster');
            }
        },

        checkFocusAchievements(focusSessions) {
            if (focusSessions >= 10 && !this.isAchieved('focusChampion')) {
                this.award('focusChampion');
            }
        },

        // Award an achievement
        award(achievementId) {
            const achievement = this.definitions[achievementId];
            if (!achievement || this.isAchieved(achievementId)) return;

            Phase4Gamification.state.achievements.push({
                id: achievementId,
                earnedAt: new Date().toISOString(),
                ...achievement
            });

            // Award XP
            Phase4Gamification.xpSystem.addXP(achievement.xpReward, `Achievement: ${achievement.name}`);

            // Show achievement notification
            Phase4Gamification.ui.showAchievementNotification(achievement);

            console.log(`🏆 Achievement Unlocked: ${achievement.name} - +${achievement.xpReward} XP`);
        },

        // Check if achievement is already earned
        isAchieved(achievementId) {
            return Phase4Gamification.state.achievements.some(a => a.id === achievementId);
        },

        // Get all achievements
        getAll() {
            return Phase4Gamification.state.achievements;
        },

        // Get achievement progress
        getProgress() {
            const total = Object.keys(this.definitions).length;
            const earned = Phase4Gamification.state.achievements.length;
            return { earned, total, percentage: Math.round((earned / total) * 100) };
        }
    },

    // === QUEST SYSTEM ===
    quests: {
        // Generate daily quests
        generateDailyQuests() {
            const quests = [
                {
                    id: 'daily_goal',
                    title: 'Goal Setter',
                    description: 'Complete 3 goals today',
                    target: 3,
                    current: 0,
                    reward: { xp: 100, type: 'xp' },
                    category: 'goals'
                },
                {
                    id: 'daily_habit',
                    title: 'Habit Builder',
                    description: 'Complete 5 habits today',
                    target: 5,
                    current: 0,
                    reward: { xp: 75, type: 'xp' },
                    category: 'habits'
                },
                {
                    id: 'daily_focus',
                    title: 'Focus Time',
                    description: 'Complete 2 focus sessions today',
                    target: 2,
                    current: 0,
                    reward: { xp: 50, type: 'xp' },
                    category: 'focus'
                }
            ];

            Phase4Gamification.state.quests.daily = quests;
            this.saveQuests();
        },

        // Update quest progress
        updateQuestProgress(questId, amount = 1) {
            const quest = Phase4Gamification.state.quests.daily.find(q => q.id === questId);
            if (!quest) return;

            quest.current = Math.min(quest.current + amount, quest.target);
            
            if (quest.current >= quest.target && !quest.completed) {
                this.completeQuest(quest);
            }

            this.saveQuests();
            Phase4Gamification.ui.updateQuestDisplay();
        },

        // Complete a quest
        completeQuest(quest) {
            quest.completed = true;
            quest.completedAt = new Date().toISOString();
            
            // Award rewards
            if (quest.reward.type === 'xp') {
                Phase4Gamification.xpSystem.addXP(quest.reward.xp, `Quest: ${quest.title}`);
            }

            // Move to completed
            Phase4Gamification.state.quests.completed.push(quest);
            Phase4Gamification.state.quests.daily = Phase4Gamification.state.quests.daily.filter(q => q.id !== quest.id);

            // Show completion notification
            Phase4Gamification.ui.showQuestCompletion(quest);

            console.log(`✅ Quest Completed: ${quest.title} - +${quest.reward.xp} XP`);
        },

        // Save quests to storage
        saveQuests() {
            localStorage.setItem('phase4_quests', JSON.stringify(Phase4Gamification.state.quests));
        },

        // Load quests from storage
        loadQuests() {
            const saved = localStorage.getItem('phase4_quests');
            if (saved) {
                Phase4Gamification.state.quests = JSON.parse(saved);
            } else {
                this.generateDailyQuests();
            }
        }
    },

    // === REWARD SYSTEM ===
    rewards: {
        // Reward definitions
        definitions: {
            level5: {
                id: 'level5',
                name: 'Advanced Analytics',
                description: 'Unlock detailed progress analytics',
                type: 'feature',
                levelRequired: 5
            },
            level10: {
                id: 'level10',
                name: 'Custom Themes',
                description: 'Unlock custom UI themes',
                type: 'feature',
                levelRequired: 10
            },
            level15: {
                id: 'level15',
                name: 'Social Features',
                description: 'Unlock community and sharing features',
                type: 'feature',
                levelRequired: 15
            }
        },

        // Unlock level-based rewards
        unlockLevelRewards(level) {
            Object.values(this.definitions).forEach(reward => {
                if (level >= reward.levelRequired && !this.isUnlocked(reward.id)) {
                    this.unlock(reward.id);
                }
            });
        },

        // Unlock a reward
        unlock(rewardId) {
            const reward = this.definitions[rewardId];
            if (!reward || this.isUnlocked(rewardId)) return;

            Phase4Gamification.state.rewards.unlocked.push({
                id: rewardId,
                unlockedAt: new Date().toISOString(),
                ...reward
            });

            // Show reward notification
            Phase4Gamification.ui.showRewardUnlock(reward);

            console.log(`🎁 Reward Unlocked: ${reward.name}`);
        },

        // Check if reward is unlocked
        isUnlocked(rewardId) {
            return Phase4Gamification.state.rewards.unlocked.some(r => r.id === rewardId);
        },

        // Get all unlocked rewards
        getUnlocked() {
            return Phase4Gamification.state.rewards.unlocked;
        }
    },

    // === STREAK SYSTEM ===
    streaks: {
        // Update daily streak
        updateStreak(activityType) {
            const today = new Date().toDateString();
            const lastActivity = localStorage.getItem(`last_${activityType}_activity`);
            
            if (lastActivity === today) return; // Already counted today

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastActivity === yesterdayStr) {
                // Continue streak
                Phase4Gamification.state.currentStreak++;
            } else if (lastActivity !== today) {
                // Break streak
                if (Phase4Gamification.state.currentStreak > Phase4Gamification.state.longestStreak) {
                    Phase4Gamification.state.longestStreak = Phase4Gamification.state.currentStreak;
                }
                Phase4Gamification.state.currentStreak = 1;
            }

            // Save activity
            localStorage.setItem(`last_${activityType}_activity`, today);
            this.saveStreakData();

            // Update UI
            Phase4Gamification.ui.updateStreakDisplay();
        },

        // Save streak data
        saveStreakData() {
            localStorage.setItem('phase4_streaks', JSON.stringify({
                current: Phase4Gamification.state.currentStreak,
                longest: Phase4Gamification.state.longestStreak
            }));
        },

        // Load streak data
        loadStreakData() {
            const saved = localStorage.getItem('phase4_streaks');
            if (saved) {
                const data = JSON.parse(saved);
                Phase4Gamification.state.currentStreak = data.current || 0;
                Phase4Gamification.state.longestStreak = data.longest || 0;
            }
        }
    },

    // === UI COMPONENTS ===
    ui: {
        // Update XP display
        updateXPDisplay() {
            const xpElement = document.getElementById('user-xp');
            const levelElement = document.getElementById('user-level');
            const progressElement = document.getElementById('level-progress');

            if (xpElement) {
                xpElement.textContent = Phase4Gamification.state.totalXP.toLocaleString();
            }

            if (levelElement) {
                levelElement.textContent = `Level ${Phase4Gamification.state.userLevel}`;
            }

            if (progressElement) {
                const currentLevelXP = Phase4Gamification.xpSystem.getTotalXPForLevel(Phase4Gamification.state.userLevel);
                const nextLevelXP = Phase4Gamification.xpSystem.getTotalXPForLevel(Phase4Gamification.state.userLevel + 1);
                const progress = ((Phase4Gamification.state.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
                progressElement.style.width = `${Math.min(100, Math.max(0, progress))}%`;
            }
        },

        // Show XP gain notification
        showXPGain(amount, reason) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
            notification.innerHTML = `
                <div class="flex items-center space-x-2">
                    <span class="text-xl">🎯</span>
                    <div>
                        <div class="font-bold">+${amount} XP</div>
                        <div class="text-sm opacity-90">${reason}</div>
                    </div>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        },

        // Show level up celebration
        showLevelUpCelebration(level) {
            const celebration = document.createElement('div');
            celebration.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            celebration.innerHTML = `
                <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-lg text-center animate-pulse">
                    <div class="text-6xl mb-4">🎉</div>
                    <div class="text-3xl font-bold mb-2">LEVEL UP!</div>
                    <div class="text-xl">You are now Level ${level}</div>
                    <div class="text-sm mt-4 opacity-90">New features unlocked!</div>
                    <button class="mt-6 bg-white text-orange-500 px-6 py-2 rounded-lg font-bold hover:bg-gray-100">
                        Continue
                    </button>
                </div>
            `;

            document.body.appendChild(celebration);

            celebration.querySelector('button').addEventListener('click', () => {
                celebration.remove();
            });
        },

        // Show achievement notification
        showAchievementNotification(achievement) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
            notification.innerHTML = `
                <div class="flex items-center space-x-2">
                    <span class="text-xl">${achievement.icon}</span>
                    <div>
                        <div class="font-bold">Achievement Unlocked!</div>
                        <div class="text-sm">${achievement.name}</div>
                    </div>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 4000);
        },

        // Show quest completion
        showQuestCompletion(quest) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
            notification.innerHTML = `
                <div class="flex items-center space-x-2">
                    <span class="text-xl">✅</span>
                    <div>
                        <div class="font-bold">Quest Completed!</div>
                        <div class="text-sm">${quest.title}</div>
                    </div>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        },

        // Show reward unlock
        showRewardUnlock(reward) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
            notification.innerHTML = `
                <div class="flex items-center space-x-2">
                    <span class="text-xl">🎁</span>
                    <div>
                        <div class="font-bold">Reward Unlocked!</div>
                        <div class="text-sm">${reward.name}</div>
                    </div>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 4000);
        },

        // Update streak display
        updateStreakDisplay() {
            const streakElement = document.getElementById('current-streak');
            if (streakElement) {
                streakElement.textContent = Phase4Gamification.state.currentStreak;
            }
        },

        // Update quest display
        updateQuestDisplay() {
            const questContainer = document.getElementById('daily-quests');
            if (!questContainer) return;

            questContainer.innerHTML = Phase4Gamification.state.quests.daily.map(quest => `
                <div class="bg-gray-800 p-4 rounded-lg mb-3">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-semibold text-white">${quest.title}</h4>
                        <span class="text-sm text-gray-400">${quest.current}/${quest.target}</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-2">${quest.description}</p>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="bg-orange-500 h-2 rounded-full" style="width: ${(quest.current / quest.target) * 100}%"></div>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">Reward: ${quest.reward.xp} XP</div>
                </div>
            `).join('');
        }
    },

    // === INTEGRATION METHODS ===
    // Initialize Phase 4 gamification
    init() {
        console.log('🎮 Initializing Phase 4 Gamification System...');
        
        // Load saved data
        this.loadData();
        
        // Initialize quests
        this.quests.loadQuests();
        
        // Load streaks
        this.streaks.loadStreakData();
        
        // Update UI
        this.ui.updateXPDisplay();
        this.ui.updateStreakDisplay();
        this.ui.updateQuestDisplay();
        
        console.log('✅ Phase 4 Gamification System initialized');
    },

    // Load saved data
    loadData() {
        const saved = localStorage.getItem('phase4_gamification');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(this.state, data);
        }
    },

    // Save data
    saveData() {
        localStorage.setItem('phase4_gamification', JSON.stringify(this.state));
    },

    // Goal completion handler
    onGoalComplete(goal) {
        // Award XP
        this.xpSystem.addXP(100, 'Goal Completion');
        
        // Update quest progress
        this.quests.updateQuestProgress('daily_goal');
        
        // Update streak
        this.streaks.updateStreak('goal');
        
        // Check achievements
        const goalCount = (app.state.userData?.goals?.completed || 0) + 1;
        const streak = this.state.currentStreak;
        this.achievements.checkGoalAchievements(goalCount, streak);
        
        // Save data
        this.saveData();
    },

    // Habit completion handler
    onHabitComplete(habit) {
        // Award XP
        this.xpSystem.addXP(25, 'Habit Completion');
        
        // Update quest progress
        this.quests.updateQuestProgress('daily_habit');
        
        // Update streak
        this.streaks.updateStreak('habit');
        
        // Check achievements
        const habitStreak = habit.streak || 0;
        this.achievements.checkHabitAchievements(habitStreak);
        
        // Save data
        this.saveData();
    },

    // Focus session completion handler
    onFocusComplete(session) {
        // Award XP
        this.xpSystem.addXP(50, 'Focus Session');
        
        // Update quest progress
        this.quests.updateQuestProgress('daily_focus');
        
        // Update streak
        this.streaks.updateStreak('focus');
        
        // Check achievements
        const focusSessions = (app.state.userData?.focusSessions?.completed || 0) + 1;
        this.achievements.checkFocusAchievements(focusSessions);
        
        // Save data
        this.saveData();
    }
};

// Export for global access
window.Phase4Gamification = Phase4Gamification; 