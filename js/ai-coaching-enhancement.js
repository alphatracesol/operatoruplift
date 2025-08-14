/**
 * AI Coaching Enhancement System
 * Personalized coaching with pattern learning and proactive support
 */

window.AICoachingSystem = {
    // User patterns and preferences
    userProfile: {
        patterns: {},
        preferences: {},
        history: [],
        insights: [],
        coachingStyle: 'balanced' // balanced, motivational, analytical, gentle
    },

    // Coaching configurations
    config: {
        dailyTipTime: '09:00',
        weeklyReviewDay: 'Sunday',
        checkInFrequency: 'adaptive', // daily, weekly, adaptive
        learningRate: 0.1,
        minDataPoints: 7
    },

    // Pattern detection thresholds
    patterns: {
        productivity: {
            peakHours: [],
            lowEnergyTimes: [],
            taskCompletionRate: {},
            procrastinationTriggers: []
        },
        wellbeing: {
            moodPatterns: {},
            stressIndicators: [],
            burnoutRisk: 0,
            recoveryNeeds: []
        },
        goals: {
            achievementRate: 0,
            commonObstacles: [],
            motivationDrivers: [],
            abandonmentPatterns: []
        }
    },

    // Initialize AI coaching
    async initialize() {
        this.loadUserProfile();
        await this.analyzeUserPatterns();
        this.setupDailyCoaching();
        this.setupWeeklyReviews();
        this.startPatternLearning();
        this.setupProactiveCheckIns();
    },

    // Load user profile
    loadUserProfile() {
        const saved = localStorage.getItem('aiCoachingProfile');
        if (saved) {
            Object.assign(this.userProfile, JSON.parse(saved));
        }
        
        // Load user data for analysis
        this.userData = {
            tasks: JSON.parse(localStorage.getItem('completedTasks') || '[]'),
            goals: JSON.parse(localStorage.getItem('userGoals') || '[]'),
            moods: JSON.parse(localStorage.getItem('moodHistory') || '{}'),
            sessions: JSON.parse(localStorage.getItem('focusSessions') || '[]'),
            habits: JSON.parse(localStorage.getItem('habitData') || '[]')
        };
    },

    // Save user profile
    saveUserProfile() {
        localStorage.setItem('aiCoachingProfile', JSON.stringify(this.userProfile));
    },

    // Analyze user patterns
    async analyzeUserPatterns() {
        // Productivity patterns
        this.analyzeProductivityPatterns();
        
        // Wellbeing patterns
        this.analyzeWellbeingPatterns();
        
        // Goal patterns
        this.analyzeGoalPatterns();
        
        // Generate insights
        await this.generateInsights();
        
        // Determine optimal coaching style
        this.determineCoachingStyle();
    },

    // Analyze productivity patterns
    analyzeProductivityPatterns() {
        const tasks = this.userData.tasks;
        const sessions = this.userData.sessions;
        
        if (tasks.length < this.config.minDataPoints) return;
        
        // Find peak productivity hours
        const hourlyProductivity = Array(24).fill(0);
        const hourlyCounts = Array(24).fill(0);
        
        tasks.forEach(task => {
            if (task.completedAt) {
                const hour = new Date(task.completedAt).getHours();
                hourlyProductivity[hour]++;
                hourlyCounts[hour]++;
            }
        });
        
        // Calculate averages and find peaks
        const productivityByHour = hourlyProductivity.map((count, hour) => ({
            hour,
            productivity: hourlyCounts[hour] > 0 ? count / hourlyCounts[hour] : 0
        }));
        
        // Sort and get top 3 peak hours
        this.patterns.productivity.peakHours = productivityByHour
            .sort((a, b) => b.productivity - a.productivity)
            .slice(0, 3)
            .map(p => p.hour);
        
        // Identify low energy times
        this.patterns.productivity.lowEnergyTimes = productivityByHour
            .filter(p => p.productivity < 0.3)
            .map(p => p.hour);
        
        // Task completion patterns by category
        const categoryCompletion = {};
        tasks.forEach(task => {
            const category = task.category || 'Other';
            if (!categoryCompletion[category]) {
                categoryCompletion[category] = { completed: 0, total: 0 };
            }
            categoryCompletion[category].completed++;
            categoryCompletion[category].total++;
        });
        
        this.patterns.productivity.taskCompletionRate = categoryCompletion;
        
        // Identify procrastination triggers
        const incompleteTasks = JSON.parse(localStorage.getItem('userTasks') || '[]')
            .filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date());
        
        if (incompleteTasks.length > 0) {
            const triggers = {};
            incompleteTasks.forEach(task => {
                const category = task.category || 'Other';
                triggers[category] = (triggers[category] || 0) + 1;
            });
            
            this.patterns.productivity.procrastinationTriggers = Object.entries(triggers)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([trigger]) => trigger);
        }
    },

    // Analyze wellbeing patterns
    analyzeWellbeingPatterns() {
        const moods = Object.values(this.userData.moods);
        
        if (moods.length < this.config.minDataPoints) return;
        
        // Mood patterns by day of week
        const moodByDay = {};
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        moods.forEach(mood => {
            const day = new Date(mood.date).getDay();
            const dayName = dayNames[day];
            
            if (!moodByDay[dayName]) {
                moodByDay[dayName] = { total: 0, count: 0 };
            }
            
            moodByDay[dayName].total += mood.value;
            moodByDay[dayName].count++;
        });
        
        // Calculate averages
        Object.keys(moodByDay).forEach(day => {
            moodByDay[day] = moodByDay[day].total / moodByDay[day].count;
        });
        
        this.patterns.wellbeing.moodPatterns = moodByDay;
        
        // Identify stress indicators
        const lowMoods = moods.filter(m => m.value <= 2);
        const stressFactors = {};
        
        lowMoods.forEach(mood => {
            if (mood.factors) {
                mood.factors.forEach(factor => {
                    stressFactors[factor] = (stressFactors[factor] || 0) + 1;
                });
            }
        });
        
        this.patterns.wellbeing.stressIndicators = Object.entries(stressFactors)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([factor]) => factor);
        
        // Calculate burnout risk
        const recentMoods = moods.slice(-14); // Last 2 weeks
        const avgRecentMood = recentMoods.reduce((sum, m) => sum + m.value, 0) / recentMoods.length;
        const lowMoodStreak = this.calculateLowMoodStreak(recentMoods);
        
        this.patterns.wellbeing.burnoutRisk = this.calculateBurnoutRisk(avgRecentMood, lowMoodStreak);
    },

    // Analyze goal patterns
    analyzeGoalPatterns() {
        const goals = this.userData.goals;
        
        if (goals.length === 0) return;
        
        const completed = goals.filter(g => g.completed);
        const abandoned = goals.filter(g => g.abandoned);
        
        // Achievement rate
        this.patterns.goals.achievementRate = goals.length > 0 
            ? (completed.length / goals.length) * 100 
            : 0;
        
        // Common obstacles (from abandoned goals)
        const obstacles = {};
        abandoned.forEach(goal => {
            const category = goal.category || 'Other';
            obstacles[category] = (obstacles[category] || 0) + 1;
        });
        
        this.patterns.goals.commonObstacles = Object.entries(obstacles)
            .sort((a, b) => b[1] - a[1])
            .map(([obstacle]) => obstacle);
        
        // Motivation drivers (from completed goals)
        const drivers = {};
        completed.forEach(goal => {
            if (goal.motivationTags) {
                goal.motivationTags.forEach(tag => {
                    drivers[tag] = (drivers[tag] || 0) + 1;
                });
            }
        });
        
        this.patterns.goals.motivationDrivers = Object.entries(drivers)
            .sort((a, b) => b[1] - a[1])
            .map(([driver]) => driver);
    },

    // Generate AI insights
    async generateInsights() {
        const insights = [];
        
        // Productivity insights
        if (this.patterns.productivity.peakHours.length > 0) {
            const peakHour = this.patterns.productivity.peakHours[0];
            insights.push({
                type: 'productivity',
                title: 'Peak Performance Time',
                message: `You're most productive at ${peakHour}:00. Schedule important tasks during this time.`,
                actionable: true,
                action: () => this.scheduleTaskAtPeakTime()
            });
        }
        
        // Wellbeing insights
        if (this.patterns.wellbeing.burnoutRisk > 0.7) {
            insights.push({
                type: 'wellbeing',
                priority: 'high',
                title: 'Burnout Risk Detected',
                message: 'Your recent patterns suggest high stress. Consider taking breaks and practicing self-care.',
                actionable: true,
                action: () => this.suggestWellbeingActivities()
            });
        }
        
        // Goal insights
        if (this.patterns.goals.achievementRate < 50) {
            insights.push({
                type: 'goals',
                title: 'Goal Setting Adjustment',
                message: 'Your goal completion rate is low. Try breaking goals into smaller, more manageable tasks.',
                actionable: true,
                action: () => this.suggestGoalBreakdown()
            });
        }
        
        // Use AI for personalized insights if available
        if (window.AIIntegration) {
            const aiInsight = await this.getAIPersonalizedInsight();
            if (aiInsight) {
                insights.push(aiInsight);
            }
        }
        
        this.userProfile.insights = insights;
        this.saveUserProfile();
    },

    // Get AI personalized insight
    async getAIPersonalizedInsight() {
        if (!window.AIIntegration) return null;
        
        const context = {
            productivity: this.patterns.productivity,
            wellbeing: this.patterns.wellbeing,
            goals: this.patterns.goals,
            recentActivity: this.userProfile.history.slice(-7)
        };
        
        const prompt = `Based on this user data: ${JSON.stringify(context)}, 
        provide one specific, actionable coaching insight. 
        Focus on the most impactful improvement area.`;
        
        try {
            const response = await window.AIIntegration.requestAdvice(prompt);
            return {
                type: 'ai',
                title: 'Personalized Insight',
                message: response,
                source: 'AI Coach'
            };
        } catch (error) {
            console.error('Failed to get AI insight:', error);
            return null;
        }
    },

    // Determine coaching style
    determineCoachingStyle() {
        const { productivity, wellbeing, goals } = this.patterns;
        
        // Analyze user needs
        const needsMotivation = goals.achievementRate < 60;
        const needsAnalysis = productivity.procrastinationTriggers.length > 2;
        const needsSupport = wellbeing.burnoutRisk > 0.5;
        
        if (needsSupport) {
            this.userProfile.coachingStyle = 'gentle';
        } else if (needsMotivation) {
            this.userProfile.coachingStyle = 'motivational';
        } else if (needsAnalysis) {
            this.userProfile.coachingStyle = 'analytical';
        } else {
            this.userProfile.coachingStyle = 'balanced';
        }
        
        this.saveUserProfile();
    },

    // Setup daily coaching
    setupDailyCoaching() {
        // Schedule daily tip
        this.scheduleDailyTip();
        
        // Check every hour if it's time for daily tip
        setInterval(() => {
            const now = new Date();
            const tipTime = this.config.dailyTipTime.split(':');
            
            if (now.getHours() == tipTime[0] && now.getMinutes() == tipTime[1]) {
                this.sendDailyTip();
            }
        }, 60000); // Check every minute
    },

    // Schedule daily tip
    scheduleDailyTip() {
        const now = new Date();
        const [hours, minutes] = this.config.dailyTipTime.split(':').map(Number);
        const scheduledTime = new Date(now);
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        if (scheduledTime <= now) {
            // Schedule for tomorrow
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
        
        const delay = scheduledTime - now;
        setTimeout(() => {
            this.sendDailyTip();
            // Schedule next day
            setInterval(() => this.sendDailyTip(), 24 * 60 * 60 * 1000);
        }, delay);
    },

    // Send daily tip
    async sendDailyTip() {
        const tip = await this.generateDailyTip();
        
        // Send notification
        if (window.NotificationSystem) {
            window.NotificationSystem.send(
                '💡 Daily Coaching Tip',
                tip.message,
                {
                    category: 'progress',
                    data: { tip }
                }
            );
        }
        
        // Show in-app
        this.showCoachingCard(tip);
        
        // Track tip
        this.trackCoachingInteraction('daily_tip', tip);
    },

    // Generate daily tip
    async generateDailyTip() {
        const style = this.userProfile.coachingStyle;
        const patterns = this.patterns;
        
        // Generate contextual tip based on patterns
        const tips = {
            gentle: [
                "Remember to take breaks. Your wellbeing is just as important as productivity.",
                "You're doing great! Every small step counts toward your goals.",
                "Be kind to yourself today. Progress isn't always linear."
            ],
            motivational: [
                "You've got this! Today is your day to shine!",
                "Challenge yourself to beat yesterday's performance!",
                "Success is the sum of small efforts repeated daily!"
            ],
            analytical: [
                `Based on your patterns, you complete ${Math.round(patterns.goals.achievementRate)}% of goals. Let's improve that by 10% this week.`,
                `Your peak productivity is at ${patterns.productivity.peakHours[0]}:00. Use this time for your most important task.`,
                "Data shows you're most consistent on weekdays. Try maintaining momentum on weekends."
            ],
            balanced: [
                "Focus on progress, not perfection today.",
                "What's one thing you can do today to move closer to your goals?",
                "Remember: consistency beats intensity every time."
            ]
        };
        
        const styleTips = tips[style] || tips.balanced;
        let message = styleTips[Math.floor(Math.random() * styleTips.length)];
        
        // Get AI-enhanced tip if available
        if (window.AIIntegration) {
            try {
                const aiTip = await window.AIIntegration.requestMotivation();
                if (aiTip) {
                    message = aiTip;
                }
            } catch (error) {
                console.error('Failed to get AI tip:', error);
            }
        }
        
        return {
            message,
            style,
            timestamp: new Date().toISOString(),
            context: this.getCurrentContext()
        };
    },

    // Setup weekly reviews
    setupWeeklyReviews() {
        // Calculate next review date
        const nextReview = this.getNextReviewDate();
        const delay = nextReview - new Date();
        
        setTimeout(() => {
            this.generateWeeklyReview();
            // Schedule weekly
            setInterval(() => this.generateWeeklyReview(), 7 * 24 * 60 * 60 * 1000);
        }, delay);
    },

    // Get next review date
    getNextReviewDate() {
        const dayMap = {
            'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
            'Thursday': 4, 'Friday': 5, 'Saturday': 6
        };
        
        const targetDay = dayMap[this.config.weeklyReviewDay];
        const now = new Date();
        const currentDay = now.getDay();
        
        let daysUntilReview = targetDay - currentDay;
        if (daysUntilReview <= 0) {
            daysUntilReview += 7;
        }
        
        const reviewDate = new Date(now);
        reviewDate.setDate(reviewDate.getDate() + daysUntilReview);
        reviewDate.setHours(18, 0, 0, 0); // 6 PM
        
        return reviewDate;
    },

    // Generate weekly review
    async generateWeeklyReview() {
        const review = {
            period: this.getWeekPeriod(),
            metrics: this.calculateWeeklyMetrics(),
            achievements: this.getWeeklyAchievements(),
            challenges: this.getWeeklyChallenges(),
            recommendations: await this.generateWeeklyRecommendations(),
            nextWeekFocus: this.suggestNextWeekFocus()
        };
        
        // Create review report
        const report = this.formatWeeklyReview(review);
        
        // Send notification
        if (window.NotificationSystem) {
            window.NotificationSystem.send(
                '📊 Your Weekly Review is Ready',
                'Check out your progress and recommendations for next week',
                {
                    category: 'progress',
                    data: { review }
                }
            );
        }
        
        // Show review modal
        this.showWeeklyReviewModal(report);
        
        // Save review
        this.saveWeeklyReview(review);
    },

    // Calculate weekly metrics
    calculateWeeklyMetrics() {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        
        // Tasks completed
        const tasksCompleted = this.userData.tasks.filter(t => 
            new Date(t.completedAt) >= weekStart
        ).length;
        
        // Goals progress
        const goalsCompleted = this.userData.goals.filter(g => 
            g.completed && new Date(g.completedAt) >= weekStart
        ).length;
        
        // Focus time
        const focusMinutes = this.userData.sessions
            .filter(s => new Date(s.startTime) >= weekStart)
            .reduce((total, session) => {
                const duration = session.endTime 
                    ? (new Date(session.endTime) - new Date(session.startTime)) / 60000
                    : 0;
                return total + duration;
            }, 0);
        
        // Mood average
        const weekMoods = Object.values(this.userData.moods)
            .filter(m => new Date(m.date) >= weekStart);
        const avgMood = weekMoods.length > 0
            ? weekMoods.reduce((sum, m) => sum + m.value, 0) / weekMoods.length
            : 0;
        
        return {
            tasksCompleted,
            goalsCompleted,
            focusHours: (focusMinutes / 60).toFixed(1),
            avgMood: avgMood.toFixed(1),
            consistency: this.calculateWeeklyConsistency()
        };
    },

    // Setup proactive check-ins
    setupProactiveCheckIns() {
        // Monitor user activity
        this.monitorActivity();
        
        // Check for intervention opportunities
        setInterval(() => {
            this.checkInterventionNeeded();
        }, 30 * 60 * 1000); // Every 30 minutes
    },

    // Monitor user activity
    monitorActivity() {
        // Track various events
        const events = [
            'taskCompleted',
            'taskAbandoned',
            'goalCompleted',
            'moodLogged',
            'focusSessionEnd',
            'streakBroken'
        ];
        
        events.forEach(event => {
            document.addEventListener(event, (e) => {
                this.handleActivityEvent(event, e.detail);
            });
        });
    },

    // Handle activity event
    handleActivityEvent(event, data) {
        // Update patterns in real-time
        this.updatePatterns(event, data);
        
        // Check if intervention needed
        if (this.shouldIntervene(event, data)) {
            this.provideProactiveSupport(event, data);
        }
        
        // Track for learning
        this.trackCoachingInteraction(event, data);
    },

    // Check if intervention needed
    checkInterventionNeeded() {
        const now = new Date();
        const hour = now.getHours();
        
        // Check various conditions
        const conditions = [
            {
                check: () => this.hasBeenInactiveToday(),
                intervention: () => this.sendInactivityReminder()
            },
            {
                check: () => this.isApproachingDeadline(),
                intervention: () => this.sendDeadlineReminder()
            },
            {
                check: () => this.detectsLowEnergy(),
                intervention: () => this.suggestEnergyBoost()
            },
            {
                check: () => this.detectsProcrastination(),
                intervention: () => this.offerProcrastinationHelp()
            }
        ];
        
        conditions.forEach(condition => {
            if (condition.check()) {
                condition.intervention();
            }
        });
    },

    // Provide proactive support
    async provideProactiveSupport(trigger, context) {
        const support = await this.generateContextualSupport(trigger, context);
        
        // Show coaching message
        this.showCoachingMessage(support);
        
        // Log interaction
        this.trackCoachingInteraction('proactive_support', {
            trigger,
            context,
            support
        });
    },

    // Generate contextual support
    async generateContextualSupport(trigger, context) {
        const supportTemplates = {
            taskAbandoned: {
                title: "Need help with this task?",
                message: "Breaking it into smaller steps might help. Would you like me to suggest a breakdown?",
                action: () => this.suggestTaskBreakdown(context)
            },
            streakBroken: {
                title: "Don't worry about the streak",
                message: "What matters is getting back on track. You've got this!",
                action: () => this.offerStreakRecovery()
            },
            lowMood: {
                title: "I noticed you're feeling down",
                message: "Would you like some suggestions for mood-boosting activities?",
                action: () => this.suggestMoodBoosters()
            },
            highStress: {
                title: "Stress levels seem high",
                message: "A quick breathing exercise might help. Want to try?",
                action: () => window.MoodTrackingSystem?.startBreathingExercise()
            }
        };
        
        let support = supportTemplates[trigger] || {
            title: "Here to help",
            message: "How can I support you right now?"
        };
        
        // Enhance with AI if available
        if (window.AIIntegration) {
            try {
                const aiSupport = await window.AIIntegration.requestAdvice(
                    `User trigger: ${trigger}, context: ${JSON.stringify(context)}. Provide brief supportive message.`
                );
                if (aiSupport) {
                    support.message = aiSupport;
                }
            } catch (error) {
                console.error('Failed to get AI support:', error);
            }
        }
        
        return support;
    },

    // Show coaching card
    showCoachingCard(content) {
        const card = document.createElement('div');
        card.className = 'coaching-card';
        card.innerHTML = `
            <div class="coaching-card-content">
                <div class="coaching-icon">🤖</div>
                <div class="coaching-message">
                    <h4>${content.title || 'AI Coach'}</h4>
                    <p>${content.message}</p>
                    ${content.action ? `
                        <button class="coaching-action" onclick="AICoachingSystem.executeAction('${content.actionId}')">
                            ${content.actionText || 'Take Action'}
                        </button>
                    ` : ''}
                </div>
                <button class="coaching-close" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        
        card.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 400px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(card);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (card.parentElement) {
                card.style.animation = 'slideDown 0.3s ease';
                setTimeout(() => card.remove(), 300);
            }
        }, 10000);
    },

    // Show coaching message (quick tooltip)
    showCoachingMessage(content) {
        if (window.showToast) {
            window.showToast(content.message, 'info');
        }
    },

    // Track coaching interaction
    trackCoachingInteraction(type, data) {
        const interaction = {
            type,
            data,
            timestamp: new Date().toISOString(),
            response: null // Will be filled if user responds
        };
        
        this.userProfile.history.push(interaction);
        
        // Keep only last 100 interactions
        if (this.userProfile.history.length > 100) {
            this.userProfile.history = this.userProfile.history.slice(-100);
        }
        
        this.saveUserProfile();
        
        // Learn from interaction
        this.learnFromInteraction(interaction);
    },

    // Learn from interaction
    learnFromInteraction(interaction) {
        // Update patterns based on interaction
        if (interaction.response) {
            // Positive response - reinforce pattern
            if (interaction.response === 'helpful') {
                this.reinforcePattern(interaction.type);
            }
            // Negative response - adjust pattern
            else if (interaction.response === 'not_helpful') {
                this.adjustPattern(interaction.type);
            }
        }
    },

    // Helper functions
    calculateLowMoodStreak(moods) {
        let streak = 0;
        for (let i = moods.length - 1; i >= 0; i--) {
            if (moods[i].value <= 2) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    },

    calculateBurnoutRisk(avgMood, lowMoodStreak) {
        let risk = 0;
        
        // Mood component (40%)
        risk += (5 - avgMood) / 5 * 0.4;
        
        // Streak component (30%)
        risk += Math.min(lowMoodStreak / 7, 1) * 0.3;
        
        // Workload component (30%)
        const recentTasks = this.userData.tasks.filter(t => 
            new Date(t.completedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length;
        
        if (recentTasks > 50) {
            risk += 0.3;
        } else if (recentTasks < 10) {
            risk += 0.1; // Low activity can also indicate burnout
        }
        
        return Math.min(risk, 1);
    },

    calculateWeeklyConsistency() {
        const days = 7;
        let activeDays = 0;
        
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Check if any activity on this day
            const hadActivity = this.userData.tasks.some(t => 
                t.completedAt && t.completedAt.startsWith(dateStr)
            );
            
            if (hadActivity) activeDays++;
        }
        
        return (activeDays / days * 100).toFixed(0);
    },

    getCurrentContext() {
        return {
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay(),
            currentStreak: parseInt(localStorage.getItem('currentStreak') || '0'),
            energyLevel: window.EnergySystem?.currentEnergy || 100,
            activeGoals: this.userData.goals.filter(g => !g.completed).length
        };
    },

    getWeekPeriod() {
        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 7);
        
        return {
            start: start.toLocaleDateString(),
            end: end.toLocaleDateString()
        };
    },

    // More helper functions...
    hasBeenInactiveToday() {
        const today = new Date().toISOString().split('T')[0];
        return !this.userData.tasks.some(t => 
            t.completedAt && t.completedAt.startsWith(today)
        );
    },

    isApproachingDeadline() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return this.userData.goals.some(g => 
            !g.completed && g.dueDate && 
            new Date(g.dueDate) <= tomorrow
        );
    },

    detectsLowEnergy() {
        return window.EnergySystem?.currentEnergy < 30;
    },

    detectsProcrastination() {
        // Check if tasks are being postponed repeatedly
        const postponedTasks = JSON.parse(localStorage.getItem('postponedTasks') || '[]');
        return postponedTasks.length > 3;
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AICoachingSystem.initialize());
} else {
    window.AICoachingSystem.initialize();
}
