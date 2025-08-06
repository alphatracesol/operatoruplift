// Loading Screen Comprehensive Fix - Phase 1 Critical Fix
// This script fixes all loading screen issues: transition, cube interaction, positioning

console.log('🔧 Loading Screen Comprehensive Fix - Phase 1 Critical Fix');

function fixLoadingScreenComprehensive() {
    console.log('🚀 Starting Comprehensive Loading Screen Fix...');
    
    // 1. Fix loading screen positioning and styling
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        console.log('✅ Found loading screen, applying comprehensive fixes...');
        
        // Force proper positioning and styling
        loadingScreen.style.position = 'fixed';
        loadingScreen.style.top = '0';
        loadingScreen.style.left = '0';
        loadingScreen.style.width = '100vw';
        loadingScreen.style.height = '100vh';
        loadingScreen.style.zIndex = '99999';
        loadingScreen.style.display = 'flex';
        loadingScreen.style.flexDirection = 'column';
        loadingScreen.style.alignItems = 'center';
        loadingScreen.style.justifyContent = 'center';
        loadingScreen.style.backgroundColor = '#0a0a0a';
        loadingScreen.style.transition = 'opacity 0.8s ease-out';
        loadingScreen.style.gap = '2rem';
        
        // Ensure it's outside any wrapper
        if (loadingScreen.parentElement && loadingScreen.parentElement.classList.contains('app-wrapper')) {
            console.log('⚠️ Loading screen inside app-wrapper, moving to body...');
            document.body.appendChild(loadingScreen);
        }
        
        console.log('✅ Loading screen positioning and styling fixed');
    } else {
        console.log('❌ Loading screen not found');
        return;
    }
    
    // 2. Fix progress bar positioning
    const loadingProgress = document.getElementById('loading-progress');
    const loadingBar = document.querySelector('.loading-bar');
    if (loadingProgress) {
        loadingProgress.style.width = '300px';
        loadingProgress.style.maxWidth = '80vw';
        loadingProgress.style.margin = '0 auto';
        console.log('✅ Progress bar positioning fixed');
    }
    if (loadingBar) {
        loadingBar.style.width = '300px';
        loadingBar.style.maxWidth = '80vw';
        loadingBar.style.margin = '0 auto';
        console.log('✅ Loading bar positioning fixed');
    }
    
    // 3. Fix cube interaction
    const loadingCube = document.getElementById('loading-cube');
    if (loadingCube) {
        console.log('✅ Found loading cube, fixing interaction...');
        
        // Remove any existing event listeners
        const newCube = loadingCube.cloneNode(true);
        loadingCube.parentNode.replaceChild(newCube, loadingCube);
        
        // Add new event listeners
        let isClockwise = false;
        let clickCount = 0;
        
        // Add accessibility attributes
        newCube.setAttribute('role', 'button');
        newCube.setAttribute('aria-label', 'Toggle loading cube rotation');
        newCube.setAttribute('tabindex', '0');
        newCube.style.cursor = 'pointer';
        
        const handleCubeClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            clickCount++;
            isClockwise = !isClockwise;
            
            if (isClockwise) {
                newCube.style.animation = 'loadingCubeRotateCW 2s linear infinite';
                console.log('🔄 Cube clicked: toggled to CW (click #' + clickCount + ')');
            } else {
                newCube.style.animation = 'loadingCubeRotateCCW 2s linear infinite';
                console.log('🔄 Cube clicked: toggled to CCW (click #' + clickCount + ')');
            }
            
            // Simple scale feedback for 300ms
            newCube.style.transform = 'scale(1.1)';
            setTimeout(() => {
                newCube.style.transform = '';
            }, 300);
        };
        
        // Click event listener
        newCube.addEventListener('click', handleCubeClick);
        
        // Keyboard accessibility
        newCube.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCubeClick(e);
            }
        });
        
        // Hover effects
        newCube.addEventListener('mouseenter', () => {
            newCube.style.cursor = 'pointer';
        });
        
        console.log('✅ Cube interaction fixed');
    }
    
    // 4. Fix loading text positioning
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.style.textAlign = 'center';
        loadingText.style.width = '100%';
        loadingText.style.maxWidth = '400px';
        loadingText.style.margin = '0 auto';
        console.log('✅ Loading text positioning fixed');
    }
    
    // 5. Remove any conflicting loading overlays
    const loadingOverlays = document.querySelectorAll('[id*="loading-overlay"], [class*="loading-overlay"]');
    loadingOverlays.forEach(overlay => {
        if (overlay.id !== 'loading-screen') {
            console.log('🗑️ Removing conflicting loading overlay:', overlay.id || overlay.className);
            overlay.remove();
        }
    });
    
    // 6. Ensure app wrapper doesn't interfere
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
        appWrapper.style.position = 'relative';
        appWrapper.style.zIndex = '1';
        console.log('✅ App wrapper z-index adjusted');
    }
    
    // 7. Fix any auth-view conflicts
    const authView = document.getElementById('auth-view');
    if (authView) {
        authView.style.zIndex = '10';
        console.log('✅ Auth view z-index adjusted');
    }
    
    // 8. Start the loading animation with proper transition
    console.log('🔄 Starting loading animation with proper transition...');
    startLoadingAnimation();
}

function startLoadingAnimation() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingCube = document.getElementById('loading-cube');
    const loadingText = document.getElementById('loading-text');
    const loadingProgress = document.getElementById('loading-progress');
    
    if (!loadingScreen) {
        console.log('❌ Loading screen not found for animation');
        return;
    }
    
    // Loading states
    const loadingStates = [
        "Initializing Operator Uplift",
        "Loading Core Systems", 
        "Initializing AI Integration",
        "Preparing Dashboard",
        "Ready to Launch"
    ];
    
    let currentState = 0;
    let progress = 0;
    let lastUpdateTime = Date.now();
    
    // Update text every 800ms
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
    
    // Progress animation
    const animateProgress = () => {
        const now = Date.now();
        const deltaTime = now - lastUpdateTime;
        lastUpdateTime = now;
        
        // Realistic progress over 4 seconds
        progress += (deltaTime / 40); // 4 seconds = 4000ms, so 4000/100 = 40
        
        // Update progress bar
        if (loadingProgress) {
            loadingProgress.style.width = Math.min(progress, 100) + '%';
        }
        
        // Complete loading after 4 seconds
        if (progress >= 100) {
            progress = 100;
            console.log('✅ Loading complete, transitioning...');
            
            // Clear intervals
            clearInterval(textInterval);
            
            // Transition to auth screen
            setTimeout(() => {
                hideLoadingScreen();
            }, 1000);
            return; // Stop animation loop
        }
        
        // Continue animation
        requestAnimationFrame(animateProgress);
    };
    
    // Start the animation loop
    requestAnimationFrame(animateProgress);
    
    console.log('✅ Loading animation started');
}

function hideLoadingScreen() {
    console.log('🔄 Hiding loading screen...');
    
    const loadingScreen = document.getElementById('loading-screen');
    const authView = document.getElementById('auth-view');
    const header = document.querySelector('.header');
    
    if (loadingScreen) {
        // Fade out loading screen
        loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            
            // Show header after loading screen is hidden
            if (header) {
                header.classList.remove('hidden-during-load');
                console.log('✅ Header shown after loading');
            }
            
            // Show auth view
            if (authView) {
                authView.classList.add('active');
                console.log('✅ Auth view activated');
            }
            
            console.log('✅ Loading screen hidden, auth view shown');
        }, 500);
    } else {
        console.log('❌ Loading screen not found for hiding');
    }
}

// Run the comprehensive fix immediately
fixLoadingScreenComprehensive();

// Also run on DOM content loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixLoadingScreenComprehensive);
} else {
    // DOM is already loaded
    setTimeout(fixLoadingScreenComprehensive, 100);
}

console.log('✅ Loading Screen Comprehensive Fix script loaded'); 