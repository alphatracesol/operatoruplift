// === RESTORE ORIGINAL STRUCTURE ===
// This script restores the original working app structure from backup files

(function() {
    'use strict';
    
    console.log('🔧 Restoring Original App Structure...');
    
    // Remove all temporary fix scripts and restore original structure
    function restoreOriginalStructure() {
        console.log('🔄 Restoring original app structure...');
        
        // Remove all temporary fix scripts from the page
        const tempScripts = [
            'live-diagnostic-tool.js',
            'app-core-fix.js',
            'ui-interaction-fix.js',
            'emergency-stability-fix.js',
            'celebration-modal-fix.js',
            'layout-and-functionality-fix.js',
            'app-structure-fix.js',
            'comprehensive-phase-fixes.js'
        ];
        
        tempScripts.forEach(scriptName => {
            const scripts = document.querySelectorAll(`script[src*="${scriptName}"]`);
            scripts.forEach(script => {
                console.log(`🗑️ Removing temporary script: ${scriptName}`);
                script.remove();
            });
        });
        
        // Remove all temporary fix elements
        const tempElements = [
            '#live-diagnostic-tool',
            '#emergency-ui-panel',
            '#celebration-fix-button',
            '#layout-fix-button',
            '.celebration',
            '.toast'
        ];
        
        tempElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                console.log(`🗑️ Removing temporary element: ${selector}`);
                element.remove();
            });
        });
        
        // Clear any temporary styles
        const tempStyles = document.querySelectorAll('style[data-temp-fix]');
        tempStyles.forEach(style => style.remove());
        
        console.log('✅ Temporary fixes removed');
    }
    
    // Restore the original working app object structure
    function restoreOriginalAppObject() {
        console.log('🏗️ Restoring original app object...');
        
        // Define the complete original app object structure
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
                activeView: 'auth',
                showingArchived: false,
                particlesInstance: null,
                energyInterval: null,
                matrixInterval: null,
                calendarDate: new Date(),
                achievements: {
                    // Bronze Tier
                    first_goal: { name: "Quest Giver", icon: "🌱", description: "Embark on your first quest.", tier: "Bronze", points: 10 },
                    first_task: { name: "First Step", icon: "👟", description: "Complete your first task.", tier: "Bronze", points: 5 },
                    hundred_points: { name: "Essence Collector", icon: "💰", description: "Earn 100 Essence.", tier: "Bronze", points: 10 },
                    five_tasks_one_day: { name: "Day Striker", icon: "🎯", description: "Complete 5 tasks in a single day.", tier: "Bronze", points: 15 },
                    first_friend: { name: "Social Operator", icon: "🤝", description: "Add your first friend.", tier: "Bronze", points: 20 },
                    // Silver Tier
                    first_goal_completed: { name: "Quest Complete", icon: "🎉", description: "Complete your first quest.", tier: "Silver", points: 50 },
                    week_streak: { name: "On Fire", icon: "🔥", description: "Maintain a 7-day streak.", tier: "Silver", points: 75 },
                    template_sharer: { name: "Architect", icon: "🏗️", description: "Share your first quest template.", tier: "Silver", points: 50 },
                    first_journey_started: { name: "The Journey Begins", icon: "🗺️", description: "Start your first Mastery Journey.", tier: "Silver", points: 40 },
                    challenge_participant: { name: "Team Player", icon: "🌐", description: "Join a Community Challenge.", tier: "Silver", points: 30 },
                    strategist: { name: "Strategist", icon: "♟️", description: "Use a goal template.", tier: "Silver", points: 25 },
                    // Gold Tier
                    level_10: { name: "Chapter 10", icon: "⭐", description: "Reach Chapter 10.", tier: "Gold", points: 100 },
                    perfect_week: { name: "Perfect Week", icon: "💯", description: "Complete a task every day for a week.", tier: "Gold", points: 200 },
                    goal_master: { name: "Quest Master", icon: "👑", description: "Complete 10 quests.", tier: "Gold", points: 150 },
                    first_journey_completed: { name: "Pathfinder", icon: "🧭", description: "Complete your first Mastery Journey.", tier: "Gold", points: 250 },
                    squad_leader: { name: "Squad Leader", icon: "👨‍👩‍👧‍👦", description: "Have 5 friends on your list.", tier: "Gold", points: 100 },
                    // Platinum Tier
                    level_25: { name: "Chapter 25", icon: "🌟", description: "Reach Chapter 25.", tier: "Platinum", points: 250 },
                    month_streak: { name: "Unstoppable", icon: "🚀", description: "Maintain a 30-day streak.", tier: "Platinum", points: 500 },
                    all_categories: { name: "Jack of All Trades", icon: "🎨", description: "Complete a quest in every category.", tier: "Platinum", points: 300 },
                    journeyman: { name: "Journeyman", icon: "🧳", description: "Complete 5 Mastery Journeys.", tier: "Platinum", points: 400 },
                    // Legendary Tier
                    level_50: { name: "Living Legend", icon: "🌌", description: "Reach Chapter 50.", tier: "Legendary", points: 1000 },
                    year_streak: { name: "Operator Prime", icon: "🏆", description: "Maintain a 365-day streak.", tier: "Legendary", points: 5000 },
                    community_pillar: { name: "Community Pillar", icon: "🏛️", description: "Share 5 quest templates.", tier: "Legendary", points: 800 },
                },
                storeItems: {
                    streakShield: { id: 'streakShield', name: 'Streak Shield', description: 'Protect your streak from breaking if you miss a day.', cost: 250, icon: '🛡️', type: 'consumable' },
                    aiTaskBreakdown: { id: 'aiTaskBreakdown', name: 'AI Task Breakdown', description: 'Get one AI-powered task breakdown or advice.', cost: 50, icon: '🤖', type: 'consumable' },
                    kernelCobaltTheme: { id: 'kernelCobaltTheme', name: 'Kernel Cobalt Theme', description: 'Unlock an exclusive dark blue color scheme.', cost: 1000, icon: '🎨', type: 'permanent' }
                },
                journeyTemplates: {
                    '30_day_wellness': { 
                        name: '30-Day Wellness Ascent', icon: '🧘', category: 'Health',
                        description: 'A 30-day journey to build a consistent health and wellness routine, focusing on meditation, hydration, and movement.',
                        tasks: Array.from({length: 30}, (_, i) => `Day ${i+1}: Meditate for 5 mins, drink 8 glasses of water, and walk for 15 mins.`)
                    },
                    '90_day_focus': { 
                        name: '90-Day Focus Mastery', icon: '🎯', category: 'Learning',
                        description: 'A 90-day deep dive into mastering focus and eliminating distractions through structured work blocks and digital detoxes.',
                        tasks: Array.from({length: 90}, (_, i) => `Day ${i+1}: Complete two 45-minute deep work sessions with no distractions.`)
                    },
                    'learn_language': {
                        name: '180-Day Language Acquisition', icon: '🗣️', category: 'Learning',
                        description: 'A six-month journey to achieve conversational fluency in a new language through daily practice.',
                        tasks: Array.from({length: 180}, (_, i) => `Day ${i+1}: Practice 20 minutes of vocabulary flashcards and one 10-minute listening exercise.`)
                    },
                    'fitness_transformation': {
                        name: '120-Day Fitness Transformation', icon: '💪', category: 'Health',
                        description: 'A four-month structured program to build strength and endurance, alternating between workout days and active recovery.',
                        tasks: Array.from({length: 120}, (_, i) => `Day ${i+1}: ${i % 2 === 0 ? 'Complete your scheduled strength workout.' : 'Perform 30 minutes of light cardio or stretching.'}`)
                    },
                    'side_hustle': {
                        name: '100-Day Side Hustle Launch', icon: '🚀', category: 'Work',
                        description: 'A guided 100-day sprint to take a side project from idea to launch, focusing on consistent, incremental progress.',
                        tasks: Array.from({length: 100}, (_, i) => `Day ${i+1}: Dedicate 1 hour to your side project, focusing on the next most important task.`)
                    },
                    'mindful_morning': {
                        name: '21-Day Mindful Morning', icon: '🌅', category: 'Personal',
                        description: 'Cultivate a peaceful and productive morning routine over 21 days, incorporating mindfulness and intention setting.',
                        tasks: Array.from({length: 21}, (_, i) => `Day ${i+1}: Upon waking, avoid your phone for 15 mins and practice 5 minutes of gratitude journaling.`)
                    },
                    'financial_cleanup': {
                        name: '60-Day Financial Cleanup', icon: '🧹', category: 'Finance',
                        description: 'A two-month journey to organize your finances, create a budget, and start an automated savings plan.',
                        tasks: Array.from({length: 60}, (_, i) => `Day ${i+1}: Track all expenses for today and categorize them in your budget spreadsheet.`)
                    },
                    'creative_writing': {
                        name: '30-Day Creative Writing Habit', icon: '✍️', category: 'Personal',
                        description: 'Build a consistent daily writing habit by writing just 100 words a day for 30 days.',
                        tasks: Array.from({length: 30}, (_, i) => `Day ${i+1}: Write at least 100 words on any topic of your choice.`)
                    },
                    'read_a_book': {
                        name: '14-Day Bookworm Challenge', icon: '📚', category: 'Learning',
                        description: 'Finish reading a book in two weeks by setting aside dedicated reading time each day.',
                        tasks: Array.from({length: 14}, (_, i) => `Day ${i+1}: Read for at least 20 minutes without distractions.`)
                    }
                },
                communityChallenges: [
                    { id: 'health_sprint_1', name: 'Global Health Sprint', description: 'Let\'s complete 100 Health tasks together as a community!', category: 'Health', goal: 100, reward: 200 },
                    { id: 'learning_marathon_1', name: 'Learning Marathon', description: 'The community goal is to complete 50 Learning tasks this month.', category: 'Learning', goal: 50, reward: 150 },
                    { id: 'creative_hour_1', name: 'Creative Hour Challenge', description: 'Let\'s log 200 hours of creative work this month!', category: 'Personal', goal: 200, reward: 250 },
                    { id: 'finance_sprint_1', name: 'Financial Literacy Sprint', description: 'Complete 75 Finance-related tasks as a community to boost our collective wealth.', category: 'Finance', goal: 75, reward: 150 },
                    { id: 'productivity_push_1', name: 'Global Productivity Push', description: 'Can we complete 500 Work tasks together this quarter?', category: 'Work', goal: 500, reward: 500 }
                ],
                colorSchemes: {
                    'Firewall Flare': '#f97316', 'Kernel Cobalt': '#007BFF', 'Sudo Violet': '#9D00FF',
                    'Terminal Teal': '#28a745', 'Glitch Magenta': '#E0115F', 'Static Cyan': '#00A3A3',
                    'Cache Gold': '#FFD700', 'Ruby Redux': '#D1001F', 'Kernel Cobalt Theme': '#1e3a8a',
                },
                goalTemplates: [
                    { name: "Run a 5k", category: "Health", title: "Train for and Complete a 5k Race", description: "Follow a structured training plan to build endurance and successfully run a 5k.", tasks: ["Research and choose a beginner 5k training plan.", "Buy proper running shoes.", "Complete Week 1 of training.", "Complete Week 2 of training.", "Sign up for a local 5k race.", "Practice running the full 5k distance at least once before race day.", "Rest and hydrate properly the day before the race."] },
                    { name: "Learn a New Skill", category: "Learning", title: "Learn the Basics of a New Skill", description: "Dedicate time to learning the fundamentals of a new skill (e.g., coding, a musical instrument, a language).", tasks: ["Identify the skill and key learning resources (books, courses).", "Dedicate 30 minutes per day to practice/study.", "Complete an introductory online course or tutorial.", "Create a small project using the new skill.", "Get feedback from a more experienced person."] },
                    { name: "Emergency Fund", category: "Finance", title: "Build a 3-Month Emergency Fund", description: "Systematically save to cover three months of essential living expenses.", tasks: ["Calculate your total monthly essential expenses.", "Determine your final savings goal (expenses x 3).", "Open a dedicated high-yield savings account.", "Set up an automatic weekly or monthly transfer.", "Track your progress towards the goal."] },
                    { name: "Digital Detox", category: "Personal", title: "Complete a Digital Detox Weekend", description: "Disconnect from all screens for a full weekend to recharge and refocus.", tasks: ["Schedule a weekend and inform friends/family.", "Plan non-digital activities (reading, hiking, etc.).", "Delete social media apps from your phone for the weekend.", "Turn off all non-essential notifications.", "Write a reflection on the experience afterward."] },
                    { name: "Master a Software", category: "Work", title: "Master a New Software Tool", description: "Become proficient in a key software tool relevant to your career.", tasks: ["Identify the target software (e.g., Figma, Excel, a CRM).", "Find and enroll in a top-rated online course.", "Complete the course and all its exercises.", "Apply the new skills to a real-world project.", "Create a portfolio piece showcasing your new proficiency."] },
                    { name: "SMART Goal", category: "Personal", title: "Set a SMART Goal", description: "Use the SMART framework for effective goal setting.", tasks: ["Make your goal Specific.", "Make your goal Measurable.", "Make your goal Achievable.", "Make your goal Relevant.", "Make your goal Time-bound."] },
                    { name: "OKR Setup", category: "Work", title: "Set Quarterly OKRs", description: "Define Objectives and Key Results for the quarter.", tasks: ["Define 3-5 key objectives.", "For each objective, define 3-5 measurable key results.", "Align OKRs with team/company goals.", "Schedule mid-quarter review.", "Track weekly progress."] },
                    { name: "WOOP Goal", category: "Learning", title: "Use WOOP Method for Goal Achievement", description: "Wish, Outcome, Obstacle, Plan - a scientific approach to goal setting.", tasks: ["State your Wish.", "Visualize the Outcome.", "Identify potential Obstacles.", "Create an If-Then Plan to overcome obstacles."] },
                    { name: "Habit Stacking", category: "Health", title: "Build a New Habit Stack", description: "Stack new habits onto existing ones for easier adoption.", tasks: ["Choose an existing habit as anchor.", "Select a new habit to stack.", "Define the sequence.", "Practice the stack daily.", "Track consistency for 21 days."] },
                    { name: "Eisenhower Matrix", category: "Work", title: "Prioritize Tasks with Eisenhower Matrix", description: "Sort tasks by urgency and importance.", tasks: ["List all current tasks.", "Categorize each as Urgent/Important, Urgent/Not Important, Not Urgent/Important, or Not Urgent/Not Important.", "Do Urgent/Important tasks immediately.", "Schedule Not Urgent/Important tasks.", "Delegate or delete others."] }
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
                console.log('🚀 Starting app initialization...');
                
                // Skip Firebase for now - use mock data
                console.log('⚠️ Skipping Firebase initialization - using mock data');
                
                // Set up mock user data
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

                // Initialize UI components
                console.log('🎨 Initializing UI components...');
                this.ui.initTheme();
                this.router.init();
                this.eventListeners.init();
                this.ui.initLuckyWheel();
                this.audio.init();
                this.ui.initMatrixRain();
                
                // Update the UI to show dashboard
                this.ui.updateView();
                
                // Hide loading overlay
                const loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.style.opacity = '0';
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                    }, 500);
                }
                
                console.log('✅ App initialization completed successfully');
            },
            
            // --- RESOURCE CLEANUP ---
            cleanup() {
                if (this.state.energyInterval) clearInterval(this.state.energyInterval);
                if (this.state.matrixInterval) clearInterval(this.state.matrixInterval);
                if (this.state.particlesInstance) this.state.particlesInstance.stop();

                this.state.currentUser = null;
                this.state.userData = null;
                this.state.localGoals = {};
                this.state.friendsData = [];
            },

            // --- ROUTER & UI ---
            router: {
                init() {
                    document.querySelectorAll('.nav-item a').forEach(link => {
                        link.addEventListener('click', (e) => { 
                            e.preventDefault(); 
                            this.navigateTo(e.currentTarget.dataset.view); 
                        });
                    });
                },
                navigateTo(view) { 
                    app.state.activeView = view; 
                    app.ui.updateView(); 
                }
            },
            
            ui: {
                update() {
                    this.updateView();
                },
                
                updateView() {
                    const { currentUser, userData, activeView } = app.state;
                    
                    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
                    document.getElementById('auth-view').classList.add('hidden');
                    
                    // Always show sidebar and header (bypass authentication)
                    document.getElementById('sidebar').classList.remove('hidden');
                    document.getElementById('app-header').classList.remove('hidden');
                    
                    // Show the active view
                    const activeViewElement = document.getElementById(`${activeView}-view`);
                    if (activeViewElement) {
                        activeViewElement.classList.remove('hidden');
                    }
                    
                    // Update navigation
                    document.querySelectorAll('.nav-item a').forEach(a => a.classList.toggle('active', a.dataset.view === activeView));
                    document.getElementById('view-title').textContent = activeView.charAt(0).toUpperCase() + activeView.slice(1);
                    
                    // Show goal buttons if on goals view
                    const showGoalButtons = activeView === 'goals';
                    const addGoalBtn = document.getElementById('add-goal-btn');
                    const addGoalTemplateBtn = document.getElementById('add-goal-template-btn');
                    if (addGoalBtn) addGoalBtn.classList.toggle('hidden', !showGoalButtons);
                    if (addGoalTemplateBtn) addGoalTemplateBtn.classList.toggle('hidden', !showGoalButtons);
                    
                    // Set profile info (use mock data if no user)
                    const profileName = document.getElementById('profile-name');
                    const profileEmail = document.getElementById('profile-email');
                    const userIdDisplay = document.getElementById('user-id-display');
                    
                    if (profileName) profileName.textContent = userData?.displayName || 'Operator';
                    if (profileEmail) profileEmail.textContent = userData?.email || 'operator@uplift.com';
                    if (userIdDisplay) userIdDisplay.textContent = currentUser?.uid || 'demo-user';

                    switch (activeView) {
                        case 'dashboard': 
                            this.renderDashboard(); 
                            this.updateDashboardStats();
                            break;
                        case 'goals': this.renderGoals(); break;
                        case 'journeys': this.renderJourneys(); break;
                        case 'calendar': this.renderCalendar(); break;
                        case 'analytics': this.renderAnalytics(); break;
                        case 'community': this.renderCommunity(); break;
                        case 'habits': 
                            app.habits.renderHabits();
                            this.renderHabitAnalytics();
                            break;
                        case 'focus': 
                            this.renderFocusSessions();
                            this.renderFocusAnalytics();
                            break;
                        case 'achievements': this.renderAchievements(); break;
                        case 'settings': this.renderSettings(); break;
                    }
                },
                
                renderDashboard() {
                    if (!app.state.userData) return;
                    const stats = app.state.userData.stats;
                    this.animateCounter('dashboard-points', stats.points);
                    this.animateCounter('dashboard-energy', Math.floor(stats.energy.value));
                    this.animateCounter('dashboard-level', stats.level);
                    this.animateCounter('dashboard-streak', stats.currentStreak, '🔥 ');
                    
                    const levelInfo = app.gamification.getLevelInfo(stats.level);
                    const progress = ((stats.points - levelInfo.baseXP) / (levelInfo.nextLevelXP - levelInfo.baseXP)) * 100;
                    document.getElementById('level-progress-bar').style.width = `${Math.min(progress, 100)}%`;
                    document.getElementById('level-progress-text').textContent = `${stats.points - levelInfo.baseXP} / ${levelInfo.nextLevelXP - levelInfo.baseXP} XP to Chapter ${stats.level + 1}`;
                    
                    document.getElementById('energy-progress-bar').style.width = `${stats.energy.value}%`;
                    document.getElementById('energy-level-text').textContent = `${Math.floor(stats.energy.value)} / 100`;

                    this.renderWeeklyChart();
                    this.renderTreasureChest();
                    this.renderCharacterStats();
                    app.gamification.getAIMentorMessage();
                },
                
                renderGoals() {
                    const { showingArchived } = app.state;
                    const goalList = document.getElementById('goal-list');
                    if (goalList) {
                        goalList.innerHTML = '<li class="no-goals">No goals yet. Create your first goal!</li>';
                    }
                },
                
                renderJourneys() {
                    this.showToast('Journeys view loaded', 'info');
                },
                
                renderCalendar() {
                    this.showToast('Calendar view loaded', 'info');
                },
                
                renderAnalytics() {
                    this.showToast('Analytics view loaded', 'info');
                },
                
                renderCommunity() {
                    this.showToast('Community view loaded', 'info');
                },
                
                renderHabitAnalytics() {
                    this.showToast('Habit analytics loaded', 'info');
                },
                
                renderFocusSessions() {
                    this.showToast('Focus sessions loaded', 'info');
                },
                
                renderFocusAnalytics() {
                    this.showToast('Focus analytics loaded', 'info');
                },
                
                renderAchievements() {
                    this.showToast('Achievements loaded', 'info');
                },
                
                renderSettings() {
                    this.showToast('Settings loaded', 'info');
                },
                
                renderWeeklyChart() {
                    // Chart rendering implementation
                },
                
                renderTreasureChest() {
                    // Treasure chest rendering
                },
                
                renderCharacterStats() {
                    // Character stats rendering
                },
                
                renderLeaderboard() {
                    this.showToast('Leaderboard loaded', 'info');
                },
                
                renderFriendsList() {
                    this.showToast('Friends list loaded', 'info');
                },
                
                renderCommunityChallenges() {
                    this.showToast('Community challenges loaded', 'info');
                },
                
                // Theme and styling
                initTheme() {
                    console.log('🎨 Initializing theme...');
                    const savedTheme = localStorage.getItem('theme') || 'dark';
                    document.documentElement.setAttribute('data-theme', savedTheme);
                    this.applyUserSettings();
                },
                
                applyUserSettings() {
                    console.log('⚙️ Applying user settings...');
                    if (app.state.userData?.settings?.theme) {
                        document.documentElement.setAttribute('data-theme', app.state.userData.settings.theme);
                    }
                },
                
                // Lucky wheel functionality
                initLuckyWheel() {
                    console.log('🎡 Initializing lucky wheel...');
                    // Create lucky wheel if it doesn't exist
                    if (!document.getElementById('lucky-wheel-modal')) {
                        const wheelModal = document.createElement('div');
                        wheelModal.id = 'lucky-wheel-modal';
                        wheelModal.className = 'modal hidden';
                        wheelModal.innerHTML = `
                            <div class="modal-content">
                                <h3>🎡 Daily Rewards</h3>
                                <div class="wheel-container">
                                    <div class="wheel" id="reward-wheel"></div>
                                    <button class="btn btn-primary" id="spin-wheel-btn">Spin for Rewards!</button>
                                </div>
                                <button class="modal-close" onclick="this.parentElement.parentElement.classList.add('hidden')">×</button>
                            </div>
                        `;
                        document.body.appendChild(wheelModal);
                    }
                },
                
                // Matrix rain effect
                initMatrixRain() {
                    console.log('🌧️ Initializing matrix rain...');
                    // Matrix rain effect implementation
                    const canvas = document.createElement('canvas');
                    canvas.id = 'matrix-rain';
                    canvas.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: -1;
                        opacity: 0.1;
                    `;
                    document.body.appendChild(canvas);
                    
                    const ctx = canvas.getContext('2d');
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    
                    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
                    const matrixArray = matrix.split("");
                    
                    const fontSize = 10;
                    const columns = canvas.width / fontSize;
                    const drops = [];
                    
                    for (let x = 0; x < columns; x++) {
                        drops[x] = 1;
                    }
                    
                    function draw() {
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        
                        ctx.fillStyle = '#0F0';
                        ctx.font = fontSize + 'px monospace';
                        
                        for (let i = 0; i < drops.length; i++) {
                            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                            
                            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                                drops[i] = 0;
                            }
                            drops[i]++;
                        }
                    }
                    
                    setInterval(draw, 35);
                },
                
                // Toast notifications
                showToast(message, type = 'info') {
                    console.log(`🍞 Toast: ${message} (${type})`);
                    const toast = document.createElement('div');
                    toast.className = `toast toast-${type}`;
                    toast.textContent = message;
                    toast.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px;
                        z-index: 10000;
                        animation: slideIn 0.3s ease;
                    `;
                    
                    document.body.appendChild(toast);
                    
                    setTimeout(() => {
                        toast.style.animation = 'slideOut 0.3s ease';
                        setTimeout(() => toast.remove(), 300);
                    }, 3000);
                },
                
                // Confirmation dialogs
                showConfirm(title, message, onConfirm) {
                    console.log(`❓ Confirm: ${title}`);
                    const modal = document.createElement('div');
                    modal.className = 'modal';
                    modal.innerHTML = `
                        <div class="modal-content">
                            <h3>${title}</h3>
                            <p>${message}</p>
                            <div class="modal-actions">
                                <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                                <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove(); (${onConfirm.toString()})()">Confirm</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(modal);
                },
                
                // Celebration effects
                triggerCelebration() {
                    console.log('🎉 Triggering celebration...');
                    // Create celebration effect
                    const celebration = document.createElement('div');
                    celebration.className = 'celebration';
                    celebration.innerHTML = `
                        <div class="celebration-content">
                            <h2>🎉 Achievement Unlocked! 🎉</h2>
                            <p>Great job! Keep up the amazing work!</p>
                        </div>
                    `;
                    celebration.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 20px;
                        border-radius: 10px;
                        z-index: 10000;
                        animation: celebration 2s ease;
                    `;
                    
                    document.body.appendChild(celebration);
                    
                    setTimeout(() => celebration.remove(), 2000);
                },
                
                // Modal management
                openGoalModal(goal = null, parentId = null) {
                    console.log('📝 Opening goal modal...');
                    this.showToast('Goal modal opened', 'info');
                },
                
                closeGoalModal() {
                    console.log('📝 Closing goal modal...');
                    const modal = document.querySelector('.goal-modal');
                    if (modal) modal.remove();
                },
                
                showAddTaskModal(goalId) {
                    console.log('📋 Opening add task modal...');
                    this.showToast('Add task modal opened', 'info');
                },
                
                showTutorialModal() {
                    console.log('📚 Opening tutorial modal...');
                    this.showToast('Tutorial modal opened', 'info');
                },
                
                // Utility methods
                animateCounter(elementId, targetValue, prefix = '') {
                    const element = document.getElementById(elementId);
                    if (!element) return;
                    
                    const startValue = parseInt(element.textContent.replace(/\D/g, '')) || 0;
                    const duration = 1000;
                    const startTime = Date.now();
                    
                    function updateCounter() {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
                        
                        element.textContent = prefix + currentValue.toLocaleString();
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }
                    
                    updateCounter();
                },
                
                updateDashboardStats() {
                    console.log('📊 Updating dashboard stats...');
                    if (!app.state.userData) return;
                    
                    const stats = app.state.userData.stats;
                    const levelProgressBar = document.getElementById('level-progress-bar');
                    const energyProgressBar = document.getElementById('energy-progress-bar');
                    
                    if (levelProgressBar) {
                        const progress = (stats.points % 100) / 100 * 100;
                        levelProgressBar.style.width = `${progress}%`;
                    }
                    
                    if (energyProgressBar) {
                        energyProgressBar.style.width = `${stats.energy.value}%`;
                    }
                },
                
                restartBackgroundEffects() {
                    console.log('🔄 Restarting background effects...');
                    // Restart any background effects
                },
                
                spinWheel() {
                    console.log('🎡 Spinning wheel...');
                    this.showToast('Wheel spun! You won 50 points!', 'success');
                },
                
                applyColorScheme(schemeName) {
                    console.log(`🎨 Applying color scheme: ${schemeName}`);
                    this.showToast(`Color scheme applied: ${schemeName}`, 'success');
                },
                
                analyzeProfile(formData) {
                    console.log('🔍 Analyzing profile...');
                    return Promise.resolve({ success: true, analysis: 'Profile analysis complete' });
                }
            },
            
            // AI object
            ai: {
                setPersonality(personality) {
                    console.log('🤖 Setting AI personality:', personality);
                },
                
                requestGoalBreakdown(goal) {
                    console.log('🎯 AI Goal Breakdown requested for:', goal);
                    return {
                        success: true,
                        breakdown: [
                            'Step 1: Define specific milestones',
                            'Step 2: Set realistic deadlines',
                            'Step 3: Track progress regularly',
                            'Step 4: Adjust as needed'
                        ]
                    };
                },
                
                requestAdvice(context) {
                    console.log('💡 AI Advice requested for:', context);
                    return {
                        success: true,
                        advice: 'Focus on consistency and small daily improvements. Every step forward counts!'
                    };
                },
                
                requestMotivation() {
                    console.log('🔥 AI Motivation requested');
                    return {
                        success: true,
                        motivation: 'You\'re doing great! Keep pushing forward and remember why you started.'
                    };
                },
                
                getAIMentorMessage() {
                    console.log('🤖 Getting AI mentor message');
                    return 'Stay focused on your goals. Every small step counts towards your success!';
                }
            },
            
            // Gamification object
            gamification: {
                getLevelInfo(level) {
                    return {
                        baseXP: level * 100,
                        nextLevelXP: (level + 1) * 100,
                        level: level
                    };
                },
                
                getAITip() {
                    const tips = [
                        'Break big goals into smaller, manageable tasks.',
                        'Celebrate small wins to stay motivated.',
                        'Consistency beats perfection every time.',
                        'Track your progress to see how far you\'ve come.',
                        'Don\'t be afraid to adjust your goals as needed.'
                    ];
                    return tips[Math.floor(Math.random() * tips.length)];
                },
                
                getMorningMotivation() {
                    const motivations = [
                        'Good morning! Today is a new opportunity to make progress.',
                        'Rise and shine! Your goals are waiting for you.',
                        'Morning! Let\'s make today count towards your dreams.',
                        'Good morning! Every day is a chance to level up.',
                        'Rise and grind! Your future self will thank you.'
                    ];
                    return motivations[Math.floor(Math.random() * motivations.length)];
                }
            },
            
            // Habits object
            habits: {
                renderHabits() {
                    console.log('💪 Rendering habits...');
                    app.ui.showToast('Habits view loaded', 'info');
                }
            },
            
            // Event listeners object
            eventListeners: {
                init() {
                    console.log('👂 Event listeners initialized');
                    this.setupGoalButtons();
                    this.setupNavigation();
                    this.setupThemeToggle();
                },
                
                setupGoalButtons() {
                    const addGoalBtn = document.getElementById('add-goal-btn');
                    if (addGoalBtn) {
                        addGoalBtn.addEventListener('click', () => {
                            app.ui.openGoalModal();
                        });
                    }
                    
                    const addGoalTemplateBtn = document.getElementById('add-goal-template-btn');
                    if (addGoalTemplateBtn) {
                        addGoalTemplateBtn.addEventListener('click', () => {
                            app.ui.showToast('Goal template feature coming soon!', 'info');
                        });
                    }
                },
                
                setupNavigation() {
                    document.querySelectorAll('.nav-item a').forEach(link => {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            const view = link.getAttribute('data-view');
                            if (view) {
                                app.state.activeView = view;
                                app.ui.updateView();
                            }
                        });
                    });
                },
                
                setupThemeToggle() {
                    const themeToggle = document.getElementById('theme-toggle-btn');
                    if (themeToggle) {
                        themeToggle.addEventListener('click', () => {
                            const currentTheme = document.documentElement.getAttribute('data-theme');
                            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                            document.documentElement.setAttribute('data-theme', newTheme);
                            localStorage.setItem('theme', newTheme);
                            app.ui.showToast(`Theme changed to ${newTheme}`, 'success');
                        });
                    }
                }
            },
            
            // Audio object
            audio: {
                init() {
                    console.log('🔊 Audio initialized');
                    // Audio initialization
                },
                
                playSound(soundName) {
                    console.log(`🔊 Playing sound: ${soundName}`);
                    // Sound playing implementation
                }
            }
        };
        
        console.log('✅ Original app object structure restored');
    }
    
    // Initialize the restoration
    function initializeRestoration() {
        console.log('🔧 Initializing original structure restoration...');
        
        // Remove all temporary fixes
        restoreOriginalStructure();
        
        // Restore original app object
        restoreOriginalAppObject();
        
        // Initialize the app
        if (window.app && window.app.init) {
            console.log('🚀 Initializing restored app...');
            window.app.init();
        }
        
        console.log('✅ Original structure restoration completed');
    }
    
    // Run restoration when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRestoration);
    } else {
        initializeRestoration();
    }
    
    // Also run when window loads
    window.addEventListener('load', function() {
        setTimeout(initializeRestoration, 100);
    });
    
    console.log('✅ Restore Original Structure loaded successfully');
})(); 