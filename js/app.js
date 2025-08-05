// Main Application Entry Point
// Initializes the modular architecture and loads all components

import CoreModule from './modules/core-enhanced.js';
import ErrorBoundary from './managers/ErrorBoundary.js';
import MemoryManager from './managers/MemoryManager.js';
import PerformanceManager from './managers/PerformanceManager.js';
import ZIndexManager from './managers/ZIndexManager.js';

class OperatorUpliftApp {
  constructor() {
    this.core = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  // Initialize the application
  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._init();
    return this.initPromise;
  }

  // Private initialization method
  async _init() {
    try {
      console.log('🚀 Starting Operator Uplift Application...');

      // Create core module
      this.core = new CoreModule();

      // Initialize core
      await this.core.init();

      // Make app globally accessible
      window.app = this.core;

      // Mark as initialized
      this.isInitialized = true;

      console.log('✅ Operator Uplift Application initialized successfully');

      // Dispatch ready event
      document.dispatchEvent(new CustomEvent('app-ready'));

    } catch (error) {
      console.error('❌ Application initialization failed:', error);

      // Show error to user
      this.showInitError(error);

      throw error;
    }
  }

  // Show initialization error
  showInitError(error) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'init-error';
    errorContainer.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <div class="error-title">Application Failed to Load</div>
                <div class="error-message">${error.message}</div>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    Retry
                </button>
            </div>
        `;

    document.body.appendChild(errorContainer);
  }

  // Get module instance
  getModule(name) {
    if (!this.core) {
      throw new Error('Application not initialized');
    }
    return this.core.getModule(name);
  }

  // Get application state
  getState() {
    if (!this.core) {
      return null;
    }
    return this.core.state;
  }

  // Update application state
  updateState(updates) {
    if (!this.core) {
      throw new Error('Application not initialized');
    }
    this.core.updateState(updates);
  }

  // Check if application is ready
  isReady() {
    return this.isInitialized && this.core !== null;
  }

  // Cleanup application
  cleanup() {
    if (this.core) {
      this.core.cleanup();
    }
    this.isInitialized = false;
    this.core = null;
    this.initPromise = null;
  }
}

// Create global app instance
const app = new OperatorUpliftApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.init().catch(error => {
      console.error('Failed to initialize app:', error);
    });
  });
} else {
  // DOM is already ready
  app.init().catch(error => {
    console.error('Failed to initialize app:', error);
  });
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  app.cleanup();
});

// Export the app instance
export default app;
