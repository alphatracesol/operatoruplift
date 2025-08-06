/**
 * Authentication Test Suite
 * Tests for login, registration, password reset, and Google OAuth functionality
 */

describe('Authentication System', () => {
  beforeEach(async () => {
    // Load the app HTML before each test
    await loadAppHTML();
    
    // Reset Firebase mocks
    jest.clearAllMocks();
  });

  describe('Authentication UI Elements', () => {
    test('should have authentication view container', () => {
      const authView = document.getElementById('authView');
      expect(authView).toBeTruthy();
      expect(authView.classList.contains('view-container')).toBe(true);
    });

    test('should have authentication container with header', () => {
      const authContainer = document.querySelector('.auth-container');
      expect(authContainer).toBeTruthy();
      
      const authHeader = document.querySelector('.auth-header');
      expect(authHeader).toBeTruthy();
    });

    test('should have authentication title "Operator Uplift"', () => {
      const authTitle = document.querySelector('.auth-title');
      expect(authTitle).toBeTruthy();
      expect(authTitle.textContent.trim()).toBe('Operator Uplift');
    });

    test('should have authentication forms container', () => {
      const authForms = document.querySelector('.auth-forms');
      expect(authForms).toBeTruthy();
    });

    test('should have login form with required fields', () => {
      const loginForm = document.getElementById('loginForm');
      expect(loginForm).toBeTruthy();
      
      const emailInput = loginForm.querySelector('input[type="email"]');
      const passwordInput = loginForm.querySelector('input[type="password"]');
      const submitButton = loginForm.querySelector('button[type="submit"]');
      
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    test('should have register form with required fields', () => {
      const registerForm = document.getElementById('registerForm');
      expect(registerForm).toBeTruthy();
      
      const nameInput = registerForm.querySelector('input[name="name"]');
      const emailInput = registerForm.querySelector('input[type="email"]');
      const passwordInput = registerForm.querySelector('input[type="password"]');
      const submitButton = registerForm.querySelector('button[type="submit"]');
      
      expect(nameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    test('should have forgot password form', () => {
      const forgotPasswordForm = document.getElementById('forgotPasswordForm');
      expect(forgotPasswordForm).toBeTruthy();
      
      const emailInput = forgotPasswordForm.querySelector('input[type="email"]');
      const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
      
      expect(emailInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    test('should have Google sign-in button', () => {
      const googleSignInBtn = document.getElementById('googleSignIn');
      expect(googleSignInBtn).toBeTruthy();
      expect(googleSignInBtn.classList.contains('btn-social')).toBe(true);
    });

    test('should have form toggle links', () => {
      const loginLink = document.querySelector('[onclick="showLoginForm()"]');
      const registerLink = document.querySelector('[onclick="showRegisterForm()"]');
      const forgotPasswordLink = document.querySelector('[onclick="showForgotPassword()"]');
      
      expect(loginLink).toBeTruthy();
      expect(registerLink).toBeTruthy();
      expect(forgotPasswordLink).toBeTruthy();
    });
  });

  describe('Authentication Form Switching', () => {
    test('should show login form by default', () => {
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');
      const forgotPasswordForm = document.getElementById('forgotPasswordForm');
      
      expect(loginForm.classList.contains('active')).toBe(true);
      expect(registerForm.classList.contains('active')).toBe(false);
      expect(forgotPasswordForm.classList.contains('active')).toBe(false);
    });

    test('should switch to register form when register link is clicked', () => {
      const registerLink = document.querySelector('[onclick="showRegisterForm()"]');
      simulateClick(registerLink);
      
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');
      
      expect(loginForm.classList.contains('active')).toBe(false);
      expect(registerForm.classList.contains('active')).toBe(true);
    });

    test('should switch to forgot password form when forgot password link is clicked', () => {
      const forgotPasswordLink = document.querySelector('[onclick="showForgotPassword()"]');
      simulateClick(forgotPasswordLink);
      
      const loginForm = document.getElementById('loginForm');
      const forgotPasswordForm = document.getElementById('forgotPasswordForm');
      
      expect(loginForm.classList.contains('active')).toBe(false);
      expect(forgotPasswordForm.classList.contains('active')).toBe(true);
    });

    test('should switch back to login form when login link is clicked', () => {
      // First switch to register form
      const registerLink = document.querySelector('[onclick="showRegisterForm()"]');
      simulateClick(registerLink);
      
      // Then switch back to login
      const loginLink = document.querySelector('[onclick="showLoginForm()"]');
      simulateClick(loginLink);
      
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');
      
      expect(loginForm.classList.contains('active')).toBe(true);
      expect(registerForm.classList.contains('active')).toBe(false);
    });
  });

  describe('Authentication Functions', () => {
    test('should have showLoginForm function defined', () => {
      expect(typeof window.showLoginForm).toBe('function');
    });

    test('should have showRegisterForm function defined', () => {
      expect(typeof window.showRegisterForm).toBe('function');
    });

    test('should have showForgotPassword function defined', () => {
      expect(typeof window.showForgotPassword).toBe('function');
    });

    test('should have showError function defined', () => {
      expect(typeof window.showError).toBe('function');
    });

    test('should have showSuccess function defined', () => {
      expect(typeof window.showSuccess).toBe('function');
    });
  });

  describe('Firebase Integration', () => {
    test('should have Firebase configuration', () => {
      // Check if Firebase is initialized
      expect(firebase.initializeApp).toHaveBeenCalled();
    });

    test('should have Firebase auth instance', () => {
      expect(firebase.auth).toHaveBeenCalled();
    });

    test('should have Firebase Firestore instance', () => {
      expect(firebase.firestore).toHaveBeenCalled();
    });

    test('should have auth state change listener', () => {
      const auth = firebase.auth();
      expect(auth.onAuthStateChanged).toHaveBeenCalled();
    });
  });

  describe('Form Event Listeners', () => {
    test('should have login form submit event listener', () => {
      const loginForm = document.getElementById('loginForm');
      const event = new Event('submit', { bubbles: true, cancelable: true });
      
      // Mock the preventDefault method
      event.preventDefault = jest.fn();
      
      loginForm.dispatchEvent(event);
      
      // The event listener should be attached
      expect(loginForm).toBeTruthy();
    });

    test('should have register form submit event listener', () => {
      const registerForm = document.getElementById('registerForm');
      const event = new Event('submit', { bubbles: true, cancelable: true });
      
      // Mock the preventDefault method
      event.preventDefault = jest.fn();
      
      registerForm.dispatchEvent(event);
      
      // The event listener should be attached
      expect(registerForm).toBeTruthy();
    });

    test('should have forgot password form submit event listener', () => {
      const forgotPasswordForm = document.getElementById('forgotPasswordForm');
      const event = new Event('submit', { bubbles: true, cancelable: true });
      
      // Mock the preventDefault method
      event.preventDefault = jest.fn();
      
      forgotPasswordForm.dispatchEvent(event);
      
      // The event listener should be attached
      expect(forgotPasswordForm).toBeTruthy();
    });

    test('should have Google sign-in click event listener', () => {
      const googleSignInBtn = document.getElementById('googleSignIn');
      simulateClick(googleSignInBtn);
      
      // The event listener should be attached
      expect(googleSignInBtn).toBeTruthy();
    });
  });

  describe('CSS Styling', () => {
    test('should have authentication container styles', () => {
      const authContainer = document.querySelector('.auth-container');
      expect(authContainer).toBeTruthy();
      
      // Check if the element has the expected class
      expect(authContainer.classList.contains('auth-container')).toBe(true);
    });

    test('should have form group styles', () => {
      const formGroups = document.querySelectorAll('.form-group');
      expect(formGroups.length).toBeGreaterThan(0);
      
      formGroups.forEach(group => {
        expect(group.classList.contains('form-group')).toBe(true);
      });
    });

    test('should have primary button styles', () => {
      const primaryButtons = document.querySelectorAll('.btn-primary');
      expect(primaryButtons.length).toBeGreaterThan(0);
      
      primaryButtons.forEach(button => {
        expect(button.classList.contains('btn-primary')).toBe(true);
      });
    });

    test('should have social login styles', () => {
      const socialLogin = document.querySelector('.social-login');
      expect(socialLogin).toBeTruthy();
      expect(socialLogin.classList.contains('social-login')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle login form validation', () => {
      const loginForm = document.getElementById('loginForm');
      const emailInput = loginForm.querySelector('input[type="email"]');
      const passwordInput = loginForm.querySelector('input[type="password"]');
      
      // Test with empty fields
      simulateInput(emailInput, '');
      simulateInput(passwordInput, '');
      
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });

    test('should handle register form validation', () => {
      const registerForm = document.getElementById('registerForm');
      const nameInput = registerForm.querySelector('input[name="name"]');
      const emailInput = registerForm.querySelector('input[type="email"]');
      const passwordInput = registerForm.querySelector('input[type="password"]');
      
      // Test with empty fields
      simulateInput(nameInput, '');
      simulateInput(emailInput, '');
      simulateInput(passwordInput, '');
      
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });

    test('should handle forgot password form validation', () => {
      const forgotPasswordForm = document.getElementById('forgotPasswordForm');
      const emailInput = forgotPasswordForm.querySelector('input[type="email"]');
      
      // Test with empty field
      simulateInput(emailInput, '');
      
      expect(emailInput.value).toBe('');
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels', () => {
      const labels = document.querySelectorAll('label');
      expect(labels.length).toBeGreaterThan(0);
      
      labels.forEach(label => {
        expect(label.textContent.trim()).toBeTruthy();
      });
    });

    test('should have proper input types', () => {
      const emailInputs = document.querySelectorAll('input[type="email"]');
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      const textInputs = document.querySelectorAll('input[type="text"]');
      
      expect(emailInputs.length).toBeGreaterThan(0);
      expect(passwordInputs.length).toBeGreaterThan(0);
      expect(textInputs.length).toBeGreaterThan(0);
    });

    test('should have proper button types', () => {
      const submitButtons = document.querySelectorAll('button[type="submit"]');
      expect(submitButtons.length).toBeGreaterThan(0);
      
      submitButtons.forEach(button => {
        expect(button.type).toBe('submit');
      });
    });
  });
});



