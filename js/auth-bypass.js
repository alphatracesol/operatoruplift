// Auth Bypass for Testing
// Ensures the app is visible for testing all 20 systems

(function() {
    'use strict';
    
    console.log('🔓 Auth Bypass Active');
    
    // Enable demo mode
    sessionStorage.setItem('demoMode', 'true');
    localStorage.setItem('isAuthenticated', 'true');
    
    // Wait for DOM
    function showApp() {
        const authScreen = document.getElementById('authScreen');
        const loadingScreen = document.getElementById('loadingScreen');
        const app = document.getElementById('app');
        
        if (authScreen) {
            authScreen.style.display = 'none';
            console.log('✅ Auth screen hidden');
        }
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            console.log('✅ Loading screen hidden');
        }
        
        if (app) {
            app.style.display = 'flex';
            app.style.opacity = '1';
            app.style.visibility = 'visible';
            console.log('✅ App displayed');
            
            // Ensure dashboard is active
            setTimeout(() => {
                const dashboardView = document.getElementById('dashboardView');
                if (dashboardView) {
                    document.querySelectorAll('.view-container').forEach(v => {
                        v.classList.remove('active');
                        v.style.display = 'none';
                    });
                    dashboardView.classList.add('active');
                    dashboardView.style.display = 'block';
                    console.log('✅ Dashboard activated');
                }
                
                // Set demo user data
                const userName = document.getElementById('userName');
                const userLevel = document.getElementById('userLevel');
                const userAvatar = document.getElementById('userAvatar');
                const streakCount = document.getElementById('streakCount');
                const tokenCount = document.getElementById('tokenCount');
                const pointsCount = document.getElementById('pointsCount');
                
                if (userName) userName.textContent = 'Demo User';
                if (userLevel) userLevel.textContent = 'Level 5';
                if (userAvatar) userAvatar.textContent = 'D';
                if (streakCount) streakCount.textContent = '7';
                if (tokenCount) tokenCount.textContent = '1,250';
                if (pointsCount) pointsCount.textContent = '3,450';
                
                console.log('✅ Demo data set');
                
                // Force run all integrations
                if (window.integrateAllSystems) {
                    console.log('🔄 Running integrations...');
                    window.integrateAllSystems();
                }
                
                // Force initialize systems
                if (window.systemInitializer) {
                    console.log('🔄 Running system initializer...');
                    window.systemInitializer.checkAndInitialize();
                }
            }, 500);
        } else {
            console.error('❌ App element not found!');
        }
    }
    
    // Run immediately and on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showApp);
    } else {
        showApp();
    }
    
    // Also run after a delay to catch late-loading elements
    setTimeout(showApp, 1000);
    setTimeout(showApp, 2000);
    
    // Make function available globally
    window.bypassAuth = showApp;
})();
