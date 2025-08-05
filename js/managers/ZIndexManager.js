// Z-Index Manager
// Handles z-index hierarchy and modal layering

class ZIndexManager {
    constructor() {
        this.baseZIndex = 1000;
        this.currentZIndex = this.baseZIndex;
        this.activeModals = new Map();
        this.zIndexStack = [];
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('📐 Z-Index Manager initialized');
        this.isInitialized = true;
        
        // Setup CSS custom properties for z-index hierarchy
        this.setupZIndexHierarchy();
        
        // Monitor for z-index conflicts
        this.startZIndexMonitoring();
    }

    // Setup CSS custom properties for z-index hierarchy
    setupZIndexHierarchy() {
        const root = document.documentElement;
        
        // Define z-index hierarchy
        const zIndexValues = {
            '--z-background': 0,
            '--z-particles': 1,
            '--z-matrix': 2,
            '--z-content': 10,
            '--z-sidebar': 20,
            '--z-header': 30,
            '--z-dropdown': 40,
            '--z-scroll-top': 50,
            '--z-cookie-banner': 60,
            '--z-pwa-banner': 70,
            '--z-modal': 1000,
            '--z-modal-overlay': 999,
            '--z-loading': 9999,
            '--z-tooltip': 10000
        };
        
        // Apply z-index values to CSS custom properties
        Object.entries(zIndexValues).forEach(([property, value]) => {
            root.style.setProperty(property, value.toString());
        });
    }

    // Start z-index monitoring
    startZIndexMonitoring() {
        // Monitor for z-index conflicts every 5 seconds
        setInterval(() => {
            this.checkZIndexConflicts();
        }, 5000);
    }

    // Check for z-index conflicts
    checkZIndexConflicts() {
        const elements = document.querySelectorAll('*');
        const zIndexMap = new Map();
        
        elements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const zIndex = computedStyle.zIndex;
            
            if (zIndex !== 'auto' && zIndex !== '0') {
                const zIndexValue = parseInt(zIndex);
                
                if (zIndexMap.has(zIndexValue)) {
                    console.warn(`⚠️ Z-index conflict detected: ${zIndexValue} used by multiple elements`);
                } else {
                    zIndexMap.set(zIndexValue, element);
                }
            }
        });
    }

    // Get next available z-index
    getNextZIndex() {
        this.currentZIndex += 10;
        return this.currentZIndex;
    }

    // Set modal z-index
    setModalZIndex(modalId, element) {
        const zIndex = this.getNextZIndex();
        element.style.zIndex = zIndex;
        
        this.activeModals.set(modalId, {
            element,
            zIndex,
            timestamp: Date.now()
        });
        
        this.zIndexStack.push(modalId);
        
        console.log(`📐 Modal ${modalId} set to z-index: ${zIndex}`);
        return zIndex;
    }

    // Bring modal to front
    bringToFront(modalId) {
        const modal = this.activeModals.get(modalId);
        if (modal) {
            const newZIndex = this.getNextZIndex();
            modal.element.style.zIndex = newZIndex;
            modal.zIndex = newZIndex;
            modal.timestamp = Date.now();
            
            // Move to top of stack
            this.zIndexStack = this.zIndexStack.filter(id => id !== modalId);
            this.zIndexStack.push(modalId);
            
            console.log(`📐 Modal ${modalId} brought to front: ${newZIndex}`);
            return newZIndex;
        }
        return null;
    }

    // Remove modal from z-index management
    removeModal(modalId) {
        this.activeModals.delete(modalId);
        this.zIndexStack = this.zIndexStack.filter(id => id !== modalId);
        
        console.log(`📐 Modal ${modalId} removed from z-index management`);
    }

    // Get top modal
    getTopModal() {
        if (this.zIndexStack.length > 0) {
            const topModalId = this.zIndexStack[this.zIndexStack.length - 1];
            return this.activeModals.get(topModalId);
        }
        return null;
    }

    // Ensure proper layering for specific elements
    ensureProperLayering() {
        // Ensure login form is above other elements
        const loginForm = document.querySelector('#auth-view');
        if (loginForm) {
            loginForm.style.zIndex = 'var(--z-modal)';
        }
        
        // Ensure cookie banner is above content but below modals
        const cookieBanner = document.querySelector('#cookie-consent-banner');
        if (cookieBanner) {
            cookieBanner.style.zIndex = 'var(--z-cookie-banner)';
        }
        
        // Ensure scroll-to-top button is above content
        const scrollToTop = document.querySelector('.scroll-to-top');
        if (scrollToTop) {
            scrollToTop.style.zIndex = 'var(--z-scroll-top)';
        }
    }

    // Fix z-index for specific element
    fixZIndex(element, context = 'content') {
        const zIndexMap = {
            'background': 'var(--z-background)',
            'particles': 'var(--z-particles)',
            'matrix': 'var(--z-matrix)',
            'content': 'var(--z-content)',
            'sidebar': 'var(--z-sidebar)',
            'header': 'var(--z-header)',
            'dropdown': 'var(--z-dropdown)',
            'scroll-top': 'var(--z-scroll-top)',
            'cookie-banner': 'var(--z-cookie-banner)',
            'pwa-banner': 'var(--z-pwa-banner)',
            'modal': 'var(--z-modal)',
            'modal-overlay': 'var(--z-modal-overlay)',
            'loading': 'var(--z-loading)',
            'tooltip': 'var(--z-tooltip)'
        };
        
        if (zIndexMap[context]) {
            element.style.zIndex = zIndexMap[context];
            console.log(`📐 Fixed z-index for ${context}: ${zIndexMap[context]}`);
        }
    }

    // Get z-index statistics
    getZIndexStats() {
        return {
            activeModals: this.activeModals.size,
            zIndexStack: this.zIndexStack.length,
            currentZIndex: this.currentZIndex,
            baseZIndex: this.baseZIndex
        };
    }

    // Reset z-index counter
    resetZIndexCounter() {
        this.currentZIndex = this.baseZIndex;
        console.log('📐 Z-index counter reset');
    }

    // Cleanup
    cleanup() {
        this.activeModals.clear();
        this.zIndexStack = [];
        this.currentZIndex = this.baseZIndex;
        console.log('📐 Z-Index Manager cleanup completed');
    }
}

export default ZIndexManager; 