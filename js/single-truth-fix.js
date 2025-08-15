// Single Truth Fix - One solution to rule them all
(function() {
    'use strict';

    console.log('🎯 Single Truth Fix - Cleaning up the mess...');

    // STEP 1: Remove ALL duplicate script overrides
    function cleanupDuplicateOverrides() {
        // Reset navigate to a single implementation
        delete window.navigate;
        delete window.loadViewContent;
        
        console.log('🧹 Cleared all overrides');
    }

    // STEP 2: Fix the structural problem - Dashboard should NOT be hardcoded
    function restructureViews() {
        console.log('🏗️ Restructuring views...');
        
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        // Save dashboard HTML
        const dashboardView = document.getElementById('dashboardView');
        let dashboardHTML = '';
        if (dashboardView) {
            dashboardHTML = dashboardView.innerHTML;
            // Remove the hardcoded dashboard
            dashboardView.remove();
            console.log('✅ Removed hardcoded dashboard');
        }

        // Create a proper view container system
        mainContent.innerHTML = '';
        
        // Create views wrapper
        const viewsWrapper = document.createElement('div');
        viewsWrapper.id = 'viewsWrapper';
        viewsWrapper.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        `;
        mainContent.appendChild(viewsWrapper);

        // Create dashboard view properly
        const newDashboard = document.createElement('div');
        newDashboard.id = 'dashboardView';
        newDashboard.className = 'view-container';
        newDashboard.innerHTML = dashboardHTML;
        newDashboard.style.display = 'none';
        viewsWrapper.appendChild(newDashboard);

        console.log('✅ Created proper view structure');
    }

    // STEP 3: Single navigation function
    window.navigate = function(view) {
        console.log(`🔄 Navigating to: ${view}`);

        const viewsWrapper = document.getElementById('viewsWrapper');
        if (!viewsWrapper) {
            console.error('Views wrapper not found!');
            return;
        }

        // Hide ALL views
        viewsWrapper.querySelectorAll('.view-container').forEach(v => {
            v.style.display = 'none';
            v.classList.remove('active');
        });

        // Get or create the target view
        let targetView = document.getElementById(`${view}View`);
        
        if (!targetView) {
            console.log(`📦 Creating ${view} view...`);
            targetView = document.createElement('div');
            targetView.id = `${view}View`;
            targetView.className = 'view-container';
            
            // Get content for the view
            const content = getViewContent(view);
            targetView.innerHTML = content;
            
            viewsWrapper.appendChild(targetView);
        }

        // Show ONLY the target view
        targetView.style.display = 'block';
        targetView.classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-view') === view);
        });

        // Update body attribute
        document.body.setAttribute('data-current-view', view);

        console.log(`✅ Showing ${view} view`);
    };

    // STEP 4: Get view content
    function getViewContent(view) {
        // Check if creator function exists
        const creatorName = `create${view.charAt(0).toUpperCase() + view.slice(1)}View`;
        
        if (typeof window[creatorName] === 'function') {
            try {
                return window[creatorName]();
            } catch (e) {
                console.error(`Error creating ${view}:`, e);
            }
        }

        // Fallback content
        return `
            <div style="padding: 2rem; text-align: center;">
                <h2 style="color: var(--text-primary); font-size: 2rem;">
                    ${view.charAt(0).toUpperCase() + view.slice(1)}
                </h2>
                <p style="color: var(--text-secondary); margin-top: 1rem;">
                    This view is being loaded...
                </p>
            </div>
        `;
    }

    // STEP 5: loadViewContent just calls navigate
    window.loadViewContent = function(view) {
        window.navigate(view);
    };

    // STEP 6: Clean CSS
    function injectCleanCSS() {
        // Remove all previous isolation styles
        document.querySelectorAll('[id*="isolation"], [id*="fix-styles"], [id*="override"]').forEach(el => {
            el.remove();
        });

        const style = document.createElement('style');
        style.id = 'single-truth-styles';
        style.textContent = `
            /* Simple, clean view management */
            #viewsWrapper {
                width: 100%;
                height: 100%;
                position: relative;
            }
            
            .view-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow-y: auto;
                display: none;
            }
            
            .view-container.active {
                display: block !important;
            }
            
            /* Ensure dashboard cards stay in dashboard */
            #dashboardView .card {
                position: relative;
            }
            
            /* Modal management */
            .modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1050;
                display: none;
            }
            
            .modal.show {
                display: block;
            }
        `;
        document.head.appendChild(style);
        
        console.log('✅ Applied clean CSS');
    }

    // STEP 7: Initialize
    function initialize() {
        console.log('🚀 Initializing Single Truth Fix...');

        // Clean up the mess
        cleanupDuplicateOverrides();
        
        // Fix structure
        setTimeout(() => {
            restructureViews();
            injectCleanCSS();
            
            // Set initial view
            const currentNav = document.querySelector('.nav-item.active');
            const initialView = currentNav?.getAttribute('data-view') || 'dashboard';
            window.navigate(initialView);
            
            // Wire up navigation clicks
            document.querySelectorAll('.nav-item').forEach(item => {
                const view = item.getAttribute('data-view');
                if (view) {
                    item.onclick = () => window.navigate(view);
                }
            });
            
            console.log('✅ Single Truth Fix complete!');
        }, 100);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 500);
    }

    // Export for debugging
    window.singleTruth = {
        restructure: restructureViews,
        navigate: (view) => window.navigate(view),
        cleanup: cleanupDuplicateOverrides
    };
})();
