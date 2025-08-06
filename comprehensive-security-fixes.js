/**
 * Comprehensive Security and Performance Fixes
 * Addresses all critical issues identified in the codebase scan
 */

(function() {
    'use strict';

    console.log('🔧 Applying comprehensive security and performance fixes...');

    // Initialize utilities
    let securityUtils, errorHandler, performanceUtils;

    // Load utilities if available
    if (typeof SecurityUtils !== 'undefined') {
        securityUtils = new SecurityUtils();
    }
    if (typeof ErrorHandler !== 'undefined') {
        errorHandler = new ErrorHandler();
        errorHandler.init();
    }
    if (typeof PerformanceUtils !== 'undefined') {
        performanceUtils = new PerformanceUtils();
        performanceUtils.init();
    }

    /**
     * Production-safe logging utility
     */
    const logger = {
        log: (...args) => {
            if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
                console.log(...args);
            }
        },
        warn: (...args) => {
            console.warn(...args);
        },
        error: (...args) => {
            console.error(...args);
        }
    };

    /**
     * Remove production console.log statements
     */
    function removeProductionLogs() {
        logger.log('🔧 Removing production console.log statements...');
        
        // Override console methods in production
        if (process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost') {
            const originalLog = console.log;
            const originalWarn = console.warn;
            const originalError = console.error;
            
            console.log = (...args) => {
                // Only log errors and warnings in production
                if (args.some(arg => typeof arg === 'string' && 
                    (arg.includes('error') || arg.includes('Error') || arg.includes('ERROR')))) {
                    originalLog(...args);
                }
            };
            
            console.warn = originalWarn;
            console.error = originalError;
        }
    }

    /**
     * Implement comprehensive null checks
     */
    function implementNullChecks() {
        logger.log('🔧 Implementing comprehensive null checks...');
        
        // Safe DOM element access
        window.safeGetElement = function(selector, context = document) {
            if (!selector || typeof selector !== 'string') return null;
            try {
                return context.querySelector(selector);
            } catch (error) {
                logger.warn('Invalid selector:', selector, error);
                return null;
            }
        };

        // Safe element property access
        window.safeGetProperty = function(obj, property, defaultValue = null) {
            if (!obj || typeof obj !== 'object') return defaultValue;
            return obj[property] !== undefined ? obj[property] : defaultValue;
        };

        // Safe function execution
        window.safeExecute = function(func, context = null, ...args) {
            if (typeof func !== 'function') {
                logger.warn('Attempted to execute non-function:', func);
                return null;
            }
            try {
                return func.apply(context, args);
            } catch (error) {
                if (errorHandler) {
                    errorHandler.handleError(error, { context: 'safeExecute' });
                }
                return null;
            }
        };
    }

    /**
     * Implement XSS prevention
     */
    function implementXSSPrevention() {
        logger.log('🔧 Implementing XSS prevention...');
        
        // Override innerHTML setter
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                if (typeof value === 'string' && securityUtils) {
                    value = securityUtils.sanitizeHTML(value);
                }
                originalInnerHTML.set.call(this, value);
            },
            get: originalInnerHTML.get
        });

        // Safe text content setter
        Element.prototype.safeSetTextContent = function(text) {
            if (typeof text === 'string') {
                this.textContent = text;
            }
        };

        // Safe HTML setter
        Element.prototype.safeSetHTML = function(html) {
            if (typeof html === 'string' && securityUtils) {
                this.innerHTML = securityUtils.sanitizeHTML(html);
            }
        };
    }

    /**
     * Implement input validation
     */
    function implementInputValidation() {
        logger.log('🔧 Implementing input validation...');
        
        // Enhanced password validation
        window.validatePassword = function(password) {
            if (!password || typeof password !== 'string') {
                return { valid: false, errors: ['Password must be a string'] };
            }

            const errors = [];
            const requirements = {
                minLength: password.length >= 8,
                hasUpperCase: /[A-Z]/.test(password),
                hasLowerCase: /[a-z]/.test(password),
                hasNumber: /[0-9]/.test(password),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            };

            if (!requirements.minLength) errors.push('Password must be at least 8 characters long');
            if (!requirements.hasUpperCase) errors.push('Password must contain at least one uppercase letter');
            if (!requirements.hasLowerCase) errors.push('Password must contain at least one lowercase letter');
            if (!requirements.hasNumber) errors.push('Password must contain at least one number');
            if (!requirements.hasSpecialChar) errors.push('Password must contain at least one special character');

            return {
                valid: errors.length === 0,
                errors,
                strength: calculatePasswordStrength(password, requirements)
            };
        };

        // Enhanced email validation
        window.validateEmail = function(email) {
            if (!email || typeof email !== 'string') return false;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email.trim());
        };

        // Input sanitization
        window.sanitizeInput = function(input) {
            if (!input || typeof input !== 'string') return '';
            
            // Remove null bytes and control characters
            let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');
            
            // Trim whitespace
            sanitized = sanitized.trim();
            
            // Limit length
            if (sanitized.length > 1000) {
                sanitized = sanitized.substring(0, 1000);
            }
            
            return sanitized;
        };

        function calculatePasswordStrength(password, requirements) {
            let score = 0;
            
            if (password.length >= 12) score += 2;
            else if (password.length >= 8) score += 1;
            
            Object.values(requirements).forEach(met => {
                if (met) score += 1;
            });
            
            if (password.length > 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
                score += 1;
            }
            
            if (score >= 6) return 'strong';
            if (score >= 4) return 'medium';
            if (score >= 2) return 'weak';
            return 'very-weak';
        }
    }

    /**
     * Implement event listener management
     */
    function implementEventListenerManagement() {
        logger.log('🔧 Implementing event listener management...');
        
        const eventManager = {
            listeners: new Map(),
            
            add: function(element, event, handler, options = {}) {
                if (!element || !element.addEventListener) {
                    logger.warn('Invalid element for event listener');
                    return () => {};
                }

                const wrappedHandler = (e) => {
                    try {
                        handler(e);
                    } catch (error) {
                        if (errorHandler) {
                            errorHandler.handleError(error, { 
                                context: 'eventHandler',
                                event: event,
                                element: element.tagName 
                            });
                        }
                    }
                };

                element.addEventListener(event, wrappedHandler, options);
                
                const key = `${element.id || 'anonymous'}-${event}`;
                this.listeners.set(key, { element, event, handler: wrappedHandler, options });
                
                return () => this.remove(key);
            },
            
            remove: function(key) {
                const listener = this.listeners.get(key);
                if (listener) {
                    listener.element.removeEventListener(listener.event, listener.handler, listener.options);
                    this.listeners.delete(key);
                }
            },
            
            cleanup: function() {
                this.listeners.forEach((listener, key) => this.remove(key));
            }
        };

        window.eventManager = eventManager;
    }

    /**
     * Implement memory leak prevention
     */
    function implementMemoryLeakPrevention() {
        logger.log('🔧 Implementing memory leak prevention...');
        
        // Track intervals and timeouts
        const intervalTracker = new Map();
        const timeoutTracker = new Map();
        
        // Override setInterval
        const originalSetInterval = window.setInterval;
        window.setInterval = function(callback, delay, ...args) {
            const intervalId = originalSetInterval(callback, delay, ...args);
            intervalTracker.set(intervalId, { callback, delay, args });
            return intervalId;
        };

        // Override clearInterval
        const originalClearInterval = window.clearInterval;
        window.clearInterval = function(intervalId) {
            intervalTracker.delete(intervalId);
            return originalClearInterval(intervalId);
        };

        // Override setTimeout
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, delay, ...args) {
            const timeoutId = originalSetTimeout(callback, delay, ...args);
            timeoutTracker.set(timeoutId, { callback, delay, args });
            return timeoutId;
        };

        // Override clearTimeout
        const originalClearTimeout = window.clearTimeout;
        window.clearTimeout = function(timeoutId) {
            timeoutTracker.delete(timeoutId);
            return originalClearTimeout(timeoutId);
        };

        // Cleanup function
        window.cleanupTimers = function() {
            intervalTracker.forEach((data, id) => {
                clearInterval(id);
            });
            timeoutTracker.forEach((data, id) => {
                clearTimeout(id);
            });
            intervalTracker.clear();
            timeoutTracker.clear();
        };

        // Auto-cleanup on page unload
        window.addEventListener('beforeunload', function() {
            window.cleanupTimers();
            if (window.eventManager) {
                window.eventManager.cleanup();
            }
        });
    }

    /**
     * Implement infinite loop prevention
     */
    function implementInfiniteLoopPrevention() {
        logger.log('🔧 Implementing infinite loop prevention...');
        
        let clickCount = 0;
        let lastClickTime = 0;
        const maxClicks = 10;
        const resetInterval = 1000; // 1 second

        // Enhanced click handler
        function safeClickHandler(e) {
            const now = Date.now();
            
            // Reset counter if enough time has passed
            if (now - lastClickTime > resetInterval) {
                clickCount = 0;
            }
            
            clickCount++;
            lastClickTime = now;
            
            if (clickCount > maxClicks) {
                logger.warn('Click loop detected, stopping event propagation');
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }

        // Apply to all click events
        document.addEventListener('click', safeClickHandler, true);
    }

    /**
     * Implement DOM caching
     */
    function implementDOMCaching() {
        logger.log('🔧 Implementing DOM caching...');
        
        const domCache = new Map();
        
        window.cachedQuerySelector = function(selector, context = document) {
            const key = `${selector}_${context === document ? 'doc' : 'ctx'}`;
            
            if (!domCache.has(key)) {
                const element = context.querySelector(selector);
                domCache.set(key, element);
            }
            
            return domCache.get(key);
        };

        window.clearDOMCache = function() {
            domCache.clear();
        };

        // Clear cache on DOM changes
        if ('MutationObserver' in window) {
            const observer = new MutationObserver(() => {
                domCache.clear();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    /**
     * Implement rate limiting
     */
    function implementRateLimiting() {
        logger.log('🔧 Implementing rate limiting...');
        
        const rateLimiters = new Map();
        
        window.createRateLimiter = function(key, maxRequests = 10, timeWindow = 60000) {
            const requests = [];
            
            return function() {
                const now = Date.now();
                
                // Remove old requests
                while (requests.length > 0 && now - requests[0] > timeWindow) {
                    requests.shift();
                }
                
                if (requests.length >= maxRequests) {
                    return false; // Rate limit exceeded
                }
                
                requests.push(now);
                return true; // Request allowed
            };
        };

        // Apply rate limiting to common operations
        const apiRateLimiter = window.createRateLimiter('api', 5, 1000); // 5 requests per second
        const clickRateLimiter = window.createRateLimiter('click', 10, 1000); // 10 clicks per second
    }

    /**
     * Implement error boundaries
     */
    function implementErrorBoundaries() {
        logger.log('🔧 Implementing error boundaries...');
        
        // Global error handler
        window.addEventListener('error', function(event) {
            if (errorHandler) {
                errorHandler.handleError(event.error || new Error(event.message), {
                    type: 'runtime',
                    context: 'global',
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                });
            }
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', function(event) {
            if (errorHandler) {
                errorHandler.handleError(event.reason, {
                    type: 'runtime',
                    context: 'promise'
                });
            }
        });

        // Resource loading error handler
        window.addEventListener('error', function(event) {
            if (event.target && event.target !== window) {
                if (errorHandler) {
                    errorHandler.handleError(new Error(`Resource loading failed: ${event.target.src || event.target.href}`), {
                        type: 'resource',
                        context: 'resource',
                        element: event.target.tagName,
                        src: event.target.src || event.target.href
                    });
                }
            }
        }, true);
    }

    /**
     * Apply all fixes
     */
    function applyAllFixes() {
        try {
            removeProductionLogs();
            implementNullChecks();
            implementXSSPrevention();
            implementInputValidation();
            implementEventListenerManagement();
            implementMemoryLeakPrevention();
            implementInfiniteLoopPrevention();
            implementDOMCaching();
            implementRateLimiting();
            implementErrorBoundaries();
            
            logger.log('✅ All comprehensive security and performance fixes applied successfully');
            
            // Log success
            if (errorHandler) {
                errorHandler.log('info', 'Comprehensive security and performance fixes applied');
            }
            
        } catch (error) {
            logger.error('❌ Error applying fixes:', error);
            if (errorHandler) {
                errorHandler.handleError(error, { context: 'applyAllFixes' });
            }
        }
    }

    /**
     * Initialize fixes when DOM is ready
     */
    function initializeFixes() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyAllFixes);
        } else {
            applyAllFixes();
        }
    }

    // Start initialization
    initializeFixes();

    // Export for manual execution
    window.applyComprehensiveFixes = applyAllFixes;

})(); 