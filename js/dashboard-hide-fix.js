// Dashboard Hide Fix
// Ensures dashboard and all its elements are completely hidden when viewing other tabs

(function() {
    'use strict';

    console.log('🚫 Dashboard Hide Fix initializing...');

    // Store original navigate function
    const originalNavigate = window.navigate;

    // Override navigate with aggressive dashboard hiding
    window.navigate = function(view) {
        console.log(`🔄 Navigating to: ${view}`);

        // First, hide EVERYTHING
        hideAllViews();

        // Special aggressive hiding for dashboard
        if (view !== 'dashboard') {
            aggressivelyHideDashboard();
        }

        // Show only the target view
        showTargetView(view);

        // Update navigation
        updateNavigation(view);

        // Call original navigate if exists
        if (originalNavigate && typeof originalNavigate === 'function') {
            try {
                originalNavigate.call(this, view);
            } catch (e) {
                console.warn('Original navigate error:', e);
            }
        }

        // Force reflow to ensure changes take effect
        forceReflow();

        // Double-check dashboard is hidden after a delay
        if (view !== 'dashboard') {
            setTimeout(() => aggressivelyHideDashboard(), 100);
            setTimeout(() => aggressivelyHideDashboard(), 500);
        }
    };

    function hideAllViews() {
        // Hide all view containers
        const allViews = document.querySelectorAll('.view-container');
        allViews.forEach(view => {
            view.classList.remove('active');
            view.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                position: absolute !important;
                left: -99999px !important;
                top: -99999px !important;
                z-index: -1000 !important;
                pointer-events: none !important;
                width: 0 !important;
                height: 0 !important;
                overflow: hidden !important;
            `;
        });

        // Also hide any floating modals
        const modals = document.querySelectorAll('.modal, [class*="modal"], [id*="modal"]');
        modals.forEach(modal => {
            if (!modal.closest('#modalContainer')) {
                modal.style.display = 'none';
                modal.style.visibility = 'hidden';
            }
        });
    }

    function aggressivelyHideDashboard() {
        const dashboard = document.getElementById('dashboardView');
        if (!dashboard) return;

        // Hide the dashboard itself
        dashboard.style.cssText = `
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            position: fixed !important;
            left: -99999px !important;
            top: -99999px !important;
            z-index: -9999 !important;
            pointer-events: none !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
            transform: scale(0) !important;
        `;

        // Hide all dashboard children
        const dashboardElements = dashboard.querySelectorAll('*');
        dashboardElements.forEach(el => {
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
        });

        // Hide dashboard-specific elements that might be floating
        const dashboardModals = document.querySelectorAll(
            '.dashboard-modal, .achievement-notification, .level-up-modal, ' +
            '.daily-reward-modal, .streak-modal, [data-dashboard-modal="true"]'
        );
        
        dashboardModals.forEach(modal => {
            modal.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                z-index: -1000 !important;
            `;
        });

        // Hide any cards that might be floating
        const cards = dashboard.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.display = 'none';
        });
    }

    function showTargetView(viewName) {
        const targetView = document.getElementById(`${viewName}View`);
        if (!targetView) {
            console.warn(`View not found: ${viewName}View`);
            return;
        }

        // Reset and show the target view
        targetView.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            left: auto !important;
            top: auto !important;
            z-index: 10 !important;
            pointer-events: auto !important;
            width: 100% !important;
            height: 100% !important;
            overflow: auto !important;
            transform: none !important;
        `;

        targetView.classList.add('active');

        // Ensure all children are visible
        const children = targetView.querySelectorAll('*');
        children.forEach(child => {
            if (child.style.visibility === 'hidden') {
                child.style.visibility = 'visible';
            }
            if (child.style.pointerEvents === 'none') {
                child.style.pointerEvents = 'auto';
            }
        });
    }

    function updateNavigation(view) {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === view) {
                item.classList.add('active');
            }
        });

        // Update page title
        const titleElement = document.getElementById('pageTitle');
        if (titleElement) {
            const titles = {
                dashboard: 'Mission Control',
                goals: 'Goals & Objectives',
                habits: 'Habit Tracker',
                'ai-chat': 'AI Assistant',
                social: 'Social Hub',
                leaderboard: 'Leaderboard',
                achievements: 'Achievements',
                wallet: 'Wallet',
                analytics: 'Analytics',
                settings: 'Settings',
                burn: 'Focus Timer',
                community: 'Community'
            };
            titleElement.textContent = titles[view] || 'Operator Uplift';
        }
    }

    function forceReflow() {
        // Force browser to recalculate layout
        document.body.offsetHeight;
    }

    // Add CSS rules for extra safety
    function injectHidingStyles() {
        const styles = `
            <style id="dashboard-hide-styles">
            /* Ensure views are properly contained */
            .main-content {
                position: relative;
                overflow: hidden;
                height: 100%;
            }

            /* Hide non-active views completely */
            .view-container:not(.active) {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                position: fixed !important;
                left: -99999px !important;
                top: -99999px !important;
                z-index: -1000 !important;
                pointer-events: none !important;
                transform: translateX(-200%) !important;
            }

            /* Extra hiding for dashboard when not active */
            #dashboardView:not(.active),
            #dashboardView:not(.active) * {
                visibility: hidden !important;
                pointer-events: none !important;
            }

            /* Ensure active view is on top */
            .view-container.active {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 100 !important;
                pointer-events: auto !important;
                transform: none !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }

            /* Hide dashboard-specific modals when not on dashboard */
            body:not([data-current-view="dashboard"]) .dashboard-modal,
            body:not([data-current-view="dashboard"]) .achievement-notification,
            body:not([data-current-view="dashboard"]) .daily-reward-modal {
                display: none !important;
            }

            /* Ensure modals stay within their views */
            .view-container {
                contain: layout style;
            }

            /* Force dashboard cards to hide */
            #dashboardView:not(.active) .card,
            #dashboardView:not(.active) .dashboard-grid {
                display: none !important;
                visibility: hidden !important;
            }
            </style>
        `;

        if (!document.getElementById('dashboard-hide-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    // Monitor for dashboard elements trying to show
    function setupDashboardMonitor() {
        const observer = new MutationObserver((mutations) => {
            const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view');
            
            if (currentView && currentView !== 'dashboard') {
                // Check if dashboard is trying to show
                const dashboard = document.getElementById('dashboardView');
                if (dashboard && (
                    dashboard.style.display !== 'none' ||
                    dashboard.style.visibility !== 'hidden' ||
                    dashboard.classList.contains('active')
                )) {
                    console.warn('🚫 Dashboard trying to show, hiding it again');
                    aggressivelyHideDashboard();
                }
            }
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style', 'class'],
            subtree: true
        });
    }

    // Track current view on body
    function trackCurrentView() {
        const originalNavigate = window.navigate;
        window.navigate = function(view) {
            document.body.setAttribute('data-current-view', view);
            return originalNavigate.apply(this, arguments);
        };
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing dashboard hide fix...');
        
        // Inject styles
        injectHidingStyles();
        
        // Setup monitoring
        setupDashboardMonitor();
        
        // Track current view
        trackCurrentView();
        
        // Fix initial state
        const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard';
        document.body.setAttribute('data-current-view', currentView);
        
        if (currentView !== 'dashboard') {
            setTimeout(() => aggressivelyHideDashboard(), 100);
        }
        
        console.log('✅ Dashboard hide fix ready');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

    // Global function to manually hide dashboard
    window.hideDashboard = aggressivelyHideDashboard;
})();
