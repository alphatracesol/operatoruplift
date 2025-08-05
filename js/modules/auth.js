// Authentication Module
// Handles user authentication, registration, and session management

class AuthModule {
  constructor(core) {
    this.core = core;
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authListeners = [];
  }

  // Initialize authentication module
  async init() {
    try {
      console.log('🔐 Initializing Authentication Module...');

      // Check for existing session
      await this.checkExistingSession();

      // Setup event listeners
      this.setupEventListeners();

      console.log('✅ Authentication Module initialized');

    } catch (error) {
      console.error('❌ Authentication Module initialization failed:', error);
      this.core.errorBoundary?.catchError(error, 'auth-init');
    }
  }

  // Check for existing session
  async checkExistingSession() {
    try {
      const savedUser = localStorage.getItem('operatorUpliftUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        await this.loginWithSavedData(userData);
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      localStorage.removeItem('operatorUpliftUser');
    }
  }

  // Setup authentication event listeners
  setupEventListeners() {
    // Login form
    this.safeAddEventListener('login-form', 'submit', async (e) => {
      e.preventDefault();
      await this.handleLogin(e.target);
    });

    // Register form
    this.safeAddEventListener('register-form', 'submit', async (e) => {
      e.preventDefault();
      await this.handleRegister(e.target);
    });

    // Logout button
    this.safeAddEventListener('logout-btn', 'click', () => {
      this.logout();
    });

    // Auth toggle buttons
    this.safeAddEventListener('show-register-btn', 'click', () => {
      this.showRegisterForm();
    });

    this.safeAddEventListener('show-login-btn', 'click', () => {
      this.showLoginForm();
    });
  }

  // Handle login
  async handleLogin(form) {
    try {
      this.core.showLoading();

      const formData = new FormData(form);
      const email = formData.get('email') || '';
      const password = formData.get('password') || '';

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Mock login for now (replace with real Firebase auth)
      await this.mockLogin(email, password);

      this.core.hideLoading();

    } catch (error) {
      console.error('Login failed:', error);
      this.core.hideLoading();
      this.showError(`Login failed: ${error.message}`);
      this.core.errorBoundary?.catchError(error, 'auth-login');
    }
  }

  // Handle registration
  async handleRegister(form) {
    try {
      this.core.showLoading();

      const formData = new FormData(form);
      const email = formData.get('email') || '';
      const password = formData.get('password') || '';
      const confirmPassword = formData.get('confirm-password') || '';
      const username = formData.get('username') || '';

      if (!email || !password || !confirmPassword || !username) {
        throw new Error('All fields are required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Mock registration for now (replace with real Firebase auth)
      await this.mockRegister(email, password, username);

      this.core.hideLoading();

    } catch (error) {
      console.error('Registration failed:', error);
      this.core.hideLoading();
      this.showError(`Registration failed: ${error.message}`);
      this.core.errorBoundary?.catchError(error, 'auth-register');
    }
  }

  // Mock login (replace with real Firebase auth)
  async mockLogin(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Create mock user data
          const userData = {
            uid: `mock-user-${Date.now()}`,
            email,
            displayName: email.split('@')[0],
            photoURL: null,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };

          // Initialize user profile
          const userProfile = {
            ...userData,
            settings: {
              theme: 'dark',
              notifications: true,
              soundEnabled: true,
              colorScheme: 'default'
            },
            stats: {
              level: 1,
              experience: 0,
              energy: 100,
              streak: 0,
              totalGoals: 0,
              completedGoals: 0,
              totalTasks: 0,
              completedTasks: 0
            },
            inventory: {
              unlockedThemes: ['default'],
              items: [],
              currency: 100
            },
            achievements: [],
            goals: [],
            tasks: []
          };

          this.loginWithSavedData(userProfile);
          resolve(userProfile);

        } catch (error) {
          reject(error);
        }
      }, 1000); // Simulate network delay
    });
  }

  // Mock registration (replace with real Firebase auth)
  async mockRegister(email, password, username) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Create mock user data
          const userData = {
            uid: `mock-user-${Date.now()}`,
            email,
            displayName: username,
            photoURL: null,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };

          // Initialize user profile
          const userProfile = {
            ...userData,
            settings: {
              theme: 'dark',
              notifications: true,
              soundEnabled: true,
              colorScheme: 'default'
            },
            stats: {
              level: 1,
              experience: 0,
              energy: 100,
              streak: 0,
              totalGoals: 0,
              completedGoals: 0,
              totalTasks: 0,
              completedTasks: 0
            },
            inventory: {
              unlockedThemes: ['default'],
              items: [],
              currency: 100
            },
            achievements: [],
            goals: [],
            tasks: []
          };

          this.loginWithSavedData(userProfile);
          resolve(userProfile);

        } catch (error) {
          reject(error);
        }
      }, 1000); // Simulate network delay
    });
  }

  // Login with saved data
  async loginWithSavedData(userData) {
    try {
      this.currentUser = userData;
      this.isAuthenticated = true;

      // Save to localStorage
      localStorage.setItem('operatorUpliftUser', JSON.stringify(userData));

      // Update core state
      this.core.updateState({
        currentUser: userData,
        userData,
        activeView: 'dashboard'
      });

      // Update UI
      this.updateAuthUI();

      // Notify listeners
      this.notifyAuthListeners('login', userData);

      console.log('✅ User logged in:', userData.displayName);

    } catch (error) {
      console.error('Error logging in with saved data:', error);
      this.core.errorBoundary?.catchError(error, 'auth-login-saved');
    }
  }

  // Logout
  logout() {
    try {
      // Clear user data
      this.currentUser = null;
      this.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem('operatorUpliftUser');

      // Update core state
      this.core.updateState({
        currentUser: null,
        userData: null,
        activeView: 'auth'
      });

      // Update UI
      this.updateAuthUI();

      // Notify listeners
      this.notifyAuthListeners('logout');

      console.log('✅ User logged out');

    } catch (error) {
      console.error('Error during logout:', error);
      this.core.errorBoundary?.catchError(error, 'auth-logout');
    }
  }

  // Update authentication UI
  updateAuthUI() {
    const authWrapper = document.getElementById('auth-view-wrapper');
    const dashboardWrapper = document.getElementById('dashboard-view-wrapper');
    const header = document.getElementById('app-header');
    const sidebar = document.getElementById('sidebar');

    if (this.isAuthenticated) {
      // Show dashboard
      if (authWrapper) {authWrapper.style.display = 'none';}
      if (dashboardWrapper) {dashboardWrapper.style.display = 'block';}
      if (header) {header.style.display = 'flex';}
      if (sidebar) {sidebar.style.display = 'flex';}

      // Update user info in header
      this.updateUserInfo();

    } else {
      // Show auth
      if (authWrapper) {authWrapper.style.display = 'flex';}
      if (dashboardWrapper) {dashboardWrapper.style.display = 'none';}
      if (header) {header.style.display = 'none';}
      if (sidebar) {sidebar.style.display = 'none';}
    }
  }

  // Update user info in header
  updateUserInfo() {
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement && this.currentUser) {
      userInfoElement.innerHTML = `
                <div class="user-avatar">
                    ${this.currentUser.photoURL ?
    `<img src="${this.currentUser.photoURL}" alt="${this.currentUser.displayName}">` :
    `<div class="avatar-placeholder">${this.currentUser.displayName.charAt(0).toUpperCase()}</div>`
}
                </div>
                <div class="user-details">
                    <div class="user-name">${this.currentUser.displayName}</div>
                    <div class="user-level">Level ${this.currentUser.stats?.level || 1}</div>
                </div>
            `;
    }
  }

  // Show register form
  showRegisterForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {loginForm.style.display = 'none';}
    if (registerForm) {registerForm.style.display = 'block';}
  }

  // Show login form
  showLoginForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {loginForm.style.display = 'block';}
    if (registerForm) {registerForm.style.display = 'none';}
  }

  // Show error message
  showError(message) {
    const errorElement = document.getElementById('auth-error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';

      // Hide after 5 seconds
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 5000);
    }
  }

  // Add authentication listener
  addAuthListener(callback) {
    this.authListeners.push(callback);
  }

  // Remove authentication listener
  removeAuthListener(callback) {
    const index = this.authListeners.indexOf(callback);
    if (index > -1) {
      this.authListeners.splice(index, 1);
    }
  }

  // Notify authentication listeners
  notifyAuthListeners(event, data) {
    this.authListeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  // Safe event listener helper
  safeAddEventListener(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener(event, handler);
    } else {
      console.warn(`Element with id '${elementId}' not found for event '${event}'`);
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  // Update user data
  updateUserData(updates) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      localStorage.setItem('operatorUpliftUser', JSON.stringify(this.currentUser));
      this.core.updateState({ userData: this.currentUser });
    }
  }

  // Handle module events
  onEvent(event, data) {
    switch (event) {
    case 'stateChanged':
      // Handle state changes if needed
      break;
    }
  }

  // Cleanup
  cleanup() {
    this.authListeners = [];
  }
}

// Export the auth module
export default AuthModule;
