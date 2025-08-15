// Dashboard Diagnostic Tool
(function() {
    'use strict';

    console.log('🔍 Dashboard Diagnostic Tool loaded');

    window.dashboardDiagnostic = {
        // Check what's visible
        checkVisibility: function() {
            console.log('=== VISIBILITY CHECK ===');
            
            const dashboard = document.getElementById('dashboardView');
            if (!dashboard) {
                console.log('❌ Dashboard not found in DOM');
                return;
            }

            console.log('Dashboard element:', dashboard);
            console.log('Dashboard display:', getComputedStyle(dashboard).display);
            console.log('Dashboard visibility:', getComputedStyle(dashboard).visibility);
            console.log('Dashboard opacity:', getComputedStyle(dashboard).opacity);
            console.log('Dashboard position:', getComputedStyle(dashboard).position);
            console.log('Dashboard left:', getComputedStyle(dashboard).left);
            console.log('Dashboard offsetParent:', dashboard.offsetParent);
            console.log('Dashboard getBoundingClientRect:', dashboard.getBoundingClientRect());
            console.log('Dashboard classList:', dashboard.classList.toString());
            console.log('Dashboard inline style:', dashboard.getAttribute('style'));

            // Check cards
            const cards = dashboard.querySelectorAll('.card');
            console.log(`\nFound ${cards.length} cards:`);
            cards.forEach((card, i) => {
                if (card.offsetParent !== null) {
                    console.log(`Card ${i} is VISIBLE!`);
                    console.log('  - Inline style:', card.getAttribute('style'));
                    console.log('  - Computed display:', getComputedStyle(card).display);
                    console.log('  - BoundingRect:', card.getBoundingClientRect());
                }
            });

            // Check active view
            const activeView = document.querySelector('.view-container.active');
            console.log('\nActive view:', activeView?.id || 'none');
            
            // Check body attribute
            console.log('Body data-current-view:', document.body.getAttribute('data-current-view'));
            
            // Check nav
            const activeNav = document.querySelector('.nav-item.active');
            console.log('Active nav:', activeNav?.getAttribute('data-view') || 'none');
        },

        // Find all dashboard elements
        findAllDashboardElements: function() {
            console.log('=== FINDING ALL DASHBOARD ELEMENTS ===');
            
            const elements = [];
            
            // Direct dashboard
            const dashboard = document.getElementById('dashboardView');
            if (dashboard) elements.push(dashboard);
            
            // Dashboard grid
            document.querySelectorAll('.dashboard-grid').forEach(el => elements.push(el));
            
            // Cards that might be from dashboard
            document.querySelectorAll('.card').forEach(card => {
                if (!card.closest('.view-container') || card.closest('#dashboardView')) {
                    elements.push(card);
                }
            });
            
            console.log(`Found ${elements.length} dashboard-related elements`);
            elements.forEach((el, i) => {
                console.log(`${i}:`, el.tagName, el.className, el.id || '(no id)');
                if (el.offsetParent !== null) {
                    console.log('  ⚠️ VISIBLE!');
                }
            });
            
            return elements;
        },

        // Force hide everything
        forceHideAll: function() {
            console.log('=== FORCE HIDING ALL DASHBOARD ELEMENTS ===');
            
            const elements = this.findAllDashboardElements();
            elements.forEach(el => {
                // Remove all inline styles
                el.removeAttribute('style');
                
                // Apply nuclear hiding
                el.style.cssText = `
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    position: fixed !important;
                    left: -999999px !important;
                    top: -999999px !important;
                    width: 0 !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    pointer-events: none !important;
                    z-index: -99999 !important;
                    transform: scale(0) translateX(-9999px) translateY(-9999px) !important;
                `;
            });
            
            console.log('✅ Applied nuclear hiding to all elements');
        },

        // Check what's applying styles
        monitorStyleChanges: function() {
            console.log('=== MONITORING STYLE CHANGES ===');
            
            const dashboard = document.getElementById('dashboardView');
            if (!dashboard) {
                console.log('❌ Dashboard not found');
                return;
            }

            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        console.log('🚨 Style changed on:', mutation.target);
                        console.log('  New style:', mutation.target.getAttribute('style'));
                        console.log('  Stack trace:', new Error().stack);
                    }
                });
            });

            observer.observe(dashboard, {
                attributes: true,
                attributeFilter: ['style'],
                subtree: true
            });

            console.log('✅ Now monitoring style changes...');
        },

        // Try different hiding methods
        testHidingMethods: function() {
            console.log('=== TESTING HIDING METHODS ===');
            
            const dashboard = document.getElementById('dashboardView');
            if (!dashboard) return;

            const methods = [
                {
                    name: 'Display none',
                    apply: () => dashboard.style.display = 'none'
                },
                {
                    name: 'Remove from DOM',
                    apply: () => dashboard.remove()
                },
                {
                    name: 'Move off screen',
                    apply: () => {
                        dashboard.style.position = 'fixed';
                        dashboard.style.left = '-9999px';
                        dashboard.style.top = '-9999px';
                    }
                },
                {
                    name: 'Zero dimensions',
                    apply: () => {
                        dashboard.style.width = '0';
                        dashboard.style.height = '0';
                        dashboard.style.overflow = 'hidden';
                    }
                },
                {
                    name: 'Visibility collapse',
                    apply: () => {
                        dashboard.style.visibility = 'collapse';
                        dashboard.style.position = 'absolute';
                    }
                }
            ];

            methods.forEach((method, i) => {
                setTimeout(() => {
                    console.log(`\nTesting: ${method.name}`);
                    method.apply();
                    
                    setTimeout(() => {
                        const visible = dashboard.offsetParent !== null;
                        console.log(`Result: ${visible ? '❌ Still visible' : '✅ Hidden'}`);
                    }, 100);
                }, i * 1000);
            });
        }
    };

    // Auto-run diagnostic on load
    setTimeout(() => {
        console.log('🚀 Running initial diagnostic...');
        window.dashboardDiagnostic.checkVisibility();
    }, 1000);
})();
