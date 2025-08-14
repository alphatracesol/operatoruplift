/**
 * Enhanced Gamification System
 * Implements achievement notifications, leaderboards, challenges, and rewards
 */

// ============================================
// 1. ACHIEVEMENT SYSTEM
// ============================================

class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.progress = new Map();
        this.notifications = [];
        this.init();
    }

    init() {
        this.loadAchievements();
        this.loadProgress();
        this.setupAchievementDefinitions();
        this.startProgressTracking();
    }

    setupAchievementDefinitions() {
        const achievements = [
            // Focus Achievements
            {
                id: 'first_focus',
                name: 'First Focus',
                description: 'Complete your first focus session',
                icon: '🎯',
                xp: 10,
                tokens: 5,
                category: 'focus',
                condition: (stats) => stats.totalSessions >= 1
            },
            {
                id: 'focus_hour',
                name: 'Power Hour',
                description: 'Focus for 60 minutes straight',
                icon: '⚡',
                xp: 50,
                tokens: 25,
                category: 'focus',
                condition: (stats) => stats.longestSession >= 60
            },
            {
                id: 'focus_master',
                name: 'Focus Master',
                description: 'Complete 100 focus sessions',
                icon: '🧘',
                xp: 500,
                tokens: 250,
                category: 'focus',
                condition: (stats) => stats.totalSessions >= 100
            },
            
            // Streak Achievements
            {
                id: 'week_streak',
                name: 'Week Warrior',
                description: 'Maintain a 7-day streak',
                icon: '🔥',
                xp: 100,
                tokens: 50,
                category: 'streak',
                condition: (stats) => stats.currentStreak >= 7
            },
            {
                id: 'month_streak',
                name: 'Monthly Master',
                description: 'Maintain a 30-day streak',
                icon: '🌟',
                xp: 500,
                tokens: 250,
                category: 'streak',
                condition: (stats) => stats.currentStreak >= 30
            },
            {
                id: 'year_streak',
                name: 'Legendary',
                description: 'Maintain a 365-day streak',
                icon: '👑',
                xp: 5000,
                tokens: 2500,
                category: 'streak',
                condition: (stats) => stats.currentStreak >= 365,
                rare: true
            },
            
            // Task Achievements
            {
                id: 'task_complete',
                name: 'Task Master',
                description: 'Complete 10 tasks',
                icon: '✅',
                xp: 30,
                tokens: 15,
                category: 'tasks',
                condition: (stats) => stats.tasksCompleted >= 10
            },
            {
                id: 'productive_day',
                name: 'Productive Day',
                description: 'Complete all daily tasks',
                icon: '📈',
                xp: 50,
                tokens: 25,
                category: 'tasks',
                condition: (stats) => stats.dailyTaskCompletion === 100
            },
            
            // Social Achievements
            {
                id: 'first_friend',
                name: 'Social Butterfly',
                description: 'Add your first friend',
                icon: '🦋',
                xp: 20,
                tokens: 10,
                category: 'social',
                condition: (stats) => stats.friendCount >= 1
            },
            {
                id: 'leaderboard_top',
                name: 'Champion',
                description: 'Reach #1 on the leaderboard',
                icon: '🏆',
                xp: 200,
                tokens: 100,
                category: 'social',
                condition: (stats) => stats.leaderboardRank === 1,
                rare: true
            },
            
            // Special Achievements
            {
                id: 'night_owl',
                name: 'Night Owl',
                description: 'Complete a focus session after midnight',
                icon: '🦉',
                xp: 30,
                tokens: 15,
                category: 'special',
                condition: (stats) => stats.nightSessions >= 1,
                hidden: true
            },
            {
                id: 'early_bird',
                name: 'Early Bird',
                description: 'Complete a focus session before 6 AM',
                icon: '🐦',
                xp: 30,
                tokens: 15,
                category: 'special',
                condition: (stats) => stats.earlySessions >= 1,
                hidden: true
            },
            {
                id: 'perfectionist',
                name: 'Perfectionist',
                description: 'Achieve 100% completion rate for a week',
                icon: '💯',
                xp: 100,
                tokens: 50,
                category: 'special',
                condition: (stats) => stats.weeklyCompletion === 100,
                rare: true
            }
        ];

        achievements.forEach(achievement => {
            this.achievements.set(achievement.id, achievement);
        });
    }

    loadAchievements() {
        try {
            const saved = localStorage.getItem('unlocked_achievements');
            if (saved) {
                const unlocked = JSON.parse(saved);
                this.unlockedAchievements = new Set(unlocked);
            }
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('achievement_progress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.progress = new Map(Object.entries(progress));
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }

    saveAchievements() {
        try {
            localStorage.setItem('unlocked_achievements', 
                JSON.stringify(Array.from(this.unlockedAchievements)));
            
            const progressObj = {};
            this.progress.forEach((value, key) => {
                progressObj[key] = value;
            });
            localStorage.setItem('achievement_progress', JSON.stringify(progressObj));
        } catch (error) {
            console.error('Error saving achievements:', error);
        }
    }

    startProgressTracking() {
        // Check achievements every 30 seconds
        setInterval(() => {
            this.checkAchievements();
        }, 30000);

        // Also check on specific events
        document.addEventListener('focus-session-complete', () => this.checkAchievements());
        document.addEventListener('task-complete', () => this.checkAchievements());
        document.addEventListener('streak-update', () => this.checkAchievements());
    }

    async checkAchievements() {
        const stats = await this.getUserStats();
        
        this.achievements.forEach((achievement, id) => {
            if (!this.unlockedAchievements.has(id)) {
                if (achievement.condition(stats)) {
                    this.unlockAchievement(id);
                }
            }
        });
    }

    async getUserStats() {
        // Get user statistics from various sources
        try {
            const stats = {
                totalSessions: parseInt(localStorage.getItem('total_sessions') || '0'),
                longestSession: parseInt(localStorage.getItem('longest_session') || '0'),
                currentStreak: parseInt(localStorage.getItem('current_streak') || '0'),
                tasksCompleted: parseInt(localStorage.getItem('tasks_completed') || '0'),
                dailyTaskCompletion: parseInt(localStorage.getItem('daily_completion') || '0'),
                friendCount: parseInt(localStorage.getItem('friend_count') || '0'),
                leaderboardRank: parseInt(localStorage.getItem('leaderboard_rank') || '999'),
                nightSessions: parseInt(localStorage.getItem('night_sessions') || '0'),
                earlySessions: parseInt(localStorage.getItem('early_sessions') || '0'),
                weeklyCompletion: parseInt(localStorage.getItem('weekly_completion') || '0')
            };
            return stats;
        } catch (error) {
            console.error('Error getting user stats:', error);
            return {};
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement) return;

        // Mark as unlocked
        this.unlockedAchievements.add(achievementId);
        this.saveAchievements();

        // Show notification
        this.showAchievementNotification(achievement);

        // Award rewards
        this.awardRewards(achievement);

        // Fire event
        document.dispatchEvent(new CustomEvent('achievement-unlocked', {
            detail: achievement
        }));

        // Update UI
        this.updateAchievementUI();
    }

    showAchievementNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-details">
                    <div class="achievement-title">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-rewards">
                        <span class="achievement-xp">+${achievement.xp} XP</span>
                        ${achievement.tokens ? `<span class="achievement-tokens">+${achievement.tokens} Tokens</span>` : ''}
                    </div>
                </div>
            </div>
        `;

        // Add styles if not already present
        this.addNotificationStyles();

        // Add to document
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Play sound
        this.playAchievementSound();

        // Trigger confetti
        if (achievement.rare) {
            this.triggerConfetti();
        }

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    addNotificationStyles() {
        if (!document.getElementById('achievement-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-notification-styles';
            style.textContent = `
                .achievement-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 400px;
                    background: linear-gradient(135deg, rgba(249, 115, 22, 0.95), rgba(251, 146, 60, 0.95));
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    transform: translateX(500px);
                    transition: transform 0.3s ease-out;
                }
                
                .achievement-notification.show {
                    transform: translateX(0);
                }
                
                .achievement-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .achievement-icon {
                    font-size: 48px;
                    animation: bounce 0.5s ease-in-out;
                }
                
                @keyframes bounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
                
                .achievement-details {
                    flex: 1;
                }
                
                .achievement-title {
                    font-size: 12px;
                    text-transform: uppercase;
                    opacity: 0.9;
                    margin-bottom: 4px;
                }
                
                .achievement-name {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }
                
                .achievement-description {
                    font-size: 14px;
                    opacity: 0.9;
                    margin-bottom: 8px;
                }
                
                .achievement-rewards {
                    display: flex;
                    gap: 12px;
                    font-size: 14px;
                    font-weight: 600;
                }
                
                .achievement-xp {
                    color: #fbbf24;
                }
                
                .achievement-tokens {
                    color: #60a5fa;
                }
            `;
            document.head.appendChild(style);
        }
    }

    playAchievementSound() {
        // Create and play achievement sound
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBi+Cu/LWizMGHGS48+OZURE');
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Ignore audio play errors
        });
    }

    triggerConfetti() {
        // Use canvas-confetti if available
        if (window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    awardRewards(achievement) {
        // Award XP
        const currentXP = parseInt(localStorage.getItem('user_xp') || '0');
        localStorage.setItem('user_xp', currentXP + achievement.xp);

        // Award tokens
        if (achievement.tokens) {
            const currentTokens = parseInt(localStorage.getItem('user_tokens') || '0');
            localStorage.setItem('user_tokens', currentTokens + achievement.tokens);
        }

        // Update UI
        this.updateRewardsUI();
    }

    updateAchievementUI() {
        // Update achievement count
        const countElement = document.getElementById('achievement-count');
        if (countElement) {
            countElement.textContent = this.unlockedAchievements.size;
        }

        // Update achievement grid
        const gridElement = document.getElementById('achievement-grid');
        if (gridElement) {
            this.renderAchievementGrid(gridElement);
        }
    }

    updateRewardsUI() {
        // Update XP display
        const xpElement = document.getElementById('user-xp');
        if (xpElement) {
            xpElement.textContent = localStorage.getItem('user_xp') || '0';
        }

        // Update tokens display
        const tokensElement = document.getElementById('user-tokens');
        if (tokensElement) {
            tokensElement.textContent = localStorage.getItem('user_tokens') || '0';
        }
    }

    renderAchievementGrid(container) {
        const categories = ['focus', 'streak', 'tasks', 'social', 'special'];
        let html = '';

        categories.forEach(category => {
            const categoryAchievements = Array.from(this.achievements.values())
                .filter(a => a.category === category && !a.hidden);

            html += `
                <div class="achievement-category">
                    <h3 class="achievement-category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <div class="achievement-grid">
                        ${categoryAchievements.map(achievement => `
                            <div class="achievement-card ${this.unlockedAchievements.has(achievement.id) ? 'unlocked' : 'locked'}">
                                <div class="achievement-icon">${achievement.icon}</div>
                                <div class="achievement-name">${achievement.name}</div>
                                <div class="achievement-description">${achievement.description}</div>
                                ${achievement.rare ? '<div class="achievement-rare">Rare</div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    getProgress() {
        const total = this.achievements.size;
        const unlocked = this.unlockedAchievements.size;
        const percentage = Math.round((unlocked / total) * 100);

        return {
            total,
            unlocked,
            percentage,
            categories: this.getCategoryProgress()
        };
    }

    getCategoryProgress() {
        const categories = {};
        
        this.achievements.forEach((achievement) => {
            if (!categories[achievement.category]) {
                categories[achievement.category] = {
                    total: 0,
                    unlocked: 0
                };
            }
            
            categories[achievement.category].total++;
            if (this.unlockedAchievements.has(achievement.id)) {
                categories[achievement.category].unlocked++;
            }
        });

        return categories;
    }
}

// ============================================
// 2. CHALLENGE SYSTEM
// ============================================

class ChallengeSystem {
    constructor() {
        this.dailyChallenges = [];
        this.weeklyChallenges = [];
        this.activeChallenges = new Map();
        this.completedChallenges = new Set();
        this.init();
    }

    init() {
        this.loadChallenges();
        this.generateDailyChallenges();
        this.generateWeeklyChallenges();
        this.startChallengeTimer();
    }

    loadChallenges() {
        try {
            const saved = localStorage.getItem('active_challenges');
            if (saved) {
                const challenges = JSON.parse(saved);
                this.activeChallenges = new Map(challenges.active);
                this.completedChallenges = new Set(challenges.completed);
            }
        } catch (error) {
            console.error('Error loading challenges:', error);
        }
    }

    saveChallenges() {
        try {
            localStorage.setItem('active_challenges', JSON.stringify({
                active: Array.from(this.activeChallenges.entries()),
                completed: Array.from(this.completedChallenges)
            }));
        } catch (error) {
            console.error('Error saving challenges:', error);
        }
    }

    generateDailyChallenges() {
        const today = new Date().toDateString();
        const lastGenerated = localStorage.getItem('last_daily_challenges');

        if (lastGenerated === today) {
            // Already generated for today
            return;
        }

        const challengeTemplates = [
            {
                id: 'daily_focus_30',
                name: 'Focus Sprint',
                description: 'Complete 30 minutes of focused work',
                target: 30,
                unit: 'minutes',
                reward: { xp: 50, tokens: 25 },
                type: 'focus'
            },
            {
                id: 'daily_tasks_5',
                name: 'Task Crusher',
                description: 'Complete 5 tasks',
                target: 5,
                unit: 'tasks',
                reward: { xp: 40, tokens: 20 },
                type: 'tasks'
            },
            {
                id: 'daily_streak',
                name: 'Keep the Streak',
                description: 'Maintain your daily streak',
                target: 1,
                unit: 'day',
                reward: { xp: 30, tokens: 15 },
                type: 'streak'
            },
            {
                id: 'daily_early',
                name: 'Early Start',
                description: 'Start a focus session before 9 AM',
                target: 1,
                unit: 'session',
                reward: { xp: 35, tokens: 18 },
                type: 'special'
            }
        ];

        // Randomly select 3 daily challenges
        const shuffled = challengeTemplates.sort(() => 0.5 - Math.random());
        this.dailyChallenges = shuffled.slice(0, 3).map(template => ({
            ...template,
            id: `${template.id}_${Date.now()}`,
            progress: 0,
            completed: false,
            expiresAt: new Date().setHours(23, 59, 59, 999)
        }));

        this.dailyChallenges.forEach(challenge => {
            this.activeChallenges.set(challenge.id, challenge);
        });

        localStorage.setItem('last_daily_challenges', today);
        this.saveChallenges();
    }

    generateWeeklyChallenges() {
        const weekStart = this.getWeekStart();
        const lastGenerated = localStorage.getItem('last_weekly_challenges');

        if (lastGenerated === weekStart.toDateString()) {
            // Already generated for this week
            return;
        }

        const challengeTemplates = [
            {
                id: 'weekly_focus_600',
                name: 'Focus Marathon',
                description: 'Complete 10 hours of focused work this week',
                target: 600,
                unit: 'minutes',
                reward: { xp: 500, tokens: 250 },
                type: 'focus'
            },
            {
                id: 'weekly_tasks_50',
                name: 'Productivity Champion',
                description: 'Complete 50 tasks this week',
                target: 50,
                unit: 'tasks',
                reward: { xp: 400, tokens: 200 },
                type: 'tasks'
            },
            {
                id: 'weekly_perfect',
                name: 'Perfect Week',
                description: 'Complete all daily challenges for 7 days',
                target: 7,
                unit: 'days',
                reward: { xp: 1000, tokens: 500 },
                type: 'special'
            }
        ];

        this.weeklyChallenges = challengeTemplates.map(template => ({
            ...template,
            id: `${template.id}_${Date.now()}`,
            progress: 0,
            completed: false,
            expiresAt: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
        }));

        this.weeklyChallenges.forEach(challenge => {
            this.activeChallenges.set(challenge.id, challenge);
        });

        localStorage.setItem('last_weekly_challenges', weekStart.toDateString());
        this.saveChallenges();
    }

    getWeekStart() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(now.setDate(diff));
    }

    startChallengeTimer() {
        // Check challenge expiration every minute
        setInterval(() => {
            this.checkExpiredChallenges();
        }, 60000);

        // Check for new day/week
        setInterval(() => {
            this.generateDailyChallenges();
            this.generateWeeklyChallenges();
        }, 3600000); // Every hour
    }

    checkExpiredChallenges() {
        const now = Date.now();
        
        this.activeChallenges.forEach((challenge, id) => {
            if (challenge.expiresAt < now && !challenge.completed) {
                this.activeChallenges.delete(id);
            }
        });
        
        this.saveChallenges();
    }

    updateProgress(type, amount) {
        this.activeChallenges.forEach((challenge) => {
            if (challenge.type === type && !challenge.completed) {
                challenge.progress = Math.min(challenge.progress + amount, challenge.target);
                
                if (challenge.progress >= challenge.target) {
                    this.completeChallenge(challenge);
                }
            }
        });
        
        this.saveChallenges();
        this.updateChallengeUI();
    }

    completeChallenge(challenge) {
        challenge.completed = true;
        this.completedChallenges.add(challenge.id);
        
        // Award rewards
        this.awardChallengeRewards(challenge);
        
        // Show notification
        if (window.toastManager) {
            window.toastManager.success({
                title: 'Challenge Complete!',
                text: `${challenge.name} - +${challenge.reward.xp} XP`
            });
        }
        
        // Fire event
        document.dispatchEvent(new CustomEvent('challenge-complete', {
            detail: challenge
        }));
    }

    awardChallengeRewards(challenge) {
        // Award XP
        const currentXP = parseInt(localStorage.getItem('user_xp') || '0');
        localStorage.setItem('user_xp', currentXP + challenge.reward.xp);

        // Award tokens
        if (challenge.reward.tokens) {
            const currentTokens = parseInt(localStorage.getItem('user_tokens') || '0');
            localStorage.setItem('user_tokens', currentTokens + challenge.reward.tokens);
        }
    }

    updateChallengeUI() {
        // Update daily challenges
        const dailyContainer = document.getElementById('daily-challenges');
        if (dailyContainer) {
            this.renderChallenges(dailyContainer, this.dailyChallenges);
        }

        // Update weekly challenges
        const weeklyContainer = document.getElementById('weekly-challenges');
        if (weeklyContainer) {
            this.renderChallenges(weeklyContainer, this.weeklyChallenges);
        }
    }

    renderChallenges(container, challenges) {
        container.innerHTML = challenges.map(challenge => {
            const progress = (challenge.progress / challenge.target) * 100;
            
            return `
                <div class="challenge-card ${challenge.completed ? 'completed' : ''}">
                    <div class="challenge-header">
                        <h4 class="challenge-name">${challenge.name}</h4>
                        ${challenge.completed ? '<span class="challenge-badge">✓</span>' : ''}
                    </div>
                    <p class="challenge-description">${challenge.description}</p>
                    <div class="challenge-progress">
                        <div class="challenge-progress-bar">
                            <div class="challenge-progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="challenge-progress-text">
                            ${challenge.progress}/${challenge.target} ${challenge.unit}
                        </span>
                    </div>
                    <div class="challenge-reward">
                        <span class="challenge-xp">+${challenge.reward.xp} XP</span>
                        ${challenge.reward.tokens ? 
                            `<span class="challenge-tokens">+${challenge.reward.tokens} Tokens</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ============================================
// 3. LEADERBOARD SYSTEM
// ============================================

class LeaderboardSystem {
    constructor() {
        this.leaderboards = {
            daily: [],
            weekly: [],
            monthly: [],
            allTime: []
        };
        this.userRank = {};
        this.init();
    }

    init() {
        this.loadLeaderboards();
        this.startAutoRefresh();
    }

    loadLeaderboards() {
        // Load from API or localStorage
        this.fetchLeaderboards();
    }

    async fetchLeaderboards() {
        try {
            // Fetch from API
            const response = await fetch('/.netlify/functions/leaderboard');
            if (response.ok) {
                const data = await response.json();
                this.leaderboards = data.leaderboards;
                this.userRank = data.userRank;
            }
        } catch (error) {
            console.error('Error fetching leaderboards:', error);
            // Use mock data as fallback
            this.generateMockLeaderboard();
        }
    }

    generateMockLeaderboard() {
        const names = ['Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Avery'];
        const generateUsers = (count) => {
            return Array.from({ length: count }, (_, i) => ({
                rank: i + 1,
                username: names[i % names.length] + (Math.floor(i / names.length) || ''),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
                xp: Math.floor(Math.random() * 10000) + 1000,
                level: Math.floor(Math.random() * 50) + 1,
                streak: Math.floor(Math.random() * 100),
                achievements: Math.floor(Math.random() * 30)
            })).sort((a, b) => b.xp - a.xp);
        };

        this.leaderboards = {
            daily: generateUsers(10),
            weekly: generateUsers(20),
            monthly: generateUsers(50),
            allTime: generateUsers(100)
        };
    }

    startAutoRefresh() {
        // Refresh leaderboards every 5 minutes
        setInterval(() => {
            this.fetchLeaderboards();
        }, 300000);
    }

    renderLeaderboard(container, timeframe = 'daily') {
        const leaderboard = this.leaderboards[timeframe] || [];
        
        container.innerHTML = `
            <div class="leaderboard">
                <div class="leaderboard-header">
                    <div class="leaderboard-tabs">
                        ${['daily', 'weekly', 'monthly', 'allTime'].map(tf => `
                            <button class="leaderboard-tab ${tf === timeframe ? 'active' : ''}"
                                    onclick="window.leaderboardSystem.switchTimeframe('${tf}')">
                                ${tf === 'allTime' ? 'All Time' : tf.charAt(0).toUpperCase() + tf.slice(1)}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="leaderboard-list">
                    ${leaderboard.slice(0, 10).map(user => `
                        <div class="leaderboard-item ${user.rank <= 3 ? `rank-${user.rank}` : ''}">
                            <div class="leaderboard-rank">${this.getRankDisplay(user.rank)}</div>
                            <img class="leaderboard-avatar" src="${user.avatar}" alt="${user.username}">
                            <div class="leaderboard-info">
                                <div class="leaderboard-username">${user.username}</div>
                                <div class="leaderboard-stats">
                                    <span>Lvl ${user.level}</span>
                                    <span>${user.xp.toLocaleString()} XP</span>
                                </div>
                            </div>
                            <div class="leaderboard-badges">
                                ${user.streak > 7 ? '<span class="badge-streak">🔥</span>' : ''}
                                ${user.achievements > 20 ? '<span class="badge-achiever">🏆</span>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${this.userRank[timeframe] ? `
                    <div class="leaderboard-user-rank">
                        <div class="leaderboard-item user">
                            <div class="leaderboard-rank">#${this.userRank[timeframe]}</div>
                            <div class="leaderboard-info">Your Rank</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getRankDisplay(rank) {
        switch(rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    }

    switchTimeframe(timeframe) {
        const container = document.querySelector('.leaderboard').parentElement;
        this.renderLeaderboard(container, timeframe);
    }
}

// ============================================
// 4. STREAK SYSTEM
// ============================================

class StreakSystem {
    constructor() {
        this.currentStreak = 0;
        this.longestStreak = 0;
        this.lastActiveDate = null;
        this.streakFreezes = 0;
        this.init();
    }

    init() {
        this.loadStreak();
        this.checkStreak();
        this.startDailyCheck();
    }

    loadStreak() {
        try {
            this.currentStreak = parseInt(localStorage.getItem('current_streak') || '0');
            this.longestStreak = parseInt(localStorage.getItem('longest_streak') || '0');
            this.lastActiveDate = localStorage.getItem('last_active_date');
            this.streakFreezes = parseInt(localStorage.getItem('streak_freezes') || '0');
        } catch (error) {
            console.error('Error loading streak:', error);
        }
    }

    saveStreak() {
        localStorage.setItem('current_streak', this.currentStreak);
        localStorage.setItem('longest_streak', this.longestStreak);
        localStorage.setItem('last_active_date', this.lastActiveDate);
        localStorage.setItem('streak_freezes', this.streakFreezes);
    }

    checkStreak() {
        const today = new Date().toDateString();
        
        if (this.lastActiveDate === today) {
            // Already active today
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        if (this.lastActiveDate === yesterdayString) {
            // Streak continues
            this.incrementStreak();
        } else if (this.lastActiveDate) {
            // Streak broken - check for freeze
            if (this.streakFreezes > 0) {
                // Use a freeze
                this.useStreakFreeze();
            } else {
                // Reset streak
                this.resetStreak();
            }
        }
    }

    incrementStreak() {
        this.currentStreak++;
        this.lastActiveDate = new Date().toDateString();
        
        if (this.currentStreak > this.longestStreak) {
            this.longestStreak = this.currentStreak;
        }
        
        this.saveStreak();
        this.updateStreakUI();
        
        // Fire event
        document.dispatchEvent(new CustomEvent('streak-update', {
            detail: { current: this.currentStreak, longest: this.longestStreak }
        }));
    }

    resetStreak() {
        this.currentStreak = 0;
        this.saveStreak();
        this.updateStreakUI();
        
        // Show notification
        if (window.toastManager) {
            window.toastManager.warning('Streak broken! Start a new one today.');
        }
    }

    useStreakFreeze() {
        this.streakFreezes--;
        this.lastActiveDate = new Date().toDateString();
        this.saveStreak();
        
        // Show notification
        if (window.toastManager) {
            window.toastManager.info(`Streak freeze used! ${this.streakFreezes} remaining.`);
        }
    }

    startDailyCheck() {
        // Check streak at midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow - now;
        
        setTimeout(() => {
            this.checkStreak();
            // Then check every 24 hours
            setInterval(() => {
                this.checkStreak();
            }, 86400000);
        }, msUntilMidnight);
    }

    updateStreakUI() {
        // Update streak display
        const streakElement = document.getElementById('current-streak');
        if (streakElement) {
            streakElement.textContent = this.currentStreak;
        }

        // Update streak flame animation
        const flameElement = document.getElementById('streak-flame');
        if (flameElement) {
            if (this.currentStreak > 0) {
                flameElement.classList.add('active');
                flameElement.style.fontSize = `${Math.min(2 + this.currentStreak * 0.1, 5)}rem`;
            } else {
                flameElement.classList.remove('active');
            }
        }
    }
}

// ============================================
// 5. INITIALIZATION
// ============================================

// Initialize gamification systems when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGamification);
} else {
    initializeGamification();
}

function initializeGamification() {
    // Initialize systems
    window.achievementSystem = new AchievementSystem();
    window.challengeSystem = new ChallengeSystem();
    window.leaderboardSystem = new LeaderboardSystem();
    window.streakSystem = new StreakSystem();
    
    // Add global gamification interface
    window.Gamification = {
        checkAchievements: () => window.achievementSystem.checkAchievements(),
        updateProgress: (type, amount) => window.challengeSystem.updateProgress(type, amount),
        getLeaderboard: (timeframe) => window.leaderboardSystem.leaderboards[timeframe],
        incrementStreak: () => window.streakSystem.incrementStreak(),
        
        // Get all stats
        getStats: () => ({
            achievements: window.achievementSystem.getProgress(),
            challenges: {
                daily: window.challengeSystem.dailyChallenges,
                weekly: window.challengeSystem.weeklyChallenges
            },
            streak: {
                current: window.streakSystem.currentStreak,
                longest: window.streakSystem.longestStreak
            },
            leaderboard: window.leaderboardSystem.userRank
        })
    };
    
    console.log('✅ Enhanced gamification system initialized');
}

// Export for use in other modules
export {
    AchievementSystem,
    ChallengeSystem,
    LeaderboardSystem,
    StreakSystem
};
