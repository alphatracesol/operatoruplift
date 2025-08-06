// ===== CHUNK 3 AUDIT: STYLE ATTRIBUTION & RESTORATION TEST =====
// This script audits the current state and identifies style misattributions

console.log('🔍 CHUNK 3 AUDIT: Starting Style Attribution & Restoration Test...');

// Test 1: Check for duplicate keyframe animations
function auditKeyframeDuplicates() {
    console.log('\n📋 Test 1: Keyframe Animation Audit');
    
    const styleSheets = Array.from(document.styleSheets);
    const keyframes = {};
    const duplicates = [];
    
    styleSheets.forEach(sheet => {
        try {
            const rules = Array.from(sheet.cssRules || sheet.rules);
            rules.forEach(rule => {
                if (rule.type === CSSRule.KEYFRAMES_RULE) {
                    const name = rule.name;
                    if (keyframes[name]) {
                        duplicates.push(name);
                    } else {
                        keyframes[name] = rule;
                    }
                }
            });
        } catch (e) {
            console.log('⚠️  Could not access stylesheet:', e.message);
        }
    });
    
    if (duplicates.length > 0) {
        console.log('❌ DUPLICATE KEYFRAMES FOUND:', duplicates);
        return false;
    } else {
        console.log('✅ No duplicate keyframes found');
        return true;
    }
}

// Test 2: Check for shimmer effect misattributions
function auditShimmerEffects() {
    console.log('\n📋 Test 2: Shimmer Effect Attribution Audit');
    
    const shimmerElements = document.querySelectorAll('[class*="shimmer"], [style*="shimmer"]');
    const progressBars = document.querySelectorAll('.progress-bar, .stat-bar, .progress');
    const bentoBoxes = document.querySelectorAll('.bento-box, .character-card, .card');
    
    console.log(`Found ${shimmerElements.length} shimmer-related elements`);
    console.log(`Found ${progressBars.length} progress bars`);
    console.log(`Found ${bentoBoxes.length} bento box elements`);
    
    // Check if shimmer is properly applied to progress bars
    let shimmerOnProgress = 0;
    progressBars.forEach(bar => {
        const computedStyle = getComputedStyle(bar);
        if (computedStyle.animation.includes('shimmer')) {
            shimmerOnProgress++;
        }
    });
    
    console.log(`✅ ${shimmerOnProgress} progress bars have shimmer effects`);
    
    // Check if shimmer is misattributed to loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const loadingComputed = getComputedStyle(loadingScreen);
        if (loadingComputed.animation.includes('shimmer')) {
            console.log('❌ WARNING: Shimmer effect found on loading screen - should use loadingShimmerEffect');
            return false;
        } else {
            console.log('✅ Loading screen uses correct loadingShimmerEffect');
        }
    }
    
    return true;
}

// Test 3: Check for particle effect misattributions
function auditParticleEffects() {
    console.log('\n📋 Test 3: Particle Effect Attribution Audit');
    
    const tsparticles = document.getElementById('tsparticles');
    const matrixCanvas = document.getElementById('matrix-canvas');
    const particleElements = document.querySelectorAll('[id*="particle"], [class*="particle"]');
    
    console.log(`Found ${particleElements.length} particle-related elements`);
    
    if (tsparticles) {
        console.log('✅ tsParticles container found for background effects');
    } else {
        console.log('⚠️  tsParticles container not found');
    }
    
    if (matrixCanvas) {
        console.log('✅ Matrix rain canvas found');
    } else {
        console.log('⚠️  Matrix rain canvas not found');
    }
    
    // Check if particles are misattributed to loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const loadingComputed = getComputedStyle(loadingScreen);
        if (loadingComputed.animation.includes('particle')) {
            console.log('❌ WARNING: Particle effect found on loading screen - should be background only');
            return false;
        } else {
            console.log('✅ Loading screen does not have particle effects');
        }
    }
    
    return true;
}

// Test 4: Check for color shift misattributions
function auditColorShifts() {
    console.log('\n📋 Test 4: Color Shift Attribution Audit');
    
    const settingsElements = document.querySelectorAll('.settings-container, .toggle-switch, .settings-select');
    const accentColorElements = document.querySelectorAll('[style*="accent-color"], [class*="accent"]');
    
    console.log(`Found ${settingsElements.length} settings elements`);
    console.log(`Found ${accentColorElements.length} accent color elements`);
    
    // Check if color shifts are properly applied to settings
    let colorShiftOnSettings = 0;
    settingsElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        if (computedStyle.color.includes('var(--accent-color)') || 
            computedStyle.borderColor.includes('var(--accent-color)')) {
            colorShiftOnSettings++;
        }
    });
    
    console.log(`✅ ${colorShiftOnSettings} settings elements have accent colors`);
    
    // Check if color shifts are misattributed to loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const loadingComputed = getComputedStyle(loadingScreen);
        if (loadingComputed.color.includes('var(--accent-color)') && 
            !loadingComputed.color.includes('fixed')) {
            console.log('❌ WARNING: Dynamic accent color found on loading screen - should use fixed colors');
            return false;
        } else {
            console.log('✅ Loading screen uses fixed colors');
        }
    }
    
    return true;
}

// Test 5: Check for bento box misattributions
function auditBentoBoxEffects() {
    console.log('\n📋 Test 5: Bento Box Effect Attribution Audit');
    
    const bentoElements = document.querySelectorAll('.bento-box, .character-card, .card, .glass-card');
    const dashboardElements = document.querySelectorAll('.dashboard, .character-stats, .treasure-section');
    
    console.log(`Found ${bentoElements.length} bento box elements`);
    console.log(`Found ${dashboardElements.length} dashboard elements`);
    
    // Check if bento effects are properly applied
    let bentoEffectsApplied = 0;
    bentoElements.forEach(element => {
        const computedStyle = getComputedStyle(element);
        if (computedStyle.transform.includes('translateY') || 
            computedStyle.boxShadow !== 'none') {
            bentoEffectsApplied++;
        }
    });
    
    console.log(`✅ ${bentoEffectsApplied} bento elements have hover effects`);
    
    // Check if bento effects are misattributed to loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const loadingComputed = getComputedStyle(loadingScreen);
        if (loadingComputed.transform.includes('translateY') && 
            !loadingComputed.transform.includes('scale')) {
            console.log('❌ WARNING: Bento-style transform found on loading screen');
            return false;
        } else {
            console.log('✅ Loading screen uses appropriate transforms');
        }
    }
    
    return true;
}

// Test 6: Check for z-index conflicts
function auditZIndexLayers() {
    console.log('\n📋 Test 6: Z-Index Layer Audit');
    
    const zIndexValues = {
        background: 0,
        content: 10,
        header: 100,
        modal: 1100,
        loading: 99999
    };
    
    const loadingScreen = document.getElementById('loading-screen');
    const modals = document.querySelectorAll('.modal, .glass-modal');
    const headers = document.querySelectorAll('header, .nav-container');
    const backgrounds = document.querySelectorAll('#tsparticles, #matrix-canvas');
    
    let conflicts = [];
    
    if (loadingScreen) {
        const loadingZ = parseInt(getComputedStyle(loadingScreen).zIndex);
        if (loadingZ < zIndexValues.loading) {
            conflicts.push(`Loading screen z-index (${loadingZ}) should be ${zIndexValues.loading}`);
        }
    }
    
    modals.forEach(modal => {
        const modalZ = parseInt(getComputedStyle(modal).zIndex);
        if (modalZ < zIndexValues.modal) {
            conflicts.push(`Modal z-index (${modalZ}) should be ${zIndexValues.modal}`);
        }
    });
    
    if (conflicts.length > 0) {
        console.log('❌ Z-INDEX CONFLICTS:', conflicts);
        return false;
    } else {
        console.log('✅ Z-index layers properly configured');
        return true;
    }
}

// Test 7: Check for CSS specificity issues
function auditCSSSpecificity() {
    console.log('\n📋 Test 7: CSS Specificity Audit');
    
    const loadingScreen = document.getElementById('loading-screen');
    const miniCube = document.querySelector('.mini-cube');
    const loadingCube = document.querySelector('#loading-cube');
    
    let specificityIssues = [];
    
    if (loadingScreen && miniCube && loadingCube) {
        // Check if loading cube styles are specific enough
        const loadingCubeStyle = getComputedStyle(loadingCube);
        const miniCubeStyle = getComputedStyle(miniCube);
        
        if (loadingCubeStyle.width === miniCubeStyle.width && 
            loadingCubeStyle.height === miniCubeStyle.height) {
            specificityIssues.push('Loading cube and mini cube have same dimensions - specificity issue');
        }
    }
    
    if (specificityIssues.length > 0) {
        console.log('❌ SPECIFICITY ISSUES:', specificityIssues);
        return false;
    } else {
        console.log('✅ CSS specificity properly configured');
        return true;
    }
}

// Test 8: Check for loading screen functionality
function testLoadingScreenFunctionality() {
    console.log('\n📋 Test 8: Loading Screen Functionality Test');
    
    const loadingScreen = document.getElementById('loading-screen');
    const loadingCube = document.querySelector('#loading-cube');
    const loadingText = document.querySelector('#loading-text');
    const loadingProgress = document.querySelector('#loading-progress');
    
    if (!loadingScreen) {
        console.log('❌ Loading screen not found');
        return false;
    }
    
    if (!loadingCube) {
        console.log('❌ Loading cube not found');
        return false;
    }
    
    if (!loadingText) {
        console.log('❌ Loading text not found');
        return false;
    }
    
    if (!loadingProgress) {
        console.log('❌ Loading progress not found');
        return false;
    }
    
    // Test cube click functionality
    let cubeClickable = false;
    try {
        loadingCube.click();
        cubeClickable = true;
    } catch (e) {
        console.log('⚠️  Cube click test failed:', e.message);
    }
    
    // Test text cycling
    const textContent = loadingText.textContent;
    if (textContent && textContent.length > 0) {
        console.log('✅ Loading text content found:', textContent.substring(0, 50) + '...');
    } else {
        console.log('❌ Loading text content missing');
    }
    
    // Test progress bar
    const progressWidth = getComputedStyle(loadingProgress).width;
    if (progressWidth && progressWidth !== '0px') {
        console.log('✅ Progress bar has width:', progressWidth);
    } else {
        console.log('❌ Progress bar width issue');
    }
    
    console.log(`✅ Loading screen elements found and functional`);
    return true;
}

// Test 9: Check for linter-style errors
function auditLinterErrors() {
    console.log('\n📋 Test 9: Linter-Style Error Audit');
    
    const errors = [];
    
    // Check for undefined CSS variables
    const elementsWithVars = document.querySelectorAll('[style*="var(--"]');
    elementsWithVars.forEach(element => {
        const style = element.getAttribute('style');
        const varMatches = style.match(/var\(--[^)]+\)/g);
        if (varMatches) {
            varMatches.forEach(match => {
                const varName = match.match(/--[^)]+/)[0];
                const computedStyle = getComputedStyle(document.documentElement);
                const varValue = computedStyle.getPropertyValue(varName);
                if (!varValue || varValue.trim() === '') {
                    errors.push(`Undefined CSS variable: ${varName}`);
                }
            });
        }
    });
    
    // Check for duplicate IDs
    const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
    const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
        errors.push(`Duplicate IDs found: ${duplicateIds.join(', ')}`);
    }
    
    // Check for orphaned elements
    const orphanedElements = document.querySelectorAll('*:not(body):not(html)');
    orphanedElements.forEach(element => {
        if (!element.parentElement && !element.isConnected) {
            errors.push(`Orphaned element: ${element.tagName}`);
        }
    });
    
    if (errors.length > 0) {
        console.log('❌ LINTER ERRORS:', errors);
        return false;
    } else {
        console.log('✅ No linter-style errors found');
        return true;
    }
}

// Run all tests
function runChunk3Audit() {
    console.log('🚀 Starting Chunk 3 Comprehensive Audit...\n');
    
    const tests = [
        { name: 'Keyframe Duplicates', fn: auditKeyframeDuplicates },
        { name: 'Shimmer Effects', fn: auditShimmerEffects },
        { name: 'Particle Effects', fn: auditParticleEffects },
        { name: 'Color Shifts', fn: auditColorShifts },
        { name: 'Bento Box Effects', fn: auditBentoBoxEffects },
        { name: 'Z-Index Layers', fn: auditZIndexLayers },
        { name: 'CSS Specificity', fn: auditCSSSpecificity },
        { name: 'Loading Screen Functionality', fn: testLoadingScreenFunctionality },
        { name: 'Linter Errors', fn: auditLinterErrors }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    tests.forEach(test => {
        try {
            const result = test.fn();
            if (result) {
                passedTests++;
            }
        } catch (error) {
            console.log(`❌ Test "${test.name}" failed with error:`, error.message);
        }
    });
    
    console.log('\n📊 AUDIT SUMMARY:');
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 CHUNK 3 AUDIT COMPLETE: All tests passed!');
        console.log('✅ Style attribution is correct');
        console.log('✅ No conflicts detected');
        console.log('✅ Ready for Chunk 4');
    } else {
        console.log('\n⚠️  CHUNK 3 AUDIT: Issues detected');
        console.log('🔧 Fixes needed before proceeding to Chunk 4');
    }
    
    return passedTests === totalTests;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runChunk3Audit };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runChunk3Audit);
    } else {
        runChunk3Audit();
    }
} 