/**
 * Mobile Optimizations Module
 * Implements responsive design, touch gestures, and mobile-specific enhancements
 */

// ============================================
// 1. RESPONSIVE DESIGN MANAGER
// ============================================

class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            mobile: 640,
            tablet: 768,
            desktop: 1024,
            wide: 1280
        };
        this.currentBreakpoint = null;
        this.isMobile = false;
        this.isTablet = false;
        this.isDesktop = false;
        this.orientation = null;
        this.init();
    }

    init() {
        this.detectDevice();
        this.setupViewportMeta();
        this.setupResponsiveListeners();
        this.applyResponsiveClasses();
        this.optimizeForDevice();
    }

    detectDevice() {
        const width = window.innerWidth;
        
        if (width < this.breakpoints.mobile) {
            this.currentBreakpoint = 'mobile';
            this.isMobile = true;
        } else if (width < this.breakpoints.tablet) {
            this.currentBreakpoint = 'tablet';
            this.isTablet = true;
        } else if (width < this.breakpoints.desktop) {
            this.currentBreakpoint = 'desktop';
            this.isDesktop = true;
        } else {
            this.currentBreakpoint = 'wide';
            this.isDesktop = true;
        }

        // Detect orientation
        this.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        
        // Detect touch support
        this.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    setupViewportMeta() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
    }

    setupResponsiveListeners() {
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.detectDevice();
                this.applyResponsiveClasses();
                this.optimizeForDevice();
                this.handleResize();
            }, 250);
        });

        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectDevice();
                this.applyResponsiveClasses();
                this.handleOrientationChange();
            }, 100);
        });
    }

    applyResponsiveClasses() {
        const body = document.body;
        
        // Remove all device classes
        body.classList.remove('mobile', 'tablet', 'desktop', 'wide', 'touch', 'no-touch', 'portrait', 'landscape');
        
        // Add current device class
        body.classList.add(this.currentBreakpoint);
        
        // Add touch support class
        body.classList.add(this.hasTouch ? 'touch' : 'no-touch');
        
        // Add orientation class
        body.classList.add(this.orientation);
    }

    optimizeForDevice() {
        if (this.isMobile) {
            this.optimizeForMobile();
        } else if (this.isTablet) {
            this.optimizeForTablet();
        } else {
            this.optimizeForDesktop();
        }
    }

    optimizeForMobile() {
        // Simplify animations for performance
        this.reduceAnimations();
        
        // Optimize images
        this.optimizeMobileImages();
        
        // Adjust font sizes
        this.adjustMobileFonts();
        
        // Optimize modals for mobile
        this.optimizeMobileModals();
        
        // Enable touch optimizations
        this.enableTouchOptimizations();
    }

    optimizeForTablet() {
        // Tablet-specific optimizations
        this.adjustTabletLayout();
    }

    optimizeForDesktop() {
        // Desktop-specific optimizations
        this.enableHoverEffects();
        this.enableAdvancedAnimations();
    }

    reduceAnimations() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion || this.isMobile) {
            document.documentElement.style.setProperty('--transition-speed', '0.1s');
            document.documentElement.style.setProperty('--animation-speed', '0.1s');
        }
    }

    optimizeMobileImages() {
        document.querySelectorAll('img[data-mobile-src]').forEach(img => {
            const mobileSrc = img.dataset.mobileSrc;
            if (mobileSrc && this.isMobile) {
                img.src = mobileSrc;
            }
        });
    }

    adjustMobileFonts() {
        if (this.isMobile) {
            document.documentElement.style.fontSize = '14px';
        } else {
            document.documentElement.style.fontSize = '16px';
        }
    }

    optimizeMobileModals() {
        if (this.isMobile) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.add('modal-mobile');
            });
        }
    }

    enableTouchOptimizations() {
        // Increase touch target sizes
        document.querySelectorAll('button, a, .clickable').forEach(element => {
            const styles = window.getComputedStyle(element);
            const height = parseInt(styles.height);
            const width = parseInt(styles.width);
            
            if (height < 44) {
                element.style.minHeight = '44px';
            }
            if (width < 44) {
                element.style.minWidth = '44px';
            }
        });
    }

    adjustTabletLayout() {
        // Adjust grid layouts for tablet
        document.querySelectorAll('.grid').forEach(grid => {
            if (grid.classList.contains('grid-cols-4')) {
                grid.classList.remove('grid-cols-4');
                grid.classList.add('grid-cols-2');
            }
        });
    }

    enableHoverEffects() {
        document.body.classList.add('hover-enabled');
    }

    enableAdvancedAnimations() {
        document.body.classList.add('animations-enabled');
    }

    handleResize() {
        // Emit resize event
        document.dispatchEvent(new CustomEvent('responsive-resize', {
            detail: {
                breakpoint: this.currentBreakpoint,
                width: window.innerWidth,
                height: window.innerHeight
            }
        }));
    }

    handleOrientationChange() {
        // Emit orientation change event
        document.dispatchEvent(new CustomEvent('orientation-change', {
            detail: {
                orientation: this.orientation
            }
        }));
    }
}

// ============================================
// 2. TOUCH GESTURE HANDLER
// ============================================

class TouchGestureHandler {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.swipeThreshold = 50;
        this.swipeHandlers = new Map();
        this.init();
    }

    init() {
        this.setupTouchListeners();
        this.setupSwipeZones();
        this.preventDoubleTapZoom();
    }

    setupTouchListeners() {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });

        // Prevent pull-to-refresh on mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches[0].clientY > 0) {
                // Allow scrolling
            } else {
                e.preventDefault();
            }
        }, { passive: false });
    }

    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        
        // Determine swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > this.swipeThreshold) {
                if (deltaX > 0) {
                    this.onSwipeRight();
                } else {
                    this.onSwipeLeft();
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > this.swipeThreshold) {
                if (deltaY > 0) {
                    this.onSwipeDown();
                } else {
                    this.onSwipeUp();
                }
            }
        }
    }

    onSwipeLeft() {
        // Navigate to next section
        const event = new CustomEvent('swipe', { detail: { direction: 'left' } });
        document.dispatchEvent(event);
        
        // Example: Open next tab
        const activeTab = document.querySelector('.tab.active');
        if (activeTab && activeTab.nextElementSibling) {
            activeTab.nextElementSibling.click();
        }
    }

    onSwipeRight() {
        // Navigate to previous section
        const event = new CustomEvent('swipe', { detail: { direction: 'right' } });
        document.dispatchEvent(event);
        
        // Example: Open previous tab
        const activeTab = document.querySelector('.tab.active');
        if (activeTab && activeTab.previousElementSibling) {
            activeTab.previousElementSibling.click();
        }
    }

    onSwipeUp() {
        // Scroll to next section
        const event = new CustomEvent('swipe', { detail: { direction: 'up' } });
        document.dispatchEvent(event);
    }

    onSwipeDown() {
        // Show refresh or pull action
        const event = new CustomEvent('swipe', { detail: { direction: 'down' } });
        document.dispatchEvent(event);
    }

    setupSwipeZones() {
        // Set up specific swipe zones
        document.querySelectorAll('[data-swipeable]').forEach(element => {
            const hammertime = new Hammer(element);
            
            hammertime.on('swipeleft', () => {
                const action = element.dataset.swipeLeft;
                if (action) this.executeSwipeAction(action);
            });
            
            hammertime.on('swiperight', () => {
                const action = element.dataset.swipeRight;
                if (action) this.executeSwipeAction(action);
            });
        });
    }

    executeSwipeAction(action) {
        // Execute predefined swipe actions
        switch(action) {
            case 'next-page':
                this.navigateNext();
                break;
            case 'prev-page':
                this.navigatePrevious();
                break;
            case 'close-modal':
                this.closeActiveModal();
                break;
            case 'open-menu':
                this.openSideMenu();
                break;
            default:
                // Try to execute as function
                if (window[action]) {
                    window[action]();
                }
        }
    }

    preventDoubleTapZoom() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    navigateNext() {
        // Implementation for next navigation
        console.log('Navigate to next');
    }

    navigatePrevious() {
        // Implementation for previous navigation
        console.log('Navigate to previous');
    }

    closeActiveModal() {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }

    openSideMenu() {
        const sideMenu = document.querySelector('.side-menu');
        if (sideMenu) {
            sideMenu.classList.add('open');
        }
    }
}

// ============================================
// 3. MOBILE MODAL OPTIMIZER
// ============================================

class MobileModalOptimizer {
    constructor() {
        this.modals = new Map();
        this.init();
    }

    init() {
        this.optimizeAllModals();
        this.setupModalObserver();
    }

    optimizeAllModals() {
        document.querySelectorAll('.modal, [role="dialog"]').forEach(modal => {
            this.optimizeModal(modal);
        });
    }

    optimizeModal(modal) {
        if (window.responsiveManager?.isMobile) {
            // Make modal fullscreen on mobile
            modal.classList.add('modal-fullscreen-mobile');
            
            // Add mobile-specific styles
            this.addMobileModalStyles(modal);
            
            // Add swipe to close
            this.addSwipeToClose(modal);
            
            // Optimize form inputs
            this.optimizeModalInputs(modal);
            
            // Add mobile close button
            this.addMobileCloseButton(modal);
        }
    }

    addMobileModalStyles(modal) {
        if (window.responsiveManager?.isMobile) {
            modal.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
                max-width: 100% !important;
                max-height: 100% !important;
                border-radius: 0 !important;
                margin: 0 !important;
            `;
        }
    }

    addSwipeToClose(modal) {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        modal.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
        });

        modal.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0) {
                modal.style.transform = `translateY(${deltaY}px)`;
                modal.style.opacity = 1 - (deltaY / 300);
            }
        });

        modal.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const deltaY = currentY - startY;
            
            if (deltaY > 100) {
                // Close modal
                modal.classList.remove('active');
                modal.style.transform = 'translateY(100%)';
            } else {
                // Snap back
                modal.style.transform = 'translateY(0)';
                modal.style.opacity = '1';
            }
            
            isDragging = false;
        });
    }

    optimizeModalInputs(modal) {
        modal.querySelectorAll('input, textarea, select').forEach(input => {
            // Set appropriate input types for mobile keyboards
            if (input.type === 'text') {
                // Check for email pattern
                if (input.name?.includes('email') || input.placeholder?.includes('email')) {
                    input.type = 'email';
                }
                // Check for phone pattern
                if (input.name?.includes('phone') || input.placeholder?.includes('phone')) {
                    input.type = 'tel';
                }
                // Check for number pattern
                if (input.name?.includes('number') || input.placeholder?.includes('number')) {
                    input.type = 'number';
                }
            }
            
            // Add autocomplete attributes
            if (input.name === 'email') input.autocomplete = 'email';
            if (input.name === 'name') input.autocomplete = 'name';
            if (input.name === 'phone') input.autocomplete = 'tel';
        });
    }

    addMobileCloseButton(modal) {
        if (!modal.querySelector('.mobile-close-button')) {
            const closeButton = document.createElement('button');
            closeButton.className = 'mobile-close-button';
            closeButton.innerHTML = '×';
            closeButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                width: 44px;
                height: 44px;
                font-size: 28px;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                border-radius: 50%;
                z-index: 1000;
            `;
            
            closeButton.addEventListener('click', () => {
                modal.classList.remove('active');
            });
            
            modal.appendChild(closeButton);
        }
    }

    setupModalObserver() {
        // Watch for new modals being added to DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList?.contains('modal') || node.getAttribute?.('role') === 'dialog') {
                        this.optimizeModal(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// ============================================
// 4. MOBILE PERFORMANCE OPTIMIZER
// ============================================

class MobilePerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        if (window.responsiveManager?.isMobile) {
            this.optimizeScrolling();
            this.optimizeAnimations();
            this.optimizeImages();
            this.reducePaintAreas();
            this.enableHardwareAcceleration();
        }
    }

    optimizeScrolling() {
        // Enable momentum scrolling on iOS
        document.querySelectorAll('.scrollable').forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
            element.style.overflowY = 'auto';
        });

        // Implement passive event listeners
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        document.addEventListener('wheel', () => {}, { passive: true });
    }

    optimizeAnimations() {
        // Use transform instead of position changes
        document.querySelectorAll('.animated').forEach(element => {
            const styles = window.getComputedStyle(element);
            if (styles.position === 'absolute' || styles.position === 'relative') {
                element.style.willChange = 'transform';
            }
        });

        // Reduce animation complexity on mobile
        if (window.responsiveManager?.isMobile) {
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        }
    }

    optimizeImages() {
        // Lazy load images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Use appropriate image formats
        this.convertToWebP();
    }

    convertToWebP() {
        if (this.supportsWebP()) {
            document.querySelectorAll('img').forEach(img => {
                if (img.src.endsWith('.jpg') || img.src.endsWith('.png')) {
                    const webpSrc = img.src.replace(/\.(jpg|png)$/, '.webp');
                    // Check if WebP version exists
                    fetch(webpSrc, { method: 'HEAD' })
                        .then(response => {
                            if (response.ok) {
                                img.src = webpSrc;
                            }
                        })
                        .catch(() => {
                            // WebP version doesn't exist, keep original
                        });
                }
            });
        }
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    }

    reducePaintAreas() {
        // Use contain property to limit paint areas
        document.querySelectorAll('.card, .modal, .dropdown').forEach(element => {
            element.style.contain = 'layout style paint';
        });
    }

    enableHardwareAcceleration() {
        // Force hardware acceleration for animated elements
        document.querySelectorAll('.animated, .modal, .drawer').forEach(element => {
            element.style.transform = 'translateZ(0)';
        });
    }
}

// ============================================
// 5. MOBILE NAVIGATION
// ============================================

class MobileNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.createMobileNav();
        this.setupHamburgerMenu();
        this.setupBottomNav();
        this.handleBackButton();
    }

    createMobileNav() {
        if (!window.responsiveManager?.isMobile) return;

        const mobileNav = document.createElement('nav');
        mobileNav.className = 'mobile-nav';
        mobileNav.innerHTML = `
            <div class="mobile-nav-header">
                <button class="hamburger-menu" aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="mobile-nav-title">Operator Uplift</div>
                <button class="mobile-nav-action" aria-label="Notifications">
                    <i class="fas fa-bell"></i>
                </button>
            </div>
        `;

        // Insert at top of body
        document.body.insertBefore(mobileNav, document.body.firstChild);
    }

    setupHamburgerMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const sidebar = document.querySelector('.sidebar');
        
        if (hamburger && sidebar) {
            hamburger.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                hamburger.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (sidebar.classList.contains('open')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                    sidebar.classList.remove('open');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    setupBottomNav() {
        if (!window.responsiveManager?.isMobile) return;

        const bottomNav = document.createElement('nav');
        bottomNav.className = 'bottom-nav';
        bottomNav.innerHTML = `
            <button class="bottom-nav-item active" data-page="dashboard">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </button>
            <button class="bottom-nav-item" data-page="focus">
                <i class="fas fa-brain"></i>
                <span>Focus</span>
            </button>
            <button class="bottom-nav-item" data-page="goals">
                <i class="fas fa-target"></i>
                <span>Goals</span>
            </button>
            <button class="bottom-nav-item" data-page="social">
                <i class="fas fa-users"></i>
                <span>Social</span>
            </button>
            <button class="bottom-nav-item" data-page="profile">
                <i class="fas fa-user"></i>
                <span>Profile</span>
            </button>
        `;

        document.body.appendChild(bottomNav);

        // Handle navigation
        bottomNav.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                bottomNav.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
                // Navigate to page
                const page = item.dataset.page;
                this.navigateToPage(page);
            });
        });
    }

    navigateToPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        // Show selected page
        const selectedPage = document.getElementById(`${page}-page`);
        if (selectedPage) {
            selectedPage.classList.add('active');
        }
    }

    handleBackButton() {
        // Handle browser back button
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateToPage(e.state.page);
            }
        });

        // Add history entries for navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                history.pushState({ page }, '', `#${page}`);
            });
        });
    }
}

// ============================================
// 6. MOBILE STYLES
// ============================================

function injectMobileStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile Navigation */
        .mobile-nav {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 56px;
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border-color);
            z-index: 1000;
            padding: 0 16px;
        }

        .mobile .mobile-nav {
            display: block;
        }

        .mobile-nav-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
        }

        .hamburger-menu {
            width: 24px;
            height: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            background: none;
            border: none;
            cursor: pointer;
        }

        .hamburger-menu span {
            width: 100%;
            height: 2px;
            background: var(--text-primary);
            transition: all 0.3s;
        }

        .hamburger-menu.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger-menu.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger-menu.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }

        /* Bottom Navigation */
        .bottom-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 56px;
            background: var(--bg-primary);
            border-top: 1px solid var(--border-color);
            z-index: 1000;
        }

        .mobile .bottom-nav {
            display: flex;
        }

        .bottom-nav-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 10px;
            padding: 8px;
            cursor: pointer;
        }

        .bottom-nav-item.active {
            color: var(--primary-color);
        }

        .bottom-nav-item i {
            font-size: 20px;
            margin-bottom: 4px;
        }

        /* Mobile Modal Styles */
        .mobile .modal-fullscreen-mobile {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            border-radius: 0 !important;
            margin: 0 !important;
        }

        /* Mobile Optimizations */
        .mobile .sidebar {
            position: fixed;
            left: -100%;
            top: 0;
            bottom: 0;
            width: 80%;
            max-width: 300px;
            transition: left 0.3s;
            z-index: 999;
        }

        .mobile .sidebar.open {
            left: 0;
        }

        .mobile .main-content {
            margin-left: 0;
            padding-top: 56px;
            padding-bottom: 56px;
        }

        /* Touch-friendly sizes */
        .touch button,
        .touch a,
        .touch .clickable {
            min-height: 44px;
            min-width: 44px;
        }

        /* Responsive Typography */
        .mobile h1 { font-size: 1.75rem; }
        .mobile h2 { font-size: 1.5rem; }
        .mobile h3 { font-size: 1.25rem; }
        .mobile p { font-size: 0.875rem; }

        /* Responsive Grid */
        .mobile .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
        .mobile .grid-cols-3 { grid-template-columns: repeat(1, 1fr); }
        
        .tablet .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
        .tablet .grid-cols-3 { grid-template-columns: repeat(2, 1fr); }

        /* Performance Optimizations */
        .mobile * {
            -webkit-tap-highlight-color: transparent;
        }

        .mobile .animated {
            animation-duration: 0.2s !important;
        }

        @media (hover: none) {
            .hover\\:scale-105:hover {
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 7. INITIALIZATION
// ============================================

// Initialize mobile optimizations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileOptimizations);
} else {
    initializeMobileOptimizations();
}

function initializeMobileOptimizations() {
    // Inject styles first
    injectMobileStyles();
    
    // Initialize managers
    window.responsiveManager = new ResponsiveManager();
    window.touchGestureHandler = new TouchGestureHandler();
    window.mobileModalOptimizer = new MobileModalOptimizer();
    window.mobilePerformanceOptimizer = new MobilePerformanceOptimizer();
    window.mobileNavigation = new MobileNavigation();
    
    console.log('✅ Mobile optimizations initialized');
}

// Export for use in other modules
export {
    ResponsiveManager,
    TouchGestureHandler,
    MobileModalOptimizer,
    MobilePerformanceOptimizer,
    MobileNavigation
};
