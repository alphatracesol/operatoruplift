/**
 * Phase 3.3: Performance Optimization & Scalability Module
 * Provides performance optimization features including lazy loading,
 * caching, performance monitoring, and optimization algorithms.
 */

class Performance {
    constructor() {
        this.performanceConfig = null;
        this.cacheManager = null;
        this.lazyLoader = null;
        this.metricsCollector = null;
        this.optimizer = null;
        this.resourceManager = null;
        
        console.log('⚡ Performance module initialized');
        this.initialize();
    }

    initialize() {
        try {
            this.initializePerformanceConfig();
            this.initializeCacheManager();
            this.initializeLazyLoader();
            this.initializeMetricsCollector();
            this.initializeOptimizer();
            this.initializeResourceManager();
            this.startPerformanceMonitoring();
            console.log('✅ Performance module fully initialized');
        } catch (error) {
            console.error('❌ Error initializing Performance module:', error);
        }
    }

    initializePerformanceConfig() {
        this.performanceConfig = {
            enableLazyLoading: true,
            enableCaching: true,
            enableCompression: true,
            enableMinification: true,
            cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours
            maxCacheSize: 50 * 1024 * 1024, // 50MB
            lazyLoadThreshold: 0.1, // 10% of viewport
            performanceMonitoring: true,
            autoOptimization: true,
            resourcePreloading: true
        };
    }

    initializeCacheManager() {
        this.cacheManager = {
            cache: new Map(),
            cacheStats: {
                hits: 0,
                misses: 0,
                size: 0,
                entries: 0
            },
            
            set: (key, value, ttl = null) => {
                return this.setCacheItem(key, value, ttl);
            },
            
            get: (key) => {
                return this.getCacheItem(key);
            },
            
            clear: () => {
                return this.clearCache();
            },
            
            getStats: () => {
                return this.getCacheStats();
            }
        };
    }

    initializeLazyLoader() {
        this.lazyLoader = {
            lazyElements: new Set(),
            intersectionObserver: null,
            loadedElements: new Set(),
            
            registerElement: (element, callback) => {
                return this.registerLazyElement(element, callback);
            },
            
            loadElement: (element) => {
                return this.loadLazyElement(element);
            },
            
            getLoadedElements: () => {
                return this.getLoadedElements();
            }
        };
    }

    initializeMetricsCollector() {
        this.metricsCollector = {
            metrics: {
                pageLoadTime: 0,
                domContentLoaded: 0,
                firstContentfulPaint: 0,
                largestContentfulPaint: 0,
                cumulativeLayoutShift: 0,
                firstInputDelay: 0,
                timeToInteractive: 0
            },
            
            collectMetrics: () => {
                return this.collectPerformanceMetrics();
            },
            
            getMetrics: () => {
                return this.getPerformanceMetrics();
            },
            
            exportMetrics: () => {
                return this.exportPerformanceMetrics();
            }
        };
    }

    initializeOptimizer() {
        this.optimizer = {
            optimizationRules: {
                imageOptimization: true,
                scriptOptimization: true,
                cssOptimization: true,
                fontOptimization: true,
                resourceOptimization: true
            },
            
            optimizePerformance: () => {
                return this.optimizePerformance();
            },
            
            optimizeImages: () => {
                return this.optimizeImages();
            },
            
            optimizeScripts: () => {
                return this.optimizeScripts();
            },
            
            optimizeCSS: () => {
                return this.optimizeCSS();
            }
        };
    }

    initializeResourceManager() {
        this.resourceManager = {
            resourceQueue: [],
            loadingResources: new Set(),
            loadedResources: new Set(),
            
            preloadResource: (url, type) => {
                return this.preloadResource(url, type);
            },
            
            loadResource: (url, type) => {
                return this.loadResource(url, type);
            },
            
            getResourceStatus: (url) => {
                return this.getResourceStatus(url);
            }
        };
    }

    startPerformanceMonitoring() {
        // Monitor page load performance
        this.monitorPageLoad();
        
        // Monitor resource loading
        this.monitorResourceLoading();
        
        // Monitor user interactions
        this.monitorUserInteractions();
        
        // Monitor memory usage
        this.monitorMemoryUsage();
        
        // Start lazy loading
        this.startLazyLoading();
        
        console.log('✅ Performance monitoring started');
    }

    enableLazyLoading() {
        try {
            if (!this.performanceConfig.enableLazyLoading) {
                console.log('Lazy loading is disabled in configuration');
                return false;
            }
            
            // Set up intersection observer for lazy loading
            this.lazyLoader.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadLazyElement(entry.target);
                        }
                    });
                },
                {
                    rootMargin: `${this.performanceConfig.lazyLoadThreshold * 100}%`,
                    threshold: 0.1
                }
            );
            
            // Find and register lazy elements
            this.registerLazyElements();
            
            console.log('✅ Lazy loading enabled');
            return true;
        } catch (error) {
            console.error('❌ Error enabling lazy loading:', error);
            return false;
        }
    }

    registerLazyElements() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        lazyElements.forEach(element => {
            this.registerLazyElement(element, () => {
                this.loadLazyElement(element);
            });
        });
        
        console.log(`✅ Registered ${lazyElements.length} lazy elements`);
    }

    registerLazyElement(element, callback) {
        try {
            this.lazyLoader.lazyElements.add(element);
            
            if (this.lazyLoader.intersectionObserver) {
                this.lazyLoader.intersectionObserver.observe(element);
            }
            
            // Store callback for later execution
            element.lazyCallback = callback;
            
            return true;
        } catch (error) {
            console.error('❌ Error registering lazy element:', error);
            return false;
        }
    }

    loadLazyElement(element) {
        try {
            if (this.lazyLoader.loadedElements.has(element)) {
                return true; // Already loaded
            }
            
            const lazyType = element.getAttribute('data-lazy');
            
            switch (lazyType) {
                case 'image':
                    this.loadLazyImage(element);
                    break;
                case 'script':
                    this.loadLazyScript(element);
                    break;
                case 'content':
                    this.loadLazyContent(element);
                    break;
                default:
                    console.warn(`Unknown lazy type: ${lazyType}`);
            }
            
            // Mark as loaded
            this.lazyLoader.loadedElements.add(element);
            
            // Execute callback if exists
            if (element.lazyCallback) {
                element.lazyCallback();
            }
            
            // Stop observing
            if (this.lazyLoader.intersectionObserver) {
                this.lazyLoader.intersectionObserver.unobserve(element);
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error loading lazy element:', error);
            return false;
        }
    }

    loadLazyImage(element) {
        const src = element.getAttribute('data-src');
        if (src) {
            element.src = src;
            element.removeAttribute('data-src');
            element.classList.remove('lazy');
            element.classList.add('loaded');
        }
    }

    loadLazyScript(element) {
        const src = element.getAttribute('data-src');
        if (src) {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            element.parentNode.replaceChild(script, element);
        }
    }

    loadLazyContent(element) {
        const content = element.getAttribute('data-content');
        if (content) {
            element.innerHTML = content;
            element.removeAttribute('data-content');
            element.classList.remove('lazy');
            element.classList.add('loaded');
        }
    }

    enableCaching() {
        try {
            if (!this.performanceConfig.enableCaching) {
                console.log('Caching is disabled in configuration');
                return false;
            }
            
            // Set up cache cleanup interval
            setInterval(() => {
                this.cleanupCache();
            }, 60 * 1000); // Clean up every minute
            
            console.log('✅ Caching enabled');
            return true;
        } catch (error) {
            console.error('❌ Error enabling caching:', error);
            return false;
        }
    }

    setCacheItem(key, value, ttl = null) {
        try {
            const expiry = ttl ? Date.now() + ttl : Date.now() + this.performanceConfig.cacheExpiry;
            
            const cacheItem = {
                value: value,
                expiry: expiry,
                size: this.calculateSize(value),
                timestamp: Date.now()
            };
            
            // Check cache size limit
            if (this.cacheManager.cacheStats.size + cacheItem.size > this.performanceConfig.maxCacheSize) {
                this.cleanupCache();
            }
            
            this.cacheManager.cache.set(key, cacheItem);
            this.cacheManager.cacheStats.size += cacheItem.size;
            this.cacheManager.cacheStats.entries = this.cacheManager.cache.size;
            
            return true;
        } catch (error) {
            console.error('❌ Error setting cache item:', error);
            return false;
        }
    }

    getCacheItem(key) {
        try {
            const item = this.cacheManager.cache.get(key);
            
            if (!item) {
                this.cacheManager.cacheStats.misses++;
                return null;
            }
            
            // Check if expired
            if (Date.now() > item.expiry) {
                this.cacheManager.cache.delete(key);
                this.cacheManager.cacheStats.misses++;
                return null;
            }
            
            this.cacheManager.cacheStats.hits++;
            return item.value;
        } catch (error) {
            console.error('❌ Error getting cache item:', error);
            return null;
        }
    }

    cleanupCache() {
        try {
            const now = Date.now();
            let cleanedSize = 0;
            let cleanedEntries = 0;
            
            for (const [key, item] of this.cacheManager.cache.entries()) {
                if (now > item.expiry) {
                    cleanedSize += item.size;
                    cleanedEntries++;
                    this.cacheManager.cache.delete(key);
                }
            }
            
            this.cacheManager.cacheStats.size -= cleanedSize;
            this.cacheManager.cacheStats.entries = this.cacheManager.cache.size;
            
            if (cleanedEntries > 0) {
                console.log(`🧹 Cleaned ${cleanedEntries} expired cache entries (${cleanedSize} bytes)`);
            }
        } catch (error) {
            console.error('❌ Error cleaning cache:', error);
        }
    }

    clearCache() {
        try {
            this.cacheManager.cache.clear();
            this.cacheManager.cacheStats = {
                hits: 0,
                misses: 0,
                size: 0,
                entries: 0
            };
            
            console.log('✅ Cache cleared');
            return true;
        } catch (error) {
            console.error('❌ Error clearing cache:', error);
            return false;
        }
    }

    getCacheStats() {
        return {
            ...this.cacheManager.cacheStats,
            hitRate: this.cacheManager.cacheStats.hits / (this.cacheManager.cacheStats.hits + this.cacheManager.cacheStats.misses) || 0
        };
    }

    optimizePerformance() {
        try {
            console.log('🚀 Starting performance optimization...');
            
            const optimizations = [];
            
            // Optimize images
            if (this.optimizer.optimizationRules.imageOptimization) {
                optimizations.push(this.optimizeImages());
            }
            
            // Optimize scripts
            if (this.optimizer.optimizationRules.scriptOptimization) {
                optimizations.push(this.optimizeScripts());
            }
            
            // Optimize CSS
            if (this.optimizer.optimizationRules.cssOptimization) {
                optimizations.push(this.optimizeCSS());
            }
            
            // Optimize fonts
            if (this.optimizer.optimizationRules.fontOptimization) {
                optimizations.push(this.optimizeFonts());
            }
            
            // Optimize resources
            if (this.optimizer.optimizationRules.resourceOptimization) {
                optimizations.push(this.optimizeResources());
            }
            
            console.log(`✅ Performance optimization completed: ${optimizations.filter(Boolean).length} optimizations applied`);
            return optimizations;
        } catch (error) {
            console.error('❌ Error optimizing performance:', error);
            return [];
        }
    }

    optimizeImages() {
        try {
            const images = document.querySelectorAll('img');
            let optimizedCount = 0;
            
            images.forEach(img => {
                // Add loading="lazy" to images without it
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                    optimizedCount++;
                }
                
                // Add decoding="async" for better performance
                if (!img.hasAttribute('decoding')) {
                    img.setAttribute('decoding', 'async');
                    optimizedCount++;
                }
                
                // Optimize srcset for responsive images
                if (img.src && !img.srcset) {
                    this.optimizeImageSrcset(img);
                    optimizedCount++;
                }
            });
            
            console.log(`✅ Optimized ${optimizedCount} images`);
            return optimizedCount > 0;
        } catch (error) {
            console.error('❌ Error optimizing images:', error);
            return false;
        }
    }

    optimizeImageSrcset(img) {
        // Create responsive srcset for images
        const src = img.src;
        const sizes = [320, 640, 960, 1280, 1920];
        
        const srcset = sizes
            .map(size => `${src}?w=${size} ${size}w`)
            .join(', ');
        
        img.srcset = srcset;
        img.sizes = '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 960px) 960px, (max-width: 1280px) 1280px, 1920px';
    }

    optimizeScripts() {
        try {
            const scripts = document.querySelectorAll('script');
            let optimizedCount = 0;
            
            scripts.forEach(script => {
                // Add async/defer attributes for non-critical scripts
                if (!script.hasAttribute('async') && !script.hasAttribute('defer') && !script.hasAttribute('data-critical')) {
                    script.setAttribute('async', '');
                    optimizedCount++;
                }
            });
            
            console.log(`✅ Optimized ${optimizedCount} scripts`);
            return optimizedCount > 0;
        } catch (error) {
            console.error('❌ Error optimizing scripts:', error);
            return false;
        }
    }

    optimizeCSS() {
        try {
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
            let optimizedCount = 0;
            
            stylesheets.forEach(link => {
                // Add media attributes for non-critical CSS
                if (!link.hasAttribute('media') && !link.hasAttribute('data-critical')) {
                    link.setAttribute('media', 'print');
                    link.setAttribute('onload', "this.media='all'");
                    optimizedCount++;
                }
            });
            
            console.log(`✅ Optimized ${optimizedCount} stylesheets`);
            return optimizedCount > 0;
        } catch (error) {
            console.error('❌ Error optimizing CSS:', error);
            return false;
        }
    }

    optimizeFonts() {
        try {
            const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
            let optimizedCount = 0;
            
            fontLinks.forEach(link => {
                // Add font-display: swap for better performance
                if (!link.hasAttribute('font-display')) {
                    link.setAttribute('font-display', 'swap');
                    optimizedCount++;
                }
            });
            
            console.log(`✅ Optimized ${optimizedCount} fonts`);
            return optimizedCount > 0;
        } catch (error) {
            console.error('❌ Error optimizing fonts:', error);
            return false;
        }
    }

    optimizeResources() {
        try {
            // Preload critical resources
            this.preloadCriticalResources();
            
            // Optimize resource loading order
            this.optimizeResourceLoadingOrder();
            
            console.log('✅ Optimized resource loading');
            return true;
        } catch (error) {
            console.error('❌ Error optimizing resources:', error);
            return false;
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            { url: '/assets/css/critical.css', type: 'style' },
            { url: '/assets/js/critical.js', type: 'script' }
        ];
        
        criticalResources.forEach(resource => {
            this.preloadResource(resource.url, resource.type);
        });
    }

    optimizeResourceLoadingOrder() {
        // Move non-critical resources to end of body
        const nonCriticalScripts = document.querySelectorAll('script[data-non-critical]');
        const body = document.body;
        
        nonCriticalScripts.forEach(script => {
            if (script.parentNode !== body) {
                body.appendChild(script);
            }
        });
    }

    preloadResource(url, type) {
        try {
            if (this.resourceManager.loadingResources.has(url)) {
                return false; // Already loading
            }
            
            this.resourceManager.loadingResources.add(url);
            
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            link.as = type;
            
            document.head.appendChild(link);
            
            // Mark as loaded after a delay
            setTimeout(() => {
                this.resourceManager.loadingResources.delete(url);
                this.resourceManager.loadedResources.add(url);
            }, 1000);
            
            return true;
        } catch (error) {
            console.error('❌ Error preloading resource:', error);
            return false;
        }
    }

    loadResource(url, type) {
        return new Promise((resolve, reject) => {
            try {
                if (this.resourceManager.loadedResources.has(url)) {
                    resolve(url);
                    return;
                }
                
                this.resourceManager.loadingResources.add(url);
                
                const element = document.createElement(type === 'script' ? 'script' : 'link');
                
                if (type === 'script') {
                    element.src = url;
                    element.async = true;
                } else {
                    element.rel = 'stylesheet';
                    element.href = url;
                }
                
                element.onload = () => {
                    this.resourceManager.loadingResources.delete(url);
                    this.resourceManager.loadedResources.add(url);
                    resolve(url);
                };
                
                element.onerror = () => {
                    this.resourceManager.loadingResources.delete(url);
                    reject(new Error(`Failed to load resource: ${url}`));
                };
                
                document.head.appendChild(element);
            } catch (error) {
                reject(error);
            }
        });
    }

    getResourceStatus(url) {
        if (this.resourceManager.loadedResources.has(url)) {
            return 'loaded';
        } else if (this.resourceManager.loadingResources.has(url)) {
            return 'loading';
        } else {
            return 'not_loaded';
        }
    }

    monitorPageLoad() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.collectPerformanceMetrics();
        });
        
        // Monitor DOM content loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.metricsCollector.metrics.domContentLoaded = performance.now();
        });
    }

    monitorResourceLoading() {
        // Monitor resource loading performance
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.entryType === 'resource') {
                    this.logResourcePerformance(entry);
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }

    monitorUserInteractions() {
        // Monitor user interaction performance
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.entryType === 'measure') {
                    this.logInteractionPerformance(entry);
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }

    monitorMemoryUsage() {
        // Monitor memory usage if available
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.logMemoryUsage(memory);
            }, 30000); // Every 30 seconds
        }
    }

    startLazyLoading() {
        if (this.performanceConfig.enableLazyLoading) {
            this.enableLazyLoading();
        }
    }

    collectPerformanceMetrics() {
        try {
            // Collect Web Vitals
            this.collectWebVitals();
            
            // Collect custom metrics
            this.collectCustomMetrics();
            
            console.log('✅ Performance metrics collected');
        } catch (error) {
            console.error('❌ Error collecting performance metrics:', error);
        }
    }

    collectWebVitals() {
        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcp = entries[entries.length - 1];
            this.metricsCollector.metrics.firstContentfulPaint = fcp.startTime;
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcp = entries[entries.length - 1];
            this.metricsCollector.metrics.largestContentfulPaint = lcp.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
            let cls = 0;
            list.getEntries().forEach(entry => {
                cls += entry.value;
            });
            this.metricsCollector.metrics.cumulativeLayoutShift = cls;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fid = entries[entries.length - 1];
            this.metricsCollector.metrics.firstInputDelay = fid.processingStart - fid.startTime;
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
    }

    collectCustomMetrics() {
        // Page load time
        this.metricsCollector.metrics.pageLoadTime = performance.now();
        
        // Time to interactive (approximation)
        setTimeout(() => {
            this.metricsCollector.metrics.timeToInteractive = performance.now();
        }, 1000);
    }

    getPerformanceMetrics() {
        return {
            ...this.metricsCollector.metrics,
            cacheStats: this.getCacheStats(),
            lazyLoadedElements: this.lazyLoader.loadedElements.size,
            totalLazyElements: this.lazyLoader.lazyElements.size
        };
    }

    exportPerformanceMetrics() {
        return {
            metrics: this.getPerformanceMetrics(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    }

    logResourcePerformance(entry) {
        console.log(`📊 Resource Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
    }

    logInteractionPerformance(entry) {
        console.log(`📊 Interaction Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
    }

    logMemoryUsage(memory) {
        console.log(`📊 Memory Usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB / ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    }

    calculateSize(value) {
        try {
            const stringValue = JSON.stringify(value);
            return new Blob([stringValue]).size;
        } catch (error) {
            return 0;
        }
    }

    // Public API methods
    enableLazyLoading() {
        return this.enableLazyLoading();
    }

    enableCaching() {
        return this.enableCaching();
    }

    optimizePerformance() {
        return this.optimizePerformance();
    }

    getMetrics() {
        return this.getPerformanceMetrics();
    }

    getCacheStats() {
        return this.getCacheStats();
    }

    preloadResource(url, type) {
        return this.preloadResource(url, type);
    }

    loadResource(url, type) {
        return this.loadResource(url, type);
    }

    monitorMetrics() {
        return this.collectPerformanceMetrics();
    }
}

// Export to global scope
window.Performance = Performance;
console.log('⚡ Performance module loaded'); 