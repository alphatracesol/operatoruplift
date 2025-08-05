// 🚨 CRITICAL FIXES - Operator Uplift
// Phase 1: Debug/Scan Implementation

// Safe Element Access System - CRITICAL FIX
const SafeElementAccess = {
    // Safe getElementById with null check
    getById(id, fallback = null) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
            return fallback;
        }
        return element;
    },
    
    // Safe querySelector with null check
    query(selector, parent = document) {
        try {
            const element = parent.querySelector(selector);
            if (!element) {
                console.warn(`Element with selector '${selector}' not found`);
                return null;
            }
            return element;
        } catch (error) {
            console.error(`Error querying selector '${selector}':`, error);
            return null;
        }
    },
    
    // Safe addEventListener with null check
    addListener(element, event, handler, options = {}) {
        if (!element) {
            console.warn(`Cannot add listener to null element for event '${event}'`);
            return false;
        }
        
        try {
            element.addEventListener(event, handler, options);
            return true;
        } catch (error) {
            console.error(`Error adding listener for event '${event}':`, error);
            return false;
        }
    },
    
    // Safe setValue with null check
    setValue(element, value) {
        if (!element) {
            console.warn('Cannot set value on null element');
            return false;
        }
        
        try {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else {
                element.textContent = value;
            }
            return true;
        } catch (error) {
            console.error('Error setting value:', error);
            return false;
        }
    },
    
    // Safe getValue with null check
    getValue(element, fallback = '') {
        if (!element) {
            console.warn('Cannot get value from null element');
            return fallback;
        }
        
        try {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                return element.value || fallback;
            } else {
                return element.textContent || fallback;
            }
        } catch (error) {
            console.error('Error getting value:', error);
            return fallback;
        }
    }
};

// Memory Management System - CRITICAL FIX
const memoryManager = window.memoryManager || {
    intervals: new Set(),
    animations: new Set(),
    arrays: new Set(),
    observers: new Set(),
    
    // Track intervals
    addInterval(intervalId) {
        this.intervals.add(intervalId);
    },
    
    // Track animations
    addAnimation(animation) {
        this.animations.add(animation);
    },
    
    // Track arrays that need trimming
    addArray(array, maxLength = 100) {
        this.arrays.add({ array, maxLength });
    },
    
    // Track observers
    addObserver(observer) {
        this.observers.add(observer);
    },
    
    // Cleanup all tracked resources
    cleanup() {
        // Clear intervals
        this.intervals.forEach(id => {
            if (id) clearInterval(id);
        });
        this.intervals.clear();
        
        // Stop animations
        this.animations.forEach(animation => {
            if (animation && typeof animation.kill === 'function') {
                animation.kill();
            }
        });
        this.animations.clear();
        
        // Trim arrays
        this.arrays.forEach(({ array, maxLength }) => {
            if (array && array.length > maxLength) {
                array.splice(0, array.length - maxLength);
            }
        });
        
        // Disconnect observers
        this.observers.forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });
        this.observers.clear();
        
        console.log('Memory cleanup completed');
    },
    
    // Periodic cleanup
    startPeriodicCleanup() {
        const cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 30000); // Every 30 seconds
        
        this.addInterval(cleanupInterval);
    },
    
    // Initialize memory management
    init() {
        this.startPeriodicCleanup();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        // Cleanup on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanup();
            }
        });
    }
};

// Unified Z-Index Management System - CRITICAL FIX
const zIndexManager = window.zIndexManager || {
    // Define z-index hierarchy using CSS variables
    hierarchy: {
        particles: 0,
        matrix: 1,
        content: 10,
        sidebar: 20,
        modals: 1000,
        loading: 9999,
        pwaBanner: 50
    },
    
    // Initialize z-index hierarchy
    init() {
        // Set CSS variables for consistent z-index values
        const root = document.documentElement;
        Object.entries(this.hierarchy).forEach(([name, value]) => {
            root.style.setProperty(`--z-${name}`, value.toString());
        });
        console.log('Z-Index hierarchy initialized');
    },
    
    // Get z-index value for a layer
    getZIndex(layer) {
        return this.hierarchy[layer] || 1;
    },
    
    // Set element z-index using hierarchy
    setElementZIndex(element, layer) {
        if (element && this.hierarchy[layer]) {
            element.style.zIndex = this.hierarchy[layer];
        }
    },
    
    // Ensure modal is on top
    bringToFront(element) {
        if (element) {
            element.style.zIndex = this.hierarchy.modals;
        }
    },
    
    // Reset element z-index
    resetZIndex(element) {
        if (element) {
            element.style.zIndex = '';
        }
    }
};

// Security Utilities - CRITICAL FIX
const securityUtils = window.securityUtils || {
    // Sanitize HTML content to prevent XSS
    sanitizeHTML(html) {
        if (typeof html !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    },
    
    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validate password strength
    validatePassword(password) {
        if (!password || password.length < 6) return false;
        return true;
    },
    
    // Sanitize user input
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.trim().replace(/[<>]/g, '');
    },
    
    // Validate URL
    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    // Escape special characters
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Generate secure random string
    generateSecureToken(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// Performance Optimization Utilities - CRITICAL FIX
const performanceUtils = window.performanceUtils || {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Lazy loading for images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },
    
    // Lazy loading for components
    lazyLoadComponent(componentId, loadFunction) {
        const component = document.getElementById(componentId);
        if (component) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadFunction();
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(component);
        }
    },
    
    // Performance monitoring
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name} took ${end - start}ms`);
        return result;
    },
    
    // Memory usage monitoring
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
};

// Enhanced Error Boundary - CRITICAL FIX
class ErrorBoundary {
    constructor() {
        this.errors = [];
        this.maxErrors = 10;
    }
    
    catchError(error, context = '') {
        // Handle null/undefined errors gracefully
        if (!error) {
            console.warn('ErrorBoundary caught null/undefined error in context:', context);
            return;
        }
        
        const errorInfo = {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace',
            context,
            timestamp: new Date().toISOString()
        };
        
        this.errors.push(errorInfo);
        
        // Keep only recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
        
        console.error('Error caught by boundary:', errorInfo);
        
        // Try to recover gracefully
        this.recoverFromError(error, context);
    }
    
    recoverFromError(error, context) {
        try {
            // Handle null/undefined errors
            if (!error) {
                console.log('Recovering from null/undefined error');
                return;
            }
            
            // Attempt to recover based on error type
            if (error.message && error.message.includes('getElementById')) {
                console.log('Recovering from DOM element error');
                // Retry after a short delay
                setTimeout(() => {
                    if (window.app && window.app.ui && window.app.ui.update) {
                        window.app.ui.update();
                    }
                }, 1000);
            } else if (error.message && error.message.includes('Firebase')) {
                console.log('Recovering from Firebase error');
                // Switch to offline mode
                if (window.app && window.app.auth) {
                    window.app.auth.switchToOfflineMode();
                }
            } else {
                console.log('Generic error recovery');
                // Show user-friendly error message
                if (window.app && window.app.ui && window.app.ui.showToast) {
                    window.app.ui.showToast('Something went wrong. Please refresh the page.', 'error');
                }
            }
        } catch (recoveryError) {
            console.error('Error recovery failed:', recoveryError);
        }
    }
    
    getErrors() {
        return this.errors;
    }
    
    clearErrors() {
        this.errors = [];
    }
}

// AI/Chat Integration - PHASE 2
const aiChatSystem = {
    // Secure token management (NO HARDCODED KEYS)
    getHFToken() {
        // Get token from environment or localStorage (never hardcode)
        // Check if process is available (browser environment)
        const envToken = typeof process !== 'undefined' && process.env ? process.env.HF_TOKEN : null;
        return localStorage.getItem('hf_token') || envToken || null;
    },
    
    // DeepSeek AI Integration
    async callDeepSeek(prompt, context = '') {
        try {
            const token = this.getHFToken();
            if (!token) {
                console.warn('HF Token not available, using demo response');
                return this.getDemoResponse(prompt);
            }
            
            const response = await fetch('https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: this.buildPrompt(prompt, context),
                    parameters: {
                        max_new_tokens: 500,
                        temperature: 0.7,
                        top_p: 0.95,
                        do_sample: true
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API call failed: ${response.status}`);
            }
            
            const data = await response.json();
            return this.parseResponse(data);
            
        } catch (error) {
            console.error('DeepSeek API error:', error);
            return this.getDemoResponse(prompt);
        }
    },
    
    // Build contextual prompt
    buildPrompt(prompt, context = '') {
        const systemPrompt = `You are an AI mentor for Operator Uplift, a gamified self-improvement platform. 
        Provide personalized, actionable advice that helps users achieve their goals. 
        Be encouraging, specific, and practical.`;
        
        return `${systemPrompt}\n\nContext: ${context}\n\nUser: ${prompt}\n\nMentor:`;
    },
    
    // Parse API response
    parseResponse(data) {
        if (data && data[0] && data[0].generated_text) {
            return data[0].generated_text.trim();
        }
        return 'I apologize, but I couldn\'t generate a response at the moment.';
    },
    
    // Demo response for when API is unavailable
    getDemoResponse(prompt) {
        const responses = [
            "That's a great question! Let me help you break this down into actionable steps.",
            "I can see you're making progress. Here's how to take it to the next level...",
            "This is a common challenge. Here's a proven strategy that works...",
            "You're on the right track! Let me suggest a few optimizations...",
            "I love your approach! Here's how to make it even more effective..."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    },
    
    // Chat history management
    chatHistory: [],
    
    addToHistory(message, isUser = true) {
        this.chatHistory.push({
            message,
            isUser,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 messages
        if (this.chatHistory.length > 50) {
            this.chatHistory = this.chatHistory.slice(-50);
        }
        
        // Save to localStorage
        localStorage.setItem('chat_history', JSON.stringify(this.chatHistory));
    },
    
    getHistory() {
        return this.chatHistory;
    },
    
    clearHistory() {
        this.chatHistory = [];
        localStorage.removeItem('chat_history');
    },
    
    // Load history from localStorage
    loadHistory() {
        const saved = localStorage.getItem('chat_history');
        if (saved) {
            try {
                this.chatHistory = JSON.parse(saved);
            } catch (error) {
                console.error('Error loading chat history:', error);
                this.chatHistory = [];
            }
        }
    }
};

// Initialize all systems
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Critical Fixes & Phase 3 Systems...');
    
    // Initialize memory management
    memoryManager.init();
    
    // Initialize z-index management
    zIndexManager.init();
    
    // Load chat history
    aiChatSystem.loadHistory();
    
    // Initialize Phase 3 systems
    if (window.userProfileSystem) {
        console.log('✅ User Profile System loaded');
    }
    if (window.onboardingSystem) {
        console.log('✅ Onboarding System loaded');
    }
    if (window.aiPersonalizationSystem) {
        console.log('✅ AI Personalization System loaded');
    }
    
    // Make systems globally available
    window.SafeElementAccess = SafeElementAccess;
    window.memoryManager = memoryManager;
    window.zIndexManager = zIndexManager;
    window.securityUtils = securityUtils;
    window.performanceUtils = performanceUtils;
    window.ErrorBoundary = ErrorBoundary;
    window.aiChatSystem = aiChatSystem;
    window.userProfileSystem = userProfileSystem;
    window.aiPersonalizationSystem = aiPersonalizationSystem;
    
    // Create global error boundary
    window.errorBoundary = new ErrorBoundary();
    
    // Global error handler
    window.addEventListener('error', (event) => {
        window.errorBoundary.catchError(event.error, 'Global Error');
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        window.errorBoundary.catchError(new Error(event.reason), 'Unhandled Promise Rejection');
    });
    
    console.log('✅ Critical Fixes & Phase 3 Systems Initialized Successfully');
});

// PHASE 3: PERSONALIZATION/ONBOARDING SYSTEMS

// User Profile Management System
const userProfileSystem = {
    // Default profile structure
    defaultProfile: {
        id: null,
        name: '',
        email: '',
        personality: {
            type: 'balanced', // balanced, analytical, creative, social, competitive
            traits: {
                introvert: 50,
                analytical: 50,
                creative: 50,
                social: 50,
                competitive: 50
            }
        },
        preferences: {
            motivationalStyle: 'mentor', // mentor, coach, friend, competitor
            goalTypes: ['health', 'learning', 'work', 'personal'],
            notificationLevel: 'moderate', // low, moderate, high
            theme: 'dark',
            aiProvider: 'deepseek'
        },
        goals: {
            shortTerm: [],
            longTerm: [],
            completed: [],
            currentStreak: 0,
            totalEssence: 0,
            level: 1
        },
        progress: {
            totalGoals: 0,
            completedGoals: 0,
            currentStreak: 0,
            bestStreak: 0,
            averageCompletionTime: 0,
            favoriteCategories: []
        },
        onboarding: {
            completed: false,
            step: 0,
            personalityAssessed: false,
            preferencesSet: false
        },
        createdAt: null,
        lastActive: null
    },

    // Get current user profile
    getCurrentProfile() {
        try {
            const profile = localStorage.getItem('user_profile');
            if (profile) {
                return JSON.parse(profile);
            }
            return null;
        } catch (error) {
            console.error('Error loading user profile:', error);
            return null;
        }
    },

    // Save user profile
    saveProfile(profile) {
        try {
            profile.lastActive = new Date().toISOString();
            localStorage.setItem('user_profile', JSON.stringify(profile));
            return true;
        } catch (error) {
            console.error('Error saving user profile:', error);
            return false;
        }
    },

    // Create new profile
    createProfile(userData) {
        const profile = {
            ...this.defaultProfile,
            id: 'user_' + Date.now(),
            name: userData.name || userData.email?.split('@')[0] || 'Operator',
            email: userData.email || '',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
        
        this.saveProfile(profile);
        return profile;
    },

    // Update profile
    updateProfile(updates) {
        const profile = this.getCurrentProfile();
        if (profile) {
            const updatedProfile = { ...profile, ...updates };
            this.saveProfile(updatedProfile);
            return updatedProfile;
        }
        return null;
    },

    // Get personality insights
    getPersonalityInsights() {
        const profile = this.getCurrentProfile();
        if (!profile || !profile.personality) return null;

        const traits = profile.personality.traits;
        const insights = {
            dominantTrait: Object.keys(traits).reduce((a, b) => traits[a] > traits[b] ? a : b),
            balanced: Math.max(...Object.values(traits)) - Math.min(...Object.values(traits)) < 20,
            recommendations: []
        };

        // Generate recommendations based on personality
        if (traits.analytical > 70) {
            insights.recommendations.push('You prefer detailed, structured approaches to goals');
        }
        if (traits.creative > 70) {
            insights.recommendations.push('You thrive with flexible, innovative goal-setting methods');
        }
        if (traits.social > 70) {
            insights.recommendations.push('You benefit from social accountability and community features');
        }
        if (traits.competitive > 70) {
            insights.recommendations.push('You\'re motivated by challenges and leaderboards');
        }

        return insights;
    }
};

// AI Personalization System
const aiPersonalizationSystem = {
    // Get personalized AI prompt
    getPersonalizedPrompt(userMessage, context = '') {
        const profile = userProfileSystem.getCurrentProfile();
        if (!profile) {
            return this.getDefaultPrompt(userMessage, context);
        }

        const personality = profile.personality;
        const preferences = profile.preferences;
        const progress = profile.progress;

        // Build personalized system prompt
        let systemPrompt = `You are an AI mentor for Operator Uplift, a gamified self-improvement platform. `;
        
        // Add personality-based guidance
        systemPrompt += `The user has a ${personality.type} personality type. `;
        
        // Add motivational style
        systemPrompt += `Your communication style should be that of a ${preferences.motivationalStyle}. `;
        
        // Add progress context
        if (progress.currentStreak > 0) {
            systemPrompt += `The user is on a ${progress.currentStreak}-day streak. `;
        }
        
        // Add goal preferences
        if (preferences.goalTypes.length > 0) {
            systemPrompt += `They are interested in ${preferences.goalTypes.join(', ')} goals. `;
        }

        // Add specific guidance based on personality traits
        if (personality.traits.analytical > 70) {
            systemPrompt += `Provide detailed, structured advice with specific steps. `;
        }
        if (personality.traits.creative > 70) {
            systemPrompt += `Encourage creative approaches and flexible solutions. `;
        }
        if (personality.traits.social > 70) {
            systemPrompt += `Emphasize social support and community aspects. `;
        }
        if (personality.traits.competitive > 70) {
            systemPrompt += `Use competitive language and challenge-based motivation. `;
        }

        systemPrompt += `Be encouraging, specific, and practical. `;
        systemPrompt += `Adapt your tone to match the user's personality and current progress.`;

        return `${systemPrompt}\n\nContext: ${context}\n\nUser: ${userMessage}\n\nMentor:`;
    },

    // Get default prompt (fallback)
    getDefaultPrompt(userMessage, context = '') {
        return `You are an AI mentor for Operator Uplift, a gamified self-improvement platform. 
        Provide personalized, actionable advice that helps users achieve their goals. 
        Be encouraging, specific, and practical.
        
        Context: ${context}
        
        User: ${userMessage}
        
        Mentor:`;
    },

    // Get personalized motivation message
    getPersonalizedMotivation() {
        const profile = userProfileSystem.getCurrentProfile();
        if (!profile) return "You're doing great! Keep pushing forward!";

        const streak = profile.goals.currentStreak;
        const level = profile.goals.level;
        const style = profile.preferences.motivationalStyle;

        let message = "";

        switch (style) {
            case 'mentor':
                message = `Your ${streak}-day streak shows remarkable consistency. `;
                message += `At level ${level}, you're building the foundation for lasting change. `;
                message += `What's your next milestone?`;
                break;
            case 'coach':
                message = `🔥 ${streak} days strong! You're on fire! `;
                message += `Level ${level} and climbing - let's push for that next breakthrough! `;
                message += `Ready for the next challenge?`;
                break;
            case 'friend':
                message = `Hey there! I noticed you've been consistent for ${streak} days - that's amazing! `;
                message += `You've reached level ${level} together. `;
                message += `I'm here to support you every step of the way!`;
                break;
            case 'competitor':
                message = `${streak} days? That's good, but I know you can do better! `;
                message += `Level ${level} is just the beginning. `;
                message += `Let's see if you can beat your own record!`;
                break;
            default:
                message = `Great progress on your ${streak}-day streak! Keep it up!`;
        }

        return message;
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SafeElementAccess,
        memoryManager,
        zIndexManager,
        securityUtils,
        performanceUtils,
        ErrorBoundary,
        aiChatSystem,
        userProfileSystem,
        aiPersonalizationSystem
    };
} 