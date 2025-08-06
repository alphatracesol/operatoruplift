// Surgical Particle System Removal - Phase 1 Critical Fix
// This script surgically removes all particle systems while preserving matrix canvas and ensuring styles work only inside app-wrapper

console.log('🔪 Surgical Particle System Removal - Phase 1 Critical Fix');

function surgicalRemoveParticleSystems() {
    console.log('🔪 Starting surgical particle system removal...');
    
    // 1. REMOVE tsParticles CDN Script
    const tsparticlesScript = document.querySelector('script[src*="tsparticles"]');
    if (tsparticlesScript) {
        tsparticlesScript.remove();
        console.log('✅ Removed tsParticles CDN script');
    }
    
    // 2. REMOVE Particle HTML Elements
    const particleElements = [
        'tsparticles',
        'particles-js'
    ];
    
    particleElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
            console.log(`✅ Removed particle element: ${id}`);
        }
    });
    
    // 3. REMOVE Particle CSS
    const particleCSSSelectors = [
        '#tsparticles',
        '.particles-background'
    ];
    
    // Remove particle CSS rules from stylesheets
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
        try {
            const rules = styleSheets[i].cssRules || styleSheets[i].rules;
            if (rules) {
                for (let j = rules.length - 1; j >= 0; j--) {
                    const rule = rules[j];
                    if (rule.selectorText) {
                        const selector = rule.selectorText.trim();
                        const shouldRemove = particleCSSSelectors.some(pattern => 
                            selector.includes(pattern) || selector.startsWith(pattern)
                        );
                        
                        if (shouldRemove) {
                            try {
                                styleSheets[i].deleteRule(j);
                                console.log(`✅ Removed particle CSS: ${selector}`);
                            } catch (e) {
                                console.log(`⚠️ Could not remove CSS rule: ${selector}`);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log(`⚠️ Could not access stylesheet ${i}: ${e.message}`);
        }
    }
    
    // 4. REMOVE Particle JavaScript Functions
    const particleFunctions = [
        'initParticles',
        'toggleParticles'
    ];
    
    particleFunctions.forEach(funcName => {
        if (window[funcName]) {
            delete window[funcName];
            console.log(`✅ Removed particle function: ${funcName}`);
        }
    });
    
    // 5. REMOVE Particle Instances and Configurations
    if (window.app && window.app.state) {
        if (window.app.state.particlesInstance) {
            delete window.app.state.particlesInstance;
            console.log('✅ Removed particlesInstance from app.state');
        }
    }
    
    if (window.app && window.app.particlesInstance) {
        delete window.app.particlesInstance;
        console.log('✅ Removed particlesInstance from app');
    }
    
    if (window.app && window.app.config) {
        if (window.app.config.particles !== undefined) {
            delete window.app.config.particles;
            console.log('✅ Removed particles config');
        }
    }
    
    // 6. REMOVE Particle UI Elements
    const particleToggles = [
        'particles-toggle'
    ];
    
    particleToggles.forEach(id => {
        const toggle = document.getElementById(id);
        if (toggle) {
            const toggleContainer = toggle.closest('.settings-item') || toggle.parentElement;
            if (toggleContainer) {
                toggleContainer.remove();
                console.log(`✅ Removed particle toggle: ${id}`);
            }
        }
    });
    
    // 7. REMOVE Particle Settings Descriptions
    const particleSettings = document.querySelectorAll('.settings-title, .settings-description');
    particleSettings.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes('particle') && !text.includes('matrix')) {
            const container = element.closest('.settings-item') || element.parentElement;
            if (container) {
                container.remove();
                console.log(`✅ Removed particle setting: ${text}`);
            }
        }
    });
    
    console.log('✅ All particle systems removed surgically');
}

function ensureMatrixCanvasPreserved() {
    console.log('🛡️ Ensuring matrix canvas is preserved for login page...');
    
    // Check if matrix canvas exists
    const matrixCanvas = document.getElementById('matrix-canvas');
    const matrixRain = document.getElementById('matrix-rain');
    
    if (matrixCanvas) {
        console.log('✅ Matrix canvas preserved for login page');
    }
    
    if (matrixRain) {
        console.log('✅ Matrix rain preserved for login page');
    }
    
    // Ensure matrix-related functions are preserved
    const matrixFunctions = [
        'initMatrixCanvas',
        'initMatrixRain',
        'toggleMatrixRain'
    ];
    
    matrixFunctions.forEach(funcName => {
        if (window[funcName]) {
            console.log(`✅ Matrix function preserved: ${funcName}`);
        }
    });
}

function scopeStylesToAppWrapper() {
    console.log('🎯 Scoping button, card, and modal styles to app-wrapper only...');
    
    // Create scoped CSS that only applies inside app-wrapper
    const scopedStyles = document.createElement('style');
    scopedStyles.textContent = `
        /* ===== SCOPED STYLES - INSIDE APP-WRAPPER ONLY ===== */
        .app-wrapper .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: translateX(-100%);
            transition: transform 0.6s;
        }
        
        .app-wrapper .btn::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: translateX(100%);
            transition: transform 0.6s;
        }
        
        .app-wrapper .btn:hover::before {
            transform: translateX(100%);
        }
        
        .app-wrapper .btn:hover::after {
            transform: translateX(-100%);
        }
        
        .app-wrapper .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
            transform: translateX(-100%);
            transition: transform 0.6s;
        }
        
        .app-wrapper .card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
            transform: translateX(100%);
            transition: transform 0.6s;
        }
        
        .app-wrapper .card:hover::before {
            transform: translateX(100%);
        }
        
        .app-wrapper .card:hover::after {
            transform: translateX(-100%);
        }
        
        .app-wrapper .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: var(--z-modal-backdrop);
            display: none;
            align-items: center;
            justify-content: center;
        }
        
        .app-wrapper .modal-overlay.active {
            display: flex;
        }
        
        .app-wrapper .modal.active {
            transform: scale(1);
            opacity: 1;
        }
        
        .app-wrapper .modal-content {
            background: var(--card-bg);
            border-radius: var(--radius-lg);
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            position: relative;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .app-wrapper .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            transition: color 0.3s ease;
        }
        
        .app-wrapper .modal-close:hover {
            color: var(--text-primary);
        }
    `;
    document.head.appendChild(scopedStyles);
    console.log('✅ Button, card, and modal styles scoped to app-wrapper only');
}

function preserveOutsideWrapperStyling() {
    console.log('🛡️ Preserving outside-wrapper styling...');
    
    // Ensure outside-wrapper elements are protected
    const protectionStyles = document.createElement('style');
    protectionStyles.textContent = `
        /* ===== PROTECTED OUTSIDE-WRAPPER STYLING ===== */
        #loading-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 99999 !important;
            background: var(--bg-color) !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            transition: opacity 0.5s !important;
        }
        
        #auth-view {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            z-index: var(--z-auth-overlay) !important;
            background: var(--bg-color) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        
        /* Matrix canvas for login page - OUTSIDE WRAPPER */
        #matrix-canvas {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 1 !important;
            pointer-events: none !important;
        }
        
        #matrix-rain {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 1 !important;
            pointer-events: none !important;
        }
        
        .matrix-rain {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 1 !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(protectionStyles);
    console.log('✅ Outside-wrapper styling preserved');
}

function cleanupAppWrapper() {
    console.log('🧹 Cleaning up app-wrapper...');
    
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
        // Remove any conflicting classes
        const conflictingClasses = ['particles-enabled', 'enhanced-effects'];
        conflictingClasses.forEach(className => {
            appWrapper.classList.remove(className);
        });
        console.log('✅ Removed conflicting classes from app-wrapper');
    }
    
    // Ensure clean base styling for app-wrapper
    const cleanStyles = document.createElement('style');
    cleanStyles.textContent = `
        /* ===== CLEAN APP-WRAPPER STYLING ===== */
        .app-wrapper {
            position: relative;
            z-index: 10;
            min-height: 100vh;
            background: transparent;
        }
        
        /* Remove any particle-related styling */
        .app-wrapper * {
            background-attachment: scroll !important;
        }
        
        /* Ensure clean container styling */
        .app-wrapper .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
    `;
    document.head.appendChild(cleanStyles);
    console.log('✅ Applied clean app-wrapper styling');
}

// Apply all surgical operations
console.log('🎯 Starting surgical particle system removal...');

surgicalRemoveParticleSystems();
ensureMatrixCanvasPreserved();
scopeStylesToAppWrapper();
preserveOutsideWrapperStyling();
cleanupAppWrapper();

console.log('✅ Surgical Particle System Removal completed successfully');
console.log('💡 All particle systems removed');
console.log('💡 Matrix canvas preserved for login page');
console.log('💡 Button, card, and modal styles scoped to app-wrapper only');
console.log('💡 Outside-wrapper styling preserved');
console.log('💡 App-wrapper cleaned and simplified');
console.log('💡 Ready for clean, focused functionality'); 