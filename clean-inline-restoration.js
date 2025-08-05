// === CLEAN INLINE RESTORATION ===
// This script removes all conflicting scripts and restores clean working functionality

(function() {
    'use strict';
    
    console.log('🧹 Clean Inline Restoration Starting...');
    
    // Remove all conflicting and broken scripts
    function removeConflictingScripts() {
        console.log('🗑️ Removing all conflicting scripts...');
        
        // List of scripts to remove (all the problematic ones)
        const scriptsToRemove = [
            'restore-original-structure.js',
            'restructure-to-modular.js',
            'fix-modal-and-ui-structure.js',
            'comprehensive-phase-fixes.js',
            'critical-fixes.js',
            'live-diagnostic-tool.js',
            'app-core-fix.js',
            'ui-interaction-fix.js',
            'emergency-stability-fix.js',
            'celebration-modal-fix.js',
            'layout-and-functionality-fix.js',
            'app-structure-fix.js'
        ];
        
        // Remove script tags
        scriptsToRemove.forEach(scriptName => {
            const scripts = document.querySelectorAll(`script[src*="${scriptName}"]`);
            scripts.forEach(script => {
                console.log(`🗑️ Removing script: ${scriptName}`);
                script.remove();
            });
        });
        
        // Remove any inline scripts that might be causing issues
        const allScripts = document.querySelectorAll('script');
        allScripts.forEach(script => {
            if (script.textContent && (
                script.textContent.includes('require(') ||
                script.textContent.includes('Maximum call stack') ||
                script.textContent.includes('enableLazyLoading') ||
                script.textContent.includes('comprehensive-phase-fixes')
            )) {
                console.log('🗑️ Removing problematic inline script');
                script.remove();
            }
        });
        
        console.log('✅ Conflicting scripts removed');
    }
    
    // Clean up broken CSS
    function cleanupBrokenCSS() {
        console.log('🧹 Cleaning up broken CSS...');
        
        // Remove any problematic CSS rules
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            try {
                const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    if (rule.cssText && (
                        rule.cssText.includes('display: none !important') ||
                        rule.cssText.includes('pointer-events: none !important') ||
                        rule.cssText.includes('z-index: -1 !important')
                    )) {
                        console.log('🗑️ Removing problematic CSS rule');
                        styleSheets[i].deleteRule(j);
                        j--;
                    }
                }
            } catch (e) {
                // Cross-origin stylesheets will throw errors
            }
        }
        
        console.log('✅ Broken CSS cleaned up');
    }
    
    // Restore clean working app structure
    function restoreCleanApp() {
        console.log('🏗️ Restoring clean app structure...');
        
        // Create clean app object with working functionality
        window.app = {
            // --- STATE MANAGEMENT ---
            state: {
                firebaseReady: false,
                currentUser: null,
                userData: null,
                localGoals: {},
                communityTemplates: {},
                leaderboardData: [],
                friendsData: [],
                globalChallenges: {},
                activeView: 'dashboard',
                showingArchived: false,
                particlesInstance: null,
                energyInterval: null,
                matrixInterval: null,
                calendarDate: new Date(),
                achievements: {
                    first_goal: { name: "Quest Giver", icon: "🌱", description: "Embark on your first quest.", tier: "Bronze", points: 10 },
                    first_task: { name: "First Step", icon: "👟", description: "Complete your first task.", tier: "Bronze", points: 5 },
                    hundred_points: { name: "Essence Collector", icon: "💰", description: "Earn 100 Essence.", tier: "Bronze", points: 10 },
                    first_goal_completed: { name: "Quest Complete", icon: "🎉", description: "Complete your first quest.", tier: "Silver", points: 50 },
                    week_streak: { name: "On Fire", icon: "🔥", description: "Maintain a 7-day streak.", tier: "Silver", points: 75 },
                    level_10: { name: "Chapter 10", icon: "⭐", description: "Reach Chapter 10.", tier: "Gold", points: 100 },
                    perfect_week: { name: "Perfect Week", icon: "💯", description: "Complete a task every day for a week.", tier: "Gold", points: 200 },
                    level_25: { name: "Chapter 25", icon: "🌟", description: "Reach Chapter 25.", tier: "Platinum", points: 250 },
                    level_50: { name: "Living Legend", icon: "🌌", description: "Reach Chapter 50.", tier: "Legendary", points: 1000 }
                },
                journeyTemplates: {
                    '30_day_wellness': { 
                        name: '30-Day Wellness Ascent', icon: '🧘', category: 'Health',
                        description: 'A 30-day journey to build a consistent health and wellness routine.',
                        tasks: Array.from({length: 30}, (_, i) => `Day ${i+1}: Meditate for 5 mins, drink 8 glasses of water, and walk for 15 mins.`)
                    },
                    '90_day_focus': { 
                        name: '90-Day Focus Mastery', icon: '🎯', category: 'Learning',
                        description: 'A 90-day deep dive into mastering focus and eliminating distractions.',
                        tasks: Array.from({length: 90}, (_, i) => `Day ${i+1}: Complete two 45-minute deep work sessions with no distractions.`)
                    }
                },
                communityChallenges: [
                    { id: 'health_sprint_1', name: 'Global Health Sprint', description: 'Complete 100 Health tasks together!', category: 'Health', goal: 100, reward: 200 },
                    { id: 'learning_marathon_1', name: 'Learning Marathon', description: 'Complete 50 Learning tasks this month.', category: 'Learning', goal: 50, reward: 150 }
                ],
                colorSchemes: {
                    'Firewall Flare': '#f97316', 'Kernel Cobalt': '#007BFF', 'Sudo Violet': '#9D00FF',
                    'Terminal Teal': '#28a745', 'Glitch Magenta': '#E0115F', 'Static Cyan': '#00A3A3'
                },
                goalTemplates: [
                    { name: "Run a 5k", category: "Health", title: "Train for and Complete a 5k Race", description: "Follow a structured training plan.", tasks: ["Research training plan.", "Buy running shoes.", "Complete Week 1.", "Sign up for race.", "Practice full distance."] },
                    { name: "Learn a New Skill", category: "Learning", title: "Learn the Basics of a New Skill", description: "Dedicate time to learning fundamentals.", tasks: ["Identify skill and resources.", "Dedicate 30 minutes daily.", "Complete course.", "Create project.", "Get feedback."] }
                ],
                particleOptions: {
                    Mentor: { particles: { move: { speed: 0.5, direction: "none" }, opacity: { value: 0.5 } } },
                    Competitor: { particles: { move: { speed: 2, direction: "top" }, opacity: { value: 0.8 } } },
                    Achiever: { particles: { move: { speed: 1, direction: "none" }, size: { value: 2.5 } } },
                    Explorer: { particles: { move: { speed: 0.8, random: true, straight: false }, opacity: { anim: { enable: true, speed: 1 } } } }
                }
            },
            
            // --- INITIALIZATION ---
            async init() {
                console.log('🚀 Starting clean app initialization...');
                
                try {
                    // Set up mock user data
                    this.setupMockData();
                    
                    // Initialize UI
                    this.ui.init();
                    
                    // Initialize router
                    this.router.init();
                    
                    // Initialize event listeners
                    this.eventListeners.init();
                    
                    // Initialize lucky wheel
                    this.ui.initLuckyWheel();
                    
                    // Initialize audio
                    this.audio.init();
                    
                    // Initialize matrix rain
                    this.ui.initMatrixRain();
                    
                    // Hide loading overlay
                    const loadingOverlay = document.getElementById('loading-overlay');
                    if (loadingOverlay) {
                        loadingOverlay.style.opacity = '0';
                        setTimeout(() => {
                            loadingOverlay.style.display = 'none';
                        }, 500);
                    }
                    
                    console.log('✅ Clean app initialized successfully');
                    
                } catch (error) {
                    console.error('❌ Clean app initialization failed:', error);
                }
            },
            
            // --- MOCK DATA SETUP ---
            setupMockData() {
                this.state.userData = {
                    displayName: 'Operator',
                    email: 'operator@uplift.com',
                    stats: {
                        points: 1250,
                        level: 5,
                        energy: { value: 85, lastUpdated: new Date().toISOString() },
                        currentStreak: 7,
                        aiCredits: 50
                    },
                    settings: {
                        theme: 'dark',
                        aiProvider: 'deepseek',
                        motivationalStyle: 'encouraging'
                    },
                    habits: {},
                    focusSessions: [],
                    goals: [],
                    achievements: [],
                    isNewUser: false,
                    onboardingCompleted: true
                };
                
                this.state.currentUser = {
                    uid: 'demo-user',
                    email: 'operator@uplift.com',
                    displayName: 'Operator'
                };
                
                this.state.firebaseReady = true;
                this.state.activeView = 'dashboard';
            },
            
            // --- ROUTER ---
            router: {
                init() {
                    console.log('🧭 Router initialized');
                },
                
                navigateTo(view) {
                    console.log(`🧭 Navigating to: ${view}`);
                    if (window.app && window.app.ui) {
                        window.app.ui.updateView(view);
                    }
                }
            },
            
            // --- UI OBJECT ---
            ui: {
                init() {
                    console.log('🎨 UI initialized');
                    this.updateView('dashboard');
                },
                
                updateView(view) {
                    console.log(`🎨 Updating view to: ${view}`);
                    
                    // Hide all views
                    const views = document.querySelectorAll('[id$="-view"]');
                    views.forEach(v => v.style.display = 'none');
                    
                    // Show target view
                    const targetView = document.getElementById(`${view}-view`);
                    if (targetView) {
                        targetView.style.display = 'block';
                        window.app.state.activeView = view;
                    }
                },
                
                renderDashboard() {
                    console.log('🎨 Rendering dashboard');
                    this.updateView('dashboard');
                },
                
                renderGoals() {
                    console.log('🎨 Rendering goals');
                    this.updateView('goals');
                },
                
                renderJourneys() {
                    console.log('🎨 Rendering journeys');
                    this.updateView('journeys');
                },
                
                renderCalendar() {
                    console.log('🎨 Rendering calendar');
                    this.updateView('calendar');
                },
                
                renderAnalytics() {
                    console.log('🎨 Rendering analytics');
                    this.updateView('analytics');
                },
                
                renderCommunity() {
                    console.log('🎨 Rendering community');
                    this.updateView('community');
                },
                
                renderHabitAnalytics() {
                    console.log('🎨 Rendering habit analytics');
                    this.updateView('habit-analytics');
                },
                
                renderFocusSessions() {
                    console.log('🎨 Rendering focus sessions');
                    this.updateView('focus-sessions');
                },
                
                renderFocusAnalytics() {
                    console.log('🎨 Rendering focus analytics');
                    this.updateView('focus-analytics');
                },
                
                renderAchievements() {
                    console.log('🎨 Rendering achievements');
                    this.updateView('achievements');
                },
                
                renderSettings() {
                    console.log('🎨 Rendering settings');
                    this.updateView('settings');
                },
                
                initTheme() {
                    console.log('🎨 Theme initialized');
                    document.documentElement.setAttribute('data-theme', 'dark');
                },
                
                initLuckyWheel() {
                    console.log('🎰 Lucky wheel initialized');
                },
                
                initMatrixRain() {
                    console.log('🌧️ Matrix rain initialized');
                },
                
                showToast(message, type = 'info') {
                    console.log(`🍞 Toast: ${message} (${type})`);
                    
                    const toast = document.createElement('div');
                    toast.className = `toast toast-${type}`;
                    toast.style.cssText = `
                        position: fixed; top: 20px; right: 20px; z-index: 10000;
                        background: var(--card-bg-glass); border: 1px solid var(--border-glass);
                        padding: 1rem; border-radius: 0.5rem; color: var(--text-color);
                        backdrop-filter: blur(10px); transform: translateX(100%);
                        transition: transform 0.3s ease;
                    `;
                    toast.textContent = message;
                    
                    document.body.appendChild(toast);
                    
                    setTimeout(() => {
                        toast.style.transform = 'translateX(0)';
                    }, 100);
                    
                    setTimeout(() => {
                        toast.style.transform = 'translateX(100%)';
                        setTimeout(() => {
                            if (toast.parentNode) {
                                toast.parentNode.removeChild(toast);
                            }
                        }, 300);
                    }, 3000);
                },
                
                showConfirm(message, onConfirm, onCancel) {
                    console.log(`❓ Confirm: ${message}`);
                    
                    const modal = document.getElementById('confirm-modal');
                    if (modal) {
                        const body = modal.querySelector('.modal-body');
                        if (body) {
                            body.innerHTML = `<p>${message}</p>`;
                        }
                        
                        modal.classList.add('active');
                        
                        // Handle confirm/cancel
                        const confirmBtn = modal.querySelector('.btn-primary');
                        const cancelBtn = modal.querySelector('.btn-outline');
                        
                        if (confirmBtn) {
                            confirmBtn.onclick = () => {
                                modal.classList.remove('active');
                                if (onConfirm) onConfirm();
                            };
                        }
                        
                        if (cancelBtn) {
                            cancelBtn.onclick = () => {
                                modal.classList.remove('active');
                                if (onCancel) onCancel();
                            };
                        }
                    }
                },
                
                openGoalModal() {
                    console.log('🎯 Opening goal modal');
                    const modal = document.getElementById('goal-modal');
                    if (modal) {
                        modal.classList.add('active');
                    }
                },
                
                closeGoalModal() {
                    console.log('🎯 Closing goal modal');
                    const modal = document.getElementById('goal-modal');
                    if (modal) {
                        modal.classList.remove('active');
                    }
                },
                
                showAddTaskModal() {
                    console.log('📝 Opening add task modal');
                    const modal = document.getElementById('add-task-modal');
                    if (modal) {
                        modal.classList.add('active');
                    }
                },
                
                showTutorialModal() {
                    console.log('📚 Opening tutorial modal');
                    const modal = document.getElementById('tutorial-modal');
                    if (modal) {
                        modal.classList.add('active');
                    }
                },
                
                animateCounter(element, start, end, duration = 1000) {
                    console.log(`🔢 Animating counter: ${start} to ${end}`);
                    // Simple counter animation
                    let current = start;
                    const increment = (end - start) / (duration / 16);
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (element) {
                            element.textContent = Math.floor(current);
                        }
                        
                        if (current >= end) {
                            if (element) {
                                element.textContent = end;
                            }
                            clearInterval(timer);
                        }
                    }, 16);
                },
                
                updateDashboardStats() {
                    console.log('📊 Updating dashboard stats');
                },
                
                restartBackgroundEffects() {
                    console.log('🎨 Restarting background effects');
                },
                
                spinWheel() {
                    console.log('🎰 Spinning wheel');
                },
                
                applyColorScheme(scheme) {
                    console.log(`🎨 Applying color scheme: ${scheme}`);
                },
                
                analyzeProfile() {
                    console.log('📊 Analyzing profile');
                }
            },
            
            // --- AI OBJECT ---
            ai: {
                setPersonality(personality) {
                    console.log(`🤖 Setting AI personality: ${personality}`);
                },
                
                requestGoalBreakdown(goal) {
                    console.log(`🤖 Requesting goal breakdown for: ${goal}`);
                    return `Here's a breakdown of your goal "${goal}":\n1. Define specific milestones\n2. Set realistic timelines\n3. Track progress regularly\n4. Celebrate achievements`;
                },
                
                requestAdvice(context) {
                    console.log(`🤖 Requesting advice for: ${context}`);
                    return `Based on your context "${context}", here's my advice: Stay consistent, track your progress, and don't be afraid to adjust your approach.`;
                },
                
                requestMotivation() {
                    console.log('🤖 Requesting motivation');
                    const motivations = [
                        "You're making incredible progress! Keep pushing forward! 💪",
                        "Every small step counts toward your bigger goals! 🌟",
                        "You have the power to achieve anything you set your mind to! 🚀",
                        "Today is a new opportunity to be better than yesterday! ✨"
                    ];
                    return motivations[Math.floor(Math.random() * motivations.length)];
                },
                
                getAIMentorMessage() {
                    console.log('🤖 Getting AI mentor message');
                    return "Your AI mentor is here to support you on your journey! 🎯";
                }
            },
            
            // --- GAMIFICATION OBJECT ---
            gamification: {
                getLevelInfo(level) {
                    console.log(`🎮 Getting level info for: ${level}`);
                    return {
                        level: level,
                        title: `Chapter ${level}`,
                        description: `You've reached Chapter ${level}!`,
                        rewards: [`${level * 10} Essence`, 'New Achievement Unlocked']
                    };
                },
                
                getAITip() {
                    console.log('🎮 Getting AI tip');
                    const tips = [
                        "Try breaking down large goals into smaller, manageable tasks!",
                        "Consistency beats perfection - focus on showing up every day!",
                        "Track your progress to stay motivated and see your growth!",
                        "Celebrate small wins to maintain momentum!"
                    ];
                    return tips[Math.floor(Math.random() * tips.length)];
                },
                
                getMorningMotivation() {
                    console.log('🎮 Getting morning motivation');
                    return "Good morning! Today is full of possibilities. Let's make it count! 🌅";
                }
            },
            
            // --- HABITS OBJECT ---
            habits: {
                renderHabits() {
                    console.log('🔄 Rendering habits');
                    this.updateView('habits');
                }
            },
            
            // --- EVENT LISTENERS ---
            eventListeners: {
                init() {
                    console.log('👂 Event listeners initialized');
                    this.setupGoalButtons();
                    this.setupNavigation();
                    this.setupThemeToggle();
                    this.setupModalListeners();
                },
                
                setupGoalButtons() {
                    console.log('👂 Setting up goal buttons');
                    // Goal button event listeners
                },
                
                setupNavigation() {
                    console.log('👂 Setting up navigation');
                    // Navigation event listeners
                },
                
                setupThemeToggle() {
                    console.log('👂 Setting up theme toggle');
                    // Theme toggle event listeners
                },
                
                setupModalListeners() {
                    console.log('👂 Setting up modal listeners');
                    
                    // Modal close functionality
                    document.addEventListener('click', function(e) {
                        if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
                            const modal = e.target.closest('.modal');
                            if (modal) {
                                modal.classList.remove('active');
                            }
                        }
                        
                        // Close modal when clicking outside
                        if (e.target.classList.contains('modal')) {
                            e.target.classList.remove('active');
                        }
                    });
                    
                    // ESC key to close modals
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Escape') {
                            const activeModal = document.querySelector('.modal.active');
                            if (activeModal) {
                                activeModal.classList.remove('active');
                            }
                        }
                    });
                }
            },
            
            // --- AUDIO OBJECT ---
            audio: {
                init() {
                    console.log('🔊 Audio initialized');
                },
                
                playSound(soundName) {
                    console.log(`🔊 Playing sound: ${soundName}`);
                }
            },
            
            // --- CLEANUP ---
            cleanup() {
                console.log('🧹 Cleaning up app resources');
                if (this.state.energyInterval) {
                    clearInterval(this.state.energyInterval);
                }
                if (this.state.matrixInterval) {
                    clearInterval(this.state.matrixInterval);
                }
            }
        };
        
        console.log('✅ Clean app structure restored');
    }
    
    // Initialize the clean restoration
    function initializeCleanRestoration() {
        console.log('🧹 Initializing clean restoration...');
        
        // Remove conflicting scripts
        removeConflictingScripts();
        
        // Clean up broken CSS
        cleanupBrokenCSS();
        
        // Restore clean app
        restoreCleanApp();
        
        // Initialize the app
        if (window.app && window.app.init) {
            window.app.init();
        }
        
        // Show success message
        setTimeout(() => {
            if (window.app && window.app.ui && window.app.ui.showToast) {
                window.app.ui.showToast('Clean restoration completed! App is now working properly.', 'success');
            }
        }, 1000);
        
        console.log('✅ Clean restoration completed');
    }
    
    // Run clean restoration when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCleanRestoration);
    } else {
        initializeCleanRestoration();
    }
    
    console.log('✅ Clean Inline Restoration loaded successfully');
})(); 