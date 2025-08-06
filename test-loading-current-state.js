// Test current loading screen state
console.log('🔍 Testing Current Loading Screen State...');

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
    console.log('Loading screen z-index:', window.getComputedStyle(loadingScreen).zIndex);
    console.log('Loading screen display:', window.getComputedStyle(loadingScreen).display);
}

if (loadingCube) {
    console.log('Loading cube classes:', loadingCube.className);
    console.log('Loading cube animation:', window.getComputedStyle(loadingCube).animation);
    console.log('Loading cube cursor:', window.getComputedStyle(loadingCube).cursor);
    
    // Test click functionality
    loadingCube.addEventListener('click', () => {
        console.log('🎯 Loading cube clicked!');
        loadingCube.classList.toggle('clockwise');
        console.log('Clockwise class:', loadingCube.classList.contains('clockwise'));
    });
}

if (loadingText) {
    console.log('Loading text content:', loadingText.textContent);
    console.log('Loading text color:', window.getComputedStyle(loadingText).color);
}

if (loadingProgress) {
    console.log('Loading progress width:', window.getComputedStyle(loadingProgress).width);
}

// Check for CSS conflicts
const allCubes = document.querySelectorAll('.loading-cube, .mini-cube');
console.log('Total cube elements found:', allCubes.length);

allCubes.forEach((cube, index) => {
    console.log(`Cube ${index + 1}:`, {
        id: cube.id,
        classes: cube.className,
        animation: window.getComputedStyle(cube).animation,
        transform: window.getComputedStyle(cube).transform
    });
});

// Test if app.initLoadingScreen exists
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

console.log('🔍 Current state test complete!'); 