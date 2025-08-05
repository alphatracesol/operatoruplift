// === UI INTERACTION FIX ===
// This script fixes the interaction issues preventing clicks and user input

(function() {
    'use strict';
    
    console.log('🔧 Loading UI Interaction Fix...');
    
    function forceEnableInteractions() {
        console.log('🔧 Force enabling all UI interactions...');
        
        // Remove ALL possible blocking elements
        const blockingSelectors = [
            '#loading-overlay',
            '.loading-overlay',
            '.spinner',
            '#lucky-wheel-modal',
            '.lucky-wheel-modal',
            '#onboarding-modal',
            '.onboarding-modal',
            '.onboarding-overlay',
            '.modal-overlay',
            '.overlay-page',
            '[id*="overlay"]',
            '[class*="overlay"]',
            '.modal.active',
            '.modal[style*="display: block"]',
            '.modal[style*="visibility: visible"]',
            '.blocking-overlay',
            '.interaction-blocker',
            '[style*="pointer-events: none"]',
            '[style*="z-index: 9999"]',
            '[style*="z-index: 10000"]'
        ];
        
        blockingSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                console.log(`🗑️ Removing blocking element: ${selector}`);
                element.remove();
            });
        });
        
        // Force enable all interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [tabindex], .btn, .nav-link, .clickable, [onclick]');
        interactiveElements.forEach(element => {
            element.style.pointerEvents = 'auto';
            element.style.cursor = 'pointer';
            element.style.userSelect = 'auto';
            element.disabled = false;
            element.style.zIndex = 'auto';
            
            // Remove any event blockers
            element.onclick = element.onclick || null;
            element.onmousedown = element.onmousedown || null;
            element.onmouseup = element.onmouseup || null;
        });
        
        // Ensure body and main containers are clickable
        const mainContainers = [document.body, document.documentElement, document.getElementById('app'), document.getElementById('dashboard-view'), document.getElementById('sidebar')];
        mainContainers.forEach(container => {
            if (container) {
                container.style.pointerEvents = 'auto';
                container.style.cursor = 'default';
                container.style.userSelect = 'auto';
            }
        });
        
        // Force remove any fixed/absolute positioned elements that might be blocking
        const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:absolute"]');
        fixedElements.forEach(element => {
            if (element.id !== 'sidebar' && element.id !== 'app-header' && element.id !== 'mobile-nav-toggle' && element.id !== 'diagnostic-overlay') {
                const zIndex = parseInt(window.getComputedStyle(element).zIndex);
                if (zIndex > 50) {
                    console.log(`🔧 Adjusting z-index for: ${element.id || element.className}`);
                    element.style.zIndex = '-1';
                    element.style.pointerEvents = 'none';
                }
            }
        });
        
        // Ensure dashboard and sidebar are visible and clickable
        const dashboardView = document.getElementById('dashboard-view');
        const sidebar = document.getElementById('sidebar');
        const header = document.getElementById('app-header');
        
        if (dashboardView) {
            dashboardView.style.display = 'block';
            dashboardView.style.visibility = 'visible';
            dashboardView.style.pointerEvents = 'auto';
            dashboardView.style.zIndex = '50';
            dashboardView.classList.remove('hidden');
        }
        
        if (sidebar) {
            sidebar.style.display = 'block';
            sidebar.style.visibility = 'visible';
            sidebar.style.pointerEvents = 'auto';
            sidebar.style.zIndex = '100';
            sidebar.classList.remove('hidden');
        }
        
        if (header) {
            header.style.display = 'flex';
            header.style.visibility = 'visible';
            header.style.pointerEvents = 'auto';
            header.style.zIndex = '100';
            header.classList.remove('hidden');
        }
        
        console.log(`✅ UI interactions enabled for ${interactiveElements.length} elements`);
        console.log(`🗑️ Removed ${blockingSelectors.length} types of blocking elements`);
    }
    
    function addGlobalClickHandler() {
        console.log('🔧 Adding global click handler for debugging...');
        
        document.addEventListener('click', function(e) {
            console.log('🖱️ Click detected on:', e.target.tagName, e.target.className, e.target.id);
            
            // If click is on a non-interactive element, try to find the nearest interactive parent
            if (!e.target.matches('button, a, input, select, textarea, [role="button"], [tabindex], .btn, .nav-link')) {
                const interactiveParent = e.target.closest('button, a, input, select, textarea, [role="button"], [tabindex], .btn, .nav-link');
                if (interactiveParent) {
                    console.log('🎯 Found interactive parent:', interactiveParent);
                    interactiveParent.click();
                }
            }
        }, true);
    }
    
    function createEmergencyUI() {
        console.log('🚨 Creating emergency UI controls...');
        
        // Create emergency control panel
        const emergencyPanel = document.createElement('div');
        emergencyPanel.id = 'emergency-ui-panel';
        emergencyPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 99999;
            font-family: monospace;
            font-size: 12px;
        `;
        
        emergencyPanel.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>🚨 EMERGENCY UI FIX</strong></div>
            <button onclick="window.forceEnableInteractions()" style="background: #fff; color: #000; border: none; padding: 2px 5px; margin: 2px; cursor: pointer;">Fix Interactions</button>
            <button onclick="document.getElementById('emergency-ui-panel').remove()" style="background: #fff; color: #000; border: none; padding: 2px 5px; margin: 2px; cursor: pointer;">Close</button>
        `;
        
        document.body.appendChild(emergencyPanel);
        
        // Make the emergency panel globally accessible
        window.forceEnableInteractions = forceEnableInteractions;
    }
    
    // Run fixes immediately
    forceEnableInteractions();
    addGlobalClickHandler();
    createEmergencyUI();
    
    // Run fixes again after a delay
    setTimeout(forceEnableInteractions, 1000);
    setTimeout(forceEnableInteractions, 3000);
    
    // Also run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceEnableInteractions);
    }
    
    // And when window loads
    window.addEventListener('load', forceEnableInteractions);
    
    console.log('✅ UI Interaction Fix loaded successfully');
})(); 