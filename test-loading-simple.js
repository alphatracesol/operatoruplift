// Simple test to check loading screen functionality
console.log('🧪 Simple Loading Screen Test...');

// Check if elements exist
const loadingScreen = document.getElementById('loading-screen');
const loadingCube = document.getElementById('loading-cube');
const loadingText = document.getElementById('loading-text');
const loadingProgress = document.getElementById('loading-progress');

console.log('Elements found:', {
    loadingScreen: !!loadingScreen,
    loadingCube: !!loadingCube,
    loadingText: !!loadingText,
    loadingProgress: !!loadingProgress
});

if (loadingScreen) {
    console.log('Loading screen classes:', loadingScreen.className);
    console.log('Loading screen style:', loadingScreen.style.cssText);
    console.log('Loading screen computed z-index:', window.getComputedStyle(loadingScreen).zIndex);
}

if (loadingCube) {
    console.log('Loading cube classes:', loadingCube.className);
    console.log('Loading cube animation:', window.getComputedStyle(loadingCube).animation);
    
    // Test click functionality
    loadingCube.addEventListener('click', () => {
        console.log('🎯 Cube clicked!');
        loadingCube.classList.toggle('clockwise');
    });
}

if (loadingText) {
    console.log('Loading text content:', loadingText.textContent);
}

if (loadingProgress) {
    console.log('Loading progress width:', window.getComputedStyle(loadingProgress).width);
}

// Test if app.initLoadingScreen exists and works
if (typeof app !== 'undefined' && typeof app.initLoadingScreen === 'function') {
    console.log('🔧 Testing initLoadingScreen...');
    try {
        app.initLoadingScreen();
        console.log('✅ initLoadingScreen called successfully');
    } catch (error) {
        console.error('❌ Error in initLoadingScreen:', error);
    }
} else {
    console.log('❌ app.initLoadingScreen not found');
}

console.log('🧪 Simple test complete!'); 