// Loading Screen Fix - Phase 1 Critical Fix
// This script addresses the stuck loading screen issue

console.log('🔧 Loading Screen Fix - Phase 1 Critical Fix');

function fixLoadingScreen() {
    console.log('🚀 Starting Loading Screen Fix...');
    
    // 1. Ensure loading screen is properly positioned
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        console.log('✅ Found loading screen, applying fixes...');
        
        // Force proper positioning
        loadingScreen.style.position = 'fixed';
        loadingScreen.style.top = '0';
        loadingScreen.style.left = '0';
        loadingScreen.style.width = '100vw';
        loadingScreen.style.height = '100vh';
        loadingScreen.style.zIndex = '99999';
        loadingScreen.style.display = 'flex';
        loadingScreen.style.alignItems = 'center';
        loadingScreen.style.justifyContent = 'center';
        loadingScreen.style.backgroundColor = '#0a0a0a';
        loadingScreen.style.transition = 'opacity 0.8s ease-out';
        
        // Ensure it's outside any wrapper
        if (loadingScreen.parentElement && loadingScreen.parentElement.classList.contains('app-wrapper')) {
            console.log('⚠️ Loading screen inside app-wrapper, moving to body...');
            document.body.appendChild(loadingScreen);
        }
        
        console.log('✅ Loading screen positioning fixed');
    } else {
        console.log('❌ Loading screen not found');
    }
    
    // 2. Remove any conflicting loading overlays
    const loadingOverlays = document.querySelectorAll('[id*="loading-overlay"], [class*="loading-overlay"]');
    loadingOverlays.forEach(overlay => {
        if (overlay.id !== 'loading-screen') {
            console.log('🗑️ Removing conflicting loading overlay:', overlay.id || overlay.className);
            overlay.remove();
        }
    });
    
    // 3. Ensure app wrapper doesn't interfere
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
        appWrapper.style.position = 'relative';
        appWrapper.style.zIndex = '1';
        console.log('✅ App wrapper z-index adjusted');
    }
    
    // 4. Fix any auth-view conflicts
    const authView = document.getElementById('auth-view');
    if (authView) {
        authView.style.zIndex = '10';
        console.log('✅ Auth view z-index adjusted');
    }
    
    // 5. Ensure proper initialization order
    setTimeout(() => {
        console.log('🔄 Triggering loading screen initialization...');
        
        // Find and call the loading screen initialization
        if (window.app && window.app.initLoadingScreen) {
            window.app.initLoadingScreen();
        } else {
            console.log('⚠️ App loading screen init not found, using fallback...');
            initLoadingScreenFallback();
        }
    }, 100);
}

function initLoadingScreenFallback() {
    console.log('🔄 Using fallback loading screen initialization...');
    
    const loadingScreen = document.getElementById('loading-screen');
    const loadingCube = document.getElementById('loading-cube');
    const loadingText = document.getElementById('loading-text');
    const loadingProgress = document.getElementById('loading-progress');
    
    if (!loadingScreen) {
        console.log('❌ Loading screen not found in fallback');
        return;
    }
    
    // Simple loading animation
    let progress = 0;
    const loadingStates = [
        "Initializing Operator Uplift",
        "Loading Core Systems", 
        "Initializing AI Integration",
        "Preparing Dashboard",
        "Ready to Launch"
    ];
    
    let currentState = 0;
    
    // Update text
    const textInterval = setInterval(() => {
        if (loadingText && currentState < loadingStates.length - 1) {
            currentState++;
            loadingText.style.opacity = '0';
            setTimeout(() => {
                loadingText.textContent = loadingStates[currentState];
                loadingText.style.opacity = '1';
                console.log(`📝 Loading: ${loadingStates[currentState]}`);
            }, 150);
        } else {
            clearInterval(textInterval);
        }
    }, 800);
    
    // Update progress
    const progressInterval = setInterval(() => {
        progress += 2;
        if (loadingProgress) {
            loadingProgress.style.width = Math.min(progress, 100) + '%';
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            console.log('✅ Loading complete, transitioning...');
            
            // Hide loading screen after 1 second
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    
                    // Show auth view
                    const authView = document.getElementById('auth-view');
                    if (authView) {
                        authView.classList.add('active');
                        console.log('✅ Auth view activated');
                    }
                }, 500);
            }, 1000);
        }
    }, 40); // 4 seconds total (40ms * 100 = 4000ms)
    
    console.log('✅ Fallback loading screen initialized');
}

// Run the fix immediately
fixLoadingScreen();

// Also run on DOM content loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixLoadingScreen);
} else {
    // DOM is already loaded
    setTimeout(fixLoadingScreen, 100);
}

console.log('✅ Loading Screen Fix script loaded'); 