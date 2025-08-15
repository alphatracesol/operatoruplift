/**
 * Goal Templates Library System
 * Pre-made templates, community goals, success statistics
 */

window.GoalTemplatesLibrary = {
    // Template categories
    categories: {
        health: { name: 'Health & Fitness', icon: '💪', color: '#22c55e' },
        career: { name: 'Career & Skills', icon: '💼', color: '#3b82f6' },
        finance: { name: 'Finance', icon: '💰', color: '#eab308' },
        personal: { name: 'Personal Growth', icon: '🌱', color: '#8b5cf6' },
        education: { name: 'Education', icon: '📚', color: '#ec4899' },
        creativity: { name: 'Creative', icon: '🎨', color: '#f97316' },
        relationships: { name: 'Relationships', icon: '❤️', color: '#ef4444' },
        productivity: { name: 'Productivity', icon: '⚡', color: '#06b6d4' }
    },

    // Pre-made goal templates
    templates: [
        // Health & Fitness
        {
            id: 'weight_loss',
            category: 'health',
            name: 'Lose 10 Pounds',
            description: 'Healthy weight loss through diet and exercise',
            difficulty: 'medium',
            estimatedDays: 60,
            successRate: 68,
            tasks: [
                'Track daily calories',
                'Exercise 30 minutes daily',
                'Drink 8 glasses of water',
                'Get 7+ hours sleep',
                'Weekly weigh-in'
            ],
            milestones: [
                { day: 7, goal: 'Lose 1-2 pounds' },
                { day: 30, goal: 'Lose 5 pounds' },
                { day: 60, goal: 'Reach target weight' }
            ],
            tags: ['weight-loss', 'fitness', 'health'],
            popularity: 95
        },
        {
            id: 'run_5k',
            category: 'health',
            name: 'Run a 5K',
            description: 'Train to run 5 kilometers without stopping',
            difficulty: 'medium',
            estimatedDays: 42,
            successRate: 74,
            tasks: [
                'Follow Couch to 5K program',
                'Run 3 times per week',
                'Stretch after runs',
                'Track running distance',
                'Rest days between runs'
            ],
            milestones: [
                { day: 14, goal: 'Run 1 mile continuously' },
                { day: 28, goal: 'Run 2 miles' },
                { day: 42, goal: 'Complete 5K' }
            ],
            tags: ['running', 'cardio', 'endurance'],
            popularity: 87
        },

        // Career & Skills
        {
            id: 'learn_coding',
            category: 'career',
            name: 'Learn to Code',
            description: 'Master programming fundamentals',
            difficulty: 'hard',
            estimatedDays: 90,
            successRate: 52,
            tasks: [
                'Complete online course',
                'Code for 1 hour daily',
                'Build 3 projects',
                'Join coding community',
                'Practice algorithms'
            ],
            milestones: [
                { day: 30, goal: 'Complete basics' },
                { day: 60, goal: 'Build first project' },
                { day: 90, goal: 'Portfolio ready' }
            ],
            tags: ['programming', 'tech', 'skills'],
            popularity: 92
        },
        {
            id: 'get_promotion',
            category: 'career',
            name: 'Get Promoted',
            description: 'Advance to the next level in your career',
            difficulty: 'hard',
            estimatedDays: 180,
            successRate: 45,
            tasks: [
                'Excel in current role',
                'Take on extra projects',
                'Network internally',
                'Develop new skills',
                'Document achievements'
            ],
            milestones: [
                { day: 60, goal: 'Complete skill development' },
                { day: 120, goal: 'Lead major project' },
                { day: 180, goal: 'Promotion discussion' }
            ],
            tags: ['career', 'promotion', 'leadership'],
            popularity: 78
        },

        // Finance
        {
            id: 'emergency_fund',
            category: 'finance',
            name: 'Build Emergency Fund',
            description: 'Save 3 months of expenses',
            difficulty: 'medium',
            estimatedDays: 180,
            successRate: 61,
            tasks: [
                'Calculate monthly expenses',
                'Set savings target',
                'Automate savings',
                'Cut unnecessary expenses',
                'Track progress weekly'
            ],
            milestones: [
                { day: 60, goal: 'Save 1 month expenses' },
                { day: 120, goal: 'Save 2 months' },
                { day: 180, goal: 'Complete fund' }
            ],
            tags: ['savings', 'emergency', 'financial-security'],
            popularity: 85
        },

        // Personal Growth
        {
            id: 'meditation_habit',
            category: 'personal',
            name: 'Daily Meditation',
            description: 'Establish a consistent meditation practice',
            difficulty: 'easy',
            estimatedDays: 30,
            successRate: 71,
            tasks: [
                'Meditate 10 minutes daily',
                'Use guided meditation app',
                'Track mood changes',
                'Join meditation group',
                'Read about mindfulness'
            ],
            milestones: [
                { day: 7, goal: '7-day streak' },
                { day: 21, goal: 'Habit formed' },
                { day: 30, goal: 'Monthly practice' }
            ],
            tags: ['meditation', 'mindfulness', 'mental-health'],
            popularity: 89
        },

        // Education
        {
            id: 'read_books',
            category: 'education',
            name: 'Read 12 Books',
            description: 'Read one book per month for a year',
            difficulty: 'medium',
            estimatedDays: 365,
            successRate: 58,
            tasks: [
                'Choose monthly book',
                'Read 20 pages daily',
                'Take notes',
                'Join book club',
                'Write reviews'
            ],
            milestones: [
                { day: 30, goal: 'First book complete' },
                { day: 180, goal: '6 books read' },
                { day: 365, goal: '12 books finished' }
            ],
            tags: ['reading', 'learning', 'books'],
            popularity: 76
        }
    ],

    // Community shared goals
    communityGoals: [],

    // User's created templates
    userTemplates: [],

    // Initialize library
    initialize() {
        this.loadUserTemplates();
        this.loadCommunityGoals();
        this.setupEventListeners();
    },

    // Load user templates
    loadUserTemplates() {
        const saved = localStorage.getItem('userGoalTemplates');
        if (saved) {
            this.userTemplates = JSON.parse(saved);
        }
    },

    // Load community goals
    async loadCommunityGoals() {
        // In production, fetch from backend
        const mockCommunity = [
            {
                id: 'community_1',
                name: 'Digital Detox',
                author: 'User123',
                likes: 245,
                uses: 89,
                successRate: 72,
                category: 'personal'
            }
        ];
        this.communityGoals = mockCommunity;
    },

    // Create goal from template
    createGoalFromTemplate(templateId) {
        const template = this.findTemplate(templateId);
        if (!template) return;

        const goal = {
            id: `goal_${Date.now()}`,
            templateId: templateId,
            name: template.name,
            description: template.description,
            category: template.category,
            startDate: new Date().toISOString(),
            targetDate: this.calculateTargetDate(template.estimatedDays),
            tasks: template.tasks.map(task => ({
                id: `task_${Date.now()}_${Math.random()}`,
                text: task,
                completed: false
            })),
            milestones: template.milestones.map(m => ({
                ...m,
                completed: false
            })),
            progress: 0,
            status: 'active',
            difficulty: template.difficulty,
            createdFrom: 'template'
        };

        // Save goal
        this.saveGoal(goal);

        // Track template usage
        this.trackTemplateUsage(templateId);

        window.showToast(`Goal "${template.name}" created!`, 'success');
        return goal;
    },

    // Save custom template
    saveAsTemplate(goalData) {
        const template = {
            id: `custom_${Date.now()}`,
            ...goalData,
            author: this.getCurrentUserId(),
            createdAt: new Date().toISOString(),
            uses: 0,
            successRate: 0,
            isCustom: true
        };

        this.userTemplates.push(template);
        localStorage.setItem('userGoalTemplates', JSON.stringify(this.userTemplates));

        window.showToast('Template saved!', 'success');
        return template;
    },

    // Share template with community
    shareTemplate(templateId) {
        const template = this.userTemplates.find(t => t.id === templateId);
        if (!template) return;

        // In production, upload to backend
        const sharedTemplate = {
            ...template,
            sharedAt: new Date().toISOString(),
            likes: 0,
            author: this.getCurrentUserId()
        };

        this.communityGoals.push(sharedTemplate);
        window.showToast('Template shared with community!', 'success');
    },

    // Like community template
    likeTemplate(templateId) {
        const template = this.communityGoals.find(t => t.id === templateId);
        if (template) {
            template.likes++;
            // In production, sync with backend
            window.showToast('Template liked!', 'success');
        }
    },

    // Get template recommendations
    getRecommendations(userProfile = {}) {
        const recommendations = [];
        
        // Based on success rate
        const highSuccess = this.templates
            .filter(t => t.successRate > 70)
            .sort((a, b) => b.successRate - a.successRate)
            .slice(0, 3);
        
        recommendations.push({
            title: 'High Success Rate',
            templates: highSuccess
        });

        // Based on popularity
        const popular = this.templates
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 3);
        
        recommendations.push({
            title: 'Most Popular',
            templates: popular
        });

        // Based on difficulty
        const beginnerFriendly = this.templates
            .filter(t => t.difficulty === 'easy')
            .slice(0, 3);
        
        recommendations.push({
            title: 'Beginner Friendly',
            templates: beginnerFriendly
        });

        return recommendations;
    },

    // Render templates library
    renderTemplatesLibrary() {
        return `
            <div class="templates-library">
                <div class="library-header">
                    <h2>📚 Goal Templates Library</h2>
                    <div class="library-actions">
                        <button class="btn btn-secondary" onclick="GoalTemplatesLibrary.showCreateCustom()">
                            Create Custom
                        </button>
                        <button class="btn btn-primary" onclick="GoalTemplatesLibrary.showCommunity()">
                            Community Goals
                        </button>
                    </div>
                </div>

                <div class="template-categories">
                    ${Object.entries(this.categories).map(([key, cat]) => `
                        <button class="category-btn" onclick="GoalTemplatesLibrary.filterByCategory('${key}')">
                            <span class="cat-icon">${cat.icon}</span>
                            <span class="cat-name">${cat.name}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="recommendations-section">
                    ${this.renderRecommendations()}
                </div>

                <div class="templates-grid" id="templatesGrid">
                    ${this.renderTemplateCards()}
                </div>
            </div>
        `;
    },

    // Render recommendations
    renderRecommendations() {
        const recommendations = this.getRecommendations();
        
        return `
            <div class="recommendations">
                ${recommendations.map(rec => `
                    <div class="recommendation-group">
                        <h3>${rec.title}</h3>
                        <div class="rec-templates">
                            ${rec.templates.map(t => `
                                <div class="rec-card" onclick="GoalTemplatesLibrary.showTemplateDetails('${t.id}')">
                                    <span class="rec-icon">${this.categories[t.category].icon}</span>
                                    <span class="rec-name">${t.name}</span>
                                    <span class="rec-success">${t.successRate}% success</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Render template cards
    renderTemplateCards(category = null) {
        const templates = category 
            ? this.templates.filter(t => t.category === category)
            : this.templates;

        return templates.map(template => `
            <div class="template-card">
                <div class="template-header" style="background: ${this.categories[template.category].color}20">
                    <span class="template-icon">${this.categories[template.category].icon}</span>
                    <span class="template-difficulty ${template.difficulty}">
                        ${template.difficulty}
                    </span>
                </div>
                <div class="template-body">
                    <h3>${template.name}</h3>
                    <p>${template.description}</p>
                    <div class="template-stats">
                        <span>📅 ${template.estimatedDays} days</span>
                        <span>✅ ${template.successRate}% success</span>
                        <span>👥 ${template.popularity} users</span>
                    </div>
                    <div class="template-tags">
                        ${template.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="template-actions">
                    <button class="btn btn-sm" onclick="GoalTemplatesLibrary.showTemplateDetails('${template.id}')">
                        View Details
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="GoalTemplatesLibrary.createGoalFromTemplate('${template.id}')">
                        Use Template
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Show template details modal
    showTemplateDetails(templateId) {
        const template = this.findTemplate(templateId);
        if (!template) return;

        const modal = document.createElement('div');
        modal.className = 'template-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${template.name}</h2>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                
                <div class="modal-body">
                    <div class="detail-section">
                        <h3>Description</h3>
                        <p>${template.description}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Tasks (${template.tasks.length})</h3>
                        <ul class="tasks-list">
                            ${template.tasks.map(task => `<li>${task}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Milestones</h3>
                        <div class="milestones-timeline">
                            ${template.milestones.map(m => `
                                <div class="milestone">
                                    <span class="day">Day ${m.day}</span>
                                    <span class="goal">${m.goal}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-stats">
                        <div class="stat">
                            <span>Difficulty</span>
                            <span class="${template.difficulty}">${template.difficulty}</span>
                        </div>
                        <div class="stat">
                            <span>Duration</span>
                            <span>${template.estimatedDays} days</span>
                        </div>
                        <div class="stat">
                            <span>Success Rate</span>
                            <span>${template.successRate}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="GoalTemplatesLibrary.duplicateTemplate('${template.id}')">
                        Customize
                    </button>
                    <button class="btn btn-primary" onclick="GoalTemplatesLibrary.createGoalFromTemplate('${template.id}')">
                        Start This Goal
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

    // Helper functions
    findTemplate(templateId) {
        return this.templates.find(t => t.id === templateId) ||
               this.userTemplates.find(t => t.id === templateId) ||
               this.communityGoals.find(t => t.id === templateId);
    },

    calculateTargetDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    },

    saveGoal(goal) {
        const goals = JSON.parse(localStorage.getItem('userGoals') || '[]');
        goals.push(goal);
        localStorage.setItem('userGoals', JSON.stringify(goals));
    },

    trackTemplateUsage(templateId) {
        const usage = JSON.parse(localStorage.getItem('templateUsage') || '{}');
        usage[templateId] = (usage[templateId] || 0) + 1;
        localStorage.setItem('templateUsage', JSON.stringify(usage));
    },

    getCurrentUserId() {
        return localStorage.getItem('userId') || 'user_' + Date.now();
    },

    filterByCategory(category) {
        const grid = document.getElementById('templatesGrid');
        if (grid) {
            grid.innerHTML = this.renderTemplateCards(category);
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for goal completion to update success rates
        document.addEventListener('goalCompleted', (e) => {
            if (e.detail.templateId) {
                this.updateTemplateSuccessRate(e.detail.templateId, true);
            }
        });

        document.addEventListener('goalAbandoned', (e) => {
            if (e.detail.templateId) {
                this.updateTemplateSuccessRate(e.detail.templateId, false);
            }
        });
    },

    updateTemplateSuccessRate(templateId, success) {
        const template = this.findTemplate(templateId);
        if (template) {
            // In production, update backend
            // For now, update local calculation
            const stats = JSON.parse(localStorage.getItem('templateStats') || '{}');
            if (!stats[templateId]) {
                stats[templateId] = { attempts: 0, successes: 0 };
            }
            stats[templateId].attempts++;
            if (success) stats[templateId].successes++;
            
            template.successRate = Math.round(
                (stats[templateId].successes / stats[templateId].attempts) * 100
            );
            
            localStorage.setItem('templateStats', JSON.stringify(stats));
        }
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.GoalTemplatesLibrary.initialize());
} else {
    window.GoalTemplatesLibrary.initialize();
}
