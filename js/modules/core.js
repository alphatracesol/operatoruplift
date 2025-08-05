// Core Application Module
// Handles initialization, state management, and global utilities

import ErrorBoundary from '../managers/ErrorBoundary.js';
import MemoryManager from '../managers/MemoryManager.js';
import PerformanceManager from '../managers/PerformanceManager.js';
import ZIndexManager from '../managers/ZIndexManager.js';
import CookieBannerManager from '../managers/CookieBannerManager.js';

class CoreModule {
  constructor() {
    this.state = {
      firebaseReady: false,
      currentUser: null,
      userData: null,
      localGoals: {},
      communityTemplates: {},
      leaderboardData: [],
      friendsData: [],
      globalChallenges: {},
      activeView: 'auth',
      showingArchived: false,
      particlesInstance: null,
      energyInterval: null,
      matrixInterval: null,
      calendarDate: new Date(),
      isLoading: false,
      error: null
    };

    this.modules = new Map();
    this.errorBoundary = null;
    this.memoryManager = null;
    this.performanceManager = null;
  }

  // Initialize core application
  async init() {
    try {
      console.log('🚀 Initializing Operator Uplift Core...');

      // Initialize managers
      this.initManagers();

      // Initialize modules
      await this.initModules();

      // Setup global event listeners
      this.setupGlobalListeners();

      // Initialize UI
      this.initUI();

      console.log('✅ Core initialization complete');

    } catch (error) {
      console.error('❌ Core initialization failed:', error);
      this.errorBoundary?.catchError(error, 'core-init');
    }
  }

  // Initialize management systems
  initManagers() {
    // Error Boundary
    this.errorBoundary = new ErrorBoundary();

    // Memory Manager
    this.memoryManager = new MemoryManager();
    this.memoryManager.init();

    // Performance Manager
    this.performanceManager = new PerformanceManager();
    this.performanceManager.init();

    // Z-Index Manager
    this.zIndexManager = new ZIndexManager();
    this.zIndexManager.init();

    // Cookie Banner Manager
    this.cookieBannerManager = new CookieBannerManager();
    this.cookieBannerManager.init();
  }

  // Initialize all modules
  async initModules() {
    const moduleLoaders = [
      { name: 'auth', loader: () => import('./auth.js') },
      { name: 'ui', loader: () => import('./ui.js') },
      { name: 'ai', loader: () => import('./ai.js') },
      { name: 'goals', loader: () => import('./goals.js') },
      { name: 'gamification', loader: () => import('./gamification.js') },
      { name: 'analytics', loader: () => import('./analytics.js') },
      { name: 'storage', loader: () => import('./storage.js') }
    ];

    for (const { name, loader } of moduleLoaders) {
      try {
        const module = await loader();
        const instance = new module.default(this);
        this.modules.set(name, instance);
        console.log(`✅ ${name} module loaded`);
      } catch (error) {
        console.error(`❌ Failed to load ${name} module:`, error);
        this.errorBoundary?.catchError(error, `module-${name}`);
      }
    }
  }

  // Setup global event listeners
  setupGlobalListeners() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.errorBoundary?.catchError(event.error, 'global');
    });

    // Global unhandled rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.errorBoundary?.catchError(new Error(event.reason), 'promise');
    });

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseBackgroundProcesses();
      } else {
        this.resumeBackgroundProcesses();
      }
    });

    // Window resize with throttling
    const throttledResize = this.performanceManager?.throttle(() => {
      this.handleResize();
    }, 250) || (() => {});

    window.addEventListener('resize', throttledResize);
  }

  // Initialize UI
  initUI() {
    // Show loading overlay
    this.showLoading();

    // Initialize responsive design
    this.initResponsiveDesign();

    // Setup navigation
    this.setupNavigation();

    // Hide loading overlay
    setTimeout(() => {
      this.hideLoading();
    }, 1000);
  }

  // Initialize responsive design
  initResponsiveDesign() {
    const mediaQueries = {
      mobile: window.matchMedia('(max-width: 768px)'),
      tablet: window.matchMedia('(min-width: 769px) and (max-width: 1024px)'),
      desktop: window.matchMedia('(min-width: 1025px)')
    };

    // Handle initial state
    this.handleResponsiveChange(mediaQueries);

    // Listen for changes
    Object.entries(mediaQueries).forEach(([device, mq]) => {
      mq.addEventListener('change', () => {
        this.handleResponsiveChange(mediaQueries);
      });
    });
  }

  // Handle responsive design changes
  handleResponsiveChange(mediaQueries) {
    const { body } = document;

    // Remove existing classes
    body.classList.remove('mobile', 'tablet', 'desktop');

    // Add appropriate class
    if (mediaQueries.mobile.matches) {
      body.classList.add('mobile');
      this.handleMobileLayout();
    } else if (mediaQueries.tablet.matches) {
      body.classList.add('tablet');
      this.handleTabletLayout();
    } else if (mediaQueries.desktop.matches) {
      body.classList.add('desktop');
      this.handleDesktopLayout();
    }
  }

  // Handle mobile layout
  handleMobileLayout() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    if (sidebar) {
      sidebar.classList.add('mobile-sidebar');
    }

    if (mainContent) {
      mainContent.classList.add('mobile-content');
    }
  }

  // Handle tablet layout
  handleTabletLayout() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    if (sidebar) {
      sidebar.classList.remove('mobile-sidebar');
      sidebar.style.width = '220px';
    }

    if (mainContent) {
      mainContent.classList.remove('mobile-content');
      mainContent.style.marginLeft = '220px';
    }
  }

  // Handle desktop layout
  handleDesktopLayout() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');

    if (sidebar) {
      sidebar.classList.remove('mobile-sidebar');
      sidebar.style.width = '250px';
    }

    if (mainContent) {
      mainContent.classList.remove('mobile-content');
      mainContent.style.marginLeft = '250px';
    }
  }

  // Setup navigation
  setupNavigation() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (sidebar?.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                !menuToggle?.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });
  }

  // Handle window resize
  handleResize() {
    // Trigger responsive design update
    this.initResponsiveDesign();

    // Update any layout-dependent components
    this.modules.get('ui')?.handleResize?.();
  }

  // Pause background processes
  pauseBackgroundProcesses() {
    // Pause animations
    if (this.state.particlesInstance) {
      this.state.particlesInstance.pause();
    }

    // Clear intervals
    if (this.state.energyInterval) {
      clearInterval(this.state.energyInterval);
    }

    if (this.state.matrixInterval) {
      clearInterval(this.state.matrixInterval);
    }
  }

  // Resume background processes
  resumeBackgroundProcesses() {
    // Resume animations
    if (this.state.particlesInstance) {
      this.state.particlesInstance.resume();
    }

    // Restart intervals
    this.modules.get('gamification')?.startEnergySystem?.();
    this.modules.get('ui')?.startMatrixRain?.();
  }

  // Show loading overlay
  showLoading() {
    this.state.isLoading = true;
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
    }
  }

  // Hide loading overlay
  hideLoading() {
    this.state.isLoading = false;
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  // Get module instance
  getModule(name) {
    return this.modules.get(name);
  }

  // Update state
  updateState(updates) {
    this.state = { ...this.state, ...updates };
    this.notifyModules('stateChanged', this.state);
  }

  // Notify all modules of an event
  notifyModules(event, data) {
    this.modules.forEach(module => {
      if (module.onEvent) {
        module.onEvent(event, data);
      }
    });
  }

  // Cleanup
  cleanup() {
    this.memoryManager?.cleanup();
    this.modules.forEach(module => {
      if (module.cleanup) {
        module.cleanup();
      }
    });
  }
}

// Export the core module
export default CoreModule;
