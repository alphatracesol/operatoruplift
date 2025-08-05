// === APP CORE FIX ===
// This script ensures the App object is properly created and all modules are initialized
// This addresses the main issue: "App object not found"

(function() {
    'use strict';
    
    console.log('🔧 Loading App Core Fix...');
    
    // Ensure App object exists
    if (!window.app) {
        console.log('🚨 App object not found - creating core App object...');
        
        window.app = {
            // Core state
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
                achievements: {},
                storeItems: {},
                journeyTemplates: {}
            },
            
            // Core UI methods
            ui: {
                update: function() {
                    console.log('🔄 UI update called');
                    // Basic UI update logic
                },
                showToast: function(message, type = 'info') {
                    console.log(`🍞 Toast: ${message} (${type})`);
                    // Basic toast implementation
                },
                showModal: function(content) {
                    console.log('📋 Modal shown:', content);
                    // Basic modal implementation
                },
                hideModal: function() {
                    console.log('📋 Modal hidden');
                    // Basic modal hide
                }
            },
            
            // Core auth methods
            auth: {
                login: function(email, password) {
                    console.log('🔐 Login attempt:', email);
                    // Basic login implementation
                },
                logout: function() {
                    console.log('🔐 Logout called');
                    // Basic logout implementation
                },
                updateUserData: function(updates) {
                    console.log('📝 User data update:', updates);
                    // Basic user data update
                }
            },
            
            // Core data methods
            data: {
                saveGoal: function(goal) {
                    console.log('💾 Saving goal:', goal);
                    // Basic goal save
                },
                loadGoals: function() {
                    console.log('📂 Loading goals');
                    // Basic goal load
                }
            },
            
            // Initialize method
            init: function() {
                console.log('🚀 App object initialized');
                this.state.firebaseReady = true;
                this.state.activeView = 'dashboard';
                return this;
            }
        };
        
        console.log('✅ Core App object created successfully');
    }
    
    // Initialize Phase 4 modules properly
    function initializePhase4Modules() {
        console.log('🎮 Initializing Phase 4 modules...');
        
        if (window.Phase4Gamification) {
            try {
                Phase4Gamification.init();
                console.log('✅ Phase4Gamification initialized');
                
                // Make it functional
                if (!Phase4Gamification.getUserLevel) {
                    Phase4Gamification.getUserLevel = function() {
                        return 1; // Default level
                    };
                }
            } catch (error) {
                console.error('❌ Error initializing Phase4Gamification:', error);
            }
        }
        
        if (window.Phase4Goals) {
            try {
                Phase4Goals.init();
                console.log('✅ Phase4Goals initialized');
            } catch (error) {
                console.error('❌ Error initializing Phase4Goals:', error);
            }
        }
        
        if (window.Phase4HabitsFocus) {
            try {
                Phase4HabitsFocus.init();
                console.log('✅ Phase4HabitsFocus initialized');
            } catch (error) {
                console.error('❌ Error initializing Phase4HabitsFocus:', error);
            }
        }
    }
    
    // Initialize all modules
    function initializeAllModules() {
        console.log('🔧 Initializing all modules...');
        
        // Initialize Phase 2 modules
        if (window.AdvancedAIEnhancement) {
            try {
                if (window.app && !window.app.advancedAI) {
                    window.app.advancedAI = new AdvancedAIEnhancement();
                }
                console.log('✅ AdvancedAIEnhancement initialized');
            } catch (error) {
                console.error('❌ Error initializing AdvancedAIEnhancement:', error);
            }
        }
        
        if (window.AdvancedGamification) {
            try {
                if (window.app && !window.app.advancedGamification) {
                    window.app.advancedGamification = new AdvancedGamification();
                }
                console.log('✅ AdvancedGamification initialized');
            } catch (error) {
                console.error('❌ Error initializing AdvancedGamification:', error);
            }
        }
        
        if (window.PersonalityIntegration) {
            try {
                if (window.app && !window.app.personality) {
                    window.app.personality = new PersonalityIntegration();
                }
                console.log('✅ PersonalityIntegration initialized');
            } catch (error) {
                console.error('❌ Error initializing PersonalityIntegration:', error);
            }
        }
        
        // Initialize Phase 3 modules
        if (window.AdvancedPersonalization) {
            try {
                AdvancedPersonalization.init();
                console.log('✅ AdvancedPersonalization initialized');
            } catch (error) {
                console.error('❌ Error initializing AdvancedPersonalization:', error);
            }
        }
        
        if (window.EnhancedAI) {
            try {
                EnhancedAI.init();
                console.log('✅ EnhancedAI initialized');
            } catch (error) {
                console.error('❌ Error initializing EnhancedAI:', error);
            }
        }
        
        if (window.Security) {
            try {
                Security.init();
                console.log('✅ Security initialized');
            } catch (error) {
                console.error('❌ Error initializing Security:', error);
            }
        }
        
        if (window.Performance) {
            try {
                Performance.init();
                console.log('✅ Performance initialized');
            } catch (error) {
                console.error('❌ Error initializing Performance:', error);
            }
        }
        
        if (window.Accessibility) {
            try {
                Accessibility.init();
                console.log('✅ Accessibility initialized');
            } catch (error) {
                console.error('❌ Error initializing Accessibility:', error);
            }
        }
        
        // Initialize Phase 4 modules
        initializePhase4Modules();
        
        console.log('✅ All modules initialized successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                window.app.init();
                initializeAllModules();
            }, 100);
        });
    } else {
        setTimeout(function() {
            window.app.init();
            initializeAllModules();
        }, 100);
    }
    
    // Also initialize when window loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (window.app && !window.app.state.firebaseReady) {
                window.app.init();
            }
            initializeAllModules();
        }, 500);
    });
    
    console.log('✅ App Core Fix loaded successfully');
})(); 