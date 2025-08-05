/**
 * Enhanced Core Module - Operator Uplift
 * Integrates all Phase 2 features: AI, Personalization, and Gamification
 * @author Operator Uplift Team
 * @version 2.0.0
 */

import EnhancedAIModule from './ai-enhanced.js';
import EnhancedPersonalizationModule from './personalization-enhanced.js';
import EnhancedGamificationModule from './gamification-enhanced.js';
import AuthModule from './auth.js';
import GoalsModule from './goals.js';
import UIModule from './ui.js';
import ErrorBoundary from '../managers/ErrorBoundary.js';
import MemoryManager from '../managers/MemoryManager.js';
import PerformanceManager from '../managers/PerformanceManager.js';
import ZIndexManager from '../managers/ZIndexManager.js';

class EnhancedCoreModule {
    constructor() {
        this.state = {
            isAuthenticated: false,
            activeView: 'auth',
            user: null,
            isLoading: false,
            error: null,
            theme: 'dark',
            notifications: []
        };
        
        // Enhanced modules
        this.enhancedAI = null;
        this.enhancedPersonalization = null;
        this.enhancedGamification = null;
        
        // Core modules
        this.auth = null;
        this.goals = null;
        this.ui = null;
        
        // Managers
        this.errorBoundary = null;
        this.memoryManager = null;
        this.performanceManager = null;
        this.zIndexManager = null;
        
        // Event listeners
        this.eventListeners = new Map();
        
        // Initialize the enhanced core module
        this.init();
    }

    /**
     * Initialize the enhanced core module
     */
    async init() {
        try {
            console.log('🚀 Initializing Enhanced Core Module...');
            
            // Initialize managers first
            await this.initManagers();
            
            // Initialize enhanced modules
            await this.initEnhancedModules();
            
            // Initialize core modules
            await this.initCoreModules();
            
            // Setup event system
            this.setupEventSystem();
            
            // Setup global error handling
            this.setupGlobalErrorHandling();
            
            // Load user preferences
            await this.loadUserPreferences();
            
            // Check authentication status
            await this.checkAuthenticationStatus();
            
            // Setup UI
            this.setupUI();
            
            console.log('✅ Enhanced Core Module initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Enhanced Core Module:', error);
            this.handleError(error, 'Core Module Initialization');
        }
    }

    /**
     * Initialize managers
     */
    async initManagers() {
        try {
            console.log('🔧 Initializing managers...');
            
            // Error Boundary
            this.errorBoundary = new ErrorBoundary();
            this.errorBoundary.init();
            
            // Memory Manager
            this.memoryManager = new MemoryManager();
            this.memoryManager.init();
            
            // Performance Manager
            this.performanceManager = new PerformanceManager();
            this.performanceManager.init();
            
            // Z-Index Manager
            this.zIndexManager = new ZIndexManager();
            this.zIndexManager.init();
            
            console.log('✅ Managers initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing managers:', error);
            throw error;
        }
    }

    /**
     * Initialize enhanced modules
     */
    async initEnhancedModules() {
        try {
            console.log('🎯 Initializing enhanced modules...');
            
            // Enhanced AI Module
            this.enhancedAI = new EnhancedAIModule();
            await this.enhancedAI.init();
            
            // Enhanced Personalization Module
            this.enhancedPersonalization = new EnhancedPersonalizationModule();
            await this.enhancedPersonalization.init();
            
            // Enhanced Gamification Module
            this.enhancedGamification = new EnhancedGamificationModule();
            await this.enhancedGamification.init();
            
            console.log('✅ Enhanced modules initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing enhanced modules:', error);
            throw error;
        }
    }

    /**
     * Initialize core modules
     */
    async initCoreModules() {
        try {
            console.log('🔧 Initializing core modules...');
            
            // Auth Module
            this.auth = new AuthModule();
            await this.auth.init();
            
            // Goals Module
            this.goals = new GoalsModule();
            await this.goals.init();
            
            // UI Module
            this.ui = new UIModule();
            await this.ui.init();
            
            console.log('✅ Core modules initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing core modules:', error);
            throw error;
        }
    }

    /**
     * Setup event system
     */
    setupEventSystem() {
        // Core events
        this.on('user-login', this.handleUserLogin.bind(this));
        this.on('user-logout', this.handleUserLogout.bind(this));
        this.on('goal-completed', this.handleGoalCompleted.bind(this));
        this.on('goal-created', this.handleGoalCreated.bind(this));
        this.on('achievement-unlocked', this.handleAchievementUnlocked.bind(this));
        this.on('level-up', this.handleLevelUp.bind(this));
        this.on('theme-changed', this.handleThemeChanged.bind(this));
        
        console.log('✅ Event system setup complete');
    }

    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        // Global error handlers
        window.addEventListener('unhandledrejection', (event) => {
            this.errorBoundary.catchError(event.reason, 'Unhandled Promise Rejection');
        });
        
        window.addEventListener('error', (event) => {
            this.errorBoundary.catchError(event.error, 'Global Error');
        });
        
        console.log('✅ Global error handling setup complete');
    }

    /**
     * Load user preferences
     */
    async loadUserPreferences() {
        try {
            const theme = localStorage.getItem('operator_uplift_theme') || 'dark';
            this.state.theme = theme;
            this.applyTheme(theme);
            
            console.log('✅ User preferences loaded');
            
        } catch (error) {
            console.error('❌ Error loading user preferences:', error);
        }
    }

    /**
     * Check authentication status
     */
    async checkAuthenticationStatus() {
        try {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            
            if (isLoggedIn) {
                this.state.isAuthenticated = true;
                this.state.activeView = 'dashboard';
                
                // Load user data
                const userData = localStorage.getItem('userData');
                if (userData) {
                    this.state.user = JSON.parse(userData);
                }
                
                console.log('✅ User authenticated');
            } else {
                this.state.isAuthenticated = false;
                this.state.activeView = 'auth';
                console.log('ℹ️ User not authenticated');
            }
            
        } catch (error) {
            console.error('❌ Error checking authentication status:', error);
            this.state.isAuthenticated = false;
            this.state.activeView = 'auth';
        }
    }

    /**
     * Setup UI
     */
    setupUI() {
        try {
            console.log('🎨 Setting up UI...');
            
            // Hide loading overlay
            this.hideLoadingOverlay();
            
            // Setup responsive design
            this.setupResponsiveDesign();
            
            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Update view based on authentication status
            this.updateView();
            
            console.log('✅ UI setup complete');
            
        } catch (error) {
            console.error('❌ Error setting up UI:', error);
            this.handleError(error, 'UI Setup');
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoadingOverlay() {
        try {
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
                console.log('✅ Loading overlay hidden');
            }
        } catch (error) {
            console.warn('⚠️ Could not hide loading overlay:', error);
        }
    }

    /**
     * Update current view
     */
    updateView() {
        const authView = document.getElementById('auth-view');
        const dashboardView = document.getElementById('dashboard-view');
        
        if (this.state.isAuthenticated) {
            if (authView) authView.style.display = 'none';
            if (dashboardView) dashboardView.style.display = 'block';
        } else {
            if (authView) authView.style.display = 'block';
            if (dashboardView) dashboardView.style.display = 'none';
        }
        
        // Notify modules of state change
        this.notifyModules('state-changed', this.state);
    }

    /**
     * Setup responsive design
     */
    setupResponsiveDesign() {
        const handleResize = this.performanceManager.debounce(() => {
            this.notifyModules('window-resize', {
                width: window.innerWidth,
                height: window.innerHeight
            });
        }, 250);
        
        window.addEventListener('resize', handleResize);
        this.memoryManager.addListener(window, 'resize', handleResize);
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        const handleKeydown = (event) => {
            // Ctrl/Cmd + K: Focus chat input
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                const chatInput = document.getElementById('chat-input');
                if (chatInput) {
                    chatInput.focus();
                }
            }
            
            // Ctrl/Cmd + G: Add new goal
            if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
                event.preventDefault();
                this.notifyModules('add-goal', {});
            }
            
            // Ctrl/Cmd + T: Toggle theme
            if ((event.ctrlKey || event.metaKey) && event.key === 't') {
                event.preventDefault();
                this.toggleTheme();
            }
        };
        
        document.addEventListener('keydown', handleKeydown);
        this.memoryManager.addListener(document, 'keydown', handleKeydown);
    }

    /**
     * Apply theme
     */
    applyTheme(theme) {
        document.body.className = `theme-${theme}`;
        this.state.theme = theme;
        localStorage.setItem('operator_uplift_theme', theme);
        
        // Notify modules of theme change
        this.notifyModules('theme-changed', { theme });
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    /**
     * Event handling methods
     */
    handleUserLogin(userData) {
        this.state.isAuthenticated = true;
        this.state.user = userData;
        this.state.activeView = 'dashboard';
        
        // Update personalization
        if (this.enhancedPersonalization) {
            this.enhancedPersonalization.trackInteraction({
                type: 'user_login',
                data: { userId: userData.id }
            });
        }
        
        // Update gamification
        if (this.enhancedGamification) {
            this.enhancedGamification.updateStreak(1);
        }
        
        this.updateView();
        this.showNotification('Welcome back! 🎉', 'success');
    }

    handleUserLogout() {
        this.state.isAuthenticated = false;
        this.state.user = null;
        this.state.activeView = 'auth';
        
        // Clear sensitive data
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
        
        this.updateView();
        this.showNotification('Logged out successfully', 'info');
    }

    handleGoalCompleted(goalData) {
        // Award experience and essence
        if (this.enhancedGamification) {
            this.enhancedGamification.awardExperience(50, 'goal_completion');
            this.enhancedGamification.awardEssence(25, 'goal_completion');
            this.enhancedGamification.updateQuestProgress('daily_master', 1);
            this.enhancedGamification.updateQuestProgress('weekly_champion', 1);
            this.enhancedGamification.checkAchievements({ goalCompleted: goalData });
        }
        
        // Track interaction
        if (this.enhancedPersonalization) {
            this.enhancedPersonalization.trackInteraction({
                type: 'goal_completed',
                data: goalData
            });
        }
        
        this.showNotification(`Goal completed: ${goalData.title} 🎯`, 'success');
    }

    handleGoalCreated(goalData) {
        // Track interaction
        if (this.enhancedPersonalization) {
            this.enhancedPersonalization.trackInteraction({
                type: 'goal_created',
                data: goalData
            });
        }
        
        this.showNotification(`New goal created: ${goalData.title} ✨`, 'info');
    }

    handleAchievementUnlocked(achievementData) {
        this.showNotification(`Achievement unlocked: ${achievementData.title} 🏆`, 'achievement');
        
        // Track interaction
        if (this.enhancedPersonalization) {
            this.enhancedPersonalization.trackInteraction({
                type: 'achievement_unlocked',
                data: achievementData
            });
        }
    }

    handleLevelUp(levelData) {
        this.showNotification(`Level up! You are now level ${levelData.level} ⭐`, 'levelup');
        
        // Track interaction
        if (this.enhancedPersonalization) {
            this.enhancedPersonalization.trackInteraction({
                type: 'level_up',
                data: levelData
            });
        }
    }

    handleThemeChanged(themeData) {
        this.showNotification(`Theme changed to ${themeData.theme} 🎨`, 'info');
    }

    /**
     * Event system methods
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    this.errorBoundary.catchError(error, `Event Handler: ${event}`);
                }
            });
        }
    }

    /**
     * Notify all modules of an event
     */
    notifyModules(event, data) {
        const modules = [
            this.enhancedAI,
            this.enhancedPersonalization,
            this.enhancedGamification,
            this.auth,
            this.goals,
            this.ui
        ];
        
        modules.forEach(module => {
            if (module && typeof module.onEvent === 'function') {
                try {
                    module.onEvent(event, data);
                } catch (error) {
                    this.errorBoundary.catchError(error, `Module Event: ${event}`);
                }
            }
        });
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString()
        };
        
        this.state.notifications.push(notification);
        
        // Create notification element
        this.createNotificationElement(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, 5000);
    }

    /**
     * Create notification element
     */
    createNotificationElement(notification) {
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification notification-${notification.type}`;
        notificationEl.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${notification.message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add to notification container
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notificationEl);
        
        // Animate in
        setTimeout(() => {
            notificationEl.classList.add('show');
        }, 100);
    }

    /**
     * Remove notification
     */
    removeNotification(id) {
        this.state.notifications = this.state.notifications.filter(n => n.id !== id);
    }

    /**
     * Get module by name
     */
    getModule(name) {
        const modules = {
            ai: this.enhancedAI,
            personalization: this.enhancedPersonalization,
            gamification: this.enhancedGamification,
            auth: this.auth,
            goals: this.goals,
            ui: this.ui
        };
        
        return modules[name] || null;
    }

    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Update state
     */
    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyModules('state-updated', this.state);
    }

    /**
     * Handle errors gracefully
     */
    handleError(error, context) {
        console.error(`❌ Enhanced Core Module Error (${context}):`, error);
        
        if (this.errorBoundary) {
            this.errorBoundary.catchError(error, `Enhanced Core Module - ${context}`);
        }
        
        // Show user-friendly error message
        this.showNotification('An error occurred. Please try again.', 'error');
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        try {
            console.log('🧹 Cleaning up Enhanced Core Module...');
            
            // Cleanup modules
            if (this.enhancedAI) this.enhancedAI.cleanup();
            if (this.enhancedPersonalization) this.enhancedPersonalization.cleanup();
            if (this.enhancedGamification) this.enhancedGamification.cleanup();
            if (this.auth) this.auth.cleanup();
            if (this.goals) this.goals.cleanup();
            if (this.ui) this.ui.cleanup();
            
            // Cleanup managers
            if (this.memoryManager) this.memoryManager.cleanup();
            if (this.performanceManager) this.performanceManager.cleanup();
            if (this.zIndexManager) this.zIndexManager.cleanup();
            
            // Clear event listeners
            this.eventListeners.clear();
            
            console.log('✅ Enhanced Core Module cleanup complete');
            
        } catch (error) {
            console.error('❌ Error during cleanup:', error);
        }
    }
}

export default EnhancedCoreModule; 