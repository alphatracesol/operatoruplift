// Deep Integration Scan - Identifies structural and routing issues
(function() {
    'use strict';

    console.log('🔍 Deep Integration Scan Tool loaded');

    window.deepIntegrationScan = {
        // Scan for all issues
        runFullScan: function() {
            console.log('=== DEEP INTEGRATION SCAN STARTING ===');
            
            const issues = [];
            
            // 1. Check script loading order
            issues.push(...this.checkScriptOrder());
            
            // 2. Check function definitions
            issues.push(...this.checkFunctionDefinitions());
            
            // 3. Check event listeners
            issues.push(...this.checkEventListeners());
            
            // 4. Check view routing
            issues.push(...this.checkViewRouting());
            
            // 5. Check modal structure
            issues.push(...this.checkModalStructure());
            
            // 6. Check data flow
            issues.push(...this.checkDataFlow());
            
            // 7. Check CSS conflicts
            issues.push(...this.checkCSSConflicts());
            
            // 8. Check initialization timing
            issues.push(...this.checkInitializationTiming());
            
            // Report
            console.log(`\n🔍 SCAN COMPLETE: Found ${issues.length} issues\n`);
            issues.forEach((issue, i) => {
                console.log(`${i + 1}. ${issue.type}: ${issue.message}`);
                if (issue.details) console.log(`   Details: ${issue.details}`);
                if (issue.fix) console.log(`   Fix: ${issue.fix}`);
            });
            
            return issues;
        },

        checkScriptOrder: function() {
            const issues = [];
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            
            console.log('\n📜 Checking script order...');
            
            // Check for dependencies loaded after dependents
            const scriptMap = {};
            scripts.forEach((script, i) => {
                const src = script.src.split('/').pop();
                scriptMap[src] = i;
            });
            
            // Known dependencies
            const dependencies = {
                'complete-ui-integration.js': ['system-initializer.js'],
                'modal-fix.js': ['auth-bypass.js'],
                'view-modal-manager.js': ['modal-fix.js']
            };
            
            Object.entries(dependencies).forEach(([dependent, deps]) => {
                deps.forEach(dep => {
                    if (scriptMap[dependent] < scriptMap[dep]) {
                        issues.push({
                            type: 'SCRIPT_ORDER',
                            message: `${dependent} loads before ${dep}`,
                            fix: `Move ${dep} before ${dependent} in HTML`
                        });
                    }
                });
            });
            
            return issues;
        },

        checkFunctionDefinitions: function() {
            const issues = [];
            console.log('\n🔧 Checking function definitions...');
            
            // Critical functions that should exist
            const requiredFunctions = [
                'navigate',
                'loadViewContent',
                'createSocialHubView',
                'createWalletInterfaceView',
                'connectPhantomWallet',
                'showToast',
                'initializeApp'
            ];
            
            requiredFunctions.forEach(func => {
                if (typeof window[func] !== 'function') {
                    issues.push({
                        type: 'MISSING_FUNCTION',
                        message: `Function '${func}' is not defined`,
                        details: 'This may cause features to fail',
                        fix: `Ensure ${func} is defined before use`
                    });
                }
            });
            
            // Check for overridden functions
            const overriddenFunctions = ['navigate', 'loadViewContent'];
            overriddenFunctions.forEach(func => {
                const funcStr = window[func]?.toString() || '';
                if (funcStr.includes('Unified') || funcStr.includes('override')) {
                    console.log(`✅ ${func} is properly overridden`);
                } else {
                    issues.push({
                        type: 'OVERRIDE_MISSING',
                        message: `${func} may not be properly overridden`,
                        fix: 'Check if unified-view-fix.js is loading correctly'
                    });
                }
            });
            
            return issues;
        },

        checkEventListeners: function() {
            const issues = [];
            console.log('\n🎯 Checking event listeners...');
            
            // Check navigation items
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                const onclick = item.getAttribute('onclick');
                const dataView = item.getAttribute('data-view');
                
                if (!onclick && !item._hasEventListener) {
                    issues.push({
                        type: 'MISSING_LISTENER',
                        message: `Nav item for '${dataView}' has no click handler`,
                        fix: `Add onclick="navigate('${dataView}')" or event listener`
                    });
                }
            });
            
            // Check buttons
            const buttons = document.querySelectorAll('button');
            let buttonsWithoutHandlers = 0;
            buttons.forEach(btn => {
                if (!btn.onclick && !btn.hasAttribute('onclick') && !btn._hasEventListener) {
                    buttonsWithoutHandlers++;
                }
            });
            
            if (buttonsWithoutHandlers > 10) {
                issues.push({
                    type: 'MISSING_HANDLERS',
                    message: `${buttonsWithoutHandlers} buttons have no click handlers`,
                    details: 'Many interactive elements are not wired up'
                });
            }
            
            return issues;
        },

        checkViewRouting: function() {
            const issues = [];
            console.log('\n🗺️ Checking view routing...');
            
            // Check all expected views
            const expectedViews = [
                'dashboard', 'goals', 'habits', 'analytics', 
                'burn', 'community', 'leaderboard', 'achievements',
                'settings', 'social', 'wallet'
            ];
            
            expectedViews.forEach(view => {
                const viewElement = document.getElementById(`${view}View`);
                const navItem = document.querySelector(`[data-view="${view}"]`);
                
                if (!viewElement && view !== 'dashboard') {
                    issues.push({
                        type: 'MISSING_VIEW',
                        message: `View container '${view}View' not found`,
                        details: 'View will be created dynamically',
                        fix: `Ensure create${view.charAt(0).toUpperCase() + view.slice(1)}View() exists`
                    });
                }
                
                if (!navItem && ['dashboard', 'goals', 'habits', 'analytics', 'burn'].includes(view)) {
                    issues.push({
                        type: 'MISSING_NAV',
                        message: `No navigation item for '${view}'`,
                        fix: `Add nav item with data-view="${view}"`
                    });
                }
            });
            
            // Check loadViewContent logic
            const loadViewContentStr = window.loadViewContent?.toString() || '';
            if (!loadViewContentStr.includes('createSocialHubView')) {
                issues.push({
                    type: 'VIEW_CREATION',
                    message: 'loadViewContent may not create social view',
                    fix: 'Ensure loadViewContent calls view creation functions'
                });
            }
            
            return issues;
        },

        checkModalStructure: function() {
            const issues = [];
            console.log('\n🪟 Checking modal structure...');
            
            // Check modal container
            const modalContainer = document.getElementById('modalContainer');
            if (!modalContainer) {
                issues.push({
                    type: 'MISSING_CONTAINER',
                    message: 'No modalContainer element found',
                    details: 'Modals may appear in wrong location',
                    fix: 'Add <div id="modalContainer"></div> to app container'
                });
            }
            
            // Check for orphaned modals
            const modals = document.querySelectorAll('.modal, [class*="modal"]');
            modals.forEach(modal => {
                if (!modal.closest('.view-container') && !modal.closest('#modalContainer')) {
                    issues.push({
                        type: 'ORPHANED_MODAL',
                        message: `Modal ${modal.className} is not in a proper container`,
                        details: 'May appear in wrong location'
                    });
                }
            });
            
            return issues;
        },

        checkDataFlow: function() {
            const issues = [];
            console.log('\n🔄 Checking data flow...');
            
            // Check localStorage usage
            const localStorageKeys = [
                'userXP', 'userLevel', 'userStreak', 'walletConnected',
                'walletAddress', 'tasks', 'goals', 'habits'
            ];
            
            localStorageKeys.forEach(key => {
                const value = localStorage.getItem(key);
                if (!value && ['userXP', 'userLevel'].includes(key)) {
                    issues.push({
                        type: 'MISSING_DATA',
                        message: `No ${key} in localStorage`,
                        details: 'User data may not persist',
                        fix: 'Initialize default values on app start'
                    });
                }
            });
            
            // Check API endpoints
            if (typeof API_BASE === 'undefined') {
                issues.push({
                    type: 'MISSING_CONFIG',
                    message: 'API_BASE not defined',
                    details: 'API calls will fail',
                    fix: 'Define API_BASE constant'
                });
            }
            
            return issues;
        },

        checkCSSConflicts: function() {
            const issues = [];
            console.log('\n🎨 Checking CSS conflicts...');
            
            // Check for conflicting display rules
            const styles = Array.from(document.styleSheets);
            let dashboardHideRules = 0;
            let importantRules = 0;
            
            styles.forEach(sheet => {
                try {
                    const rules = Array.from(sheet.cssRules || []);
                    rules.forEach(rule => {
                        if (rule.selectorText?.includes('#dashboardView')) {
                            if (rule.style.display === 'none') dashboardHideRules++;
                            if (rule.cssText.includes('!important')) importantRules++;
                        }
                    });
                } catch (e) {
                    // Cross-origin stylesheets
                }
            });
            
            console.log(`Found ${dashboardHideRules} dashboard hide rules, ${importantRules} with !important`);
            
            // Check z-index stacking
            const elements = document.querySelectorAll('[style*="z-index"]');
            const highZIndex = Array.from(elements).filter(el => {
                const z = parseInt(getComputedStyle(el).zIndex);
                return z > 1000;
            });
            
            if (highZIndex.length > 5) {
                issues.push({
                    type: 'Z_INDEX_CHAOS',
                    message: `${highZIndex.length} elements have very high z-index`,
                    details: 'May cause stacking issues',
                    fix: 'Use consistent z-index scale'
                });
            }
            
            return issues;
        },

        checkInitializationTiming: function() {
            const issues = [];
            console.log('\n⏱️ Checking initialization timing...');
            
            // Check if DOM is ready when scripts run
            if (document.readyState === 'loading') {
                issues.push({
                    type: 'TIMING_ISSUE',
                    message: 'Scripts running before DOM ready',
                    fix: 'Wrap initialization in DOMContentLoaded'
                });
            }
            
            // Check for race conditions
            const initFunctions = [
                'initializeApp',
                'setupAuth',
                'loadUserData',
                'initializeUI'
            ];
            
            initFunctions.forEach(func => {
                if (typeof window[func] === 'function') {
                    const funcStr = window[func].toString();
                    if (!funcStr.includes('DOMContentLoaded') && !funcStr.includes('setTimeout')) {
                        issues.push({
                            type: 'RACE_CONDITION',
                            message: `${func} may run too early`,
                            fix: 'Add timing checks or delays'
                        });
                    }
                }
            });
            
            return issues;
        },

        // Auto-fix function
        autoFix: function() {
            console.log('\n🔧 Attempting auto-fixes...');
            
            // Fix 1: Add modal container if missing
            if (!document.getElementById('modalContainer')) {
                const container = document.createElement('div');
                container.id = 'modalContainer';
                container.style.cssText = 'position: relative; z-index: 1000;';
                document.querySelector('.app-container')?.appendChild(container);
                console.log('✅ Added modalContainer');
            }
            
            // Fix 2: Initialize missing localStorage
            if (!localStorage.getItem('userXP')) {
                localStorage.setItem('userXP', '0');
                localStorage.setItem('userLevel', '1');
                localStorage.setItem('userStreak', '0');
                console.log('✅ Initialized user data');
            }
            
            // Fix 3: Wire up navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                if (!item.onclick && !item.hasAttribute('onclick')) {
                    const view = item.getAttribute('data-view');
                    if (view) {
                        item.onclick = () => window.navigate(view);
                        console.log(`✅ Wired navigation for ${view}`);
                    }
                }
            });
            
            // Fix 4: Set initial view state
            const currentView = document.body.getAttribute('data-current-view');
            if (!currentView) {
                document.body.setAttribute('data-current-view', 'dashboard');
                console.log('✅ Set initial view state');
            }
            
            console.log('🔧 Auto-fixes complete');
        }
    };

    // Auto-run scan after delay
    setTimeout(() => {
        console.log('🚀 Running automatic integration scan...');
        const issues = window.deepIntegrationScan.runFullScan();
        
        if (issues.length > 0) {
            console.log('\n💡 Run deepIntegrationScan.autoFix() to attempt fixes');
        }
    }, 2000);
})();
