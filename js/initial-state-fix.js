// Initial State Fix
// Ensures dashboard doesn't start as active unless it should be

(function() {
    'use strict';

    console.log('🏁 Initial State Fix initializing...');

    function fixInitialState() {
        // Get the current view from navigation or URL
        let currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view');
        
        // If no active nav item, check URL or default to dashboard
        if (!currentView) {
            const urlParams = new URLSearchParams(window.location.search);
            currentView = urlParams.get('view') || 'dashboard';
        }

        console.log('📍 Initial view should be:', currentView);

        // Remove active class from all views
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none';
        });

        // Only add active to the correct view
        const targetView = document.getElementById(`${currentView}View`);
        if (targetView) {
            targetView.classList.add('active');
            targetView.style.display = 'block';
        }

        // If we're not on dashboard, ensure it's hidden
        if (currentView !== 'dashboard') {
            const dashboard = document.getElementById('dashboardView');
            if (dashboard) {
                // Remove the hardcoded active class
                dashboard.classList.remove('active');
                
                // Force hide it
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
        }

        // Set body attribute
        document.body.setAttribute('data-current-view', currentView);
    }

    // Run immediately
    fixInitialState();

    // Also run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixInitialState);
    }

    // And after a short delay to catch any late changes
    setTimeout(fixInitialState, 100);
    setTimeout(fixInitialState, 500);

    console.log('✅ Initial state fix applied');
})();
