/**
 * Performance Utilities for Operator Uplift
 * Comprehensive performance monitoring, optimization, and memory management
 */

class PerformanceUtils {
  constructor() {
    this.metrics = {
      loadTime: 0,
      memoryUsage: 0,
      eventListeners: 0,
      domNodes: 0,
      networkRequests: 0,
      errors: 0
    };

    this.observers = new Map();
    this.intervals = new Map();
    this.timeouts = new Map();
    this.eventListeners = new Map();
    this.domCache = new Map();

    this.isMonitoring = false;
    this.monitoringInterval = null;

    this.performanceThresholds = {
      loadTime: 3000, // 3 seconds
      memoryUsage: 100 * 1024 * 1024, // 100MB
      eventListeners: 100,
      domNodes: 1000,
      networkRequests: 50
    };
  }

  /**
     * Initialize performance monitoring
     */
  init() {
    if (this.isMonitoring) {return;}

    this.setupPerformanceMonitoring();
    this.setupMemoryMonitoring();
    this.setupDOMMonitoring();
    this.setupNetworkMonitoring();
    this.setupEventListenerTracking();

    this.isMonitoring = true;
    this.startPeriodicMonitoring();

    console.log('Performance monitoring initialized');
  }

  /**
     * Setup performance monitoring
     */
  setupPerformanceMonitoring() {
    // Monitor page load performance
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.metrics.loadTime = entry.loadEventEnd - entry.loadEventStart;
              this.checkPerformanceThreshold('loadTime', this.metrics.loadTime);
            }
          });
        });
        observer.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', observer);
      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // 50ms threshold
              this.logPerformanceIssue('Long task detected', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              });
            }
          });
        });
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', observer);
      } catch (error) {
        console.warn('Long task monitoring setup failed:', error);
      }
    }
  }

  /**
     * Setup memory monitoring
     */
  setupMemoryMonitoring() {
    if ('memory' in performance) {
      const checkMemory = () => {
        const { memory } = performance;
        this.metrics.memoryUsage = memory.usedJSHeapSize;

        this.checkPerformanceThreshold('memoryUsage', this.metrics.memoryUsage);

        // Log memory usage if high
        if (memory.usedJSHeapSize > this.performanceThresholds.memoryUsage) {
          this.logPerformanceIssue('High memory usage', {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          });
        }
      };

      // Check memory every 30 seconds
      const intervalId = setInterval(checkMemory, 30000);
      this.intervals.set('memory', intervalId);
    }
  }

  /**
     * Setup DOM monitoring
     */
  setupDOMMonitoring() {
    if ('MutationObserver' in window) {
      try {
        const observer = new MutationObserver((mutations) => {
          let addedNodes = 0;
          let removedNodes = 0;

          mutations.forEach((mutation) => {
            addedNodes += mutation.addedNodes.length;
            removedNodes += mutation.removedNodes.length;
          });

          // Update DOM node count
          this.metrics.domNodes = document.querySelectorAll('*').length;

          // Log if many nodes were added/removed
          if (addedNodes > 10 || removedNodes > 10) {
            this.logPerformanceIssue('DOM mutation detected', {
              addedNodes,
              removedNodes,
              totalNodes: this.metrics.domNodes
            });
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        this.observers.set('dom', observer);
      } catch (error) {
        console.warn('DOM monitoring setup failed:', error);
      }
    }
  }

  /**
     * Setup network monitoring
     */
  setupNetworkMonitoring() {
    // Override fetch to monitor network requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      this.metrics.networkRequests++;

      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;

        // Log slow requests
        if (duration > 5000) { // 5 seconds
          this.logPerformanceIssue('Slow network request', {
            url: args[0],
            duration,
            status: response.status
          });
        }

        return response;
      } catch (error) {
        this.metrics.errors++;
        this.logPerformanceIssue('Network request failed', {
          url: args[0],
          error: error.message
        });
        throw error;
      }
    };
  }

  /**
     * Setup event listener tracking
     */
  setupEventListenerTracking() {
    // Override addEventListener to track listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      const key = `${this.id || this.tagName || 'anonymous'}-${type}`;
      const count = performanceUtils.eventListeners.get(key) || 0;
      performanceUtils.eventListeners.set(key, count + 1);
      performanceUtils.metrics.eventListeners++;

      return originalAddEventListener.call(this, type, listener, options);
    };

    // Override removeEventListener
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
      const key = `${this.id || this.tagName || 'anonymous'}-${type}`;
      const count = performanceUtils.eventListeners.get(key) || 0;
      if (count > 0) {
        performanceUtils.eventListeners.set(key, count - 1);
        performanceUtils.metrics.eventListeners--;
      }

      return originalRemoveEventListener.call(this, type, listener, options);
    };
  }

  /**
     * Start periodic monitoring
     */
  startPeriodicMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.checkPerformanceThresholds();
    }, 10000); // Check every 10 seconds
  }

  /**
     * Collect current metrics
     */
  collectMetrics() {
    // Update DOM node count
    this.metrics.domNodes = document.querySelectorAll('*').length;

    // Update memory usage if available
    if ('memory' in performance) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
    }

    // Update load time if not set
    if (this.metrics.loadTime === 0 && performance.timing) {
      this.metrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    }
  }

  /**
     * Check performance thresholds
     */
  checkPerformanceThresholds() {
    Object.entries(this.performanceThresholds).forEach(([metric, threshold]) => {
      this.checkPerformanceThreshold(metric, this.metrics[metric]);
    });
  }

  /**
     * Check specific performance threshold
     * @param {string} metric - Metric name
     * @param {number} value - Current value
     */
  checkPerformanceThreshold(metric, value) {
    const threshold = this.performanceThresholds[metric];
    if (value > threshold) {
      this.logPerformanceIssue(`${metric} exceeded threshold`, {
        metric,
        value,
        threshold
      });
    }
  }

  /**
     * Log performance issue
     * @param {string} message - Issue message
     * @param {object} data - Issue data
     */
  logPerformanceIssue(message, data = {}) {
    const issue = {
      timestamp: new Date().toISOString(),
      message,
      data,
      metrics: { ...this.metrics }
    };

    // Log to console
    console.warn('Performance Issue:', issue);

    // Store in localStorage
    this.storePerformanceIssue(issue);
  }

  /**
     * Store performance issue
     * @param {object} issue - Performance issue
     */
  storePerformanceIssue(issue) {
    try {
      const issues = JSON.parse(localStorage.getItem('performance_issues') || '[]');
      issues.push(issue);

      // Keep only last 50 issues
      if (issues.length > 50) {
        issues.splice(0, issues.length - 50);
      }

      localStorage.setItem('performance_issues', JSON.stringify(issues));
    } catch (error) {
      console.warn('Failed to store performance issue:', error);
    }
  }

  /**
     * DOM caching utility
     */
  cacheDOM(selector, context = document) {
    const key = `${selector}_${context === document ? 'doc' : 'ctx'}`;

    if (!this.domCache.has(key)) {
      const element = context.querySelector(selector);
      this.domCache.set(key, element);
    }

    return this.domCache.get(key);
  }

  /**
     * Clear DOM cache
     */
  clearDOMCache() {
    this.domCache.clear();
  }

  /**
     * Safe setTimeout with cleanup
     * @param {Function} callback - Callback function
     * @param {number} delay - Delay in milliseconds
     * @param {string} id - Unique identifier
     * @returns {number} Timeout ID
     */
  safeSetTimeout(callback, delay, id = null) {
    const timeoutId = setTimeout(callback, delay);

    if (id) {
      this.timeouts.set(id, timeoutId);
    }

    return timeoutId;
  }

  /**
     * Safe setInterval with cleanup
     * @param {Function} callback - Callback function
     * @param {number} delay - Delay in milliseconds
     * @param {string} id - Unique identifier
     * @returns {number} Interval ID
     */
  safeSetInterval(callback, delay, id = null) {
    const intervalId = setInterval(callback, delay);

    if (id) {
      this.intervals.set(id, intervalId);
    }

    return intervalId;
  }

  /**
     * Clear timeout by ID
     * @param {string} id - Timeout identifier
     */
  clearTimeoutById(id) {
    const timeoutId = this.timeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(id);
    }
  }

  /**
     * Clear interval by ID
     * @param {string} id - Interval identifier
     */
  clearIntervalById(id) {
    const intervalId = this.intervals.get(id);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(id);
    }
  }

  /**
     * Safe addEventListener with cleanup tracking
     * @param {Element} element - DOM element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {object} options - Event options
     * @returns {Function} Cleanup function
     */
  safeAddEventListener(element, event, handler, options = {}) {
    if (!element || !element.addEventListener) {
      console.warn('Invalid element for event listener');
      return () => {};
    }

    const wrappedHandler = (e) => {
      try {
        handler(e);
      } catch (error) {
        this.logPerformanceIssue('Event handler error', {
          event,
          error: error.message,
          element: element.tagName
        });
      }
    };

    element.addEventListener(event, wrappedHandler, options);

    const key = `${element.id || 'anonymous'}-${event}`;
    const cleanup = () => {
      element.removeEventListener(event, wrappedHandler, options);
      const count = this.eventListeners.get(key) || 0;
      if (count > 0) {
        this.eventListeners.set(key, count - 1);
        this.metrics.eventListeners--;
      }
    };

    // Track listener
    const count = this.eventListeners.get(key) || 0;
    this.eventListeners.set(key, count + 1);
    this.metrics.eventListeners++;

    return cleanup;
  }

  /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
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
  }

  /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
     * Get current metrics
     * @returns {object} Current performance metrics
     */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
     * Get performance report
     * @returns {object} Comprehensive performance report
     */
  getPerformanceReport() {
    return {
      metrics: this.getMetrics(),
      thresholds: this.performanceThresholds,
      eventListeners: Object.fromEntries(this.eventListeners),
      issues: this.getPerformanceIssues(),
      recommendations: this.getRecommendations()
    };
  }

  /**
     * Get performance issues
     * @returns {Array} Performance issues
     */
  getPerformanceIssues() {
    try {
      return JSON.parse(localStorage.getItem('performance_issues') || '[]');
    } catch (error) {
      return [];
    }
  }

  /**
     * Get performance recommendations
     * @returns {Array} Performance recommendations
     */
  getRecommendations() {
    const recommendations = [];

    if (this.metrics.loadTime > this.performanceThresholds.loadTime) {
      recommendations.push('Consider optimizing page load time by reducing bundle size or implementing lazy loading');
    }

    if (this.metrics.memoryUsage > this.performanceThresholds.memoryUsage) {
      recommendations.push('High memory usage detected. Consider implementing memory cleanup and avoiding memory leaks');
    }

    if (this.metrics.eventListeners > this.performanceThresholds.eventListeners) {
      recommendations.push('Too many event listeners detected. Consider using event delegation or removing unused listeners');
    }

    if (this.metrics.domNodes > this.performanceThresholds.domNodes) {
      recommendations.push('Large DOM tree detected. Consider virtualizing long lists or reducing DOM complexity');
    }

    return recommendations;
  }

  /**
     * Cleanup all resources
     */
  cleanup() {
    // Clear all intervals
    this.intervals.forEach((intervalId) => clearInterval(intervalId));
    this.intervals.clear();

    // Clear all timeouts
    this.timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timeouts.clear();

    // Disconnect all observers
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();

    // Clear monitoring interval
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    // Clear caches
    this.domCache.clear();
    this.eventListeners.clear();

    this.isMonitoring = false;
    console.log('Performance monitoring cleaned up');
  }
}

// Create global instance
const performanceUtils = new PerformanceUtils();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PerformanceUtils, performanceUtils };
} else if (typeof window !== 'undefined') {
  window.PerformanceUtils = PerformanceUtils;
  window.performanceUtils = performanceUtils;
}
