// Goals Module
// Handles goal management, tracking, and gamification

class GoalsModule {
  constructor(core) {
    this.core = core;
    this.isInitialized = false;
    this.goals = [];
    this.categories = ['Personal', 'Career', 'Health', 'Learning', 'Financial', 'Social'];
  }

  async init() {
    if (this.isInitialized) {return;}

    console.log('🎯 Goals Module initialized');
    this.isInitialized = true;

    // Load goals from localStorage
    this.loadGoals();

    // Setup goals interface
    this.setupGoalsInterface();

    // Initialize default goals if none exist
    if (this.goals.length === 0) {
      this.createDefaultGoals();
    }
  }

  // Load goals from localStorage
  loadGoals() {
    try {
      const saved = localStorage.getItem('user-goals');
      if (saved) {
        this.goals = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load goals:', error);
      this.goals = [];
    }
  }

  // Save goals to localStorage
  saveGoals() {
    try {
      localStorage.setItem('user-goals', JSON.stringify(this.goals));
    } catch (error) {
      console.warn('Failed to save goals:', error);
    }
  }

  // Setup goals interface
  setupGoalsInterface() {
    // Setup add goal form
    const addGoalForm = document.getElementById('add-goal-form');
    if (addGoalForm) {
      addGoalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addGoal();
      });
    }

    // Setup goal list
    this.renderGoals();

    // Setup goal filters
    this.setupGoalFilters();
  }

  // Add new goal
  addGoal() {
    const titleInput = document.getElementById('goal-title');
    const descriptionInput = document.getElementById('goal-description');
    const categoryInput = document.getElementById('goal-category');
    const deadlineInput = document.getElementById('goal-deadline');

    const title = titleInput?.value?.trim();
    const description = descriptionInput?.value?.trim();
    const category = categoryInput?.value || 'Personal';
    const deadline = deadlineInput?.value || null;

    if (!title) {
      this.showError('Goal title is required');
      return;
    }

    const goal = {
      id: Date.now(),
      title,
      description,
      category,
      deadline,
      completed: false,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: [],
      notes: []
    };

    this.goals.push(goal);
    this.saveGoals();
    this.renderGoals();

    // Clear form
    if (titleInput) {titleInput.value = '';}
    if (descriptionInput) {descriptionInput.value = '';}
    if (categoryInput) {categoryInput.value = 'Personal';}
    if (deadlineInput) {deadlineInput.value = '';}

    // Show success message
    this.showSuccess('Goal added successfully!');

    // Update user stats
    this.updateUserStats();

    console.log('🎯 Goal added:', goal);
  }

  // Update goal progress
  updateGoalProgress(goalId, progress) {
    const goal = this.goals.find(g => g.id === goalId);
    if (!goal) {return;}

    goal.progress = Math.max(0, Math.min(100, progress));
    goal.updatedAt = new Date().toISOString();

    // Check if goal is completed
    if (goal.progress >= 100 && !goal.completed) {
      goal.completed = true;
      goal.completedAt = new Date().toISOString();
      this.onGoalCompleted(goal);
    }

    this.saveGoals();
    this.renderGoals();
    this.updateUserStats();

    console.log(`🎯 Goal progress updated: ${goal.title} - ${goal.progress}%`);
  }

  // Handle goal completion
  onGoalCompleted(goal) {
    // Award essence points
    const essenceGained = 50;
    this.core.state.userData.essence = (this.core.state.userData.essence || 0) + essenceGained;

    // Check for level up
    this.checkLevelUp();

    // Show celebration
    this.showGoalCompletionCelebration(goal, essenceGained);

    // Update streaks
    this.updateStreaks();

    console.log(`🎉 Goal completed: ${goal.title} (+${essenceGained} essence)`);
  }

  // Check for level up
  checkLevelUp() {
    const { userData } = this.core.state;
    const currentLevel = userData.level || 1;
    const essence = userData.essence || 0;
    const essencePerLevel = 100;

    const newLevel = Math.floor(essence / essencePerLevel) + 1;

    if (newLevel > currentLevel) {
      userData.level = newLevel;
      this.showLevelUpCelebration(newLevel);
      console.log(`🚀 Level up! Now level ${newLevel}`);
    }
  }

  // Update streaks
  updateStreaks() {
    const { userData } = this.core.state;
    const today = new Date().toDateString();
    const { lastGoalDate } = userData;

    if (lastGoalDate === today) {
      // Already completed a goal today
      return;
    }

    if (lastGoalDate === new Date(Date.now() - 86400000).toDateString()) {
      // Consecutive day
      userData.streak = (userData.streak || 0) + 1;
    } else {
      // Break in streak
      userData.streak = 1;
    }

    userData.lastGoalDate = today;
    console.log(`🔥 Streak updated: ${userData.streak} days`);
  }

  // Delete goal
  deleteGoal(goalId) {
    const index = this.goals.findIndex(g => g.id === goalId);
    if (index === -1) {return;}

    const goal = this.goals[index];
    this.goals.splice(index, 1);
    this.saveGoals();
    this.renderGoals();

    console.log(`🗑️ Goal deleted: ${goal.title}`);
  }

  // Toggle goal completion
  toggleGoalCompletion(goalId) {
    const goal = this.goals.find(g => g.id === goalId);
    if (!goal) {return;}

    goal.completed = !goal.completed;
    goal.progress = goal.completed ? 100 : 0;
    goal.updatedAt = new Date().toISOString();

    if (goal.completed) {
      goal.completedAt = new Date().toISOString();
      this.onGoalCompleted(goal);
    }

    this.saveGoals();
    this.renderGoals();
  }

  // Render goals list
  renderGoals() {
    const goalsContainer = document.getElementById('goals-list');
    if (!goalsContainer) {return;}

    goalsContainer.innerHTML = '';

    if (this.goals.length === 0) {
      goalsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎯</div>
                    <div class="empty-title">No goals yet</div>
                    <div class="empty-description">Start by adding your first goal!</div>
                </div>
            `;
      return;
    }

    this.goals.forEach(goal => {
      const goalElement = this.createGoalElement(goal);
      goalsContainer.appendChild(goalElement);
    });
  }

  // Create goal element
  createGoalElement(goal) {
    const element = document.createElement('div');
    element.className = `goal-item ${goal.completed ? 'completed' : ''}`;
    element.innerHTML = `
            <div class="goal-header">
                <div class="goal-title">
                    <input type="checkbox" ${goal.completed ? 'checked' : ''} 
                           onchange="window.app?.getModule('goals')?.toggleGoalCompletion(${goal.id})">
                    <span>${this.escapeHtml(goal.title)}</span>
                </div>
                <div class="goal-actions">
                    <button class="btn btn-sm btn-outline" onclick="window.app?.getModule('goals')?.editGoal(${goal.id})">
                        Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.app?.getModule('goals')?.deleteGoal(${goal.id})">
                        Delete
                    </button>
                </div>
            </div>
            <div class="goal-description">${this.escapeHtml(goal.description || '')}</div>
            <div class="goal-meta">
                <span class="goal-category">${goal.category}</span>
                ${goal.deadline ? `<span class="goal-deadline">Due: ${new Date(goal.deadline).toLocaleDateString()}</span>` : ''}
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${goal.progress}%"></div>
                </div>
                <span class="progress-text">${goal.progress}%</span>
            </div>
            <div class="goal-progress-controls">
                <input type="range" min="0" max="100" value="${goal.progress}" 
                       onchange="window.app?.getModule('goals')?.updateGoalProgress(${goal.id}, this.value)">
            </div>
        `;

    return element;
  }

  // Setup goal filters
  setupGoalFilters() {
    const filterButtons = document.querySelectorAll('.goal-filter');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const { filter } = button.dataset;
        this.filterGoals(filter);
      });
    });
  }

  // Filter goals
  filterGoals(filter) {
    const goalsContainer = document.getElementById('goals-list');
    if (!goalsContainer) {return;}

    let filteredGoals = this.goals;

    switch (filter) {
    case 'active':
      filteredGoals = this.goals.filter(g => !g.completed);
      break;
    case 'completed':
      filteredGoals = this.goals.filter(g => g.completed);
      break;
    case 'overdue':
      filteredGoals = this.goals.filter(g => g.deadline && new Date(g.deadline) < new Date() && !g.completed);
      break;
    default:
      // Show all goals
      break;
    }

    goalsContainer.innerHTML = '';
    filteredGoals.forEach(goal => {
      const goalElement = this.createGoalElement(goal);
      goalsContainer.appendChild(goalElement);
    });
  }

  // Create default goals
  createDefaultGoals() {
    const defaultGoals = [
      {
        title: 'Complete onboarding',
        description: 'Set up your profile and explore the app features',
        category: 'Personal',
        progress: 0
      },
      {
        title: 'Set your first goal',
        description: 'Create a meaningful goal to start your journey',
        category: 'Personal',
        progress: 0
      }
    ];

    defaultGoals.forEach(goalData => {
      const goal = {
        id: Date.now() + Math.random(),
        ...goalData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        milestones: [],
        notes: []
      };
      this.goals.push(goal);
    });

    this.saveGoals();
    this.renderGoals();
  }

  // Show goal completion celebration
  showGoalCompletionCelebration(goal, essenceGained) {
    const celebration = document.createElement('div');
    celebration.className = 'celebration-overlay';
    celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <div class="celebration-title">Goal Completed!</div>
                <div class="celebration-message">${goal.title}</div>
                <div class="celebration-reward">+${essenceGained} Essence</div>
            </div>
        `;

    document.body.appendChild(celebration);

    setTimeout(() => {
      celebration.remove();
    }, 3000);
  }

  // Show level up celebration
  showLevelUpCelebration(level) {
    const celebration = document.createElement('div');
    celebration.className = 'celebration-overlay level-up';
    celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🚀</div>
                <div class="celebration-title">Level Up!</div>
                <div class="celebration-message">You reached level ${level}</div>
            </div>
        `;

    document.body.appendChild(celebration);

    setTimeout(() => {
      celebration.remove();
    }, 3000);
  }

  // Update user stats
  updateUserStats() {
    const { userData } = this.core.state;
    userData.totalGoals = this.goals.length;
    userData.completedGoals = this.goals.filter(g => g.completed).length;
    userData.activeGoals = this.goals.filter(g => !g.completed).length;

    // Update UI
    this.updateStatsDisplay();
  }

  // Update stats display
  updateStatsDisplay() {
    const { userData } = this.core.state;

    // Update goal stats
    const totalGoalsElement = document.getElementById('total-goals');
    if (totalGoalsElement) {
      totalGoalsElement.textContent = userData.totalGoals || 0;
    }

    const completedGoalsElement = document.getElementById('completed-goals');
    if (completedGoalsElement) {
      completedGoalsElement.textContent = userData.completedGoals || 0;
    }

    const activeGoalsElement = document.getElementById('active-goals');
    if (activeGoalsElement) {
      activeGoalsElement.textContent = userData.activeGoals || 0;
    }
  }

  // Show error message
  showError(message) {
    // Implementation for showing error messages
    console.error('Goal error:', message);
  }

  // Show success message
  showSuccess(message) {
    // Implementation for showing success messages
    console.log('Goal success:', message);
  }

  // Escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Get goals statistics
  getGoalsStats() {
    return {
      total: this.goals.length,
      completed: this.goals.filter(g => g.completed).length,
      active: this.goals.filter(g => !g.completed).length,
      overdue: this.goals.filter(g => g.deadline && new Date(g.deadline) < new Date() && !g.completed).length,
      categories: this.goals.reduce((acc, goal) => {
        acc[goal.category] = (acc[goal.category] || 0) + 1;
        return acc;
      }, {})
    };
  }

  // Cleanup
  cleanup() {
    this.isInitialized = false;
    this.goals = [];
    console.log('🎯 Goals Module cleanup completed');
  }
}

export default GoalsModule;
