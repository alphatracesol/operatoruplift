// === CELEBRATION MODAL FIX ===
// This script fixes the broken celebration modal that's blocking all interactions

(function() {
    'use strict';
    
    console.log('🎉 Loading Celebration Modal Fix...');
    
    // Fix 1: Remove all celebration-related blocking elements
    function removeCelebrationBlockers() {
        console.log('🎉 Removing celebration modal blockers...');
        
        const celebrationSelectors = [
            '#celebration-container',
            '.celebration-container',
            '#lucky-wheel-modal',
            '.lucky-wheel-modal',
            '#daily-rewards-modal',
            '.daily-rewards-modal',
            '#reward-spinner-modal',
            '.reward-spinner-modal',
            '[id*="celebration"]',
            '[class*="celebration"]',
            '[id*="reward"]',
            '[class*="reward"]',
            '[id*="spinner"]',
            '[class*="spinner"]',
            '[id*="wheel"]',
            '[class*="wheel"]'
        ];
        
        celebrationSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                console.log(`🗑️ Removing celebration element: ${selector}`);
                element.remove();
            });
        });
        
        // Also remove any overlays that might be blocking
        const overlaySelectors = [
            '.modal-overlay',
            '.overlay',
            '[style*="position: fixed"]',
            '[style*="z-index: 999"]',
            '[style*="z-index: 1000"]',
            '[style*="z-index: 9999"]'
        ];
        
        overlaySelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.id !== 'sidebar' && element.id !== 'app-header' && element.id !== 'diagnostic-overlay' && element.id !== 'emergency-ui-panel') {
                    const zIndex = parseInt(window.getComputedStyle(element).zIndex);
                    if (zIndex > 100) {
                        console.log(`🗑️ Removing blocking overlay: ${selector} (z-index: ${zIndex})`);
                        element.remove();
                    }
                }
            });
        });
    }
    
    // Fix 2: Force enable all interactions
    function forceEnableInteractions() {
        console.log('🔧 Force enabling all interactions...');
        
        // Enable all interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [tabindex], .btn, .nav-link, .clickable');
        interactiveElements.forEach(element => {
            element.style.pointerEvents = 'auto';
            element.style.cursor = 'pointer';
            element.style.userSelect = 'auto';
            element.disabled = false;
            element.style.zIndex = 'auto';
        });
        
        // Ensure main containers are clickable
        const mainContainers = [document.body, document.documentElement, document.getElementById('app'), document.getElementById('dashboard-view')];
        mainContainers.forEach(container => {
            if (container) {
                container.style.pointerEvents = 'auto';
                container.style.cursor = 'default';
                container.style.userSelect = 'auto';
            }
        });
        
        console.log(`✅ Enabled interactions for ${interactiveElements.length} elements`);
    }
    
    // Fix 3: Fix mobile header z-index issue
    function fixMobileHeaderZIndex() {
        console.log('📱 Fixing mobile header z-index...');
        
        const mobileHeader = document.querySelector('#mobile-nav-toggle, .mobile-nav-toggle, [id*="mobile"], [class*="mobile"]');
        if (mobileHeader) {
            mobileHeader.style.zIndex = '50';
            console.log('✅ Mobile header z-index fixed');
        }
        
        // Ensure sidebar has higher z-index than mobile header
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.style.zIndex = '100';
            sidebar.style.position = 'relative';
            console.log('✅ Sidebar z-index fixed');
        }
    }
    
    // Fix 4: Create emergency celebration fix button
    function createCelebrationFixButton() {
        console.log('🚨 Creating celebration fix button...');
        
        if (!document.body) {
            setTimeout(createCelebrationFixButton, 100);
            return;
        }
        
        try {
            // Remove any existing celebration fix button
            const existingButton = document.getElementById('celebration-fix-button');
            if (existingButton) {
                existingButton.remove();
            }
            
            // Create celebration fix button
            const fixButton = document.createElement('div');
            fixButton.id = 'celebration-fix-button';
            fixButton.style.cssText = `
                position: fixed;
                top: 50px;
                left: 10px;
                background: rgba(255, 165, 0, 0.9);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 100000;
                font-family: monospace;
                font-size: 12px;
                pointer-events: auto;
                cursor: pointer;
            `;
            
            fixButton.innerHTML = `
                <div style="margin-bottom: 5px;"><strong>🎉 CELEBRATION FIX</strong></div>
                <button onclick="window.fixCelebrationModal()" style="background: #fff; color: #000; border: none; padding: 2px 5px; margin: 2px; cursor: pointer;">Fix Modal</button>
                <button onclick="this.parentElement.remove()" style="background: #fff; color: #000; border: none; padding: 2px 5px; margin: 2px; cursor: pointer;">Close</button>
            `;
            
            document.body.appendChild(fixButton);
            console.log('✅ Celebration fix button created');
            
        } catch (error) {
            console.error('❌ Error creating celebration fix button:', error);
        }
    }
    
    // Fix 5: Comprehensive celebration fix function
    function fixCelebrationModal() {
        console.log('🎉 Running comprehensive celebration modal fix...');
        
        // Remove all celebration blockers
        removeCelebrationBlockers();
        
        // Force enable interactions
        forceEnableInteractions();
        
        // Fix mobile header z-index
        fixMobileHeaderZIndex();
        
        // Remove any remaining blocking elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const style = window.getComputedStyle(element);
            if (style.pointerEvents === 'none' && element.id !== 'sidebar' && element.id !== 'app-header') {
                element.style.pointerEvents = 'auto';
                console.log(`🔧 Fixed pointer-events for: ${element.tagName} ${element.id || element.className}`);
            }
        });
        
        console.log('✅ Celebration modal fix completed');
    }
    
    // Fix 6: Initialize celebration fix
    function initializeCelebrationFix() {
        console.log('🎉 Initializing celebration modal fix...');
        
        // Run fixes immediately
        removeCelebrationBlockers();
        forceEnableInteractions();
        fixMobileHeaderZIndex();
        createCelebrationFixButton();
        
        // Make fix function globally available
        window.fixCelebrationModal = fixCelebrationModal;
        
        console.log('✅ Celebration modal fix initialized');
    }
    
    // Run fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCelebrationFix);
    } else {
        initializeCelebrationFix();
    }
    
    // Also run when window loads
    window.addEventListener('load', function() {
        setTimeout(initializeCelebrationFix, 100);
    });
    
    console.log('✅ Celebration Modal Fix loaded successfully');
})(); 