/**
 * Enhanced Onboarding System
 * Interactive tutorial, progressive feature unlock, sample data
 */

window.EnhancedOnboarding = {
    // Onboarding stages
    stages: [
        {
            id: 'welcome',
            title: 'Welcome to Operator Uplift! 🚀',
            description: 'Your AI-powered productivity companion',
            actions: ['next'],
            skippable: false
        },
        {
            id: 'profile',
            title: 'Let\'s Get to Know You',
            description: 'Set up your profile for a personalized experience',
            component: 'profileSetup',
            actions: ['back', 'next'],
            skippable: true
        },
        {
            id: 'goals',
            title: 'What Would You Like to Achieve?',
            description: 'Choose from templates or create your own goals',
            component: 'goalSelection',
            actions: ['back', 'next'],
            skippable: true
        },
        {
            id: 'tour',
            title: 'Quick Tour',
            description: 'Let me show you around the dashboard',
            component: 'interactiveTour',
            actions: ['back', 'next'],
            skippable: true
        },
        {
            id: 'ai-intro',
            title: 'Meet Your AI Coach',
            description: 'I\'ll help you stay motivated and productive',
            component: 'aiIntroduction',
            actions: ['back', 'next'],
            skippable: true
        },
        {
            id: 'first-task',
            title: 'Create Your First Task',
            description: 'Let\'s start with something simple',
            component: 'firstTask',
            actions: ['back', 'next'],
            achievement: 'first_steps'
        },
        {
            id: 'features',
            title: 'Unlock Features as You Grow',
            description: 'New features unlock as you progress',
            component: 'featurePreview',
            actions: ['back', 'finish']
        }
    ],

    // Current state
    currentStage: 0,
    completed: false,
    skipped: false,
    userData: {},

    // Feature unlock levels
    featureUnlocks: {
        level1: ['tasks', 'goals', 'focus-timer'],
        level5: ['habits', 'ai-coach', 'achievements'],
        level10: ['collaboration', 'marketplace', 'analytics'],
        level15: ['advanced-focus', 'journey-templates'],
        level20: ['all-features']
    },

    // Sample data for testing
    sampleData: {
        tasks: [
            { text: 'Complete onboarding tutorial', category: 'learning', completed: true },
            { text: 'Set up daily meditation habit', category: 'wellness', completed: false },
            { text: 'Review goal templates', category: 'planning', completed: false }
        ],
        goals: [
            { name: 'Learn JavaScript', progress: 25, category: 'education' },
            { name: 'Exercise 3x per week', progress: 60, category: 'health' }
        ],
        achievements: [
            { id: 'welcome_aboard', name: 'Welcome Aboard', icon: '🎉' }
        ]
    },

    // Initialize onboarding
    initialize() {
        const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
        const userLevel = parseInt(localStorage.getItem('userLevel') || '1');
        
        if (!hasCompletedOnboarding && userLevel === 1) {
            this.startOnboarding();
        } else {
            this.checkFeatureUnlocks();
        }
    },

    // Start onboarding
    startOnboarding() {
        this.currentStage = 0;
        this.showOnboardingModal();
        
        // Track onboarding start
        this.trackEvent('onboarding_started');
    },

    // Show onboarding modal
    showOnboardingModal() {
        const stage = this.stages[this.currentStage];
        
        const modal = document.createElement('div');
        modal.id = 'onboardingModal';
        modal.className = 'onboarding-modal';
        modal.innerHTML = `
            <div class="onboarding-content">
                <div class="onboarding-progress">
                    ${this.renderProgress()}
                </div>
                
                <div class="stage-content">
                    <h1>${stage.title}</h1>
                    <p>${stage.description}</p>
                    
                    ${stage.component ? this.renderComponent(stage.component) : ''}
                </div>
                
                <div class="onboarding-actions">
                    ${this.renderActions(stage.actions)}
                </div>
                
                ${stage.skippable ? `
                    <button class="skip-btn" onclick="EnhancedOnboarding.skipOnboarding()">
                        Skip Tutorial
                    </button>
                ` : ''}
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
        `;

        document.body.appendChild(modal);
        
        // Initialize component if needed
        if (stage.component) {
            this.initializeComponent(stage.component);
        }
    },

    // Render progress
    renderProgress() {
        const progress = ((this.currentStage + 1) / this.stages.length) * 100;
        
        return `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-dots">
                ${this.stages.map((stage, index) => `
                    <div class="progress-dot ${index <= this.currentStage ? 'active' : ''} ${index === this.currentStage ? 'current' : ''}"></div>
                `).join('')}
            </div>
        `;
    },

    // Render component
    renderComponent(componentName) {
        const components = {
            profileSetup: () => `
                <div class="profile-setup">
                    <div class="avatar-selector">
                        <h3>Choose Your Avatar</h3>
                        <div class="avatar-grid">
                            ${['🦸', '🧙', '🦊', '🐉', '🦄', '🤖'].map(avatar => `
                                <button class="avatar-option" onclick="EnhancedOnboarding.selectAvatar('${avatar}')">
                                    ${avatar}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="name-input">
                        <label>What should I call you?</label>
                        <input type="text" id="userName" placeholder="Enter your name" 
                            onchange="EnhancedOnboarding.setUserName(this.value)">
                    </div>
                    <div class="preference-selector">
                        <h3>I want to focus on:</h3>
                        <div class="preference-options">
                            ${['Productivity', 'Health', 'Learning', 'Creativity'].map(focus => `
                                <label>
                                    <input type="checkbox" value="${focus.toLowerCase()}"
                                        onchange="EnhancedOnboarding.toggleFocus(this)">
                                    ${focus}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `,
            
            goalSelection: () => `
                <div class="goal-selection">
                    <h3>Popular Goals to Get Started</h3>
                    <div class="goal-templates">
                        ${[
                            { name: 'Build a Daily Habit', icon: '🔄', template: 'daily_habit' },
                            { name: 'Learn Something New', icon: '📚', template: 'learn_skill' },
                            { name: 'Get Fit & Healthy', icon: '💪', template: 'fitness' },
                            { name: 'Boost Productivity', icon: '⚡', template: 'productivity' }
                        ].map(goal => `
                            <button class="goal-template-card" onclick="EnhancedOnboarding.selectGoalTemplate('${goal.template}')">
                                <span class="goal-icon">${goal.icon}</span>
                                <span class="goal-name">${goal.name}</span>
                            </button>
                        `).join('')}
                    </div>
                    <p class="or-divider">or</p>
                    <button class="btn btn-secondary" onclick="EnhancedOnboarding.createCustomGoal()">
                        Create Custom Goal
                    </button>
                </div>
            `,
            
            interactiveTour: () => `
                <div class="interactive-tour">
                    <div class="tour-preview">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='200' y='150' text-anchor='middle' font-family='Arial' font-size='20' fill='%23666'%3EDashboard Preview%3C/text%3E%3C/svg%3E" alt="Dashboard Preview">
                    </div>
                    <div class="tour-highlights">
                        <h3>Key Features:</h3>
                        <ul>
                            <li>📊 Real-time progress tracking</li>
                            <li>🎯 Goal management</li>
                            <li>⏱️ Focus timer</li>
                            <li>🤖 AI coaching</li>
                            <li>🏆 Achievements & rewards</li>
                        </ul>
                    </div>
                    <button class="btn btn-primary" onclick="EnhancedOnboarding.startInteractiveTour()">
                        Start Interactive Tour
                    </button>
                </div>
            `,
            
            aiIntroduction: () => `
                <div class="ai-introduction">
                    <div class="ai-avatar">🤖</div>
                    <div class="ai-message">
                        <p>Hello! I'm your AI coach. I'll help you:</p>
                        <ul>
                            <li>Stay motivated with personalized tips</li>
                            <li>Track your patterns and progress</li>
                            <li>Suggest improvements based on your data</li>
                            <li>Celebrate your achievements</li>
                        </ul>
                    </div>
                    <div class="ai-personality">
                        <h3>Choose my coaching style:</h3>
                        <div class="personality-options">
                            ${['Motivational', 'Analytical', 'Gentle', 'Balanced'].map(style => `
                                <button class="personality-option" onclick="EnhancedOnboarding.setCoachingStyle('${style.toLowerCase()}')">
                                    ${style}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `,
            
            firstTask: () => `
                <div class="first-task">
                    <h3>Let's create your first task!</h3>
                    <div class="task-creator">
                        <input type="text" id="firstTaskInput" placeholder="What would you like to accomplish today?"
                            onkeypress="if(event.key==='Enter') EnhancedOnboarding.createFirstTask()">
                        <button class="btn btn-primary" onclick="EnhancedOnboarding.createFirstTask()">
                            Add Task
                        </button>
                    </div>
                    <div class="task-tips">
                        <p>💡 Tips for great tasks:</p>
                        <ul>
                            <li>Be specific (e.g., "Read 20 pages" not "Read")</li>
                            <li>Make it achievable today</li>
                            <li>Start small and build momentum</li>
                        </ul>
                    </div>
                </div>
            `,
            
            featurePreview: () => `
                <div class="feature-preview">
                    <h3>Features That Unlock as You Progress</h3>
                    <div class="unlock-timeline">
                        ${Object.entries(this.featureUnlocks).map(([level, features]) => `
                            <div class="unlock-level">
                                <span class="level-badge">Level ${level.replace('level', '')}</span>
                                <div class="features-list">
                                    ${features.map(f => `<span class="feature-tag">${this.formatFeatureName(f)}</span>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="motivation-message">
                        <p>🌟 The more you use Operator Uplift, the more powerful it becomes!</p>
                    </div>
                </div>
            `
        };

        const component = components[componentName];
        return component ? component() : '';
    },

    // Render actions
    renderActions(actions) {
        const actionButtons = {
            back: '<button class="btn btn-secondary" onclick="EnhancedOnboarding.previousStage()">Back</button>',
            next: '<button class="btn btn-primary" onclick="EnhancedOnboarding.nextStage()">Next</button>',
            finish: '<button class="btn btn-primary" onclick="EnhancedOnboarding.completeOnboarding()">Get Started!</button>'
        };

        return actions.map(action => actionButtons[action]).join('');
    },

    // Navigation
    nextStage() {
        const currentStageData = this.stages[this.currentStage];
        
        // Validate current stage if needed
        if (!this.validateStage(currentStageData)) {
            return;
        }

        // Award achievement if specified
        if (currentStageData.achievement) {
            this.unlockAchievement(currentStageData.achievement);
        }

        this.currentStage++;
        
        if (this.currentStage >= this.stages.length) {
            this.completeOnboarding();
        } else {
            this.updateModal();
        }
    },

    previousStage() {
        if (this.currentStage > 0) {
            this.currentStage--;
            this.updateModal();
        }
    },

    updateModal() {
        const modal = document.getElementById('onboardingModal');
        if (modal) {
            modal.remove();
        }
        this.showOnboardingModal();
    },

    // Skip onboarding
    skipOnboarding() {
        if (confirm('Skip the tutorial? You can always access it later from settings.')) {
            this.skipped = true;
            this.completeOnboarding();
        }
    },

    // Complete onboarding
    completeOnboarding() {
        // Save completion status
        localStorage.setItem('onboardingCompleted', 'true');
        localStorage.setItem('onboardingCompletedAt', new Date().toISOString());
        
        // Apply user preferences
        this.applyUserPreferences();
        
        // Load sample data if requested
        if (this.userData.loadSampleData) {
            this.loadSampleData();
        }

        // Remove modal
        const modal = document.getElementById('onboardingModal');
        if (modal) {
            modal.remove();
        }

        // Show completion message
        if (!this.skipped) {
            this.showCompletionCelebration();
        }

        // Unlock initial features
        this.unlockInitialFeatures();

        // Track completion
        this.trackEvent('onboarding_completed', {
            skipped: this.skipped,
            duration: Date.now() - this.startTime
        });

        // Reload to apply changes
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    },

    // Component handlers
    selectAvatar(avatar) {
        this.userData.avatar = avatar;
        document.querySelectorAll('.avatar-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');
    },

    setUserName(name) {
        this.userData.name = name;
        localStorage.setItem('userName', name);
    },

    toggleFocus(checkbox) {
        if (!this.userData.focusAreas) {
            this.userData.focusAreas = [];
        }
        
        if (checkbox.checked) {
            this.userData.focusAreas.push(checkbox.value);
        } else {
            this.userData.focusAreas = this.userData.focusAreas.filter(f => f !== checkbox.value);
        }
    },

    selectGoalTemplate(templateId) {
        this.userData.selectedGoal = templateId;
        document.querySelectorAll('.goal-template-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.target.closest('.goal-template-card').classList.add('selected');
    },

    setCoachingStyle(style) {
        this.userData.coachingStyle = style;
        localStorage.setItem('coachingStyle', style);
        document.querySelectorAll('.personality-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');
    },

    createFirstTask() {
        const input = document.getElementById('firstTaskInput');
        const taskText = input.value.trim();
        
        if (taskText) {
            this.userData.firstTask = taskText;
            
            // Create actual task
            const task = {
                id: `task_${Date.now()}`,
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            const tasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
            tasks.push(task);
            localStorage.setItem('userTasks', JSON.stringify(tasks));
            
            // Show success
            window.showToast('First task created! 🎉', 'success');
            
            // Auto-advance
            setTimeout(() => this.nextStage(), 1000);
        }
    },

    // Interactive tour
    startInteractiveTour() {
        // Close onboarding modal temporarily
        const modal = document.getElementById('onboardingModal');
        if (modal) {
            modal.style.display = 'none';
        }

        // Start tour
        if (window.introJs) {
            const tour = introJs();
            tour.setOptions({
                steps: [
                    {
                        intro: 'Welcome to your dashboard! Let me show you around.'
                    },
                    {
                        element: '.sidebar',
                        intro: 'Navigate between different sections here'
                    },
                    {
                        element: '.dashboard-stats',
                        intro: 'Track your progress at a glance'
                    },
                    {
                        element: '.focus-timer',
                        intro: 'Start focus sessions to boost productivity'
                    },
                    {
                        element: '.ai-chat',
                        intro: 'Chat with your AI coach anytime'
                    }
                ],
                exitOnOverlayClick: false,
                showProgress: true
            });

            tour.oncomplete(() => {
                if (modal) {
                    modal.style.display = 'flex';
                }
                this.nextStage();
            });

            tour.start();
        } else {
            // Fallback if intro.js not available
            this.nextStage();
        }
    },

    // Validation
    validateStage(stage) {
        switch (stage.id) {
            case 'profile':
                if (!this.userData.name) {
                    window.showToast('Please enter your name', 'warning');
                    return false;
                }
                break;
            case 'goals':
                if (!this.userData.selectedGoal && !this.userData.customGoal) {
                    window.showToast('Please select or create a goal', 'warning');
                    return false;
                }
                break;
        }
        return true;
    },

    // Apply user preferences
    applyUserPreferences() {
        if (this.userData.avatar) {
            localStorage.setItem('userAvatar', this.userData.avatar);
        }
        
        if (this.userData.focusAreas) {
            localStorage.setItem('focusAreas', JSON.stringify(this.userData.focusAreas));
        }
        
        if (this.userData.selectedGoal) {
            // Create goal from template
            if (window.GoalTemplatesLibrary) {
                window.GoalTemplatesLibrary.createGoalFromTemplate(this.userData.selectedGoal);
            }
        }
    },

    // Load sample data
    loadSampleData() {
        // Add sample tasks
        const tasks = JSON.parse(localStorage.getItem('userTasks') || '[]');
        this.sampleData.tasks.forEach(task => {
            tasks.push({
                ...task,
                id: `task_${Date.now()}_${Math.random()}`
            });
        });
        localStorage.setItem('userTasks', JSON.stringify(tasks));

        // Add sample goals
        const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
        this.sampleData.goals.forEach(goal => {
            goals.push({
                ...goal,
                id: `goal_${Date.now()}_${Math.random()}`,
                status: 'active'
            });
        });
        localStorage.setItem('userGoals', JSON.stringify(goals));

        // Add welcome achievement
        if (window.AchievementSystem) {
            window.AchievementSystem.unlockAchievement('welcome_aboard');
        }
    },

    // Show completion celebration
    showCompletionCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'onboarding-celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <h1>🎉 Welcome to Operator Uplift!</h1>
                <p>You're all set up and ready to boost your productivity!</p>
                <div class="celebration-rewards">
                    <div class="reward">
                        <span class="reward-icon">🏆</span>
                        <span class="reward-text">First Steps Achievement</span>
                    </div>
                    <div class="reward">
                        <span class="reward-icon">💎</span>
                        <span class="reward-text">+100 Bonus Points</span>
                    </div>
                </div>
            </div>
        `;

        celebration.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.9);
            animation: fadeIn 0.5s ease;
        `;

        document.body.appendChild(celebration);

        // Trigger confetti
        if (window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        // Award bonus points
        const points = parseInt(localStorage.getItem('userPoints') || '0');
        localStorage.setItem('userPoints', (points + 100).toString());

        // Remove after delay
        setTimeout(() => celebration.remove(), 3000);
    },

    // Feature unlocking
    unlockInitialFeatures() {
        const unlockedFeatures = ['tasks', 'goals', 'focus-timer'];
        localStorage.setItem('unlockedFeatures', JSON.stringify(unlockedFeatures));
    },

    checkFeatureUnlocks() {
        const userLevel = parseInt(localStorage.getItem('userLevel') || '1');
        const unlockedFeatures = JSON.parse(localStorage.getItem('unlockedFeatures') || '[]');
        
        Object.entries(this.featureUnlocks).forEach(([levelKey, features]) => {
            const requiredLevel = parseInt(levelKey.replace('level', ''));
            if (userLevel >= requiredLevel) {
                features.forEach(feature => {
                    if (!unlockedFeatures.includes(feature)) {
                        unlockedFeatures.push(feature);
                        this.showFeatureUnlockNotification(feature);
                    }
                });
            }
        });
        
        localStorage.setItem('unlockedFeatures', JSON.stringify(unlockedFeatures));
    },

    showFeatureUnlockNotification(feature) {
        if (window.NotificationSystem) {
            window.NotificationSystem.send(
                'New Feature Unlocked!',
                `You can now use: ${this.formatFeatureName(feature)}`,
                {
                    category: 'achievement',
                    icon: '🔓'
                }
            );
        }
    },

    formatFeatureName(feature) {
        return feature.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    },

    // Tracking
    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            data: data
        };
        
        const events = JSON.parse(localStorage.getItem('onboardingEvents') || '[]');
        events.push(event);
        localStorage.setItem('onboardingEvents', JSON.stringify(events));
    },

    // Re-run onboarding
    resetOnboarding() {
        localStorage.removeItem('onboardingCompleted');
        localStorage.removeItem('onboardingCompletedAt');
        this.currentStage = 0;
        this.completed = false;
        this.skipped = false;
        this.userData = {};
        this.startOnboarding();
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.EnhancedOnboarding.startTime = Date.now();
        window.EnhancedOnboarding.initialize();
    });
} else {
    window.EnhancedOnboarding.startTime = Date.now();
    window.EnhancedOnboarding.initialize();
}
