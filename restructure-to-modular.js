// === RESTRUCTURE TO MODULAR ARCHITECTURE ===
// This script removes the massive inline app object and properly uses the modular architecture

(function() {
    'use strict';
    
    console.log('🏗️ Restructuring to Modular Architecture...');
    
    // Remove the massive inline app object and use proper modular architecture
    function restructureToModular() {
        console.log('🔄 Restructuring to modular architecture...');
        
        // Remove the restore-original-structure script (temporary fix)
        const restoreScript = document.querySelector('script[src*="restore-original-structure.js"]');
        if (restoreScript) {
            console.log('🗑️ Removing temporary restore script');
            restoreScript.remove();
        }
        
        // Remove any existing inline app object
        const existingAppScripts = document.querySelectorAll('script');
        existingAppScripts.forEach(script => {
            if (script.textContent && script.textContent.includes('window.app = {')) {
                console.log('🗑️ Removing inline app object');
                script.remove();
            }
        });
        
        // Add proper modular initialization
        const modularInitScript = document.createElement('script');
        modularInitScript.type = 'module';
        modularInitScript.textContent = `
            // === MODULAR APP INITIALIZATION ===
            import CoreModule from './js/modules/core-enhanced.js';
            import UIModule from './js/modules/ui.js';
            import AIModule from './js/modules/ai.js';
            import GamificationModule from './js/modules/gamification.js';
            import GoalsModule from './js/modules/goals.js';
            import AuthModule from './js/modules/auth.js';
            import AnalyticsModule from './js/modules/analytics.js';
            import StorageModule from './js/modules/storage.js';
            
            class ModularApp {
                constructor() {
                    this.modules = {};
                    this.state = {
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
                        journeyTemplates: {
                            '30_day_wellness': { 
                                name: '30-Day Wellness Ascent', icon: '🧘', category: 'Health',
                                description: 'A 30-day journey to build a consistent health and wellness routine, focusing on meditation, hydration, and movement.',
                                tasks: Array.from({length: 30}, (_, i) => \`Day \${i+1}: Meditate for 5 mins, drink 8 glasses of water, and walk for 15 mins.\`)
                            },
                            '90_day_focus': { 
                                name: '90-Day Focus Mastery', icon: '🎯', category: 'Learning',
                                description: 'A 90-day deep dive into mastering focus and eliminating distractions through structured work blocks and digital detoxes.',
                                tasks: Array.from({length: 90}, (_, i) => \`Day \${i+1}: Complete two 45-minute deep work sessions with no distractions.\`)
                            },
                            'learn_language': {
                                name: '180-Day Language Acquisition', icon: '🗣️', category: 'Learning',
                                description: 'A six-month journey to achieve conversational fluency in a new language through daily practice.',
                                tasks: Array.from({length: 180}, (_, i) => \`Day \${i+1}: Practice 20 minutes of vocabulary flashcards and one 10-minute listening exercise.\`)
                            },
                            'fitness_transformation': {
                                name: '120-Day Fitness Transformation', icon: '💪', category: 'Health',
                                description: 'A four-month structured program to build strength and endurance, alternating between workout days and active recovery.',
                                tasks: Array.from({length: 120}, (_, i) => \`Day \${i+1}: \${i % 2 === 0 ? 'Complete your scheduled strength workout.' : 'Perform 30 minutes of light cardio or stretching.'}\`)
                            },
                            'side_hustle': {
                                name: '100-Day Side Hustle Launch', icon: '🚀', category: 'Work',
                                description: 'A guided 100-day sprint to take a side project from idea to launch, focusing on consistent, incremental progress.',
                                tasks: Array.from({length: 100}, (_, i) => \`Day \${i+1}: Dedicate 1 hour to your side project, focusing on the next most important task.\`)
                            },
                            'mindful_morning': {
                                name: '21-Day Mindful Morning', icon: '🌅', category: 'Personal',
                                description: 'Cultivate a peaceful and productive morning routine over 21 days, incorporating mindfulness and intention setting.',
                                tasks: Array.from({length: 21}, (_, i) => \`Day \${i+1}: Upon waking, avoid your phone for 15 mins and practice 5 minutes of gratitude journaling.\`)
                            },
                            'financial_cleanup': {
                                name: '60-Day Financial Cleanup', icon: '🧹', category: 'Finance',
                                description: 'A two-month journey to organize your finances, create a budget, and start an automated savings plan.',
                                tasks: Array.from({length: 60}, (_, i) => \`Day \${i+1}: Track all expenses for today and categorize them in your budget spreadsheet.\`)
                            },
                            'creative_writing': {
                                name: '30-Day Creative Writing Habit', icon: '✍️', category: 'Personal',
                                description: 'Build a consistent daily writing habit by writing just 100 words a day for 30 days.',
                                tasks: Array.from({length: 30}, (_, i) => \`Day \${i+1}: Write at least 100 words on any topic of your choice.\`)
                            },
                            'read_a_book': {
                                name: '14-Day Bookworm Challenge', icon: '📚', category: 'Learning',
                                description: 'Finish reading a book in two weeks by setting aside dedicated reading time each day.',
                                tasks: Array.from({length: 14}, (_, i) => \`Day \${i+1}: Read for at least 20 minutes without distractions.\`)
                            }
                        },
                        communityChallenges: [
                            { id: 'health_sprint_1', name: 'Global Health Sprint', description: 'Let\\'s complete 100 Health tasks together as a community!', category: 'Health', goal: 100, reward: 200 },
                            { id: 'learning_marathon_1', name: 'Learning Marathon', description: 'The community goal is to complete 50 Learning tasks this month.', category: 'Learning', goal: 50, reward: 150 },
                            { id: 'creative_hour_1', name: 'Creative Hour Challenge', description: 'Let\\'s log 200 hours of creative work this month!', category: 'Personal', goal: 200, reward: 250 },
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
                    };
                }
                
                async init() {
                    console.log('🚀 Initializing Modular App...');
                    
                    try {
                        // Initialize core module first
                        this.modules.core = new CoreModule(this.state);
                        await this.modules.core.init();
                        
                        // Initialize UI module
                        this.modules.ui = new UIModule(this.state);
                        await this.modules.ui.init();
                        
                        // Initialize AI module
                        this.modules.ai = new AIModule(this.state);
                        await this.modules.ai.init();
                        
                        // Initialize Gamification module
                        this.modules.gamification = new GamificationModule(this.state);
                        await this.modules.gamification.init();
                        
                        // Initialize Goals module
                        this.modules.goals = new GoalsModule(this.state);
                        await this.modules.goals.init();
                        
                        // Initialize Auth module
                        this.modules.auth = new AuthModule(this.state);
                        await this.modules.auth.init();
                        
                        // Initialize Analytics module
                        this.modules.analytics = new AnalyticsModule(this.state);
                        await this.modules.analytics.init();
                        
                        // Initialize Storage module
                        this.modules.storage = new StorageModule(this.state);
                        await this.modules.storage.init();
                        
                        // Set up mock user data for demo
                        this.setupMockData();
                        
                        // Make app globally accessible
                        window.app = this;
                        
                        // Update UI to show dashboard
                        this.modules.ui.updateView();
                        
                        // Hide loading overlay
                        const loadingOverlay = document.getElementById('loading-overlay');
                        if (loadingOverlay) {
                            loadingOverlay.style.opacity = '0';
                            setTimeout(() => {
                                loadingOverlay.style.display = 'none';
                            }, 500);
                        }
                        
                        console.log('✅ Modular App initialized successfully');
                        
                    } catch (error) {
                        console.error('❌ Modular App initialization failed:', error);
                        throw error;
                    }
                }
                
                setupMockData() {
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
                }
                
                // Get module instance
                getModule(name) {
                    return this.modules[name];
                }
                
                // Update state
                updateState(updates) {
                    Object.assign(this.state, updates);
                }
                
                // Cleanup
                cleanup() {
                    Object.values(this.modules).forEach(module => {
                        if (module && typeof module.cleanup === 'function') {
                            module.cleanup();
                        }
                    });
                }
            }
            
            // Initialize the modular app
            const modularApp = new ModularApp();
            modularApp.init().catch(error => {
                console.error('Failed to initialize modular app:', error);
            });
        `;
        
        document.head.appendChild(modularInitScript);
        
        console.log('✅ Modular architecture script added');
    }
    
    // Initialize the restructuring
    function initializeRestructuring() {
        console.log('🏗️ Initializing modular restructuring...');
        
        // Restructure to modular architecture
        restructureToModular();
        
        console.log('✅ Modular restructuring completed');
    }
    
    // Run restructuring when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRestructuring);
    } else {
        initializeRestructuring();
    }
    
    console.log('✅ Restructure to Modular loaded successfully');
})(); 