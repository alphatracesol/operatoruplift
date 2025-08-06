// Test script to verify loading screen fixes
console.log('🧪 Testing Loading Screen Fixes...');

// Test 1: Check if loading screen is first in DOM
const loadingScreen = document.getElementById('loading-screen');
const appWrapper = document.querySelector('.app-wrapper');
const header = document.querySelector('.header');

if (loadingScreen && appWrapper) {
    const loadingIndex = Array.from(document.body.children).indexOf(loadingScreen);
    const appWrapperIndex = Array.from(document.body.children).indexOf(appWrapper);
    
    if (loadingIndex < appWrapperIndex) {
        console.log('✅ PASS: Loading screen is positioned before app-wrapper');
    } else {
        console.log('❌ FAIL: Loading screen is positioned after app-wrapper');
    }
}

// Test 2: Check z-index hierarchy
if (loadingScreen) {
    const computedStyle = window.getComputedStyle(loadingScreen);
    const zIndex = computedStyle.zIndex;
    
    if (zIndex === '99999' || zIndex === 'var(--z-loading)') {
        console.log('✅ PASS: Loading screen has highest z-index');
    } else {
        console.log(`❌ FAIL: Loading screen z-index is ${zIndex}, expected 99999`);
    }
}

// Test 3: Check for duplicate elements
const audioElements = document.querySelectorAll('#background-music');
const matrixElements = document.querySelectorAll('#matrix-rain');

if (audioElements.length === 1) {
    console.log('✅ PASS: Single audio element found');
} else {
    console.log(`❌ FAIL: Found ${audioElements.length} audio elements`);
}

if (matrixElements.length === 1) {
    console.log('✅ PASS: Single matrix rain element found');
} else {
    console.log(`❌ FAIL: Found ${matrixElements.length} matrix rain elements`);
}

// Test 4: Check interactive cube
const loadingCube = document.getElementById('loading-cube');
if (loadingCube) {
    const computedStyle = window.getComputedStyle(loadingCube);
    if (computedStyle.cursor === 'pointer') {
        console.log('✅ PASS: Loading cube has pointer cursor');
    } else {
        console.log(`❌ FAIL: Loading cube cursor is ${computedStyle.cursor}`);
    }
} else {
    console.log('❌ FAIL: Loading cube not found');
}

// Test 5: Check progress bar elements
const loadingProgress = document.getElementById('loading-progress');
const loadingText = document.getElementById('loading-text');

if (loadingProgress) {
    console.log('✅ PASS: Loading progress element found');
} else {
    console.log('❌ FAIL: Loading progress element not found');
}

if (loadingText) {
    console.log('✅ PASS: Loading text element found');
} else {
    console.log('❌ FAIL: Loading text element not found');
}

// Test 6: Check accessibility
const ariaLabels = document.querySelectorAll('[aria-label]');
if (ariaLabels.length > 0) {
    console.log(`✅ PASS: Found ${ariaLabels.length} elements with ARIA labels`);
} else {
    console.log('❌ FAIL: No ARIA labels found');
}

console.log('🧪 Loading screen tests complete!'); 