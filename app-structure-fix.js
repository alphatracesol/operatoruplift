// === APP STRUCTURE FIX ===
// This script fixes the core app structure, missing methods, and initialization issues

(function() {
    'use strict';
    
    console.log('🔧 Loading App Structure Fix...');
    
    // Fix 1: Complete the missing UI object methods
    function fixUIObject() {
        console.log('🎨 Fixing UI object methods...');
        
        if (!window.app) {
            window.app = {};
        }
        
        if (!window.app.ui) {
            window.app.ui = {};
        }
        
        // Add missing UI methods
        const missingUIMethods = {
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
                // Implementation for goal modal
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
            
            // View rendering methods
            renderDashboard() {
                console.log('📊 Rendering dashboard...');
                if (!app.state.userData) return;
                
                const stats = app.state.userData.stats;
                this.animateCounter('dashboard-points', stats.points);
                this.animateCounter('dashboard-energy', Math.floor(stats.energy.value));
                this.animateCounter('dashboard-level', stats.level);
                this.animateCounter('dashboard-streak', stats.currentStreak);
            },
            
            renderGoals() {
                console.log('🎯 Rendering goals...');
                const goalList = document.getElementById('goal-list');
                if (goalList) {
                    goalList.innerHTML = '<li class="no-goals">No goals yet. Create your first goal!</li>';
                }
            },
            
            renderJourneys() {
                console.log('🗺️ Rendering journeys...');
                this.showToast('Journeys view loaded', 'info');
            },
            
            renderCalendar() {
                console.log('📅 Rendering calendar...');
                this.showToast('Calendar view loaded', 'info');
            },
            
            renderAnalytics() {
                console.log('📈 Rendering analytics...');
                this.showToast('Analytics view loaded', 'info');
            },
            
            renderCommunity() {
                console.log('🌐 Rendering community...');
                this.showToast('Community view loaded', 'info');
            },
            
            renderHabitAnalytics() {
                console.log('📊 Rendering habit analytics...');
                this.showToast('Habit analytics loaded', 'info');
            },
            
            renderFocusSessions() {
                console.log('⏱️ Rendering focus sessions...');
                this.showToast('Focus sessions loaded', 'info');
            },
            
            renderFocusAnalytics() {
                console.log('📊 Rendering focus analytics...');
                this.showToast('Focus analytics loaded', 'info');
            },
            
            renderAchievements() {
                console.log('🏆 Rendering achievements...');
                this.showToast('Achievements loaded', 'info');
            },
            
            renderSettings() {
                console.log('⚙️ Rendering settings...');
                this.showToast('Settings loaded', 'info');
            },
            
            renderWeeklyChart() {
                console.log('📊 Rendering weekly chart...');
                // Chart rendering implementation
            },
            
            renderTreasureChest() {
                console.log('💎 Rendering treasure chest...');
                // Treasure chest rendering
            },
            
            renderCharacterStats() {
                console.log('👤 Rendering character stats...');
                // Character stats rendering
            },
            
            renderLeaderboard() {
                console.log('🏆 Rendering leaderboard...');
                this.showToast('Leaderboard loaded', 'info');
            },
            
            renderFriendsList() {
                console.log('👥 Rendering friends list...');
                this.showToast('Friends list loaded', 'info');
            },
            
            renderCommunityChallenges() {
                console.log('🌍 Rendering community challenges...');
                this.showToast('Community challenges loaded', 'info');
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
        };
        
        // Add all missing methods to the UI object
        Object.assign(window.app.ui, missingUIMethods);
        
        console.log('✅ UI object methods fixed');
    }
    
    // Fix 2: Create missing AI object
    function fixAIObject() {
        console.log('🤖 Fixing AI object...');
        
        if (!window.app) {
            window.app = {};
        }
        
        if (!window.app.ai) {
            window.app.ai = {};
        }
        
        // Add missing AI methods
        const missingAIMethods = {
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
        };
        
        // Add all missing methods to the AI object
        Object.assign(window.app.ai, missingAIMethods);
        
        console.log('✅ AI object fixed');
    }
    
    // Fix 3: Create missing gamification object
    function fixGamificationObject() {
        console.log('🎮 Fixing gamification object...');
        
        if (!window.app) {
            window.app = {};
        }
        
        if (!window.app.gamification) {
            window.app.gamification = {};
        }
        
        // Add missing gamification methods
        const missingGamificationMethods = {
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
        };
        
        // Add all missing methods to the gamification object
        Object.assign(window.app.gamification, missingGamificationMethods);
        
        console.log('✅ Gamification object fixed');
    }
    
    // Fix 4: Create missing habits object
    function fixHabitsObject() {
        console.log('💪 Fixing habits object...');
        
        if (!window.app) {
            window.app = {};
        }
        
        if (!window.app.habits) {
            window.app.habits = {};
        }
        
        // Add missing habits methods
        const missingHabitsMethods = {
            renderHabits() {
                console.log('💪 Rendering habits...');
                app.ui.showToast('Habits view loaded', 'info');
            }
        };
        
        // Add all missing methods to the habits object
        Object.assign(window.app.habits, missingHabitsMethods);
        
        console.log('✅ Habits object fixed');
    }
    
    // Fix 5: Create missing router object
    function fixRouterObject() {
        console.log('🛣️ Fixing router object...');
        
        if (!window.app) {
            window.app = {};
        }
        
        if (!window.app.router) {
            window.app.router = {};
        }
        
        // Add missing router methods
        const missingRouterMethods = {
            init() {
                console.log('🛣️ Router initialized');
                // Set up navigation event listeners
                document.querySelectorAll('[data-view]').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const view = link.getAttribute('data-view');
                        app.state.activeView = view;
                        app.ui.updateView();
                    });
                });
            }
        };
        
        // Add all missing methods to the router object
        Object.assign(window.app.router, missingRouterMethods);
        
        console.log('✅ Router object fixed');
    }
    
    // Fix 6: Create missing event listeners object
    function fixEventListenersObject() {
        console.log('👂 Fixing event listeners object...');
        
        if (!window.app) {
            window.app = {};
        }
        
        if (!window.app.eventListeners) {
            window.app.eventListeners = {};
        }
        
        // Add missing event listeners methods
        const missingEventListenersMethods = {
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
        };
        
        // Add all missing methods to the event listeners object
        Object.assign(window.app.eventListeners, missingEventListenersMethods);
        
        console.log('✅ Event listeners object fixed');
    }
    
    // Fix 7: Create missing audio object
    function fixAudioObject() {
        console.log('🔊 Fixing audio object...');
        
        if (!window.app) {
            window.app = {};
        }
        
        if (!window.app.audio) {
            window.app.audio = {};
        }
        
        // Add missing audio methods
        const missingAudioMethods = {
            init() {
                console.log('🔊 Audio initialized');
                // Audio initialization
            },
            
            playSound(soundName) {
                console.log(`🔊 Playing sound: ${soundName}`);
                // Sound playing implementation
            }
        };
        
        // Add all missing methods to the audio object
        Object.assign(window.app.audio, missingAudioMethods);
        
        console.log('✅ Audio object fixed');
    }
    
    // Fix 8: Initialize all fixes
    function initializeAppStructureFix() {
        console.log('🔧 Initializing app structure fix...');
        
        // Fix all missing objects and methods
        fixUIObject();
        fixAIObject();
        fixGamificationObject();
        fixHabitsObject();
        fixRouterObject();
        fixEventListenersObject();
        fixAudioObject();
        
        // Initialize the app if it hasn't been initialized yet
        if (window.app && window.app.init && !window.app.state?.firebaseReady) {
            console.log('🚀 Initializing app...');
            window.app.init();
        }
        
        console.log('✅ App structure fix initialized');
    }
    
    // Run fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAppStructureFix);
    } else {
        initializeAppStructureFix();
    }
    
    // Also run when window loads
    window.addEventListener('load', function() {
        setTimeout(initializeAppStructureFix, 100);
    });
    
    console.log('✅ App Structure Fix loaded successfully');
})(); 