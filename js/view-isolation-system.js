// View Isolation System - Ensures complete separation between views
(function() {
    'use strict';

    console.log('🔒 View Isolation System initializing...');

    // Store original dashboard content
    let dashboardContent = null;
    let dashboardBackup = null;

    // Track current view
    let currentView = 'dashboard';

    // Create isolated containers for each view
    function createIsolatedContainers() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        // Create isolation wrapper if not exists
        if (!document.getElementById('viewIsolationWrapper')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'viewIsolationWrapper';
            wrapper.style.cssText = `
                width: 100%;
                height: 100%;
                position: relative;
                overflow: hidden;
            `;
            
            // Move all existing content into wrapper
            while (mainContent.firstChild) {
                wrapper.appendChild(mainContent.firstChild);
            }
            
            mainContent.appendChild(wrapper);
            console.log('✅ Created isolation wrapper');
        }
    }

    // Isolate dashboard completely
    function isolateDashboard() {
        const dashboard = document.getElementById('dashboardView');
        if (!dashboard) return;

        // Backup dashboard content if not done
        if (!dashboardBackup) {
            dashboardBackup = dashboard.cloneNode(true);
            console.log('📦 Backed up dashboard content');
        }

        // Remove all dashboard elements from DOM
        const dashboardElements = [
            dashboard,
            ...document.querySelectorAll('.dashboard-grid'),
            ...document.querySelectorAll('#dashboardView .card'),
            ...document.querySelectorAll('[id*="dashboard"]'),
            ...document.querySelectorAll('[class*="dashboard"]')
        ];

        dashboardElements.forEach(el => {
            if (el && el.parentNode) {
                el.remove();
            }
        });

        console.log('🗑️ Removed all dashboard elements from DOM');
    }

    // Clean view content before showing
    function cleanViewContent(view) {
        // Remove any dashboard remnants
        const viewContainer = document.getElementById(`${view}View`);
        if (!viewContainer) return;

        // Remove any dashboard cards that might have leaked
        viewContainer.querySelectorAll('.card').forEach(card => {
            const cardText = card.textContent || '';
            const dashboardKeywords = [
                'Welcome Back', 'Today\'s Progress', 'Active Challenges',
                'AI Insights', 'Top Performers', 'Redeem Points',
                'Pending Redemptions', 'Wallet & Burn Feed'
            ];
            
            if (dashboardKeywords.some(keyword => cardText.includes(keyword))) {
                console.warn(`🧹 Removing dashboard card from ${view}:`, card);
                card.remove();
            }
        });

        // Remove any dashboard-specific elements
        viewContainer.querySelectorAll('[id*="dashboard"], [class*="dashboard-"]').forEach(el => {
            if (!el.id.includes(view)) {
                el.remove();
            }
        });
    }

    // Override navigate with complete isolation
    const originalNavigate = window.navigate;
    window.navigate = function(view) {
        console.log(`🔄 Isolated navigate to: ${view}`);
        currentView = view;

        // Update body attribute
        document.body.setAttribute('data-current-view', view);

        // If leaving dashboard, isolate it completely
        if (view !== 'dashboard') {
            isolateDashboard();
        }

        // Hide ALL views first
        document.querySelectorAll('.view-container').forEach(v => {
            v.classList.remove('active');
            v.style.cssText = 'display: none !important;';
        });

        // Clean the target view
        cleanViewContent(view);

        // Show only the target view
        let targetView = document.getElementById(`${view}View`);
        
        // If dashboard and it was removed, restore it
        if (view === 'dashboard' && !targetView && dashboardBackup) {
            const wrapper = document.getElementById('viewIsolationWrapper') || 
                          document.getElementById('mainContent');
            wrapper.appendChild(dashboardBackup.cloneNode(true));
            targetView = document.getElementById('dashboardView');
            console.log('✅ Restored dashboard from backup');
        }

        if (targetView) {
            targetView.classList.add('active');
            targetView.style.cssText = 'display: block !important;';
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

        // Final cleanup after navigation
        setTimeout(() => {
            if (view !== 'dashboard') {
                isolateDashboard();
            }
            cleanViewContent(view);
        }, 100);
    };

    // Override loadViewContent with isolation
    const originalLoadViewContent = window.loadViewContent;
    window.loadViewContent = function(view) {
        console.log(`🔄 Isolated loadViewContent: ${view}`);

        // Use our isolated navigate
        window.navigate(view);

        // Call original if different from navigate
        if (typeof originalLoadViewContent === 'function' && 
            originalLoadViewContent !== originalNavigate) {
            try {
                // Wrap in timeout to ensure it runs after our isolation
                setTimeout(() => {
                    originalLoadViewContent.call(this, view);
                    
                    // Clean again after content loads
                    setTimeout(() => cleanViewContent(view), 100);
                }, 50);
            } catch (e) {
                console.warn('Original loadViewContent error:', e);
            }
        }
    };

    // Monitor for dashboard elements escaping
    function setupEscapeMonitor() {
        const observer = new MutationObserver((mutations) => {
            if (currentView === 'dashboard') return;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const isDashboard = 
                            node.id === 'dashboardView' ||
                            node.classList?.contains('dashboard-grid') ||
                            node.classList?.contains('card') ||
                            (node.textContent || '').includes('Welcome Back') ||
                            (node.textContent || '').includes("Today's Progress");

                        if (isDashboard && !node.closest(`#${currentView}View`)) {
                            console.warn('🚨 Dashboard element escaping:', node);
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

    // CSS to enforce isolation
    function injectIsolationCSS() {
        const styleId = 'view-isolation-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            /* Complete view isolation */
            .view-container {
                display: none !important;
                isolation: isolate !important;
                contain: layout style paint !important;
            }
            
            .view-container.active {
                display: block !important;
            }
            
            /* Hide dashboard when not active */
            body:not([data-current-view="dashboard"]) #dashboardView,
            body:not([data-current-view="dashboard"]) .dashboard-grid,
            body:not([data-current-view="dashboard"]) [id*="dashboard"]:not([id$="View"]),
            body:not([data-current-view="dashboard"]) [class*="dashboard-"] {
                display: none !important;
                visibility: hidden !important;
                position: absolute !important;
                left: -999999px !important;
                top: -999999px !important;
                width: 0 !important;
                height: 0 !important;
                pointer-events: none !important;
                opacity: 0 !important;
                overflow: hidden !important;
                content-visibility: hidden !important;
            }
            
            /* Ensure each view is isolated */
            #viewIsolationWrapper > .view-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-primary);
                overflow-y: auto;
            }
            
            /* Hide inactive views completely */
            #viewIsolationWrapper > .view-container:not(.active) {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
                z-index: -1 !important;
            }
            
            /* Active view takes full space */
            #viewIsolationWrapper > .view-container.active {
                display: block !important;
                visibility: visible !important;
                pointer-events: auto !important;
                z-index: 1 !important;
            }
            
            /* Prevent dashboard cards from appearing elsewhere */
            body:not([data-current-view="dashboard"]) .card:has(.card-title:contains("Welcome Back")),
            body:not([data-current-view="dashboard"]) .card:has(.card-title:contains("Today's Progress")),
            body:not([data-current-view="dashboard"]) .card:has(.card-title:contains("Active Challenges")),
            body:not([data-current-view="dashboard"]) .card:has(.card-title:contains("AI Insights")),
            body:not([data-current-view="dashboard"]) .card:has(.card-title:contains("Top Performers")),
            body:not([data-current-view="dashboard"]) .card:has(.card-title:contains("Redeem Points")),
            body:not([data-current-view="dashboard"]) .card:has(.card-title:contains("Pending Redemptions")),
            body:not([data-current-view="dashboard"]) .card:has(.card-title:contains("Wallet & Burn Feed")) {
                display: none !important;
            }
        `;
        document.head.appendChild(styles);
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing view isolation system...');

        // Create structures
        createIsolatedContainers();
        injectIsolationCSS();

        // Get initial view
        currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard';
        document.body.setAttribute('data-current-view', currentView);

        // If not on dashboard, isolate it
        if (currentView !== 'dashboard') {
            setTimeout(() => {
                isolateDashboard();
                cleanViewContent(currentView);
            }, 100);
        }

        // Setup monitoring
        setupEscapeMonitor();

        // Periodic cleanup
        setInterval(() => {
            if (currentView !== 'dashboard') {
                // Look for any escaped dashboard elements
                const escaped = document.querySelectorAll(`
                    body:not([data-current-view="dashboard"]) #dashboardView,
                    body:not([data-current-view="dashboard"]) .dashboard-grid,
                    body:not([data-current-view="dashboard"]) .card:contains("Welcome Back")
                `);
                
                escaped.forEach(el => {
                    console.warn('🧹 Cleaning escaped element:', el);
                    el.remove();
                });
            }
        }, 2000);

        console.log('✅ View isolation system ready');
    }

    // Run when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 0);
    }

    // Export for debugging
    window.viewIsolation = {
        isolateDashboard,
        cleanViewContent,
        getCurrentView: () => currentView,
        forceCleanup: () => {
            if (currentView !== 'dashboard') {
                isolateDashboard();
                cleanViewContent(currentView);
            }
        }
    };
})();
