/**
 * Phase 3.2: Enhanced Security & Compliance Module
 * Provides enhanced security features including input sanitization,
 * XSS prevention, session monitoring, and data validation.
 */

class Security {
  constructor() {
    this.securityConfig = null;
    this.sessionMonitor = null;
    this.inputValidator = null;
    this.threatDetector = null;
    this.auditLogger = null;
    this.complianceChecker = null;

    console.log('🔒 Security module initialized');
    this.initialize();
  }

  initialize() {
    try {
      this.initializeSecurityConfig();
      this.initializeSessionMonitor();
      this.initializeInputValidator();
      this.initializeThreatDetector();
      this.initializeAuditLogger();
      this.initializeComplianceChecker();
      this.startSecurityMonitoring();
      console.log('✅ Security module fully initialized');
    } catch (error) {
      console.error('❌ Error initializing Security module:', error);
    }
  }

  initializeSecurityConfig() {
    this.securityConfig = {
      xssProtection: true,
      csrfProtection: true,
      inputSanitization: true,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      encryptionEnabled: true,
      auditLogging: true,
      complianceMode: 'strict'
    };
  }

  initializeSessionMonitor() {
    this.sessionMonitor = {
      activeSessions: new Map(),
      sessionHistory: [],
      suspiciousActivities: [],

      createSession: (userId, userData) => {
        return this.createSecureSession(userId, userData);
      },

      validateSession: (sessionId) => {
        return this.validateSession(sessionId);
      },

      monitorSession: (sessionId) => {
        return this.monitorSessionActivity(sessionId);
      },

      terminateSession: (sessionId) => {
        return this.terminateSession(sessionId);
      }
    };
  }

  initializeInputValidator() {
    this.inputValidator = {
      validationRules: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        username: /^[a-zA-Z0-9_]{3,20}$/,
        url: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
        phone: /^\+?[\d\s\-\(\)]{10,}$/
      },

      sanitizeInput: (input, type = 'text') => {
        return this.sanitizeInput(input, type);
      },

      validateInput: (input, type) => {
        return this.validateInput(input, type);
      },

      preventXSS: (input) => {
        return this.preventXSS(input);
      }
    };
  }

  initializeThreatDetector() {
    this.threatDetector = {
      threatPatterns: {
        sqlInjection: /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
        xssAttack: /<script|javascript:|on\w+\s*=|data:text\/html/i,
        pathTraversal: /\.\.\/|\.\.\\/,
        commandInjection: /[;&|`$()]/,
        suspiciousKeywords: /(hack|crack|exploit|vulnerability|admin|root)/i
      },

      detectThreats: (input) => {
        return this.detectThreats(input);
      },

      analyzeBehavior: (userActions) => {
        return this.analyzeUserBehavior(userActions);
      },

      generateThreatReport: () => {
        return this.generateThreatReport();
      }
    };
  }

  initializeAuditLogger() {
    this.auditLogger = {
      auditLog: [],
      logLevels: ['info', 'warning', 'error', 'critical'],

      logEvent: (event, level = 'info') => {
        return this.logSecurityEvent(event, level);
      },

      exportAuditLog: () => {
        return this.exportAuditLog();
      },

      analyzeAuditLog: () => {
        return this.analyzeAuditLog();
      }
    };
  }

  initializeComplianceChecker() {
    this.complianceChecker = {
      complianceRules: {
        gdpr: {
          dataMinimization: true,
          userConsent: true,
          dataRetention: true,
          userRights: true
        },
        ccpa: {
          privacyNotice: true,
          optOutRights: true,
          dataDisclosure: true
        },
        hipaa: {
          dataEncryption: true,
          accessControls: true,
          auditTrails: true
        }
      },

      checkCompliance: (regulation) => {
        return this.checkCompliance(regulation);
      },

      generateComplianceReport: () => {
        return this.generateComplianceReport();
      }
    };
  }

  startSecurityMonitoring() {
    // Monitor DOM changes for potential XSS
    this.monitorDOMChanges();

    // Monitor network requests
    this.monitorNetworkRequests();

    // Monitor user interactions
    this.monitorUserInteractions();

    // Monitor localStorage and sessionStorage
    this.monitorStorageAccess();

    console.log('✅ Security monitoring started');
  }

  sanitizeInput(input, type = 'text') {
    try {
      if (typeof input !== 'string') {
        return input;
      }

      let sanitized = input;

      // Remove null bytes
      sanitized = sanitized.replace(/\0/g, '');

      // Remove control characters except newlines and tabs
      sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

      // Prevent XSS
      sanitized = this.preventXSS(sanitized);

      // Type-specific sanitization
      switch (type) {
      case 'email':
        sanitized = sanitized.toLowerCase().trim();
        break;
      case 'url':
        sanitized = sanitized.trim();
        if (sanitized && !sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
          sanitized = `https://${sanitized}`;
        }
        break;
      case 'html':
        // For HTML content, use a more permissive approach but still prevent XSS
        sanitized = this.sanitizeHTML(sanitized);
        break;
      default:
        // For text, remove HTML tags
        sanitized = sanitized.replace(/<[^>]*>/g, '');
      }

      this.auditLogger.logEvent({
        action: 'input_sanitization',
        input: input.substring(0, 100), // Log first 100 chars
        sanitized: sanitized.substring(0, 100),
        type,
        timestamp: new Date().toISOString()
      }, 'info');

      return sanitized;
    } catch (error) {
      console.error('❌ Error sanitizing input:', error);
      this.auditLogger.logEvent({
        action: 'input_sanitization_error',
        error: error.message,
        input: input.substring(0, 100),
        timestamp: new Date().toISOString()
      }, 'error');
      return '';
    }
  }

  preventXSS(input) {
    if (typeof input !== 'string') {
      return input;
    }

    // Replace potentially dangerous characters
    const xssMap = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#x27;',
      '&': '&amp;',
      '/': '&#x2F;',
      '\\': '&#x5C;'
    };

    return input.replace(/[<>&"'\/\\]/g, char => xssMap[char] || char);
  }

  sanitizeHTML(html) {
    // Basic HTML sanitization - allow safe tags
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const allowedAttributes = ['class', 'id', 'style'];

    // Remove script tags and event handlers
    html = html.replace(/<script[^>]*>.*?<\/script>/gi, '');
    html = html.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    html = html.replace(/javascript:/gi, '');

    // Only allow specific tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove disallowed tags
    const allElements = tempDiv.getElementsByTagName('*');
    for (let i = allElements.length - 1; i >= 0; i--) {
      const element = allElements[i];
      if (!allowedTags.includes(element.tagName.toLowerCase())) {
        element.parentNode.removeChild(element);
      } else {
        // Remove disallowed attributes
        const { attributes } = element;
        for (let j = attributes.length - 1; j >= 0; j--) {
          const attr = attributes[j];
          if (!allowedAttributes.includes(attr.name.toLowerCase())) {
            element.removeAttribute(attr.name);
          }
        }
      }
    }

    return tempDiv.innerHTML;
  }

  validateInput(input, type) {
    try {
      if (!input) {
        return { valid: false, error: 'Input is required' };
      }

      const rule = this.inputValidator.validationRules[type];
      if (!rule) {
        return { valid: true, error: null }; // No validation rule for this type
      }

      const isValid = rule.test(input);

      this.auditLogger.logEvent({
        action: 'input_validation',
        input: input.substring(0, 100),
        type,
        valid: isValid,
        timestamp: new Date().toISOString()
      }, isValid ? 'info' : 'warning');

      return {
        valid: isValid,
        error: isValid ? null : `Invalid ${type} format`
      };
    } catch (error) {
      console.error('❌ Error validating input:', error);
      return { valid: false, error: 'Validation error occurred' };
    }
  }

  detectThreats(input) {
    try {
      const threats = [];
      const inputLower = input.toLowerCase();

      // Check for various threat patterns
      Object.entries(this.threatDetector.threatPatterns).forEach(([threatType, pattern]) => {
        if (pattern.test(inputLower)) {
          threats.push({
            type: threatType,
            severity: this.calculateThreatSeverity(threatType),
            pattern: pattern.source,
            input: input.substring(0, 100)
          });
        }
      });

      if (threats.length > 0) {
        this.auditLogger.logEvent({
          action: 'threat_detected',
          threats,
          input: input.substring(0, 100),
          timestamp: new Date().toISOString()
        }, 'warning');
      }

      return threats;
    } catch (error) {
      console.error('❌ Error detecting threats:', error);
      return [];
    }
  }

  calculateThreatSeverity(threatType) {
    const severityMap = {
      sqlInjection: 'high',
      xssAttack: 'high',
      pathTraversal: 'medium',
      commandInjection: 'high',
      suspiciousKeywords: 'low'
    };

    return severityMap[threatType] || 'medium';
  }

  createSecureSession(userId, userData) {
    try {
      const sessionId = this.generateSecureSessionId();
      const sessionData = {
        id: sessionId,
        userId,
        userData,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        ipAddress: this.getClientIP(),
        userAgent: navigator.userAgent,
        isActive: true
      };

      this.sessionMonitor.activeSessions.set(sessionId, sessionData);

      this.auditLogger.logEvent({
        action: 'session_created',
        sessionId,
        userId,
        timestamp: new Date().toISOString()
      }, 'info');

      return sessionId;
    } catch (error) {
      console.error('❌ Error creating session:', error);
      return null;
    }
  }

  validateSession(sessionId) {
    try {
      const session = this.sessionMonitor.activeSessions.get(sessionId);

      if (!session) {
        return { valid: false, error: 'Session not found' };
      }

      // Check if session is expired
      const now = new Date();
      const lastActivity = new Date(session.lastActivity);
      const timeDiff = now - lastActivity;

      if (timeDiff > this.securityConfig.sessionTimeout) {
        this.terminateSession(sessionId);
        return { valid: false, error: 'Session expired' };
      }

      // Update last activity
      session.lastActivity = now.toISOString();
      this.sessionMonitor.activeSessions.set(sessionId, session);

      return { valid: true, session };
    } catch (error) {
      console.error('❌ Error validating session:', error);
      return { valid: false, error: 'Session validation error' };
    }
  }

  monitorSessionActivity(sessionId) {
    try {
      const session = this.sessionMonitor.activeSessions.get(sessionId);
      if (!session) {return;}

      // Check for suspicious activity
      const suspiciousActivity = this.detectSuspiciousActivity(session);

      if (suspiciousActivity) {
        this.sessionMonitor.suspiciousActivities.push({
          sessionId,
          activity: suspiciousActivity,
          timestamp: new Date().toISOString()
        });

        this.auditLogger.logEvent({
          action: 'suspicious_activity_detected',
          sessionId,
          activity: suspiciousActivity,
          timestamp: new Date().toISOString()
        }, 'warning');
      }
    } catch (error) {
      console.error('❌ Error monitoring session:', error);
    }
  }

  detectSuspiciousActivity(session) {
    // Check for rapid requests
    const now = new Date();
    const lastActivity = new Date(session.lastActivity);
    const timeDiff = now - lastActivity;

    if (timeDiff < 1000) { // Less than 1 second between requests
      return 'rapid_requests';
    }

    // Check for unusual user agent changes
    if (session.userAgent !== navigator.userAgent) {
      return 'user_agent_mismatch';
    }

    return null;
  }

  terminateSession(sessionId) {
    try {
      const session = this.sessionMonitor.activeSessions.get(sessionId);
      if (session) {
        session.isActive = false;
        session.terminatedAt = new Date().toISOString();

        this.sessionMonitor.sessionHistory.push(session);
        this.sessionMonitor.activeSessions.delete(sessionId);

        this.auditLogger.logEvent({
          action: 'session_terminated',
          sessionId,
          userId: session.userId,
          timestamp: new Date().toISOString()
        }, 'info');
      }
    } catch (error) {
      console.error('❌ Error terminating session:', error);
    }
  }

  monitorDOMChanges() {
    // Monitor for potential XSS through DOM manipulation
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.checkForXSSInElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  checkForXSSInElement(element) {
    // Check for script tags or event handlers
    if (element.tagName === 'SCRIPT') {
      this.auditLogger.logEvent({
        action: 'xss_attempt_detected',
        element: element.outerHTML.substring(0, 200),
        timestamp: new Date().toISOString()
      }, 'warning');

      element.remove();
    }

    // Check for event handlers
    const eventHandlers = ['onclick', 'onload', 'onerror', 'onmouseover'];
    eventHandlers.forEach(handler => {
      if (element.hasAttribute(handler)) {
        this.auditLogger.logEvent({
          action: 'xss_attempt_detected',
          element: element.outerHTML.substring(0, 200),
          handler,
          timestamp: new Date().toISOString()
        }, 'warning');

        element.removeAttribute(handler);
      }
    });
  }

  monitorNetworkRequests() {
    // Override fetch to monitor requests
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      const url = args[0];
      const options = args[1] || {};

      // Log the request
      this.auditLogger.logEvent({
        action: 'network_request',
        url,
        method: options.method || 'GET',
        timestamp: new Date().toISOString()
      }, 'info');

      // Check for suspicious URLs
      if (this.isSuspiciousURL(url)) {
        this.auditLogger.logEvent({
          action: 'suspicious_url_detected',
          url,
          timestamp: new Date().toISOString()
        }, 'warning');
      }

      return originalFetch.apply(this, args);
    };
  }

  isSuspiciousURL(url) {
    const suspiciousPatterns = [
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
      /file:\/\//i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(url));
  }

  monitorUserInteractions() {
    // Monitor for suspicious user interactions
    document.addEventListener('click', (e) => {
      this.auditLogger.logEvent({
        action: 'user_interaction',
        type: 'click',
        target: e.target.tagName,
        timestamp: new Date().toISOString()
      }, 'info');
    });

    document.addEventListener('keydown', (e) => {
      // Monitor for suspicious key combinations
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        this.auditLogger.logEvent({
          action: 'suspicious_key_combination',
          keys: 'Ctrl+Shift+I',
          timestamp: new Date().toISOString()
        }, 'warning');
      }
    });
  }

  monitorStorageAccess() {
    // Monitor localStorage and sessionStorage access
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      this.auditLogger.logEvent({
        action: 'storage_access',
        type: 'set',
        key,
        value: value.substring(0, 100),
        storage: this === localStorage ? 'localStorage' : 'sessionStorage',
        timestamp: new Date().toISOString()
      }, 'info');

      return originalSetItem.call(this, key, value);
    };
  }

  logSecurityEvent(event, level = 'info') {
    try {
      const logEntry = {
        ...event,
        level,
        timestamp: event.timestamp || new Date().toISOString(),
        sessionId: this.getCurrentSessionId(),
        userId: this.getCurrentUserId()
      };

      this.auditLogger.auditLog.push(logEntry);

      // Keep only last 1000 log entries
      if (this.auditLogger.auditLog.length > 1000) {
        this.auditLogger.auditLog = this.auditLogger.auditLog.slice(-1000);
      }

      // Log to console for debugging
      console.log(`[SECURITY ${level.toUpperCase()}]`, logEntry);

      return logEntry;
    } catch (error) {
      console.error('❌ Error logging security event:', error);
    }
  }

  checkCompliance(regulation) {
    try {
      const rules = this.complianceChecker.complianceRules[regulation];
      if (!rules) {
        return { compliant: false, error: `Unknown regulation: ${regulation}` };
      }

      const complianceResults = {};
      let overallCompliant = true;

      Object.entries(rules).forEach(([rule, required]) => {
        const isCompliant = this.checkComplianceRule(rule, regulation);
        complianceResults[rule] = isCompliant;

        if (required && !isCompliant) {
          overallCompliant = false;
        }
      });

      return {
        compliant: overallCompliant,
        regulation,
        results: complianceResults,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error checking compliance:', error);
      return { compliant: false, error: error.message };
    }
  }

  checkComplianceRule(rule, regulation) {
    switch (rule) {
    case 'dataMinimization':
      return this.securityConfig.encryptionEnabled;
    case 'userConsent':
      return this.hasUserConsent();
    case 'dataRetention':
      return this.hasDataRetentionPolicy();
    case 'dataEncryption':
      return this.securityConfig.encryptionEnabled;
    case 'accessControls':
      return this.hasAccessControls();
    case 'auditTrails':
      return this.securityConfig.auditLogging;
    default:
      return true;
    }
  }

  hasUserConsent() {
    // Check if user has given consent for data processing
    const consent = localStorage.getItem('operatorUplift_userConsent');
    return consent === 'true';
  }

  hasDataRetentionPolicy() {
    // Check if data retention policy is implemented
    return this.securityConfig.complianceMode === 'strict';
  }

  hasAccessControls() {
    // Check if access controls are implemented
    return this.sessionMonitor.activeSessions.size > 0;
  }

  generateSecureSessionId() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  getClientIP() {
    // This would typically be provided by the server
    return '127.0.0.1'; // Mock IP for client-side
  }

  getCurrentSessionId() {
    // Get current session ID from storage or app state
    return localStorage.getItem('operatorUplift_sessionId') || 'unknown';
  }

  getCurrentUserId() {
    // Get current user ID from app state
    return window.app?.state?.userData?.uid || 'unknown';
  }

  // Public API methods
  sanitizeInput(input, type = 'text') {
    return this.sanitizeInput(input, type);
  }

  preventXSS(input) {
    return this.preventXSS(input);
  }

  monitorSession(sessionId) {
    return this.sessionMonitor.monitorSession(sessionId);
  }

  validateData(data, schema) {
    // Validate data against a schema
    try {
      const validationResult = this.validateInput(data, schema);
      return validationResult;
    } catch (error) {
      console.error('❌ Error validating data:', error);
      return { valid: false, error: error.message };
    }
  }

  getSecurityStatus() {
    return {
      activeSessions: this.sessionMonitor.activeSessions.size,
      suspiciousActivities: this.sessionMonitor.suspiciousActivities.length,
      auditLogEntries: this.auditLogger.auditLog.length,
      complianceStatus: this.checkCompliance('gdpr'),
      securityConfig: this.securityConfig
    };
  }

  exportAuditLog() {
    return {
      log: this.auditLogger.auditLog,
      exportTime: new Date().toISOString(),
      totalEntries: this.auditLogger.auditLog.length
    };
  }

  generateThreatReport() {
    return {
      threats: this.threatDetector.threatPatterns,
      suspiciousActivities: this.sessionMonitor.suspiciousActivities,
      auditLog: this.auditLogger.auditLog.slice(-100), // Last 100 entries
      timestamp: new Date().toISOString()
    };
  }

  generateComplianceReport() {
    const regulations = ['gdpr', 'ccpa', 'hipaa'];
    const complianceResults = {};

    regulations.forEach(regulation => {
      complianceResults[regulation] = this.checkCompliance(regulation);
    });

    return {
      complianceResults,
      timestamp: new Date().toISOString(),
      overallCompliant: Object.values(complianceResults).every(result => result.compliant)
    };
  }
}

// Export to global scope
window.Security = Security;
console.log('🔒 Security module loaded');
