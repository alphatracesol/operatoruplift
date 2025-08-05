/**
 * Phase 4: Enhanced Goal Management System
 * Advanced goal creation, AI suggestions, categories, and tracking
 */

const Phase4Goals = {
  // === GOAL CATEGORIES ===
  categories: {
    productivity: {
      name: 'Productivity',
      icon: '⚡',
      color: 'orange',
      description: 'Work and efficiency goals'
    },
    health: {
      name: 'Health & Fitness',
      icon: '💪',
      color: 'green',
      description: 'Physical and mental wellness'
    },
    learning: {
      name: 'Learning & Growth',
      icon: '📚',
      color: 'blue',
      description: 'Education and skill development'
    },
    creativity: {
      name: 'Creativity',
      icon: '🎨',
      color: 'purple',
      description: 'Artistic and creative pursuits'
    },
    social: {
      name: 'Social & Relationships',
      icon: '🤝',
      color: 'pink',
      description: 'Connections and community'
    },
    finance: {
      name: 'Finance',
      icon: '💰',
      color: 'yellow',
      description: 'Financial goals and planning'
    }
  },

  // === DIFFICULTY LEVELS ===
  difficulties: {
    easy: {
      name: 'Easy',
      xpReward: 50,
      color: 'green',
      description: 'Simple goals that can be completed quickly'
    },
    medium: {
      name: 'Medium',
      xpReward: 100,
      color: 'yellow',
      description: 'Moderate goals requiring some effort'
    },
    hard: {
      name: 'Hard',
      xpReward: 200,
      color: 'orange',
      description: 'Challenging goals requiring significant effort'
    },
    epic: {
      name: 'Epic',
      xpReward: 500,
      color: 'purple',
      description: 'Major goals that transform your life'
    }
  },

  // === AI GOAL SUGGESTIONS ===
  aiSuggestions: {
    // Get personalized goal suggestions based on user data
    getSuggestions(userData) {
      const suggestions = [];
      const personality = userData?.personality || {};
      const currentGoals = userData?.goals || [];
      const completedGoals = userData?.goals?.completed || [];

      // Productivity suggestions
      if (personality.productivityFocus) {
        suggestions.push({
          title: 'Optimize Daily Routine',
          description: 'Create a morning routine that maximizes your productivity',
          category: 'productivity',
          difficulty: 'medium',
          estimatedTime: '2 weeks',
          aiReason: 'Based on your productivity focus, this will help you start each day with purpose'
        });
      }

      // Health suggestions
      if (!completedGoals.some(g => g.category === 'health')) {
        suggestions.push({
          title: 'Start a Fitness Habit',
          description: 'Begin with 10 minutes of daily exercise',
          category: 'health',
          difficulty: 'easy',
          estimatedTime: '1 month',
          aiReason: 'Building a foundation for long-term health and wellness'
        });
      }

      // Learning suggestions
      if (personality.learningStyle === 'visual') {
        suggestions.push({
          title: 'Learn a New Skill',
          description: 'Pick up a visual skill like photography or design',
          category: 'learning',
          difficulty: 'medium',
          estimatedTime: '3 months',
          aiReason: 'Your visual learning style makes this a perfect fit'
        });
      }

      // Social suggestions
      if (personality.socialPreference === 'introvert') {
        suggestions.push({
          title: 'Deepen Existing Relationships',
          description: 'Strengthen connections with close friends and family',
          category: 'social',
          difficulty: 'easy',
          estimatedTime: 'Ongoing',
          aiReason: 'Focus on quality over quantity in your social connections'
        });
      }

      // Finance suggestions
      if (!completedGoals.some(g => g.category === 'finance')) {
        suggestions.push({
          title: 'Create a Budget',
          description: 'Track your income and expenses for one month',
          category: 'finance',
          difficulty: 'medium',
          estimatedTime: '1 month',
          aiReason: 'Financial awareness is the first step to financial freedom'
        });
      }

      return suggestions.slice(0, 5); // Return top 5 suggestions
    },

    // Generate goal based on user input
    generateGoal(userInput, userData) {
      const personality = userData?.personality || {};

      // Analyze user input for category and difficulty
      const category = this.analyzeCategory(userInput);
      const difficulty = this.analyzeDifficulty(userInput, personality);

      return {
        title: this.generateTitle(userInput),
        description: this.generateDescription(userInput),
        category,
        difficulty,
        estimatedTime: this.estimateTime(difficulty, category),
        milestones: this.generateMilestones(userInput, difficulty),
        aiReason: this.generateReason(userInput, category, personality)
      };
    },

    // Analyze user input to determine category
    analyzeCategory(input) {
      const inputLower = input.toLowerCase();

      if (inputLower.includes('work') || inputLower.includes('productivity') || inputLower.includes('efficiency')) {
        return 'productivity';
      } else if (inputLower.includes('health') || inputLower.includes('fitness') || inputLower.includes('exercise')) {
        return 'health';
      } else if (inputLower.includes('learn') || inputLower.includes('study') || inputLower.includes('skill')) {
        return 'learning';
      } else if (inputLower.includes('creative') || inputLower.includes('art') || inputLower.includes('design')) {
        return 'creativity';
      } else if (inputLower.includes('social') || inputLower.includes('friend') || inputLower.includes('relationship')) {
        return 'social';
      } else if (inputLower.includes('money') || inputLower.includes('finance') || inputLower.includes('budget')) {
        return 'finance';
      }

      return 'productivity'; // Default
    },

    // Analyze difficulty based on input and personality
    analyzeDifficulty(input, personality) {
      const inputLower = input.toLowerCase();

      if (inputLower.includes('start') || inputLower.includes('begin') || inputLower.includes('simple')) {
        return 'easy';
      } else if (inputLower.includes('master') || inputLower.includes('expert') || inputLower.includes('transform')) {
        return 'epic';
      } else if (personality.confidence === 'high') {
        return 'hard';
      }

      return 'medium'; // Default
    },

    // Generate goal title
    generateTitle(input) {
      // Extract key words and create a compelling title
      const words = input.split(' ').filter(word => word.length > 3);
      if (words.length >= 2) {
        return `${words[0].charAt(0).toUpperCase() + words[0].slice(1)} ${words[1]}`;
      }
      return input.charAt(0).toUpperCase() + input.slice(1);
    },

    // Generate goal description
    generateDescription(input) {
      return `Work towards: ${input}`;
    },

    // Estimate completion time
    estimateTime(difficulty, category) {
      const baseTimes = {
        easy: '1 week',
        medium: '1 month',
        hard: '3 months',
        epic: '6 months'
      };
      return baseTimes[difficulty] || '1 month';
    },

    // Generate milestones
    generateMilestones(input, difficulty) {
      const milestoneCount = {
        easy: 2,
        medium: 3,
        hard: 4,
        epic: 5
      };

      const count = milestoneCount[difficulty] || 3;
      const milestones = [];

      for (let i = 1; i <= count; i++) {
        milestones.push({
          id: `milestone_${i}`,
          title: `Milestone ${i}`,
          description: `Complete step ${i} of your goal`,
          completed: false,
          xpReward: 25 * i
        });
      }

      return milestones;
    },

    // Generate AI reason
    generateReason(input, category, personality) {
      const reasons = {
        productivity: 'This will help you become more efficient and achieve more in less time.',
        health: 'Taking care of your health is the foundation for all other achievements.',
        learning: 'Continuous learning keeps your mind sharp and opens new opportunities.',
        creativity: 'Creative pursuits bring joy and help you express yourself uniquely.',
        social: 'Strong relationships are key to happiness and personal growth.',
        finance: 'Financial awareness and planning create security and freedom.'
      };

      return reasons[category] || 'This goal aligns with your personal growth journey.';
    }
  },

  // === ENHANCED GOAL CREATION ===
  createGoal(goalData) {
    const goal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: goalData.title,
      description: goalData.description,
      category: goalData.category,
      difficulty: goalData.difficulty,
      estimatedTime: goalData.estimatedTime,
      milestones: goalData.milestones || [],
      aiReason: goalData.aiReason,
      createdAt: new Date().toISOString(),
      completedAt: null,
      progress: 0,
      status: 'active',
      tags: goalData.tags || [],
      xpReward: this.difficulties[goalData.difficulty]?.xpReward || 100,
      streak: 0,
      lastActivity: null
    };

    // Add to user data
    if (!app.state.userData.goals) {
      app.state.userData.goals = [];
    }
    app.state.userData.goals.push(goal);

    // Save to storage
    app.saveUserData();

    // Trigger Phase 4 gamification
    if (window.Phase4Gamification) {
      Phase4Gamification.xpSystem.addXP(25, 'Goal Created');
    }

    console.log('🎯 Goal created:', goal);
    return goal;
  },

  // === GOAL COMPLETION ===
  completeGoal(goalId) {
    const goal = app.state.userData.goals.find(g => g.id === goalId);
    if (!goal) {return;}

    goal.status = 'completed';
    goal.completedAt = new Date().toISOString();
    goal.progress = 100;

    // Award XP based on difficulty
    const xpReward = goal.xpReward || this.difficulties[goal.difficulty]?.xpReward || 100;

    if (window.Phase4Gamification) {
      Phase4Gamification.onGoalComplete(goal);
    }

    // Update user stats
    if (!app.state.userData.stats.goalsCompleted) {
      app.state.userData.stats.goalsCompleted = 0;
    }
    app.state.userData.stats.goalsCompleted++;

    // Save data
    app.saveUserData();

    // Show completion celebration
    this.showGoalCompletion(goal);

    console.log('✅ Goal completed:', goal.title);
  },

  // === MILESTONE COMPLETION ===
  completeMilestone(goalId, milestoneId) {
    const goal = app.state.userData.goals.find(g => g.id === goalId);
    if (!goal) {return;}

    const milestone = goal.milestones.find(m => m.id === milestoneId);
    if (!milestone || milestone.completed) {return;}

    milestone.completed = true;
    milestone.completedAt = new Date().toISOString();

    // Update goal progress
    const completedMilestones = goal.milestones.filter(m => m.completed).length;
    goal.progress = Math.round((completedMilestones / goal.milestones.length) * 100);

    // Award milestone XP
    if (window.Phase4Gamification) {
      Phase4Gamification.xpSystem.addXP(milestone.xpReward, `Milestone: ${milestone.title}`);
    }

    // Check if goal is complete
    if (goal.progress >= 100) {
      this.completeGoal(goalId);
    }

    // Save data
    app.saveUserData();

    // Show milestone completion
    this.showMilestoneCompletion(milestone);

    console.log('🎯 Milestone completed:', milestone.title);
  },

  // === GOAL TRACKING ===
  updateGoalProgress(goalId, progress) {
    const goal = app.state.userData.goals.find(g => g.id === goalId);
    if (!goal) {return;}

    goal.progress = Math.max(0, Math.min(100, progress));
    goal.lastActivity = new Date().toISOString();

    // Update streak
    const today = new Date().toDateString();
    const lastActivity = goal.lastActivity ? new Date(goal.lastActivity).toDateString() : null;

    if (lastActivity === today) {
      // Already updated today
    } else if (lastActivity === new Date(Date.now() - 86400000).toDateString()) {
      // Continue streak
      goal.streak++;
    } else {
      // Break streak
      goal.streak = 1;
    }

    // Save data
    app.saveUserData();

    // Update UI
    this.updateGoalDisplay(goal);
  },

  // === UI COMPONENTS ===
  showGoalCompletion(goal) {
    const celebration = document.createElement('div');
    celebration.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    celebration.innerHTML = `
            <div class="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 rounded-lg text-center max-w-md mx-4">
                <div class="text-6xl mb-4">🎉</div>
                <div class="text-2xl font-bold mb-2">Goal Completed!</div>
                <div class="text-lg mb-4">${goal.title}</div>
                <div class="text-sm mb-4 opacity-90">${goal.description}</div>
                <div class="bg-white bg-opacity-20 p-3 rounded-lg mb-4">
                    <div class="text-sm">Difficulty: ${this.difficulties[goal.difficulty]?.name}</div>
                    <div class="text-sm">XP Earned: ${goal.xpReward}</div>
                </div>
                <button class="bg-white text-green-500 px-6 py-2 rounded-lg font-bold hover:bg-gray-100">
                    Continue
                </button>
            </div>
        `;

    document.body.appendChild(celebration);

    celebration.querySelector('button').addEventListener('click', () => {
      celebration.remove();
    });
  },

  showMilestoneCompletion(milestone) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-xl">🎯</span>
                <div>
                    <div class="font-bold">Milestone Reached!</div>
                    <div class="text-sm">${milestone.title}</div>
                </div>
            </div>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  },

  updateGoalDisplay(goal) {
    const goalElement = document.querySelector(`[data-goal-id="${goal.id}"]`);
    if (!goalElement) {return;}

    // Update progress bar
    const progressBar = goalElement.querySelector('.goal-progress');
    if (progressBar) {
      progressBar.style.width = `${goal.progress}%`;
    }

    // Update progress text
    const progressText = goalElement.querySelector('.goal-progress-text');
    if (progressText) {
      progressText.textContent = `${goal.progress}%`;
    }

    // Update streak
    const streakElement = goalElement.querySelector('.goal-streak');
    if (streakElement) {
      streakElement.textContent = `${goal.streak} day streak`;
    }
  },

  // === GOAL TEMPLATES ===
  templates: {
    productivity: [
      {
        title: 'Morning Routine Master',
        description: 'Create and stick to a productive morning routine',
        difficulty: 'medium',
        estimatedTime: '1 month',
        milestones: [
          { title: 'Design your routine', description: 'Plan your ideal morning' },
          { title: 'Week 1 success', description: 'Complete routine for 7 days' },
          { title: 'Month milestone', description: 'Maintain routine for 30 days' }
        ]
      },
      {
        title: 'Time Block Master',
        description: 'Implement time blocking for better productivity',
        difficulty: 'hard',
        estimatedTime: '2 months',
        milestones: [
          { title: 'Learn time blocking', description: 'Study the technique' },
          { title: 'Create first schedule', description: 'Plan your first week' },
          { title: 'Week 1 execution', description: 'Follow schedule for 7 days' },
          { title: 'Month mastery', description: 'Maintain for 30 days' }
        ]
      }
    ],
    health: [
      {
        title: 'Fitness Foundation',
        description: 'Build a consistent exercise habit',
        difficulty: 'medium',
        estimatedTime: '2 months',
        milestones: [
          { title: 'Start small', description: 'Exercise 3 times this week' },
          { title: 'Build consistency', description: 'Exercise 3x/week for 2 weeks' },
          { title: 'Month milestone', description: 'Maintain for 30 days' }
        ]
      }
    ],
    learning: [
      {
        title: 'Skill Builder',
        description: 'Learn a new skill or technology',
        difficulty: 'medium',
        estimatedTime: '3 months',
        milestones: [
          { title: 'Research phase', description: 'Choose and research your skill' },
          { title: 'Begin learning', description: 'Start with basics' },
          { title: 'Practice phase', description: 'Apply what you learn' },
          { title: 'Project completion', description: 'Complete a project' }
        ]
      }
    ]
  },

  // === INITIALIZATION ===
  init() {
    console.log('🎯 Initializing Phase 4 Goal Management...');

    // Initialize goal templates
    this.loadTemplates();

    // Set up event listeners
    this.setupEventListeners();

    console.log('✅ Phase 4 Goal Management initialized');
  },

  loadTemplates() {
    // Templates are already defined in the templates object
    console.log('📋 Goal templates loaded');
  },

  setupEventListeners() {
    // Event listeners will be set up when the UI is rendered
    console.log('🎧 Goal event listeners ready');
  }
};

// Export for global access
window.Phase4Goals = Phase4Goals;
