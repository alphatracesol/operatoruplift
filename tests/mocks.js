/**
 * Mock implementations for functions defined in app.html
 * Used for testing Phase 1 enhancements
 */

// Mock DOMUtils functions
export const DOMUtils = {
    getById: jest.fn((id) => {
        if (!id || typeof id !== 'string') return null;
        return document.getElementById(id);
    }),
    query: jest.fn((selector, parent = document) => {
        if (!selector || typeof selector !== 'string') return null;
        try {
            return parent.querySelector(selector);
        } catch (error) {
            return null;
        }
    }),
    queryAll: jest.fn((selector, parent = document) => {
        if (!selector || typeof selector !== 'string') return [];
        try {
            const elements = parent.querySelectorAll(selector);
            return Array.from(elements); // Convert NodeList to Array
        } catch (error) {
            return [];
        }
    }),
    addListener: jest.fn((element, event, handler, options = {}) => {
        if (!element || !event || typeof handler !== 'function') return false;
        try {
            element.addEventListener(event, handler, options);
            return true;
        } catch (error) {
            return false;
        }
    }),
    removeListener: jest.fn((element, event, handler, options = {}) => {
        if (!element || !event || typeof handler !== 'function') return false;
        try {
            element.removeEventListener(event, handler, options);
            return true;
        } catch (error) {
            return false;
        }
    }),
    setValue: jest.fn((element, value) => {
        if (!element) return false;
        try {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                element.value = value || '';
            } else {
                element.textContent = value || '';
            }
            return true;
        } catch (error) {
            return false;
        }
    }),
    getValue: jest.fn((element) => {
        if (!element) return '';
        try {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                return element.value || '';
            } else {
                return element.textContent || '';
            }
        } catch (error) {
            return '';
        }
    }),
    setInnerHTML: jest.fn((element, html) => {
        if (!element) return false;
        try {
            // Sanitize HTML before setting
            const sanitized = DOMUtils.sanitizeHTML(html || '');
            element.innerHTML = sanitized;
            return true;
        } catch (error) {
            return false;
        }
    }),
    sanitizeHTML: jest.fn((html) => {
        if (typeof html !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }),
    toggleClass: jest.fn((element, className, force) => {
        if (!element || !className) return false;
        try {
            element.classList.toggle(className, force);
            return true;
        } catch (error) {
            return false;
        }
    }),
    addClass: jest.fn((element, className) => {
        if (!element || !className) return false;
        try {
            element.classList.add(className);
            return true;
        } catch (error) {
            return false;
        }
    }),
    removeClass: jest.fn((element, className) => {
        if (!element || !className) return false;
        try {
            element.classList.remove(className);
            return true;
        } catch (error) {
            return false;
        }
    }),
    hasClass: jest.fn((element, className) => {
        if (!element || !className) return false;
        try {
            return element.classList.contains(className);
        } catch (error) {
            return false;
        }
    }),
    setStyle: jest.fn((element, property, value) => {
        if (!element || !property) return false;
        try {
            element.style[property] = value;
            return true;
        } catch (error) {
            return false;
        }
    }),
    getStyle: jest.fn((element, property) => {
        if (!element || !property) return '';
        try {
            return element.style[property] || '';
        } catch (error) {
            return '';
        }
    }),
    setAttribute: jest.fn((element, name, value) => {
        if (!element || !name) return false;
        try {
            element.setAttribute(name, value);
            return true;
        } catch (error) {
            return false;
        }
    }),
    getAttribute: jest.fn((element, name) => {
        if (!element || !name) return null;
        try {
            return element.getAttribute(name);
        } catch (error) {
            return null;
        }
    }),
    removeAttribute: jest.fn((element, name) => {
        if (!element || !name) return false;
        try {
            element.removeAttribute(name);
            return true;
        } catch (error) {
            return false;
        }
    }),
    isVisible: jest.fn((element) => {
        if (!element) return false;
        try {
            const style = window.getComputedStyle(element);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        } catch (error) {
            return false;
        }
    }),
    scrollIntoView: jest.fn((element, options = {}) => {
        if (!element) return false;
        try {
            // Mock scrollIntoView behavior
            element.scrollIntoView = jest.fn();
            element.scrollIntoView(options);
            return true;
        } catch (error) {
            return false;
        }
    }),
    focus: jest.fn((element) => {
        if (!element) return false;
        try {
            element.focus();
            return true;
        } catch (error) {
            return false;
        }
    }),
    blur: jest.fn((element) => {
        if (!element) return false;
        try {
            element.blur();
            return true;
        } catch (error) {
            return false;
        }
    })
};

// Mock SecurityUtils functions
export const SecurityUtils = {
    sanitizeHTML: jest.fn((html) => {
        if (typeof html !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }),
    isValidEmail: jest.fn((email) => {
        if (typeof email !== 'string') return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }),
    validatePassword: jest.fn((password) => {
        if (typeof password !== 'string') {
            return { isValid: false, score: 0, feedback: 'Password must be a string' };
        }
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let score = 0;
        const feedback = [];

        if (password.length >= minLength) {
            score += 2;
        } else {
            feedback.push(`Password must be at least ${minLength} characters long`);
        }

        if (hasUpperCase) score += 1;
        if (hasLowerCase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSpecialChar) score += 1;

        if (!hasUpperCase) feedback.push('Include at least one uppercase letter');
        if (!hasLowerCase) feedback.push('Include at least one lowercase letter');
        if (!hasNumbers) feedback.push('Include at least one number');
        if (!hasSpecialChar) feedback.push('Include at least one special character');

        const isValid = score >= 4 && password.length >= minLength;

        return {
            isValid,
            score,
            feedback: feedback.length > 0 ? feedback : ['Password meets all requirements']
        };
    }),
    validateUsername: jest.fn((username) => {
        if (typeof username !== 'string') {
            return { isValid: false, feedback: 'Username must be a string' };
        }

        const trimmed = username.trim();
        const minLength = 3;
        const maxLength = 20;
        const validChars = /^[a-zA-Z0-9_-]+$/;

        const feedback = [];

        if (trimmed.length < minLength) {
            feedback.push(`Username must be at least ${minLength} characters long`);
        }

        if (trimmed.length > maxLength) {
            feedback.push(`Username must be no more than ${maxLength} characters long`);
        }

        if (!validChars.test(trimmed)) {
            feedback.push('Username can only contain letters, numbers, underscores, and hyphens');
        }

        const isValid = trimmed.length >= minLength && trimmed.length <= maxLength && validChars.test(trimmed);

        return {
            isValid,
            feedback: feedback.length > 0 ? feedback : ['Username meets all requirements']
        };
    }),
    sanitizeInput: jest.fn((input) => {
        if (typeof input !== 'string') return '';
        return input.trim().replace(/[<>]/g, '');
    }),
    validateGoalTitle: jest.fn((title) => {
        if (typeof title !== 'string') {
            return { isValid: false, feedback: 'Title must be a string' };
        }

        const trimmed = title.trim();
        const minLength = 3;
        const maxLength = 100;

        const feedback = [];

        if (trimmed.length < minLength) {
            feedback.push(`Title must be at least ${minLength} characters long`);
        }

        if (trimmed.length > maxLength) {
            feedback.push(`Title must be no more than ${maxLength} characters long`);
        }

        if (trimmed.length === 0) {
            feedback.push('Title cannot be empty');
        }

        const isValid = trimmed.length >= minLength && trimmed.length <= maxLength;

        return {
            isValid,
            feedback: feedback.length > 0 ? feedback : ['Title meets all requirements']
        };
    }),
    validateGoalDescription: jest.fn((description) => {
        if (typeof description !== 'string') {
            return { isValid: false, feedback: 'Description must be a string' };
        }

        const trimmed = description.trim();
        const maxLength = 500;

        const feedback = [];

        if (trimmed.length > maxLength) {
            feedback.push(`Description must be no more than ${maxLength} characters long`);
        }

        const isValid = trimmed.length <= maxLength;

        return {
            isValid,
            feedback: feedback.length > 0 ? feedback : ['Description meets all requirements']
        };
    }),
    isValidDate: jest.fn((dateString) => {
        if (typeof dateString !== 'string') return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }),
    isFutureDate: jest.fn((dateString) => {
        if (!SecurityUtils.isValidDate(dateString)) return false;
        const date = new Date(dateString);
        return date > new Date();
    }),
    escapeHTML: jest.fn((text) => {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }),
    isValidURL: jest.fn((url) => {
        if (typeof url !== 'string') return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }),
    isValidPhone: jest.fn((phone) => {
        if (typeof phone !== 'string') return false;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }),
    generateRandomString: jest.fn((length = 32) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }),
    simpleHash: jest.fn((str) => {
        if (typeof str !== 'string') return '';
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }),
    isValidFileType: jest.fn((file, allowedTypes = []) => {
        if (!file || !file.type) return false;
        if (allowedTypes.length === 0) return true;
        return allowedTypes.includes(file.type);
    }),
    isValidFileSize: jest.fn((file, maxSizeMB = 5) => {
        if (!file || !file.size) return false;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return file.size <= maxSizeBytes;
    }),
    sanitizeObject: jest.fn((obj) => {
        if (typeof obj !== 'object' || obj === null) return {};
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                sanitized[key] = SecurityUtils.sanitizeInput(value);
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = SecurityUtils.sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }),
    isValidJSON: jest.fn((jsonString) => {
        if (typeof jsonString !== 'string') return false;
        try {
            JSON.parse(jsonString);
            return true;
        } catch {
            return false;
        }
    }),
    containsDangerousContent: jest.fn((text) => {
        if (typeof text !== 'string') return false;
        const dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:text\/html/gi
        ];
        return dangerousPatterns.some(pattern => pattern.test(text));
    }),
    checkRateLimit: jest.fn((key, maxAttempts = 5, windowMs = 60000) => {
        const now = Date.now();
        const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
        const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
        
        if (validAttempts.length >= maxAttempts) {
            return false;
        }
        
        validAttempts.push(now);
        localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validAttempts));
        return true;
    }),
    clearRateLimit: jest.fn((key) => {
        localStorage.removeItem(`rate_limit_${key}`);
    })
};

// Mock PerformanceUtils functions
export const PerformanceUtils = {
    debounce: jest.fn((func, wait, immediate = false) => {
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
    }),
    throttle: jest.fn((func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }),
    lazyLoadImages: jest.fn((selector = 'img[data-src]', options = {}) => {
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
    }),
    lazyLoadComponents: jest.fn((selector, loader, options = {}) => {
        const defaultOptions = {
            rootMargin: '100px',
            threshold: 0.1,
            ...options
        };

        const componentObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    const module = component.getAttribute('data-module');
                    if (module && loader) {
                        loader(module, component);
                        observer.unobserve(component);
                    }
                }
            });
        }, defaultOptions);

        document.querySelectorAll(selector).forEach(component => {
            componentObserver.observe(component);
        });
    }),
    preloadResources: jest.fn((resources = []) => {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.url;
            link.as = resource.as || 'fetch';
            if (resource.crossOrigin) {
                link.crossOrigin = resource.crossOrigin;
            }
            document.head.appendChild(link);
        });
    }),
    prefetchResources: jest.fn((resources = []) => {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource.url;
            document.head.appendChild(link);
        });
    }),
    measureTime: jest.fn((func, name = 'Function') => {
        return function(...args) {
            const start = performance.now();
            const result = func.apply(this, args);
            const end = performance.now();
            console.log(`${name} took ${end - start}ms`);
            return result;
        };
    }),
    measureAsyncTime: jest.fn((func, name = 'Async Function') => {
        return async function(...args) {
            const start = performance.now();
            const result = await func.apply(this, args);
            const end = performance.now();
            console.log(`${name} took ${end - start}ms`);
            return result;
        };
    }),
    getMemoryUsage: jest.fn(() => {
        if (performance.memory) {
            const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
            return {
                used: usedJSHeapSize,
                total: totalJSHeapSize,
                limit: jsHeapSizeLimit,
                percentage: Math.round((usedJSHeapSize / jsHeapSizeLimit) * 100)
            };
        }
        return { used: 0, total: 0, limit: 0, percentage: 0 };
    }),
    getPerformanceMetrics: jest.fn(() => {
        const metrics = {
            timestamp: Date.now(),
            memory: PerformanceUtils.getMemoryUsage(),
            navigation: performance.getEntriesByType('navigation')[0] || {},
            resources: performance.getEntriesByType('resource') || []
        };
        return metrics;
    }),
    optimizeImages: jest.fn((selector = 'img', options = {}) => {
        const images = document.querySelectorAll(selector);
        images.forEach(img => {
            if (img.dataset.src && !img.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }),
    optimizeCSSDelivery: jest.fn((criticalCSS = []) => {
        criticalCSS.forEach(css => {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        });
    }),
    optimizeScriptLoading: jest.fn((scripts = []) => {
        scripts.forEach(script => {
            const scriptElement = document.createElement('script');
            scriptElement.src = script.src;
            scriptElement.async = script.async || false;
            scriptElement.defer = script.defer || false;
            document.head.appendChild(scriptElement);
        });
    }),
    cacheDOMQueries: jest.fn((selectors = {}) => {
        const cache = {};
        Object.entries(selectors).forEach(([key, selector]) => {
            cache[key] = document.querySelector(selector);
        });
        return cache;
    }),
    batchDOMUpdates: jest.fn((updates = []) => {
        requestAnimationFrame(() => {
            updates.forEach(update => {
                if (typeof update === 'function') {
                    update();
                }
            });
        });
    }),
    virtualScroll: jest.fn((container, items, options = {}) => {
        const { itemHeight = 50, visibleItems = 10 } = options;
        const totalHeight = items.length * itemHeight;
        const visibleHeight = visibleItems * itemHeight;
        
        container.style.height = `${totalHeight}px`;
        
        const updateVisibleItems = () => {
            const scrollTop = container.scrollTop;
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(startIndex + visibleItems, items.length);
            
            // Clear container
            container.innerHTML = '';
            
            // Add visible items
            for (let i = startIndex; i < endIndex; i++) {
                const item = items[i];
                const itemElement = document.createElement('div');
                itemElement.style.height = `${itemHeight}px`;
                itemElement.style.position = 'absolute';
                itemElement.style.top = `${i * itemHeight}px`;
                itemElement.textContent = item;
                container.appendChild(itemElement);
            }
        };
        
        container.addEventListener('scroll', updateVisibleItems);
        updateVisibleItems();
    }),
    optimizeAnimations: jest.fn((elements = []) => {
        elements.forEach(element => {
            element.style.willChange = 'transform';
        });
    }),
    monitorFrameRate: jest.fn((callback) => {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const countFrames = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                callback(fps);
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
    }),
    optimizeEventListener: jest.fn((element, event, handler, options = {}) => {
        const optimizedHandler = PerformanceUtils.throttle(handler, options.throttle || 16);
        element.addEventListener(event, optimizedHandler, options);
        return optimizedHandler;
    }),
    debouncedScroll: jest.fn((handler, delay = 16) => {
        return PerformanceUtils.debounce(handler, delay);
    }),
    throttledResize: jest.fn((handler, delay = 100) => {
        return PerformanceUtils.throttle(handler, delay);
    }),
    optimizedRequest: jest.fn((url, options = {}) => {
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    }),
    preloadData: jest.fn((dataUrls = []) => {
        dataUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
    })
};

// Mock functions from app.html
export const monitorAsyncPerformance = jest.fn((func, name) => {
    return PerformanceUtils.measureAsyncTime(func, name);
});

export const handleFirebaseError = jest.fn((error, operation = 'operation', context = {}) => {
    console.error(`Firebase error in ${operation}:`, error);
    
    // Track error with Sentry
    if (window.Sentry) {
        window.Sentry.captureException(error, {
            extra: { operation, ...context }
        });
    }
    
    // Return user-friendly error message
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email address.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'permission-denied': 'You do not have permission to perform this action.',
        'unavailable': 'Service is temporarily unavailable. Please try again later.',
        'deadline-exceeded': 'Request timed out. Please try again.',
        'resource-exhausted': 'Service is currently overloaded. Please try again later.',
        'failed-precondition': 'Operation cannot be completed in the current state.',
        'aborted': 'Operation was aborted. Please try again.',
        'out-of-range': 'Requested data is out of range.',
        'unimplemented': 'This feature is not yet implemented.',
        'internal': 'An internal error occurred. Please try again later.',
        'data-loss': 'Data was lost during the operation.',
        'unauthenticated': 'Please sign in to continue.',
        'already-exists': 'This item already exists.',
        'not-found': 'The requested item was not found.',
        'permission-denied': 'You do not have permission to access this resource.',
        'resource-exhausted': 'Resource limit exceeded.',
        'failed-precondition': 'Operation cannot be completed.',
        'aborted': 'Operation was aborted.',
        'out-of-range': 'Request is out of range.',
        'unimplemented': 'Feature not implemented.',
        'internal': 'Internal error occurred.',
        'unavailable': 'Service unavailable.',
        'data-loss': 'Data loss occurred.',
        'unauthenticated': 'Authentication required.'
    };
    
    return errorMessages[error.code] || errorMessages[error.message] || 'An unexpected error occurred. Please try again.';
});

export const optimizeResourceLoading = jest.fn(() => {
    // Preload critical resources
    const criticalResources = [
        { url: '/css/critical.css', as: 'style' },
        { url: '/js/critical.js', as: 'script' }
    ];
    
    PerformanceUtils.preloadResources(criticalResources);
    
    // Prefetch non-critical resources
    const nonCriticalResources = [
        { url: '/css/non-critical.css' },
        { url: '/js/non-critical.js' }
    ];
    
    PerformanceUtils.prefetchResources(nonCriticalResources);
});

export const loadModule = jest.fn(async (modulePath) => {
    // Mock successful module loading for test modules
    if (modulePath.includes('test.js')) {
        return { default: { test: 'module' } };
    }
    
    try {
        const module = await import(modulePath);
        return module;
    } catch (error) {
        throw new Error(`Failed to load module ${modulePath}: ${error.message}`);
    }
});

export const trackError = jest.fn((error, context = {}) => {
    console.error('Error tracked:', error, context);
    if (window.Sentry) {
        window.Sentry.captureException(error, {
            extra: context
        });
    }
});

export const trackAction = jest.fn((action, data = {}) => {
    console.log('Action tracked:', action, data);
    if (window.Sentry) {
        window.Sentry.setTag('action', action);
        window.Sentry.captureMessage(`User action: ${action}`, {
            level: 'info',
            extra: data
        });
    }
});

// Mock monitorPerformance function
export const monitorPerformance = jest.fn((func, name) => {
    return PerformanceUtils.measureTime(func, name);
});

// Mock loadFeature function
export const loadFeature = jest.fn(async (featureName) => {
    const featureModules = {
        analytics: { name: 'analytics', init: jest.fn() },
        gamification: { name: 'gamification', init: jest.fn() },
        ai: { name: 'ai', init: jest.fn() }
    };
    
    if (featureModules[featureName]) {
        return featureModules[featureName];
    } else {
        throw new Error(`Unknown feature: ${featureName}`);
    }
});

// Mock preloadCriticalModules function
export const preloadCriticalModules = jest.fn(async () => {
    const criticalModules = [
        './js/utils/DOMUtils.js',
        './js/utils/SecurityUtils.js',
        './js/utils/PerformanceUtils.js'
    ];
    
    for (const modulePath of criticalModules) {
        try {
            await loadModule(modulePath);
        } catch (error) {
            console.warn(`Failed to preload critical module: ${modulePath}`);
        }
    }
}); 