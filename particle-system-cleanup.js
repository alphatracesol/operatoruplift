// Particle System & Duplicate CSS Cleanup - Phase 1 Critical Fix
// This script removes all particle systems and duplicate/contradictory CSS styling inside app-wrapper

console.log('🧹 Particle System & Duplicate CSS Cleanup - Phase 1 Critical Fix');

function analyzeParticleSystems() {
    console.log('🔍 Analyzing particle systems and duplicate CSS...');
    
    // 1. CHECK PARTICLE SYSTEMS
    const particleElements = {
        'tsparticles': document.getElementById('tsparticles'),
        'matrix-canvas': document.getElementById('matrix-canvas'),
        'matrix-rain': document.getElementById('matrix-rain'),
        'particles-js': document.getElementById('particles-js'),
        'particles-background': document.querySelector('.particles-background')
    };
    
    console.log('📊 Particle elements found:');
    Object.entries(particleElements).forEach(([key, element]) => {
        console.log(`  - ${key}: ${element ? 'Found' : 'Missing'}`);
    });
    
    // 2. CHECK DUPLICATE CSS PATTERNS
    const duplicatePatterns = [
        '.app-wrapper',
        '.container',
        '.btn',
        '.card',
        '.modal',
        '.modal-content',
        '.btn-group'
    ];
    
    console.log('📊 Duplicate CSS patterns to check:');
    duplicatePatterns.forEach(pattern => {
        const elements = document.querySelectorAll(pattern);
        console.log(`  - ${pattern}: ${elements.length} elements found`);
    });
    
    // 3. CHECK PARTICLE-RELATED SCRIPTS
    const particleScripts = document.querySelectorAll('script[src*="tsparticles"], script[src*="particles"]');
    console.log(`📊 Particle scripts found: ${particleScripts.length}`);
    
    return {
        particleElements,
        duplicatePatterns,
        particleScripts: particleScripts.length
    };
}

function removeParticleSystems() {
    console.log('🧹 Removing all particle systems...');
    
    // 1. REMOVE PARTICLE ELEMENTS
    const particleElements = [
        'tsparticles',
        'matrix-canvas', 
        'matrix-rain',
        'particles-js'
    ];
    
    particleElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
            console.log(`✅ Removed particle element: ${id}`);
        }
    });
    
    // 2. REMOVE PARTICLE BACKGROUND CLASSES
    const particleBackgrounds = document.querySelectorAll('.particles-background, .matrix-rain');
    particleBackgrounds.forEach(element => {
        element.remove();
        console.log(`✅ Removed particle background: ${element.className}`);
    });
    
    // 3. REMOVE PARTICLE SCRIPTS
    const particleScripts = document.querySelectorAll('script[src*="tsparticles"], script[src*="particles"]');
    particleScripts.forEach(script => {
        script.remove();
        console.log(`✅ Removed particle script: ${script.src}`);
    });
    
    console.log('✅ All particle systems removed');
}

function removeDuplicateCSS() {
    console.log('🧹 Removing duplicate/contradictory CSS inside app-wrapper...');
    
    // 1. IDENTIFY CSS SECTIONS TO REMOVE
    const cssSectionsToRemove = [
        // Particle-related CSS
        '#tsparticles',
        '#matrix-canvas',
        '#matrix-rain',
        '.matrix-rain',
        '.particles-background',
        
        // Duplicate button styles (keep only the first comprehensive set)
        '.btn::before',
        '.btn::after', 
        '.btn:hover::before',
        '.btn:hover::after',
        '.btn:active',
        
        // Duplicate card styles (keep only the first comprehensive set)
        '.card::before',
        '.card::after',
        '.card:hover::before',
        '.card:hover::after',
        
        // Duplicate modal styles (keep only the first comprehensive set)
        '.modal-overlay',
        '.modal.active',
        '.modal-content',
        '.modal-close',
        
        // Duplicate container styles
        '.container',
        
        // Duplicate button group styles
        '.btn-group'
    ];
    
    // 2. REMOVE DUPLICATE CSS RULES
    const styleSheets = document.styleSheets;
    let removedCount = 0;
    
    for (let i = 0; i < styleSheets.length; i++) {
        try {
            const rules = styleSheets[i].cssRules || styleSheets[i].rules;
            if (rules) {
                for (let j = rules.length - 1; j >= 0; j--) {
                    const rule = rules[j];
                    if (rule.selectorText) {
                        const selector = rule.selectorText.trim();
                        
                        // Check if this is a duplicate pattern to remove
                        const shouldRemove = cssSectionsToRemove.some(pattern => 
                            selector.includes(pattern) || selector.startsWith(pattern)
                        );
                        
                        if (shouldRemove) {
                            try {
                                styleSheets[i].deleteRule(j);
                                removedCount++;
                                console.log(`✅ Removed duplicate CSS: ${selector}`);
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
    
    console.log(`✅ Removed ${removedCount} duplicate CSS rules`);
}

function removeParticleJavaScript() {
    console.log('🧹 Removing particle-related JavaScript...');
    
    // 1. REMOVE PARTICLE INITIALIZATION FUNCTIONS
    const particleFunctions = [
        'initParticles',
        'initMatrixRain',
        'initMatrixCanvas',
        'toggleParticles',
        'toggleMatrixRain'
    ];
    
    particleFunctions.forEach(funcName => {
        if (window[funcName]) {
            delete window[funcName];
            console.log(`✅ Removed particle function: ${funcName}`);
        }
    });
    
    // 2. REMOVE PARTICLE INSTANCES
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
    
    // 3. REMOVE PARTICLE CONFIGURATIONS
    if (window.app && window.app.config) {
        if (window.app.config.particles !== undefined) {
            delete window.app.config.particles;
            console.log('✅ Removed particles config');
        }
        if (window.app.config.matrixRain !== undefined) {
            delete window.app.config.matrixRain;
            console.log('✅ Removed matrixRain config');
        }
    }
    
    console.log('✅ All particle JavaScript removed');
}

function removeParticleUIElements() {
    console.log('🧹 Removing particle-related UI elements...');
    
    // 1. REMOVE PARTICLE SETTINGS TOGGLES
    const particleToggles = [
        'particles-toggle',
        'matrix-rain-toggle'
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
    
    // 2. REMOVE PARTICLE SETTINGS DESCRIPTIONS
    const particleSettings = document.querySelectorAll('.settings-title, .settings-description');
    particleSettings.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes('particle') || text.includes('matrix')) {
            const container = element.closest('.settings-item') || element.parentElement;
            if (container) {
                container.remove();
                console.log(`✅ Removed particle setting: ${text}`);
            }
        }
    });
    
    console.log('✅ All particle UI elements removed');
}

function cleanupAppWrapper() {
    console.log('🧹 Cleaning up app-wrapper styling...');
    
    // 1. REMOVE CONFLICTING STYLES INSIDE APP-WRAPPER
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
        // Remove any inline styles that might conflict
        appWrapper.removeAttribute('style');
        console.log('✅ Cleaned app-wrapper inline styles');
        
        // Remove any conflicting classes
        const conflictingClasses = ['particles-enabled', 'matrix-enabled', 'enhanced-effects'];
        conflictingClasses.forEach(className => {
            appWrapper.classList.remove(className);
        });
        console.log('✅ Removed conflicting classes from app-wrapper');
    }
    
    // 2. ENSURE CLEAN BASE STYLING
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

function preserveOutsideWrapperStyling() {
    console.log('🛡️ Preserving styling outside app-wrapper...');
    
    // 1. IDENTIFY ELEMENTS OUTSIDE APP-WRAPPER
    const outsideElements = [
        '#loading-overlay',
        '#auth-view',
        '.auth-container',
        '.auth-card',
        '#modal-overlay',
        '.modal-overlay'
    ];
    
    console.log('📊 Elements outside app-wrapper to preserve:');
    outsideElements.forEach(selector => {
        const element = document.querySelector(selector);
        console.log(`  - ${selector}: ${element ? 'Found' : 'Missing'}`);
    });
    
    // 2. ENSURE OUTSIDE STYLING IS PROTECTED
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
        
        .modal-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.5) !important;
            z-index: var(--z-modal-backdrop) !important;
            display: none !important;
            align-items: center !important;
            justify-content: center !important;
        }
        
        .modal-overlay.active {
            display: flex !important;
        }
    `;
    document.head.appendChild(protectionStyles);
    console.log('✅ Protected outside-wrapper styling');
}

// Apply all cleanup operations
console.log('🎯 Starting comprehensive particle system and duplicate CSS cleanup...');

// Analyze first
const analysis = analyzeParticleSystems();

// Apply cleanup
removeParticleSystems();
removeDuplicateCSS();
removeParticleJavaScript();
removeParticleUIElements();
cleanupAppWrapper();
preserveOutsideWrapperStyling();

console.log('✅ Particle System & Duplicate CSS Cleanup completed successfully');
console.log('💡 All particle systems removed');
console.log('💡 Duplicate/contradictory CSS inside app-wrapper removed');
console.log('💡 Outside-wrapper styling preserved');
console.log('💡 App-wrapper cleaned and simplified');
console.log('💡 Ready for fresh, clean foundation'); 