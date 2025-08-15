// Radical Dashboard Fix - Complete DOM manipulation approach
(function() {
    'use strict';

    console.log('🔥 Radical Dashboard Fix initializing...');

    // Store dashboard HTML
    let dashboardHTML = null;
    let dashboardParent = null;
    let dashboardNextSibling = null;

    // Track current view
    let currentView = 'dashboard';

    // Complete removal function
    function removeDashboard() {
        const dashboard = document.getElementById('dashboardView');
        if (!dashboard) return;

        // Store its HTML and position if not already stored
        if (!dashboardHTML) {
            dashboardHTML = dashboard.outerHTML;
            dashboardParent = dashboard.parentNode;
            dashboardNextSibling = dashboard.nextSibling;
        }

        // Completely remove from DOM
        dashboard.remove();
        console.log('🗑️ Dashboard removed from DOM');

        // Also remove any floating elements
        document.querySelectorAll('.dashboard-grid, .card').forEach(el => {
            if (!el.closest('.view-container') || el.closest('#dashboardView')) {
                el.remove();
            }
        });
    }

    // Restore dashboard function
    function restoreDashboard() {
        if (!dashboardHTML || !dashboardParent) return;

        // Check if already exists
        if (document.getElementById('dashboardView')) return;

        // Create temporary container
        const temp = document.createElement('div');
        temp.innerHTML = dashboardHTML;
        const dashboard = temp.firstChild;

        // Insert back into DOM
        if (dashboardNextSibling) {
            dashboardParent.insertBefore(dashboard, dashboardNextSibling);
        } else {
            dashboardParent.appendChild(dashboard);
        }

        // Add active class
        dashboard.classList.add('active');
        console.log('✅ Dashboard restored to DOM');
    }

    // Override navigate function
    const originalNavigate = window.navigate;
    window.navigate = function(view) {
        console.log(`🔄 Radical navigate to: ${view}`);
        currentView = view;

        // Update body attribute
        document.body.setAttribute('data-current-view', view);

        // Handle dashboard visibility
        if (view === 'dashboard') {
            // Restore dashboard if needed
            restoreDashboard();
        } else {
            // Remove dashboard completely
            removeDashboard();
        }

        // Hide all views
        document.querySelectorAll('.view-container').forEach(v => {
            v.classList.remove('active');
            v.style.display = 'none';
        });

        // Show target view
        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            targetView.classList.add('active');
            targetView.style.display = 'block';
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-view') === view);
        });

        // Call original if exists
        if (typeof originalNavigate === 'function') {
            try {
                originalNavigate.call(this, view);
            } catch (e) {
                console.warn('Original navigate error:', e);
            }
        }
    };

    // Create a style element that targets specific selectors
    function injectAggressiveStyles() {
        const styleId = 'radical-dashboard-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            /* Target dashboard with all possible selectors */
            body:not([data-current-view="dashboard"]) #dashboardView,
            body:not([data-current-view="dashboard"]) .dashboard-grid,
            body:not([data-current-view="dashboard"]) #dashboardView .card,
            body:not([data-current-view="dashboard"]) #dashboardView .card[style],
            body:not([data-current-view="dashboard"]) #dashboardView div[style],
            body:not([data-current-view="dashboard"]) #dashboardView *[style] {
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
                overflow: hidden !important;
                transform: scale(0) !important;
                pointer-events: none !important;
                z-index: -99999 !important;
            }

            /* Ensure view containers work properly */
            .view-container {
                display: none !important;
            }

            .view-container.active {
                display: block !important;
            }

            /* Override any transform or translate styles */
            body:not([data-current-view="dashboard"]) #dashboardView [style*="transform"],
            body:not([data-current-view="dashboard"]) #dashboardView [style*="translate"],
            body:not([data-current-view="dashboard"]) #dashboardView [style*="opacity"] {
                transform: none !important;
                translate: none !important;
                opacity: 0 !important;
                display: none !important;
            }
        `;
        document.head.appendChild(styles);
    }

    // Monitor for dashboard elements escaping
    function setupEscapeMonitor() {
        const observer = new MutationObserver((mutations) => {
            if (currentView === 'dashboard') return;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // Check if it's a dashboard element
                        if (node.id === 'dashboardView' || 
                            node.classList?.contains('dashboard-grid') ||
                            node.classList?.contains('card') ||
                            node.closest?.('#dashboardView')) {
                            console.warn('🚨 Dashboard element trying to appear:', node);
                            node.remove();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing radical dashboard fix...');

        // Inject styles
        injectAggressiveStyles();

        // Get current view
        currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard';
        document.body.setAttribute('data-current-view', currentView);

        // If not on dashboard, remove it
        if (currentView !== 'dashboard') {
            removeDashboard();
        }

        // Setup monitoring
        setupEscapeMonitor();

        // Check every second
        setInterval(() => {
            if (currentView !== 'dashboard') {
                // Look for any dashboard elements
                const dashboard = document.getElementById('dashboardView');
                if (dashboard && dashboard.offsetParent !== null) {
                    console.warn('🚨 Dashboard still visible, removing...');
                    removeDashboard();
                }

                // Remove any stray dashboard elements
                document.querySelectorAll('.dashboard-grid, #dashboardView .card').forEach(el => {
                    if (el.offsetParent !== null) {
                        el.remove();
                    }
                });
            }
        }, 1000);

        console.log('✅ Radical dashboard fix ready');
    }

    // Run when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 0);
    }

    // Export for debugging
    window.radicalDashboardFix = {
        removeDashboard,
        restoreDashboard,
        currentView: () => currentView
    };
})();
