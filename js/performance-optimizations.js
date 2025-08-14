/**
 * Performance Optimizations Module
 * Implements lazy loading, code splitting, and performance monitoring
 */

// ============================================
// 1. LAZY LOADING SYSTEM
// ============================================

class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.componentObserver = null;
        this.loadedComponents = new Set();
        this.init();
    }

    init() {
        // Initialize Intersection Observers
        this.setupImageLazyLoading();
        this.setupComponentLazyLoading();
        this.setupResourceHints();
    }

    setupImageLazyLoading() {
        const imageOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.imageObserver.unobserve(img);
                }
            });
        }, imageOptions);

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        // Create a new image to preload
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = src;
            if (srcset) img.srcset = srcset;
            img.classList.add('loaded');
            
            // Add fade-in animation
            img.style.animation = 'fadeIn 0.3s ease-in';
        };
        
        tempImg.src = src;
    }

    setupComponentLazyLoading() {
        const componentOptions = {
            root: null,
            rootMargin: '100px',
            threshold: 0
        };

        this.componentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    const componentId = component.dataset.component;
                    
                    if (!this.loadedComponents.has(componentId)) {
                        this.loadComponent(componentId, component);
                        this.loadedComponents.add(componentId);
                    }
                }
            });
        }, componentOptions);

        // Observe all lazy components
        document.querySelectorAll('[data-component]').forEach(component => {
            this.componentObserver.observe(component);
        });
    }

    async loadComponent(componentId, element) {
        try {
            switch(componentId) {
                case 'charts':
                    await this.loadCharts(element);
                    break;
                case 'achievements':
                    await this.loadAchievements(element);
                    break;
                case 'leaderboard':
                    await this.loadLeaderboard(element);
                    break;
                case 'social-feed':
                    await this.loadSocialFeed(element);
                    break;
                default:
                    console.warn(`Unknown component: ${componentId}`);
            }
        } catch (error) {
            console.error(`Error loading component ${componentId}:`, error);
            this.showComponentError(element);
        }
    }

    setupResourceHints() {
        // Preconnect to external domains
        const domains = [
            'https://fonts.googleapis.com',
            'https://cdnjs.cloudflare.com',
            'https://firestore.googleapis.com',
            'https://identitytoolkit.googleapis.com'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            document.head.appendChild(link);
        });

        // Prefetch critical resources
        const criticalResources = [
            '/manifest.json',
            '/firebase-config.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    async loadCharts(element) {
        // Dynamically import Chart.js
        if (!window.Chart) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
            await this.loadScript(script);
        }
        
        // Initialize charts
        this.initializeCharts(element);
    }

    loadScript(script) {
        return new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    showComponentError(element) {
        element.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load component</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
    }
}

// ============================================
// 2. PERFORMANCE MONITORING
// ============================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.observeWebVitals();
        this.trackResourceTiming();
        this.monitorMemoryUsage();
        this.setupErrorTracking();
    }

    observeWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
            this.reportMetric('LCP', this.metrics.lcp);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
                this.reportMetric('FID', this.metrics.fid);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    this.metrics.cls = clsValue;
                }
            }
            this.reportMetric('CLS', this.metrics.cls);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    trackResourceTiming() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
            this.metrics.loadComplete = perfData.loadEventEnd - perfData.loadEventStart;
            this.metrics.domInteractive = perfData.domInteractive;
            
            // Track resource loading
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(r => r.duration > 1000);
            
            if (slowResources.length > 0) {
                console.warn('Slow resources detected:', slowResources);
            }
        });
    }

    monitorMemoryUsage() {
        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = {
                    usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
                    totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
                    jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
                };
                
                // Check for memory leaks
                if (performance.memory.usedJSHeapSize > performance.memory.jsHeapSizeLimit * 0.9) {
                    console.warn('High memory usage detected:', memoryInfo);
                    this.cleanupMemory();
                }
            }, 30000); // Check every 30 seconds
        }
    }

    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.reportError({
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.reportError({
                type: 'unhandledRejection',
                reason: event.reason,
                promise: event.promise
            });
        });
    }

    reportMetric(name, value) {
        // Send to analytics
        if (window.gtag) {
            gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: name,
                value: Math.round(value)
            });
        }
        
        // Log to console in dev mode
        if (window.location.hostname === 'localhost') {
            console.log(`Performance Metric - ${name}:`, value);
        }
    }

    reportError(errorInfo) {
        // Send to error tracking service
        if (window.Sentry) {
            Sentry.captureException(new Error(errorInfo.message), {
                extra: errorInfo
            });
        }
        
        // Fallback logging
        console.error('Error tracked:', errorInfo);
    }

    cleanupMemory() {
        // Clear unused caches
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('old-version')) {
                        caches.delete(name);
                    }
                });
            });
        }
        
        // Clear old localStorage items
        const now = Date.now();
        Object.keys(localStorage).forEach(key => {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (item.expiry && item.expiry < now) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Not JSON, skip
            }
        });
    }
}

// ============================================
// 3. CODE SPLITTING UTILITIES
// ============================================

class CodeSplitter {
    constructor() {
        this.modules = new Map();
        this.loadingPromises = new Map();
    }

    async loadModule(moduleName) {
        // Check if already loaded
        if (this.modules.has(moduleName)) {
            return this.modules.get(moduleName);
        }

        // Check if currently loading
        if (this.loadingPromises.has(moduleName)) {
            return this.loadingPromises.get(moduleName);
        }

        // Start loading
        const loadPromise = this.importModule(moduleName);
        this.loadingPromises.set(moduleName, loadPromise);

        try {
            const module = await loadPromise;
            this.modules.set(moduleName, module);
            this.loadingPromises.delete(moduleName);
            return module;
        } catch (error) {
            this.loadingPromises.delete(moduleName);
            throw error;
        }
    }

    async importModule(moduleName) {
        const moduleMap = {
            'achievements': '/js/modules/achievements.js',
            'charts': '/js/modules/charts.js',
            'social': '/js/modules/social.js',
            'wallet': '/js/modules/wallet.js',
            'ai-chat': '/js/modules/ai-chat.js',
            'gamification': '/js/modules/gamification.js'
        };

        const modulePath = moduleMap[moduleName];
        if (!modulePath) {
            throw new Error(`Unknown module: ${moduleName}`);
        }

        return import(modulePath);
    }

    preloadModules(moduleNames) {
        moduleNames.forEach(name => {
            const link = document.createElement('link');
            link.rel = 'modulepreload';
            link.href = `/js/modules/${name}.js`;
            document.head.appendChild(link);
        });
    }
}

// ============================================
// 4. DEBOUNCE AND THROTTLE UTILITIES
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// 5. VIRTUAL SCROLLING
// ============================================

class VirtualScroller {
    constructor(container, items, itemHeight) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.visibleItems = [];
        this.init();
    }

    init() {
        this.setupContainer();
        this.render();
        this.attachScrollListener();
    }

    setupContainer() {
        const totalHeight = this.items.length * this.itemHeight;
        this.container.style.height = `${totalHeight}px`;
        this.container.style.position = 'relative';
    }

    render() {
        const scrollTop = this.container.scrollTop;
        const containerHeight = this.container.clientHeight;
        
        const startIndex = Math.floor(scrollTop / this.itemHeight);
        const endIndex = Math.ceil((scrollTop + containerHeight) / this.itemHeight);
        
        // Clear previous items
        this.visibleItems.forEach(item => item.remove());
        this.visibleItems = [];
        
        // Render visible items
        for (let i = startIndex; i < endIndex && i < this.items.length; i++) {
            const item = this.createItemElement(this.items[i], i);
            item.style.position = 'absolute';
            item.style.top = `${i * this.itemHeight}px`;
            this.container.appendChild(item);
            this.visibleItems.push(item);
        }
    }

    createItemElement(data, index) {
        const div = document.createElement('div');
        div.className = 'virtual-item';
        div.innerHTML = data.content || `Item ${index}`;
        return div;
    }

    attachScrollListener() {
        this.container.addEventListener('scroll', throttle(() => {
            this.render();
        }, 16)); // ~60fps
    }
}

// ============================================
// 6. INITIALIZATION
// ============================================

// Initialize performance optimizations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOptimizations);
} else {
    initializeOptimizations();
}

function initializeOptimizations() {
    // Initialize lazy loading
    window.lazyLoader = new LazyLoader();
    
    // Initialize performance monitoring
    window.performanceMonitor = new PerformanceMonitor();
    
    // Initialize code splitter
    window.codeSplitter = new CodeSplitter();
    
    // Preload critical modules
    window.codeSplitter.preloadModules(['achievements', 'charts']);
    
    console.log('✅ Performance optimizations initialized');
}

// Export for use in other modules
export {
    LazyLoader,
    PerformanceMonitor,
    CodeSplitter,
    VirtualScroller,
    debounce,
    throttle
};
