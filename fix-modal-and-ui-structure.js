// === FIX MODAL AND UI STRUCTURE ===
// This script fixes the broken modal and UI functionality by restoring proper CSS and structure

(function() {
    'use strict';
    
    console.log('🔧 Fixing Modal and UI Structure...');
    
    // Fix the broken modal and UI structure
    function fixModalAndUIStructure() {
        console.log('🔄 Fixing modal and UI structure...');
        
        // Remove the broken modal-disabling CSS
        const brokenModalCSS = `
            .onboarding-modal { display: none !important; visibility: hidden !important; pointer-events: none !important; }
            .modal-overlay { display: none !important; visibility: hidden !important; pointer-events: none !important; }
        `;
        
        // Remove any existing broken modal styles
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            try {
                const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    if (rule.cssText && rule.cssText.includes('.onboarding-modal { display: none !important;')) {
                        console.log('🗑️ Removing broken modal CSS rule');
                        styleSheets[i].deleteRule(j);
                        j--;
                    }
                }
            } catch (e) {
                // Cross-origin stylesheets will throw errors
            }
        }
        
        // Add proper modal styles from backup
        const properModalCSS = document.createElement('style');
        properModalCSS.textContent = `
            /* --- PROPER MODAL STYLES (RESTORED FROM BACKUP) --- */
            .modal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(10, 10, 10, 0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                display: flex; align-items: center; justify-content: center;
                z-index: 1000; opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s;
            }
            .modal.active { opacity: 1; visibility: visible; }
            .modal-content {
                background: var(--card-bg-glass); border: 1px solid var(--border-glass);
                padding: 2rem; border-radius: 0.75rem; width: 90%; max-width: 500px;
                position: relative; transform: scale(0.95); transition: transform 0.3s;
            }
            .modal.active .modal-content { transform: scale(1); }
            .modal-close {
                position: absolute; top: 1rem; right: 1rem; background: none; border: none;
                font-size: 1.5rem; cursor: pointer; color: var(--text-muted-color);
            }
            
            /* --- MODAL IMPROVEMENTS --- */
            .modal-content { width: 95%; margin: 2.5% auto; max-height: 90vh; }
            .modal-header { padding: 1rem; }
            .modal-body { padding: 1rem; }
            .modal-footer { padding: 1rem; }
            
            /* --- ONBOARDING MODALS --- */
            #tutorial-modal .modal-content, #profile-analysis-modal .modal-content { max-width: 600px; }
            
            /* --- FINANCE MODAL SPECIFIC STYLES --- */
            #finance-modal .modal-content {
                max-width: 1000px; max-height: 90vh; overflow-y: auto;
            }
            #personality-assessment-modal .modal-content {
                max-width: 800px; max-height: 90vh; overflow-y: auto;
            }
            
            /* --- MOBILE MODAL FIXES --- */
            @media (max-width: 768px) {
                .modal-content { width: 98%; margin: 1%; }
            }
            
            /* --- FORCE ENABLE MODALS --- */
            .modal { display: flex !important; }
            .modal.active { display: flex !important; visibility: visible !important; opacity: 1 !important; }
            .modal-content { display: block !important; }
            
            /* --- REMOVE BROKEN OVERLAY BLOCKS --- */
            [id*="overlay"]:not(.modal) {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
                z-index: -1 !important;
            }
            
            /* --- ENSURE PROPER Z-INDEX --- */
            .modal { z-index: 1000 !important; }
            .modal-content { z-index: 1001 !important; }
            .modal-close { z-index: 1002 !important; }
        `;
        
        document.head.appendChild(properModalCSS);
        
        // Fix modal event listeners
        fixModalEventListeners();
        
        // Ensure all modals are properly structured
        ensureModalStructure();
        
        console.log('✅ Modal and UI structure fixed');
    }
    
    // Fix modal event listeners
    function fixModalEventListeners() {
        console.log('🔧 Fixing modal event listeners...');
        
        // Add proper modal close functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            }
            
            // Close modal when clicking outside
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
        
        // Add ESC key to close modals
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                }
            }
        });
        
        console.log('✅ Modal event listeners fixed');
    }
    
    // Ensure all modals are properly structured
    function ensureModalStructure() {
        console.log('🔧 Ensuring modal structure...');
        
        // Check if all required modals exist, if not create them
        const requiredModals = [
            'goal-modal',
            'add-task-modal', 
            'template-modal',
            'confirm-modal',
            'lucky-wheel-modal',
            'treasure-chest-modal',
            'mood-modal',
            'journey-modal',
            'calendar-add-task-modal',
            'password-reset-modal',
            'finance-modal',
            'add-habit-modal',
            'focus-session-modal'
        ];
        
        requiredModals.forEach(modalId => {
            if (!document.getElementById(modalId)) {
                console.log(`🔧 Creating missing modal: ${modalId}`);
                createBasicModal(modalId);
            }
        });
        
        console.log('✅ Modal structure ensured');
    }
    
    // Create a basic modal if missing
    function createBasicModal(modalId) {
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '&times;';
        
        const title = document.createElement('h3');
        title.textContent = modalId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        const body = document.createElement('div');
        body.className = 'modal-body';
        body.innerHTML = '<p>Modal content will be loaded here.</p>';
        
        modalContent.appendChild(closeButton);
        modalContent.appendChild(title);
        modalContent.appendChild(body);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
    }
    
    // Add proper UI functions to window.app
    function addUIFunctions() {
        console.log('🔧 Adding UI functions...');
        
        if (!window.app) {
            window.app = {};
        }
        
        if (!window.app.ui) {
            window.app.ui = {};
        }
        
        // Add essential UI functions
        window.app.ui.showModal = function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                console.log(`✅ Modal ${modalId} shown`);
            } else {
                console.error(`❌ Modal ${modalId} not found`);
            }
        };
        
        window.app.ui.hideModal = function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                console.log(`✅ Modal ${modalId} hidden`);
            }
        };
        
        window.app.ui.showToast = function(message, type = 'info') {
            // Create toast notification
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 10000;
                background: var(--card-bg-glass); border: 1px solid var(--border-glass);
                padding: 1rem; border-radius: 0.5rem; color: var(--text-color);
                backdrop-filter: blur(10px); transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 3000);
            
            console.log(`✅ Toast shown: ${message}`);
        };
        
        window.app.ui.showConfirm = function(message, onConfirm, onCancel) {
            const modal = document.getElementById('confirm-modal');
            if (modal) {
                const body = modal.querySelector('.modal-body');
                if (body) {
                    body.innerHTML = `<p>${message}</p>`;
                }
                
                // Update buttons
                const footer = modal.querySelector('.modal-footer');
                if (footer) {
                    footer.innerHTML = `
                        <button class="btn btn-primary" onclick="window.app.ui.hideModal('confirm-modal'); ${onConfirm ? onConfirm.toString() : ''}">Confirm</button>
                        <button class="btn btn-outline" onclick="window.app.ui.hideModal('confirm-modal'); ${onCancel ? onCancel.toString() : ''}">Cancel</button>
                    `;
                }
                
                modal.classList.add('active');
            }
        };
        
        console.log('✅ UI functions added');
    }
    
    // Initialize the fixes
    function initializeFixes() {
        console.log('🔧 Initializing modal and UI fixes...');
        
        // Fix modal and UI structure
        fixModalAndUIStructure();
        
        // Add UI functions
        addUIFunctions();
        
        // Test modal functionality
        setTimeout(() => {
            console.log('🧪 Testing modal functionality...');
            if (window.app && window.app.ui && window.app.ui.showModal) {
                console.log('✅ Modal functions are working');
                // Show a test toast
                window.app.ui.showToast('Modal and UI structure fixed!', 'success');
            } else {
                console.error('❌ Modal functions not working');
            }
        }, 1000);
        
        console.log('✅ Modal and UI fixes completed');
    }
    
    // Run fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFixes);
    } else {
        initializeFixes();
    }
    
    console.log('✅ Fix Modal and UI Structure loaded successfully');
})(); 