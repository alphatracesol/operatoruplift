// View Navigation Fix
// Ensures only the active view is visible and dashboard doesn't overlap other views

(function() {
    'use strict';

    console.log('🔧 View Navigation Fix initializing...');

    // Store original navigate function
    const originalNavigate = window.navigate;

    // Enhanced navigate function
    window.navigate = function(view) {
        console.log('🔄 Navigating to:', view);

        // Hide all views first
        const allViews = document.querySelectorAll('.view-container');
        allViews.forEach(v => {
            v.classList.remove('active');
            v.style.display = 'none';
            v.style.visibility = 'hidden';
            v.style.zIndex = '0';
        });

        // Special handling for dashboard to ensure it's truly hidden
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView && view !== 'dashboard') {
            dashboardView.style.display = 'none !important';
            dashboardView.style.position = 'absolute';
            dashboardView.style.left = '-9999px';
            dashboardView.style.pointerEvents = 'none';
        }

        // Show the selected view
        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            targetView.classList.add('active');
            targetView.style.display = 'block';
            targetView.style.visibility = 'visible';
            targetView.style.zIndex = '10';
            targetView.style.position = 'relative';
            targetView.style.pointerEvents = 'auto';
            
            // Reset dashboard position if navigating to it
            if (view === 'dashboard') {
                targetView.style.left = 'auto';
            }
        }

        // Update navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === view) {
                item.classList.add('active');
            }
        });

        // Call original navigate if exists
        if (originalNavigate) {
            originalNavigate.apply(this, arguments);
        }

        // Update page title
        updatePageTitle(view);

        // Trigger view change event
        window.dispatchEvent(new CustomEvent('viewChanged', { detail: { view } }));
    };

    function updatePageTitle(view) {
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

    // Fix z-index stacking
    function fixZIndexStacking() {
        const styles = `
            <style id="view-navigation-fix-styles">
            /* Ensure proper view stacking */
            .view-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 0;
            }

            .view-container.active {
                display: block !important;
                opacity: 1 !important;
                z-index: 10 !important;
                position: relative !important;
            }

            /* Hide non-active views completely */
            .view-container:not(.active) {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
                position: absolute !important;
                left: -9999px !important;
            }

            /* Ensure main content takes full space */
            .main-content {
                position: relative;
                height: 100%;
                overflow: hidden;
            }

            /* Dashboard specific fix */
            #dashboardView:not(.active) {
                display: none !important;
                position: absolute !important;
                left: -9999px !important;
                z-index: -1 !important;
            }

            /* Modal z-index fix */
            .modal,
            .view-modal,
            #modalContainer {
                z-index: 1000 !important;
            }

            .modal-backdrop,
            .view-modal-overlay {
                z-index: 999 !important;
            }

            /* Ensure active view content is interactable */
            .view-container.active * {
                pointer-events: auto !important;
            }
            </style>
        `;

        if (!document.getElementById('view-navigation-fix-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing view navigation fix...');
        
        // Apply styles
        fixZIndexStacking();
        
        // Fix initial state
        const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard';
        navigate(currentView);
        
        console.log('✅ View navigation fix ready');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }
})();
