// Unified View Fix - Ensures all view switching goes through proper channels
(function() {
    'use strict';

    console.log('🔧 Unified View Fix initializing...');

    // Store original functions
    const originalLoadViewContent = window.loadViewContent;
    const originalNavigate = window.navigate;

    // Track dashboard state
    let dashboardRemoved = false;
    let dashboardHTML = null;
    let dashboardParent = null;
    let dashboardNextSibling = null;

    // Remove dashboard completely
    function removeDashboardCompletely() {
        const dashboard = document.getElementById('dashboardView');
        if (!dashboard) return;

        // Store info before removal
        if (!dashboardHTML) {
            dashboardHTML = dashboard.outerHTML;
            dashboardParent = dashboard.parentNode;
            dashboardNextSibling = dashboard.nextSibling;
        }

        // Remove from DOM
        dashboard.remove();
        dashboardRemoved = true;
        console.log('🗑️ Dashboard completely removed from DOM');
    }

    // Restore dashboard
    function restoreDashboard() {
        if (!dashboardRemoved || !dashboardHTML) return;

        const existing = document.getElementById('dashboardView');
        if (existing) return;

        const temp = document.createElement('div');
        temp.innerHTML = dashboardHTML;
        const dashboard = temp.firstChild;

        if (dashboardNextSibling) {
            dashboardParent.insertBefore(dashboard, dashboardNextSibling);
        } else {
            dashboardParent.appendChild(dashboard);
        }

        dashboardRemoved = false;
        console.log('✅ Dashboard restored to DOM');
    }

    // Override loadViewContent
    window.loadViewContent = function(view) {
        console.log(`🔄 Unified loadViewContent: ${view}`);

        // Update body attribute
        document.body.setAttribute('data-current-view', view);

        // Handle dashboard removal/restoration
        if (view === 'dashboard') {
            restoreDashboard();
        } else {
            removeDashboardCompletely();
        }

        // Call original if exists
        if (typeof originalLoadViewContent === 'function') {
            try {
                originalLoadViewContent.call(this, view);
            } catch (e) {
                console.warn('Original loadViewContent error:', e);
            }
        }

        // Ensure proper visibility after load
        setTimeout(() => {
            if (view !== 'dashboard') {
                const dashboard = document.getElementById('dashboardView');
                if (dashboard) {
                    console.warn('🚨 Dashboard still exists after loadViewContent, removing...');
                    removeDashboardCompletely();
                }
            }
        }, 100);
    };

    // Override navigate
    window.navigate = function(view) {
        console.log(`🔄 Unified navigate: ${view}`);
        
        // Just call loadViewContent which handles everything
        window.loadViewContent(view);

        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-view') === view);
        });

        // Call original if exists and different from loadViewContent
        if (typeof originalNavigate === 'function' && originalNavigate !== originalLoadViewContent) {
            try {
                originalNavigate.call(this, view);
            } catch (e) {
                console.warn('Original navigate error:', e);
            }
        }
    };

    // CSS injection
    function injectCSS() {
        const styleId = 'unified-view-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            /* Hide dashboard when not current view */
            body[data-current-view]:not([data-current-view="dashboard"]) #dashboardView {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                position: absolute !important;
                left: -999999px !important;
                top: -999999px !important;
                width: 0 !important;
                height: 0 !important;
                pointer-events: none !important;
                overflow: hidden !important;
            }

            /* Ensure only active view shows */
            .view-container {
                display: none !important;
            }

            .view-container.active {
                display: block !important;
            }

            /* Extra insurance for dashboard elements */
            body[data-current-view]:not([data-current-view="dashboard"]) .dashboard-grid,
            body[data-current-view]:not([data-current-view="dashboard"]) #dashboardView .card {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
        `;
        document.head.appendChild(styles);
    }

    // Monitor for rogue dashboard elements
    function setupMonitor() {
        const observer = new MutationObserver(() => {
            const currentView = document.body.getAttribute('data-current-view');
            if (currentView && currentView !== 'dashboard') {
                const dashboard = document.getElementById('dashboardView');
                if (dashboard && !dashboardRemoved) {
                    console.warn('🚨 Dashboard appeared when it shouldn\'t, removing...');
                    removeDashboardCompletely();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing unified view fix...');

        // Inject CSS
        injectCSS();

        // Set initial state
        const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard';
        document.body.setAttribute('data-current-view', currentView);

        // Remove dashboard if not current
        if (currentView !== 'dashboard') {
            removeDashboardCompletely();
        }

        // Setup monitoring
        setupMonitor();

        console.log('✅ Unified view fix ready');
    }

    // Run when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 0);
    }

    // Export for debugging
    window.unifiedViewFix = {
        removeDashboard: removeDashboardCompletely,
        restoreDashboard,
        getCurrentView: () => document.body.getAttribute('data-current-view')
    };
})();
