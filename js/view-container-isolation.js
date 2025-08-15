// View Container Isolation - Ensures each view and its modals are properly contained
(function() {
    'use strict';

    console.log('📦 View Container Isolation initializing...');

    // Store view states
    const viewStates = new Map();

    // Create isolated container for each view
    function createIsolatedView(viewName) {
        const container = document.createElement('div');
        container.id = `${viewName}View`;
        container.className = 'view-container';
        container.setAttribute('data-view', viewName);
        
        // Create inner wrapper for content
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'view-content-wrapper';
        contentWrapper.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            overflow-y: auto;
        `;
        
        // Create modal layer for this view
        const modalLayer = document.createElement('div');
        modalLayer.className = 'view-modal-layer';
        modalLayer.setAttribute('data-view-modals', viewName);
        modalLayer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        `;
        
        container.appendChild(contentWrapper);
        container.appendChild(modalLayer);
        
        return {
            container,
            contentWrapper,
            modalLayer
        };
    }

    // Override navigate to use isolated containers
    window.navigate = function(view) {
        console.log(`🔄 Isolated navigate to: ${view}`);

        const viewsWrapper = document.getElementById('viewsWrapper') || 
                           document.getElementById('mainContent');
        
        if (!viewsWrapper) {
            console.error('No views wrapper found!');
            return;
        }

        // Hide ALL views and their modals
        viewsWrapper.querySelectorAll('.view-container').forEach(v => {
            v.style.display = 'none';
            v.classList.remove('active');
            
            // Hide all modals in this view
            const modals = v.querySelectorAll('.modal, [id*="Modal"]');
            modals.forEach(modal => {
                modal.style.display = 'none';
                modal.classList.remove('show');
            });
        });

        // Get or create the target view with isolation
        let targetView = document.getElementById(`${view}View`);
        
        if (!targetView) {
            console.log(`📦 Creating isolated ${view} view...`);
            
            // Create isolated container
            const isolated = createIsolatedView(view);
            targetView = isolated.container;
            
            // Get content for the view
            const content = getViewContent(view);
            isolated.contentWrapper.innerHTML = content;
            
            // Store reference
            viewStates.set(view, isolated);
            
            // Add to wrapper
            viewsWrapper.appendChild(targetView);
            
            // Move any existing modals for this view into its modal layer
            moveModalsToView(view, isolated.modalLayer);
        }

        // Show ONLY the target view
        targetView.style.display = 'block';
        targetView.classList.add('active');

        // Ensure no other view's content is visible
        ensureViewIsolation(view);

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-view') === view);
        });

        // Update body attribute
        document.body.setAttribute('data-current-view', view);

        console.log(`✅ Showing isolated ${view} view`);
    };

    // Get view content
    function getViewContent(view) {
        // For dashboard, extract from existing HTML if present
        if (view === 'dashboard') {
            const existingDashboard = document.querySelector('.dashboard-grid');
            if (existingDashboard) {
                const content = existingDashboard.outerHTML;
                existingDashboard.remove(); // Remove from DOM
                return content;
            }
        }

        // Check if creator function exists
        const creatorName = `create${view.charAt(0).toUpperCase() + view.slice(1)}View`;
        
        if (typeof window[creatorName] === 'function') {
            try {
                return window[creatorName]();
            } catch (e) {
                console.error(`Error creating ${view}:`, e);
            }
        }

        // Fallback content
        return `
            <div style="padding: 2rem; text-align: center;">
                <h2 style="color: var(--text-primary); font-size: 2rem;">
                    ${view.charAt(0).toUpperCase() + view.slice(1)}
                </h2>
                <p style="color: var(--text-secondary); margin-top: 1rem;">
                    Loading ${view} content...
                </p>
            </div>
        `;
    }

    // Move modals to their proper view
    function moveModalsToView(viewName, modalLayer) {
        // Find modals that belong to this view
        const viewModalPatterns = {
            dashboard: ['redeem', 'quickBurn', 'challenge', 'personality', 'leaderboard'],
            social: ['post', 'comment', 'share', 'friend'],
            wallet: ['connect', 'send', 'receive', 'transaction'],
            goals: ['createGoal', 'editGoal', 'goalDetails'],
            habits: ['createHabit', 'editHabit', 'habitDetails'],
            settings: ['profile', 'preferences', 'security']
        };

        const patterns = viewModalPatterns[viewName] || [];
        
        // Find and move matching modals
        document.querySelectorAll('.modal, [id*="Modal"]').forEach(modal => {
            const modalId = modal.id || '';
            const shouldMove = patterns.some(pattern => 
                modalId.toLowerCase().includes(pattern.toLowerCase())
            );
            
            if (shouldMove && modal.parentElement !== modalLayer) {
                console.log(`📦 Moving ${modalId} to ${viewName} modal layer`);
                modalLayer.appendChild(modal);
            }
        });
    }

    // Ensure complete view isolation
    function ensureViewIsolation(activeView) {
        const viewsWrapper = document.getElementById('viewsWrapper') || 
                           document.getElementById('mainContent');
        
        if (!viewsWrapper) return;

        // Check each view
        viewsWrapper.querySelectorAll('.view-container').forEach(view => {
            const viewName = view.getAttribute('data-view') || view.id.replace('View', '');
            
            if (viewName !== activeView) {
                // Ensure it's completely hidden
                view.style.cssText = `
                    display: none !important;
                    visibility: hidden !important;
                    position: absolute !important;
                    left: -9999px !important;
                    top: -9999px !important;
                    pointer-events: none !important;
                    opacity: 0 !important;
                `;
                
                // Hide all children
                view.querySelectorAll('*').forEach(child => {
                    if (child.style.display !== 'none') {
                        child.setAttribute('data-hidden-by-isolation', 'true');
                        child.style.display = 'none';
                    }
                });
            } else {
                // Restore active view
                view.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    position: relative !important;
                    left: 0 !important;
                    top: 0 !important;
                    pointer-events: auto !important;
                    opacity: 1 !important;
                `;
                
                // Restore children that were hidden
                view.querySelectorAll('[data-hidden-by-isolation]').forEach(child => {
                    child.removeAttribute('data-hidden-by-isolation');
                    child.style.display = '';
                });
            }
        });
    }

    // Override modal show functions to ensure they stay in their view
    function overrideModalFunctions() {
        const modalFunctions = ['showModal', 'openModal', 'showRedeemModal', 'openRedeemModal'];
        
        modalFunctions.forEach(funcName => {
            const original = window[funcName];
            if (typeof original === 'function') {
                window[funcName] = function(...args) {
                    const currentView = document.body.getAttribute('data-current-view');
                    console.log(`🔐 Modal ${funcName} called in ${currentView} view`);
                    
                    // Call original
                    const result = original.apply(this, args);
                    
                    // Ensure modal stays in current view
                    setTimeout(() => {
                        const viewState = viewStates.get(currentView);
                        if (viewState) {
                            moveModalsToView(currentView, viewState.modalLayer);
                        }
                    }, 100);
                    
                    return result;
                };
            }
        });
    }

    // CSS for proper isolation
    function injectIsolationCSS() {
        const style = document.createElement('style');
        style.id = 'view-container-isolation-styles';
        style.textContent = `
            /* View container isolation */
            .view-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: none;
                isolation: isolate;
                contain: layout style paint;
            }
            
            .view-container.active {
                display: block !important;
            }
            
            /* Content wrapper */
            .view-content-wrapper {
                width: 100%;
                height: 100%;
                overflow-y: auto;
                position: relative;
            }
            
            /* Modal layer */
            .view-modal-layer {
                pointer-events: none;
            }
            
            .view-modal-layer > * {
                pointer-events: auto;
            }
            
            /* Ensure modals stay in their layer */
            .view-container:not(.active) .view-modal-layer {
                display: none !important;
            }
            
            /* Hide everything in inactive views */
            .view-container:not(.active) * {
                visibility: hidden !important;
                pointer-events: none !important;
            }
            
            /* Dashboard specific isolation */
            #dashboardView:not(.active) .dashboard-grid,
            #dashboardView:not(.active) .card {
                display: none !important;
            }
            
            /* Prevent content bleeding */
            .view-container:not(.active) {
                overflow: hidden !important;
                max-height: 0 !important;
                max-width: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing view container isolation...');

        // Inject CSS
        injectIsolationCSS();

        // Override modal functions
        overrideModalFunctions();

        // Set up initial view
        setTimeout(() => {
            const currentNav = document.querySelector('.nav-item.active');
            const initialView = currentNav?.getAttribute('data-view') || 'dashboard';
            window.navigate(initialView);
            
            // Wire up navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                const view = item.getAttribute('data-view');
                if (view) {
                    item.onclick = () => window.navigate(view);
                }
            });
            
            console.log('✅ View container isolation ready');
        }, 100);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 500);
    }

    // Export for debugging
    window.viewIsolation = {
        ensureIsolation: ensureViewIsolation,
        getViewState: (view) => viewStates.get(view),
        moveModalsToView
    };
})();
