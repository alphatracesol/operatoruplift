/**
 * Accessibility System
 * Screen reader support, keyboard navigation, high contrast, and more
 */

window.AccessibilitySystem = {
    // Configuration
    config: {
        screenReaderEnabled: false,
        keyboardNavEnabled: true,
        highContrastMode: false,
        fontSize: 'normal', // small, normal, large, xlarge
        reducedMotion: false,
        colorBlindMode: 'none', // none, protanopia, deuteranopia, tritanopia
        focusIndicators: true,
        skipLinks: true
    },

    // Keyboard navigation state
    keyboardNav: {
        currentFocus: null,
        focusableElements: [],
        tabIndex: 0
    },

    // ARIA live regions
    liveRegions: {
        alerts: null,
        status: null,
        polite: null
    },

    // Initialize accessibility
    initialize() {
        this.loadPreferences();
        this.setupARIA();
        this.setupKeyboardNavigation();
        this.setupSkipLinks();
        this.applyAccessibilitySettings();
        this.setupEventListeners();
        this.checkSystemPreferences();
    },

    // Load user preferences
    loadPreferences() {
        const saved = localStorage.getItem('accessibilityPreferences');
        if (saved) {
            Object.assign(this.config, JSON.parse(saved));
        }
    },

    // Save preferences
    savePreferences() {
        localStorage.setItem('accessibilityPreferences', JSON.stringify(this.config));
    },

    // Setup ARIA
    setupARIA() {
        // Set main landmarks
        document.querySelector('nav')?.setAttribute('role', 'navigation');
        document.querySelector('main')?.setAttribute('role', 'main');
        document.querySelector('aside')?.setAttribute('role', 'complementary');
        document.querySelector('footer')?.setAttribute('role', 'contentinfo');

        // Create live regions
        this.createLiveRegions();

        // Add ARIA labels
        this.addARIALabels();

        // Setup form labels
        this.setupFormAccessibility();
    },

    // Create live regions
    createLiveRegions() {
        // Alert region for important messages
        this.liveRegions.alerts = document.createElement('div');
        this.liveRegions.alerts.setAttribute('role', 'alert');
        this.liveRegions.alerts.setAttribute('aria-live', 'assertive');
        this.liveRegions.alerts.className = 'sr-only';
        document.body.appendChild(this.liveRegions.alerts);

        // Status region for updates
        this.liveRegions.status = document.createElement('div');
        this.liveRegions.status.setAttribute('role', 'status');
        this.liveRegions.status.setAttribute('aria-live', 'polite');
        this.liveRegions.status.className = 'sr-only';
        document.body.appendChild(this.liveRegions.status);
    },

    // Add ARIA labels
    addARIALabels() {
        // Buttons without text
        document.querySelectorAll('button:not([aria-label])').forEach(button => {
            if (!button.textContent.trim()) {
                const icon = button.querySelector('i, svg');
                if (icon) {
                    const label = this.getIconLabel(icon);
                    if (label) {
                        button.setAttribute('aria-label', label);
                    }
                }
            }
        });

        // Interactive elements
        document.querySelectorAll('[onclick]:not([role])').forEach(element => {
            if (!element.matches('button, a, input, select, textarea')) {
                element.setAttribute('role', 'button');
                element.setAttribute('tabindex', '0');
            }
        });

        // Progress bars
        document.querySelectorAll('.progress-bar').forEach(bar => {
            bar.setAttribute('role', 'progressbar');
            const value = bar.style.width ? parseInt(bar.style.width) : 0;
            bar.setAttribute('aria-valuenow', value);
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', '100');
        });
    },

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        if (!this.config.keyboardNavEnabled) return;

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Skip to main content (Alt + M)
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                this.skipToMain();
            }

            // Toggle accessibility menu (Alt + A)
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.toggleAccessibilityMenu();
            }

            // Navigate with arrow keys in menus
            if (this.isInMenu(e.target)) {
                this.handleMenuNavigation(e);
            }

            // Tab navigation enhancement
            if (e.key === 'Tab') {
                this.enhanceTabNavigation(e);
            }

            // Escape key handling
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
        });

        // Add keyboard support to clickable elements
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[onclick]');
            if (element && !element.matches('button, a, input')) {
                element.addEventListener('keypress', (ke) => {
                    if (ke.key === 'Enter' || ke.key === ' ') {
                        ke.preventDefault();
                        element.click();
                    }
                });
            }
        });
    },

    // Setup skip links
    setupSkipLinks() {
        if (!this.config.skipLinks) return;

        const skipNav = document.createElement('nav');
        skipNav.className = 'skip-links';
        skipNav.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#search" class="skip-link">Skip to search</a>
        `;

        // Style skip links
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -40px;
                left: 0;
                background: var(--bg-primary);
                z-index: 100000;
            }
            .skip-link {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }
            .skip-link:focus {
                position: static;
                width: auto;
                height: auto;
                padding: 0.5rem 1rem;
                background: var(--primary-color);
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 0.5rem;
                display: inline-block;
            }
        `;
        document.head.appendChild(style);

        document.body.insertBefore(skipNav, document.body.firstChild);
    },

    // Apply accessibility settings
    applyAccessibilitySettings() {
        const root = document.documentElement;

        // Font size
        this.setFontSize(this.config.fontSize);

        // High contrast mode
        this.setHighContrast(this.config.highContrastMode);

        // Reduced motion
        this.setReducedMotion(this.config.reducedMotion);

        // Color blind mode
        this.setColorBlindMode(this.config.colorBlindMode);

        // Focus indicators
        this.setFocusIndicators(this.config.focusIndicators);
    },

    // Set font size
    setFontSize(size) {
        const sizes = {
            small: '14px',
            normal: '16px',
            large: '20px',
            xlarge: '24px'
        };

        document.documentElement.style.setProperty('--base-font-size', sizes[size] || sizes.normal);
        this.config.fontSize = size;
        this.savePreferences();
        
        // Announce change
        this.announce(`Font size changed to ${size}`);
    },

    // Set high contrast mode
    setHighContrast(enabled) {
        if (enabled) {
            document.body.classList.add('high-contrast');
            
            // Apply high contrast styles
            const style = document.getElementById('high-contrast-styles') || document.createElement('style');
            style.id = 'high-contrast-styles';
            style.textContent = `
                .high-contrast {
                    --bg-primary: #000000 !important;
                    --bg-secondary: #1a1a1a !important;
                    --text-primary: #ffffff !important;
                    --text-secondary: #e0e0e0 !important;
                    --border-light: #ffffff !important;
                    --primary-color: #00ff00 !important;
                }
                .high-contrast * {
                    text-shadow: none !important;
                    box-shadow: none !important;
                }
                .high-contrast img {
                    opacity: 0.8 !important;
                }
                .high-contrast button,
                .high-contrast .card {
                    border: 2px solid var(--border-light) !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            document.body.classList.remove('high-contrast');
            const style = document.getElementById('high-contrast-styles');
            if (style) style.remove();
        }

        this.config.highContrastMode = enabled;
        this.savePreferences();
        this.announce(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`);
    },

    // Set reduced motion
    setReducedMotion(enabled) {
        if (enabled) {
            document.body.classList.add('reduce-motion');
            
            const style = document.getElementById('reduced-motion-styles') || document.createElement('style');
            style.id = 'reduced-motion-styles';
            style.textContent = `
                .reduce-motion *,
                .reduce-motion *::before,
                .reduce-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            document.body.classList.remove('reduce-motion');
            const style = document.getElementById('reduced-motion-styles');
            if (style) style.remove();
        }

        this.config.reducedMotion = enabled;
        this.savePreferences();
        this.announce(`Reduced motion ${enabled ? 'enabled' : 'disabled'}`);
    },

    // Set color blind mode
    setColorBlindMode(mode) {
        // Remove existing filters
        document.documentElement.style.filter = '';
        
        const filters = {
            protanopia: 'url(#protanopia-filter)',
            deuteranopia: 'url(#deuteranopia-filter)',
            tritanopia: 'url(#tritanopia-filter)'
        };

        if (mode !== 'none' && filters[mode]) {
            // Create SVG filters if not exists
            this.createColorBlindFilters();
            document.documentElement.style.filter = filters[mode];
        }

        this.config.colorBlindMode = mode;
        this.savePreferences();
        this.announce(`Color blind mode: ${mode}`);
    },

    // Create color blind filters
    createColorBlindFilters() {
        if (document.getElementById('accessibility-filters')) return;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'accessibility-filters';
        svg.style.display = 'none';
        svg.innerHTML = `
            <!-- Protanopia (Red-blind) -->
            <filter id="protanopia-filter">
                <feColorMatrix type="matrix" values="
                    0.567, 0.433, 0,     0, 0
                    0.558, 0.442, 0,     0, 0
                    0,     0.242, 0.758, 0, 0
                    0,     0,     0,     1, 0"/>
            </filter>
            
            <!-- Deuteranopia (Green-blind) -->
            <filter id="deuteranopia-filter">
                <feColorMatrix type="matrix" values="
                    0.625, 0.375, 0,   0, 0
                    0.7,   0.3,   0,   0, 0
                    0,     0.3,   0.7, 0, 0
                    0,     0,     0,   1, 0"/>
            </filter>
            
            <!-- Tritanopia (Blue-blind) -->
            <filter id="tritanopia-filter">
                <feColorMatrix type="matrix" values="
                    0.95, 0.05,  0,     0, 0
                    0,    0.433, 0.567, 0, 0
                    0,    0.475, 0.525, 0, 0
                    0,    0,     0,     1, 0"/>
            </filter>
        `;
        document.body.appendChild(svg);
    },

    // Set focus indicators
    setFocusIndicators(enabled) {
        if (enabled) {
            const style = document.getElementById('focus-indicator-styles') || document.createElement('style');
            style.id = 'focus-indicator-styles';
            style.textContent = `
                *:focus {
                    outline: 3px solid var(--primary-color) !important;
                    outline-offset: 2px !important;
                }
                .focus-visible:focus {
                    outline: 3px solid var(--primary-color) !important;
                    outline-offset: 2px !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            const style = document.getElementById('focus-indicator-styles');
            if (style) style.remove();
        }

        this.config.focusIndicators = enabled;
        this.savePreferences();
    },

    // Announce to screen readers
    announce(message, priority = 'polite') {
        const region = priority === 'assertive' ? this.liveRegions.alerts : this.liveRegions.status;
        if (region) {
            region.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
    },

    // Toggle accessibility menu
    toggleAccessibilityMenu() {
        const existingMenu = document.getElementById('accessibilityMenu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.id = 'accessibilityMenu';
        menu.className = 'accessibility-menu';
        menu.setAttribute('role', 'dialog');
        menu.setAttribute('aria-label', 'Accessibility Settings');
        menu.innerHTML = `
            <div class="a11y-menu-content">
                <h2>Accessibility Settings</h2>
                
                <div class="a11y-setting">
                    <label>
                        <input type="checkbox" ${this.config.screenReaderEnabled ? 'checked' : ''}
                            onchange="AccessibilitySystem.toggleScreenReader(this.checked)">
                        Screen Reader Mode
                    </label>
                </div>
                
                <div class="a11y-setting">
                    <label>
                        <input type="checkbox" ${this.config.highContrastMode ? 'checked' : ''}
                            onchange="AccessibilitySystem.setHighContrast(this.checked)">
                        High Contrast
                    </label>
                </div>
                
                <div class="a11y-setting">
                    <label>Font Size</label>
                    <div class="font-size-controls">
                        ${['small', 'normal', 'large', 'xlarge'].map(size => `
                            <button class="font-size-btn ${this.config.fontSize === size ? 'active' : ''}"
                                onclick="AccessibilitySystem.setFontSize('${size}')"
                                aria-label="Font size ${size}">
                                ${size === 'small' ? 'A' : size === 'normal' ? 'A' : size === 'large' ? 'A' : 'A'}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="a11y-setting">
                    <label>Color Blind Mode</label>
                    <select onchange="AccessibilitySystem.setColorBlindMode(this.value)">
                        <option value="none" ${this.config.colorBlindMode === 'none' ? 'selected' : ''}>None</option>
                        <option value="protanopia" ${this.config.colorBlindMode === 'protanopia' ? 'selected' : ''}>Protanopia</option>
                        <option value="deuteranopia" ${this.config.colorBlindMode === 'deuteranopia' ? 'selected' : ''}>Deuteranopia</option>
                        <option value="tritanopia" ${this.config.colorBlindMode === 'tritanopia' ? 'selected' : ''}>Tritanopia</option>
                    </select>
                </div>
                
                <div class="a11y-setting">
                    <label>
                        <input type="checkbox" ${this.config.reducedMotion ? 'checked' : ''}
                            onchange="AccessibilitySystem.setReducedMotion(this.checked)">
                        Reduce Motion
                    </label>
                </div>
                
                <div class="a11y-setting">
                    <label>
                        <input type="checkbox" ${this.config.keyboardNavEnabled ? 'checked' : ''}
                            onchange="AccessibilitySystem.toggleKeyboardNav(this.checked)">
                        Enhanced Keyboard Navigation
                    </label>
                </div>
                
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Close
                </button>
            </div>
        `;

        // Style the menu
        menu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: var(--bg-secondary);
            border: 2px solid var(--border-light);
            border-radius: 8px;
            padding: 2rem;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(menu);
        
        // Focus on close button
        menu.querySelector('button').focus();
    },

    // Screen reader mode
    toggleScreenReader(enabled) {
        this.config.screenReaderEnabled = enabled;
        
        if (enabled) {
            // Add screen reader optimizations
            document.body.classList.add('screen-reader-mode');
            
            // Make all decorative images hidden
            document.querySelectorAll('img:not([alt])').forEach(img => {
                img.setAttribute('alt', '');
            });
            
            // Add descriptions to icons
            document.querySelectorAll('.fa, .fas, .far, .fab').forEach(icon => {
                if (!icon.getAttribute('aria-label')) {
                    const label = this.getIconLabel(icon);
                    if (label) {
                        icon.setAttribute('aria-label', label);
                        icon.setAttribute('role', 'img');
                    }
                }
            });
        } else {
            document.body.classList.remove('screen-reader-mode');
        }
        
        this.savePreferences();
        this.announce(`Screen reader mode ${enabled ? 'enabled' : 'disabled'}`);
    },

    // Get icon label
    getIconLabel(icon) {
        const iconMap = {
            'fa-home': 'Home',
            'fa-user': 'User',
            'fa-cog': 'Settings',
            'fa-search': 'Search',
            'fa-times': 'Close',
            'fa-check': 'Check',
            'fa-plus': 'Add',
            'fa-minus': 'Remove',
            'fa-edit': 'Edit',
            'fa-trash': 'Delete',
            'fa-save': 'Save',
            'fa-download': 'Download',
            'fa-upload': 'Upload',
            'fa-share': 'Share',
            'fa-heart': 'Like',
            'fa-star': 'Favorite',
            'fa-bell': 'Notifications',
            'fa-envelope': 'Messages',
            'fa-calendar': 'Calendar',
            'fa-clock': 'Time',
            'fa-chart-bar': 'Statistics',
            'fa-trophy': 'Achievements'
        };

        const classList = icon.className.split(' ');
        for (const className of classList) {
            if (iconMap[className]) {
                return iconMap[className];
            }
        }
        
        return null;
    },

    // Handle menu navigation
    handleMenuNavigation(e) {
        const menuItems = Array.from(e.target.closest('[role="menu"]')?.querySelectorAll('[role="menuitem"]') || []);
        const currentIndex = menuItems.indexOf(e.target);
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % menuItems.length;
                menuItems[nextIndex]?.focus();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex - 1 < 0 ? menuItems.length - 1 : currentIndex - 1;
                menuItems[prevIndex]?.focus();
                break;
                
            case 'Home':
                e.preventDefault();
                menuItems[0]?.focus();
                break;
                
            case 'End':
                e.preventDefault();
                menuItems[menuItems.length - 1]?.focus();
                break;
        }
    },

    // Check system preferences
    checkSystemPreferences() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.setReducedMotion(true);
        }
        
        // Check for high contrast preference
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            this.setHighContrast(true);
        }
        
        // Check for color scheme preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Already handled by theme system
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Listen for preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.setReducedMotion(e.matches);
        });
        
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            this.setHighContrast(e.matches);
        });
        
        // Focus visible polyfill
        document.addEventListener('mousedown', () => {
            document.body.classList.add('using-mouse');
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        });
    },

    // Skip to main content
    skipToMain() {
        const main = document.querySelector('main, [role="main"], #main-content');
        if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus();
            main.scrollIntoView();
        }
    },

    // Helper methods
    isInMenu(element) {
        return element.closest('[role="menu"], .dropdown-menu, .context-menu');
    },

    enhanceTabNavigation(e) {
        // Add visual focus ring
        if (!document.body.classList.contains('using-mouse')) {
            document.body.classList.add('keyboard-nav');
        }
    },

    handleEscapeKey(e) {
        // Close modals, dropdowns, etc.
        const modal = e.target.closest('.modal, [role="dialog"]');
        if (modal) {
            modal.querySelector('.close-btn, [aria-label="Close"]')?.click();
        }
    },

    toggleKeyboardNav(enabled) {
        this.config.keyboardNavEnabled = enabled;
        this.savePreferences();
        
        if (enabled) {
            this.setupKeyboardNavigation();
        }
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.AccessibilitySystem.initialize());
} else {
    window.AccessibilitySystem.initialize();
}
