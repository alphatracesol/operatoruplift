/**
 * Personality Integration Module - Operator Uplift
 * Integrates personality assessment, onboarding, and AI chat features
 * with the main application for seamless user experience
 * @author Operator Uplift Team
 * @version 1.0.0
 */

class PersonalityIntegrationModule {
    constructor() {
        this.userProfile = null;
        this.personalityData = {};
        this.onboardingStatus = {
            completed: false,
            personalityAssessment: false,
            tutorial: false,
            aiSetup: false
        };
        this.aiPersonality = {
            motivationLevel: 7,
            supportStyle: 5,
            detailLevel: 6,
            communicationStyle: 'encouraging',
            responseLength: 'medium'
        };
        
        this.personalityQuestions = [
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

        this.init();
    }

    async init() {
        console.log('🚀 Initializing Personality Integration Module...');
        
        try {
            // Load existing data
            await this.loadUserData();
            
            // Check onboarding status
            this.checkOnboardingStatus();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize AI personality
            this.initializeAIPersonality();
            
            console.log('✅ Personality Integration Module initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Personality Integration Module:', error);
        }
    }

    async loadUserData() {
        try {
            // Load user profile
            const profileData = localStorage.getItem('userProfile');
            if (profileData) {
                this.userProfile = JSON.parse(profileData);
            }

            // Load personality data
            const personalityData = localStorage.getItem('aiPersonalityData');
            if (personalityData) {
                this.personalityData = JSON.parse(personalityData);
            }

            // Load onboarding status
            const onboardingData = localStorage.getItem('onboardingStatus');
            if (onboardingData) {
                this.onboardingStatus = JSON.parse(onboardingData);
            }

            // Load AI personality settings
            const aiPersonalityData = localStorage.getItem('aiPersonalitySettings');
            if (aiPersonalityData) {
                this.aiPersonality = JSON.parse(aiPersonalityData);
            }

        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    checkOnboardingStatus() {
        // Check if user needs to complete onboarding
        if (!this.onboardingStatus.completed) {
            this.showOnboardingModal();
        } else if (!this.onboardingStatus.personalityAssessment) {
            this.showPersonalityAssessment();
        } else if (!this.onboardingStatus.tutorial) {
            this.showTutorial();
        }
    }

    setupEventListeners() {
        // Listen for app state changes
        if (window.app && window.app.state) {
            // Monitor user authentication
            this.monitorAuthState();
            
            // Monitor user data changes
            this.monitorUserDataChanges();
        }

        // Setup global event listeners
        document.addEventListener('personality-assessment-complete', (e) => {
            this.handlePersonalityAssessmentComplete(e.detail);
        });

        document.addEventListener('onboarding-complete', (e) => {
            this.handleOnboardingComplete(e.detail);
        });
    }

    monitorAuthState() {
        // Monitor authentication state changes
        if (window.app && window.app.auth) {
            // This would integrate with the existing auth system
            console.log('Monitoring auth state for personality integration');
        }
    }

    monitorUserDataChanges() {
        // Monitor user data changes to sync personality data
        if (window.app && window.app.state) {
            // This would integrate with the existing user data system
            console.log('Monitoring user data changes for personality integration');
        }
    }

    showOnboardingModal() {
        // Create and show onboarding modal
        const modal = this.createOnboardingModal();
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }

    createOnboardingModal() {
        const modal = document.createElement('div');
        modal.className = 'personality-onboarding-modal';
        modal.innerHTML = `
            <div class="onboarding-overlay"></div>
            <div class="onboarding-content">
                <div class="onboarding-header">
                    <h2>Welcome to Operator Uplift! 🚀</h2>
                    <p>Let's personalize your experience in just a few minutes</p>
                </div>
                
                <div class="onboarding-steps">
                    <div class="step active" data-step="1">
                        <h3>Step 1: Basic Information</h3>
                        <div class="form-group">
                            <label for="user-name">What should we call you?</label>
                            <input type="text" id="user-name" placeholder="Enter your name" value="${this.userProfile?.name || ''}">
                        </div>
                        <div class="form-group">
                            <label for="user-email">Email (optional)</label>
                            <input type="email" id="user-email" placeholder="Enter your email" value="${this.userProfile?.email || ''}">
                        </div>
                    </div>
                    
                    <div class="step" data-step="2">
                        <h3>Step 2: Personality Assessment</h3>
                        <p>Help us understand your preferences to provide better guidance.</p>
                        <div id="personality-questions"></div>
                    </div>
                    
                    <div class="step" data-step="3">
                        <h3>Step 3: AI Mentor Setup</h3>
                        <p>Customize how your AI mentor communicates with you.</p>
                        <div class="ai-settings">
                            <div class="setting-group">
                                <label>Motivation Level</label>
                                <input type="range" id="motivation-level" min="1" max="10" value="${this.aiPersonality.motivationLevel}">
                                <span class="setting-value">${this.aiPersonality.motivationLevel}</span>
                            </div>
                            <div class="setting-group">
                                <label>Support Style</label>
                                <input type="range" id="support-style" min="1" max="10" value="${this.aiPersonality.supportStyle}">
                                <span class="setting-value">${this.aiPersonality.supportStyle}</span>
                            </div>
                            <div class="setting-group">
                                <label>Detail Level</label>
                                <input type="range" id="detail-level" min="1" max="10" value="${this.aiPersonality.detailLevel}">
                                <span class="setting-value">${this.aiPersonality.detailLevel}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step" data-step="4">
                        <h3>Step 4: Goal Preferences</h3>
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
                </div>
                
                <div class="onboarding-navigation">
                    <button class="btn-prev" onclick="window.app.getModule('personalityIntegration').prevStep()">Previous</button>
                    <div class="step-indicators">
                        <span class="indicator active" data-step="1"></span>
                        <span class="indicator" data-step="2"></span>
                        <span class="indicator" data-step="3"></span>
                        <span class="indicator" data-step="4"></span>
                    </div>
                    <button class="btn-next" onclick="window.app.getModule('personalityIntegration').nextStep()">Next</button>
                </div>
            </div>
        `;

        // Add styles
        this.addOnboardingStyles();
        
        // Setup event listeners
        this.setupOnboardingEventListeners(modal);
        
        return modal;
    }

    addOnboardingStyles() {
        if (!document.getElementById('onboarding-styles')) {
            const style = document.createElement('style');
            style.id = 'onboarding-styles';
            style.textContent = `
                .personality-onboarding-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .personality-onboarding-modal.show {
                    opacity: 1;
                }
                
                .onboarding-content {
                    background: var(--bg-color, #0a0a0a);
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
                    border-radius: 16px;
                    padding: 30px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    color: var(--text-color, #ffffff);
                }
                
                .onboarding-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .onboarding-header h2 {
                    font-size: 1.8rem;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, var(--accent-color, #f97316), #ff6b35);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .step {
                    display: none;
                }
                
                .step.active {
                    display: block;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                }
                
                .form-group input[type="text"],
                .form-group input[type="email"] {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
                    border-radius: 8px;
                    background: var(--glass-bg, rgba(255, 255, 255, 0.1));
                    color: var(--text-color, #ffffff);
                }
                
                .checkbox-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }
                
                .checkbox-group label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: normal;
                }
                
                .ai-settings {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .setting-group {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .setting-group label {
                    min-width: 120px;
                    font-weight: 600;
                }
                
                .setting-group input[type="range"] {
                    flex: 1;
                    height: 6px;
                    border-radius: 3px;
                    background: var(--glass-border, rgba(255, 255, 255, 0.2));
                    outline: none;
                }
                
                .setting-group input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--accent-color, #f97316);
                    cursor: pointer;
                }
                
                .setting-value {
                    min-width: 30px;
                    text-align: center;
                    font-weight: 600;
                }
                
                .onboarding-navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 30px;
                }
                
                .btn-prev,
                .btn-next {
                    background: var(--accent-color, #f97316);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 24px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn-prev:hover,
                .btn-next:hover {
                    background: var(--accent-hover, #ea580c);
                }
                
                .btn-prev:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .step-indicators {
                    display: flex;
                    gap: 8px;
                }
                
                .indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--glass-border, rgba(255, 255, 255, 0.2));
                    transition: all 0.3s ease;
                }
                
                .indicator.active {
                    background: var(--accent-color, #f97316);
                }
                
                .indicator.completed {
                    background: #10b981;
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupOnboardingEventListeners(modal) {
        // Setup AI settings sliders
        const sliders = modal.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                const valueDisplay = e.target.parentElement.querySelector('.setting-value');
                if (valueDisplay) {
                    valueDisplay.textContent = value;
                }
                
                // Update AI personality settings
                const settingId = e.target.id;
                this.aiPersonality[settingId.replace('-', '')] = parseInt(value);
            });
        });
    }

    showPersonalityAssessment() {
        // Create and show personality assessment modal
        const modal = this.createPersonalityAssessmentModal();
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }

    createPersonalityAssessmentModal() {
        const modal = document.createElement('div');
        modal.className = 'personality-assessment-modal';
        modal.innerHTML = `
            <div class="assessment-overlay"></div>
            <div class="assessment-content">
                <div class="assessment-header">
                    <h2>Personality Assessment</h2>
                    <p>Help us understand you better to provide personalized guidance</p>
                </div>
                
                <div class="assessment-progress" id="assessment-progress">
                    <!-- Progress dots will be generated here -->
                </div>
                
                <div class="assessment-question" id="assessment-question">
                    <!-- Questions will be loaded here -->
                </div>
                
                <div class="assessment-navigation">
                    <button class="assessment-btn" id="prev-btn" disabled>Previous</button>
                    <button class="assessment-btn" id="next-btn">Next</button>
                </div>
            </div>
        `;

        // Add styles
        this.addAssessmentStyles();
        
        // Setup assessment
        this.setupAssessment(modal);
        
        return modal;
    }

    addAssessmentStyles() {
        if (!document.getElementById('assessment-styles')) {
            const style = document.createElement('style');
            style.id = 'assessment-styles';
            style.textContent = `
                .personality-assessment-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .personality-assessment-modal.show {
                    opacity: 1;
                }
                
                .assessment-content {
                    background: var(--bg-color, #0a0a0a);
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
                    border-radius: 16px;
                    padding: 30px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    color: var(--text-color, #ffffff);
                }
                
                .assessment-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .assessment-header h2 {
                    font-size: 1.8rem;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, var(--accent-color, #f97316), #ff6b35);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .assessment-progress {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin: 20px 0;
                }
                
                .progress-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--glass-border, rgba(255, 255, 255, 0.2));
                    transition: all 0.3s ease;
                }
                
                .progress-dot.active {
                    background: var(--accent-color, #f97316);
                }
                
                .progress-dot.completed {
                    background: #10b981;
                }
                
                .assessment-question h3 {
                    font-size: 1.2rem;
                    margin-bottom: 20px;
                }
                
                .assessment-options {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .assessment-option {
                    background: var(--glass-bg, rgba(255, 255, 255, 0.1));
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
                    border-radius: 8px;
                    padding: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .assessment-option:hover {
                    border-color: var(--accent-color, #f97316);
                    background: rgba(249, 115, 22, 0.1);
                }
                
                .assessment-option.selected {
                    border-color: var(--accent-color, #f97316);
                    background: rgba(249, 115, 22, 0.2);
                }
                
                .assessment-navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 30px;
                }
                
                .assessment-btn {
                    background: var(--accent-color, #f97316);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 24px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .assessment-btn:hover {
                    background: var(--accent-hover, #ea580c);
                }
                
                .assessment-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupAssessment(modal) {
        this.currentQuestionIndex = 0;
        this.assessmentResponses = {};
        
        const showQuestion = () => {
            const question = this.personalityQuestions[this.currentQuestionIndex];
            const questionElement = modal.querySelector('#assessment-question');
            const progressElement = modal.querySelector('#assessment-progress');
            
            // Update progress
            progressElement.innerHTML = '';
            this.personalityQuestions.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'progress-dot';
                if (index < this.currentQuestionIndex) {
                    dot.classList.add('completed');
                } else if (index === this.currentQuestionIndex) {
                    dot.classList.add('active');
                }
                progressElement.appendChild(dot);
            });
            
            // Show question
            questionElement.innerHTML = `
                <h3>${question.question}</h3>
                <div class="assessment-options">
                    ${question.options.map(option => `
                        <div class="assessment-option" data-value="${option.value}">
                            ${option.label}
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Add click handlers
            questionElement.querySelectorAll('.assessment-option').forEach(option => {
                option.addEventListener('click', () => {
                    questionElement.querySelectorAll('.assessment-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    option.classList.add('selected');
                    this.assessmentResponses[question.id] = option.dataset.value;
                });
            });
            
            // Update navigation buttons
            const prevBtn = modal.querySelector('#prev-btn');
            const nextBtn = modal.querySelector('#next-btn');
            
            prevBtn.disabled = this.currentQuestionIndex === 0;
            nextBtn.textContent = this.currentQuestionIndex === this.personalityQuestions.length - 1 ? 'Complete' : 'Next';
        };
        
        // Setup navigation
        modal.querySelector('#prev-btn').addEventListener('click', () => {
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
                showQuestion();
            }
        });
        
        modal.querySelector('#next-btn').addEventListener('click', () => {
            if (this.currentQuestionIndex < this.personalityQuestions.length - 1) {
                this.currentQuestionIndex++;
                showQuestion();
            } else {
                this.completePersonalityAssessment();
            }
        });
        
        // Show first question
        showQuestion();
    }

    async completePersonalityAssessment() {
        try {
            // Analyze personality with AI
            const personalityAnalysis = await this.analyzePersonalityWithAI();
            
            // Save personality data
            this.personalityData = {
                ...this.assessmentResponses,
                analysis: personalityAnalysis,
                assessmentCompleted: true,
                completedAt: new Date().toISOString()
            };

            // Update onboarding status
            this.onboardingStatus.personalityAssessment = true;
            
            // Save data
            localStorage.setItem('aiPersonalityData', JSON.stringify(this.personalityData));
            localStorage.setItem('onboardingStatus', JSON.stringify(this.onboardingStatus));

            // Close modal
            const modal = document.querySelector('.personality-assessment-modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }

            // Show completion message
            this.showCompletionMessage('Personality assessment completed! Your AI mentor is now personalized to your preferences.');

            // Continue with tutorial if needed
            if (!this.onboardingStatus.tutorial) {
                setTimeout(() => this.showTutorial(), 2000);
            }

        } catch (error) {
            console.error('Error completing personality assessment:', error);
            this.showCompletionMessage('Assessment completed with default settings. Your AI mentor will adapt to you over time.');
        }
    }

    async analyzePersonalityWithAI() {
        // This would typically call an AI service
        // For now, we'll create a mock analysis
        const traits = this.assessmentResponses;
        
        let analysis = {
            primaryMotivator: traits.motivation_style || 'achievement',
            communicationPreference: traits.communication_style || 'encouraging',
            workStyle: traits.work_style || 'structured',
            stressManagement: traits.stress_response || 'action',
            goalOrientation: traits.goal_focus || 'short_term',
            summary: 'You appear to be a goal-oriented individual who prefers structured approaches and direct communication.'
        };

        // Add specific insights based on combinations
        if (traits.motivation_style === 'achievement' && traits.work_style === 'structured') {
            analysis.summary += ' You thrive on clear milestones and systematic progress tracking.';
        }

        if (traits.communication_style === 'encouraging' && traits.stress_response === 'support') {
            analysis.summary += ' You value supportive relationships and collaborative problem-solving.';
        }

        return analysis;
    }

    showTutorial() {
        // Create and show tutorial overlay
        const overlay = this.createTutorialOverlay();
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.classList.add('show');
        }, 100);
    }

    createTutorialOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-tooltip" id="tutorial-tooltip">
                <h3>Welcome to Operator Uplift</h3>
                <p>Let me show you around your personalized dashboard!</p>
                <div class="tutorial-navigation">
                    <button class="tutorial-btn" id="tutorial-skip">Skip</button>
                    <button class="tutorial-btn" id="tutorial-next">Next</button>
                </div>
            </div>
        `;

        // Add styles
        this.addTutorialStyles();
        
        // Setup tutorial
        this.setupTutorial(overlay);
        
        return overlay;
    }

    addTutorialStyles() {
        if (!document.getElementById('tutorial-styles')) {
            const style = document.createElement('style');
            style.id = 'tutorial-styles';
            style.textContent = `
                .tutorial-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .tutorial-overlay.show {
                    opacity: 1;
                }
                
                .tutorial-tooltip {
                    position: absolute;
                    background: var(--bg-color, #0a0a0a);
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
                    border-radius: 12px;
                    padding: 20px;
                    max-width: 300px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    color: var(--text-color, #ffffff);
                }
                
                .tutorial-tooltip h3 {
                    font-size: 1.1rem;
                    margin-bottom: 10px;
                    color: var(--accent-color, #f97316);
                }
                
                .tutorial-tooltip p {
                    font-size: 0.9rem;
                    color: var(--text-muted, #a1a1aa);
                    margin-bottom: 15px;
                }
                
                .tutorial-navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .tutorial-btn {
                    background: var(--accent-color, #f97316);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }
                
                .tutorial-btn:hover {
                    background: var(--accent-hover, #ea580c);
                }
                
                .tutorial-highlight {
                    position: relative;
                    z-index: 10001;
                    box-shadow: 0 0 0 4px var(--accent-color, #f97316);
                    border-radius: 8px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupTutorial(overlay) {
        const tutorialSteps = [
            {
                title: 'Welcome to Operator Uplift',
                description: 'Your AI-powered journey to self-progression starts here. Let\'s get you set up in just a few minutes.',
                target: null
            },
            {
                title: 'AI Mentor Widget',
                description: 'Your personalized AI mentor is here to guide you, provide insights, and keep you motivated.',
                target: '#ai-mentor-widget'
            },
            {
                title: 'Dashboard Stats',
                description: 'Track your progress, energy levels, and achievements in real-time.',
                target: '#stats-grid'
            },
            {
                title: 'Goal Management',
                description: 'Create, track, and achieve your goals with AI-powered guidance.',
                target: '#goals-section'
            },
            {
                title: 'Navigation',
                description: 'Use the sidebar to switch between different views: Goals, Calendar, Analytics, and more.',
                target: '#sidebar'
            },
            {
                title: 'You\'re All Set!',
                description: 'Welcome to the Operator Uplift community. Your journey to self-progression begins now.',
                target: null
            }
        ];

        this.currentTutorialStep = 0;
        
        const showStep = () => {
            const step = tutorialSteps[this.currentTutorialStep];
            const tooltip = overlay.querySelector('#tutorial-tooltip');
            
            tooltip.innerHTML = `
                <h3>${step.title}</h3>
                <p>${step.description}</p>
                <div class="tutorial-navigation">
                    <button class="tutorial-btn" id="tutorial-skip">Skip</button>
                    <button class="tutorial-btn" id="tutorial-next">
                        ${this.currentTutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            `;

            // Position tooltip
            if (step.target) {
                const targetElement = document.querySelector(step.target);
                if (targetElement) {
                    targetElement.classList.add('tutorial-highlight');
                    const rect = targetElement.getBoundingClientRect();
                    tooltip.style.left = rect.left + 'px';
                    tooltip.style.top = (rect.bottom + 10) + 'px';
                }
            } else {
                tooltip.style.left = '50%';
                tooltip.style.top = '50%';
                tooltip.style.transform = 'translate(-50%, -50%)';
            }

            // Re-attach event listeners
            overlay.querySelector('#tutorial-skip').addEventListener('click', () => {
                this.completeTutorial();
            });

            overlay.querySelector('#tutorial-next').addEventListener('click', () => {
                if (this.currentTutorialStep < tutorialSteps.length - 1) {
                    // Remove previous highlight
                    document.querySelectorAll('.tutorial-highlight').forEach(el => {
                        el.classList.remove('tutorial-highlight');
                    });
                    
                    this.currentTutorialStep++;
                    showStep();
                } else {
                    this.completeTutorial();
                }
            });
        };
        
        showStep();
    }

    completeTutorial() {
        // Update onboarding status
        this.onboardingStatus.tutorial = true;
        this.onboardingStatus.completed = true;
        
        // Save status
        localStorage.setItem('onboardingStatus', JSON.stringify(this.onboardingStatus));
        
        // Remove tutorial overlay
        const overlay = document.querySelector('.tutorial-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        }
        
        // Remove highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        // Show completion message
        this.showCompletionMessage('Tutorial completed! You\'re all set to start your journey with Operator Uplift.');
    }

    showCompletionMessage(message) {
        // Create and show completion message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'completion-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <h3>🎉 Success!</h3>
                <p>${message}</p>
                <button class="message-btn" onclick="this.parentElement.parentElement.remove()">Got it!</button>
            </div>
        `;
        
        // Add styles
        if (!document.getElementById('completion-message-styles')) {
            const style = document.createElement('style');
            style.id = 'completion-message-styles';
            style.textContent = `
                .completion-message {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-color, #0a0a0a);
                    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    color: var(--text-color, #ffffff);
                    animation: slideIn 0.3s ease;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .message-content h3 {
                    color: var(--accent-color, #f97316);
                    margin-bottom: 10px;
                }
                
                .message-content p {
                    margin-bottom: 15px;
                    color: var(--text-muted, #a1a1aa);
                }
                
                .message-btn {
                    background: var(--accent-color, #f97316);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }
                
                .message-btn:hover {
                    background: var(--accent-hover, #ea580c);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Navigation methods for onboarding
    nextStep() {
        // Implementation for onboarding navigation
        console.log('Next step in onboarding');
    }

    prevStep() {
        // Implementation for onboarding navigation
        console.log('Previous step in onboarding');
    }

    // Event handlers
    handlePersonalityAssessmentComplete(data) {
        console.log('Personality assessment completed:', data);
        this.personalityData = { ...this.personalityData, ...data };
        this.savePersonalityData();
    }

    handleOnboardingComplete(data) {
        console.log('Onboarding completed:', data);
        this.onboardingStatus = { ...this.onboardingStatus, ...data };
        this.saveOnboardingStatus();
    }

    // Data persistence methods
    savePersonalityData() {
        localStorage.setItem('aiPersonalityData', JSON.stringify(this.personalityData));
    }

    saveOnboardingStatus() {
        localStorage.setItem('onboardingStatus', JSON.stringify(this.onboardingStatus));
    }

    saveAIPersonality() {
        localStorage.setItem('aiPersonalitySettings', JSON.stringify(this.aiPersonality));
    }

    // Public API methods
    getUserProfile() {
        return this.userProfile;
    }

    getPersonalityData() {
        return this.personalityData;
    }

    getAIPersonality() {
        return this.aiPersonality;
    }

    getOnboardingStatus() {
        return this.onboardingStatus;
    }

    updateAIPersonality(settings) {
        this.aiPersonality = { ...this.aiPersonality, ...settings };
        this.saveAIPersonality();
    }

    // Cleanup method
    cleanup() {
        // Remove any active modals or overlays
        document.querySelectorAll('.personality-onboarding-modal, .personality-assessment-modal, .tutorial-overlay').forEach(el => {
            el.remove();
        });
        
        // Remove styles
        ['onboarding-styles', 'assessment-styles', 'tutorial-styles', 'completion-message-styles'].forEach(id => {
            const style = document.getElementById(id);
            if (style) style.remove();
        });
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalityIntegrationModule;
} else if (typeof window !== 'undefined') {
    window.PersonalityIntegrationModule = PersonalityIntegrationModule;
} 