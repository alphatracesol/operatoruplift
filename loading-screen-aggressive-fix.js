// Loading Screen Aggressive Fix - Phase 1 Critical Fix
// This script aggressively fixes loading screen by disabling conflicting initialization

console.log('🔧 Loading Screen Aggressive Fix - Phase 1 Critical Fix');

// 1. DISABLE CONFLICTING INITIALIZATION
function disableConflictingInit() {
    console.log('🚫 Disabling conflicting initialization...');
    
    // Override the app's initLoadingScreen to prevent conflicts
    if (window.app && window.app.initLoadingScreen) {
        const originalInit = window.app.initLoadingScreen;
        window.app.initLoadingScreen = function() {
            console.log('🚫 Blocked conflicting initLoadingScreen call');
            return; // Do nothing - we'll handle it ourselves
        };
        console.log('✅ Blocked app.initLoadingScreen');
    }
    
    // Override any existing loading screen event listeners
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Clone and replace to remove all existing event listeners
        const newLoadingScreen = loadingScreen.cloneNode(true);
        loadingScreen.parentNode.replaceChild(newLoadingScreen, loadingScreen);
        console.log('✅ Replaced loading screen to remove conflicts');
    }
    
    // Override any existing cube event listeners
    const loadingCube = document.getElementById('loading-cube');
    if (loadingCube) {
        // Clone and replace to remove all existing event listeners
        const newCube = loadingCube.cloneNode(true);
        loadingCube.parentNode.replaceChild(newCube, loadingCube);
        console.log('✅ Replaced loading cube to remove conflicts');
    }
    
    // Clear any existing intervals
    const highestIntervalId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestIntervalId; i++) {
        clearInterval(i);
    }
    console.log('✅ Cleared all existing intervals');
    
    // Clear any existing timeouts
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
    console.log('✅ Cleared all existing timeouts');
}

// 2. FORCE LOADING SCREEN POSITIONING
function forceLoadingScreenPositioning() {
    console.log('🎯 Forcing loading screen positioning...');
    
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) {
        console.log('❌ Loading screen not found');
        return false;
    }
    
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
    loadingScreen.style.opacity = '1';
    
    // Ensure it's outside any wrapper
    if (loadingScreen.parentElement && loadingScreen.parentElement.classList.contains('app-wrapper')) {
        console.log('⚠️ Loading screen inside app-wrapper, moving to body...');
        document.body.appendChild(loadingScreen);
    }
    
    console.log('✅ Loading screen positioning forced');
    return true;
}

// 3. FORCE CUBE INTERACTION
function forceCubeInteraction() {
    console.log('🎯 Forcing cube interaction...');
    
    const loadingCube = document.getElementById('loading-cube');
    if (!loadingCube) {
        console.log('❌ Loading cube not found');
        return false;
    }
    
    // Add accessibility attributes
    loadingCube.setAttribute('role', 'button');
    loadingCube.setAttribute('aria-label', 'Toggle loading cube rotation');
    loadingCube.setAttribute('tabindex', '0');
    loadingCube.style.cursor = 'pointer';
    
    let isClockwise = false;
    let clickCount = 0;
    
    const handleCubeClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        clickCount++;
        isClockwise = !isClockwise;
        
        if (isClockwise) {
            loadingCube.style.animation = 'loadingCubeRotateCW 2s linear infinite';
            console.log('🔄 Cube clicked: toggled to CW (click #' + clickCount + ')');
        } else {
            loadingCube.style.animation = 'loadingCubeRotateCCW 2s linear infinite';
            console.log('🔄 Cube clicked: toggled to CCW (click #' + clickCount + ')');
        }
        
        // Simple scale feedback for 300ms
        loadingCube.style.transform = 'scale(1.1)';
        setTimeout(() => {
            loadingCube.style.transform = '';
        }, 300);
    };
    
    // Remove any existing listeners and add new ones
    loadingCube.onclick = handleCubeClick;
    loadingCube.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCubeClick(e);
        }
    };
    
    console.log('✅ Cube interaction forced');
    return true;
}

// 4. FORCE PROGRESS AND TEXT POSITIONING
function forceElementPositioning() {
    console.log('🎯 Forcing element positioning...');
    
    // Fix progress bar
    const loadingProgress = document.getElementById('loading-progress');
    if (loadingProgress) {
        loadingProgress.style.width = '300px';
        loadingProgress.style.maxWidth = '80vw';
        loadingProgress.style.margin = '0 auto';
        console.log('✅ Progress bar positioning forced');
    }
    
    // Fix loading bar
    const loadingBar = document.querySelector('.loading-bar');
    if (loadingBar) {
        loadingBar.style.width = '300px';
        loadingBar.style.maxWidth = '80vw';
        loadingBar.style.margin = '0 auto';
        console.log('✅ Loading bar positioning forced');
    }
    
    // Fix loading text
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.style.textAlign = 'center';
        loadingText.style.width = '100%';
        loadingText.style.maxWidth = '400px';
        loadingText.style.margin = '0 auto';
        console.log('✅ Loading text positioning forced');
    }
}

// 5. FORCE LOADING ANIMATION
function forceLoadingAnimation() {
    console.log('🎯 Forcing loading animation...');
    
    const loadingScreen = document.getElementById('loading-screen');
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
                forceHideLoadingScreen();
            }, 1000);
            return; // Stop animation loop
        }
        
        // Continue animation
        requestAnimationFrame(animateProgress);
    };
    
    // Start the animation loop
    requestAnimationFrame(animateProgress);
    
    console.log('✅ Loading animation forced');
}

// 6. FORCE HIDE LOADING SCREEN
function forceHideLoadingScreen() {
    console.log('🔄 Force hiding loading screen...');
    
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

// 7. MAIN AGGRESSIVE FIX FUNCTION
function applyAggressiveFix() {
    console.log('🚀 Applying Aggressive Loading Screen Fix...');
    
    // Step 1: Disable conflicting initialization
    disableConflictingInit();
    
    // Step 2: Force positioning
    if (!forceLoadingScreenPositioning()) {
        console.log('❌ Failed to position loading screen');
        return;
    }
    
    // Step 3: Force cube interaction
    if (!forceCubeInteraction()) {
        console.log('❌ Failed to set up cube interaction');
        return;
    }
    
    // Step 4: Force element positioning
    forceElementPositioning();
    
    // Step 5: Start forced animation
    setTimeout(() => {
        forceLoadingAnimation();
    }, 100);
    
    console.log('✅ Aggressive fix applied successfully');
}

// 8. APPLY FIX IMMEDIATELY AND ON DOM LOAD
console.log('🎯 Applying aggressive fix...');

// Apply immediately if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAggressiveFix);
} else {
    // DOM is already loaded
    setTimeout(applyAggressiveFix, 100);
}

// Also apply on window load as backup
window.addEventListener('load', () => {
    setTimeout(applyAggressiveFix, 200);
});

console.log('✅ Loading Screen Aggressive Fix script loaded'); 