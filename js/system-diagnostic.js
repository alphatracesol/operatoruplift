// System Diagnostic Tool
// Checks why systems aren't visible in the UI

(function() {
    'use strict';

    console.log('🔍 Starting System Diagnostic...\n');

    // Check if DOM is ready
    if (document.readyState === 'loading') {
        console.warn('⚠️  DOM not ready yet. Waiting...');
        document.addEventListener('DOMContentLoaded', runDiagnostic);
    } else {
        runDiagnostic();
    }

    function runDiagnostic() {
        console.log('📋 Diagnostic Report:\n');

        // 1. Check if all system objects exist
        checkSystemObjects();

        // 2. Check if UI elements exist
        checkUIElements();

        // 3. Check for CSS conflicts
        checkCSSConflicts();

        // 4. Check initialization order
        checkInitOrder();

        // 5. Check for JavaScript errors
        checkJSErrors();

        // 6. Attempt fixes
        attemptFixes();
    }

    function checkSystemObjects() {
        console.log('1️⃣ Checking System Objects:');
        
        const systems = [
            'journeySystem',
            'moodTracker',
            'streakProtection',
            'notificationSystem',
            'analyticsSystem',
            'aiCoaching',
            'collaborationSystem',
            'rewardMarketplace',
            'habitStacking',
            'enhancedFocusSessions',
            'goalTemplates',
            'progressReports',
            'backupRestore',
            'enhancedOnboarding',
            'accessibilitySystem',
            'offlineMode',
            'thirdPartyIntegrations',
            'performanceMonitor',
            'securitySystem',
            'testSuite'
        ];

        let missing = [];
        systems.forEach(system => {
            if (window[system]) {
                console.log(`✅ ${system} - Loaded`);
            } else {
                console.log(`❌ ${system} - Missing`);
                missing.push(system);
            }
        });

        if (missing.length > 0) {
            console.warn(`\n⚠️  ${missing.length} systems not loaded in window object`);
        }
    }

    function checkUIElements() {
        console.log('\n2️⃣ Checking UI Elements:');

        const elements = [
            { selector: '.journey-card', name: 'Journey Card' },
            { selector: '.mood-check-btn', name: 'Mood Button' },
            { selector: '.streak-shield-indicator', name: 'Streak Shield' },
            { selector: '.notification-bell', name: 'Notification Bell' },
            { selector: '.ai-coaching-card', name: 'AI Coaching Card' },
            { selector: '.team-challenges-card', name: 'Team Challenges' },
            { selector: '.marketplace-btn', name: 'Marketplace Button' },
            { selector: '.weekly-report-card', name: 'Weekly Report' },
            { selector: '.a11y-toggle', name: 'Accessibility Toggle' },
            { selector: '.offline-indicator', name: 'Offline Indicator' }
        ];

        let missingUI = [];
        elements.forEach(el => {
            const found = document.querySelector(el.selector);
            if (found) {
                console.log(`✅ ${el.name} - Found`);
            } else {
                console.log(`❌ ${el.name} - Missing`);
                missingUI.push(el);
            }
        });

        if (missingUI.length > 0) {
            console.warn(`\n⚠️  ${missingUI.length} UI elements missing`);
        }
    }

    function checkCSSConflicts() {
        console.log('\n3️⃣ Checking CSS Conflicts:');

        // Check if dashboard grid exists and is visible
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (dashboardGrid) {
            const styles = window.getComputedStyle(dashboardGrid);
            console.log(`Dashboard Grid Display: ${styles.display}`);
            console.log(`Dashboard Grid Visibility: ${styles.visibility}`);
            
            if (styles.display === 'none' || styles.visibility === 'hidden') {
                console.error('❌ Dashboard grid is hidden!');
            }
        }

        // Check if app container is visible
        const app = document.getElementById('app');
        if (app) {
            const appStyles = window.getComputedStyle(app);
            console.log(`App Display: ${appStyles.display}`);
            
            if (appStyles.display === 'none') {
                console.error('❌ App container is hidden!');
            }
        }
    }

    function checkInitOrder() {
        console.log('\n4️⃣ Checking Initialization Order:');

        // Check if integration function exists
        if (window.integrateAllSystems) {
            console.log('✅ Integration function exists');
            
            // Check if it was called
            if (document.querySelector('[data-integrated="true"]')) {
                console.log('✅ Integration was executed');
            } else {
                console.log('❌ Integration not executed');
                console.log('🔧 Attempting to run integration now...');
                window.integrateAllSystems();
            }
        } else {
            console.error('❌ Integration function missing!');
        }
    }

    function checkJSErrors() {
        console.log('\n5️⃣ Checking for JavaScript Errors:');

        // Set up error listener
        const originalError = window.onerror;
        let errorCount = 0;
        
        window.onerror = function(msg, url, line, col, error) {
            errorCount++;
            console.error(`JS Error: ${msg} at ${url}:${line}:${col}`);
            if (originalError) originalError.apply(this, arguments);
        };

        // Check for module loading issues
        const moduleScripts = document.querySelectorAll('script[type="module"]');
        console.log(`Found ${moduleScripts.length} module scripts`);

        const regularScripts = document.querySelectorAll('script:not([type="module"])');
        console.log(`Found ${regularScripts.length} regular scripts`);
    }

    function attemptFixes() {
        console.log('\n6️⃣ Attempting Fixes:');

        // Fix 1: Ensure app is visible
        const app = document.getElementById('app');
        const authScreen = document.getElementById('authScreen');
        
        if (app && authScreen) {
            if (window.getComputedStyle(app).display === 'none') {
                console.log('🔧 Making app visible...');
                app.style.display = 'flex';
                authScreen.style.display = 'none';
            }
        }

        // Fix 2: Ensure dashboard view is active
        const dashboardView = document.getElementById('dashboardView');
        if (dashboardView && !dashboardView.classList.contains('active')) {
            console.log('🔧 Activating dashboard view...');
            document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
            dashboardView.classList.add('active');
        }

        // Fix 3: Force re-run integration
        setTimeout(() => {
            if (window.integrateAllSystems) {
                console.log('🔧 Re-running integration system...');
                window.integrateAllSystems();
            }

            // Fix 4: Manually initialize critical systems
            if (!document.querySelector('.journey-card') && window.journeySystem) {
                console.log('🔧 Manually adding journey card...');
                const dashboardGrid = document.querySelector('.dashboard-grid');
                if (dashboardGrid) {
                    const journeyCard = document.createElement('div');
                    journeyCard.className = 'card journey-card';
                    journeyCard.innerHTML = `
                        <div class="card-header">
                            <h3 class="card-title">Active Journey</h3>
                            <div class="card-icon">🗺️</div>
                        </div>
                        <div class="journey-content">
                            <p>No active journey</p>
                            <button class="btn btn-primary">Start Journey</button>
                        </div>
                    `;
                    dashboardGrid.appendChild(journeyCard);
                }
            }
        }, 1000);

        // Fix 5: Check authentication state
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || 
                              window.auth?.currentUser || 
                              sessionStorage.getItem('demoMode') === 'true';
        
        if (!isAuthenticated) {
            console.warn('⚠️  User not authenticated. Some features may be hidden.');
            console.log('🔧 Enabling demo mode...');
            sessionStorage.setItem('demoMode', 'true');
            
            // Force show app
            if (app) app.style.display = 'flex';
            if (authScreen) authScreen.style.display = 'none';
        }

        console.log('\n✅ Diagnostic complete. Check above for issues.');
    }

    // Make diagnostic available globally
    window.runSystemDiagnostic = runDiagnostic;
})();
