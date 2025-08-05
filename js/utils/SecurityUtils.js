/**
 * Security Utilities for input validation and XSS prevention
 * Provides comprehensive security measures for user input and data handling
 * 
 * @author Operator Uplift Team
 * @version 1.0.0
 * @since 2025-01-28
 */

class SecurityUtils {
    /**
     * Sanitize HTML content to prevent XSS attacks
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML
     */
    static sanitizeHTML(html) {
        if (typeof html !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Whether email is valid
     */
    static isValidEmail(email) {
        if (typeof email !== 'string') return false;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result with score and feedback
     */
    static validatePassword(password) {
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
    }

    /**
     * Validate username format
     * @param {string} username - Username to validate
     * @returns {Object} Validation result
     */
    static validateUsername(username) {
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

        const isValid = trimmed.length >= minLength && 
                       trimmed.length <= maxLength && 
                       validChars.test(trimmed);

        return {
            isValid,
            feedback: feedback.length > 0 ? feedback : ['Username is valid']
        };
    }

    /**
     * Sanitize user input for safe display
     * @param {string} input - User input to sanitize
     * @returns {string} Sanitized input
     */
    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        // Remove potentially dangerous characters and patterns
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .trim();
    }

    /**
     * Validate goal title
     * @param {string} title - Goal title to validate
     * @returns {Object} Validation result
     */
    static validateGoalTitle(title) {
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

        const isValid = trimmed.length >= minLength && trimmed.length <= maxLength;

        return {
            isValid,
            feedback: feedback.length > 0 ? feedback : ['Title is valid']
        };
    }

    /**
     * Validate goal description
     * @param {string} description - Goal description to validate
     * @returns {Object} Validation result
     */
    static validateGoalDescription(description) {
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
            feedback: feedback.length > 0 ? feedback : ['Description is valid']
        };
    }

    /**
     * Validate date format
     * @param {string} dateString - Date string to validate
     * @returns {boolean} Whether date is valid
     */
    static isValidDate(dateString) {
        if (typeof dateString !== 'string') return false;
        
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    /**
     * Validate future date
     * @param {string} dateString - Date string to validate
     * @returns {boolean} Whether date is in the future
     */
    static isFutureDate(dateString) {
        if (!this.isValidDate(dateString)) return false;
        
        const date = new Date(dateString);
        const now = new Date();
        return date > now;
    }

    /**
     * Escape HTML entities
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHTML(text) {
        if (typeof text !== 'string') return '';
        
        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        
        return text.replace(/[&<>"']/g, char => htmlEntities[char]);
    }

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} Whether URL is valid
     */
    static isValidURL(url) {
        if (typeof url !== 'string') return false;
        
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate phone number format
     * @param {string} phone - Phone number to validate
     * @returns {boolean} Whether phone number is valid
     */
    static isValidPhone(phone) {
        if (typeof phone !== 'string') return false;
        
        // Basic phone validation - allows various formats
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleaned);
    }

    /**
     * Generate secure random string
     * @param {number} length - Length of random string
     * @returns {string} Random string
     */
    static generateRandomString(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    /**
     * Hash string using simple algorithm (for non-critical use)
     * @param {string} str - String to hash
     * @returns {string} Hashed string
     */
    static simpleHash(str) {
        if (typeof str !== 'string') return '';
        
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Validate file type
     * @param {File} file - File to validate
     * @param {Array} allowedTypes - Array of allowed MIME types
     * @returns {boolean} Whether file type is allowed
     */
    static isValidFileType(file, allowedTypes = []) {
        if (!file || !file.type) return false;
        
        if (allowedTypes.length === 0) {
            // Default allowed types
            allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'text/plain',
                'application/pdf'
            ];
        }
        
        return allowedTypes.includes(file.type);
    }

    /**
     * Validate file size
     * @param {File} file - File to validate
     * @param {number} maxSizeMB - Maximum size in MB
     * @returns {boolean} Whether file size is within limit
     */
    static isValidFileSize(file, maxSizeMB = 5) {
        if (!file || !file.size) return false;
        
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return file.size <= maxSizeBytes;
    }

    /**
     * Sanitize object properties recursively
     * @param {Object} obj - Object to sanitize
     * @returns {Object} Sanitized object
     */
    static sanitizeObject(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return typeof obj === 'string' ? this.sanitizeInput(obj) : obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }

        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = this.sanitizeObject(value);
        }

        return sanitized;
    }

    /**
     * Validate JSON string
     * @param {string} jsonString - JSON string to validate
     * @returns {boolean} Whether JSON is valid
     */
    static isValidJSON(jsonString) {
        if (typeof jsonString !== 'string') return false;
        
        try {
            JSON.parse(jsonString);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if string contains potentially dangerous content
     * @param {string} text - Text to check
     * @returns {boolean} Whether text contains dangerous content
     */
    static containsDangerousContent(text) {
        if (typeof text !== 'string') return false;
        
        const dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            /data:text\/html/gi,
            /vbscript:/gi
        ];
        
        return dangerousPatterns.some(pattern => pattern.test(text));
    }

    /**
     * Rate limiting utility
     * @param {string} key - Rate limit key
     * @param {number} maxAttempts - Maximum attempts allowed
     * @param {number} windowMs - Time window in milliseconds
     * @returns {boolean} Whether request is allowed
     */
    static checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
        const now = Date.now();
        const storageKey = `rate_limit_${key}`;
        
        let attempts = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Remove old attempts outside the time window
        attempts = attempts.filter(timestamp => now - timestamp < windowMs);
        
        if (attempts.length >= maxAttempts) {
            return false;
        }
        
        attempts.push(now);
        localStorage.setItem(storageKey, JSON.stringify(attempts));
        
        return true;
    }

    /**
     * Clear rate limit for a key
     * @param {string} key - Rate limit key to clear
     */
    static clearRateLimit(key) {
        const storageKey = `rate_limit_${key}`;
        localStorage.removeItem(storageKey);
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityUtils;
} else if (typeof window !== 'undefined') {
    window.SecurityUtils = SecurityUtils;
}

export default SecurityUtils; 