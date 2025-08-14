/**
 * Journey Templates System
 * Multi-step guided journeys for personal growth and skill development
 */

window.JourneySystem = {
    // Journey Templates Library
    templates: {
        '30day_fitness': {
            id: '30day_fitness',
            name: '30-Day Fitness Transform',
            description: 'Build a sustainable fitness habit in 30 days',
            category: 'Health',
            duration: 30,
            difficulty: 'intermediate',
            icon: '💪',
            milestones: [
                { day: 7, name: 'Week 1 Warrior', reward: 50 },
                { day: 14, name: 'Halfway Hero', reward: 100 },
                { day: 21, name: 'Three Week Champion', reward: 150 },
                { day: 30, name: 'Transformation Complete', reward: 300 }
            ],
            tasks: [
                { day: 1, task: '10-minute morning stretch routine', energy: 10 },
                { day: 2, task: '15-minute walk or light jog', energy: 15 },
                { day: 3, task: '20 push-ups (modified if needed)', energy: 20 },
                { day: 4, task: 'Rest day - plan your workout schedule', energy: 5 },
                { day: 5, task: '20-minute home workout', energy: 25 },
                // ... continue for 30 days
            ]
        },
        'coding_mastery': {
            id: 'coding_mastery',
            name: 'Code Every Day Challenge',
            description: 'Become a better developer with daily coding practice',
            category: 'Learning',
            duration: 60,
            difficulty: 'advanced',
            icon: '💻',
            milestones: [
                { day: 10, name: 'Consistency Builder', reward: 75 },
                { day: 30, name: 'Monthly Coder', reward: 200 },
                { day: 60, name: 'Coding Master', reward: 500 }
            ],
            tasks: [
                { day: 1, task: 'Solve one easy algorithm problem', energy: 15 },
                { day: 2, task: 'Build a simple HTML/CSS component', energy: 20 },
                { day: 3, task: 'Learn a new JavaScript method', energy: 10 },
                // ... continue
            ]
        },
        'mindfulness_journey': {
            id: 'mindfulness_journey',
            name: 'Mindfulness & Meditation Path',
            description: 'Develop inner peace and mental clarity',
            category: 'Personal',
            duration: 21,
            difficulty: 'beginner',
            icon: '🧘',
            milestones: [
                { day: 7, name: 'Mindful Week', reward: 40 },
                { day: 14, name: 'Peaceful Progress', reward: 80 },
                { day: 21, name: 'Zen Master', reward: 150 }
            ],
            tasks: [
                { day: 1, task: '5-minute breathing exercise', energy: 5 },
                { day: 2, task: '10-minute guided meditation', energy: 5 },
                { day: 3, task: 'Practice gratitude - write 3 things', energy: 5 },
                // ... continue
            ]
        },
        'financial_freedom': {
            id: 'financial_freedom',
            name: 'Financial Freedom Blueprint',
            description: 'Take control of your finances in 45 days',
            category: 'Finance',
            duration: 45,
            difficulty: 'intermediate',
            icon: '💰',
            milestones: [
                { day: 15, name: 'Budget Boss', reward: 100 },
                { day: 30, name: 'Savings Starter', reward: 200 },
                { day: 45, name: 'Financial Warrior', reward: 350 }
            ],
            tasks: [
                { day: 1, task: 'Track all expenses today', energy: 10 },
                { day: 2, task: 'Create a monthly budget', energy: 20 },
                { day: 3, task: 'Set up automatic savings', energy: 15 },
                // ... continue
            ]
        }
    },

    // User's active journeys
    activeJourneys: {},

    // Initialize the journey system
    initialize() {
        this.loadActiveJourneys();
        this.checkDailyTasks();
        this.setupEventListeners();
    },

    // Load user's active journeys from storage
    loadActiveJourneys() {
        const saved = localStorage.getItem('activeJourneys');
        if (saved) {
            this.activeJourneys = JSON.parse(saved);
        }
    },

    // Save active journeys to storage
    saveActiveJourneys() {
        localStorage.setItem('activeJourneys', JSON.stringify(this.activeJourneys));
    },

    // Start a new journey
    startJourney(templateId) {
        const template = this.templates[templateId];
        if (!template) {
            window.showToast('Journey template not found', 'error');
            return;
        }

        // Check if journey already active
        if (this.activeJourneys[templateId]) {
            window.showToast('This journey is already active', 'warning');
            return;
        }

        // Check energy requirements
        const energySystem = window.EnergySystem;
        if (energySystem && energySystem.currentEnergy < 20) {
            window.showToast('Not enough energy to start a journey (20 required)', 'error');
            return;
        }

        // Create journey instance
        const journey = {
            templateId: templateId,
            startDate: new Date().toISOString(),
            currentDay: 1,
            completedTasks: [],
            completedMilestones: [],
            status: 'active',
            totalPoints: 0
        };

        // Add to active journeys
        this.activeJourneys[templateId] = journey;
        this.saveActiveJourneys();

        // Consume energy
        if (energySystem) {
            energySystem.consumeEnergy(20);
        }

        // Create goals for the journey
        this.createJourneyGoals(template, journey);

        // Show success message
        window.showToast(`Started journey: ${template.name}!`, 'success');
        
        // Check achievement
        this.checkJourneyAchievements('journey_started');

        // Update UI
        this.renderJourneyProgress(templateId);
        
        // Show journey modal
        this.showJourneyModal(templateId);
    },

    // Create goals from journey template
    createJourneyGoals(template, journey) {
        const goals = [];
        
        // Create milestone goals
        template.milestones.forEach(milestone => {
            const goal = {
                id: `journey_${template.id}_milestone_${milestone.day}`,
                title: milestone.name,
                description: `Complete day ${milestone.day} of ${template.name}`,
                category: template.category,
                priority: 'high',
                dueDate: this.calculateDueDate(journey.startDate, milestone.day),
                journeyId: template.id,
                reward: milestone.reward
            };
            goals.push(goal);
        });

        // Store goals
        const existingGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
        const updatedGoals = [...existingGoals, ...goals];
        localStorage.setItem('userGoals', JSON.stringify(updatedGoals));

        return goals;
    },

    // Calculate due date based on journey start and day number
    calculateDueDate(startDate, dayNumber) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayNumber - 1);
        return date.toISOString();
    },

    // Get today's tasks for all active journeys
    checkDailyTasks() {
        const today = new Date();
        const dailyTasks = [];

        Object.entries(this.activeJourneys).forEach(([templateId, journey]) => {
            if (journey.status !== 'active') return;

            const template = this.templates[templateId];
            const daysSinceStart = Math.floor((today - new Date(journey.startDate)) / (1000 * 60 * 60 * 24)) + 1;
            
            // Update current day
            journey.currentDay = daysSinceStart;

            // Get task for current day
            const todayTask = template.tasks.find(t => t.day === daysSinceStart);
            if (todayTask && !journey.completedTasks.includes(todayTask.day)) {
                dailyTasks.push({
                    ...todayTask,
                    journeyName: template.name,
                    journeyId: templateId
                });
            }

            // Check for milestones
            this.checkMilestones(templateId, journey, template);
        });

        this.saveActiveJourneys();
        return dailyTasks;
    },

    // Complete a journey task
    completeTask(journeyId, day) {
        const journey = this.activeJourneys[journeyId];
        const template = this.templates[journeyId];
        
        if (!journey || !template) return;

        const task = template.tasks.find(t => t.day === day);
        if (!task) return;

        // Check energy
        const energySystem = window.EnergySystem;
        if (energySystem && energySystem.currentEnergy < task.energy) {
            window.showToast(`Not enough energy (${task.energy} required)`, 'error');
            return;
        }

        // Mark task as completed
        if (!journey.completedTasks.includes(day)) {
            journey.completedTasks.push(day);
            journey.totalPoints += 10; // Base points for task completion

            // Consume energy
            if (energySystem) {
                energySystem.consumeEnergy(task.energy);
            }

            // Add XP
            if (window.AchievementSystem) {
                window.AchievementSystem.awardXP(10);
            }

            // Save progress
            this.saveActiveJourneys();

            // Show success
            window.showToast(`Task completed! Day ${day} of ${template.name}`, 'success');

            // Check for milestones
            this.checkMilestones(journeyId, journey, template);

            // Update UI
            this.renderJourneyProgress(journeyId);
        }
    },

    // Check and award milestones
    checkMilestones(journeyId, journey, template) {
        template.milestones.forEach(milestone => {
            if (journey.currentDay >= milestone.day && !journey.completedMilestones.includes(milestone.day)) {
                // Check if all tasks up to milestone are completed
                const requiredTasks = Array.from({ length: milestone.day }, (_, i) => i + 1);
                const allCompleted = requiredTasks.every(day => journey.completedTasks.includes(day));

                if (allCompleted) {
                    journey.completedMilestones.push(milestone.day);
                    journey.totalPoints += milestone.reward;

                    // Award points
                    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
                    localStorage.setItem('userPoints', (currentPoints + milestone.reward).toString());

                    // Show achievement
                    this.showMilestoneAchievement(milestone, template);

                    // Check if journey completed
                    if (milestone.day === template.duration) {
                        this.completeJourney(journeyId);
                    }
                }
            }
        });
    },

    // Show milestone achievement animation
    showMilestoneAchievement(milestone, template) {
        const modal = document.createElement('div');
        modal.className = 'milestone-achievement-modal';
        modal.innerHTML = `
            <div class="milestone-content">
                <div class="milestone-icon">${template.icon}</div>
                <h2>Milestone Achieved!</h2>
                <h3>${milestone.name}</h3>
                <p>Day ${milestone.day} of ${template.name}</p>
                <div class="milestone-reward">+${milestone.reward} Points</div>
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
            animation: fadeIn 0.5s ease;
        `;

        document.body.appendChild(modal);

        // Trigger confetti
        if (window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        // Remove after 3 seconds
        setTimeout(() => {
            modal.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => modal.remove(), 500);
        }, 3000);
    },

    // Complete a journey
    completeJourney(journeyId) {
        const journey = this.activeJourneys[journeyId];
        const template = this.templates[journeyId];

        if (!journey || !template) return;

        journey.status = 'completed';
        journey.completedDate = new Date().toISOString();

        // Award completion bonus
        const bonusPoints = 500;
        journey.totalPoints += bonusPoints;

        const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
        localStorage.setItem('userPoints', (currentPoints + bonusPoints).toString());

        // Save journey
        this.saveActiveJourneys();

        // Show completion modal
        this.showJourneyCompletionModal(template, journey);

        // Check achievements
        this.checkJourneyAchievements('journey_completed');

        // Add to completed journeys history
        this.addToHistory(journeyId, journey);
    },

    // Show journey completion celebration
    showJourneyCompletionModal(template, journey) {
        const modal = document.createElement('div');
        modal.className = 'journey-completion-modal';
        modal.innerHTML = `
            <div class="completion-content">
                <div class="completion-icon">${template.icon}</div>
                <h1>Journey Complete!</h1>
                <h2>${template.name}</h2>
                <div class="completion-stats">
                    <div class="stat">
                        <span class="stat-label">Duration</span>
                        <span class="stat-value">${template.duration} days</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Total Points</span>
                        <span class="stat-value">${journey.totalPoints}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Tasks Completed</span>
                        <span class="stat-value">${journey.completedTasks.length}</span>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="JourneySystem.closeCompletionModal()">
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
        this.completionModal = modal;

        // Epic confetti
        if (window.confetti) {
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    },

    closeCompletionModal() {
        if (this.completionModal) {
            this.completionModal.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                this.completionModal.remove();
                this.completionModal = null;
            }, 500);
        }
    },

    // Abandon a journey
    abandonJourney(journeyId) {
        const journey = this.activeJourneys[journeyId];
        if (!journey) return;

        if (confirm('Are you sure you want to abandon this journey? Your progress will be lost.')) {
            journey.status = 'abandoned';
            journey.abandonedDate = new Date().toISOString();
            
            // Move to history
            this.addToHistory(journeyId, journey);
            
            // Remove from active
            delete this.activeJourneys[journeyId];
            this.saveActiveJourneys();

            window.showToast('Journey abandoned', 'info');
            this.renderJourneysList();
        }
    },

    // Restart a journey
    restartJourney(journeyId) {
        // Remove old journey
        if (this.activeJourneys[journeyId]) {
            delete this.activeJourneys[journeyId];
        }

        // Start fresh
        this.startJourney(journeyId);
    },

    // Add journey to history
    addToHistory(journeyId, journey) {
        const history = JSON.parse(localStorage.getItem('journeyHistory') || '[]');
        history.push({
            ...journey,
            templateId: journeyId,
            archivedDate: new Date().toISOString()
        });
        localStorage.setItem('journeyHistory', JSON.stringify(history));
    },

    // Check journey-related achievements
    checkJourneyAchievements(type) {
        const achievements = {
            journey_started: () => {
                const activeCount = Object.keys(this.activeJourneys).length;
                if (activeCount === 1 && window.AchievementSystem) {
                    window.AchievementSystem.unlockAchievement('first_journey');
                }
            },
            journey_completed: () => {
                const history = JSON.parse(localStorage.getItem('journeyHistory') || '[]');
                const completed = history.filter(j => j.status === 'completed').length;
                
                if (completed === 1 && window.AchievementSystem) {
                    window.AchievementSystem.unlockAchievement('journey_master');
                } else if (completed === 5 && window.AchievementSystem) {
                    window.AchievementSystem.unlockAchievement('journey_veteran');
                }
            }
        };

        if (achievements[type]) {
            achievements[type]();
        }
    },

    // Render journey progress card
    renderJourneyProgress(journeyId) {
        const journey = this.activeJourneys[journeyId];
        const template = this.templates[journeyId];
        
        if (!journey || !template) return '';

        const progress = (journey.completedTasks.length / template.duration) * 100;
        const nextMilestone = template.milestones.find(m => !journey.completedMilestones.includes(m.day));

        return `
            <div class="journey-progress-card" data-journey-id="${journeyId}">
                <div class="journey-header">
                    <span class="journey-icon">${template.icon}</span>
                    <h3>${template.name}</h3>
                    <span class="journey-day">Day ${journey.currentDay}/${template.duration}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                ${nextMilestone ? `
                    <div class="next-milestone">
                        Next milestone: ${nextMilestone.name} (Day ${nextMilestone.day})
                    </div>
                ` : ''}
                <div class="journey-actions">
                    <button onclick="JourneySystem.showJourneyModal('${journeyId}')">View Details</button>
                    <button onclick="JourneySystem.abandonJourney('${journeyId}')">Abandon</button>
                </div>
            </div>
        `;
    },

    // Show journey modal with details
    showJourneyModal(journeyId) {
        const journey = this.activeJourneys[journeyId];
        const template = this.templates[journeyId];
        
        if (!template) return;

        const modal = document.createElement('div');
        modal.className = 'journey-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${template.icon} ${template.name}</h2>
                    <button onclick="JourneySystem.closeJourneyModal()">×</button>
                </div>
                <div class="modal-body">
                    <p>${template.description}</p>
                    ${journey ? this.renderJourneyTasks(journey, template) : this.renderJourneyPreview(template)}
                </div>
                <div class="modal-footer">
                    ${!journey ? `
                        <button class="btn btn-primary" onclick="JourneySystem.startJourney('${journeyId}')">
                            Start Journey
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.8);
        `;

        document.body.appendChild(modal);
        this.currentModal = modal;
    },

    closeJourneyModal() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    },

    // Render journey tasks list
    renderJourneyTasks(journey, template) {
        const tasks = template.tasks.slice(0, Math.min(journey.currentDay + 2, template.duration));
        
        return `
            <div class="journey-tasks">
                <h3>Tasks</h3>
                ${tasks.map(task => `
                    <div class="task-item ${journey.completedTasks.includes(task.day) ? 'completed' : task.day === journey.currentDay ? 'current' : 'upcoming'}">
                        <span class="task-day">Day ${task.day}</span>
                        <span class="task-description">${task.task}</span>
                        <span class="task-energy">${task.energy} energy</span>
                        ${task.day === journey.currentDay && !journey.completedTasks.includes(task.day) ? `
                            <button onclick="JourneySystem.completeTask('${journey.templateId}', ${task.day})">
                                Complete
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Render journey preview
    renderJourneyPreview(template) {
        return `
            <div class="journey-preview">
                <div class="preview-stats">
                    <div class="stat">
                        <span class="label">Duration</span>
                        <span class="value">${template.duration} days</span>
                    </div>
                    <div class="stat">
                        <span class="label">Difficulty</span>
                        <span class="value">${template.difficulty}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Category</span>
                        <span class="value">${template.category}</span>
                    </div>
                </div>
                <h3>Milestones</h3>
                <div class="milestones-list">
                    ${template.milestones.map(m => `
                        <div class="milestone-item">
                            <span class="milestone-day">Day ${m.day}</span>
                            <span class="milestone-name">${m.name}</span>
                            <span class="milestone-reward">+${m.reward} points</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Render journeys list
    renderJourneysList() {
        const container = document.getElementById('journeys-container');
        if (!container) return;

        const activeHtml = Object.entries(this.activeJourneys)
            .map(([id, journey]) => this.renderJourneyProgress(id))
            .join('');

        const availableHtml = Object.entries(this.templates)
            .filter(([id]) => !this.activeJourneys[id])
            .map(([id, template]) => `
                <div class="journey-template-card" onclick="JourneySystem.showJourneyModal('${id}')">
                    <span class="template-icon">${template.icon}</span>
                    <h4>${template.name}</h4>
                    <p>${template.description}</p>
                    <div class="template-meta">
                        <span>${template.duration} days</span>
                        <span>${template.difficulty}</span>
                    </div>
                </div>
            `)
            .join('');

        container.innerHTML = `
            <div class="journeys-section">
                <h2>Active Journeys</h2>
                <div class="active-journeys">
                    ${activeHtml || '<p>No active journeys. Start one below!</p>'}
                </div>
            </div>
            <div class="journeys-section">
                <h2>Available Journeys</h2>
                <div class="available-journeys">
                    ${availableHtml}
                </div>
            </div>
        `;
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for navigation to journeys view
        document.addEventListener('navigate', (e) => {
            if (e.detail === 'journeys') {
                this.renderJourneysList();
            }
        });
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.JourneySystem.initialize());
} else {
    window.JourneySystem.initialize();
}
