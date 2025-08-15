// Main Content Restructure - Fixes the structural issue at the root
(function() {
    'use strict';

    console.log('🏗️ Main Content Restructure initializing...');

    function restructureMainContent() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) {
            console.error('Main content not found!');
            return;
        }

        console.log('📦 Restructuring main content...');

        // Step 1: Save existing dashboard content
        const dashboardView = document.getElementById('dashboardView');
        let dashboardContent = null;
        
        if (dashboardView) {
            // Extract just the dashboard-grid content
            const dashboardGrid = dashboardView.querySelector('.dashboard-grid');
            if (dashboardGrid) {
                dashboardContent = dashboardGrid.outerHTML;
            }
            console.log('💾 Saved dashboard content');
        }

        // Step 2: Clear main content completely
        mainContent.innerHTML = '';
        console.log('🧹 Cleared main content');

        // Step 3: Create proper structure
        const viewsWrapper = document.createElement('div');
        viewsWrapper.id = 'viewsWrapper';
        viewsWrapper.className = 'views-wrapper';
        viewsWrapper.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        `;

        mainContent.appendChild(viewsWrapper);
        console.log('✅ Created views wrapper');

        // Step 4: Create dashboard view properly (not hardcoded)
        if (dashboardContent) {
            const dashboardContainer = document.createElement('div');
            dashboardContainer.id = 'dashboardView';
            dashboardContainer.className = 'view-container';
            dashboardContainer.setAttribute('data-view', 'dashboard');
            dashboardContainer.style.display = 'none'; // Start hidden
            
            // Add content wrapper
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'view-content-wrapper';
            contentWrapper.innerHTML = dashboardContent;
            
            // Add modal layer
            const modalLayer = document.createElement('div');
            modalLayer.className = 'view-modal-layer';
            modalLayer.setAttribute('data-view-modals', 'dashboard');
            
            dashboardContainer.appendChild(contentWrapper);
            dashboardContainer.appendChild(modalLayer);
            
            viewsWrapper.appendChild(dashboardContainer);
            console.log('✅ Created properly structured dashboard view');
        }

        // Step 5: Move any floating modals to a global modal container
        const globalModals = document.createElement('div');
        globalModals.id = 'globalModalContainer';
        globalModals.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(globalModals);

        // Find and move any floating modals
        document.querySelectorAll('body > .modal, body > [id*="Modal"]').forEach(modal => {
            globalModals.appendChild(modal);
            console.log(`📦 Moved floating modal: ${modal.id || modal.className}`);
        });

        console.log('✅ Main content restructure complete');
    }

    // Apply structure fix on load
    function initialize() {
        console.log('🚀 Starting main content restructure...');
        
        // Wait a bit for other scripts to load
        setTimeout(() => {
            restructureMainContent();
            
            // Trigger navigation to refresh view
            const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard';
            if (window.navigate) {
                window.navigate(currentView);
            }
        }, 300);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

    // Export for debugging
    window.mainRestructure = {
        restructure: restructureMainContent
    };
})();
