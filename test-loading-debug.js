// Debug script to test loading screen functionality
console.log('🔍 Debugging Loading Screen...');

// Test 1: Check if loading screen exists
const loadingScreen = document.getElementById('loading-screen');
console.log('Loading screen found:', !!loadingScreen);

if (loadingScreen) {
    console.log('Loading screen classes:', loadingScreen.className);
    console.log('Loading screen style:', loadingScreen.style.cssText);
    console.log('Loading screen computed style:', window.getComputedStyle(loadingScreen).zIndex);
}

// Test 2: Check if loading cube exists
const loadingCube = document.getElementById('loading-cube');
console.log('Loading cube found:', !!loadingCube);

if (loadingCube) {
    console.log('Loading cube classes:', loadingCube.className);
    console.log('Loading cube style:', loadingCube.style.cssText);
    console.log('Loading cube animation:', window.getComputedStyle(loadingCube).animation);
}

// Test 3: Check if loading text exists
const loadingText = document.getElementById('loading-text');
console.log('Loading text found:', !!loadingText);

if (loadingText) {
    console.log('Loading text content:', loadingText.textContent);
    console.log('Loading text style:', loadingText.style.cssText);
}

// Test 4: Check if loading progress exists
const loadingProgress = document.getElementById('loading-progress');
console.log('Loading progress found:', !!loadingProgress);

if (loadingProgress) {
    console.log('Loading progress style:', loadingProgress.style.cssText);
    console.log('Loading progress width:', window.getComputedStyle(loadingProgress).width);
}

// Test 5: Check if app.initLoadingScreen exists
console.log('app.initLoadingScreen exists:', typeof app !== 'undefined' && typeof app.initLoadingScreen === 'function');

// Test 6: Try to manually trigger loading screen
if (typeof app !== 'undefined' && typeof app.initLoadingScreen === 'function') {
    console.log('🔧 Manually triggering initLoadingScreen...');
    try {
        app.initLoadingScreen();
        console.log('✅ initLoadingScreen called successfully');
    } catch (error) {
        console.error('❌ Error calling initLoadingScreen:', error);
    }
}

// Test 7: Check for CSS conflicts
const allCubes = document.querySelectorAll('.loading-cube, .mini-cube');
console.log('Total cube elements found:', allCubes.length);

allCubes.forEach((cube, index) => {
    console.log(`Cube ${index + 1}:`, {
        id: cube.id,
        classes: cube.className,
        animation: window.getComputedStyle(cube).animation
    });
});

console.log('🔍 Loading screen debug complete!'); 