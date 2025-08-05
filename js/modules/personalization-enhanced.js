/**
 * Enhanced Personalization Module - Operator Uplift
 * Advanced user profiling, preferences management, and AI adaptation
 * @author Operator Uplift Team
 * @version 2.0.0
 */

class EnhancedPersonalizationModule {
  constructor() {
    this.userProfile = null;
    this.preferences = {};
    this.personalityTraits = {};
    this.learningPatterns = {};
    this.goalHistory = [];
    this.achievementHistory = [];
    this.interactionHistory = [];

    // Personality assessment questions
    this.assessmentQuestions = [
      {
        id: 'motivation_style',
        question: 'What motivates you most?',
        options: [
          { value: 'achievement', label: 'Achieving goals and milestones' },
          { value: 'recognition', label: 'Recognition and praise' },
          { value: 'mastery', label: 'Learning and skill development' },
          { value: 'purpose', label: 'Making a meaningful impact' }
        ]
      },
      {
        id: 'communication_style',
        question: 'How do you prefer to receive feedback?',
        options: [
          { value: 'direct', label: 'Direct and straightforward' },
          { value: 'encouraging', label: 'Encouraging and supportive' },
          { value: 'detailed', label: 'Detailed and analytical' },
          { value: 'visual', label: 'Visual and interactive' }
        ]
      },
      {
        id: 'work_style',
        question: 'What\'s your preferred work approach?',
        options: [
          { value: 'structured', label: 'Structured and planned' },
          { value: 'flexible', label: 'Flexible and adaptive' },
          { value: 'collaborative', label: 'Collaborative and team-based' },
          { value: 'independent', label: 'Independent and self-directed' }
        ]
      },
      {
        id: 'stress_response',
        question: 'How do you typically handle stress?',
        options: [
          { value: 'action', label: 'Take immediate action' },
          { value: 'reflection', label: 'Reflect and plan carefully' },
          { value: 'support', label: 'Seek support and guidance' },
          { value: 'break', label: 'Take breaks and recharge' }
        ]
      },
      {
        id: 'goal_focus',
        question: 'What type of goals do you find most engaging?',
        options: [
          { value: 'short_term', label: 'Short-term and immediate' },
          { value: 'long_term', label: 'Long-term and strategic' },
          { value: 'challenging', label: 'Challenging and ambitious' },
          { value: 'practical', label: 'Practical and achievable' }
        ]
      }
    ];

    // Initialize the module
    this.init();
  }

  /**
     * Initialize the enhanced personalization module
     */
  async init() {
    try {
      console.log('🚀 Initializing Enhanced Personalization Module...');

      // Load existing user profile
      await this.loadUserProfile();

      // Load preferences and settings
      await this.loadPreferences();

      // Load interaction history
      await this.loadInteractionHistory();

      // Check if onboarding is needed
      if (!this.userProfile || !this.userProfile.onboardingComplete) {
        this.showOnboardingModal();
      }

      console.log('✅ Enhanced Personalization Module initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize Enhanced Personalization Module:', error);
      this.handleError(error, 'Personalization Module Initialization');
    }
  }

  /**
     * Load user profile from localStorage
     */
  async loadUserProfile() {
    try {
      const profileData = localStorage.getItem('operator_uplift_user_profile');
      if (profileData) {
        this.userProfile = JSON.parse(profileData);
        console.log('👤 User profile loaded:', this.userProfile.name);
      } else {
        // Create default profile
        this.userProfile = this.createDefaultProfile();
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      this.userProfile = this.createDefaultProfile();
    }
  }

  /**
     * Create default user profile
     */
  createDefaultProfile() {
    return {
      id: this.generateUserId(),
      name: 'Operator',
      email: '',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      onboardingComplete: false,
      personality: {
        motivationStyle: 'achievement',
        communicationStyle: 'encouraging',
        workStyle: 'structured',
        stressResponse: 'action',
        goalFocus: 'short_term'
      },
      preferences: {
        theme: 'dark',
        notifications: true,
        soundEffects: true,
        autoSave: true,
        privacyLevel: 'standard'
      },
      experience: {
        level: 'beginner',
        totalGoals: 0,
        completedGoals: 0,
        streakDays: 0,
        totalEssence: 0
      },
      goals: [],
      achievements: [],
      learningPatterns: {
        preferredTime: 'morning',
        sessionLength: 'medium',
        difficultyPreference: 'gradual',
        feedbackStyle: 'immediate'
      }
    };
  }

  /**
     * Generate unique user ID
     */
  generateUserId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
     * Load user preferences
     */
  async loadPreferences() {
    try {
      const prefsData = localStorage.getItem('operator_uplift_preferences');
      if (prefsData) {
        this.preferences = JSON.parse(prefsData);
      } else {
        this.preferences = this.userProfile.preferences;
      }
    } catch (error) {
      console.error('❌ Error loading preferences:', error);
      this.preferences = this.userProfile.preferences;
    }
  }

  /**
     * Load interaction history
     */
  async loadInteractionHistory() {
    try {
      const historyData = localStorage.getItem('operator_uplift_interaction_history');
      if (historyData) {
        this.interactionHistory = JSON.parse(historyData);
      }
    } catch (error) {
      console.error('❌ Error loading interaction history:', error);
      this.interactionHistory = [];
    }
  }

  /**
     * Show onboarding modal for new users
     */
  showOnboardingModal() {
    const modal = this.createOnboardingModal();
    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('show');
    }, 100);
  }

  /**
     * Create onboarding modal
     */
  createOnboardingModal() {
    const modal = document.createElement('div');
    modal.className = 'onboarding-modal';
    modal.innerHTML = `
            <div class="onboarding-overlay"></div>
            <div class="onboarding-content">
                <div class="onboarding-header">
                    <h2>Welcome to Operator Uplift! 🚀</h2>
                    <p>Let's personalize your experience</p>
                </div>
                
                <div class="onboarding-steps">
                    <div class="step active" data-step="1">
                        <h3>Step 1: Basic Information</h3>
                        <div class="form-group">
                            <label for="user-name">What should we call you?</label>
                            <input type="text" id="user-name" placeholder="Enter your name" value="${this.userProfile.name}">
                        </div>
                        <div class="form-group">
                            <label for="user-email">Email (optional)</label>
                            <input type="email" id="user-email" placeholder="Enter your email">
                        </div>
                    </div>
                    
                    <div class="step" data-step="2">
                        <h3>Step 2: Personality Assessment</h3>
                        <p>Help us understand your preferences to provide a better experience.</p>
                        <div id="personality-questions"></div>
                    </div>
                    
                    <div class="step" data-step="3">
                        <h3>Step 3: Goal Preferences</h3>
                        <div class="form-group">
                            <label>What areas would you like to focus on?</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" value="productivity"> Productivity</label>
                                <label><input type="checkbox" value="health"> Health & Fitness</label>
                                <label><input type="checkbox" value="learning"> Learning & Skills</label>
                                <label><input type="checkbox" value="relationships"> Relationships</label>
                                <label><input type="checkbox" value="finance"> Finance</label>
                                <label><input type="checkbox" value="creativity"> Creativity</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step" data-step="4">
                        <h3>Step 4: Preferences</h3>
                        <div class="form-group">
                            <label>Choose your theme:</label>
                            <div class="theme-options">
                                <button class="theme-option active" data-theme="dark">🌙 Dark</button>
                                <button class="theme-option" data-theme="light">☀️ Light</button>
                                <button class="theme-option" data-theme="auto">🔄 Auto</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Notification preferences:</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" checked> Daily reminders</label>
                                <label><input type="checkbox" checked> Goal progress updates</label>
                                <label><input type="checkbox" checked> Achievement notifications</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="onboarding-navigation">
                    <button class="btn-prev" onclick="window.app.getModule('personalization').prevStep()">Previous</button>
                    <div class="step-indicators">
                        <span class="indicator active" data-step="1"></span>
                        <span class="indicator" data-step="2"></span>
                        <span class="indicator" data-step="3"></span>
                        <span class="indicator" data-step="4"></span>
                    </div>
                    <button class="btn-next" onclick="window.app.getModule('personalization').nextStep()">Next</button>
                </div>
            </div>
        `;

    // Setup event listeners
    this.setupOnboardingEventListeners(modal);

    return modal;
  }

  /**
     * Setup onboarding event listeners
     */
  setupOnboardingEventListeners(modal) {
    // Theme selection
    const themeOptions = modal.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        this.preferences.theme = option.dataset.theme;
      });
    });

    // Form validation
    const inputs = modal.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.validateOnboardingStep();
      });
    });
  }

  /**
     * Navigate to next onboarding step
     */
  nextStep() {
    const currentStep = document.querySelector('.step.active');
    const currentStepNum = parseInt(currentStep.dataset.step);

    if (currentStepNum === 4) {
      this.completeOnboarding();
      return;
    }

    const nextStep = document.querySelector(`[data-step="${currentStepNum + 1}"]`);
    if (nextStep) {
      currentStep.classList.remove('active');
      nextStep.classList.add('active');

      // Update indicators
      document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index < currentStepNum + 1);
      });

      // Update navigation buttons
      const prevBtn = document.querySelector('.btn-prev');
      const nextBtn = document.querySelector('.btn-next');

      prevBtn.style.display = 'block';
      if (currentStepNum + 1 === 4) {
        nextBtn.textContent = 'Complete';
      }
    }
  }

  /**
     * Navigate to previous onboarding step
     */
  prevStep() {
    const currentStep = document.querySelector('.step.active');
    const currentStepNum = parseInt(currentStep.dataset.step);

    if (currentStepNum === 1) {return;}

    const prevStep = document.querySelector(`[data-step="${currentStepNum - 1}"]`);
    if (prevStep) {
      currentStep.classList.remove('active');
      prevStep.classList.add('active');

      // Update indicators
      document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index < currentStepNum - 1);
      });

      // Update navigation buttons
      const nextBtn = document.querySelector('.btn-next');
      nextBtn.textContent = 'Next';
    }
  }

  /**
     * Complete onboarding process with AI personality analysis
     */
  async completeOnboarding() {
    try {
      // Collect form data
      const name = document.getElementById('user-name')?.value || 'Operator';
      const email = document.getElementById('user-email')?.value || '';

      // Collect personality data
      const personalityData = this.collectPersonalityData();

      // Perform AI personality analysis
      const personalityAnalysis = await this.analyzePersonalityWithAI(personalityData, name);

      // Update user profile
      this.userProfile.name = name;
      this.userProfile.email = email;
      this.userProfile.onboardingComplete = true;
      this.userProfile.personality = personalityData;
      this.userProfile.personalityAnalysis = personalityAnalysis;
      this.userProfile.preferences = this.preferences;
      this.userProfile.createdAt = new Date().toISOString();

      // Save profile
      await this.saveUserProfile();

      // Close modal
      const modal = document.querySelector('.onboarding-modal');
      if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Show personality analysis results
      this.showPersonalityAnalysis(personalityAnalysis);

      // Show welcome message
      this.showWelcomeMessage();

      console.log('✅ Onboarding completed successfully with AI analysis');

    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
      this.handleError(error, 'Onboarding Completion');
    }
  }

  /**
     * Collect personality assessment data
     */
  collectPersonalityData() {
    const personality = {};

    // Collect answers from personality questions
    this.assessmentQuestions.forEach(question => {
      const selectedOption = document.querySelector(`input[name="${question.id}"]:checked`);
      if (selectedOption) {
        personality[question.id] = selectedOption.value;
      }
    });

    return personality;
  }

  /**
     * Analyze personality data using AI
     */
  async analyzePersonalityWithAI(personalityData, userName) {
    try {
      // Create analysis prompt
      const analysisPrompt = this.createPersonalityAnalysisPrompt(personalityData, userName);

      // Get AI response (using the AI module if available)
      let analysisResult;

      if (window.app && window.app.ai) {
        // Use the AI module if available
        analysisResult = await window.app.ai.sendMessage(analysisPrompt);
      } else {
        // Fallback to mock analysis
        analysisResult = this.generateMockPersonalityAnalysis(personalityData, userName);
      }

      return analysisResult;

    } catch (error) {
      console.error('❌ Error in AI personality analysis:', error);
      // Return mock analysis as fallback
      return this.generateMockPersonalityAnalysis(personalityData, userName);
    }
  }

  /**
     * Create personality analysis prompt for AI
     */
  createPersonalityAnalysisPrompt(personalityData, userName) {
    const answers = Object.entries(personalityData).map(([question, answer]) => {
      const questionObj = this.assessmentQuestions.find(q => q.id === question);
      return `${questionObj?.question || question}: ${answer}`;
    }).join('\n');

    return `Please analyze the following personality assessment responses for ${userName} and provide a detailed personality profile:

Assessment Responses:
${answers}

Please provide a comprehensive analysis including:
1. Primary personality traits and characteristics
2. Learning and work style preferences
3. Motivation patterns and triggers
4. Communication style preferences
5. Stress management approach
6. Goal-setting and achievement patterns
7. Recommended productivity strategies
8. Potential challenges and growth areas
9. Optimal AI interaction style for this user

Format the response as a structured analysis with clear sections and actionable insights.`;
  }

  /**
     * Generate mock personality analysis (fallback)
     */
  generateMockPersonalityAnalysis(personalityData, userName) {
    const analysis = {
      primaryTraits: [],
      learningStyle: '',
      workStyle: '',
      motivationPatterns: [],
      communicationStyle: '',
      stressManagement: '',
      goalPatterns: [],
      productivityStrategies: [],
      challenges: [],
      growthAreas: [],
      aiInteractionStyle: '',
      summary: ''
    };

    // Analyze motivation style
    if (personalityData.motivation_style === 'achievement') {
      analysis.primaryTraits.push('Goal-oriented', 'Results-driven', 'Achievement-focused');
      analysis.motivationPatterns.push('Responds well to clear milestones', 'Values measurable progress');
    } else if (personalityData.motivation_style === 'recognition') {
      analysis.primaryTraits.push('Recognition-seeking', 'Socially motivated', 'Feedback-responsive');
      analysis.motivationPatterns.push('Thrives on positive reinforcement', 'Values acknowledgment');
    } else if (personalityData.motivation_style === 'mastery') {
      analysis.primaryTraits.push('Learning-focused', 'Skill-driven', 'Growth-oriented');
      analysis.motivationPatterns.push('Motivated by skill development', 'Values continuous improvement');
    } else if (personalityData.motivation_style === 'purpose') {
      analysis.primaryTraits.push('Purpose-driven', 'Meaning-seeking', 'Impact-focused');
      analysis.motivationPatterns.push('Motivated by meaningful work', 'Values making a difference');
    }

    // Analyze communication style
    if (personalityData.communication_style === 'direct') {
      analysis.communicationStyle = 'Direct and straightforward';
      analysis.aiInteractionStyle = 'Concise, clear, and direct communication';
    } else if (personalityData.communication_style === 'encouraging') {
      analysis.communicationStyle = 'Encouraging and supportive';
      analysis.aiInteractionStyle = 'Positive, encouraging, and motivational tone';
    } else if (personalityData.communication_style === 'detailed') {
      analysis.communicationStyle = 'Detailed and analytical';
      analysis.aiInteractionStyle = 'Comprehensive, data-driven, and analytical responses';
    } else if (personalityData.communication_style === 'visual') {
      analysis.communicationStyle = 'Visual and interactive';
      analysis.aiInteractionStyle = 'Visual aids, charts, and interactive elements';
    }

    // Analyze work style
    if (personalityData.work_style === 'structured') {
      analysis.workStyle = 'Structured and planned approach';
      analysis.productivityStrategies.push('Use detailed planning tools', 'Break tasks into structured steps');
    } else if (personalityData.work_style === 'flexible') {
      analysis.workStyle = 'Flexible and adaptive approach';
      analysis.productivityStrategies.push('Maintain flexibility in planning', 'Adapt to changing circumstances');
    } else if (personalityData.work_style === 'collaborative') {
      analysis.workStyle = 'Collaborative and team-based approach';
      analysis.productivityStrategies.push('Leverage team collaboration', 'Seek input from others');
    } else if (personalityData.work_style === 'independent') {
      analysis.workStyle = 'Independent and self-directed approach';
      analysis.productivityStrategies.push('Work independently', 'Set personal deadlines');
    }

    // Analyze stress response
    if (personalityData.stress_response === 'action') {
      analysis.stressManagement = 'Takes immediate action to resolve stress';
      analysis.challenges.push('May rush into solutions without full consideration');
    } else if (personalityData.stress_response === 'reflection') {
      analysis.stressManagement = 'Reflects and plans carefully under stress';
      analysis.challenges.push('May overthink and delay action');
    } else if (personalityData.stress_response === 'support') {
      analysis.stressManagement = 'Seeks support and guidance when stressed';
      analysis.challenges.push('May become dependent on others');
    } else if (personalityData.stress_response === 'break') {
      analysis.stressManagement = 'Takes breaks and recharges when stressed';
      analysis.challenges.push('May procrastinate or avoid difficult tasks');
    }

    // Analyze goal focus
    if (personalityData.goal_focus === 'short_term') {
      analysis.goalPatterns.push('Prefers short-term, immediate goals', 'Responds well to quick wins');
    } else if (personalityData.goal_focus === 'long_term') {
      analysis.goalPatterns.push('Prefers long-term, strategic goals', 'Values big-picture planning');
    } else if (personalityData.goal_focus === 'challenging') {
      analysis.goalPatterns.push('Enjoys challenging and ambitious goals', 'Thrives on stretch targets');
    } else if (personalityData.goal_focus === 'practical') {
      analysis.goalPatterns.push('Prefers practical and achievable goals', 'Values realistic targets');
    }

    // Generate summary
    analysis.summary = `${userName} is a ${analysis.primaryTraits.join(', ').toLowerCase()} individual who prefers ${analysis.workStyle.toLowerCase()}. They are motivated by ${analysis.motivationPatterns.join(' and ').toLowerCase()} and prefer ${analysis.communicationStyle.toLowerCase()} communication.`;

    return analysis;
  }

  /**
     * Show personality analysis results
     */
  showPersonalityAnalysis(analysis) {
    const analysisDiv = document.createElement('div');
    analysisDiv.className = 'personality-analysis-modal';
    analysisDiv.innerHTML = `
            <div class="analysis-content">
                <h2>🎯 Your Personality Analysis</h2>
                <div class="analysis-sections">
                    <div class="analysis-section">
                        <h3>Primary Traits</h3>
                        <p>${analysis.primaryTraits.join(', ')}</p>
                    </div>
                    <div class="analysis-section">
                        <h3>Work Style</h3>
                        <p>${analysis.workStyle}</p>
                    </div>
                    <div class="analysis-section">
                        <h3>Communication Style</h3>
                        <p>${analysis.communicationStyle}</p>
                    </div>
                    <div class="analysis-section">
                        <h3>Motivation Patterns</h3>
                        <ul>${analysis.motivationPatterns.map(pattern => `<li>${pattern}</li>`).join('')}</ul>
                    </div>
                    <div class="analysis-section">
                        <h3>Productivity Strategies</h3>
                        <ul>${analysis.productivityStrategies.map(strategy => `<li>${strategy}</li>`).join('')}</ul>
                    </div>
                    <div class="analysis-section">
                        <h3>Growth Areas</h3>
                        <ul>${analysis.challenges.map(challenge => `<li>${challenge}</li>`).join('')}</ul>
                    </div>
                </div>
                <div class="analysis-summary">
                    <h3>Summary</h3>
                    <p>${analysis.summary}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">Continue to Dashboard</button>
            </div>
        `;

    document.body.appendChild(analysisDiv);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (analysisDiv.parentElement) {
        analysisDiv.remove();
      }
    }, 10000);
  }

  /**
     * Show welcome message after onboarding
     */
  showWelcomeMessage() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message-popup';
    welcomeDiv.innerHTML = `
            <div class="welcome-content">
                <h2>Welcome, ${this.userProfile.name}! 🎉</h2>
                <p>Your personalized Operator Uplift experience is ready.</p>
                <p>Let's start achieving your goals together!</p>
                <button onclick="this.parentElement.parentElement.remove()">Get Started</button>
            </div>
        `;

    document.body.appendChild(welcomeDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (welcomeDiv.parentElement) {
        welcomeDiv.remove();
      }
    }, 5000);
  }

  /**
     * Save user profile to localStorage
     */
  async saveUserProfile() {
    try {
      this.userProfile.lastActive = new Date().toISOString();
      localStorage.setItem('operator_uplift_user_profile', JSON.stringify(this.userProfile));
      console.log('💾 User profile saved successfully');
    } catch (error) {
      console.error('❌ Error saving user profile:', error);
      throw error;
    }
  }

  /**
     * Update user preferences
     */
  async updatePreferences(newPreferences) {
    try {
      this.preferences = { ...this.preferences, ...newPreferences };
      this.userProfile.preferences = this.preferences;

      await this.saveUserProfile();
      localStorage.setItem('operator_uplift_preferences', JSON.stringify(this.preferences));

      // Apply theme changes immediately
      if (newPreferences.theme) {
        this.applyTheme(newPreferences.theme);
      }

      console.log('✅ Preferences updated successfully');

    } catch (error) {
      console.error('❌ Error updating preferences:', error);
      this.handleError(error, 'Preferences Update');
    }
  }

  /**
     * Apply theme to the application
     */
  applyTheme(theme) {
    const { body } = document;

    // Remove existing theme classes
    body.classList.remove('theme-dark', 'theme-light', 'theme-auto');

    // Add new theme class
    body.classList.add(`theme-${theme}`);

    // Store theme preference
    localStorage.setItem('operator_uplift_theme', theme);

    console.log(`🎨 Theme applied: ${theme}`);
  }

  /**
     * Track user interaction for personalization
     */
  trackInteraction(interaction) {
    try {
      const interactionData = {
        type: interaction.type,
        timestamp: new Date().toISOString(),
        data: interaction.data || {},
        context: interaction.context || 'general'
      };

      this.interactionHistory.push(interactionData);

      // Keep only last 1000 interactions
      if (this.interactionHistory.length > 1000) {
        this.interactionHistory = this.interactionHistory.slice(-500);
      }

      // Save interaction history
      localStorage.setItem('operator_uplift_interaction_history', JSON.stringify(this.interactionHistory));

    } catch (error) {
      console.error('❌ Error tracking interaction:', error);
    }
  }

  /**
     * Analyze user patterns for personalization
     */
  analyzeUserPatterns() {
    const patterns = {
      activeHours: this.analyzeActiveHours(),
      goalPreferences: this.analyzeGoalPreferences(),
      interactionStyle: this.analyzeInteractionStyle(),
      motivationTriggers: this.analyzeMotivationTriggers()
    };

    return patterns;
  }

  /**
     * Analyze user's active hours
     */
  analyzeActiveHours() {
    const hourCounts = new Array(24).fill(0);

    this.interactionHistory.forEach(interaction => {
      const hour = new Date(interaction.timestamp).getHours();
      hourCounts[hour]++;
    });

    const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
    return {
      peakHour: maxHour,
      isMorningPerson: maxHour < 12,
      isEveningPerson: maxHour >= 18
    };
  }

  /**
     * Analyze goal preferences
     */
  analyzeGoalPreferences() {
    const goalTypes = {};

    this.userProfile.goals.forEach(goal => {
      const category = goal.category || 'general';
      goalTypes[category] = (goalTypes[category] || 0) + 1;
    });

    return {
      preferredCategories: Object.keys(goalTypes).sort((a, b) => goalTypes[b] - goalTypes[a]),
      totalGoals: this.userProfile.goals.length,
      completionRate: this.userProfile.experience.completedGoals / Math.max(this.userProfile.experience.totalGoals, 1)
    };
  }

  /**
     * Analyze interaction style
     */
  analyzeInteractionStyle() {
    const interactionTypes = {};

    this.interactionHistory.forEach(interaction => {
      interactionTypes[interaction.type] = (interactionTypes[interaction.type] || 0) + 1;
    });

    return {
      mostFrequent: Object.keys(interactionTypes).sort((a, b) => interactionTypes[b] - interactionTypes[a])[0],
      totalInteractions: this.interactionHistory.length,
      averagePerDay: this.interactionHistory.length / Math.max(this.getDaysSinceCreation(), 1)
    };
  }

  /**
     * Analyze motivation triggers
     */
  analyzeMotivationTriggers() {
    const triggers = {
      achievements: 0,
      progress: 0,
      social: 0,
      rewards: 0
    };

    this.interactionHistory.forEach(interaction => {
      if (interaction.type === 'achievement_unlocked') {triggers.achievements++;}
      if (interaction.type === 'goal_progress') {triggers.progress++;}
      if (interaction.type === 'social_interaction') {triggers.social++;}
      if (interaction.type === 'reward_earned') {triggers.rewards++;}
    });

    return {
      primaryTrigger: Object.keys(triggers).sort((a, b) => triggers[b] - triggers[a])[0],
      triggerCounts: triggers
    };
  }

  /**
     * Get days since user creation
     */
  getDaysSinceCreation() {
    const created = new Date(this.userProfile.createdAt);
    const now = new Date();
    return Math.ceil((now - created) / (1000 * 60 * 60 * 24));
  }

  /**
     * Get personalized recommendations
     */
  getPersonalizedRecommendations() {
    const patterns = this.analyzeUserPatterns();
    const recommendations = [];

    // Time-based recommendations
    if (patterns.activeHours.isMorningPerson) {
      recommendations.push({
        type: 'timing',
        title: 'Morning Power Hour',
        description: 'Schedule your most important tasks during your peak morning hours.',
        priority: 'high'
      });
    }

    // Goal-based recommendations
    if (patterns.goalPreferences.completionRate < 0.5) {
      recommendations.push({
        type: 'goals',
        title: 'Break Down Goals',
        description: 'Try breaking larger goals into smaller, more manageable tasks.',
        priority: 'medium'
      });
    }

    // Motivation-based recommendations
    if (patterns.motivationTriggers.primaryTrigger === 'achievements') {
      recommendations.push({
        type: 'motivation',
        title: 'Achievement Focus',
        description: 'Set up more milestone achievements to keep your motivation high.',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  /**
     * Update user experience level
     */
  updateExperienceLevel() {
    const { totalGoals, completedGoals, streakDays } = this.userProfile.experience;

    let newLevel = 'beginner';

    if (completedGoals >= 50 && streakDays >= 30) {
      newLevel = 'expert';
    } else if (completedGoals >= 20 && streakDays >= 14) {
      newLevel = 'intermediate';
    } else if (completedGoals >= 5) {
      newLevel = 'novice';
    }

    if (newLevel !== this.userProfile.experience.level) {
      this.userProfile.experience.level = newLevel;
      this.saveUserProfile();

      // Show level up notification
      this.showLevelUpNotification(newLevel);
    }
  }

  /**
     * Show level up notification
     */
  showLevelUpNotification(newLevel) {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
            <div class="notification-content">
                <h3>🎉 Level Up!</h3>
                <p>Congratulations! You've reached the <strong>${newLevel}</strong> level!</p>
                <button onclick="this.parentElement.parentElement.remove()">Awesome!</button>
            </div>
        `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  /**
     * Handle errors gracefully
     */
  handleError(error, context) {
    console.error(`❌ Personalization Module Error (${context}):`, error);

    // Log error for debugging
    if (window.errorBoundary) {
      window.errorBoundary.catchError(error, `Personalization Module - ${context}`);
    }
  }

  /**
     * Cleanup resources
     */
  cleanup() {
    console.log('🧹 Enhanced Personalization Module cleanup complete');
  }
}

export default EnhancedPersonalizationModule;
