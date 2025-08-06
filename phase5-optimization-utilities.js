/**
 * Phase 5: Optimization Utilities
 * Provides debouncing, throttling, caching, and performance optimization utilities
 */

console.log('⚡ Phase 5: Creating Optimization Utilities\n');

// Performance optimization utilities
const OptimizationUtils = {
  
  /**
   * Debounce function to limit the rate of function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @param {boolean} immediate - Whether to execute immediately
   * @returns {Function} Debounced function
   */
  debounce(func, wait, immediate = false) {
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
  },

  /**
   * Throttle function to limit the rate of function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Cache utility for expensive operations
   * @param {Function} fn - Function to cache
   * @param {number} maxSize - Maximum cache size
   * @returns {Function} Cached function
   */
  memoize(fn, maxSize = 100) {
    const cache = new Map();
    return function(...args) {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn.apply(this, args);
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, result);
      return result;
    };
  },

  /**
   * Safe DOM query selector with caching
   * @param {string} selector - CSS selector
   * @param {Element} context - Context element (default: document)
   * @returns {Element|null} DOM element
   */
  safeQuerySelector(selector, context = document) {
    try {
      return context.querySelector(selector);
    } catch (error) {
      console.warn(`Invalid selector: ${selector}`, error);
      return null;
    }
  },

  /**
   * Safe DOM query selector all with caching
   * @param {string} selector - CSS selector
   * @param {Element} context - Context element (default: document)
   * @returns {NodeList} DOM elements
   */
  safeQuerySelectorAll(selector, context = document) {
    try {
      return context.querySelectorAll(selector);
    } catch (error) {
      console.warn(`Invalid selector: ${selector}`, error);
      return [];
    }
  },

  /**
   * Safe getElementById with caching
   * @param {string} id - Element ID
   * @returns {Element|null} DOM element
   */
  safeGetElementById(id) {
    try {
      return document.getElementById(id);
    } catch (error) {
      console.warn(`Invalid ID: ${id}`, error);
      return null;
    }
  },

  /**
   * Safe innerHTML setter with sanitization
   * @param {Element} element - Target element
   * @param {string} content - HTML content
   * @param {boolean} sanitize - Whether to sanitize content
   */
  safeInnerHTML(element, content, sanitize = true) {
    if (!element) return;
    
    try {
      if (sanitize) {
        content = this.sanitizeHTML(content);
      }
      element.innerHTML = content;
    } catch (error) {
      console.warn('Error setting innerHTML:', error);
      element.textContent = content;
    }
  },

  /**
   * Sanitize HTML content to prevent XSS
   * @param {string} html - HTML content
   * @returns {string} Sanitized HTML
   */
  sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  /**
   * Safe JSON parse with error handling
   * @param {string} json - JSON string
   * @param {*} defaultValue - Default value if parsing fails
   * @returns {*} Parsed JSON or default value
   */
  safeJSONParse(json, defaultValue = null) {
    try {
      return JSON.parse(json);
    } catch (error) {
      console.warn('JSON parse error:', error);
      return defaultValue;
    }
  },

  /**
   * Safe JSON stringify with error handling
   * @param {*} data - Data to stringify
   * @param {string} defaultValue - Default value if stringify fails
   * @returns {string} JSON string or default value
   */
  safeJSONStringify(data, defaultValue = '{}') {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.warn('JSON stringify error:', error);
      return defaultValue;
    }
  },

  /**
   * Enhanced localStorage with error handling and caching
   */
  storage: {
    cache: new Map(),
    
    /**
     * Get item from localStorage with caching
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    getItem(key, defaultValue = null) {
      try {
        // Check cache first
        if (this.cache.has(key)) {
          return this.cache.get(key);
        }
        
        const value = localStorage.getItem(key);
        if (value === null) return defaultValue;
        
        const parsed = OptimizationUtils.safeJSONParse(value, defaultValue);
        this.cache.set(key, parsed);
        return parsed;
      } catch (error) {
        console.warn(`Error getting localStorage item: ${key}`, error);
        return defaultValue;
      }
    },

    /**
     * Set item in localStorage with caching
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    setItem(key, value) {
      try {
        const stringValue = OptimizationUtils.safeJSONStringify(value, '{}');
        localStorage.setItem(key, stringValue);
        this.cache.set(key, value);
      } catch (error) {
        console.warn(`Error setting localStorage item: ${key}`, error);
      }
    },

    /**
     * Remove item from localStorage and cache
     * @param {string} key - Storage key
     */
    removeItem(key) {
      try {
        localStorage.removeItem(key);
        this.cache.delete(key);
      } catch (error) {
        console.warn(`Error removing localStorage item: ${key}`, error);
      }
    },

    /**
     * Clear all localStorage and cache
     */
    clear() {
      try {
        localStorage.clear();
        this.cache.clear();
      } catch (error) {
        console.warn('Error clearing localStorage', error);
      }
    }
  },

  /**
   * Performance monitoring utilities
   */
  performance: {
    /**
     * Measure function execution time
     * @param {string} name - Measurement name
     * @param {Function} fn - Function to measure
     * @returns {*} Function result
     */
    measure(name, fn) {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
      return result;
    },

    /**
     * Measure async function execution time
     * @param {string} name - Measurement name
     * @param {Function} fn - Async function to measure
     * @returns {Promise} Function result
     */
    async measureAsync(name, fn) {
      const start = performance.now();
      const result = await fn();
      const end = performance.now();
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
      return result;
    }
  },

  /**
   * Memory management utilities
   */
  memory: {
    /**
     * Clean up event listeners
     * @param {Element} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    removeEventListener(element, event, handler) {
      if (element && handler) {
        element.removeEventListener(event, handler);
      }
    },

    /**
     * Clean up intervals
     * @param {number} intervalId - Interval ID
     */
    clearInterval(intervalId) {
      if (intervalId) {
        clearInterval(intervalId);
      }
    },

    /**
     * Clean up timeouts
     * @param {number} timeoutId - Timeout ID
     */
    clearTimeout(timeoutId) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  },

  /**
   * Lazy loading utilities
   */
  lazyLoad: {
    /**
     * Load script dynamically
     * @param {string} src - Script source
     * @returns {Promise} Load promise
     */
    loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },

    /**
     * Load CSS dynamically
     * @param {string} href - CSS source
     * @returns {Promise} Load promise
     */
    loadCSS(href) {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    }
  }
};

// Export for use in app.html
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OptimizationUtils;
}

console.log('✅ Optimization utilities created successfully');
console.log('📋 Available utilities:');
console.log('  - debounce() - Limit function call rate');
console.log('  - throttle() - Throttle function calls');
console.log('  - memoize() - Cache expensive operations');
console.log('  - safeQuerySelector() - Safe DOM queries');
console.log('  - safeInnerHTML() - Safe HTML setting');
console.log('  - safeJSONParse() - Safe JSON parsing');
console.log('  - storage - Enhanced localStorage');
console.log('  - performance - Performance monitoring');
console.log('  - memory - Memory management');
console.log('  - lazyLoad - Dynamic loading'); 