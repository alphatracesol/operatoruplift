/**
 * Error Tracking Module
 * Implements Sentry error tracking and monitoring
 */

// ============================================
// 1. SENTRY INITIALIZATION
// ============================================

class ErrorTracker {
    constructor() {
        this.initialized = false;
        this.queue = [];
        this.userContext = null;
        this.init();
    }

    async init() {
        try {
            await this.loadSentry();
            this.configureSentry();
            this.setupErrorHandlers();
            this.setupPerformanceMonitoring();
            this.initialized = true;
            this.processQueue();
            console.log('✅ Sentry error tracking initialized');
        } catch (error) {
            console.error('Failed to initialize Sentry:', error);
            // Fall back to local error logging
            this.setupFallbackErrorHandling();
        }
    }

    async loadSentry() {
        if (window.Sentry) return;

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://browser.sentry-cdn.com/7.77.0/bundle.min.js';
            script.crossOrigin = 'anonymous';
            
            script.onload = resolve;
            script.onerror = reject;
            
            document.head.appendChild(script);
        });
    }

    configureSentry() {
        if (!window.Sentry) return;

        const dsn = process.env.SENTRY_DSN || localStorage.getItem('sentry_dsn');
        
        if (!dsn) {
            console.warn('Sentry DSN not configured. Using local error tracking only.');
            return;
        }

        Sentry.init({
            dsn: dsn,
            integrations: [
                new Sentry.BrowserTracing(),
                new Sentry.Replay({
                    maskAllText: false,
                    blockAllMedia: false,
                }),
            ],
            
            // Performance Monitoring
            tracesSampleRate: this.getEnvironment() === 'production' ? 0.1 : 1.0,
            
            // Session Replay
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            
            // Release tracking
            release: this.getAppVersion(),
            environment: this.getEnvironment(),
            
            // Error filtering
            beforeSend: (event, hint) => {
                return this.filterError(event, hint);
            },
            
            // Breadcrumb filtering
            beforeBreadcrumb: (breadcrumb) => {
                return this.filterBreadcrumb(breadcrumb);
            },
            
            // User feedback
            beforeSendFeedback: (feedback) => {
                return this.enhanceFeedback(feedback);
            }
        });

        // Set initial user context
        this.setUserContext();
    }

    getEnvironment() {
        if (window.location.hostname === 'localhost') return 'development';
        if (window.location.hostname.includes('staging')) return 'staging';
        return 'production';
    }

    getAppVersion() {
        return document.querySelector('meta[name="app-version"]')?.content || '1.0.0';
    }

    filterError(event, hint) {
        // Filter out known non-critical errors
        const ignoredErrors = [
            'ResizeObserver loop limit exceeded',
            'Non-Error promise rejection captured',
            'Network request failed',
            'Failed to fetch',
            'Load failed'
        ];

        const error = hint.originalException;
        const errorMessage = error?.message || event.exception?.values?.[0]?.value || '';

        if (ignoredErrors.some(ignored => errorMessage.includes(ignored))) {
            return null; // Don't send to Sentry
        }

        // Add custom context
        event.contexts = {
            ...event.contexts,
            app: {
                memory_usage: this.getMemoryUsage(),
                connection_type: navigator.connection?.effectiveType,
                online: navigator.onLine,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            }
        };

        // Add custom tags
        event.tags = {
            ...event.tags,
            feature: this.getCurrentFeature(),
            user_tier: this.getUserTier()
        };

        return event;
    }

    filterBreadcrumb(breadcrumb) {
        // Filter out sensitive data from breadcrumbs
        if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
            return null; // Don't include debug logs
        }

        if (breadcrumb.category === 'xhr' || breadcrumb.category === 'fetch') {
            // Remove sensitive headers
            if (breadcrumb.data?.request_headers) {
                delete breadcrumb.data.request_headers.authorization;
                delete breadcrumb.data.request_headers.cookie;
            }
        }

        return breadcrumb;
    }

    enhanceFeedback(feedback) {
        // Add additional context to user feedback
        feedback.tags = {
            ...feedback.tags,
            feature: this.getCurrentFeature(),
            user_tier: this.getUserTier()
        };

        return feedback;
    }

    setUserContext(user = null) {
        if (!window.Sentry) return;

        const userData = user || this.getCurrentUser();
        
        if (userData) {
            Sentry.setUser({
                id: userData.id,
                username: userData.username,
                email: userData.email,
                ip_address: '{{auto}}' // Let Sentry determine IP
            });

            this.userContext = userData;
        }
    }

    getCurrentUser() {
        // Get user from Firebase or localStorage
        if (window.firebase?.auth?.currentUser) {
            return {
                id: window.firebase.auth.currentUser.uid,
                email: window.firebase.auth.currentUser.email,
                username: window.firebase.auth.currentUser.displayName
            };
        }

        const savedProfile = localStorage.getItem('user_profile');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            return {
                id: profile.id,
                username: profile.username,
                email: profile.email
            };
        }

        return null;
    }

    getCurrentFeature() {
        // Determine which feature/page is currently active
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        if (hash.includes('focus')) return 'focus';
        if (hash.includes('goals')) return 'goals';
        if (hash.includes('social')) return 'social';
        if (hash.includes('profile')) return 'profile';
        
        return 'dashboard';
    }

    getUserTier() {
        // Determine user tier (free, pro, enterprise)
        const subscription = localStorage.getItem('user_subscription');
        return subscription ? JSON.parse(subscription).tier : 'free';
    }

    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
            };
        }
        return null;
    }

    setupErrorHandlers() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.captureError(event.error || new Error(event.message), {
                level: 'error',
                context: {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                }
            });
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.captureError(new Error(event.reason), {
                level: 'error',
                context: {
                    promise: true,
                    reason: event.reason
                }
            });
        });

        // Console error interceptor
        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.captureMessage(args.join(' '), 'error');
            originalConsoleError.apply(console, args);
        };
    }

    setupPerformanceMonitoring() {
        if (!window.Sentry) return;

        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            this.captureMessage(`Long task detected: ${entry.duration}ms`, 'warning', {
                                duration: entry.duration,
                                startTime: entry.startTime,
                                name: entry.name
                            });
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                console.warn('Long task monitoring not supported');
            }
        }

        // Monitor Core Web Vitals
        this.monitorWebVitals();
    }

    monitorWebVitals() {
        if (!window.Sentry) return;

        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            Sentry.addBreadcrumb({
                category: 'web-vitals',
                message: 'LCP',
                level: 'info',
                data: {
                    value: lastEntry.renderTime || lastEntry.loadTime,
                    size: lastEntry.size
                }
            });
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                Sentry.addBreadcrumb({
                    category: 'web-vitals',
                    message: 'FID',
                    level: 'info',
                    data: {
                        value: entry.processingStart - entry.startTime,
                        name: entry.name
                    }
                });
            });
        }).observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    
                    Sentry.addBreadcrumb({
                        category: 'web-vitals',
                        message: 'CLS',
                        level: 'info',
                        data: {
                            value: clsValue,
                            sources: entry.sources
                        }
                    });
                }
            }
        }).observe({ type: 'layout-shift', buffered: true });
    }

    setupFallbackErrorHandling() {
        // Local error logging when Sentry is not available
        this.localErrors = [];
        
        window.addEventListener('error', (event) => {
            this.logLocalError({
                type: 'error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: Date.now(),
                stack: event.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logLocalError({
                type: 'unhandledrejection',
                reason: event.reason,
                timestamp: Date.now(),
                stack: event.reason?.stack
            });
        });
    }

    logLocalError(error) {
        this.localErrors.push(error);
        
        // Keep only last 100 errors
        if (this.localErrors.length > 100) {
            this.localErrors.shift();
        }

        // Store in localStorage for debugging
        try {
            localStorage.setItem('error_log', JSON.stringify(this.localErrors));
        } catch (e) {
            // Storage might be full
            console.warn('Could not store error log');
        }

        // Send to custom endpoint if available
        this.sendToCustomEndpoint(error);
    }

    async sendToCustomEndpoint(error) {
        // Send errors to your own backend if Sentry is not available
        try {
            await fetch('/.netlify/functions/log-error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error,
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    timestamp: Date.now()
                })
            });
        } catch (e) {
            // Silently fail - we don't want error logging to cause more errors
        }
    }

    // Public API methods
    captureError(error, context = {}) {
        if (!this.initialized) {
            this.queue.push({ type: 'error', error, context });
            return;
        }

        if (window.Sentry) {
            Sentry.captureException(error, {
                level: context.level || 'error',
                extra: context
            });
        } else {
            this.logLocalError({
                type: 'error',
                message: error.message,
                stack: error.stack,
                context,
                timestamp: Date.now()
            });
        }
    }

    captureMessage(message, level = 'info', context = {}) {
        if (!this.initialized) {
            this.queue.push({ type: 'message', message, level, context });
            return;
        }

        if (window.Sentry) {
            Sentry.captureMessage(message, {
                level,
                extra: context
            });
        } else {
            this.logLocalError({
                type: 'message',
                message,
                level,
                context,
                timestamp: Date.now()
            });
        }
    }

    addBreadcrumb(breadcrumb) {
        if (window.Sentry) {
            Sentry.addBreadcrumb(breadcrumb);
        }
    }

    setContext(key, context) {
        if (window.Sentry) {
            Sentry.setContext(key, context);
        }
    }

    setTag(key, value) {
        if (window.Sentry) {
            Sentry.setTag(key, value);
        }
    }

    startTransaction(name, op = 'navigation') {
        if (window.Sentry) {
            return Sentry.startTransaction({ name, op });
        }
        return null;
    }

    processQueue() {
        while (this.queue.length > 0) {
            const item = this.queue.shift();
            
            if (item.type === 'error') {
                this.captureError(item.error, item.context);
            } else if (item.type === 'message') {
                this.captureMessage(item.message, item.level, item.context);
            }
        }
    }

    showUserFeedback() {
        if (window.Sentry) {
            const user = this.getCurrentUser();
            Sentry.showReportDialog({
                user: {
                    email: user?.email || '',
                    name: user?.username || ''
                }
            });
        }
    }

    getErrorReport() {
        // Get local error log for debugging
        const errors = this.localErrors || [];
        return {
            errors,
            environment: this.getEnvironment(),
            version: this.getAppVersion(),
            user: this.getCurrentUser(),
            timestamp: Date.now()
        };
    }
}

// ============================================
// 2. ERROR BOUNDARY COMPONENT
// ============================================

class ErrorBoundary {
    constructor(container, fallbackUI) {
        this.container = container;
        this.fallbackUI = fallbackUI || this.getDefaultFallback();
        this.hasError = false;
        this.error = null;
        this.errorInfo = null;
        this.init();
    }

    init() {
        this.wrapContainer();
    }

    wrapContainer() {
        // Create a proxy around the container to catch errors
        const originalAppendChild = this.container.appendChild;
        const originalInsertBefore = this.container.insertBefore;
        const originalReplaceChild = this.container.replaceChild;

        this.container.appendChild = (node) => {
            try {
                return originalAppendChild.call(this.container, node);
            } catch (error) {
                this.handleError(error);
                return null;
            }
        };

        this.container.insertBefore = (newNode, referenceNode) => {
            try {
                return originalInsertBefore.call(this.container, newNode, referenceNode);
            } catch (error) {
                this.handleError(error);
                return null;
            }
        };

        this.container.replaceChild = (newChild, oldChild) => {
            try {
                return originalReplaceChild.call(this.container, newChild, oldChild);
            } catch (error) {
                this.handleError(error);
                return null;
            }
        };
    }

    handleError(error, errorInfo = {}) {
        this.hasError = true;
        this.error = error;
        this.errorInfo = errorInfo;

        // Log to error tracker
        window.errorTracker?.captureError(error, {
            component: 'ErrorBoundary',
            container: this.container.id || this.container.className,
            ...errorInfo
        });

        // Show fallback UI
        this.showFallback();
    }

    showFallback() {
        this.container.innerHTML = this.fallbackUI;
        
        // Add retry button functionality
        const retryButton = this.container.querySelector('.error-retry-btn');
        if (retryButton) {
            retryButton.addEventListener('click', () => this.retry());
        }

        // Add report button functionality
        const reportButton = this.container.querySelector('.error-report-btn');
        if (reportButton) {
            reportButton.addEventListener('click', () => this.reportError());
        }
    }

    getDefaultFallback() {
        return `
            <div class="error-boundary-fallback">
                <div class="error-icon">⚠️</div>
                <h2>Oops! Something went wrong</h2>
                <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
                <div class="error-actions">
                    <button class="btn btn-primary error-retry-btn">Try Again</button>
                    <button class="btn btn-secondary error-report-btn">Report Issue</button>
                </div>
                <details class="error-details">
                    <summary>Error Details</summary>
                    <pre>${this.error?.stack || this.error?.message || 'Unknown error'}</pre>
                </details>
            </div>
        `;
    }

    retry() {
        // Reset error state
        this.hasError = false;
        this.error = null;
        this.errorInfo = null;

        // Reload the component or page
        window.location.reload();
    }

    reportError() {
        // Show Sentry feedback dialog
        window.errorTracker?.showUserFeedback();
    }

    reset() {
        this.hasError = false;
        this.error = null;
        this.errorInfo = null;
    }
}

// ============================================
// 3. ERROR RECOVERY STRATEGIES
// ============================================

class ErrorRecovery {
    constructor() {
        this.strategies = new Map();
        this.init();
    }

    init() {
        this.registerDefaultStrategies();
    }

    registerDefaultStrategies() {
        // Network errors
        this.registerStrategy('NetworkError', async (error) => {
            // Wait and retry
            await this.delay(2000);
            return { retry: true };
        });

        // Authentication errors
        this.registerStrategy('AuthError', async (error) => {
            // Redirect to login
            window.location.href = '/login';
            return { handled: true };
        });

        // Storage quota errors
        this.registerStrategy('QuotaExceededError', async (error) => {
            // Clear old data
            this.clearOldData();
            return { retry: true };
        });

        // Firebase errors
        this.registerStrategy('FirebaseError', async (error) => {
            // Fallback to local storage
            this.enableOfflineMode();
            return { handled: true };
        });
    }

    registerStrategy(errorType, handler) {
        this.strategies.set(errorType, handler);
    }

    async handleError(error) {
        const errorType = this.identifyErrorType(error);
        const strategy = this.strategies.get(errorType);

        if (strategy) {
            try {
                const result = await strategy(error);
                
                if (result.retry) {
                    // Retry the operation
                    return { action: 'retry', delay: result.delay || 0 };
                }
                
                if (result.handled) {
                    // Error was handled
                    return { action: 'handled' };
                }
            } catch (strategyError) {
                // Strategy itself failed
                window.errorTracker?.captureError(strategyError, {
                    originalError: error,
                    strategy: errorType
                });
            }
        }

        // No strategy found or strategy failed
        return { action: 'unhandled' };
    }

    identifyErrorType(error) {
        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
            return 'NetworkError';
        }
        
        if (error.code?.includes('auth')) {
            return 'AuthError';
        }
        
        if (error.name === 'QuotaExceededError') {
            return 'QuotaExceededError';
        }
        
        if (error.code?.includes('firebase')) {
            return 'FirebaseError';
        }
        
        return 'UnknownError';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clearOldData() {
        // Clear old localStorage data
        const keysToKeep = ['user_profile', 'user_preferences', 'auth_token'];
        const allKeys = Object.keys(localStorage);
        
        allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
                // Check if data is old (> 7 days)
                try {
                    const data = localStorage.getItem(key);
                    const parsed = JSON.parse(data);
                    
                    if (parsed.timestamp && Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    // If we can't parse it, it's probably old
                    localStorage.removeItem(key);
                }
            }
        });
    }

    enableOfflineMode() {
        // Switch to offline mode
        document.body.classList.add('offline-mode');
        
        // Show offline notification
        window.toastSystem?.show('Working offline. Changes will sync when connection is restored.', 'info');
        
        // Enable local storage fallback
        window.dataSync?.enableOfflineMode();
    }
}

// ============================================
// 4. ERROR STYLES
// ============================================

function injectErrorStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Error Boundary Styles */
        .error-boundary-fallback {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            text-align: center;
            min-height: 400px;
        }

        .error-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        .error-boundary-fallback h2 {
            color: var(--text-primary);
            margin-bottom: 10px;
        }

        .error-boundary-fallback p {
            color: var(--text-muted);
            margin-bottom: 30px;
            max-width: 400px;
        }

        .error-actions {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }

        .error-details {
            width: 100%;
            max-width: 600px;
            text-align: left;
            background: var(--bg-secondary);
            border-radius: 8px;
            padding: 15px;
        }

        .error-details summary {
            cursor: pointer;
            color: var(--text-muted);
            margin-bottom: 10px;
        }

        .error-details pre {
            overflow-x: auto;
            font-size: 12px;
            color: var(--text-muted);
            background: var(--bg-primary);
            padding: 10px;
            border-radius: 4px;
        }

        /* Offline Mode Indicator */
        .offline-mode::before {
            content: 'Offline Mode';
            position: fixed;
            top: 10px;
            right: 10px;
            background: #f59e0b;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
        }

        /* Error Toast Styles */
        .toast.error {
            background: #ef4444;
        }

        .toast.warning {
            background: #f59e0b;
        }

        /* Sentry Feedback Dialog Override */
        .sentry-error-embed {
            z-index: 10001 !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 5. INITIALIZATION
// ============================================

// Initialize error tracking when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeErrorTracking);
} else {
    initializeErrorTracking();
}

function initializeErrorTracking() {
    // Inject styles first
    injectErrorStyles();
    
    // Initialize error tracker
    window.errorTracker = new ErrorTracker();
    
    // Initialize error recovery
    window.errorRecovery = new ErrorRecovery();
    
    // Set up error boundaries for critical sections
    const criticalSections = [
        document.getElementById('main-content'),
        document.getElementById('dashboard'),
        document.getElementById('modal-container')
    ];
    
    criticalSections.forEach(section => {
        if (section) {
            new ErrorBoundary(section);
        }
    });
    
    console.log('✅ Error tracking initialized');
}

// Export for use in other modules
export {
    ErrorTracker,
    ErrorBoundary,
    ErrorRecovery
};
