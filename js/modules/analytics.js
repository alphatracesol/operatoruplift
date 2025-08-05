// Analytics Module
// Handles user analytics, tracking, and insights

class AnalyticsModule {
    constructor(core) {
        this.core = core;
        this.isInitialized = false;
        this.events = [];
        this.metrics = {};
        this.sessionStart = null;
        this.maxEvents = 1000;
    }

    async init() {
        if (this.isInitialized) return;
        
        console.log('📊 Analytics Module initialized');
        this.isInitialized = true;
        
        // Load analytics data
        this.loadAnalyticsData();
        
        // Start session tracking
        this.startSession();
        
        // Setup event tracking
        this.setupEventTracking();
        
        // Setup performance tracking
        this.setupPerformanceTracking();
    }

    // Load analytics data from localStorage
    loadAnalyticsData() {
        try {
            const savedEvents = localStorage.getItem('analytics-events');
            if (savedEvents) {
                this.events = JSON.parse(savedEvents);
            }
            
            const savedMetrics = localStorage.getItem('analytics-metrics');
            if (savedMetrics) {
                this.metrics = JSON.parse(savedMetrics);
            }
        } catch (error) {
            console.warn('Failed to load analytics data:', error);
        }
    }

    // Save analytics data to localStorage
    saveAnalyticsData() {
        try {
            localStorage.setItem('analytics-events', JSON.stringify(this.events));
            localStorage.setItem('analytics-metrics', JSON.stringify(this.metrics));
        } catch (error) {
            console.warn('Failed to save analytics data:', error);
        }
    }

    // Start session tracking
    startSession() {
        this.sessionStart = Date.now();
        this.trackEvent('session_start', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenSize: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        });
    }

    // Setup event tracking
    setupEventTracking() {
        // Track page views
        this.trackPageView();
        
        // Track user interactions
        this.trackUserInteractions();
        
        // Track goal-related events
        this.trackGoalEvents();
        
        // Track AI interactions
        this.trackAIEvents();
    }

    // Track page view
    trackPageView() {
        this.trackEvent('page_view', {
            path: window.location.pathname,
            title: document.title,
            referrer: document.referrer
        });
    }

    // Track user interactions
    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
                this.trackEvent('button_click', {
                    buttonText: button.textContent?.trim(),
                    buttonId: button.id,
                    buttonClass: button.className
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submit', {
                formId: e.target.id,
                formAction: e.target.action
            });
        });

        // Track navigation
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
                this.trackEvent('link_click', {
                    href: link.href,
                    linkText: link.textContent?.trim()
                });
            }
        });
    }

    // Track goal-related events
    trackGoalEvents() {
        // This will be called by the goals module
        window.trackGoalEvent = (eventType, goalData) => {
            this.trackEvent(`goal_${eventType}`, goalData);
        };
    }

    // Track AI events
    trackAIEvents() {
        // This will be called by the AI module
        window.trackAIEvent = (eventType, aiData) => {
            this.trackEvent(`ai_${eventType}`, aiData);
        };
    }

    // Setup performance tracking
    setupPerformanceTracking() {
        if ('PerformanceObserver' in window) {
            // Track navigation timing
            const navigationObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        this.trackPerformance('navigation', {
                            loadTime: entry.loadEventEnd - entry.loadEventStart,
                            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                            firstPaint: entry.firstPaint,
                            firstContentfulPaint: entry.firstContentfulPaint
                        });
                    }
                }
            });
            navigationObserver.observe({ entryTypes: ['navigation'] });

            // Track resource loading
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'resource') {
                        this.trackPerformance('resource', {
                            name: entry.name,
                            duration: entry.duration,
                            size: entry.transferSize,
                            type: entry.initiatorType
                        });
                    }
                }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    // Track custom event
    trackEvent(eventName, eventData = {}) {
        const event = {
            id: Date.now() + Math.random(),
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionStart,
            userId: this.core.state.currentUser?.uid || 'anonymous'
        };

        this.events.push(event);
        
        // Trim events if too many
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }
        
        this.saveAnalyticsData();
        
        console.log(`📊 Event tracked: ${eventName}`, eventData);
    }

    // Track performance metric
    trackPerformance(metricName, metricData) {
        if (!this.metrics[metricName]) {
            this.metrics[metricName] = [];
        }
        
        this.metrics[metricName].push({
            ...metricData,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 metrics per type
        if (this.metrics[metricName].length > 100) {
            this.metrics[metricName] = this.metrics[metricName].slice(-100);
        }
        
        this.saveAnalyticsData();
    }

    // Get analytics report
    getAnalyticsReport() {
        const now = Date.now();
        const sessionDuration = this.sessionStart ? now - this.sessionStart : 0;
        
        // Calculate event counts
        const eventCounts = this.events.reduce((acc, event) => {
            acc[event.name] = (acc[event.name] || 0) + 1;
            return acc;
        }, {});
        
        // Calculate user engagement
        const engagement = this.calculateEngagement();
        
        // Calculate performance metrics
        const performance = this.calculatePerformanceMetrics();
        
        return {
            session: {
                start: this.sessionStart,
                duration: sessionDuration,
                events: this.events.length
            },
            events: eventCounts,
            engagement,
            performance,
            user: {
                id: this.core.state.currentUser?.uid || 'anonymous',
                goals: this.core.state.userData?.totalGoals || 0,
                completedGoals: this.core.state.userData?.completedGoals || 0,
                level: this.core.state.userData?.level || 1
            }
        };
    }

    // Calculate user engagement
    calculateEngagement() {
        const goalEvents = this.events.filter(e => e.name.startsWith('goal_'));
        const aiEvents = this.events.filter(e => e.name.startsWith('ai_'));
        const buttonClicks = this.events.filter(e => e.name === 'button_click');
        
        return {
            goalInteractions: goalEvents.length,
            aiInteractions: aiEvents.length,
            buttonClicks: buttonClicks.length,
            totalInteractions: this.events.length,
            sessionDuration: this.sessionStart ? Date.now() - this.sessionStart : 0
        };
    }

    // Calculate performance metrics
    calculatePerformanceMetrics() {
        const navigationMetrics = this.metrics.navigation || [];
        const resourceMetrics = this.metrics.resource || [];
        
        if (navigationMetrics.length === 0) {
            return {
                averageLoadTime: 0,
                averageResourceLoadTime: 0,
                totalResources: 0
            };
        }
        
        const avgLoadTime = navigationMetrics.reduce((sum, metric) => 
            sum + (metric.loadTime || 0), 0) / navigationMetrics.length;
        
        const avgResourceTime = resourceMetrics.reduce((sum, metric) => 
            sum + (metric.duration || 0), 0) / resourceMetrics.length;
        
        return {
            averageLoadTime: avgLoadTime,
            averageResourceLoadTime: avgResourceTime,
            totalResources: resourceMetrics.length
        };
    }

    // Get user insights
    getUserInsights() {
        const userData = this.core.state.userData;
        const events = this.events;
        
        const insights = {
            mostActiveTime: this.getMostActiveTime(),
            favoriteFeatures: this.getFavoriteFeatures(),
            goalCompletionRate: this.calculateGoalCompletionRate(),
            aiUsagePattern: this.getAIUsagePattern(),
            improvementSuggestions: this.getImprovementSuggestions()
        };
        
        return insights;
    }

    // Get most active time
    getMostActiveTime() {
        const hourCounts = new Array(24).fill(0);
        
        this.events.forEach(event => {
            const hour = new Date(event.timestamp).getHours();
            hourCounts[hour]++;
        });
        
        const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
        return `${maxHour}:00 - ${maxHour + 1}:00`;
    }

    // Get favorite features
    getFavoriteFeatures() {
        const featureCounts = {};
        
        this.events.forEach(event => {
            if (event.name.startsWith('goal_')) {
                featureCounts.goals = (featureCounts.goals || 0) + 1;
            } else if (event.name.startsWith('ai_')) {
                featureCounts.ai = (featureCounts.ai || 0) + 1;
            } else if (event.name === 'button_click') {
                featureCounts.buttons = (featureCounts.buttons || 0) + 1;
            }
        });
        
        return Object.entries(featureCounts)
            .sort(([,a], [,b]) => b - a)
            .map(([feature, count]) => ({ feature, count }));
    }

    // Calculate goal completion rate
    calculateGoalCompletionRate() {
        const goalEvents = this.events.filter(e => e.name.startsWith('goal_'));
        const completions = goalEvents.filter(e => e.name === 'goal_complete').length;
        const total = goalEvents.length;
        
        return total > 0 ? (completions / total) * 100 : 0;
    }

    // Get AI usage pattern
    getAIUsagePattern() {
        const aiEvents = this.events.filter(e => e.name.startsWith('ai_'));
        const messages = aiEvents.filter(e => e.name === 'ai_message_sent').length;
        const responses = aiEvents.filter(e => e.name === 'ai_response_received').length;
        
        return {
            messagesSent: messages,
            responsesReceived: responses,
            averageResponseTime: this.calculateAverageResponseTime()
        };
    }

    // Calculate average response time
    calculateAverageResponseTime() {
        const aiEvents = this.events.filter(e => e.name.startsWith('ai_'));
        const responseTimes = [];
        
        for (let i = 0; i < aiEvents.length - 1; i++) {
            if (aiEvents[i].name === 'ai_message_sent' && aiEvents[i + 1].name === 'ai_response_received') {
                const sentTime = new Date(aiEvents[i].timestamp).getTime();
                const receivedTime = new Date(aiEvents[i + 1].timestamp).getTime();
                responseTimes.push(receivedTime - sentTime);
            }
        }
        
        return responseTimes.length > 0 ? 
            responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;
    }

    // Get improvement suggestions
    getImprovementSuggestions() {
        const suggestions = [];
        const userData = this.core.state.userData;
        
        // Check goal completion rate
        const completionRate = this.calculateGoalCompletionRate();
        if (completionRate < 50) {
            suggestions.push('Consider breaking down larger goals into smaller, more manageable tasks');
        }
        
        // Check AI usage
        const aiEvents = this.events.filter(e => e.name.startsWith('ai_'));
        if (aiEvents.length === 0) {
            suggestions.push('Try using the AI assistant to get personalized guidance on your goals');
        }
        
        // Check session duration
        const sessionDuration = this.sessionStart ? Date.now() - this.sessionStart : 0;
        if (sessionDuration < 60000) { // Less than 1 minute
            suggestions.push('Take some time to explore the app features and set up your first goal');
        }
        
        return suggestions;
    }

    // Export analytics data
    exportAnalyticsData() {
        return {
            events: this.events,
            metrics: this.metrics,
            report: this.getAnalyticsReport(),
            insights: this.getUserInsights(),
            exportDate: new Date().toISOString()
        };
    }

    // Clear analytics data
    clearAnalyticsData() {
        this.events = [];
        this.metrics = {};
        this.saveAnalyticsData();
        console.log('🗑️ Analytics data cleared');
    }

    // Cleanup
    cleanup() {
        this.isInitialized = false;
        this.events = [];
        this.metrics = {};
        console.log('📊 Analytics Module cleanup completed');
    }
}

export default AnalyticsModule; 