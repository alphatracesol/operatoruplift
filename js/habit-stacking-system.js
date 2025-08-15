/**
 * Habit Stacking System
 * Chain habits together for compound benefits
 */

window.HabitStackingSystem = {
    // Habit templates library
    templates: {
        morning: {
            id: 'morning_routine',
            name: 'Morning Power Stack',
            icon: '🌅',
            habits: [
                { name: 'Make bed', duration: 2, difficulty: 'easy', energy: 1 },
                { name: 'Drink water', duration: 1, difficulty: 'easy', energy: 1 },
                { name: 'Stretch', duration: 5, difficulty: 'easy', energy: 2 },
                { name: 'Meditate', duration: 10, difficulty: 'medium', energy: 3 },
                { name: 'Journal', duration: 10, difficulty: 'medium', energy: 2 }
            ]
        },
        evening: {
            id: 'evening_routine',
            name: 'Evening Wind-Down',
            icon: '🌙',
            habits: [
                { name: 'Review day', duration: 5, difficulty: 'easy', energy: 2 },
                { name: 'Plan tomorrow', duration: 10, difficulty: 'medium', energy: 3 },
                { name: 'Read', duration: 20, difficulty: 'easy', energy: 2 },
                { name: 'Gratitude', duration: 5, difficulty: 'easy', energy: 1 },
                { name: 'No screens', duration: 30, difficulty: 'hard', energy: 0 }
            ]
        },
        productivity: {
            id: 'productivity_stack',
            name: 'Deep Work Stack',
            icon: '💻',
            habits: [
                { name: 'Clear desk', duration: 5, difficulty: 'easy', energy: 2 },
                { name: 'Review goals', duration: 5, difficulty: 'easy', energy: 2 },
                { name: 'Time block', duration: 5, difficulty: 'medium', energy: 3 },
                { name: 'Deep work', duration: 90, difficulty: 'hard', energy: 10 },
                { name: 'Break', duration: 15, difficulty: 'easy', energy: -5 }
            ]
        },
        health: {
            id: 'health_stack',
            name: 'Wellness Stack',
            icon: '💪',
            habits: [
                { name: 'Vitamins', duration: 1, difficulty: 'easy', energy: 1 },
                { name: 'Exercise', duration: 30, difficulty: 'hard', energy: 8 },
                { name: 'Healthy meal', duration: 20, difficulty: 'medium', energy: -3 },
                { name: 'Walk', duration: 15, difficulty: 'easy', energy: 2 },
                { name: 'Hydrate', duration: 1, difficulty: 'easy', energy: 1 }
            ]
        }
    },

    // User's habit stacks
    userStacks: [],

    // Habit tracking data
    habitData: {
        completions: {},
        streaks: {},
        insights: []
    },

    // Difficulty multipliers
    difficultyMultipliers: {
        easy: 1,
        medium: 1.5,
        hard: 2
    },

    // Initialize system
    initialize() {
        this.loadUserData();
        this.setupDailyHabits();
        this.setupEventListeners();
        this.checkHabitReminders();
    },

    // Load user data
    loadUserData() {
        const stacks = localStorage.getItem('habitStacks');
        if (stacks) {
            this.userStacks = JSON.parse(stacks);
        }
        
        const data = localStorage.getItem('habitTrackingData');
        if (data) {
            Object.assign(this.habitData, JSON.parse(data));
        }
    },

    // Save user data
    saveUserData() {
        localStorage.setItem('habitStacks', JSON.stringify(this.userStacks));
        localStorage.setItem('habitTrackingData', JSON.stringify(this.habitData));
    },

    // Create custom habit stack
    createHabitStack(name, habits, schedule = null) {
        const stack = {
            id: `stack_${Date.now()}`,
            name: name,
            habits: habits,
            schedule: schedule, // { time: '07:00', days: [1,2,3,4,5] }
            createdAt: new Date().toISOString(),
            totalCompletions: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastCompleted: null,
            active: true
        };
        
        this.userStacks.push(stack);
        this.saveUserData();
        
        // Set up reminders if scheduled
        if (schedule) {
            this.scheduleStackReminder(stack);
        }
        
        window.showToast(`Habit stack "${name}" created!`, 'success');
        return stack;
    },

    // Create stack from template
    createFromTemplate(templateId) {
        const template = this.templates[templateId];
        if (!template) return;
        
        return this.createHabitStack(
            template.name,
            template.habits,
            this.getDefaultSchedule(templateId)
        );
    },

    // Start habit stack
    startHabitStack(stackId) {
        const stack = this.userStacks.find(s => s.id === stackId);
        if (!stack) return;
        
        // Create session
        const session = {
            id: `session_${Date.now()}`,
            stackId: stackId,
            startTime: Date.now(),
            habits: stack.habits.map(h => ({
                ...h,
                completed: false,
                startedAt: null,
                completedAt: null
            })),
            currentHabitIndex: 0,
            totalDuration: stack.habits.reduce((sum, h) => sum + h.duration, 0),
            status: 'active'
        };
        
        // Store active session
        localStorage.setItem('activeHabitSession', JSON.stringify(session));
        
        // Show habit stack UI
        this.showHabitStackUI(session);
        
        // Start first habit
        this.startNextHabit(session);
        
        return session;
    },

    // Start next habit in stack
    startNextHabit(session) {
        if (session.currentHabitIndex >= session.habits.length) {
            this.completeHabitStack(session);
            return;
        }
        
        const habit = session.habits[session.currentHabitIndex];
        habit.startedAt = Date.now();
        
        // Check energy requirement
        if (window.EnergySystem && habit.energy > 0) {
            if (!window.EnergySystem.consumeEnergy(habit.energy)) {
                window.showToast('Not enough energy for this habit!', 'error');
                this.pauseHabitStack(session);
                return;
            }
        }
        
        // Update UI
        this.updateHabitStackUI(session);
        
        // Set timer for habit duration
        this.startHabitTimer(habit, session);
        
        // Show habit guidance
        this.showHabitGuidance(habit);
    },

    // Complete current habit
    completeHabit(sessionId, habitIndex) {
        const sessionStr = localStorage.getItem('activeHabitSession');
        if (!sessionStr) return;
        
        const session = JSON.parse(sessionStr);
        if (session.id !== sessionId || habitIndex !== session.currentHabitIndex) return;
        
        const habit = session.habits[habitIndex];
        habit.completed = true;
        habit.completedAt = Date.now();
        
        // Award points
        const points = this.calculateHabitPoints(habit);
        this.awardPoints(points);
        
        // Show completion animation
        this.showCompletionAnimation(habit);
        
        // Track completion
        this.trackHabitCompletion(habit);
        
        // Move to next habit
        session.currentHabitIndex++;
        localStorage.setItem('activeHabitSession', JSON.stringify(session));
        
        // Start next habit after short break
        setTimeout(() => {
            this.startNextHabit(session);
        }, 2000);
    },

    // Complete entire habit stack
    completeHabitStack(session) {
        const stack = this.userStacks.find(s => s.id === session.stackId);
        if (!stack) return;
        
        // Update stack stats
        stack.totalCompletions++;
        stack.lastCompleted = new Date().toISOString();
        
        // Update streak
        const lastDate = stack.lastCompleted ? new Date(stack.lastCompleted) : null;
        const today = new Date();
        const daysSince = lastDate ? Math.floor((today - lastDate) / (1000 * 60 * 60 * 24)) : 0;
        
        if (daysSince <= 1) {
            stack.currentStreak++;
            if (stack.currentStreak > stack.bestStreak) {
                stack.bestStreak = stack.currentStreak;
            }
        } else {
            stack.currentStreak = 1;
        }
        
        // Calculate total rewards
        const totalPoints = session.habits.reduce((sum, h) => 
            sum + (h.completed ? this.calculateHabitPoints(h) : 0), 0
        );
        
        const bonusPoints = Math.floor(totalPoints * 0.2); // 20% bonus for completing stack
        this.awardPoints(bonusPoints);
        
        // Save data
        this.saveUserData();
        
        // Clear session
        localStorage.removeItem('activeHabitSession');
        
        // Show completion celebration
        this.showStackCompletionCelebration(stack, totalPoints + bonusPoints);
        
        // Generate insights
        this.generateHabitInsights(session);
        
        // Check achievements
        this.checkHabitAchievements(stack);
    },

    // Calculate habit points
    calculateHabitPoints(habit) {
        const basePoints = 10;
        const difficultyBonus = this.difficultyMultipliers[habit.difficulty] || 1;
        const durationBonus = Math.floor(habit.duration / 10);
        
        return Math.floor(basePoints * difficultyBonus + durationBonus);
    },

    // Show habit stack UI
    showHabitStackUI(session) {
        const modal = document.createElement('div');
        modal.id = 'habitStackModal';
        modal.className = 'habit-stack-modal';
        modal.innerHTML = `
            <div class="habit-stack-content">
                <div class="stack-header">
                    <h2>${this.getStackName(session.stackId)}</h2>
                    <button class="close-btn" onclick="HabitStackingSystem.pauseHabitStack()">×</button>
                </div>
                
                <div class="habit-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="stackProgress" style="width: 0%"></div>
                    </div>
                    <span class="progress-text">
                        <span id="currentHabitIndex">0</span>/${session.habits.length} habits
                    </span>
                </div>
                
                <div class="current-habit" id="currentHabitDisplay">
                    <!-- Current habit will be shown here -->
                </div>
                
                <div class="habit-list">
                    ${session.habits.map((habit, index) => `
                        <div class="habit-item ${index === 0 ? 'active' : ''}" id="habit_${index}">
                            <span class="habit-status">
                                ${habit.completed ? '✅' : index === session.currentHabitIndex ? '⏳' : '⭕'}
                            </span>
                            <span class="habit-name">${habit.name}</span>
                            <span class="habit-duration">${habit.duration}m</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="stack-actions">
                    <button class="btn btn-primary" id="completeHabitBtn" onclick="HabitStackingSystem.completeCurrentHabit()">
                        Complete Habit
                    </button>
                    <button class="btn btn-secondary" onclick="HabitStackingSystem.skipHabit()">
                        Skip
                    </button>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.8);
        `;
        
        document.body.appendChild(modal);
    },

    // Update habit stack UI
    updateHabitStackUI(session) {
        const progressBar = document.getElementById('stackProgress');
        const currentIndex = document.getElementById('currentHabitIndex');
        const currentDisplay = document.getElementById('currentHabitDisplay');
        
        if (progressBar) {
            const progress = (session.currentHabitIndex / session.habits.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        if (currentIndex) {
            currentIndex.textContent = session.currentHabitIndex + 1;
        }
        
        if (currentDisplay && session.currentHabitIndex < session.habits.length) {
            const habit = session.habits[session.currentHabitIndex];
            currentDisplay.innerHTML = `
                <h3>${habit.name}</h3>
                <div class="habit-details">
                    <span>Duration: ${habit.duration} minutes</span>
                    <span>Difficulty: ${habit.difficulty}</span>
                    <span>Energy: ${habit.energy}</span>
                </div>
                <div class="habit-timer" id="habitTimer">
                    <span class="timer-display">00:00</span>
                </div>
            `;
        }
        
        // Update habit list
        document.querySelectorAll('.habit-item').forEach((item, index) => {
            item.classList.remove('active');
            if (index === session.currentHabitIndex) {
                item.classList.add('active');
            }
            
            const status = item.querySelector('.habit-status');
            if (session.habits[index].completed) {
                status.textContent = '✅';
            } else if (index === session.currentHabitIndex) {
                status.textContent = '⏳';
            }
        });
    },

    // Start habit timer
    startHabitTimer(habit, session) {
        const duration = habit.duration * 60; // Convert to seconds
        let elapsed = 0;
        
        this.currentTimer = setInterval(() => {
            elapsed++;
            const remaining = duration - elapsed;
            
            const display = document.getElementById('habitTimer');
            if (display) {
                const minutes = Math.floor(remaining / 60);
                const seconds = remaining % 60;
                display.querySelector('.timer-display').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (remaining <= 0) {
                clearInterval(this.currentTimer);
                this.onHabitTimerComplete(session);
            }
        }, 1000);
    },

    // Show completion animation
    showCompletionAnimation(habit) {
        const animation = document.createElement('div');
        animation.className = 'habit-completion-animation';
        animation.innerHTML = `
            <div class="completion-content">
                <div class="checkmark">✓</div>
                <h3>${habit.name} Complete!</h3>
                <p>+${this.calculateHabitPoints(habit)} points</p>
            </div>
        `;
        
        animation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            animation: completionPulse 1s ease;
        `;
        
        document.body.appendChild(animation);
        
        setTimeout(() => animation.remove(), 2000);
    },

    // Show stack completion celebration
    showStackCompletionCelebration(stack, totalPoints) {
        const modal = document.createElement('div');
        modal.className = 'stack-completion-modal';
        modal.innerHTML = `
            <div class="completion-content">
                <div class="celebration-icon">🎉</div>
                <h1>Stack Complete!</h1>
                <h2>${stack.name}</h2>
                <div class="completion-stats">
                    <div class="stat">
                        <span class="label">Points Earned</span>
                        <span class="value">${totalPoints}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Current Streak</span>
                        <span class="value">${stack.currentStreak} days</span>
                    </div>
                    <div class="stat">
                        <span class="label">Total Completions</span>
                        <span class="value">${stack.totalCompletions}</span>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Awesome!
                </button>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.9);
            animation: fadeIn 0.5s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Remove habit stack modal
        const stackModal = document.getElementById('habitStackModal');
        if (stackModal) stackModal.remove();
        
        // Trigger confetti
        if (window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    },

    // Generate habit insights
    generateHabitInsights(session) {
        const insights = [];
        
        // Completion rate
        const completedCount = session.habits.filter(h => h.completed).length;
        const completionRate = (completedCount / session.habits.length) * 100;
        
        if (completionRate === 100) {
            insights.push({
                type: 'success',
                message: 'Perfect execution! You completed every habit in the stack.'
            });
        } else if (completionRate >= 80) {
            insights.push({
                type: 'good',
                message: `Great job! You completed ${completionRate.toFixed(0)}% of your habits.`
            });
        }
        
        // Time analysis
        const totalTime = session.habits
            .filter(h => h.completed)
            .reduce((sum, h) => sum + (h.completedAt - h.startedAt), 0) / 60000;
        
        const expectedTime = session.habits
            .filter(h => h.completed)
            .reduce((sum, h) => sum + h.duration, 0);
        
        if (totalTime < expectedTime * 0.9) {
            insights.push({
                type: 'speed',
                message: 'You\'re getting faster! You completed habits ahead of schedule.'
            });
        }
        
        // Difficulty analysis
        const hardHabits = session.habits.filter(h => h.difficulty === 'hard' && h.completed);
        if (hardHabits.length > 0) {
            insights.push({
                type: 'challenge',
                message: `You conquered ${hardHabits.length} difficult habits. Impressive!`
            });
        }
        
        // Store insights
        this.habitData.insights.push({
            sessionId: session.id,
            timestamp: new Date().toISOString(),
            insights: insights
        });
        
        this.saveUserData();
        
        // Show insights
        if (insights.length > 0) {
            setTimeout(() => {
                this.showInsightsModal(insights);
            }, 3000);
        }
    },

    // Show insights modal
    showInsightsModal(insights) {
        const modal = document.createElement('div');
        modal.className = 'insights-modal';
        modal.innerHTML = `
            <div class="insights-content">
                <h3>📊 Habit Insights</h3>
                <div class="insights-list">
                    ${insights.map(insight => `
                        <div class="insight-item ${insight.type}">
                            <span class="insight-icon">
                                ${insight.type === 'success' ? '✨' : 
                                  insight.type === 'speed' ? '⚡' : 
                                  insight.type === 'challenge' ? '💪' : '📈'}
                            </span>
                            <p>${insight.message}</p>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Got it!
                </button>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 400px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(modal);
    },

    // Render habit stacks dashboard
    renderHabitStacksDashboard() {
        return `
            <div class="habit-stacks-dashboard">
                <div class="dashboard-header">
                    <h2>🔗 Habit Stacks</h2>
                    <button class="btn btn-primary" onclick="HabitStackingSystem.showCreateStack()">
                        Create New Stack
                    </button>
                </div>
                
                <div class="templates-section">
                    <h3>Quick Start Templates</h3>
                    <div class="templates-grid">
                        ${Object.entries(this.templates).map(([key, template]) => `
                            <div class="template-card" onclick="HabitStackingSystem.createFromTemplate('${key}')">
                                <span class="template-icon">${template.icon}</span>
                                <h4>${template.name}</h4>
                                <p>${template.habits.length} habits</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="user-stacks-section">
                    <h3>Your Habit Stacks</h3>
                    ${this.renderUserStacks()}
                </div>
                
                <div class="habit-stats-section">
                    <h3>Habit Statistics</h3>
                    ${this.renderHabitStats()}
                </div>
            </div>
        `;
    },

    // Render user stacks
    renderUserStacks() {
        if (this.userStacks.length === 0) {
            return '<p>No habit stacks yet. Create one to get started!</p>';
        }
        
        return `
            <div class="stacks-list">
                ${this.userStacks.map(stack => `
                    <div class="stack-card ${stack.active ? 'active' : 'inactive'}">
                        <div class="stack-header">
                            <h4>${stack.name}</h4>
                            <span class="stack-habits">${stack.habits.length} habits</span>
                        </div>
                        <div class="stack-stats">
                            <span>Streak: ${stack.currentStreak} days</span>
                            <span>Completions: ${stack.totalCompletions}</span>
                        </div>
                        <div class="stack-actions">
                            <button class="btn btn-primary" onclick="HabitStackingSystem.startHabitStack('${stack.id}')">
                                Start Stack
                            </button>
                            <button class="btn btn-secondary" onclick="HabitStackingSystem.editStack('${stack.id}')">
                                Edit
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Helper functions
    getStackName(stackId) {
        const stack = this.userStacks.find(s => s.id === stackId);
        return stack ? stack.name : 'Habit Stack';
    },

    getDefaultSchedule(templateId) {
        const schedules = {
            morning_routine: { time: '07:00', days: [1, 2, 3, 4, 5, 6, 0] },
            evening_routine: { time: '21:00', days: [1, 2, 3, 4, 5, 6, 0] },
            productivity_stack: { time: '09:00', days: [1, 2, 3, 4, 5] },
            health_stack: { time: '18:00', days: [1, 2, 3, 4, 5, 6] }
        };
        return schedules[templateId] || null;
    },

    completeCurrentHabit() {
        const session = JSON.parse(localStorage.getItem('activeHabitSession') || '{}');
        if (session.id) {
            this.completeHabit(session.id, session.currentHabitIndex);
        }
    },

    skipHabit() {
        const session = JSON.parse(localStorage.getItem('activeHabitSession') || '{}');
        if (session.id) {
            session.currentHabitIndex++;
            localStorage.setItem('activeHabitSession', JSON.stringify(session));
            this.startNextHabit(session);
        }
    },

    pauseHabitStack() {
        if (this.currentTimer) {
            clearInterval(this.currentTimer);
        }
        const modal = document.getElementById('habitStackModal');
        if (modal) modal.remove();
        
        window.showToast('Habit stack paused. You can resume anytime!', 'info');
    },

    awardPoints(points) {
        const current = parseInt(localStorage.getItem('userPoints') || '0');
        localStorage.setItem('userPoints', (current + points).toString());
        
        if (window.AchievementSystem) {
            window.AchievementSystem.awardXP(points);
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for habit-related events
        document.addEventListener('habitCompleted', (e) => {
            this.trackHabitCompletion(e.detail);
        });
    },

    setupDailyHabits() {
        // Check for scheduled habits
        this.userStacks.forEach(stack => {
            if (stack.schedule && stack.active) {
                this.scheduleStackReminder(stack);
            }
        });
    },

    scheduleStackReminder(stack) {
        // In production, would use service worker for notifications
        const now = new Date();
        const [hours, minutes] = stack.schedule.time.split(':');
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0);
        
        if (scheduledTime > now && stack.schedule.days.includes(now.getDay())) {
            const delay = scheduledTime - now;
            setTimeout(() => {
                if (window.NotificationSystem) {
                    window.NotificationSystem.send(
                        'Habit Stack Reminder',
                        `Time for your ${stack.name}!`,
                        {
                            category: 'reminders',
                            data: { stackId: stack.id }
                        }
                    );
                }
            }, delay);
        }
    },

    checkHabitReminders() {
        // Check every hour for habit reminders
        setInterval(() => {
            this.setupDailyHabits();
        }, 3600000);
    },

    checkHabitAchievements(stack) {
        if (stack.currentStreak === 7 && window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('habit_week');
        }
        if (stack.currentStreak === 30 && window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('habit_month');
        }
        if (stack.totalCompletions === 100 && window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('habit_master');
        }
    }
};

// Add CSS for animations
const habitStyles = document.createElement('style');
habitStyles.textContent = `
    @keyframes completionPulse {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(habitStyles);

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.HabitStackingSystem.initialize());
} else {
    window.HabitStackingSystem.initialize();
}
