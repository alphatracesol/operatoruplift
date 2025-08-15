// Dashboard DOM Removal
// Nuclear option - completely removes dashboard from DOM when not active

(function() {
    'use strict';

    console.log('☢️ Dashboard DOM Removal initializing...');

    // Store dashboard HTML for restoration
    let dashboardHTML = null;
    let dashboardParent = null;
    let dashboardNextSibling = null;

    // Override navigate with DOM removal
    const originalNavigate = window.navigate;
    window.navigate = function(view) {
        console.log(`🔄 DOM Removal navigation to: ${view}`);

        const dashboardView = document.getElementById('dashboardView');
        
        if (view === 'dashboard') {
            // Restore dashboard if it was removed
            restoreDashboard();
        } else {
            // Remove dashboard from DOM completely
            removeDashboard();
        }

        // Hide all other views first
        document.querySelectorAll('.view-container').forEach(v => {
            if (v.id !== `${view}View`) {
                v.classList.remove('active');
                v.style.display = 'none';
            }
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

        // Update body attribute
        document.body.setAttribute('data-current-view', view);

        // Call original navigate
        if (originalNavigate && typeof originalNavigate === 'function') {
            try {
                originalNavigate.call(this, view);
            } catch (e) {
                console.warn('Original navigate error:', e);
            }
        }
    };

    // Remove dashboard from DOM
    function removeDashboard() {
        const dashboardView = document.getElementById('dashboardView');
        if (!dashboardView) return;

        console.log('💥 Removing dashboard from DOM');

        // Store dashboard info for restoration
        dashboardHTML = dashboardView.outerHTML;
        dashboardParent = dashboardView.parentNode;
        dashboardNextSibling = dashboardView.nextSibling;

        // Remove all dashboard-related elements
        const elementsToRemove = [
            dashboardView,
            ...document.querySelectorAll('[data-dashboard-modal]'),
            ...document.querySelectorAll('.dashboard-modal'),
            ...document.querySelectorAll('.achievement-notification'),
            ...document.querySelectorAll('.daily-reward-modal'),
            ...document.querySelectorAll('.level-up-modal')
        ];

        elementsToRemove.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });

        // Also remove any floating dashboard elements
        cleanupFloatingElements();
    }

    // Restore dashboard to DOM
    function restoreDashboard() {
        // Check if dashboard already exists
        if (document.getElementById('dashboardView')) return;

        console.log('♻️ Restoring dashboard to DOM');

        if (dashboardHTML && dashboardParent) {
            // Create temporary container
            const temp = document.createElement('div');
            temp.innerHTML = dashboardHTML;
            const restoredDashboard = temp.firstChild;

            // Insert back into DOM
            if (dashboardNextSibling) {
                dashboardParent.insertBefore(restoredDashboard, dashboardNextSibling);
            } else {
                dashboardParent.appendChild(restoredDashboard);
            }

            // Re-initialize any dashboard functionality
            reinitializeDashboard();
        }
    }

    // Clean up any floating dashboard elements
    function cleanupFloatingElements() {
        // Remove any elements that might be dashboard-related
        const selectors = [
            '.card:not(.view-container .card)',
            '.modal:not(.view-container .modal)',
            '[class*="dashboard"]:not(.view-container [class*="dashboard"])',
            '[id*="dashboard"]:not(.view-container [id*="dashboard"])'
        ];

        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // Check if element is floating (not in a view container)
                    if (!el.closest('.view-container') && el.closest('body')) {
                        console.log('🧹 Removing floating element:', el);
                        el.remove();
                    }
                });
            } catch (e) {
                // Ignore selector errors
            }
        });
    }

    // Re-initialize dashboard after restoration
    function reinitializeDashboard() {
        // Re-run any dashboard initialization code
        if (window.initializeDashboard) {
            window.initializeDashboard();
        }

        // Re-attach event listeners
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            // Re-initialize cards, buttons, etc.
            dashboardView.querySelectorAll('button').forEach(btn => {
                const onclick = btn.getAttribute('onclick');
                if (onclick) {
                    try {
                        btn.onclick = new Function(onclick);
                    } catch (e) {
                        console.warn('Could not restore onclick:', e);
                    }
                }
            });
        }
    }

    // Aggressive CSS to ensure removed elements stay hidden
    function injectRemovalCSS() {
        const styles = `
            <style id="dashboard-removal-styles">
            /* When dashboard is removed, hide any stragglers */
            body:not([data-current-view="dashboard"]) [id*="dashboard"],
            body:not([data-current-view="dashboard"]) [class*="dashboard"],
            body:not([data-current-view="dashboard"]) .card:not(.view-container .card),
            body:not([data-current-view="dashboard"]) .modal:not(.view-container .modal) {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                position: fixed !important;
                left: -999999px !important;
                top: -999999px !important;
                width: 0 !important;
                height: 0 !important;
                overflow: hidden !important;
                z-index: -99999 !important;
            }

            /* Ensure only active view is visible */
            .view-container {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                contain: strict;
            }

            .view-container.active {
                display: block !important;
                z-index: 100;
            }

            /* Nuclear hiding for dashboard when not active */
            #dashboardView:not(.active) {
                display: none !important;
                content-visibility: hidden !important;
                contain: strict !important;
                user-select: none !important;
                -webkit-user-select: none !important;
                pointer-events: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                position: fixed !important;
                left: -999999px !important;
                top: -999999px !important;
                width: 0 !important;
                height: 0 !important;
                max-width: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                clip-path: inset(100%) !important;
                transform: scale(0) !important;
                z-index: -99999 !important;
            }
            </style>
        `;

        if (!document.getElementById('dashboard-removal-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    // Monitor for dashboard resurrection
    function setupResurrectionMonitor() {
        const observer = new MutationObserver((mutations) => {
            const currentView = document.body.getAttribute('data-current-view');
            
            if (currentView && currentView !== 'dashboard') {
                // Check if dashboard is trying to come back
                const dashboard = document.getElementById('dashboardView');
                if (dashboard && dashboard.parentNode) {
                    console.warn('🧟 Dashboard resurrected! Removing again...');
                    removeDashboard();
                }

                // Clean up any new floating elements
                cleanupFloatingElements();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing dashboard DOM removal...');

        // Inject CSS
        injectRemovalCSS();

        // Store initial dashboard HTML
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView) {
            dashboardHTML = dashboardView.outerHTML;
            dashboardParent = dashboardView.parentNode;
            dashboardNextSibling = dashboardView.nextSibling;
        }

        // Setup monitoring
        setupResurrectionMonitor();

        // Check initial state
        const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard';
        document.body.setAttribute('data-current-view', currentView);

        // Remove dashboard if not active
        if (currentView !== 'dashboard') {
            setTimeout(removeDashboard, 100);
        }

        // Periodic cleanup
        setInterval(() => {
            const currentView = document.body.getAttribute('data-current-view');
            if (currentView && currentView !== 'dashboard') {
                cleanupFloatingElements();
            }
        }, 5000);

        console.log('✅ Dashboard DOM removal ready');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

    // Global functions
    window.dashboardDOMRemoval = {
        removeDashboard,
        restoreDashboard,
        cleanupFloatingElements
    };
})();
