// Dashboard Content Filter - Nuclear option to prevent any dashboard content in other views
(function() {
    'use strict';

    console.log('🛡️ Dashboard Content Filter initializing...');

    // Dashboard-specific content patterns
    const dashboardPatterns = {
        text: [
            'Welcome Back!',
            "Today's Progress",
            'Active Challenges',
            'AI Insights',
            'Top Performers',
            'Redeem Points',
            'Pending Redemptions',
            'Wallet & Burn Feed',
            'Daily Progress',
            'Focus Time',
            'Tasks Complete',
            'Quick add task',
            'Daily Focus Goal',
            'Alex Champion',
            'Sarah Master',
            'Mike Pro'
        ],
        ids: [
            'dashboardView',
            'focusTime',
            'tasksComplete',
            'focusProgress',
            'tasksProgress',
            'newTaskInput',
            'todayTasksList',
            'challengesList',
            'personalityInsights',
            'adaptiveSuggestions',
            'leaderboardPreview',
            'redemptionsList',
            'walletAddressText',
            'burnFeedBody'
        ],
        classes: [
            'dashboard-grid',
            'dashboard-card',
            'daily-progress',
            'challenge-item',
            'leaderboard-entry',
            'redemption-item'
        ]
    };

    // Filter function to check if element is dashboard content
    function isDashboardContent(element) {
        if (!element || element.nodeType !== 1) return false;

        // Check ID
        if (element.id && dashboardPatterns.ids.some(id => element.id.includes(id))) {
            return true;
        }

        // Check classes
        const classList = element.className || '';
        if (dashboardPatterns.classes.some(cls => classList.includes(cls))) {
            return true;
        }

        // Check text content
        const text = element.textContent || '';
        if (dashboardPatterns.text.some(pattern => text.includes(pattern))) {
            return true;
        }

        // Check data attributes
        if (element.hasAttribute('data-dashboard') || 
            element.hasAttribute('data-view-origin') && 
            element.getAttribute('data-view-origin') === 'dashboard') {
            return true;
        }

        return false;
    }

    // Deep clean a view of dashboard content
    function deepCleanView(viewId) {
        const view = document.getElementById(`${viewId}View`);
        if (!view || viewId === 'dashboard') return;

        console.log(`🧹 Deep cleaning ${viewId} view...`);

        // Get all elements in the view
        const allElements = view.querySelectorAll('*');
        const toRemove = [];

        allElements.forEach(el => {
            if (isDashboardContent(el)) {
                toRemove.push(el);
            }
        });

        // Remove dashboard content
        toRemove.forEach(el => {
            console.warn(`🗑️ Removing dashboard content from ${viewId}:`, el);
            el.remove();
        });

        // Also check for specific card structures
        view.querySelectorAll('.card').forEach(card => {
            const title = card.querySelector('.card-title')?.textContent || '';
            if (dashboardPatterns.text.some(pattern => title.includes(pattern))) {
                console.warn(`🗑️ Removing dashboard card from ${viewId}:`, title);
                card.remove();
            }
        });
    }

    // Monitor and filter mutations
    function setupContentFilter() {
        const observer = new MutationObserver((mutations) => {
            const currentView = document.body.getAttribute('data-current-view');
            if (!currentView || currentView === 'dashboard') return;

            mutations.forEach(mutation => {
                // Check added nodes
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && isDashboardContent(node)) {
                        console.warn('🚨 Dashboard content detected in', currentView, ':', node);
                        node.remove();
                        return;
                    }

                    // Check children of added nodes
                    if (node.nodeType === 1 && node.querySelectorAll) {
                        node.querySelectorAll('*').forEach(child => {
                            if (isDashboardContent(child)) {
                                console.warn('🚨 Dashboard content in child:', child);
                                child.remove();
                            }
                        });
                    }
                });

                // Check for text changes that might indicate dashboard content
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    const target = mutation.target;
                    if (target.nodeType === 3) { // Text node
                        const parent = target.parentElement;
                        if (parent && dashboardPatterns.text.some(pattern => 
                            target.textContent.includes(pattern))) {
                            console.warn('🚨 Dashboard text detected:', target.textContent);
                            const card = parent.closest('.card');
                            if (card) card.remove();
                        }
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Override innerHTML to filter dashboard content
    function overrideInnerHTML() {
        const originalDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(html) {
                const currentView = document.body.getAttribute('data-current-view');
                
                // If setting content in a non-dashboard view
                if (currentView && currentView !== 'dashboard' && 
                    this.closest('.view-container') && 
                    !this.closest('#dashboardView')) {
                    
                    // Check if HTML contains dashboard patterns
                    const containsDashboard = dashboardPatterns.text.some(pattern => 
                        html.includes(pattern));
                    
                    if (containsDashboard) {
                        console.warn('🚨 Blocking dashboard HTML in', currentView);
                        
                        // Create temporary element to parse and filter
                        const temp = document.createElement('div');
                        originalDescriptor.set.call(temp, html);
                        
                        // Remove dashboard content
                        temp.querySelectorAll('*').forEach(el => {
                            if (isDashboardContent(el)) {
                                el.remove();
                            }
                        });
                        
                        // Set filtered content
                        originalDescriptor.set.call(this, temp.innerHTML);
                        return;
                    }
                }
                
                // Normal set
                originalDescriptor.set.call(this, html);
            },
            get: originalDescriptor.get,
            enumerable: originalDescriptor.enumerable,
            configurable: originalDescriptor.configurable
        });
    }

    // Aggressive CSS to hide dashboard content
    function injectFilterCSS() {
        const styleId = 'dashboard-filter-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        
        // Generate CSS selectors for all dashboard text patterns
        const textSelectors = dashboardPatterns.text.map(text => 
            `body:not([data-current-view="dashboard"]) .card:has(.card-title:contains("${text}"))`
        ).join(',\n');

        styles.textContent = `
            /* Hide dashboard content by text */
            ${textSelectors} {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
            }
            
            /* Hide dashboard IDs */
            ${dashboardPatterns.ids.map(id => 
                `body:not([data-current-view="dashboard"]) #${id}`
            ).join(',\n')} {
                display: none !important;
            }
            
            /* Hide dashboard classes */
            ${dashboardPatterns.classes.map(cls => 
                `body:not([data-current-view="dashboard"]) .${cls}`
            ).join(',\n')} {
                display: none !important;
            }
            
            /* Mark dashboard content */
            #dashboardView * {
                --origin-view: dashboard;
            }
        `;
        
        document.head.appendChild(styles);
    }

    // Initialize
    function initialize() {
        console.log('🚀 Initializing dashboard content filter...');

        // Inject CSS
        injectFilterCSS();

        // Override innerHTML
        overrideInnerHTML();

        // Setup monitoring
        setupContentFilter();

        // Initial cleanup
        setTimeout(() => {
            const currentView = document.body.getAttribute('data-current-view');
            if (currentView && currentView !== 'dashboard') {
                deepCleanView(currentView);
            }
        }, 500);

        // Periodic cleanup
        setInterval(() => {
            const currentView = document.body.getAttribute('data-current-view');
            if (currentView && currentView !== 'dashboard') {
                deepCleanView(currentView);
            }
        }, 3000);

        console.log('✅ Dashboard content filter ready');
    }

    // Run when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 0);
    }

    // Export for debugging
    window.dashboardFilter = {
        isDashboardContent,
        deepCleanView,
        patterns: dashboardPatterns
    };
})();
