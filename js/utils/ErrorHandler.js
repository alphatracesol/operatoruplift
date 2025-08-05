/**
 * Comprehensive Error Handler for Operator Uplift
 * Standardized error handling, logging, and user feedback
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.isInitialized = false;
    this.errorCount = 0;
    this.lastErrorTime = 0;
    this.errorThreshold = 10; // Max errors per minute
    this.thresholdWindow = 60000; // 1 minute

    this.errorTypes = {
      RUNTIME: 'runtime',
      NETWORK: 'network',
      VALIDATION: 'validation',
      AUTH: 'authentication',
      PERMISSION: 'permission',
      RESOURCE: 'resource',
      TIMEOUT: 'timeout',
      UNKNOWN: 'unknown'
    };

    this.severityLevels = {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      CRITICAL: 'critical'
    };
  }

  /**
     * Initialize error handler
     */
  init() {
    if (this.isInitialized) {return;}

    // Set up global error handlers
    this.setupGlobalHandlers();

    // Set up performance monitoring
    this.setupPerformanceMonitoring();

    // Set up network error monitoring
    this.setupNetworkMonitoring();

    this.isInitialized = true;
    this.log('info', 'Error handler initialized');
  }

  /**
     * Setup global error handlers
     */
  setupGlobalHandlers() {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        type: this.errorTypes.RUNTIME,
        context: 'global',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: this.errorTypes.RUNTIME,
        context: 'promise',
        promise: event.promise
      });
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        this.handleError(new Error(`Resource loading failed: ${event.target.src || event.target.href}`), {
          type: this.errorTypes.RESOURCE,
          context: 'resource',
          element: event.target.tagName,
          src: event.target.src || event.target.href
        });
      }
    }, true);
  }

  /**
     * Setup performance monitoring
     */
  setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'measure' && entry.duration > 5000) {
              this.handleError(new Error(`Performance issue: ${entry.name} took ${entry.duration}ms`), {
                type: this.errorTypes.TIMEOUT,
                context: 'performance',
                entry
              });
            }
          });
        });
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        this.log('warn', 'Performance monitoring setup failed', error);
      }
    }
  }

  /**
     * Setup network monitoring
     */
  setupNetworkMonitoring() {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;

        if (duration > 10000) { // 10 seconds
          this.handleError(new Error(`Slow network request: ${args[0]} took ${duration}ms`), {
            type: this.errorTypes.TIMEOUT,
            context: 'network',
            url: args[0],
            duration
          });
        }

        if (!response.ok) {
          this.handleError(new Error(`HTTP ${response.status}: ${response.statusText}`), {
            type: this.errorTypes.NETWORK,
            context: 'network',
            url: args[0],
            status: response.status,
            statusText: response.statusText
          });
        }

        return response;
      } catch (error) {
        this.handleError(error, {
          type: this.errorTypes.NETWORK,
          context: 'network',
          url: args[0]
        });
        throw error;
      }
    };
  }

  /**
     * Handle an error with context
     * @param {Error} error - The error object
     * @param {object} context - Error context
     */
  handleError(error, context = {}) {
    // Check error rate threshold
    if (!this.checkErrorThreshold()) {
      return;
    }

    const errorInfo = {
      id: this.generateErrorId(),
      message: error.message || 'Unknown error',
      stack: error.stack,
      name: error.name || 'Error',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context: {
        type: context.type || this.errorTypes.UNKNOWN,
        severity: this.calculateSeverity(error, context),
        ...context
      }
    };

    // Add to error log
    this.errors.push(errorInfo);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log error
    this.logError(errorInfo);

    // Show user notification if needed
    if (this.shouldShowUserNotification(errorInfo)) {
      this.showUserNotification(errorInfo);
    }

    // Report to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportToExternalService(errorInfo);
    }

    this.errorCount++;
    this.lastErrorTime = Date.now();
  }

  /**
     * Check if error rate is within threshold
     * @returns {boolean} Whether error should be processed
     */
  checkErrorThreshold() {
    const now = Date.now();
    if (now - this.lastErrorTime > this.thresholdWindow) {
      this.errorCount = 0;
      return true;
    }

    return this.errorCount < this.errorThreshold;
  }

  /**
     * Calculate error severity
     * @param {Error} error - The error
     * @param {object} context - Error context
     * @returns {string} Severity level
     */
  calculateSeverity(error, context) {
    // Critical errors
    if (context.type === this.errorTypes.AUTH ||
            context.type === this.errorTypes.PERMISSION ||
            error.message.includes('security') ||
            error.message.includes('authentication')) {
      return this.severityLevels.CRITICAL;
    }

    // High severity errors
    if (context.type === this.errorTypes.NETWORK ||
            context.type === this.errorTypes.TIMEOUT ||
            error.message.includes('network') ||
            error.message.includes('timeout')) {
      return this.severityLevels.HIGH;
    }

    // Medium severity errors
    if (context.type === this.errorTypes.VALIDATION ||
            context.type === this.errorTypes.RESOURCE) {
      return this.severityLevels.MEDIUM;
    }

    return this.severityLevels.LOW;
  }

  /**
     * Generate unique error ID
     * @returns {string} Error ID
     */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
     * Log error to console and storage
     * @param {object} errorInfo - Error information
     */
  logError(errorInfo) {
    const logMessage = `[${errorInfo.context.severity.toUpperCase()}] ${errorInfo.message}`;

    // Console logging based on severity
    switch (errorInfo.context.severity) {
    case this.severityLevels.CRITICAL:
      console.error(logMessage, errorInfo);
      break;
    case this.severityLevels.HIGH:
      console.error(logMessage, errorInfo);
      break;
    case this.severityLevels.MEDIUM:
      console.warn(logMessage, errorInfo);
      break;
    case this.severityLevels.LOW:
      console.log(logMessage, errorInfo);
      break;
    }

    // Store in localStorage for debugging
    this.storeErrorLog(errorInfo);
  }

  /**
     * Store error in localStorage
     * @param {object} errorInfo - Error information
     */
  storeErrorLog(errorInfo) {
    try {
      const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      logs.push(errorInfo);

      // Keep only last 50 errors
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }

      localStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (error) {
      console.warn('Failed to store error log:', error);
    }
  }

  /**
     * Determine if user notification should be shown
     * @param {object} errorInfo - Error information
     * @returns {boolean} Whether to show notification
     */
  shouldShowUserNotification(errorInfo) {
    // Show notifications for high and critical errors
    return errorInfo.context.severity === this.severityLevels.HIGH ||
               errorInfo.context.severity === this.severityLevels.CRITICAL;
  }

  /**
     * Show user-friendly error notification
     * @param {object} errorInfo - Error information
     */
  showUserNotification(errorInfo) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `error-notification error-${errorInfo.context.severity}`;
    notification.innerHTML = `
            <div class="error-content">
                <div class="error-header">
                    <h3>${this.getUserFriendlyTitle(errorInfo)}</h3>
                    <button class="error-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <p>${this.getUserFriendlyMessage(errorInfo)}</p>
                <div class="error-actions">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">Dismiss</button>
                    <button onclick="window.location.reload()">Reload Page</button>
                </div>
            </div>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(errorInfo.context.severity)};
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  /**
     * Get user-friendly error title
     * @param {object} errorInfo - Error information
     * @returns {string} User-friendly title
     */
  getUserFriendlyTitle(errorInfo) {
    switch (errorInfo.context.type) {
    case this.errorTypes.AUTH:
      return 'Authentication Error';
    case this.errorTypes.NETWORK:
      return 'Connection Error';
    case this.errorTypes.TIMEOUT:
      return 'Request Timeout';
    case this.errorTypes.VALIDATION:
      return 'Validation Error';
    case this.errorTypes.PERMISSION:
      return 'Permission Denied';
    default:
      return 'Something Went Wrong';
    }
  }

  /**
     * Get user-friendly error message
     * @param {object} errorInfo - Error information
     * @returns {string} User-friendly message
     */
  getUserFriendlyMessage(errorInfo) {
    switch (errorInfo.context.type) {
    case this.errorTypes.AUTH:
      return 'Please log in again to continue.';
    case this.errorTypes.NETWORK:
      return 'Please check your internet connection and try again.';
    case this.errorTypes.TIMEOUT:
      return 'The request took too long. Please try again.';
    case this.errorTypes.VALIDATION:
      return 'Please check your input and try again.';
    case this.errorTypes.PERMISSION:
      return 'You don\'t have permission to perform this action.';
    default:
      return 'We\'re sorry, but something unexpected happened. Please try again.';
    }
  }

  /**
     * Get notification color based on severity
     * @param {string} severity - Error severity
     * @returns {string} CSS color
     */
  getNotificationColor(severity) {
    switch (severity) {
    case this.severityLevels.CRITICAL:
      return '#dc3545';
    case this.severityLevels.HIGH:
      return '#fd7e14';
    case this.severityLevels.MEDIUM:
      return '#ffc107';
    case this.severityLevels.LOW:
      return '#17a2b8';
    default:
      return '#6c757d';
    }
  }

  /**
     * Report error to external service
     * @param {object} errorInfo - Error information
     */
  async reportToExternalService(errorInfo) {
    try {
      // Remove sensitive information
      const sanitizedError = {
        ...errorInfo,
        context: {
          ...errorInfo.context,
          // Remove sensitive data
          url: undefined,
          userAgent: undefined
        }
      };

      // Send to external service (implement as needed)
      // await fetch('/api/errors', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(sanitizedError)
      // });
    } catch (error) {
      console.warn('Failed to report error to external service:', error);
    }
  }

  /**
     * Log informational message
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {*} data - Additional data
     */
  log(level, message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: window.location.href
    };

    // Console logging
    switch (level) {
    case 'error':
      console.error(message, data);
      break;
    case 'warn':
      console.warn(message, data);
      break;
    case 'info':
      console.log(message, data);
      break;
    default:
      console.log(message, data);
    }

    // Store in localStorage
    this.storeLog(logEntry);
  }

  /**
     * Store log entry
     * @param {object} logEntry - Log entry
     */
  storeLog(logEntry) {
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(logEntry);

      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.warn('Failed to store log:', error);
    }
  }

  /**
     * Get all errors
     * @returns {Array} Array of errors
     */
  getErrors() {
    return [...this.errors];
  }

  /**
     * Get error statistics
     * @returns {object} Error statistics
     */
  getErrorStats() {
    const now = Date.now();
    const recentErrors = this.errors.filter(error =>
      now - new Date(error.timestamp).getTime() < 3600000 // Last hour
    );

    return {
      totalErrors: this.errors.length,
      recentErrors: recentErrors.length,
      errorRate: this.errorCount,
      lastErrorTime: this.lastErrorTime,
      severityBreakdown: this.getSeverityBreakdown(),
      typeBreakdown: this.getTypeBreakdown()
    };
  }

  /**
     * Get severity breakdown
     * @returns {object} Severity breakdown
     */
  getSeverityBreakdown() {
    const breakdown = {};
    this.errors.forEach(error => {
      const { severity } = error.context;
      breakdown[severity] = (breakdown[severity] || 0) + 1;
    });
    return breakdown;
  }

  /**
     * Get type breakdown
     * @returns {object} Type breakdown
     */
  getTypeBreakdown() {
    const breakdown = {};
    this.errors.forEach(error => {
      const { type } = error.context;
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    return breakdown;
  }

  /**
     * Clear error logs
     */
  clearErrors() {
    this.errors = [];
    this.errorCount = 0;
    localStorage.removeItem('error_logs');
    localStorage.removeItem('app_logs');
  }

  /**
     * Export error logs
     * @returns {string} JSON string of error logs
     */
  exportErrorLogs() {
    return JSON.stringify({
      errors: this.errors,
      stats: this.getErrorStats(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }
}

// Create global instance
const errorHandler = new ErrorHandler();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ErrorHandler, errorHandler };
} else if (typeof window !== 'undefined') {
  window.ErrorHandler = ErrorHandler;
  window.errorHandler = errorHandler;
}
