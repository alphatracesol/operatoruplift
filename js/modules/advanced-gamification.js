/**
 * Advanced Gamification Module - Phase 2
 * Dynamic achievement system, adaptive difficulty, and advanced rewards
 */

class AdvancedGamification {
    constructor() {
        this.achievementSystem = {};
        this.difficultyScaling = {};
        this.rewardSystem = {};
        this.socialFeatures = {};
        this.adaptiveEngine = {};
        
        this.init();
    }

    init() {
        console.log('🎮 Initializing Advanced Gamification Module');
        this.setupAchievementSystem();
        this.setupDifficultyScaling();
        this.setupRewardSystem();
        this.setupSocialFeatures();
        this.setupAdaptiveEngine();
    }

    // Advanced Achievement System
    setupAchievementSystem() {
        this.achievementSystem = {
            achievements: {
                // Daily Achievements
                daily_login: { name: "Daily Check-in", points: 10, tier: "bronze", category: "daily" },
                daily_task: { name: "Task Master", points: 15, tier: "bronze", category: "daily" },
                daily_goal: { name: "Goal Setter", points: 20, tier: "bronze", category: "daily" },
                
                // Weekly Achievements
                weekly_streak: { name: "Week Warrior", points: 50, tier: "silver", category: "weekly" },
                weekly_goals: { name: "Goal Crusher", points: 75, tier: "silver", category: "weekly" },
                weekly_community: { name: "Social Butterfly", points: 40, tier: "silver", category: "weekly" },
                
                // Monthly Achievements
                monthly_mastery: { name: "Master of Progress", points: 200, tier: "gold", category: "monthly" },
                monthly_consistency: { name: "Consistency King", points: 150, tier: "gold", category: "monthly" },
                monthly_innovation: { name: "Innovation Leader", points: 100, tier: "gold", category: "monthly" },
                
                // Lifetime Achievements
                lifetime_legend: { name: "Living Legend", points: 1000, tier: "diamond", category: "lifetime" },
                lifetime_mentor: { name: "Mentor Supreme", points: 800, tier: "diamond", category: "lifetime" },
                lifetime_creator: { name: "Creator Extraordinaire", points: 600, tier: "diamond", category: "lifetime" }
            },

            userAchievements: {},

            checkAchievement: (achievementId, userData) => {
                const achievement = this.achievementSystem.achievements[achievementId];
                if (!achievement) return null;

                const isEarned = this.evaluateAchievement(achievementId, userData);
                if (isEarned && !this.achievementSystem.userAchievements[achievementId]) {
                    this.achievementSystem.userAchievements[achievementId] = {
                        earnedAt: Date.now(),
                        progress: 100
                    };
                    return achievement;
                }

                return null;
            },

            evaluateAchievement: (achievementId, userData) => {
                const conditions = {
                    daily_login: () => userData.lastLogin && this.isToday(new Date(userData.lastLogin)),
                    daily_task: () => userData.todayTasks && userData.todayTasks.length > 0,
                    daily_goal: () => userData.todayGoals && userData.todayGoals.length > 0,
                    weekly_streak: () => userData.currentStreak >= 7,
                    weekly_goals: () => userData.weeklyGoalsCompleted >= 5,
                    weekly_community: () => userData.weeklySocialInteractions >= 10,
                    monthly_mastery: () => userData.monthlyGoalsCompleted >= 20,
                    monthly_consistency: () => userData.monthlyLoginDays >= 25,
                    monthly_innovation: () => userData.monthlyNewGoals >= 10,
                    lifetime_legend: () => userData.totalPoints >= 10000,
                    lifetime_mentor: () => userData.mentoredUsers >= 50,
                    lifetime_creator: () => userData.createdGoals >= 100
                };

                return conditions[achievementId] ? conditions[achievementId]() : false;
            },

            getAchievementProgress: (achievementId, userData) => {
                const progressCalculators = {
                    daily_login: () => userData.lastLogin && this.isToday(new Date(userData.lastLogin)) ? 100 : 0,
                    daily_task: () => Math.min((userData.todayTasks || 0) * 20, 100),
                    daily_goal: () => Math.min((userData.todayGoals || 0) * 25, 100),
                    weekly_streak: () => Math.min((userData.currentStreak || 0) * 14.28, 100),
                    weekly_goals: () => Math.min((userData.weeklyGoalsCompleted || 0) * 20, 100),
                    weekly_community: () => Math.min((userData.weeklySocialInteractions || 0) * 10, 100),
                    monthly_mastery: () => Math.min((userData.monthlyGoalsCompleted || 0) * 5, 100),
                    monthly_consistency: () => Math.min((userData.monthlyLoginDays || 0) * 4, 100),
                    monthly_innovation: () => Math.min((userData.monthlyNewGoals || 0) * 10, 100),
                    lifetime_legend: () => Math.min((userData.totalPoints || 0) * 0.01, 100),
                    lifetime_mentor: () => Math.min((userData.mentoredUsers || 0) * 2, 100),
                    lifetime_creator: () => Math.min((userData.createdGoals || 0), 100)
                };

                return progressCalculators[achievementId] ? progressCalculators[achievementId]() : 0;
            },

            isToday: (date) => {
                const today = new Date();
                return date.getDate() === today.getDate() &&
                       date.getMonth() === today.getMonth() &&
                       date.getFullYear() === today.getFullYear();
            }
        };
    }

    // Adaptive Difficulty Scaling
    setupDifficultyScaling() {
        this.difficultyScaling = {
            userLevel: 1,
            successRate: 0.5,
            engagement: 0.5,
            adaptationSpeed: 0.1,

            calculateOptimalDifficulty: (userData) => {
                const baseLevel = userData.level || 1;
                const successRate = userData.successRate || 0.5;
                const engagement = userData.engagement || 0.5;
                const streak = userData.currentStreak || 0;

                let difficulty = baseLevel;

                // Adjust based on success rate
                if (successRate > 0.8) {
                    difficulty += 0.2;
                } else if (successRate < 0.3) {
                    difficulty -= 0.2;
                }

                // Adjust based on engagement
                if (engagement > 0.7) {
                    difficulty += 0.1;
                } else if (engagement < 0.3) {
                    difficulty -= 0.1;
                }

                // Adjust based on streak
                if (streak > 7) {
                    difficulty += 0.1;
                } else if (streak < 3) {
                    difficulty -= 0.1;
                }

                return Math.max(0.1, Math.min(10.0, difficulty));
            },

            adjustGoalDifficulty: (goal, userData) => {
                const optimalDifficulty = this.difficultyScaling.calculateOptimalDifficulty(userData);
                
                return {
                    ...goal,
                    difficulty: optimalDifficulty,
                    estimatedTime: Math.round(goal.estimatedTime * (1 / optimalDifficulty)),
                    complexity: this.calculateComplexity(optimalDifficulty),
                    adaptiveFactors: {
                        userLevel: userData.level,
                        successRate: userData.successRate,
                        engagement: userData.engagement,
                        streak: userData.currentStreak
                    }
                };
            },

            calculateComplexity: (difficulty) => {
                if (difficulty < 2) return 'beginner';
                if (difficulty < 4) return 'intermediate';
                if (difficulty < 6) return 'advanced';
                if (difficulty < 8) return 'expert';
                return 'master';
            },

            updateUserMetrics: (userData, newInteraction) => {
                const metrics = {
                    successRate: this.calculateSuccessRate(userData, newInteraction),
                    engagement: this.calculateEngagement(userData, newInteraction),
                    level: this.calculateLevel(userData, newInteraction)
                };

                return {
                    ...userData,
                    ...metrics,
                    lastUpdated: Date.now()
                };
            },

            calculateSuccessRate: (userData, interaction) => {
                const recentInteractions = userData.recentInteractions || [];
                recentInteractions.push(interaction);

                if (recentInteractions.length > 50) {
                    recentInteractions.shift();
                }

                const successful = recentInteractions.filter(i => i.success).length;
                return recentInteractions.length > 0 ? successful / recentInteractions.length : 0.5;
            },

            calculateEngagement: (userData, interaction) => {
                const engagementFactors = {
                    loginFrequency: 0.3,
                    taskCompletion: 0.3,
                    goalCreation: 0.2,
                    socialInteraction: 0.2
                };

                let engagement = 0;
                engagement += (userData.loginFrequency || 0) * engagementFactors.loginFrequency;
                engagement += (userData.taskCompletionRate || 0) * engagementFactors.taskCompletion;
                engagement += (userData.goalCreationRate || 0) * engagementFactors.goalCreation;
                engagement += (userData.socialInteractionRate || 0) * engagementFactors.socialInteraction;

                return Math.min(1.0, Math.max(0.0, engagement));
            },

            calculateLevel: (userData, interaction) => {
                const baseLevel = userData.level || 1;
                const points = userData.totalPoints || 0;
                const experience = userData.experience || 0;

                // Level calculation based on points and experience
                const newLevel = Math.floor(Math.sqrt(points / 100)) + 1;
                return Math.max(baseLevel, newLevel);
            }
        };
    }

    // Advanced Reward System
    setupRewardSystem() {
        this.rewardSystem = {
            rewards: {
                // Point Rewards
                points_small: { type: 'points', value: 10, rarity: 'common' },
                points_medium: { type: 'points', value: 25, rarity: 'uncommon' },
                points_large: { type: 'points', value: 50, rarity: 'rare' },
                points_epic: { type: 'points', value: 100, rarity: 'epic' },
                points_legendary: { type: 'points', value: 250, rarity: 'legendary' },

                // Item Rewards
                energy_boost: { type: 'item', name: 'Energy Boost', effect: 'energy_restore', value: 50, rarity: 'uncommon' },
                streak_protector: { type: 'item', name: 'Streak Protector', effect: 'streak_protection', value: 1, rarity: 'rare' },
                experience_multiplier: { type: 'item', name: 'Experience Multiplier', effect: 'xp_multiplier', value: 2, rarity: 'epic' },
                goal_accelerator: { type: 'item', name: 'Goal Accelerator', effect: 'goal_speed', value: 1.5, rarity: 'legendary' },

                // Ability Rewards
                auto_complete: { type: 'ability', name: 'Auto Complete', effect: 'auto_complete_task', rarity: 'epic' },
                goal_suggestions: { type: 'ability', name: 'Goal Suggestions', effect: 'ai_goal_suggestions', rarity: 'rare' },
                progress_insights: { type: 'ability', name: 'Progress Insights', effect: 'detailed_analytics', rarity: 'uncommon' }
            },

            userRewards: {},

            generateReward: (achievement, userData) => {
                const rewardPool = this.getRewardPool(achievement.tier);
                const selectedReward = this.selectReward(rewardPool, userData);
                
                if (selectedReward) {
                    this.grantReward(selectedReward, userData);
                    return selectedReward;
                }

                return null;
            },

            getRewardPool: (tier) => {
                const tierRewards = {
                    bronze: ['points_small', 'energy_boost'],
                    silver: ['points_medium', 'streak_protector', 'progress_insights'],
                    gold: ['points_large', 'experience_multiplier', 'goal_suggestions'],
                    platinum: ['points_epic', 'goal_accelerator'],
                    diamond: ['points_legendary', 'auto_complete']
                };

                return tierRewards[tier] || tierRewards.bronze;
            },

            selectReward: (rewardPool, userData) => {
                // Weighted selection based on rarity and user needs
                const weightedPool = rewardPool.map(rewardId => {
                    const reward = this.rewardSystem.rewards[rewardId];
                    const weight = this.calculateRewardWeight(reward, userData);
                    return { reward, weight };
                });

                // Sort by weight and select
                weightedPool.sort((a, b) => b.weight - a.weight);
                return weightedPool[0]?.reward || null;
            },

            calculateRewardWeight: (reward, userData) => {
                let weight = 1;

                // Rarity weight
                const rarityWeights = {
                    common: 1,
                    uncommon: 1.5,
                    rare: 2,
                    epic: 3,
                    legendary: 5
                };
                weight *= rarityWeights[reward.rarity] || 1;

                // User need weight
                if (reward.type === 'item') {
                    weight *= this.calculateUserNeed(reward, userData);
                }

                return weight;
            },

            calculateUserNeed: (reward, userData) => {
                const needs = {
                    energy_restore: userData.energy < 50 ? 2 : 1,
                    streak_protection: userData.currentStreak > 5 ? 2 : 1,
                    xp_multiplier: userData.level < 10 ? 1.5 : 1,
                    goal_speed: userData.activeGoals > 3 ? 1.5 : 1
                };

                return needs[reward.effect] || 1;
            },

            grantReward: (reward, userData) => {
                if (!this.rewardSystem.userRewards[reward.type]) {
                    this.rewardSystem.userRewards[reward.type] = [];
                }

                this.rewardSystem.userRewards[reward.type].push({
                    ...reward,
                    grantedAt: Date.now(),
                    id: this.generateRewardId()
                });

                // Apply reward effects
                this.applyRewardEffect(reward, userData);
            },

            applyRewardEffect: (reward, userData) => {
                const effects = {
                    points: () => ({ totalPoints: userData.totalPoints + reward.value }),
                    energy_restore: () => ({ energy: Math.min(100, userData.energy + reward.value) }),
                    streak_protection: () => ({ streakProtection: (userData.streakProtection || 0) + reward.value }),
                    xp_multiplier: () => ({ xpMultiplier: reward.value, xpMultiplierExpiry: Date.now() + 86400000 }),
                    goal_speed: () => ({ goalSpeedMultiplier: reward.value, goalSpeedExpiry: Date.now() + 86400000 })
                };

                const effect = effects[reward.effect];
                if (effect) {
                    const updates = effect();
                    Object.assign(userData, updates);
                }
            },

            generateRewardId: () => {
                return 'reward_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
        };
    }

    // Social Features
    setupSocialFeatures() {
        this.socialFeatures = {
            leaderboards: {
                global: [],
                friends: [],
                category: {},
                weekly: [],
                monthly: []
            },

            challenges: {
                active: [],
                completed: [],
                created: []
            },

            socialInteractions: {
                likes: [],
                comments: [],
                shares: [],
                follows: []
            },

            updateLeaderboard: (userData, leaderboardType = 'global') => {
                const leaderboard = this.socialFeatures.leaderboards[leaderboardType] || [];
                
                const userEntry = {
                    userId: userData.userId,
                    displayName: userData.displayName,
                    points: userData.totalPoints,
                    level: userData.level,
                    achievements: Object.keys(this.achievementSystem.userAchievements).length,
                    lastUpdated: Date.now()
                };

                // Update or add user entry
                const existingIndex = leaderboard.findIndex(entry => entry.userId === userData.userId);
                if (existingIndex >= 0) {
                    leaderboard[existingIndex] = userEntry;
                } else {
                    leaderboard.push(userEntry);
                }

                // Sort by points
                leaderboard.sort((a, b) => b.points - a.points);

                // Keep only top 100
                this.socialFeatures.leaderboards[leaderboardType] = leaderboard.slice(0, 100);
            },

            createChallenge: (challengeData) => {
                const challenge = {
                    id: this.generateChallengeId(),
                    creator: challengeData.creator,
                    title: challengeData.title,
                    description: challengeData.description,
                    type: challengeData.type, // daily, weekly, monthly
                    goal: challengeData.goal,
                    participants: [challengeData.creator],
                    startDate: Date.now(),
                    endDate: this.calculateChallengeEndDate(challengeData.type),
                    rewards: challengeData.rewards,
                    status: 'active'
                };

                this.socialFeatures.challenges.active.push(challenge);
                return challenge;
            },

            joinChallenge: (challengeId, userId) => {
                const challenge = this.socialFeatures.challenges.active.find(c => c.id === challengeId);
                if (challenge && !challenge.participants.includes(userId)) {
                    challenge.participants.push(userId);
                    return true;
                }
                return false;
            },

            generateChallengeId: () => {
                return 'challenge_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            },

            calculateChallengeEndDate: (type) => {
                const now = Date.now();
                const durations = {
                    daily: 86400000,
                    weekly: 604800000,
                    monthly: 2592000000
                };
                return now + (durations[type] || durations.daily);
            }
        };
    }

    // Adaptive Engine
    setupAdaptiveEngine() {
        this.adaptiveEngine = {
            userBehavior: {},
            adaptationRules: {},
            learningRate: 0.1,

            analyzeUserBehavior: (userData, interactions) => {
                const behavior = {
                    preferredTimes: this.analyzePreferredTimes(interactions),
                    goalCategories: this.analyzeGoalCategories(interactions),
                    completionPatterns: this.analyzeCompletionPatterns(interactions),
                    engagementFactors: this.analyzeEngagementFactors(interactions),
                    socialPatterns: this.analyzeSocialPatterns(interactions)
                };

                this.adaptiveEngine.userBehavior = behavior;
                return behavior;
            },

            analyzePreferredTimes: (interactions) => {
                const timeSlots = {
                    morning: 0,
                    afternoon: 0,
                    evening: 0,
                    night: 0
                };

                interactions.forEach(interaction => {
                    const hour = new Date(interaction.timestamp).getHours();
                    if (hour >= 6 && hour < 12) timeSlots.morning++;
                    else if (hour >= 12 && hour < 18) timeSlots.afternoon++;
                    else if (hour >= 18 && hour < 22) timeSlots.evening++;
                    else timeSlots.night++;
                });

                return timeSlots;
            },

            analyzeGoalCategories: (interactions) => {
                const categories = {};
                interactions.forEach(interaction => {
                    if (interaction.goalCategory) {
                        categories[interaction.goalCategory] = (categories[interaction.goalCategory] || 0) + 1;
                    }
                });
                return categories;
            },

            analyzeCompletionPatterns: (interactions) => {
                const patterns = {
                    completionRate: 0,
                    averageTime: 0,
                    difficultyPreference: 0,
                    streakPatterns: []
                };

                const completed = interactions.filter(i => i.success);
                patterns.completionRate = completed.length / interactions.length;

                if (completed.length > 0) {
                    patterns.averageTime = completed.reduce((sum, i) => sum + (i.duration || 0), 0) / completed.length;
                }

                return patterns;
            },

            analyzeEngagementFactors: (interactions) => {
                const factors = {
                    loginFrequency: 0,
                    taskEngagement: 0,
                    socialEngagement: 0,
                    featureUsage: {}
                };

                // Calculate engagement metrics
                const uniqueDays = new Set(interactions.map(i => new Date(i.timestamp).toDateString())).size;
                factors.loginFrequency = uniqueDays / 30; // Assuming 30-day period

                return factors;
            },

            analyzeSocialPatterns: (interactions) => {
                const patterns = {
                    socialInteractions: 0,
                    challengeParticipation: 0,
                    communityEngagement: 0,
                    mentoringActivity: 0
                };

                interactions.forEach(interaction => {
                    if (interaction.type === 'social') patterns.socialInteractions++;
                    if (interaction.type === 'challenge') patterns.challengeParticipation++;
                    if (interaction.type === 'community') patterns.communityEngagement++;
                    if (interaction.type === 'mentoring') patterns.mentoringActivity++;
                });

                return patterns;
            },

            adaptToUserBehavior: (userData) => {
                const behavior = this.adaptiveEngine.userBehavior;
                const adaptations = {};

                // Adapt difficulty based on completion patterns
                if (behavior.completionPatterns.completionRate > 0.8) {
                    adaptations.difficultyAdjustment = 0.1;
                } else if (behavior.completionPatterns.completionRate < 0.4) {
                    adaptations.difficultyAdjustment = -0.1;
                }

                // Adapt rewards based on engagement
                if (behavior.engagementFactors.loginFrequency > 0.8) {
                    adaptations.rewardMultiplier = 1.2;
                } else if (behavior.engagementFactors.loginFrequency < 0.3) {
                    adaptations.rewardMultiplier = 0.8;
                }

                // Adapt social features based on social patterns
                if (behavior.socialPatterns.socialInteractions > 10) {
                    adaptations.socialFeatureBoost = true;
                }

                return adaptations;
            }
        };
    }

    // Public API Methods
    checkAchievements(userData) {
        const earnedAchievements = [];
        
        Object.keys(this.achievementSystem.achievements).forEach(achievementId => {
            const achievement = this.achievementSystem.checkAchievement(achievementId, userData);
            if (achievement) {
                earnedAchievements.push(achievement);
                
                // Generate reward for achievement
                const reward = this.rewardSystem.generateReward(achievement, userData);
                if (reward) {
                    achievement.reward = reward;
                }
            }
        });

        return earnedAchievements;
    }

    getAchievementProgress(userData) {
        const progress = {};
        
        Object.keys(this.achievementSystem.achievements).forEach(achievementId => {
            progress[achievementId] = this.achievementSystem.getAchievementProgress(achievementId, userData);
        });

        return progress;
    }

    adjustGoalDifficulty(goal, userData) {
        return this.difficultyScaling.adjustGoalDifficulty(goal, userData);
    }

    updateUserMetrics(userData, interaction) {
        return this.difficultyScaling.updateUserMetrics(userData, interaction);
    }

    analyzeBehavior(userData, interactions) {
        return this.adaptiveEngine.analyzeUserBehavior(userData, interactions);
    }

    getAdaptations(userData) {
        return this.adaptiveEngine.adaptToUserBehavior(userData);
    }

    updateLeaderboard(userData, type = 'global') {
        return this.socialFeatures.updateLeaderboard(userData, type);
    }

    createChallenge(challengeData) {
        return this.socialFeatures.createChallenge(challengeData);
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.AdvancedGamification = AdvancedGamification;
}

console.log('✅ Advanced Gamification Module loaded'); 