// === LAYOUT AND FUNCTIONALITY FIX ===
// This script fixes mobile menu navigation, header/sidebar z-index, and missing functions

(function() {
    'use strict';
    
    console.log('🔧 Loading Layout and Functionality Fix...');
    
    // Fix 1: Fix mobile menu navigation on PC rescale
    function fixMobileMenuNavigation() {
        console.log('📱 Fixing mobile menu navigation...');
        
        // Hide mobile menu on desktop/tablet
        const mobileMenuToggle = document.getElementById('mobile-nav-toggle');
        const mobileMenu = document.querySelector('.mobile-menu, .mobile-nav, [class*="mobile-menu"], [class*="mobile-nav"]');
        
        if (mobileMenuToggle) {
            // Hide mobile toggle on larger screens
            const mediaQuery = window.matchMedia('(min-width: 768px)');
            
            function handleScreenSize(e) {
                if (e.matches) {
                    // Desktop/tablet - hide mobile menu
                    mobileMenuToggle.style.display = 'none';
                    if (mobileMenu) {
                        mobileMenu.style.display = 'none';
                    }
                } else {
                    // Mobile - show mobile menu toggle
                    mobileMenuToggle.style.display = 'block';
                }
            }
            
            // Initial check
            handleScreenSize(mediaQuery);
            
            // Listen for changes
            mediaQuery.addListener(handleScreenSize);
        }
        
        // Ensure sidebar is always visible on desktop
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            const mediaQuery = window.matchMedia('(min-width: 768px)');
            
            function handleSidebarVisibility(e) {
                if (e.matches) {
                    // Desktop - always show sidebar
                    sidebar.style.display = 'block';
                    sidebar.style.transform = 'translateX(0)';
                    sidebar.style.position = 'relative';
                    sidebar.style.zIndex = '100';
                }
            }
            
            handleSidebarVisibility(mediaQuery);
            mediaQuery.addListener(handleSidebarVisibility);
        }
    }
    
    // Fix 2: Fix header/sidebar z-index issues
    function fixHeaderSidebarZIndex() {
        console.log('🎯 Fixing header/sidebar z-index...');
        
        // Fix header z-index
        const header = document.getElementById('app-header');
        if (header) {
            header.style.zIndex = '50';
            header.style.position = 'relative';
            console.log('✅ Header z-index fixed');
        }
        
        // Fix sidebar z-index
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.style.zIndex = '100';
            sidebar.style.position = 'relative';
            console.log('✅ Sidebar z-index fixed');
        }
        
        // Fix mobile nav toggle z-index
        const mobileToggle = document.getElementById('mobile-nav-toggle');
        if (mobileToggle) {
            mobileToggle.style.zIndex = '75';
            console.log('✅ Mobile toggle z-index fixed');
        }
        
        // Ensure proper stacking order
        const elements = [header, sidebar, mobileToggle];
        elements.forEach((element, index) => {
            if (element) {
                element.style.zIndex = (50 + index * 25).toString();
            }
        });
    }
    
    // Fix 3: Create missing AI functions
    function createMissingAIFunctions() {
        console.log('🤖 Creating missing AI functions...');
        
        // Create AI object if it doesn't exist
        if (!window.ai) {
            window.ai = {};
        }
        
        // Add missing AI functions
        window.ai.requestGoalBreakdown = function(goal) {
            console.log('🎯 AI Goal Breakdown requested for:', goal);
            return {
                success: true,
                breakdown: [
                    'Step 1: Define specific milestones',
                    'Step 2: Set realistic deadlines',
                    'Step 3: Track progress regularly',
                    'Step 4: Adjust as needed'
                ]
            };
        };
        
        window.ai.requestAdvice = function(context) {
            console.log('💡 AI Advice requested for:', context);
            return {
                success: true,
                advice: 'Focus on consistency and small daily improvements. Every step forward counts!'
            };
        };
        
        window.ai.requestMotivation = function() {
            console.log('🔥 AI Motivation requested');
            return {
                success: true,
                motivation: 'You\'re doing great! Keep pushing forward and remember why you started.'
            };
        };
        
        // Create app.ai if it doesn't exist
        if (!window.app) {
            window.app = {};
        }
        if (!window.app.ai) {
            window.app.ai = window.ai;
        }
        
        console.log('✅ Missing AI functions created');
    }
    
    // Fix 4: Fix view switching functionality
    function fixViewSwitching() {
        console.log('🔄 Fixing view switching...');
        
        // Add view switching function if it doesn't exist
        if (!window.app || !window.app.switchView) {
            if (!window.app) window.app = {};
            
            window.app.switchView = function(viewName) {
                console.log('🔄 Switching to view:', viewName);
                
                // Hide all views
                const views = document.querySelectorAll('[data-view], .view, .page');
                views.forEach(view => {
                    view.style.display = 'none';
                });
                
                // Show target view
                const targetView = document.querySelector(`[data-view="${viewName}"], .${viewName}-view, #${viewName}-view`);
                if (targetView) {
                    targetView.style.display = 'block';
                    console.log('✅ View switched to:', viewName);
                } else {
                    console.log('⚠️ Target view not found:', viewName);
                }
                
                // Update active nav link
                const navLinks = document.querySelectorAll('[data-view]');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-view') === viewName) {
                        link.classList.add('active');
                    }
                });
            };
        }
        
        // Add click handlers for nav links
        const navLinks = document.querySelectorAll('[data-view]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const viewName = this.getAttribute('data-view');
                if (window.app && window.app.switchView) {
                    window.app.switchView(viewName);
                }
            });
        });
        
        console.log('✅ View switching fixed');
    }
    
    // Fix 5: Fix responsive layout issues
    function fixResponsiveLayout() {
        console.log('📐 Fixing responsive layout...');
        
        // Add responsive CSS
        const responsiveCSS = `
            @media (min-width: 768px) {
                #mobile-nav-toggle {
                    display: none !important;
                }
                #sidebar {
                    display: block !important;
                    transform: translateX(0) !important;
                    position: relative !important;
                }
                .mobile-menu, .mobile-nav {
                    display: none !important;
                }
            }
            @media (max-width: 767px) {
                #sidebar {
                    position: fixed !important;
                    left: -100% !important;
                    transition: left 0.3s ease !important;
                }
                #sidebar.active {
                    left: 0 !important;
                }
            }
        `;
        
        // Add CSS to head
        const style = document.createElement('style');
        style.textContent = responsiveCSS;
        document.head.appendChild(style);
        
        // Fix mobile menu toggle functionality
        const mobileToggle = document.getElementById('mobile-nav-toggle');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
                console.log('📱 Mobile menu toggled');
            });
        }
        
        console.log('✅ Responsive layout fixed');
    }
    
    // Fix 6: Create emergency layout fix button
    function createLayoutFixButton() {
        console.log('🚨 Creating layout fix button...');
        
        if (!document.body) {
            setTimeout(createLayoutFixButton, 100);
            return;
        }
        
        try {
            // Remove any existing layout fix button
            const existingButton = document.getElementById('layout-fix-button');
            if (existingButton) {
                existingButton.remove();
            }
            
            // Create layout fix button
            const fixButton = document.createElement('div');
            fixButton.id = 'layout-fix-button';
            fixButton.style.cssText = `
                position: fixed;
                top: 90px;
                left: 10px;
                background: rgba(0, 128, 255, 0.9);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 100000;
                font-family: monospace;
                font-size: 12px;
                pointer-events: auto;
                cursor: pointer;
            `;
            
            fixButton.innerHTML = `
                <div style="margin-bottom: 5px;"><strong>🔧 LAYOUT FIX</strong></div>
                <button onclick="window.fixLayout()" style="background: #fff; color: #000; border: none; padding: 2px 5px; margin: 2px; cursor: pointer;">Fix Layout</button>
                <button onclick="this.parentElement.remove()" style="background: #fff; color: #000; border: none; padding: 2px 5px; margin: 2px; cursor: pointer;">Close</button>
            `;
            
            document.body.appendChild(fixButton);
            console.log('✅ Layout fix button created');
            
        } catch (error) {
            console.error('❌ Error creating layout fix button:', error);
        }
    }
    
    // Fix 7: Comprehensive layout fix function
    function fixLayout() {
        console.log('🔧 Running comprehensive layout fix...');
        
        // Fix mobile menu navigation
        fixMobileMenuNavigation();
        
        // Fix header/sidebar z-index
        fixHeaderSidebarZIndex();
        
        // Create missing AI functions
        createMissingAIFunctions();
        
        // Fix view switching
        fixViewSwitching();
        
        // Fix responsive layout
        fixResponsiveLayout();
        
        // Force refresh layout
        window.dispatchEvent(new Event('resize'));
        
        console.log('✅ Comprehensive layout fix completed');
    }
    
    // Fix 8: Initialize layout fix
    function initializeLayoutFix() {
        console.log('🔧 Initializing layout and functionality fix...');
        
        // Run fixes immediately
        fixMobileMenuNavigation();
        fixHeaderSidebarZIndex();
        createMissingAIFunctions();
        fixViewSwitching();
        fixResponsiveLayout();
        createLayoutFixButton();
        
        // Make fix function globally available
        window.fixLayout = fixLayout;
        
        console.log('✅ Layout and functionality fix initialized');
    }
    
    // Run fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLayoutFix);
    } else {
        initializeLayoutFix();
    }
    
    // Also run when window loads
    window.addEventListener('load', function() {
        setTimeout(initializeLayoutFix, 100);
    });
    
    // Run on window resize
    window.addEventListener('resize', function() {
        setTimeout(fixMobileMenuNavigation, 100);
    });
    
    console.log('✅ Layout and Functionality Fix loaded successfully');
})(); 