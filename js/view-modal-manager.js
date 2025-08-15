// View Modal Manager
// Ensures modals are properly contained within their respective view containers

(function() {
    'use strict';

    console.log('📋 View Modal Manager initializing...');

    // Track current active view
    let currentView = 'dashboard';

    // Override navigate function to track current view
    const originalNavigate = window.navigate;
    window.navigate = function(view) {
        currentView = view;
        console.log('🔄 Navigated to view:', view);
        
        // Call original navigate
        if (originalNavigate) {
            originalNavigate.apply(this, arguments);
        }
        
        // Ensure view has modal container
        setTimeout(() => {
            ensureViewModalContainer(view);
        }, 100);
    };

    // Create modal container for each view
    function ensureViewModalContainer(viewName) {
        const viewId = viewName + 'View';
        const viewElement = document.getElementById(viewId);
        
        if (!viewElement) {
            console.warn(`View not found: ${viewId}`);
            return;
        }

        // Check if view already has modal container
        let modalContainer = viewElement.querySelector('.view-modal-container');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.className = 'view-modal-container';
            modalContainer.setAttribute('data-view', viewName);
            viewElement.appendChild(modalContainer);
            console.log(`✅ Created modal container for ${viewName} view`);
        }

        return modalContainer;
    }

    // Create view-specific modal
    window.createViewModal = function(options = {}) {
        const {
            view = currentView,
            id = `${view}-modal-${Date.now()}`,
            title = 'Modal',
            content = '',
            className = '',
            onClose = null
        } = options;

        // Get view's modal container
        const viewContainer = ensureViewModalContainer(view);
        if (!viewContainer) {
            console.error('Could not create modal container for view:', view);
            return null;
        }

        // Create modal element
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = `view-modal ${className}`;
        modal.setAttribute('data-view', view);
        
        modal.innerHTML = `
            <div class="view-modal-overlay" onclick="closeViewModal('${id}')"></div>
            <div class="view-modal-dialog">
                <div class="view-modal-header">
                    <h3>${title}</h3>
                    <button class="close-btn" onclick="closeViewModal('${id}')">&times;</button>
                </div>
                <div class="view-modal-body">
                    ${content}
                </div>
            </div>
        `;

        // Add to view's modal container
        viewContainer.appendChild(modal);

        // Store close callback
        if (onClose) {
            modal.dataset.onClose = onClose.toString();
        }

        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        return modal;
    };

    // Close view modal
    window.closeViewModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            
            // Call onClose callback
            if (modal.dataset.onClose) {
                try {
                    eval(`(${modal.dataset.onClose})()`);
                } catch (e) {
                    console.error('Error calling modal onClose:', e);
                }
            }
            
            // Remove after animation
            setTimeout(() => modal.remove(), 300);
        }
    };

    // Fix modals for specific views
    function fixViewSpecificModals() {
        // Goals view modals
        fixGoalsModals();
        
        // Habits view modals
        fixHabitsModals();
        
        // AI Chat modals
        fixAIChatModals();
        
        // Settings modals
        fixSettingsModals();
    }

    function fixGoalsModals() {
        // Move goal creation modal to goals view
        const goalModal = document.querySelector('#createGoalModal, .goal-modal');
        if (goalModal) {
            const goalsContainer = ensureViewModalContainer('goals');
            if (goalsContainer && goalModal.parentElement !== goalsContainer) {
                goalsContainer.appendChild(goalModal);
                console.log('📦 Moved goal modal to goals view');
            }
        }
    }

    function fixHabitsModals() {
        // Move habit modals to habits view
        const habitModals = document.querySelectorAll('[id*="habit-modal"], .habit-modal');
        const habitsContainer = ensureViewModalContainer('habits');
        
        habitModals.forEach(modal => {
            if (habitsContainer && modal.parentElement !== habitsContainer) {
                habitsContainer.appendChild(modal);
                console.log('📦 Moved habit modal to habits view');
            }
        });
    }

    function fixAIChatModals() {
        // Move AI personality modal to AI chat view
        const aiModal = document.querySelector('#ai-personality-modal, .ai-modal');
        if (aiModal) {
            const aiContainer = ensureViewModalContainer('ai-chat');
            if (aiContainer && aiModal.parentElement !== aiContainer) {
                aiContainer.appendChild(aiModal);
                console.log('📦 Moved AI modal to AI chat view');
            }
        }
    }

    function fixSettingsModals() {
        // Move settings modals to settings view
        const settingsModals = document.querySelectorAll('[id*="settings-modal"], .settings-modal');
        const settingsContainer = ensureViewModalContainer('settings');
        
        settingsModals.forEach(modal => {
            if (settingsContainer && modal.parentElement !== settingsContainer) {
                settingsContainer.appendChild(modal);
                console.log('📦 Moved settings modal to settings view');
            }
        });
    }

    // Add view modal styles
    function injectViewModalStyles() {
        const styles = `
            <style id="view-modal-styles">
            /* View Modal Container */
            .view-modal-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: 100;
            }

            /* View Modal */
            .view-modal {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                pointer-events: none;
                z-index: 101;
            }

            .view-modal.active {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }

            .view-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
            }

            .view-modal-dialog {
                position: relative;
                background: var(--bg-secondary, #2a2a2a);
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .view-modal.active .view-modal-dialog {
                transform: scale(1);
            }

            .view-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.25rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .view-modal-header h3 {
                margin: 0;
                font-size: 1.125rem;
                font-weight: 600;
            }

            .view-modal-header .close-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.5rem;
                cursor: pointer;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: all 0.2s;
            }

            .view-modal-header .close-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .view-modal-body {
                padding: 1.25rem;
                overflow-y: auto;
                flex: 1;
            }

            /* Ensure view containers can contain modals */
            .view-container {
                position: relative;
            }

            /* Fix z-index stacking */
            .view-container.active {
                z-index: 1;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .view-modal-dialog {
                    width: 95%;
                    margin: 1rem;
                }
            }
            </style>
        `;

        if (!document.getElementById('view-modal-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing view modal manager...');
        
        // Inject styles
        injectViewModalStyles();
        
        // Create modal containers for all views
        const views = ['dashboard', 'goals', 'habits', 'ai-chat', 'social', 'leaderboard', 
                      'achievements', 'wallet', 'analytics', 'settings', 'burn', 'community'];
        
        views.forEach(view => {
            ensureViewModalContainer(view);
        });
        
        // Fix existing modals
        setTimeout(fixViewSpecificModals, 500);
        
        console.log('✅ View modal manager ready');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }

    // Periodic check for misplaced modals
    setInterval(fixViewSpecificModals, 3000);

    // Global function
    window.fixViewModals = fixViewSpecificModals;
})();
