// Performance Manager
// Handles performance monitoring, optimization, and lazy loading

class PerformanceManager {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.lazyLoadQueue = [];
        this.isInitialized = false;
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('⚡ Performance Manager initialized');
        this.isInitialized = true;
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Setup intersection observer for lazy loading
        this.setupLazyLoading();
        
        // Monitor for performance issues
        this.startPerformanceMonitoring();
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.set('lcp', entry.startTime);
                    if (entry.startTime > 2500) {
                        console.warn('⚠️ Slow LCP detected:', entry.startTime);
                    }
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Monitor First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.set('fid', entry.processingStart - entry.startTime);
                    if (entry.processingStart - entry.startTime > 100) {
                        console.warn('⚠️ Slow FID detected:', entry.processingStart - entry.startTime);
                    }
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Monitor Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.set('cls', entry.value);
                    if (entry.value > 0.1) {
                        console.warn('⚠️ Poor CLS detected:', entry.value);
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    // Setup lazy loading system
    setupLazyLoading() {
        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    this.loadLazyElement(element);
                }
            });
        }, {
            rootMargin: '50px'
        });
    }

    // Load lazy element
    loadLazyElement(element) {
        const src = element.dataset.src;
        const srcset = element.dataset.srcset;
        
        if (src) {
            element.src = src;
            element.removeAttribute('data-src');
        }
        
        if (srcset) {
            element.srcset = srcset;
            element.removeAttribute('data-srcset');
        }
        
        element.classList.remove('lazy');
        this.lazyLoadObserver.unobserve(element);
    }

    // Add element to lazy loading queue
    addLazyElement(element) {
        element.classList.add('lazy');
        this.lazyLoadObserver.observe(element);
    }

    // Start performance monitoring
    startPerformanceMonitoring() {
        // Monitor memory usage
        setInterval(() => {
            if ('memory' in performance) {
                const memory = performance.memory;
                this.metrics.set('memory', {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit
                });
                
                // Warn if memory usage is high
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    console.warn('⚠️ High memory usage detected');
                }
            }
        }, 30000); // Check every 30 seconds
    }

    // Debounce function
    debounce(func, delay) {
        const key = func.toString();
        
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key));
        }
        
        const timer = setTimeout(() => {
            func();
            this.debounceTimers.delete(key);
        }, delay);
        
        this.debounceTimers.set(key, timer);
    }

    // Throttle function
    throttle(func, delay) {
        const key = func.toString();
        
        if (this.throttleTimers.has(key)) {
            return;
        }
        
        func();
        this.throttleTimers.set(key, true);
        
        setTimeout(() => {
            this.throttleTimers.delete(key);
        }, delay);
    }

    // Measure function execution time
    measure(name, func) {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        
        this.metrics.set(name, end - start);
        
        if (end - start > 16) { // Longer than one frame
            console.warn(`⚠️ Slow function detected: ${name} took ${end - start}ms`);
        }
        
        return result;
    }

    // Async measure function
    async measureAsync(name, func) {
        const start = performance.now();
        const result = await func();
        const end = performance.now();
        
        this.metrics.set(name, end - start);
        
        if (end - start > 100) { // Longer than 100ms for async
            console.warn(`⚠️ Slow async function detected: ${name} took ${end - start}ms`);
        }
        
        return result;
    }

    // Get performance metrics
    getMetrics() {
        return Object.fromEntries(this.metrics);
    }

    // Get performance report
    getPerformanceReport() {
        const metrics = this.getMetrics();
        const report = {
            timestamp: Date.now(),
            metrics,
            recommendations: []
        };

        // Analyze metrics and provide recommendations
        if (metrics.lcp > 2500) {
            report.recommendations.push('Optimize Largest Contentful Paint');
        }
        if (metrics.fid > 100) {
            report.recommendations.push('Optimize First Input Delay');
        }
        if (metrics.cls > 0.1) {
            report.recommendations.push('Fix Cumulative Layout Shift');
        }

        return report;
    }

    // Optimize images
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.addLazyElement(img));
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            '/css/modular.css',
            '/js/app.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    // Cleanup
    cleanup() {
        if (this.lazyLoadObserver) {
            this.lazyLoadObserver.disconnect();
        }
        
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
        
        this.throttleTimers.clear();
        this.metrics.clear();
    }
}

export default PerformanceManager; 