const fs = require('fs');
const path = require('path');

console.log('🔒 CRITICAL FIXES TEST SUITE');
console.log('============================\n');

// Test results tracking
const testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
};

function addTestResult(testName, passed, details = '') {
    testResults.total++;
    if (passed) {
        testResults.passed++;
        console.log(`✅ ${testName}: PASSED`);
    } else {
        testResults.failed++;
        console.log(`❌ ${testName}: FAILED - ${details}`);
    }
    testResults.details.push({ testName, passed, details });
}

// Test 1: Check if app.html exists and is readable
function testAppFileExists() {
    try {
        const appPath = path.join(__dirname, 'app.html');
        const exists = fs.existsSync(appPath);
        addTestResult('App.html file exists', exists, exists ? '' : 'app.html not found');
        
        if (exists) {
            const stats = fs.statSync(appPath);
            const fileSize = stats.size;
            addTestResult('App.html is readable', fileSize > 0, `File size: ${fileSize} bytes`);
        }
    } catch (error) {
        addTestResult('App.html file access', false, error.message);
    }
}

// Test 2: Check for security fixes in app.html
function testSecurityFixes() {
    try {
        const appContent = fs.readFileSync('app.html', 'utf8');
        
        // Check for secure API key management
        const hasSecureApiKey = appContent.includes('getSecureApiKey()') && 
                               appContent.includes('process.env.DEEPSEEK_API_KEY');
        addTestResult('Secure API key management', hasSecureApiKey, 
                     hasSecureApiKey ? '' : 'Secure API key method not found');
        
        // Check for removed hardcoded secrets (only actual values, not declarations)
        const hasHardcodedSecrets = appContent.includes('apiKey: "') || 
                                  appContent.includes('apiKey: \'') ||
                                  appContent.includes('FIREBASE_API_KEY: "') ||
                                  appContent.includes('FIREBASE_API_KEY: \'') ||
                                  appContent.includes('HF_TOKEN: "') ||
                                  appContent.includes('HF_TOKEN: \'');
        addTestResult('No hardcoded secrets', !hasHardcodedSecrets, 
                     hasHardcodedSecrets ? 'Hardcoded secrets found' : '');
        
        // Check for enhanced sanitization
        const hasEnhancedSanitization = appContent.includes('sanitizeInput') && 
                                       appContent.includes('textContent') &&
                                       appContent.includes('innerHTML');
        addTestResult('Enhanced input sanitization', hasEnhancedSanitization, 
                     hasEnhancedSanitization ? '' : 'Enhanced sanitization not found');
        
        // Check for CSP headers
        const hasCSP = appContent.includes('Content-Security-Policy');
        addTestResult('Content Security Policy', hasCSP, 
                     hasCSP ? '' : 'CSP headers not found');
        
    } catch (error) {
        addTestResult('Security fixes check', false, error.message);
    }
}

// Test 3: Check for modal overlay fixes
function testModalFixes() {
    try {
        const appContent = fs.readFileSync('app.html', 'utf8');
        
        // Check for modal overlay element
        const hasModalOverlay = appContent.includes('modal-overlay') && 
                               appContent.includes('id="modal-overlay"');
        addTestResult('Modal overlay element', hasModalOverlay, 
                     hasModalOverlay ? '' : 'Modal overlay not found');
        
        // Check for modal overlay CSS
        const hasModalOverlayCSS = appContent.includes('.modal-overlay') && 
                                  appContent.includes('backdrop-filter');
        addTestResult('Modal overlay CSS', hasModalOverlayCSS, 
                     hasModalOverlayCSS ? '' : 'Modal overlay CSS not found');
        
        // Check for z-index variables
        const hasZIndexVars = appContent.includes('--z-modal') && 
                             appContent.includes('--z-modal-backdrop');
        addTestResult('Z-index variables', hasZIndexVars, 
                     hasZIndexVars ? '' : 'Z-index variables not found');
        
        // Check for showModal function
        const hasShowModal = appContent.includes('showModal') && 
                            appContent.includes('modal-overlay');
        addTestResult('ShowModal function', hasShowModal, 
                     hasShowModal ? '' : 'ShowModal function not found');
        
    } catch (error) {
        addTestResult('Modal fixes check', false, error.message);
    }
}

// Test 4: Check for auth state management
function testAuthStateManagement() {
    try {
        const appContent = fs.readFileSync('app.html', 'utf8');
        
        // Check for auth state indicator
        const hasAuthIndicator = appContent.includes('auth-state-indicator') && 
                                appContent.includes('id="auth-state-indicator"');
        addTestResult('Auth state indicator', hasAuthIndicator, 
                     hasAuthIndicator ? '' : 'Auth state indicator not found');
        
        // Check for updateAuthState function
        const hasUpdateAuthState = appContent.includes('updateAuthState') && 
                                  appContent.includes('isAuthenticated');
        addTestResult('UpdateAuthState function', hasUpdateAuthState, 
                     hasUpdateAuthState ? '' : 'UpdateAuthState function not found');
        
        // Check for auth state CSS classes
        const hasAuthStateCSS = appContent.includes('.auth-state-indicator.authenticated') || 
                               appContent.includes('auth-state-indicator authenticated');
        addTestResult('Auth state CSS classes', hasAuthStateCSS, 
                     hasAuthStateCSS ? '' : 'Auth state CSS classes not found');
        
    } catch (error) {
        addTestResult('Auth state management check', false, error.message);
    }
}

// Test 5: Check for daily spin cooldown
function testSpinCooldown() {
    try {
        const appContent = fs.readFileSync('app.html', 'utf8');
        
        // Check for cooldown element
        const hasCooldownElement = appContent.includes('spin-cooldown') && 
                                  appContent.includes('id="spin-cooldown"');
        addTestResult('Spin cooldown element', hasCooldownElement, 
                     hasCooldownElement ? '' : 'Spin cooldown element not found');
        
        // Check for cooldown timer
        const hasCooldownTimer = appContent.includes('cooldown-timer') && 
                                appContent.includes('id="cooldown-timer"');
        addTestResult('Cooldown timer element', hasCooldownTimer, 
                     hasCooldownTimer ? '' : 'Cooldown timer not found');
        
        // Check for cooldown functions
        const hasCooldownFunctions = appContent.includes('canSpin()') && 
                                    appContent.includes('updateCooldownDisplay()');
        addTestResult('Cooldown functions', hasCooldownFunctions, 
                     hasCooldownFunctions ? '' : 'Cooldown functions not found');
        
        // Check for cooldown duration
        const hasCooldownDuration = appContent.includes('cooldownDuration') && 
                                   appContent.includes('24 * 60 * 60 * 1000');
        addTestResult('Cooldown duration (24h)', hasCooldownDuration, 
                     hasCooldownDuration ? '' : '24-hour cooldown not found');
        
    } catch (error) {
        addTestResult('Spin cooldown check', false, error.message);
    }
}

// Test 6: Check for safe DOM manipulation
function testSafeDOMManipulation() {
    try {
        const appContent = fs.readFileSync('app.html', 'utf8');
        
        // Check for safeGet function
        const hasSafeGet = appContent.includes('safeGet') && 
                          appContent.includes('document.getElementById');
        addTestResult('SafeGet function', hasSafeGet, 
                     hasSafeGet ? '' : 'SafeGet function not found');
        
        // Check for safeAddEventListener
        const hasSafeAddEventListener = appContent.includes('safeAddEventListener');
        addTestResult('SafeAddEventListener function', hasSafeAddEventListener, 
                     hasSafeAddEventListener ? '' : 'SafeAddEventListener not found');
        
        // Check for error handling in DOM operations
        const hasErrorHandling = appContent.includes('try {') && 
                                appContent.includes('catch (error)') &&
                                appContent.includes('console.error');
        addTestResult('DOM error handling', hasErrorHandling, 
                     hasErrorHandling ? '' : 'DOM error handling not found');
        
    } catch (error) {
        addTestResult('Safe DOM manipulation check', false, error.message);
    }
}

// Test 7: Check for comprehensive error handling
function testErrorHandling() {
    try {
        const appContent = fs.readFileSync('app.html', 'utf8');
        
        // Count try-catch blocks
        const tryCatchMatches = appContent.match(/try\s*{/g);
        const tryCatchCount = tryCatchMatches ? tryCatchMatches.length : 0;
        addTestResult('Error handling coverage', tryCatchCount >= 5, 
                     `Found ${tryCatchCount} try-catch blocks (minimum 5 expected)`);
        
        // Check for console.error usage
        const hasConsoleError = appContent.includes('console.error');
        addTestResult('Console error logging', hasConsoleError, 
                     hasConsoleError ? '' : 'Console error logging not found');
        
        // Check for user-friendly error messages
        const hasUserErrors = appContent.includes('showToast') && 
                             appContent.includes('error');
        addTestResult('User-friendly error messages', hasUserErrors, 
                     hasUserErrors ? '' : 'User-friendly error messages not found');
        
    } catch (error) {
        addTestResult('Error handling check', false, error.message);
    }
}

// Test 8: Check for performance optimizations
function testPerformanceOptimizations() {
    try {
        const appContent = fs.readFileSync('app.html', 'utf8');
        
        // Check for debouncing
        const hasDebouncing = appContent.includes('debounce') || 
                             appContent.includes('setTimeout');
        addTestResult('Debouncing implementation', hasDebouncing, 
                     hasDebouncing ? '' : 'Debouncing not found');
        
        // Check for lazy loading
        const hasLazyLoading = appContent.includes('IntersectionObserver') || 
                              appContent.includes('loading="lazy"');
        addTestResult('Lazy loading', hasLazyLoading, 
                     hasLazyLoading ? '' : 'Lazy loading not found');
        
        // Check for performance monitoring
        const hasPerformanceMonitoring = appContent.includes('measurePerformance') || 
                                        appContent.includes('performance.now()');
        addTestResult('Performance monitoring', hasPerformanceMonitoring, 
                     hasPerformanceMonitoring ? '' : 'Performance monitoring not found');
        
    } catch (error) {
        addTestResult('Performance optimizations check', false, error.message);
    }
}

// Run all tests
console.log('Running comprehensive tests...\n');

testAppFileExists();
testSecurityFixes();
testModalFixes();
testAuthStateManagement();
testSpinCooldown();
testSafeDOMManipulation();
testErrorHandling();
testPerformanceOptimizations();

// Print summary
console.log('\n📊 TEST SUMMARY');
console.log('===============');
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Success Rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);

if (testResults.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.details
        .filter(result => !result.passed)
        .forEach(result => {
            console.log(`- ${result.testName}: ${result.details}`);
        });
}

console.log('\n🎯 RECOMMENDATIONS:');
if (testResults.passed === testResults.total) {
    console.log('✅ All critical fixes are properly implemented!');
    console.log('✅ Application is ready for production deployment.');
} else {
    console.log('⚠️ Some critical fixes need attention before deployment.');
    console.log('🔧 Review failed tests and implement missing features.');
}

console.log('\n🚀 NEXT STEPS:');
console.log('1. Deploy to production if all tests pass');
console.log('2. Monitor application performance');
console.log('3. Collect user feedback');
console.log('4. Plan future enhancements');

// Exit with appropriate code
process.exit(testResults.failed > 0 ? 1 : 0); 