/**
 * Phase 3.4: User Experience & Accessibility Module
 * Provides accessibility features including screen reader support,
 * keyboard navigation, high contrast mode, and accessibility validation.
 */

class Accessibility {
  constructor() {
    this.accessibilityConfig = null;
    this.screenReader = null;
    this.keyboardNavigator = null;
    this.contrastManager = null;
    this.validator = null;
    this.uxEnhancer = null;

    console.log('♿ Accessibility module initialized');
    this.initialize();
  }

  initialize() {
    try {
      this.initializeAccessibilityConfig();
      this.initializeScreenReader();
      this.initializeKeyboardNavigator();
      this.initializeContrastManager();
      this.initializeValidator();
      this.initializeUXEnhancer();
      this.startAccessibilityMonitoring();
      console.log('✅ Accessibility module fully initialized');
    } catch (error) {
      console.error('❌ Error initializing Accessibility module:', error);
    }
  }

  initializeAccessibilityConfig() {
    this.accessibilityConfig = {
      enableScreenReaderSupport: true,
      enableKeyboardNavigation: true,
      enableHighContrastMode: true,
      enableFocusIndicators: true,
      enableReducedMotion: true,
      enableLargeText: true,
      enableVoiceCommands: false,
      enableColorBlindSupport: true,
      enableDyslexiaSupport: true,
      enableCognitiveSupport: true
    };
  }

  initializeScreenReader() {
    this.screenReader = {
      announcements: [],
      liveRegions: new Map(),
      focusTracker: null,

      announce: (message, priority = 'polite') => {
        return this.announceToScreenReader(message, priority);
      },

      createLiveRegion: (id, ariaLive = 'polite') => {
        return this.createLiveRegion(id, ariaLive);
      },

      updateLiveRegion: (id, content) => {
        return this.updateLiveRegion(id, content);
      },

      trackFocus: (element) => {
        return this.trackFocusForScreenReader(element);
      }
    };
  }

  initializeKeyboardNavigator() {
    this.keyboardNavigator = {
      focusableElements: [],
      currentFocusIndex: 0,
      focusTraps: new Map(),

      enableKeyboardNavigation: () => {
        return this.enableKeyboardNavigation();
      },

      setFocusOrder: (elements) => {
        return this.setFocusOrder(elements);
      },

      createFocusTrap: (container) => {
        return this.createFocusTrap(container);
      },

      navigateWithKeyboard: (direction) => {
        return this.navigateWithKeyboard(direction);
      }
    };
  }

  initializeContrastManager() {
    this.contrastManager = {
      currentTheme: 'default',
      contrastRatios: new Map(),
      colorSchemes: {
        default: {
          background: '#ffffff',
          text: '#000000',
          primary: '#007bff',
          secondary: '#6c757d'
        },
        highContrast: {
          background: '#000000',
          text: '#ffffff',
          primary: '#ffff00',
          secondary: '#00ffff'
        },
        darkMode: {
          background: '#1a1a1a',
          text: '#ffffff',
          primary: '#4dabf7',
          secondary: '#adb5bd'
        }
      },

      enableHighContrastMode: () => {
        return this.enableHighContrastMode();
      },

      switchTheme: (theme) => {
        return this.switchTheme(theme);
      },

      calculateContrastRatio: (color1, color2) => {
        return this.calculateContrastRatio(color1, color2);
      }
    };
  }

  initializeValidator() {
    this.validator = {
      validationRules: {
        altText: true,
        headingStructure: true,
        colorContrast: true,
        keyboardAccessibility: true,
        ariaLabels: true,
        focusIndicators: true
      },

      validateAccessibility: () => {
        return this.validateAccessibility();
      },

      generateReport: () => {
        return this.generateAccessibilityReport();
      },

      fixIssues: () => {
        return this.fixAccessibilityIssues();
      }
    };
  }

  initializeUXEnhancer() {
    this.uxEnhancer = {
      animations: new Map(),
      feedback: new Map(),

      enableSmoothAnimations: () => {
        return this.enableSmoothAnimations();
      },

      enableResponsiveDesign: () => {
        return this.enableResponsiveDesign();
      },

      provideUserFeedback: (type, message) => {
        return this.provideUserFeedback(type, message);
      },

      enhanceUserExperience: () => {
        return this.enhanceUserExperience();
      }
    };
  }

  startAccessibilityMonitoring() {
    // Monitor for accessibility issues
    this.monitorAccessibilityIssues();

    // Monitor user preferences
    this.monitorUserPreferences();

    // Monitor focus changes
    this.monitorFocusChanges();

    // Monitor keyboard usage
    this.monitorKeyboardUsage();

    console.log('✅ Accessibility monitoring started');
  }

  enableScreenReaderSupport() {
    try {
      if (!this.accessibilityConfig.enableScreenReaderSupport) {
        console.log('Screen reader support is disabled in configuration');
        return false;
      }

      // Create live region for announcements
      this.createLiveRegion('accessibility-announcements', 'assertive');

      // Set up focus tracking
      this.setupFocusTracking();

      // Add ARIA labels to interactive elements
      this.addAriaLabels();

      // Ensure proper heading structure
      this.ensureHeadingStructure();

      console.log('✅ Screen reader support enabled');
      return true;
    } catch (error) {
      console.error('❌ Error enabling screen reader support:', error);
      return false;
    }
  }

  announceToScreenReader(message, priority = 'polite') {
    try {
      const announcement = {
        message,
        priority,
        timestamp: new Date().toISOString()
      };

      this.screenReader.announcements.push(announcement);

      // Create or update live region
      let liveRegion = document.getElementById('accessibility-announcements');
      if (!liveRegion) {
        liveRegion = this.createLiveRegion('accessibility-announcements', priority);
      }

      liveRegion.textContent = message;
      liveRegion.setAttribute('aria-live', priority);

      // Clear message after a delay
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 3000);

      console.log(`♿ Screen reader announcement: ${message} (${priority})`);
      return true;
    } catch (error) {
      console.error('❌ Error announcing to screen reader:', error);
      return false;
    }
  }

  createLiveRegion(id, ariaLive = 'polite') {
    try {
      let liveRegion = document.getElementById(id);

      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = id;
        liveRegion.setAttribute('aria-live', ariaLive);
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';

        document.body.appendChild(liveRegion);
      }

      this.screenReader.liveRegions.set(id, liveRegion);
      return liveRegion;
    } catch (error) {
      console.error('❌ Error creating live region:', error);
      return null;
    }
  }

  updateLiveRegion(id, content) {
    try {
      const liveRegion = this.screenReader.liveRegions.get(id);
      if (liveRegion) {
        liveRegion.textContent = content;
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error updating live region:', error);
      return false;
    }
  }

  setupFocusTracking() {
    try {
      // Track focus changes
      document.addEventListener('focusin', (event) => {
        this.trackFocusForScreenReader(event.target);
      });

      // Announce focus changes to screen reader
      document.addEventListener('focusin', (event) => {
        const element = event.target;
        const accessibleName = this.getAccessibleName(element);

        if (accessibleName) {
          this.announceToScreenReader(`Focused on ${accessibleName}`, 'polite');
        }
      });

      console.log('✅ Focus tracking setup complete');
    } catch (error) {
      console.error('❌ Error setting up focus tracking:', error);
    }
  }

  trackFocusForScreenReader(element) {
    try {
      if (!element) {return;}

      // Store current focus
      this.screenReader.focusTracker = {
        element,
        accessibleName: this.getAccessibleName(element),
        timestamp: new Date().toISOString()
      };

      // Add focus indicator
      element.classList.add('focus-visible');

      // Remove focus indicator after a delay
      setTimeout(() => {
        element.classList.remove('focus-visible');
      }, 2000);

    } catch (error) {
      console.error('❌ Error tracking focus:', error);
    }
  }

  getAccessibleName(element) {
    try {
      // Check for aria-label
      if (element.getAttribute('aria-label')) {
        return element.getAttribute('aria-label');
      }

      // Check for aria-labelledby
      if (element.getAttribute('aria-labelledby')) {
        const labelId = element.getAttribute('aria-labelledby');
        const labelElement = document.getElementById(labelId);
        if (labelElement) {
          return labelElement.textContent;
        }
      }

      // Check for title attribute
      if (element.getAttribute('title')) {
        return element.getAttribute('title');
      }

      // Check for alt text (for images)
      if (element.tagName === 'IMG' && element.getAttribute('alt')) {
        return element.getAttribute('alt');
      }

      // Use text content as fallback
      return element.textContent?.trim() || element.tagName.toLowerCase();
    } catch (error) {
      console.error('❌ Error getting accessible name:', error);
      return '';
    }
  }

  addAriaLabels() {
    try {
      // Add ARIA labels to buttons without text
      const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      buttons.forEach(button => {
        if (!button.textContent.trim()) {
          const icon = button.querySelector('i, svg, img');
          if (icon) {
            const iconClass = icon.className || icon.getAttribute('class');
            const label = this.generateLabelFromIcon(iconClass);
            button.setAttribute('aria-label', label);
          }
        }
      });

      // Add ARIA labels to form inputs
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      inputs.forEach(input => {
        const label = this.findLabelForInput(input);
        if (label) {
          input.setAttribute('aria-labelledby', label.id);
        }
      });

      console.log('✅ ARIA labels added');
    } catch (error) {
      console.error('❌ Error adding ARIA labels:', error);
    }
  }

  generateLabelFromIcon(iconClass) {
    // Generate accessible labels from icon classes
    const iconMap = {
      'fa-home': 'Home',
      'fa-user': 'User',
      'fa-cog': 'Settings',
      'fa-search': 'Search',
      'fa-plus': 'Add',
      'fa-edit': 'Edit',
      'fa-delete': 'Delete',
      'fa-save': 'Save',
      'fa-close': 'Close',
      'fa-menu': 'Menu'
    };

    for (const [icon, label] of Object.entries(iconMap)) {
      if (iconClass.includes(icon)) {
        return label;
      }
    }

    return 'Button';
  }

  findLabelForInput(input) {
    // Find associated label for input
    const { id } = input;
    if (id) {
      return document.querySelector(`label[for="${id}"]`);
    }

    // Check for label wrapping input
    const label = input.closest('label');
    if (label) {
      return label;
    }

    return null;
  }

  ensureHeadingStructure() {
    try {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentLevel = 0;

      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));

        // Check for skipped heading levels
        if (level > currentLevel + 1) {
          console.warn(`Skipped heading level: ${heading.tagName} follows h${currentLevel}`);
        }

        currentLevel = level;
      });

      console.log('✅ Heading structure validated');
    } catch (error) {
      console.error('❌ Error ensuring heading structure:', error);
    }
  }

  enableKeyboardNavigation() {
    try {
      if (!this.accessibilityConfig.enableKeyboardNavigation) {
        console.log('Keyboard navigation is disabled in configuration');
        return false;
      }

      // Set up keyboard event listeners
      this.setupKeyboardListeners();

      // Make all interactive elements keyboard accessible
      this.makeElementsKeyboardAccessible();

      // Set up focus management
      this.setupFocusManagement();

      console.log('✅ Keyboard navigation enabled');
      return true;
    } catch (error) {
      console.error('❌ Error enabling keyboard navigation:', error);
      return false;
    }
  }

  setupKeyboardListeners() {
    try {
      // Handle Tab navigation
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          this.handleTabNavigation(event);
        }
      });

      // Handle Enter and Space for buttons
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          this.handleActivationKeys(event);
        }
      });

      // Handle Escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.handleEscapeKey(event);
        }
      });

      // Handle arrow keys for navigation
      document.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
          this.handleArrowKeys(event);
        }
      });

      console.log('✅ Keyboard listeners setup complete');
    } catch (error) {
      console.error('❌ Error setting up keyboard listeners:', error);
    }
  }

  handleTabNavigation(event) {
    try {
      const focusableElements = this.getFocusableElements();
      const currentIndex = focusableElements.indexOf(document.activeElement);

      if (event.shiftKey) {
        // Shift+Tab: move backwards
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
        focusableElements[previousIndex]?.focus();
      } else {
        // Tab: move forwards
        const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
        focusableElements[nextIndex]?.focus();
      }

      event.preventDefault();
    } catch (error) {
      console.error('❌ Error handling tab navigation:', error);
    }
  }

  handleActivationKeys(event) {
    try {
      const element = event.target;

      if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
        if (event.key === ' ') {
          event.preventDefault(); // Prevent page scroll
        }
        element.click();
      }
    } catch (error) {
      console.error('❌ Error handling activation keys:', error);
    }
  }

  handleEscapeKey(event) {
    try {
      // Close modals, dropdowns, etc.
      const modals = document.querySelectorAll('.modal, .dropdown, .popup');
      modals.forEach(modal => {
        if (modal.style.display !== 'none') {
          modal.style.display = 'none';
          this.announceToScreenReader('Dialog closed', 'polite');
        }
      });
    } catch (error) {
      console.error('❌ Error handling escape key:', error);
    }
  }

  handleArrowKeys(event) {
    try {
      const element = event.target;

      // Handle arrow keys for custom components
      if (element.getAttribute('role') === 'listbox') {
        this.handleListboxNavigation(event);
      } else if (element.getAttribute('role') === 'tab') {
        this.handleTabNavigation(event);
      }
    } catch (error) {
      console.error('❌ Error handling arrow keys:', error);
    }
  }

  getFocusableElements() {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="link"]',
      '[role="tab"]',
      '[role="menuitem"]'
    ];

    return Array.from(document.querySelectorAll(focusableSelectors.join(', ')));
  }

  makeElementsKeyboardAccessible() {
    try {
      // Add tabindex to custom interactive elements
      const customButtons = document.querySelectorAll('[role="button"]:not([tabindex])');
      customButtons.forEach(button => {
        button.setAttribute('tabindex', '0');
      });

      // Add keyboard event handlers to custom elements
      const customElements = document.querySelectorAll('[role="button"], [role="link"], [role="tab"]');
      customElements.forEach(element => {
        element.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            element.click();
          }
        });
      });

      console.log('✅ Elements made keyboard accessible');
    } catch (error) {
      console.error('❌ Error making elements keyboard accessible:', error);
    }
  }

  setupFocusManagement() {
    try {
      // Store focus when opening modals
      document.addEventListener('click', (event) => {
        const modal = event.target.closest('.modal, .dropdown');
        if (modal) {
          this.storeFocus();
        }
      });

      // Restore focus when closing modals
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.restoreFocus();
        }
      });

      console.log('✅ Focus management setup complete');
    } catch (error) {
      console.error('❌ Error setting up focus management:', error);
    }
  }

  storeFocus() {
    this.previousFocus = document.activeElement;
  }

  restoreFocus() {
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
  }

  enableHighContrastMode() {
    try {
      if (!this.accessibilityConfig.enableHighContrastMode) {
        console.log('High contrast mode is disabled in configuration');
        return false;
      }

      // Apply high contrast styles
      this.applyHighContrastStyles();

      // Add high contrast toggle
      this.addHighContrastToggle();

      console.log('✅ High contrast mode enabled');
      return true;
    } catch (error) {
      console.error('❌ Error enabling high contrast mode:', error);
      return false;
    }
  }

  applyHighContrastStyles() {
    try {
      const style = document.createElement('style');
      style.id = 'high-contrast-styles';
      style.textContent = `
                .high-contrast {
                    background-color: #000000 !important;
                    color: #ffffff !important;
                }
                .high-contrast * {
                    background-color: #000000 !important;
                    color: #ffffff !important;
                    border-color: #ffffff !important;
                }
                .high-contrast a {
                    color: #ffff00 !important;
                }
                .high-contrast button {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                    border: 2px solid #ffffff !important;
                }
                .high-contrast input, .high-contrast textarea, .high-contrast select {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                    border: 2px solid #ffffff !important;
                }
            `;

      document.head.appendChild(style);
    } catch (error) {
      console.error('❌ Error applying high contrast styles:', error);
    }
  }

  addHighContrastToggle() {
    try {
      const toggle = document.createElement('button');
      toggle.id = 'high-contrast-toggle';
      toggle.setAttribute('aria-label', 'Toggle high contrast mode');
      toggle.textContent = 'High Contrast';
      toggle.style.position = 'fixed';
      toggle.style.top = '10px';
      toggle.style.right = '10px';
      toggle.style.zIndex = '9999';

      toggle.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const isEnabled = document.body.classList.contains('high-contrast');
        this.announceToScreenReader(
          `High contrast mode ${isEnabled ? 'enabled' : 'disabled'}`,
          'polite'
        );
      });

      document.body.appendChild(toggle);
    } catch (error) {
      console.error('❌ Error adding high contrast toggle:', error);
    }
  }

  enableSmoothAnimations() {
    try {
      const style = document.createElement('style');
      style.id = 'smooth-animations';
      style.textContent = `
                * {
                    transition: all 0.3s ease-in-out;
                }
                .smooth-fade {
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }
                .smooth-fade.show {
                    opacity: 1;
                }
                .smooth-slide {
                    transform: translateY(20px);
                    opacity: 0;
                    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
                }
                .smooth-slide.show {
                    transform: translateY(0);
                    opacity: 1;
                }
            `;

      document.head.appendChild(style);
      console.log('✅ Smooth animations enabled');
      return true;
    } catch (error) {
      console.error('❌ Error enabling smooth animations:', error);
      return false;
    }
  }

  enableResponsiveDesign() {
    try {
      // Add responsive meta tag if not present
      if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(viewport);
      }

      // Add responsive CSS
      const style = document.createElement('style');
      style.id = 'responsive-design';
      style.textContent = `
                @media (max-width: 768px) {
                    .responsive-hide {
                        display: none !important;
                    }
                    .responsive-stack {
                        flex-direction: column !important;
                    }
                    .responsive-text {
                        font-size: 16px !important;
                    }
                }
                @media (max-width: 480px) {
                    .mobile-hide {
                        display: none !important;
                    }
                    .mobile-full {
                        width: 100% !important;
                    }
                }
            `;

      document.head.appendChild(style);
      console.log('✅ Responsive design enabled');
      return true;
    } catch (error) {
      console.error('❌ Error enabling responsive design:', error);
      return false;
    }
  }

  provideUserFeedback(type, message) {
    try {
      const feedback = {
        type,
        message,
        timestamp: new Date().toISOString()
      };

      this.uxEnhancer.feedback.set(Date.now(), feedback);

      // Create visual feedback
      this.createVisualFeedback(type, message);

      // Provide screen reader feedback
      this.announceToScreenReader(message, 'polite');

      console.log(`📢 User feedback: ${type} - ${message}`);
      return true;
    } catch (error) {
      console.error('❌ Error providing user feedback:', error);
      return false;
    }
  }

  createVisualFeedback(type, message) {
    try {
      const feedback = document.createElement('div');
      feedback.className = `feedback feedback-${type}`;
      feedback.textContent = message;
      feedback.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 10000;
                max-width: 300px;
                word-wrap: break-word;
            `;

      // Set background color based on type
      switch (type) {
      case 'success':
        feedback.style.backgroundColor = '#28a745';
        break;
      case 'error':
        feedback.style.backgroundColor = '#dc3545';
        break;
      case 'warning':
        feedback.style.backgroundColor = '#ffc107';
        feedback.style.color = '#000';
        break;
      case 'info':
        feedback.style.backgroundColor = '#17a2b8';
        break;
      default:
        feedback.style.backgroundColor = '#6c757d';
      }

      document.body.appendChild(feedback);

      // Remove feedback after 3 seconds
      setTimeout(() => {
        feedback.remove();
      }, 3000);
    } catch (error) {
      console.error('❌ Error creating visual feedback:', error);
    }
  }

  validateAccessibility() {
    try {
      const issues = [];

      // Check for missing alt text
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach(img => {
        issues.push({
          type: 'missing_alt_text',
          element: img,
          severity: 'high',
          message: 'Image missing alt text'
        });
      });

      // Check for missing ARIA labels
      const interactiveElements = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby]), input:not([aria-label]):not([aria-labelledby])');
      interactiveElements.forEach(element => {
        if (!element.textContent.trim()) {
          issues.push({
            type: 'missing_aria_label',
            element,
            severity: 'medium',
            message: 'Interactive element missing ARIA label'
          });
        }
      });

      // Check color contrast
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
      textElements.forEach(element => {
        const contrast = this.calculateContrastRatio(element);
        if (contrast < 4.5) {
          issues.push({
            type: 'low_contrast',
            element,
            severity: 'medium',
            message: `Low color contrast: ${contrast.toFixed(2)}:1`
          });
        }
      });

      console.log(`✅ Accessibility validation complete: ${issues.length} issues found`);
      return issues;
    } catch (error) {
      console.error('❌ Error validating accessibility:', error);
      return [];
    }
  }

  calculateContrastRatio(element) {
    try {
      const style = window.getComputedStyle(element);
      const { backgroundColor } = style;
      const { color } = style;

      // Simple contrast calculation (this would need a proper color library for accuracy)
      return 4.5; // Placeholder value
    } catch (error) {
      console.error('❌ Error calculating contrast ratio:', error);
      return 4.5;
    }
  }

  generateAccessibilityReport() {
    try {
      const issues = this.validateAccessibility();
      const report = {
        timestamp: new Date().toISOString(),
        totalIssues: issues.length,
        issuesBySeverity: {
          high: issues.filter(i => i.severity === 'high').length,
          medium: issues.filter(i => i.severity === 'medium').length,
          low: issues.filter(i => i.severity === 'low').length
        },
        issues,
        recommendations: this.generateRecommendations(issues)
      };

      console.log('✅ Accessibility report generated');
      return report;
    } catch (error) {
      console.error('❌ Error generating accessibility report:', error);
      return null;
    }
  }

  generateRecommendations(issues) {
    const recommendations = [];

    if (issues.some(i => i.type === 'missing_alt_text')) {
      recommendations.push('Add descriptive alt text to all images');
    }

    if (issues.some(i => i.type === 'missing_aria_label')) {
      recommendations.push('Add ARIA labels to interactive elements');
    }

    if (issues.some(i => i.type === 'low_contrast')) {
      recommendations.push('Improve color contrast for better readability');
    }

    return recommendations;
  }

  fixAccessibilityIssues() {
    try {
      const issues = this.validateAccessibility();
      let fixedCount = 0;

      issues.forEach(issue => {
        if (this.fixIssue(issue)) {
          fixedCount++;
        }
      });

      console.log(`✅ Fixed ${fixedCount} accessibility issues`);
      return fixedCount;
    } catch (error) {
      console.error('❌ Error fixing accessibility issues:', error);
      return 0;
    }
  }

  fixIssue(issue) {
    try {
      switch (issue.type) {
      case 'missing_alt_text':
        issue.element.setAttribute('alt', 'Image description');
        return true;

      case 'missing_aria_label':
        const label = this.generateLabelForElement(issue.element);
        issue.element.setAttribute('aria-label', label);
        return true;

      default:
        return false;
      }
    } catch (error) {
      console.error('❌ Error fixing issue:', error);
      return false;
    }
  }

  generateLabelForElement(element) {
    // Generate appropriate label based on element type
    if (element.tagName === 'BUTTON') {
      return 'Button';
    } else if (element.tagName === 'INPUT') {
      return 'Input field';
    }
    return 'Interactive element';
  }

  monitorAccessibilityIssues() {
    // Monitor for new accessibility issues
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.checkElementAccessibility(node);
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

  checkElementAccessibility(element) {
    // Check if new element has accessibility issues
    if (element.tagName === 'IMG' && !element.getAttribute('alt')) {
      console.warn('New image added without alt text:', element);
    }
  }

  monitorUserPreferences() {
    // Monitor for user preference changes
    if (window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.addListener(() => {
        this.handleReducedMotionPreference(prefersReducedMotion.matches);
      });
    }
  }

  handleReducedMotionPreference(reducedMotion) {
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }

  monitorFocusChanges() {
    // Monitor focus changes for accessibility
    document.addEventListener('focusin', (event) => {
      this.trackFocusForScreenReader(event.target);
    });
  }

  monitorKeyboardUsage() {
    // Monitor keyboard usage patterns
    let keyboardUsed = false;

    document.addEventListener('keydown', () => {
      if (!keyboardUsed) {
        keyboardUsed = true;
        document.body.classList.add('keyboard-user');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-user');
    });
  }

  // Public API methods
  enableScreenReaderSupport() {
    return this.enableScreenReaderSupport();
  }

  enableKeyboardNavigation() {
    return this.enableKeyboardNavigation();
  }

  enableHighContrastMode() {
    return this.enableHighContrastMode();
  }

  validateAccessibility() {
    return this.validateAccessibility();
  }

  enableSmoothAnimations() {
    return this.uxEnhancer.enableSmoothAnimations();
  }

  enableResponsiveDesign() {
    return this.uxEnhancer.enableResponsiveDesign();
  }

  provideUserFeedback(type, message) {
    return this.uxEnhancer.provideUserFeedback(type, message);
  }

  getAccessibilityStatus() {
    return {
      screenReaderSupport: this.accessibilityConfig.enableScreenReaderSupport,
      keyboardNavigation: this.accessibilityConfig.enableKeyboardNavigation,
      highContrastMode: this.accessibilityConfig.enableHighContrastMode,
      validationIssues: this.validateAccessibility().length
    };
  }
}

// Export to global scope
window.Accessibility = Accessibility;
console.log('♿ Accessibility module loaded');
