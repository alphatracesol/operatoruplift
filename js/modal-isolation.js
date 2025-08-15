// Modal Isolation System
// Ensures modals are isolated to their respective views and don't bleed through

(function() {
    'use strict';

    console.log('🔒 Modal Isolation System initializing...');

    // Track modals by view
    const modalsByView = new Map();

    // Initialize modal tracking
    function initializeModalTracking() {
        // Find all modals and assign them to views
        const modals = document.querySelectorAll('.modal, [class*="modal"], [id*="modal"]');
        
        modals.forEach(modal => {
            // Determine which view this modal belongs to
            const viewContainer = modal.closest('.view-container');
            if (viewContainer) {
                const viewId = viewContainer.id;
                if (!modalsByView.has(viewId)) {
                    modalsByView.set(viewId, new Set());
                }
                modalsByView.get(viewId).add(modal);
                
                // Tag the modal with its view
                modal.setAttribute('data-view-owner', viewId);
            }
        });
    }

    // Hide all modals for a specific view
    function hideViewModals(viewId) {
        const modals = modalsByView.get(viewId);
        if (modals) {
            modals.forEach(modal => {
                modal.style.cssText = `
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    z-index: -1000 !important;
                    pointer-events: none !important;
                `;
            });
        }

        // Also hide any modals tagged with this view
        const taggedModals = document.querySelectorAll(`[data-view-owner="${viewId}"]`);
        taggedModals.forEach(modal => {
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
        });
    }

    // Show modals for a specific view
    function showViewModals(viewId) {
        const modals = modalsByView.get(viewId);
        if (modals) {
            modals.forEach(modal => {
                // Only reset styles, don't force display
                modal.style.cssText = '';
                modal.style.zIndex = '1000';
            });
        }
    }

    // Isolate dashboard modals
    function isolateDashboardModals() {
        // Find all dashboard-specific modals
        const dashboardModals = [
            '.achievement-notification',
            '.daily-reward-modal',
            '.level-up-modal',
            '.streak-modal',
            '.treasure-chest-modal',
            '.wheel-modal',
            '#dashboardView .modal',
            '[data-dashboard-modal]'
        ];

        dashboardModals.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.setAttribute('data-view-owner', 'dashboardView');
                el.classList.add('dashboard-specific-modal');
            });
        });
    }

    // Create view-specific modal containers
    function createViewModalContainers() {
        const views = document.querySelectorAll('.view-container');
        
        views.forEach(view => {
            if (!view.querySelector('.view-modal-isolation-container')) {
                const container = document.createElement('div');
                container.className = 'view-modal-isolation-container';
                container.setAttribute('data-view', view.id);
                
                // Move any existing modals into the container
                const modals = view.querySelectorAll('.modal, [class*="modal"]');
                modals.forEach(modal => {
                    container.appendChild(modal);
                });
                
                view.appendChild(container);
            }
        });
    }

    // Override modal creation to ensure isolation
    function overrideModalCreation() {
        // Store original functions
        const originalCreateElement = document.createElement;
        
        // Override createElement for modals
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            // If it's a div that might become a modal
            if (tagName.toLowerCase() === 'div') {
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    originalSetAttribute.call(this, name, value);
                    
                    // Check if this is becoming a modal
                    if ((name === 'class' && value.includes('modal')) ||
                        (name === 'id' && value.includes('modal'))) {
                        // Tag it with the current view
                        const currentView = document.querySelector('.view-container.active');
                        if (currentView) {
                            this.setAttribute('data-view-owner', currentView.id);
                        }
                    }
                };
            }
            
            return element;
        };
    }

    // Monitor view changes
    function monitorViewChanges() {
        // Listen for view changes
        window.addEventListener('viewChanged', (e) => {
            const newView = e.detail.view;
            console.log(`📍 View changed to: ${newView}`);
            
            // Hide all modals first
            document.querySelectorAll('.view-container').forEach(view => {
                hideViewModals(view.id);
            });
            
            // Show only modals for the active view
            const activeViewId = `${newView}View`;
            showViewModals(activeViewId);
            
            // Extra isolation for dashboard
            if (newView !== 'dashboard') {
                isolateDashboardModals();
                hideViewModals('dashboardView');
            }
        });
    }

    // Add isolation styles
    function injectIsolationStyles() {
        const styles = `
            <style id="modal-isolation-styles">
            /* Modal isolation containers */
            .view-modal-isolation-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: 500;
                contain: layout style;
            }

            .view-modal-isolation-container .modal {
                pointer-events: auto;
            }

            /* Hide modals not belonging to active view */
            .view-container:not(.active) .modal,
            .view-container:not(.active) [class*="modal"] {
                display: none !important;
                visibility: hidden !important;
            }

            /* Dashboard-specific modal hiding */
            body:not([data-current-view="dashboard"]) .dashboard-specific-modal,
            body:not([data-current-view="dashboard"]) [data-view-owner="dashboardView"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                z-index: -1000 !important;
            }

            /* Ensure modals can't escape their containers */
            .view-container {
                position: relative;
                overflow: hidden;
                contain: layout style paint;
            }

            /* Active view modals on top */
            .view-container.active .modal {
                z-index: 1000;
            }

            /* Force containment for dashboard */
            #dashboardView {
                isolation: isolate;
                contain: strict;
            }

            /* Hide any floating dashboard elements */
            body:not([data-current-view="dashboard"]) .floating-dashboard-element {
                display: none !important;
            }
            </style>
        `;

        if (!document.getElementById('modal-isolation-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    // Clean up orphaned modals
    function cleanupOrphanedModals() {
        const modals = document.querySelectorAll('.modal, [class*="modal"]');
        
        modals.forEach(modal => {
            // If modal is directly in body (not in a view)
            if (modal.parentElement === document.body) {
                const currentView = document.querySelector('.view-container.active');
                
                // Move to modal container or hide
                if (currentView) {
                    const container = currentView.querySelector('.view-modal-isolation-container') ||
                                    document.getElementById('modalContainer');
                    if (container) {
                        container.appendChild(modal);
                    } else {
                        modal.style.display = 'none';
                    }
                }
            }
        });
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing modal isolation...');
        
        // Inject styles
        injectIsolationStyles();
        
        // Create containers
        createViewModalContainers();
        
        // Initialize tracking
        initializeModalTracking();
        
        // Isolate dashboard modals
        isolateDashboardModals();
        
        // Override modal creation
        overrideModalCreation();
        
        // Monitor view changes
        monitorViewChanges();
        
        // Clean up orphaned modals
        cleanupOrphanedModals();
        
        // Periodic cleanup
        setInterval(cleanupOrphanedModals, 5000);
        
        console.log('✅ Modal isolation ready');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

    // Global functions
    window.modalIsolation = {
        hideViewModals,
        showViewModals,
        cleanupOrphanedModals,
        isolateDashboardModals
    };
})();
