/**
 * Performance Utilities for optimization and resource management
 * Provides debouncing, throttling, lazy loading, and performance monitoring
 * 
 * @author Operator Uplift Team
 * @version 1.0.0
 * @since 2025-01-28
 */

class PerformanceUtils {
    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Whether to execute immediately
     * @returns {Function} Debounced function
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Lazy load images
     * @param {string} selector - Image selector
     * @param {Object} options - Loading options
     */
    static lazyLoadImages(selector = 'img[data-src]', options = {}) {
        const defaultOptions = {
            rootMargin: '50px',
            threshold: 0.1,
            ...options
        };

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, defaultOptions);

        document.querySelectorAll(selector).forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * Lazy load components
     * @param {string} selector - Component selector
     * @param {Function} loader - Component loader function
     * @param {Object} options - Loading options
     */
    static lazyLoadComponents(selector, loader, options = {}) {
        const defaultOptions = {
            rootMargin: '100px',
            threshold: 0.1,
            ...options
        };

        const componentObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    loader(element);
                    observer.unobserve(element);
                }
            });
        }, defaultOptions);

        document.querySelectorAll(selector).forEach(element => {
            componentObserver.observe(element);
        });
    }

    /**
     * Preload critical resources
     * @param {Array} resources - Array of resource URLs
     */
    static preloadResources(resources = []) {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.url;
            link.as = resource.type || 'script';
            
            if (resource.crossOrigin) {
                link.crossOrigin = resource.crossOrigin;
            }
            
            document.head.appendChild(link);
        });
    }

    /**
     * Prefetch non-critical resources
     * @param {Array} resources - Array of resource URLs
     */
    static prefetchResources(resources = []) {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource.url;
            
            if (resource.crossOrigin) {
                link.crossOrigin = resource.crossOrigin;
            }
            
            document.head.appendChild(link);
        });
    }

    /**
     * Measure function execution time
     * @param {Function} func - Function to measure
     * @param {string} name - Measurement name
     * @returns {Function} Wrapped function
     */
    static measureTime(func, name = 'Function') {
        return function(...args) {
            const start = performance.now();
            const result = func.apply(this, args);
            const end = performance.now();
            
            console.log(`${name} execution time: ${(end - start).toFixed(2)}ms`);
            return result;
        };
    }

    /**
     * Async measure function execution time
     * @param {Function} func - Async function to measure
     * @param {string} name - Measurement name
     * @returns {Function} Wrapped async function
     */
    static measureAsyncTime(func, name = 'Async Function') {
        return async function(...args) {
            const start = performance.now();
            const result = await func.apply(this, args);
            const end = performance.now();
            
            console.log(`${name} execution time: ${(end - start).toFixed(2)}ms`);
            return result;
        };
    }

    /**
     * Monitor memory usage
     * @returns {Object} Memory usage information
     */
    static getMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            return {
                used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
                total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
                limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100,
                percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
            };
        }
        return null;
    }

    /**
     * Monitor performance metrics
     * @returns {Object} Performance metrics
     */
    static getPerformanceMetrics() {
        const metrics = {};
        
        // Navigation Timing API
        if ('navigation' in performance) {
            const nav = performance.getEntriesByType('navigation')[0];
            if (nav) {
                metrics.DOMContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
                metrics.loadComplete = nav.loadEventEnd - nav.loadEventStart;
                metrics.domInteractive = nav.domInteractive - nav.fetchStart;
                metrics.firstPaint = nav.responseEnd - nav.fetchStart;
            }
        }
        
        // Paint Timing API
        if ('PerformancePaintTiming' in window) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                metrics[entry.name] = entry.startTime;
            });
        }
        
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                metrics.LCP = lastEntry.startTime;
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
        
        return metrics;
    }

    /**
     * Optimize images
     * @param {string} selector - Image selector
     * @param {Object} options - Optimization options
     */
    static optimizeImages(selector = 'img', options = {}) {
        const defaultOptions = {
            quality: 0.8,
            format: 'webp',
            ...options
        };

        document.querySelectorAll(selector).forEach(img => {
            // Add loading="lazy" if not present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding="async" if not present
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            
            // Add alt attribute if missing
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', '');
            }
        });
    }

    /**
     * Optimize CSS delivery
     * @param {Array} criticalCSS - Critical CSS selectors
     */
    static optimizeCSSDelivery(criticalCSS = []) {
        // Inline critical CSS
        const criticalStyles = document.createElement('style');
        criticalStyles.textContent = criticalCSS.join('\n');
        document.head.insertBefore(criticalStyles, document.head.firstChild);
        
        // Defer non-critical CSS
        const nonCriticalLinks = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        nonCriticalLinks.forEach(link => {
            link.setAttribute('media', 'print');
            link.setAttribute('onload', "this.media='all'");
        });
    }

    /**
     * Optimize JavaScript loading
     * @param {Array} scripts - Script URLs to optimize
     */
    static optimizeScriptLoading(scripts = []) {
        scripts.forEach(script => {
            const scriptElement = document.createElement('script');
            scriptElement.src = script.url;
            scriptElement.async = script.async !== false;
            scriptElement.defer = script.defer || false;
            
            if (script.crossOrigin) {
                scriptElement.crossOrigin = script.crossOrigin;
            }
            
            document.head.appendChild(scriptElement);
        });
    }

    /**
     * Cache DOM queries
     * @param {Object} selectors - Object with selector names and queries
     * @returns {Object} Cached DOM elements
     */
    static cacheDOMQueries(selectors = {}) {
        const cache = {};
        
        Object.entries(selectors).forEach(([name, selector]) => {
            cache[name] = document.querySelector(selector);
        });
        
        return cache;
    }

    /**
     * Batch DOM updates
     * @param {Array} updates - Array of update functions
     */
    static batchDOMUpdates(updates = []) {
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            updates.forEach(update => {
                if (typeof update === 'function') {
                    update();
                }
            });
        });
    }

    /**
     * Virtual scrolling for large lists
     * @param {HTMLElement} container - Container element
     * @param {Array} items - Array of items
     * @param {Object} options - Virtual scrolling options
     */
    static virtualScroll(container, items, options = {}) {
        const defaultOptions = {
            itemHeight: 50,
            visibleItems: 10,
            ...options
        };

        let startIndex = 0;
        let endIndex = defaultOptions.visibleItems;

        const updateVisibleItems = () => {
            const scrollTop = container.scrollTop;
            startIndex = Math.floor(scrollTop / defaultOptions.itemHeight);
            endIndex = Math.min(startIndex + defaultOptions.visibleItems, items.length);

            // Clear container
            container.innerHTML = '';

            // Add visible items
            for (let i = startIndex; i < endIndex; i++) {
                const item = items[i];
                const itemElement = document.createElement('div');
                itemElement.style.height = `${defaultOptions.itemHeight}px`;
                itemElement.textContent = item;
                container.appendChild(itemElement);
            }

            // Set container height
            container.style.height = `${items.length * defaultOptions.itemHeight}px`;
        };

        container.addEventListener('scroll', this.throttle(updateVisibleItems, 16));
        updateVisibleItems();
    }

    /**
     * Optimize animations
     * @param {Array} elements - Elements to optimize
     */
    static optimizeAnimations(elements = []) {
        elements.forEach(element => {
            // Use transform and opacity for better performance
            element.style.willChange = 'transform, opacity';
            
            // Use hardware acceleration
            element.style.transform = 'translateZ(0)';
        });
    }

    /**
     * Monitor frame rate
     * @param {Function} callback - Callback function for FPS updates
     * @returns {Function} Stop monitoring function
     */
    static monitorFrameRate(callback) {
        let frameCount = 0;
        let lastTime = performance.now();
        let animationId;

        const countFrames = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                callback(fps);
                frameCount = 0;
                lastTime = currentTime;
            }
            
            animationId = requestAnimationFrame(countFrames);
        };

        animationId = requestAnimationFrame(countFrames);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }

    /**
     * Optimize event listeners
     * @param {HTMLElement} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    static optimizeEventListener(element, event, handler, options = {}) {
        const defaultOptions = {
            passive: true,
            ...options
        };

        element.addEventListener(event, handler, defaultOptions);
    }

    /**
     * Debounced scroll handler
     * @param {Function} handler - Scroll handler function
     * @param {number} delay - Debounce delay
     * @returns {Function} Debounced scroll handler
     */
    static debouncedScroll(handler, delay = 16) {
        return this.debounce(handler, delay);
    }

    /**
     * Throttled resize handler
     * @param {Function} handler - Resize handler function
     * @param {number} delay - Throttle delay
     * @returns {Function} Throttled resize handler
     */
    static throttledResize(handler, delay = 100) {
        return this.throttle(handler, delay);
    }

    /**
     * Optimize network requests
     * @param {string} url - Request URL
     * @param {Object} options - Request options
     * @returns {Promise} Optimized request
     */
    static optimizedRequest(url, options = {}) {
        const defaultOptions = {
            cache: 'default',
            ...options
        };

        return fetch(url, defaultOptions);
    }

    /**
     * Preload critical data
     * @param {Array} dataUrls - Array of data URLs to preload
     */
    static preloadData(dataUrls = []) {
        dataUrls.forEach(url => {
            fetch(url, { cache: 'force-cache' });
        });
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceUtils;
} else if (typeof window !== 'undefined') {
    window.PerformanceUtils = PerformanceUtils;
}

export default PerformanceUtils; 