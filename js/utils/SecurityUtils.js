/**
 * Security Utilities for Operator Uplift
 * Comprehensive security measures to prevent vulnerabilities
 */

class SecurityUtils {
  constructor() {
    this.xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
    ];

    this.sanitizationMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#x27;',
      '/': '&#x2F;'
    };
  }

  /**
     * Sanitize HTML content to prevent XSS attacks
     * @param {string} html - HTML content to sanitize
     * @returns {string} Sanitized HTML
     */
  static sanitizeHTML(html) {
    if (!html || typeof html !== 'string') {return '';}

    // Remove dangerous patterns
    let sanitized = html;
    this.xssPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Escape HTML entities
    Object.entries(this.sanitizationMap).forEach(([char, entity]) => {
      sanitized = sanitized.replace(new RegExp(char, 'g'), entity);
    });

    return sanitized;
  }

  /**
     * Safely set innerHTML with XSS prevention
     * @param {Element} element - DOM element
     * @param {string} content - Content to set
     */
  static safeSetInnerHTML(element, content) {
    if (!element || !element.innerHTML) {return;}
    element.innerHTML = this.sanitizeHTML(content);
  }

  /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid email
     */
  static validateEmail(email) {
    if (!email || typeof email !== 'string') {return false;}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
     * Enhanced password validation
     * @param {string} password - Password to validate
     * @returns {object} Validation result with details
     */
  static validatePassword(password) {
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

    if (!requirements.minLength) {errors.push('Password must be at least 8 characters long');}
    if (!requirements.hasUpperCase) {errors.push('Password must contain at least one uppercase letter');}
    if (!requirements.hasLowerCase) {errors.push('Password must contain at least one lowercase letter');}
    if (!requirements.hasNumber) {errors.push('Password must contain at least one number');}
    if (!requirements.hasSpecialChar) {errors.push('Password must contain at least one special character');}

    return {
      valid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password, requirements)
    };
  }

  /**
     * Calculate password strength
     * @param {string} password - Password to evaluate
     * @param {object} requirements - Met requirements
     * @returns {string} Strength level
     */
  static calculatePasswordStrength(password, requirements) {
    let score = 0;

    // Length bonus
    if (password.length >= 12) {score += 2;}
    else if (password.length >= 8) {score += 1;}

    // Character variety bonus
    Object.values(requirements).forEach(met => {
      if (met) {score += 1;}
    });

    // Complexity bonus
    if (password.length > 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      score += 1;
    }

    if (score >= 6) {return 'strong';}
    if (score >= 4) {return 'medium';}
    if (score >= 2) {return 'weak';}
    return 'very-weak';
  }

  /**
     * Sanitize user input
     * @param {string} input - User input to sanitize
     * @returns {string} Sanitized input
     */
  static sanitizeInput(input) {
    if (!input || typeof input !== 'string') {return '';}

    // Remove null bytes and control characters
    let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    // Limit length
    if (sanitized.length > 1000) {
      sanitized = sanitized.substring(0, 1000);
    }

    return sanitized;
  }

  /**
     * Validate and sanitize URL
     * @param {string} url - URL to validate
     * @returns {string|null} Valid URL or null
     */
  static validateURL(url) {
    if (!url || typeof url !== 'string') {return null;}

    try {
      const urlObj = new URL(url);
      const allowedProtocols = ['http:', 'https:'];

      if (!allowedProtocols.includes(urlObj.protocol)) {
        return null;
      }

      return urlObj.href;
    } catch (error) {
      return null;
    }
  }

  /**
     * Generate secure random token
     * @param {number} length - Token length
     * @returns {string} Secure random token
     */
  static generateSecureToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);

      for (let i = 0; i < length; i++) {
        token += chars[array[i] % chars.length];
      }
    } else {
      // Fallback for older browsers
      for (let i = 0; i < length; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    return token;
  }

  /**
     * Rate limiting utility
     */
  static createRateLimiter(maxRequests = 10, timeWindow = 60000) {
    const requests = new Map();

    return function(key) {
      const now = Date.now();
      const userRequests = requests.get(key) || [];

      // Remove old requests outside the time window
      const validRequests = userRequests.filter(time => now - time < timeWindow);

      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }

      validRequests.push(now);
      requests.set(key, validRequests);

      return true; // Request allowed
    };
  }

  /**
     * CSRF token management
     */
  static generateCSRFToken() {
    const token = this.generateSecureToken(32);
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  static validateCSRFToken(token) {
    const storedToken = sessionStorage.getItem('csrf_token');
    return token === storedToken;
  }

  /**
     * Content Security Policy headers
     * @returns {object} CSP headers
     */
  static getCSPHeaders() {
    return {
      'Content-Security-Policy': [
        'default-src \'self\'',
        'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://cdn.jsdelivr.net https://unpkg.com',
        'style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com',
        'font-src \'self\' https://fonts.gstatic.com',
        'img-src \'self\' data: https:',
        'connect-src \'self\' https://api.openai.com https://api.deepseek.com https://api.perplexity.ai',
        'frame-ancestors \'none\'',
        'base-uri \'self\'',
        'form-action \'self\''
      ].join('; ')
    };
  }

  /**
     * Security headers for API responses
     * @returns {object} Security headers
     */
  static getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  /**
     * Validate file upload
     * @param {File} file - File to validate
     * @param {object} options - Validation options
     * @returns {object} Validation result
     */
  static validateFileUpload(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'text/plain', 'application/pdf'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.txt', '.pdf']
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }

    // Check file extension
    const extension = `.${file.name.split('.').pop().toLowerCase()}`;
    if (!allowedExtensions.includes(extension)) {
      errors.push('File extension not allowed');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
     * Log security events
     * @param {string} event - Security event
     * @param {object} details - Event details
     */
  static logSecurityEvent(event, details = {}) {
    const securityLog = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', securityLog);
    }

    // Store in localStorage for debugging
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(securityLog);

    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }

    localStorage.setItem('security_logs', JSON.stringify(logs));
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityUtils;
} else if (typeof window !== 'undefined') {
  window.SecurityUtils = SecurityUtils;
}
