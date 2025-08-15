// Structural Integration Fix - Ensures proper routing and structure
(function() {
    'use strict';

    console.log('🏗️ Structural Integration Fix initializing...');

    // Fix 1: Ensure proper view creation functions exist
    function ensureViewCreators() {
        // Map of views to their creation functions
        const viewCreators = {
            social: 'createSocialHubView',
            wallet: 'createWalletInterfaceView',
            goals: 'createGoalsView',
            habits: 'createHabitsView',
            analytics: 'createAnalyticsView',
            burn: 'createBurnView',
            community: 'createCommunityView',
            leaderboard: 'createLeaderboardView',
            achievements: 'createAchievementsView',
            settings: 'createSettingsView'
        };

        // Check each creator exists
        Object.entries(viewCreators).forEach(([view, creator]) => {
            if (typeof window[creator] !== 'function') {
                console.warn(`⚠️ Missing ${creator} for ${view} view`);
                
                // Create a placeholder
                window[creator] = function() {
                    return `
                        <div style="padding: 2rem; text-align: center;">
                            <h2 style="color: var(--text-primary); font-size: 2rem; margin-bottom: 1rem;">
                                ${view.charAt(0).toUpperCase() + view.slice(1)} View
                            </h2>
                            <p style="color: var(--text-secondary);">
                                This view is being constructed...
                            </p>
                        </div>
                    `;
                };
                console.log(`✅ Created placeholder for ${creator}`);
            }
        });
    }

    // Fix 2: Patch loadViewContent to handle all cases
    function patchLoadViewContent() {
        const original = window.loadViewContent;
        
        window.loadViewContent = function(view) {
            console.log(`🔄 Patched loadViewContent: ${view}`);
            
            // Ensure body attribute is set
            document.body.setAttribute('data-current-view', view);
            
            // Call original if exists
            if (typeof original === 'function') {
                try {
                    original.call(this, view);
                } catch (e) {
                    console.error('Error in original loadViewContent:', e);
                }
            }
            
            // Ensure view container exists
            setTimeout(() => {
                let viewContainer = document.getElementById(`${view}View`);
                
                if (!viewContainer && view !== 'dashboard') {
                    console.log(`📦 Creating missing ${view} view container`);
                    
                    // Get creator function
                    const creatorName = `create${view.charAt(0).toUpperCase() + view.slice(1)}View`;
                    const creator = window[creatorName];
                    
                    if (typeof creator === 'function') {
                        // Create container
                        viewContainer = document.createElement('div');
                        viewContainer.id = `${view}View`;
                        viewContainer.className = 'view-container';
                        
                        try {
                            viewContainer.innerHTML = creator();
                        } catch (e) {
                            console.error(`Error creating ${view} view:`, e);
                            viewContainer.innerHTML = `<div style="padding: 2rem;">Error loading ${view}</div>`;
                        }
                        
                        // Add to main content
                        const mainContent = document.getElementById('mainContent');
                        if (mainContent) {
                            mainContent.appendChild(viewContainer);
                            console.log(`✅ Added ${view} view to DOM`);
                        }
                    }
                }
                
                // Ensure proper visibility
                document.querySelectorAll('.view-container').forEach(v => {
                    v.classList.remove('active');
                    v.style.display = 'none';
                });
                
                if (viewContainer) {
                    viewContainer.classList.add('active');
                    viewContainer.style.display = 'block';
                }
            }, 50);
        };
    }

    // Fix 3: Ensure navigation works
    function fixNavigation() {
        // Add click handlers to all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            const view = item.getAttribute('data-view');
            if (view && !item.onclick) {
                item.style.cursor = 'pointer';
                item.onclick = function(e) {
                    e.preventDefault();
                    console.log(`🖱️ Nav clicked: ${view}`);
                    window.navigate(view);
                };
            }
        });

        // Fix header buttons
        const headerButtons = {
            'social-btn': 'social',
            'wallet-btn': 'wallet',
            'settings-btn': 'settings'
        };

        Object.entries(headerButtons).forEach(([id, view]) => {
            const btn = document.getElementById(id);
            if (btn && !btn.onclick) {
                btn.onclick = () => window.navigate(view);
                console.log(`✅ Wired ${id} to ${view}`);
            }
        });
    }

    // Fix 4: Create modal container
    function ensureModalContainer() {
        if (!document.getElementById('modalContainer')) {
            const container = document.createElement('div');
            container.id = 'modalContainer';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            `;
            
            const appContainer = document.querySelector('.app-container') || document.body;
            appContainer.appendChild(container);
            console.log('✅ Created modalContainer');
        }
    }

    // Fix 5: Initialize data
    function initializeData() {
        const defaults = {
            'userXP': '0',
            'userLevel': '1',
            'userStreak': '0',
            'userPoints': '0',
            'tasks': '[]',
            'goals': '[]',
            'habits': '[]'
        };

        Object.entries(defaults).forEach(([key, value]) => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, value);
                console.log(`✅ Initialized ${key}`);
            }
        });
    }

    // Fix 6: Route cleanup
    function cleanupRouting() {
        // Remove duplicate event listeners
        const seen = new Set();
        document.querySelectorAll('[onclick]').forEach(el => {
            const onclick = el.getAttribute('onclick');
            const key = `${el.tagName}-${onclick}`;
            
            if (seen.has(key)) {
                el.removeAttribute('onclick');
                console.log(`🧹 Removed duplicate onclick from ${el.tagName}`);
            } else {
                seen.add(key);
            }
        });
    }

    // Fix 7: Ensure CSS consistency
    function fixCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Ensure view containers behave properly */
            .view-container {
                display: none !important;
                width: 100%;
                height: 100%;
                overflow-y: auto;
            }
            
            .view-container.active {
                display: block !important;
            }
            
            /* Fix modal container */
            #modalContainer > * {
                pointer-events: auto;
            }
            
            /* Ensure navigation is clickable */
            .nav-item {
                cursor: pointer;
                user-select: none;
            }
            
            .nav-item:hover {
                background: rgba(255,255,255,0.05);
            }
            
            /* Fix button states */
            button:not(:disabled) {
                cursor: pointer;
            }
            
            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Added structural CSS fixes');
    }

    // Main initialization
    function initialize() {
        console.log('🚀 Applying structural fixes...');
        
        // Apply all fixes
        ensureViewCreators();
        patchLoadViewContent();
        ensureModalContainer();
        initializeData();
        fixCSS();
        
        // Delay-dependent fixes
        setTimeout(() => {
            fixNavigation();
            cleanupRouting();
            
            // Set initial state
            const currentView = document.querySelector('.nav-item.active')?.getAttribute('data-view') || 'dashboard';
            document.body.setAttribute('data-current-view', currentView);
            
            console.log('✅ Structural integration fixes complete');
        }, 100);
    }

    // Run when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 0);
    }

    // Export utilities
    window.structuralFix = {
        reapplyFixes: initialize,
        checkView: (view) => document.getElementById(`${view}View`),
        getActiveView: () => document.body.getAttribute('data-current-view')
    };
})();
