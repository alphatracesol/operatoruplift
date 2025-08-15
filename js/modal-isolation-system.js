// Modal Isolation System - Prevents modal cross-contamination between views
(function() {
    'use strict';

    console.log('🔐 Modal Isolation System initializing...');

    // Track modals by view
    const viewModals = new Map();
    
    // Dashboard-specific modal identifiers
    const dashboardModals = [
        'redeemModal',
        'quickBurnModal',
        'challengeModal',
        'personalityModal',
        'leaderboardModal',
        'walletModal',
        'burnFeedModal'
    ];

    // Create view-specific modal containers
    function createViewModalContainers() {
        const views = ['dashboard', 'social', 'wallet', 'goals', 'habits', 'analytics', 'settings'];
        
        views.forEach(view => {
            const viewContainer = document.getElementById(`${view}View`);
            if (!viewContainer) return;

            // Check if modal container exists
            let modalContainer = viewContainer.querySelector('.view-modal-container');
            if (!modalContainer) {
                modalContainer = document.createElement('div');
                modalContainer.className = 'view-modal-container';
                modalContainer.setAttribute('data-view', view);
                modalContainer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1000;
                `;
                viewContainer.appendChild(modalContainer);
                console.log(`✅ Created modal container for ${view}`);
            }

            // Store reference
            viewModals.set(view, modalContainer);
        });
    }

    // Move existing modals to their proper containers
    function isolateExistingModals() {
        // Find all modals
        const allModals = document.querySelectorAll('.modal, [id*="Modal"], [class*="modal"]');
        
        allModals.forEach(modal => {
            // Determine which view this modal belongs to
            const modalId = modal.id || '';
            const modalClass = modal.className || '';
            
            // Check if it's a dashboard modal
            if (dashboardModals.some(id => modalId.includes(id)) ||
                modal.closest('#dashboardView')) {
                
                const dashboardContainer = viewModals.get('dashboard');
                if (dashboardContainer && !modal.closest('.view-modal-container')) {
                    dashboardContainer.appendChild(modal);
                    console.log(`📦 Moved ${modalId} to dashboard container`);
                }
            }
        });
    }

    // Override modal creation/showing functions
    function overrideModalFunctions() {
        // Common modal show patterns
        const modalFunctions = [
            'showModal',
            'openModal',
            'displayModal',
            'showRedeemModal',
            'openRedeemModal',
            'showPersonalityModal',
            'openPersonalityAssessment'
        ];

        modalFunctions.forEach(funcName => {
            const original = window[funcName];
            if (typeof original === 'function') {
                window[funcName] = function(...args) {
                    console.log(`🔐 Intercepted ${funcName}`);
                    
                    // Get current view
                    const currentView = document.body.getAttribute('data-current-view') || 'dashboard';
                    
                    // Call original
                    const result = original.apply(this, args);
                    
                    // Move any new modals to correct container
                    setTimeout(() => {
                        moveModalsToCorrectView(currentView);
                    }, 100);
                    
                    return result;
                };
            }
        });
    }

    // Move modals to their correct view container
    function moveModalsToCorrectView(view) {
        const viewContainer = viewModals.get(view);
        if (!viewContainer) return;

        // Find modals not in containers
        const floatingModals = document.querySelectorAll('body > .modal, body > [id*="Modal"]');
        
        floatingModals.forEach(modal => {
            console.log(`📦 Moving floating modal to ${view}:`, modal);
            viewContainer.appendChild(modal);
        });
    }

    // Hide modals when switching views
    function hideViewModals(view) {
        const container = viewModals.get(view);
        if (!container) return;

        container.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            if (modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        });
    }

    // Override navigate to handle modal visibility
    const originalNavigate = window.navigate;
    window.navigate = function(view) {
        console.log(`🔐 Modal-aware navigate to: ${view}`);

        // Hide all modals first
        viewModals.forEach((container, viewName) => {
            if (viewName !== view) {
                hideViewModals(viewName);
                container.style.display = 'none';
            }
        });

        // Show target view's modal container
        const targetContainer = viewModals.get(view);
        if (targetContainer) {
            targetContainer.style.display = 'block';
        }

        // Call original
        if (typeof originalNavigate === 'function') {
            originalNavigate.call(this, view);
        }
    };

    // Monitor for modal creation
    function setupModalMonitor() {
        const observer = new MutationObserver((mutations) => {
            const currentView = document.body.getAttribute('data-current-view') || 'dashboard';
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && 
                        (node.classList?.contains('modal') || 
                         node.id?.includes('Modal'))) {
                        
                        // If it's not in a container, move it
                        if (!node.closest('.view-modal-container')) {
                            console.warn('🚨 Modal created outside container:', node);
                            moveModalsToCorrectView(currentView);
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

    // CSS for modal isolation
    function injectModalCSS() {
        const styleId = 'modal-isolation-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            /* Modal containers */
            .view-modal-container {
                isolation: isolate;
                contain: layout style paint;
            }
            
            .view-modal-container > * {
                pointer-events: auto;
            }
            
            /* Hide modals in inactive views */
            .view-container:not(.active) .view-modal-container {
                display: none !important;
            }
            
            /* Ensure modals stay within their containers */
            .view-modal-container .modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1050;
            }
            
            /* Prevent dashboard modals from showing elsewhere */
            body:not([data-current-view="dashboard"]) .view-modal-container[data-view="dashboard"] {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
            
            /* Modal backdrop isolation */
            .view-modal-container .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1040;
            }
        `;
        document.head.appendChild(styles);
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing modal isolation system...');

        // Setup structures
        setTimeout(() => {
            createViewModalContainers();
            isolateExistingModals();
            overrideModalFunctions();
            injectModalCSS();
            setupModalMonitor();
            
            console.log('✅ Modal isolation system ready');
        }, 500);
    }

    // Run when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 0);
    }

    // Export for debugging
    window.modalIsolation = {
        moveModalsToView: moveModalsToCorrectView,
        hideViewModals,
        getViewModals: (view) => viewModals.get(view),
        isolateAll: isolateExistingModals
    };
})();
