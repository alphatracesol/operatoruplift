// Error Boundary Manager
// Handles error catching, logging, and recovery strategies

class ErrorBoundary {
  constructor() {
    this.errors = [];
    this.maxErrors = 10;
    this.recoveryStrategies = new Map();
    this.setupRecoveryStrategies();
  }

  // Setup recovery strategies
  setupRecoveryStrategies() {
    this.recoveryStrategies.set('auth', this.handleAuthError.bind(this));
    this.recoveryStrategies.set('ui', this.handleUIError.bind(this));
    this.recoveryStrategies.set('ai', this.handleAIError.bind(this));
    this.recoveryStrategies.set('storage', this.handleStorageError.bind(this));
    this.recoveryStrategies.set('network', this.handleNetworkError.bind(this));
    this.recoveryStrategies.set('module', this.handleModuleError.bind(this));
    this.recoveryStrategies.set('global', this.handleGlobalError.bind(this));
    this.recoveryStrategies.set('promise', this.handlePromiseError.bind(this));
  }

  // Catch and handle errors
  catchError(error, context = '') {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Add to error log
    this.errors.push(errorInfo);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log error
    console.error('Error caught by boundary:', errorInfo);

    // Try to recover
    this.recoverFromError(error, context);

    // Notify user if critical
    if (this.isCriticalError(error, context)) {
      this.notifyUser(error, context);
    }
  }

  // Recover from error
  recoverFromError(error, context) {
    try {
      const strategy = this.recoveryStrategies.get(context);
      if (strategy) {
        strategy(error);
      } else {
        this.generalRecovery(error);
      }
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      this.generalRecovery(error);
    }
  }

  // Handle authentication errors
  handleAuthError(error) {
    console.log('Handling auth error:', error.message);

    // Clear auth state
    localStorage.removeItem('operatorUpliftUser');

    // Redirect to login
    window.location.reload();
  }

  // Handle UI errors
  handleUIError(error) {
    console.log('Handling UI error:', error.message);

    // Hide loading states
    this.hideLoadingStates();

    // Close modals
    this.closeAllModals();

    // Refresh UI
    this.refreshUI();
  }

  // Handle AI errors
  handleAIError(error) {
    console.log('Handling AI error:', error.message);

    // Reset AI state
    this.resetAIState();

    // Show fallback message
    this.showFallbackMessage('AI service temporarily unavailable');
  }

  // Handle storage errors
  handleStorageError(error) {
    console.log('Handling storage error:', error.message);

    // Clear corrupted data
    this.clearCorruptedData();

    // Fallback to memory storage
    this.enableMemoryFallback();
  }

  // Handle network errors
  handleNetworkError(error) {
    console.log('Handling network error:', error.message);

    // Enable offline mode
    this.enableOfflineMode();

    // Show offline indicator
    this.showOfflineIndicator();
  }

  // Handle module errors
  handleModuleError(error) {
    console.log('Handling module error:', error.message);

    // Disable problematic module
    this.disableModule(error.moduleName);

    // Show module unavailable message
    this.showModuleUnavailableMessage(error.moduleName);
  }

  // Handle global errors
  handleGlobalError(error) {
    console.log('Handling global error:', error.message);

    // General recovery
    this.generalRecovery(error);

    // Log to external service if available
    this.logToExternalService(error);
  }

  // Handle promise errors
  handlePromiseError(error) {
    console.log('Handling promise error:', error.message);

    // Cancel pending operations
    this.cancelPendingOperations();

    // Show retry option
    this.showRetryOption();
  }

  // General recovery strategy
  generalRecovery(error) {
    // Hide loading states
    this.hideLoadingStates();

    // Close all modals
    this.closeAllModals();

    // Reset app state
    this.resetAppState();

    // Show error message
    this.showErrorMessage('Something went wrong. Please try again.');
  }

  // Hide loading states
  hideLoadingStates() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
    }

    // Remove loading classes
    document.querySelectorAll('.loading').forEach(el => {
      el.classList.remove('loading');
    });
  }

  // Close all modals
  closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });

    // Restore body scroll
    document.body.style.overflow = '';
  }

  // Refresh UI
  refreshUI() {
    // Trigger UI refresh
    const event = new CustomEvent('ui-refresh');
    document.dispatchEvent(event);
  }

  // Reset AI state
  resetAIState() {
    // Clear AI cache
    localStorage.removeItem('ai-chat-history');

    // Reset AI components
    const aiElements = document.querySelectorAll('[data-ai-component]');
    aiElements.forEach(el => {
      el.innerHTML = '';
    });
  }

  // Reset app state
  resetAppState() {
    // Reset critical state
    if (window.app && window.app.state) {
      window.app.state.isLoading = false;
      window.app.state.error = null;
    }
  }

  // Clear corrupted data
  clearCorruptedData() {
    // Clear potentially corrupted localStorage items
    const keysToClear = [
      'operatorUpliftUser',
      'ai-chat-history',
      'user-goals',
      'user-tasks'
    ];

    keysToClear.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('Failed to clear localStorage key:', key);
      }
    });
  }

  // Enable memory fallback
  enableMemoryFallback() {
    // Set flag for memory-only mode
    window.memoryOnlyMode = true;

    // Show memory mode indicator
    this.showMemoryModeIndicator();
  }

  // Enable offline mode
  enableOfflineMode() {
    // Set offline flag
    window.offlineMode = true;

    // Disable network-dependent features
    this.disableNetworkFeatures();
  }

  // Disable network features
  disableNetworkFeatures() {
    // Disable AI chat
    const aiChat = document.getElementById('ai-chat-input');
    if (aiChat) {
      aiChat.disabled = true;
      aiChat.placeholder = 'Offline - AI unavailable';
    }

    // Disable sync features
    const syncButtons = document.querySelectorAll('[data-sync]');
    syncButtons.forEach(btn => {
      btn.disabled = true;
      btn.textContent = 'Offline';
    });
  }

  // Disable module
  disableModule(moduleName) {
    // Mark module as disabled
    if (window.app && window.app.modules) {
      const module = window.app.modules.get(moduleName);
      if (module) {
        module.disabled = true;
      }
    }
  }

  // Cancel pending operations
  cancelPendingOperations() {
    // Abort fetch requests
    if (window.abortController) {
      window.abortController.abort();
    }

    // Clear timeouts
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  // Show fallback message
  showFallbackMessage(message) {
    const fallbackElement = document.getElementById('fallback-message');
    if (fallbackElement) {
      fallbackElement.textContent = message;
      fallbackElement.style.display = 'block';
    }
  }

  // Show offline indicator
  showOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.style.display = 'block';
    }
  }

  // Show memory mode indicator
  showMemoryModeIndicator() {
    const indicator = document.getElementById('memory-mode-indicator');
    if (indicator) {
      indicator.style.display = 'block';
    }
  }

  // Show module unavailable message
  showModuleUnavailableMessage(moduleName) {
    const message = `Module '${moduleName}' is temporarily unavailable`;
    this.showFallbackMessage(message);
  }

  // Show error message
  showErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Show retry option
  showRetryOption() {
    const retryButton = document.createElement('button');
    retryButton.className = 'btn btn-primary retry-btn';
    retryButton.textContent = 'Retry';
    retryButton.onclick = () => {
      window.location.reload();
    };

    // Add to page
    document.body.appendChild(retryButton);
  }

  // Notify user of critical error
  notifyUser(error, context) {
    const criticalMessage = `Critical error in ${context}: ${error.message}`;
    this.showErrorMessage(criticalMessage);
  }

  // Check if error is critical
  isCriticalError(error, context) {
    const criticalContexts = ['auth', 'storage', 'global'];
    const criticalMessages = ['network', 'database', 'authentication'];

    return criticalContexts.includes(context) ||
               criticalMessages.some(msg => error.message.toLowerCase().includes(msg));
  }

  // Log to external service
  logToExternalService(error) {
    // In a real app, you would send this to a logging service
    console.log('Logging to external service:', error);
  }

  // Get error log
  getErrors() {
    return this.errors;
  }

  // Clear error log
  clearErrors() {
    this.errors = [];
  }

  // Get error count
  getErrorCount() {
    return this.errors.length;
  }

  // Check if in error state
  isInErrorState() {
    return this.errors.length > 0;
  }

  // Get recent errors
  getRecentErrors(count = 5) {
    return this.errors.slice(-count);
  }
}

// Export the ErrorBoundary
export default ErrorBoundary;
