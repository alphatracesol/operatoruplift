// Modal Fix System
// Ensures modals appear in the correct location within their respective views

(function() {
    'use strict';

    console.log('🔧 Modal Fix System initializing...');

    // Modal container for proper placement
    let modalContainer = null;

    // Create modal container if it doesn't exist
    function ensureModalContainer() {
        if (!modalContainer) {
            modalContainer = document.getElementById('modalContainer');
            if (!modalContainer) {
                modalContainer = document.createElement('div');
                modalContainer.id = 'modalContainer';
                modalContainer.className = 'modal-container';
                
                // Insert after main content but within app
                const app = document.getElementById('app');
                if (app) {
                    app.appendChild(modalContainer);
                } else {
                    document.body.appendChild(modalContainer);
                }
            }
        }
        return modalContainer;
    }

    // Override appendChild for modals
    const originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(child) {
        // Check if this is a modal being added to body
        if (this === document.body && child && (
            child.classList?.contains('modal') ||
            child.classList?.contains('modal-overlay') ||
            child.classList?.contains('modal-backdrop') ||
            child.id?.includes('modal') ||
            child.className?.includes('modal')
        )) {
            console.log('🔄 Redirecting modal to modal container:', child.className || child.id);
            const container = ensureModalContainer();
            return originalAppendChild.call(container, child);
        }
        
        // Normal appendChild
        return originalAppendChild.call(this, child);
    };

    // Fix existing modals
    function fixExistingModals() {
        console.log('🔍 Searching for misplaced modals...');
        
        // Find all modals in body
        const modals = document.body.querySelectorAll('.modal, [class*="modal"], [id*="modal"]');
        const container = ensureModalContainer();
        
        modals.forEach(modal => {
            // Skip if already in modal container
            if (modal.parentElement === container) return;
            
            // Skip if it's the container itself
            if (modal === container) return;
            
            // Skip if it's part of the app structure
            if (modal.closest('#app') && !modal.closest('#modalContainer')) return;
            
            console.log('📦 Moving modal to container:', modal.className || modal.id);
            container.appendChild(modal);
        });
    }

    // Create modal helper function
    window.createModal = function(options = {}) {
        const {
            id = 'modal-' + Date.now(),
            title = 'Modal',
            content = '',
            className = '',
            onClose = null,
            buttons = []
        } = options;

        const modal = document.createElement('div');
        modal.id = id;
        modal.className = `modal ${className}`;
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="closeModal('${id}')"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" onclick="closeModal('${id}')">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${buttons.length > 0 ? `
                    <div class="modal-footer">
                        ${buttons.map(btn => `
                            <button class="btn ${btn.className || 'btn-secondary'}" 
                                    onclick="${btn.onclick || ''}">
                                ${btn.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        // Add to modal container
        const container = ensureModalContainer();
        container.appendChild(modal);

        // Store close callback
        if (onClose) {
            modal.dataset.onClose = onClose.toString();
        }

        return modal;
    };

    // Close modal helper
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Call onClose callback if exists
            if (modal.dataset.onClose) {
                try {
                    eval(`(${modal.dataset.onClose})()`);
                } catch (e) {
                    console.error('Error calling modal onClose:', e);
                }
            }
            
            // Remove modal
            modal.remove();
        }
    };

    // Show modal helper
    window.showModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            
            // Focus first input if exists
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    };

    // Fix modal styles
    function injectModalStyles() {
        const styles = `
            <style id="modal-fix-styles">
            /* Modal Container */
            #modalContainer {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: 9999;
            }

            #modalContainer .modal {
                pointer-events: auto;
            }

            /* Modal Base Styles */
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
            }

            .modal.active {
                display: flex !important;
            }

            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(4px);
            }

            .modal-content {
                position: relative;
                background: var(--bg-primary, #1a1a1a);
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                max-width: 90%;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                min-width: 400px;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .modal-title {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }

            .modal-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.5rem;
                cursor: pointer;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                transition: all 0.2s;
            }

            .modal-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-primary);
            }

            .modal-body {
                padding: 1.5rem;
                overflow-y: auto;
                flex: 1;
            }

            .modal-footer {
                padding: 1.5rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
            }

            /* Specific Modal Fixes */
            .achievement-notification {
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                z-index: 10001 !important;
            }

            /* Ensure modals in views are contained */
            .view-container .modal {
                position: absolute;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .modal-content {
                    min-width: unset;
                    width: 100%;
                    max-width: 100%;
                    margin: 0;
                }

                .modal {
                    padding: 0;
                }
            }
            </style>
        `;

        if (!document.getElementById('modal-fix-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    // Initialize on DOM ready
    function initialize() {
        console.log('🚀 Initializing modal fixes...');
        
        // Inject styles
        injectModalStyles();
        
        // Create modal container
        ensureModalContainer();
        
        // Fix existing modals
        fixExistingModals();
        
        // Watch for new modals
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (
                        node.classList?.contains('modal') ||
                        node.className?.includes('modal') ||
                        node.id?.includes('modal')
                    )) {
                        console.log('🆕 New modal detected:', node.className || node.id);
                        setTimeout(fixExistingModals, 100);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('✅ Modal fix system ready');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Re-run fixes periodically to catch late-loading modals
    setInterval(fixExistingModals, 5000);

    // Global modal fix function
    window.fixModals = fixExistingModals;
})();
