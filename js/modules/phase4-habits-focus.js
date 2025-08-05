/**
 * Phase 4: Enhanced Habits & Focus System
 * Advanced habit tracking, focus sessions, and AI-powered suggestions
 */

const Phase4HabitsFocus = {
  // === HABIT CATEGORIES ===
  habitCategories: {
    health: {
      name: 'Health & Wellness',
      icon: '💪',
      color: 'green',
      description: 'Physical and mental health habits'
    },
    productivity: {
      name: 'Productivity',
      icon: '⚡',
      color: 'orange',
      description: 'Work and efficiency habits'
    },
    learning: {
      name: 'Learning',
      icon: '📚',
      color: 'blue',
      description: 'Education and skill development'
    },
    creativity: {
      name: 'Creativity',
      icon: '🎨',
      color: 'purple',
      description: 'Creative and artistic pursuits'
    },
    social: {
      name: 'Social',
      icon: '🤝',
      color: 'pink',
      description: 'Relationships and communication'
    },
    mindfulness: {
      name: 'Mindfulness',
      icon: '🧘',
      color: 'indigo',
      description: 'Meditation and self-awareness'
    }
  },

  // === HABIT FREQUENCIES ===
  frequencies: {
    daily: {
      name: 'Daily',
      value: 1,
      description: 'Every day'
    },
    weekly: {
      name: 'Weekly',
      value: 7,
      description: 'Once per week'
    },
    biweekly: {
      name: 'Bi-weekly',
      value: 14,
      description: 'Every 2 weeks'
    },
    monthly: {
      name: 'Monthly',
      value: 30,
      description: 'Once per month'
    }
  },

  // === AI HABIT SUGGESTIONS ===
  aiHabitSuggestions: {
    // Get personalized habit suggestions
    getSuggestions(userData) {
      const suggestions = [];
      const personality = userData?.personality || {};
      const currentHabits = userData?.habits || [];
      const completedHabits = userData?.habits?.completed || [];

      // Health suggestions
      if (!currentHabits.some(h => h.category === 'health')) {
        suggestions.push({
          title: 'Morning Hydration',
          description: 'Drink a glass of water first thing in the morning',
          category: 'health',
          frequency: 'daily',
          aiReason: 'Hydration is essential for energy and focus throughout the day',
          estimatedTime: '2 minutes',
          difficulty: 'easy'
        });
      }

      // Productivity suggestions
      if (personality.productivityFocus) {
        suggestions.push({
          title: 'Evening Planning',
          description: 'Plan tomorrow\'s top 3 priorities before bed',
          category: 'productivity',
          frequency: 'daily',
          aiReason: 'Planning ahead helps you start each day with clear direction',
          estimatedTime: '5 minutes',
          difficulty: 'easy'
        });
      }

      // Learning suggestions
      if (personality.learningStyle === 'visual') {
        suggestions.push({
          title: 'Visual Learning',
          description: 'Create mind maps or diagrams for new concepts',
          category: 'learning',
          frequency: 'weekly',
          aiReason: 'Your visual learning style makes this highly effective',
          estimatedTime: '15 minutes',
          difficulty: 'medium'
        });
      }

      // Mindfulness suggestions
      if (personality.stressLevel === 'high') {
        suggestions.push({
          title: 'Breathing Exercise',
          description: 'Practice deep breathing for 5 minutes daily',
          category: 'mindfulness',
          frequency: 'daily',
          aiReason: 'Helps reduce stress and improve mental clarity',
          estimatedTime: '5 minutes',
          difficulty: 'easy'
        });
      }

      // Social suggestions
      if (personality.socialPreference === 'introvert') {
        suggestions.push({
          title: 'Quality Connection',
          description: 'Have one meaningful conversation per week',
          category: 'social',
          frequency: 'weekly',
          aiReason: 'Focus on depth over breadth in your social connections',
          estimatedTime: '30 minutes',
          difficulty: 'medium'
        });
      }

      return suggestions.slice(0, 5); // Return top 5 suggestions
    },

    // Generate habit based on user input
    generateHabit(userInput, userData) {
      const personality = userData?.personality || {};

      return {
        title: this.generateTitle(userInput),
        description: this.generateDescription(userInput),
        category: this.analyzeCategory(userInput),
        frequency: this.analyzeFrequency(userInput),
        estimatedTime: this.estimateTime(userInput),
        difficulty: this.analyzeDifficulty(userInput, personality),
        aiReason: this.generateReason(userInput, personality)
      };
    },

    // Analyze category from input
    analyzeCategory(input) {
      const inputLower = input.toLowerCase();

      if (inputLower.includes('exercise') || inputLower.includes('workout') || inputLower.includes('health')) {
        return 'health';
      } else if (inputLower.includes('work') || inputLower.includes('productivity') || inputLower.includes('plan')) {
        return 'productivity';
      } else if (inputLower.includes('read') || inputLower.includes('learn') || inputLower.includes('study')) {
        return 'learning';
      } else if (inputLower.includes('meditate') || inputLower.includes('breathe') || inputLower.includes('mindful')) {
        return 'mindfulness';
      } else if (inputLower.includes('call') || inputLower.includes('talk') || inputLower.includes('social')) {
        return 'social';
      }

      return 'productivity'; // Default
    },

    // Analyze frequency from input
    analyzeFrequency(input) {
      const inputLower = input.toLowerCase();

      if (inputLower.includes('daily') || inputLower.includes('every day') || inputLower.includes('morning')) {
        return 'daily';
      } else if (inputLower.includes('weekly') || inputLower.includes('once a week')) {
        return 'weekly';
      } else if (inputLower.includes('monthly') || inputLower.includes('once a month')) {
        return 'monthly';
      }

      return 'daily'; // Default
    },

    // Estimate time required
    estimateTime(input) {
      const inputLower = input.toLowerCase();

      if (inputLower.includes('quick') || inputLower.includes('5 min') || inputLower.includes('short')) {
        return '5 minutes';
      } else if (inputLower.includes('30 min') || inputLower.includes('half hour')) {
        return '30 minutes';
      } else if (inputLower.includes('hour') || inputLower.includes('60 min')) {
        return '1 hour';
      }

      return '15 minutes'; // Default
    },

    // Analyze difficulty
    analyzeDifficulty(input, personality) {
      const inputLower = input.toLowerCase();

      if (inputLower.includes('easy') || inputLower.includes('simple') || inputLower.includes('quick')) {
        return 'easy';
      } else if (inputLower.includes('challenging') || inputLower.includes('difficult') || inputLower.includes('hard')) {
        return 'hard';
      }

      return 'medium'; // Default
    },

    // Generate title
    generateTitle(input) {
      const words = input.split(' ').filter(word => word.length > 3);
      if (words.length >= 2) {
        return `${words[0].charAt(0).toUpperCase() + words[0].slice(1)} ${words[1]}`;
      }
      return input.charAt(0).toUpperCase() + input.slice(1);
    },

    // Generate description
    generateDescription(input) {
      return `Practice: ${input}`;
    },

    // Generate AI reason
    generateReason(input, personality) {
      const reasons = {
        health: 'Taking care of your health is the foundation for all other achievements.',
        productivity: 'This will help you become more efficient and achieve more.',
        learning: 'Continuous learning keeps your mind sharp and opens new opportunities.',
        mindfulness: 'Mindfulness practices improve focus and reduce stress.',
        social: 'Strong relationships are key to happiness and personal growth.',
        creativity: 'Creative habits help you express yourself and find joy.'
      };

      const category = this.analyzeCategory(input);
      return reasons[category] || 'This habit will contribute to your personal growth.';
    }
  },

  // === ENHANCED HABIT CREATION ===
  createHabit(habitData) {
    const habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: habitData.title,
      description: habitData.description,
      category: habitData.category,
      frequency: habitData.frequency,
      estimatedTime: habitData.estimatedTime,
      difficulty: habitData.difficulty,
      aiReason: habitData.aiReason,
      createdAt: new Date().toISOString(),
      completedAt: null,
      status: 'active',
      streak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      lastCompleted: null,
      nextDue: this.calculateNextDue(habitData.frequency),
      reminders: habitData.reminders || [],
      tags: habitData.tags || []
    };

    // Add to user data
    if (!app.state.userData.habits) {
      app.state.userData.habits = [];
    }
    app.state.userData.habits.push(habit);

    // Save to storage
    app.saveUserData();

    // Trigger Phase 4 gamification
    if (window.Phase4Gamification) {
      Phase4Gamification.xpSystem.addXP(25, 'Habit Created');
    }

    console.log('💪 Habit created:', habit);
    return habit;
  },

  // === HABIT COMPLETION ===
  completeHabit(habitId) {
    const habit = app.state.userData.habits.find(h => h.id === habitId);
    if (!habit) {return;}

    const today = new Date().toDateString();
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;

    // Check if already completed today
    if (lastCompleted === today) {
      console.log('Habit already completed today');
      return;
    }

    // Update habit data
    habit.totalCompletions++;
    habit.lastCompleted = new Date().toISOString();
    habit.nextDue = this.calculateNextDue(habit.frequency);

    // Update streak
    if (lastCompleted === new Date(Date.now() - 86400000).toDateString()) {
      // Continue streak
      habit.streak++;
    } else if (lastCompleted !== today) {
      // Break streak
      if (habit.streak > habit.longestStreak) {
        habit.longestStreak = habit.streak;
      }
      habit.streak = 1;
    }

    // Award XP based on streak
    const baseXP = 25;
    const streakBonus = Math.min(habit.streak * 5, 50); // Max 50 bonus XP
    const totalXP = baseXP + streakBonus;

    // Trigger Phase 4 gamification
    if (window.Phase4Gamification) {
      Phase4Gamification.onHabitComplete(habit);
    }

    // Update user stats
    if (!app.state.userData.stats.habitsCompleted) {
      app.state.userData.stats.habitsCompleted = 0;
    }
    app.state.userData.stats.habitsCompleted++;

    // Save data
    app.saveUserData();

    // Show completion notification
    this.showHabitCompletion(habit, totalXP);

    console.log('✅ Habit completed:', habit.title, `Streak: ${habit.streak}`);
  },

  // === FOCUS SESSION SYSTEM ===
  focusSessions: {
    // Create a new focus session
    createSession(sessionData) {
      const session = {
        id: `focus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: sessionData.title,
        description: sessionData.description,
        duration: sessionData.duration || 25, // Default 25 minutes
        category: sessionData.category || 'work',
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        status: 'pending', // pending, active, completed, interrupted
        interruptions: 0,
        notes: sessionData.notes || ''
      };

      // Add to user data
      if (!app.state.userData.focusSessions) {
        app.state.userData.focusSessions = [];
      }
      app.state.userData.focusSessions.push(session);

      // Save to storage
      app.saveUserData();

      console.log('🎯 Focus session created:', session);
      return session;
    },

    // Start a focus session
    startSession(sessionId) {
      const session = app.state.userData.focusSessions.find(s => s.id === sessionId);
      if (!session || session.status !== 'pending') {return;}

      session.status = 'active';
      session.startedAt = new Date().toISOString();

      // Save data
      app.saveUserData();

      // Start timer
      this.startTimer(session);

      console.log('🎯 Focus session started:', session.title);
    },

    // Complete a focus session
    completeSession(sessionId) {
      const session = app.state.userData.focusSessions.find(s => s.id === sessionId);
      if (!session || session.status !== 'active') {return;}

      session.status = 'completed';
      session.completedAt = new Date().toISOString();

      // Calculate XP based on duration and interruptions
      const baseXP = Math.floor(session.duration / 5); // 5 XP per 5 minutes
      const interruptionPenalty = session.interruptions * 5;
      const totalXP = Math.max(baseXP - interruptionPenalty, 10); // Minimum 10 XP

      // Trigger Phase 4 gamification
      if (window.Phase4Gamification) {
        Phase4Gamification.onFocusComplete(session);
      }

      // Update user stats
      if (!app.state.userData.stats.focusSessionsCompleted) {
        app.state.userData.stats.focusSessionsCompleted = 0;
      }
      app.state.userData.stats.focusSessionsCompleted++;

      // Save data
      app.saveUserData();

      // Show completion notification
      Phase4HabitsFocus.showFocusCompletion(session, totalXP);

      console.log('✅ Focus session completed:', session.title);
    },

    // Interrupt a focus session
    interruptSession(sessionId) {
      const session = app.state.userData.focusSessions.find(s => s.id === sessionId);
      if (!session || session.status !== 'active') {return;}

      session.interruptions++;
      session.status = 'interrupted';

      // Save data
      app.saveUserData();

      console.log('⚠️ Focus session interrupted:', session.title);
    },

    // Start timer for focus session
    startTimer(session) {
      const duration = session.duration * 60 * 1000; // Convert to milliseconds
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = duration - elapsed;

        if (remaining <= 0) {
          clearInterval(timer);
          this.completeSession(session.id);
        } else {
          // Update timer display
          this.updateTimerDisplay(remaining);
        }
      }, 1000);

      // Store timer reference
      session.timer = timer;
    },

    // Update timer display
    updateTimerDisplay(remainingMs) {
      const minutes = Math.floor(remainingMs / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000);

      const timerElement = document.getElementById('focus-timer');
      if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }
  },

  // === UTILITY FUNCTIONS ===
  calculateNextDue(frequency) {
    const now = new Date();
    const frequencyDays = Phase4HabitsFocus.frequencies[frequency]?.value || 1;

    const nextDue = new Date(now);
    nextDue.setDate(now.getDate() + frequencyDays);

    return nextDue.toISOString();
  },

  // === UI COMPONENTS ===
  showHabitCompletion(habit, xpEarned) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-xl">💪</span>
                <div>
                    <div class="font-bold">Habit Completed!</div>
                    <div class="text-sm">${habit.title}</div>
                    <div class="text-xs opacity-90">Streak: ${habit.streak} days | +${xpEarned} XP</div>
                </div>
            </div>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  },

  showFocusCompletion(session, xpEarned) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-xl">🎯</span>
                <div>
                    <div class="font-bold">Focus Session Complete!</div>
                    <div class="text-sm">${session.title}</div>
                    <div class="text-xs opacity-90">Duration: ${session.duration}min | +${xpEarned} XP</div>
                </div>
            </div>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  },

  // === HABIT TEMPLATES ===
  templates: {
    health: [
      {
        title: 'Morning Exercise',
        description: 'Start your day with 10 minutes of exercise',
        category: 'health',
        frequency: 'daily',
        estimatedTime: '10 minutes',
        difficulty: 'easy'
      },
      {
        title: 'Hydration Goal',
        description: 'Drink 8 glasses of water daily',
        category: 'health',
        frequency: 'daily',
        estimatedTime: 'Throughout day',
        difficulty: 'easy'
      }
    ],
    productivity: [
      {
        title: 'Evening Planning',
        description: 'Plan tomorrow\'s top 3 priorities',
        category: 'productivity',
        frequency: 'daily',
        estimatedTime: '5 minutes',
        difficulty: 'easy'
      },
      {
        title: 'Time Blocking',
        description: 'Use time blocking for focused work',
        category: 'productivity',
        frequency: 'daily',
        estimatedTime: '5 minutes',
        difficulty: 'medium'
      }
    ],
    mindfulness: [
      {
        title: 'Morning Meditation',
        description: 'Practice 5 minutes of meditation',
        category: 'mindfulness',
        frequency: 'daily',
        estimatedTime: '5 minutes',
        difficulty: 'easy'
      },
      {
        title: 'Gratitude Journal',
        description: 'Write 3 things you\'re grateful for',
        category: 'mindfulness',
        frequency: 'daily',
        estimatedTime: '3 minutes',
        difficulty: 'easy'
      }
    ]
  },

  // === INITIALIZATION ===
  init() {
    console.log('💪 Initializing Phase 4 Habits & Focus System...');

    // Initialize templates
    this.loadTemplates();

    // Set up event listeners
    this.setupEventListeners();

    console.log('✅ Phase 4 Habits & Focus System initialized');
  },

  loadTemplates() {
    console.log('📋 Habit templates loaded');
  },

  setupEventListeners() {
    console.log('🎧 Habit event listeners ready');
  }
};

// Export for global access
window.Phase4HabitsFocus = Phase4HabitsFocus;
