// Structural Isolation Fix
// Moves dashboard content into a proper container and ensures complete isolation

(function() {
    'use strict';

    console.log('🏗️ Structural Isolation Fix initializing...');

    // Fix the structural issue by wrapping dashboard content
    function restructureDashboard() {
        const dashboardView = document.getElementById('dashboardView');
        if (!dashboardView) return;

        // Check if already restructured
        if (dashboardView.querySelector('.dashboard-isolation-wrapper')) return;

        console.log('📦 Restructuring dashboard for isolation...');

        // Create isolation wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'dashboard-isolation-wrapper';
        wrapper.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            contain: strict;
            isolation: isolate;
            z-index: 1;
        `;

        // Move all dashboard content into wrapper
        while (dashboardView.firstChild) {
            wrapper.appendChild(dashboardView.firstChild);
        }

        // Add wrapper back to dashboard
        dashboardView.appendChild(wrapper);

        // Find and isolate all dashboard modals
        isolateDashboardModals();
    }

    // Move dashboard modals into dashboard view
    function isolateDashboardModals() {
        // Find all modals that should belong to dashboard
        const dashboardModalSelectors = [
            '.achievement-notification',
            '.level-up-modal',
            '.daily-reward-modal',
            '.treasure-chest-modal',
            '.wheel-modal',
            '.burn-modal',
            '.streak-modal',
            '[id*="dashboard-modal"]',
            '.modal:has(.dashboard-content)'
        ];

        const dashboardView = document.getElementById('dashboardView');
        const wrapper = dashboardView?.querySelector('.dashboard-isolation-wrapper');
        
        if (!wrapper) return;

        dashboardModalSelectors.forEach(selector => {
            const modals = document.querySelectorAll(selector);
            modals.forEach(modal => {
                // If modal is not already in dashboard, move it
                if (!modal.closest('#dashboardView')) {
                    console.log(`📦 Moving modal to dashboard: ${modal.className || modal.id}`);
                    wrapper.appendChild(modal);
                    modal.setAttribute('data-dashboard-modal', 'true');
                }
            });
        });
    }

    // Override navigate to ensure proper view switching
    const originalNavigate = window.navigate;
    window.navigate = function(view) {
        console.log(`🔄 Structural navigation to: ${view}`);

        // Get all views
        const allViews = document.querySelectorAll('.view-container');
        
        // First, force hide everything
        allViews.forEach(viewEl => {
            viewEl.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                position: absolute !important;
                left: -999999px !important;
                top: -999999px !important;
                width: 1px !important;
                height: 1px !important;
                overflow: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                z-index: -10000 !important;
                transform: translateX(-200%) scale(0) !important;
            `;
            viewEl.classList.remove('active');
            
            // Also hide all children
            viewEl.querySelectorAll('*').forEach(child => {
                child.style.pointerEvents = 'none';
            });
        });

        // Special handling for dashboard
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView && view !== 'dashboard') {
            // Hide dashboard wrapper content
            const wrapper = dashboardView.querySelector('.dashboard-isolation-wrapper');
            if (wrapper) {
                wrapper.style.cssText = `
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    position: absolute !important;
                    left: -999999px !important;
                `;
            }

            // Hide all dashboard cards
            dashboardView.querySelectorAll('.card').forEach(card => {
                card.style.display = 'none !important';
                card.style.visibility = 'hidden !important';
            });

            // Hide dashboard grid
            const grid = dashboardView.querySelector('.dashboard-grid');
            if (grid) {
                grid.style.display = 'none !important';
                grid.style.visibility = 'hidden !important';
            }
        }

        // Show target view
        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            // Reset styles for active view
            targetView.style.cssText = `
                display: block !important;
                visibility: visible !important;
                position: relative !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: 100% !important;
                overflow: auto !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                z-index: 100 !important;
                transform: none !important;
            `;
            targetView.classList.add('active');

            // Enable children
            targetView.querySelectorAll('*').forEach(child => {
                child.style.pointerEvents = '';
            });

            // If going to dashboard, show wrapper
            if (view === 'dashboard') {
                const wrapper = targetView.querySelector('.dashboard-isolation-wrapper');
                if (wrapper) {
                    wrapper.style.cssText = `
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        pointer-events: auto !important;
                        position: relative !important;
                        left: 0 !important;
                    `;
                }

                // Show dashboard cards
                targetView.querySelectorAll('.card').forEach(card => {
                    card.style.display = '';
                    card.style.visibility = '';
                });

                // Show dashboard grid
                const grid = targetView.querySelector('.dashboard-grid');
                if (grid) {
                    grid.style.display = '';
                    grid.style.visibility = '';
                }
            }
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

        // Force layout recalculation
        void document.body.offsetHeight;

        // Final check after delay
        setTimeout(() => {
            if (view !== 'dashboard') {
                ensureDashboardHidden();
            }
        }, 100);
    };

    // Ensure dashboard is completely hidden
    function ensureDashboardHidden() {
        const dashboard = document.getElementById('dashboardView');
        if (!dashboard) return;

        // Check if dashboard or any of its content is visible
        const rect = dashboard.getBoundingClientRect();
        if (rect.width > 0 || rect.height > 0) {
            console.warn('⚠️ Dashboard still visible, forcing hide');
            
            dashboard.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                position: fixed !important;
                left: -999999px !important;
                top: -999999px !important;
                width: 1px !important;
                height: 1px !important;
                overflow: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                z-index: -10000 !important;
            `;
        }
    }

    // Add structural CSS
    function injectStructuralCSS() {
        const styles = `
            <style id="structural-isolation-styles">
            /* Main content container */
            .main-content {
                position: relative;
                overflow: hidden;
                height: 100%;
                contain: layout style paint;
            }

            /* View container isolation */
            .view-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                contain: strict;
                overflow: auto;
            }

            /* Dashboard isolation wrapper */
            .dashboard-isolation-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                contain: strict;
                isolation: isolate;
                overflow: auto;
            }

            /* Hide non-active views */
            .view-container:not(.active) {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
                position: fixed !important;
                left: -999999px !important;
                top: -999999px !important;
                width: 1px !important;
                height: 1px !important;
                overflow: hidden !important;
                opacity: 0 !important;
                z-index: -10000 !important;
                transform: translateX(-200%) scale(0) !important;
            }

            /* Ensure active view is visible */
            .view-container.active {
                display: block !important;
                visibility: visible !important;
                pointer-events: auto !important;
                position: relative !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: 100% !important;
                opacity: 1 !important;
                z-index: 10 !important;
                transform: none !important;
            }

            /* Hide dashboard elements when not active */
            body:not([data-current-view="dashboard"]) #dashboardView,
            body:not([data-current-view="dashboard"]) #dashboardView * {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }

            /* Dashboard-specific hiding */
            body:not([data-current-view="dashboard"]) .dashboard-grid,
            body:not([data-current-view="dashboard"]) .dashboard-isolation-wrapper,
            body:not([data-current-view="dashboard"]) #dashboardView .card {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                position: absolute !important;
                left: -999999px !important;
            }

            /* Modal containment */
            [data-dashboard-modal="true"] {
                position: absolute !important;
                contain: layout style paint !important;
            }

            /* Z-index management */
            .view-container { z-index: 1; }
            .view-container.active { z-index: 10; }
            #dashboardView:not(.active) { z-index: -10000 !important; }
            
            /* Force modal stacking context */
            .modal, [class*="modal"] {
                position: fixed;
                z-index: 1000;
            }
            
            .view-container:not(.active) .modal,
            .view-container:not(.active) [class*="modal"] {
                display: none !important;
                z-index: -1 !important;
            }
            </style>
        `;

        if (!document.getElementById('structural-isolation-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    // Monitor for escaping elements
    function setupEscapeMonitor() {
        const observer = new MutationObserver((mutations) => {
            const currentView = document.body.getAttribute('data-current-view');
            
            if (currentView && currentView !== 'dashboard') {
                // Check for any dashboard elements becoming visible
                const dashboardElements = document.querySelectorAll(
                    '#dashboardView .card:not([style*="display: none"]), ' +
                    '#dashboardView .dashboard-grid:not([style*="display: none"]), ' +
                    '[data-dashboard-modal]:not([style*="display: none"])'
                );

                dashboardElements.forEach(el => {
                    console.warn('🚨 Dashboard element escaping:', el);
                    el.style.cssText = 'display: none !important; visibility: hidden !important;';
                });
            }
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style', 'class'],
            subtree: true,
            childList: true
        });
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing structural isolation...');

        // Inject CSS first
        injectStructuralCSS();

        // Restructure dashboard
        setTimeout(() => {
            restructureDashboard();
            isolateDashboardModals();
        }, 100);

        // Setup monitoring
        setupEscapeMonitor();

        // Set initial view state
        const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard';
        document.body.setAttribute('data-current-view', currentView);

        // Force proper initial state
        if (currentView !== 'dashboard') {
            setTimeout(ensureDashboardHidden, 200);
        }

        console.log('✅ Structural isolation ready');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

    // Global functions
    window.structuralIsolation = {
        restructureDashboard,
        isolateDashboardModals,
        ensureDashboardHidden
    };
})();
