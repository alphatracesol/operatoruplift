// Inline Style Override Fix
// Removes and overrides inline styles that prevent dashboard from being hidden

(function() {
    'use strict';

    console.log('💪 Inline Style Override Fix initializing...');

    // Store original navigate
    const originalNavigate = window.navigate;

    // Override navigate with inline style removal
    window.navigate = function(view) {
        console.log(`🔄 Navigate with inline style override to: ${view}`);

        // First, remove ALL inline styles from dashboard elements
        if (view !== 'dashboard') {
            removeAllDashboardInlineStyles();
        }

        // Force hide all views
        document.querySelectorAll('.view-container').forEach(viewEl => {
            viewEl.classList.remove('active');
            
            // Remove inline styles that might override hiding
            viewEl.removeAttribute('style');
            
            // Apply hiding styles directly
            viewEl.style.cssText = 'display: none !important;';
        });

        // Extra aggressive dashboard hiding
        if (view !== 'dashboard') {
            const dashboard = document.getElementById('dashboardView');
            if (dashboard) {
                // Remove all inline styles from dashboard and its children
                dashboard.removeAttribute('style');
                const allElements = dashboard.querySelectorAll('*');
                allElements.forEach(el => {
                    el.removeAttribute('style');
                });

                // Apply nuclear hiding
                dashboard.style.cssText = `
                    display: none !important;
                    visibility: hidden !important;
                    position: fixed !important;
                    left: -999999px !important;
                    top: -999999px !important;
                    width: 0 !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    z-index: -99999 !important;
                    transform: scale(0) translateX(-9999px) !important;
                `;

                // Hide dashboard grid specifically
                const dashboardGrid = dashboard.querySelector('.dashboard-grid');
                if (dashboardGrid) {
                    dashboardGrid.removeAttribute('style');
                    dashboardGrid.style.cssText = 'display: none !important;';
                }

                // Hide all cards
                dashboard.querySelectorAll('.card').forEach(card => {
                    card.removeAttribute('style');
                    card.style.cssText = 'display: none !important;';
                });
            }
        }

        // Show target view
        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            targetView.classList.add('active');
            targetView.style.cssText = 'display: block !important;';
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-view') === view);
        });

        // Call original navigate
        if (originalNavigate && typeof originalNavigate === 'function') {
            try {
                originalNavigate.call(this, view);
            } catch (e) {
                console.warn('Original navigate error:', e);
            }
        }

        // Double-check after delay
        if (view !== 'dashboard') {
            setTimeout(() => removeAllDashboardInlineStyles(), 100);
            setTimeout(() => removeAllDashboardInlineStyles(), 500);
        }
    };

    // Remove all inline styles from dashboard elements
    function removeAllDashboardInlineStyles() {
        const dashboard = document.getElementById('dashboardView');
        if (!dashboard) return;

        console.log('🧹 Removing all dashboard inline styles...');

        // Get ALL elements in dashboard
        const allElements = dashboard.querySelectorAll('*');
        
        // Remove style attribute from everything
        dashboard.removeAttribute('style');
        allElements.forEach(el => {
            // Store the element info for debugging
            if (el.hasAttribute('style')) {
                console.log('Removing inline style from:', el.className || el.tagName, el.getAttribute('style'));
            }
            el.removeAttribute('style');
        });

        // Apply hiding to dashboard
        dashboard.style.cssText = `
            display: none !important;
            visibility: hidden !important;
            position: fixed !important;
            left: -999999px !important;
            top: -999999px !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            z-index: -99999 !important;
        `;
    }

    // Monitor for style changes
    function setupStyleMonitor() {
        const observer = new MutationObserver((mutations) => {
            const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view');
            
            if (currentView && currentView !== 'dashboard') {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const target = mutation.target;
                        
                        // If it's a dashboard element getting inline styles
                        if (target.closest('#dashboardView')) {
                            console.warn('🚨 Dashboard element getting inline style:', target);
                            target.removeAttribute('style');
                            target.style.display = 'none !important';
                        }
                    }
                });
            }
        });

        // Observe the entire document for style changes
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });
    }

    // Override setAttribute to prevent inline styles on dashboard
    function overrideSetAttribute() {
        const originalSetAttribute = Element.prototype.setAttribute;
        
        Element.prototype.setAttribute = function(name, value) {
            // Check if this is a dashboard element
            if (name === 'style' && this.closest('#dashboardView')) {
                const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view');
                
                // If not on dashboard view, don't allow style setting
                if (currentView && currentView !== 'dashboard') {
                    console.warn('🛑 Blocked inline style on dashboard element:', this);
                    return;
                }
            }
            
            return originalSetAttribute.call(this, name, value);
        };
    }

    // Override style property setter
    function overrideStyleSetter() {
        const dashboardView = document.getElementById('dashboardView');
        if (!dashboardView) return;

        // Get all dashboard elements
        const dashboardElements = dashboardView.querySelectorAll('*');
        
        dashboardElements.forEach(el => {
            try {
                Object.defineProperty(el, 'style', {
                    get: function() {
                        return this.getAttribute('style') || '';
                    },
                    set: function(value) {
                        const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view');
                        if (currentView && currentView !== 'dashboard') {
                            console.warn('🛑 Blocked style setter on dashboard element');
                            return;
                        }
                        this.setAttribute('style', value);
                    }
                });
            } catch (e) {
                // Some elements might not allow redefinition
            }
        });
    }

    // CSS to override any inline styles
    function injectOverrideCSS() {
        const styles = `
            <style id="inline-override-styles">
            /* Override ALL inline styles on dashboard when not active */
            body:not([data-current-view="dashboard"]) #dashboardView,
            body:not([data-current-view="dashboard"]) #dashboardView * {
                /* Reset all possible inline styles */
                all: unset !important;
                
                /* Then hide everything */
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                position: fixed !important;
                left: -999999px !important;
                top: -999999px !important;
                width: 0 !important;
                height: 0 !important;
                max-width: 0 !important;
                max-height: 0 !important;
                min-width: 0 !important;
                min-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                background: none !important;
                color: transparent !important;
                font-size: 0 !important;
                line-height: 0 !important;
                overflow: hidden !important;
                clip: rect(0,0,0,0) !important;
                clip-path: inset(100%) !important;
                transform: scale(0) translateX(-9999px) translateY(-9999px) !important;
                transition: none !important;
                animation: none !important;
                z-index: -99999 !important;
                pointer-events: none !important;
                user-select: none !important;
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                cursor: default !important;
                filter: opacity(0) !important;
                -webkit-filter: opacity(0) !important;
                contain: strict !important;
                content-visibility: hidden !important;
                will-change: auto !important;
            }

            /* Specific overrides for problematic elements */
            body:not([data-current-view="dashboard"]) #dashboardView .card[style],
            body:not([data-current-view="dashboard"]) #dashboardView .dashboard-grid[style],
            body:not([data-current-view="dashboard"]) #dashboardView button[style],
            body:not([data-current-view="dashboard"]) #dashboardView div[style] {
                all: unset !important;
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }

            /* Ensure only active view is visible */
            .view-container {
                display: none !important;
            }

            .view-container.active {
                display: block !important;
                all: revert !important;
            }

            /* Nuclear option for dashboard */
            #dashboardView:not(.active) {
                display: none !important;
                content: "" !important;
                position: fixed !important;
                left: -999999px !important;
                top: -999999px !important;
                width: 0 !important;
                height: 0 !important;
            }
            </style>
        `;

        if (!document.getElementById('inline-override-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing inline style override...');

        // Inject CSS
        injectOverrideCSS();

        // Remove existing inline styles
        removeAllDashboardInlineStyles();

        // Setup monitoring
        setupStyleMonitor();

        // Override setAttribute
        overrideSetAttribute();

        // Override style setters
        setTimeout(overrideStyleSetter, 100);

        // Set initial state
        const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard';
        document.body.setAttribute('data-current-view', currentView);

        // If not on dashboard, hide it
        if (currentView !== 'dashboard') {
            removeAllDashboardInlineStyles();
        }

        console.log('✅ Inline style override ready');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

    // Periodic cleanup
    setInterval(() => {
        const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view');
        if (currentView && currentView !== 'dashboard') {
            removeAllDashboardInlineStyles();
        }
    }, 2000);

    // Global function
    window.removeAllDashboardInlineStyles = removeAllDashboardInlineStyles;
})();
