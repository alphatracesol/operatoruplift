/**
 * UI/UX Enhancements Module
 * Implements skeleton screens, loading states, error boundaries, and empty states
 */

// ============================================
// 1. SKELETON SCREEN SYSTEM
// ============================================

class SkeletonLoader {
    constructor() {
        this.skeletons = new Map();
        this.init();
    }

    init() {
        this.setupStyles();
    }

    setupStyles() {
        if (!document.getElementById('skeleton-styles')) {
            const style = document.createElement('style');
            style.id = 'skeleton-styles';
            style.textContent = `
                .skeleton {
                    position: relative;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.06);
                    border-radius: 8px;
                }
                
                .skeleton::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.08),
                        transparent
                    );
                    transform: translateX(-100%);
                    animation: skeleton-shimmer 1.5s infinite;
                }
                
                @keyframes skeleton-shimmer {
                    100% { transform: translateX(100%); }
                }
                
                .skeleton-text {
                    height: 1rem;
                    margin-bottom: 0.5rem;
                    border-radius: 4px;
                }
                
                .skeleton-title {
                    height: 1.5rem;
                    width: 60%;
                    margin-bottom: 1rem;
                }
                
                .skeleton-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                }
                
                .skeleton-card {
                    height: 200px;
                    border-radius: 12px;
                }
                
                .skeleton-button {
                    height: 40px;
                    width: 120px;
                    border-radius: 8px;
                }
                
                .skeleton-stat {
                    height: 80px;
                    border-radius: 12px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    createSkeleton(type, count = 1) {
        const skeletons = [];
        
        for (let i = 0; i < count; i++) {
            switch(type) {
                case 'card':
                    skeletons.push(this.createCardSkeleton());
                    break;
                case 'list-item':
                    skeletons.push(this.createListItemSkeleton());
                    break;
                case 'stat':
                    skeletons.push(this.createStatSkeleton());
                    break;
                case 'achievement':
                    skeletons.push(this.createAchievementSkeleton());
                    break;
                case 'leaderboard':
                    skeletons.push(this.createLeaderboardSkeleton());
                    break;
                case 'feed-item':
                    skeletons.push(this.createFeedItemSkeleton());
                    break;
                default:
                    skeletons.push(this.createDefaultSkeleton());
            }
        }
        
        return count === 1 ? skeletons[0] : skeletons;
    }

    createCardSkeleton() {
        return `
            <div class="skeleton skeleton-card">
                <div style="padding: 1.5rem;">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text" style="width: 80%;"></div>
                    <div class="skeleton skeleton-text" style="width: 60%;"></div>
                </div>
            </div>
        `;
    }

    createListItemSkeleton() {
        return `
            <div class="skeleton" style="display: flex; align-items: center; padding: 1rem; gap: 1rem;">
                <div class="skeleton skeleton-avatar"></div>
                <div style="flex: 1;">
                    <div class="skeleton skeleton-text" style="width: 40%;"></div>
                    <div class="skeleton skeleton-text" style="width: 60%;"></div>
                </div>
            </div>
        `;
    }

    createStatSkeleton() {
        return `
            <div class="skeleton skeleton-stat">
                <div style="padding: 1rem;">
                    <div class="skeleton skeleton-text" style="width: 30%; height: 0.75rem;"></div>
                    <div class="skeleton skeleton-title" style="width: 50%; height: 2rem; margin-top: 0.5rem;"></div>
                </div>
            </div>
        `;
    }

    createAchievementSkeleton() {
        return `
            <div class="skeleton" style="padding: 1rem; text-align: center;">
                <div class="skeleton skeleton-avatar" style="margin: 0 auto;"></div>
                <div class="skeleton skeleton-text" style="width: 60%; margin: 1rem auto;"></div>
                <div class="skeleton skeleton-text" style="width: 40%; margin: 0 auto;"></div>
            </div>
        `;
    }

    createLeaderboardSkeleton() {
        return `
            <div class="skeleton" style="padding: 0.75rem;">
                ${[1,2,3,4,5].map(() => `
                    <div style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem 0;">
                        <div class="skeleton" style="width: 30px; height: 30px; border-radius: 4px;"></div>
                        <div class="skeleton skeleton-avatar"></div>
                        <div style="flex: 1;">
                            <div class="skeleton skeleton-text" style="width: 50%;"></div>
                        </div>
                        <div class="skeleton skeleton-text" style="width: 60px;"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createFeedItemSkeleton() {
        return `
            <div class="skeleton" style="padding: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                    <div class="skeleton skeleton-avatar"></div>
                    <div>
                        <div class="skeleton skeleton-text" style="width: 120px;"></div>
                        <div class="skeleton skeleton-text" style="width: 80px; height: 0.75rem;"></div>
                    </div>
                </div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width: 70%;"></div>
            </div>
        `;
    }

    createDefaultSkeleton() {
        return `<div class="skeleton skeleton-card"></div>`;
    }

    show(container, type, count) {
        const skeletonHTML = this.createSkeleton(type, count);
        const wrapper = document.createElement('div');
        wrapper.className = 'skeleton-wrapper';
        wrapper.innerHTML = Array.isArray(skeletonHTML) ? skeletonHTML.join('') : skeletonHTML;
        
        container.appendChild(wrapper);
        this.skeletons.set(container, wrapper);
        
        return wrapper;
    }

    hide(container) {
        const skeleton = this.skeletons.get(container);
        if (skeleton) {
            skeleton.remove();
            this.skeletons.delete(container);
        }
    }
}

// ============================================
// 2. LOADING STATES MANAGER
// ============================================

class LoadingStateManager {
    constructor() {
        this.loadingStates = new Map();
        this.init();
    }

    init() {
        this.setupStyles();
    }

    setupStyles() {
        if (!document.getElementById('loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                }
                
                .loading-spinner {
                    width: 48px;
                    height: 48px;
                    border: 3px solid rgba(249, 115, 22, 0.2);
                    border-top-color: #f97316;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .loading-dots {
                    display: flex;
                    gap: 8px;
                }
                
                .loading-dot {
                    width: 12px;
                    height: 12px;
                    background: #f97316;
                    border-radius: 50%;
                    animation: pulse 1.4s ease-in-out infinite;
                }
                
                .loading-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }
                
                .loading-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }
                
                @keyframes pulse {
                    0%, 80%, 100% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                }
                
                .loading-progress {
                    width: 200px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                }
                
                .loading-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #f97316, #fb923c);
                    border-radius: 2px;
                    animation: progress 2s ease-in-out infinite;
                }
                
                @keyframes progress {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showLoading(container, type = 'spinner', message = '') {
        // Make container relative if not already
        const position = window.getComputedStyle(container).position;
        if (position === 'static') {
            container.style.position = 'relative';
        }

        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        
        let content = '';
        switch(type) {
            case 'spinner':
                content = '<div class="loading-spinner"></div>';
                break;
            case 'dots':
                content = `
                    <div class="loading-dots">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                `;
                break;
            case 'progress':
                content = `
                    <div>
                        <div class="loading-progress">
                            <div class="loading-progress-bar"></div>
                        </div>
                        ${message ? `<p style="color: white; margin-top: 1rem;">${message}</p>` : ''}
                    </div>
                `;
                break;
            default:
                content = '<div class="loading-spinner"></div>';
        }
        
        overlay.innerHTML = content;
        container.appendChild(overlay);
        this.loadingStates.set(container, overlay);
        
        return overlay;
    }

    hideLoading(container) {
        const overlay = this.loadingStates.get(container);
        if (overlay) {
            overlay.remove();
            this.loadingStates.delete(container);
        }
    }

    updateProgress(container, progress, message) {
        const overlay = this.loadingStates.get(container);
        if (overlay) {
            const progressBar = overlay.querySelector('.loading-progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            
            const messageEl = overlay.querySelector('p');
            if (messageEl && message) {
                messageEl.textContent = message;
            }
        }
    }
}

// ============================================
// 3. ERROR BOUNDARY SYSTEM
// ============================================

class ErrorBoundary {
    constructor() {
        this.errorHandlers = new Map();
        this.init();
    }

    init() {
        this.setupGlobalErrorHandling();
        this.setupStyles();
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.handleError(event.error, document.body);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, document.body);
        });
    }

    setupStyles() {
        if (!document.getElementById('error-styles')) {
            const style = document.createElement('style');
            style.id = 'error-styles';
            style.textContent = `
                .error-boundary {
                    padding: 2rem;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 12px;
                    text-align: center;
                }
                
                .error-icon {
                    font-size: 3rem;
                    color: #ef4444;
                    margin-bottom: 1rem;
                }
                
                .error-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #ef4444;
                    margin-bottom: 0.5rem;
                }
                
                .error-message {
                    color: #fca5a5;
                    margin-bottom: 1.5rem;
                }
                
                .error-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                
                .error-button {
                    padding: 0.5rem 1rem;
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .error-button:hover {
                    background: rgba(239, 68, 68, 0.3);
                }
            `;
            document.head.appendChild(style);
        }
    }

    wrap(container, asyncFunction) {
        return async (...args) => {
            try {
                return await asyncFunction(...args);
            } catch (error) {
                this.handleError(error, container);
            }
        };
    }

    handleError(error, container) {
        console.error('Error caught by boundary:', error);
        
        // Check if we should show error UI
        if (this.shouldShowErrorUI(error)) {
            this.showErrorUI(container, error);
        }
        
        // Report to error tracking
        this.reportError(error);
    }

    shouldShowErrorUI(error) {
        // Don't show UI for certain types of errors
        const silentErrors = [
            'ResizeObserver loop limit exceeded',
            'Non-Error promise rejection captured'
        ];
        
        return !silentErrors.some(msg => error?.message?.includes(msg));
    }

    showErrorUI(container, error) {
        const errorUI = document.createElement('div');
        errorUI.className = 'error-boundary';
        errorUI.innerHTML = `
            <div class="error-icon">⚠️</div>
            <h2 class="error-title">Something went wrong</h2>
            <p class="error-message">${this.getUserFriendlyMessage(error)}</p>
            <div class="error-actions">
                <button class="error-button" onclick="location.reload()">
                    Reload Page
                </button>
                <button class="error-button" onclick="this.parentElement.parentElement.remove()">
                    Dismiss
                </button>
            </div>
        `;
        
        container.innerHTML = '';
        container.appendChild(errorUI);
    }

    getUserFriendlyMessage(error) {
        const errorMessages = {
            'NetworkError': 'Unable to connect. Please check your internet connection.',
            'TypeError': 'Something unexpected happened. Please try again.',
            'QuotaExceededError': 'Storage limit exceeded. Please clear some space.',
            'NotAllowedError': 'Permission denied. Please check your settings.',
            'TimeoutError': 'The operation took too long. Please try again.'
        };
        
        for (const [key, message] of Object.entries(errorMessages)) {
            if (error?.name?.includes(key) || error?.message?.includes(key)) {
                return message;
            }
        }
        
        return 'An unexpected error occurred. Please try again later.';
    }

    reportError(error) {
        // Send to error tracking service
        if (window.Sentry) {
            Sentry.captureException(error);
        }
        
        // Send to analytics
        if (window.gtag) {
            gtag('event', 'exception', {
                description: error?.message || 'Unknown error',
                fatal: false
            });
        }
    }
}

// ============================================
// 4. EMPTY STATES
// ============================================

class EmptyStateManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupStyles();
    }

    setupStyles() {
        if (!document.getElementById('empty-state-styles')) {
            const style = document.createElement('style');
            style.id = 'empty-state-styles';
            style.textContent = `
                .empty-state {
                    padding: 3rem 2rem;
                    text-align: center;
                }
                
                .empty-state-icon {
                    font-size: 4rem;
                    opacity: 0.5;
                    margin-bottom: 1rem;
                }
                
                .empty-state-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }
                
                .empty-state-message {
                    color: var(--text-muted);
                    margin-bottom: 1.5rem;
                    max-width: 400px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .empty-state-action {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    background: var(--primary-color);
                    color: white;
                    border-radius: 8px;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                
                .empty-state-action:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
                }
            `;
            document.head.appendChild(style);
        }
    }

    create(type, customOptions = {}) {
        const defaults = this.getDefaultOptions(type);
        const options = { ...defaults, ...customOptions };
        
        return `
            <div class="empty-state">
                <div class="empty-state-icon">${options.icon}</div>
                <h3 class="empty-state-title">${options.title}</h3>
                <p class="empty-state-message">${options.message}</p>
                ${options.action ? `
                    <a href="${options.actionUrl || '#'}" 
                       class="empty-state-action" 
                       onclick="${options.actionHandler || ''}">
                        ${options.action}
                    </a>
                ` : ''}
            </div>
        `;
    }

    getDefaultOptions(type) {
        const options = {
            'no-data': {
                icon: '📊',
                title: 'No Data Yet',
                message: 'Start tracking your progress to see insights here.',
                action: 'Get Started'
            },
            'no-achievements': {
                icon: '🏆',
                title: 'No Achievements Yet',
                message: 'Complete challenges and reach milestones to unlock achievements.',
                action: 'View Challenges'
            },
            'no-tasks': {
                icon: '✅',
                title: 'No Tasks',
                message: 'You\'re all caught up! Add a new task to stay productive.',
                action: 'Add Task'
            },
            'no-friends': {
                icon: '👥',
                title: 'No Friends Yet',
                message: 'Connect with others to compete and share your progress.',
                action: 'Find Friends'
            },
            'no-messages': {
                icon: '💬',
                title: 'No Messages',
                message: 'Your inbox is empty. Start a conversation!',
                action: 'New Message'
            },
            'no-notifications': {
                icon: '🔔',
                title: 'No Notifications',
                message: 'You\'re all caught up! Check back later for updates.',
                action: null
            },
            'no-search-results': {
                icon: '🔍',
                title: 'No Results Found',
                message: 'Try adjusting your search terms or filters.',
                action: 'Clear Filters'
            },
            'offline': {
                icon: '📡',
                title: 'You\'re Offline',
                message: 'Connect to the internet to see the latest updates.',
                action: 'Retry'
            }
        };
        
        return options[type] || options['no-data'];
    }

    show(container, type, customOptions) {
        const emptyStateHTML = this.create(type, customOptions);
        container.innerHTML = emptyStateHTML;
    }
}

// ============================================
// 5. TOAST NOTIFICATIONS
// ============================================

class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.init();
    }

    init() {
        this.createContainer();
        this.setupStyles();
    }

    createContainer() {
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    setupStyles() {
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
                    pointer-events: auto;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 350px;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                .toast-icon {
                    font-size: 1.5rem;
                }
                
                .toast-content {
                    flex: 1;
                }
                
                .toast-title {
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                
                .toast-message {
                    font-size: 0.875rem;
                    opacity: 0.9;
                }
                
                .toast-close {
                    background: none;
                    border: none;
                    color: white;
                    opacity: 0.6;
                    cursor: pointer;
                    font-size: 1.25rem;
                    padding: 0;
                    transition: opacity 0.2s;
                }
                
                .toast-close:hover {
                    opacity: 1;
                }
                
                .toast-success {
                    border-left: 4px solid #10b981;
                }
                
                .toast-error {
                    border-left: 4px solid #ef4444;
                }
                
                .toast-warning {
                    border-left: 4px solid #f59e0b;
                }
                
                .toast-info {
                    border-left: 4px solid #3b82f6;
                }
            `;
            document.head.appendChild(style);
        }
    }

    show(message, type = 'info', duration = 5000) {
        const id = Date.now();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                ${typeof message === 'object' ? `
                    <div class="toast-title">${message.title}</div>
                    <div class="toast-message">${message.text}</div>
                ` : `
                    <div class="toast-message">${message}</div>
                `}
            </div>
            <button class="toast-close" onclick="window.toastManager.dismiss(${id})">×</button>
        `;
        
        this.container.appendChild(toast);
        this.toasts.set(id, toast);
        
        if (duration > 0) {
            setTimeout(() => this.dismiss(id), duration);
        }
        
        return id;
    }

    dismiss(id) {
        const toast = this.toasts.get(id);
        if (toast) {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                toast.remove();
                this.toasts.delete(id);
            }, 300);
        }
    }

    success(message) {
        return this.show(message, 'success');
    }

    error(message) {
        return this.show(message, 'error', 8000);
    }

    warning(message) {
        return this.show(message, 'warning', 6000);
    }

    info(message) {
        return this.show(message, 'info');
    }
}

// ============================================
// 6. INITIALIZATION
// ============================================

// Initialize UI enhancements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUIEnhancements);
} else {
    initializeUIEnhancements();
}

function initializeUIEnhancements() {
    // Initialize managers
    window.skeletonLoader = new SkeletonLoader();
    window.loadingStateManager = new LoadingStateManager();
    window.errorBoundary = new ErrorBoundary();
    window.emptyStateManager = new EmptyStateManager();
    window.toastManager = new ToastManager();
    
    console.log('✅ UI enhancements initialized');
}

// Export for use in other modules
export {
    SkeletonLoader,
    LoadingStateManager,
    ErrorBoundary,
    EmptyStateManager,
    ToastManager
};
