// Hybrid Loading Fix - Phase 1 Critical Fix
// This script replaces loading-screen with loading-overlay but keeps the 3D cube animation

console.log('🔧 Hybrid Loading Fix - Phase 1 Critical Fix');

function createHybridLoading() {
    console.log('🚀 Creating hybrid loading overlay with 3D cube...');
    
    // 1. Remove the complex loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        console.log('🗑️ Removing complex loading screen...');
        loadingScreen.remove();
    }
    
    // 2. Create the hybrid loading overlay with 3D cube
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div id="loading-cube" class="loading-cube">
            <div class="loading-cube-face loading-cube-face-front">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5L35 12.5V27.5L20 35L5 27.5V12.5L20 5Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M20 20L20 5M20 20L32.5 25M20 20L7.5 25" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </div>
            <div class="loading-cube-face loading-cube-face-back">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5L35 12.5V27.5L20 35L5 27.5V12.5L20 5Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M20 20L20 5M20 20L32.5 25M20 20L7.5 25" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </div>
            <div class="loading-cube-face loading-cube-face-right">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5L35 12.5V27.5L20 35L5 27.5V12.5L20 5Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M20 20L20 5M20 20L32.5 25M20 20L7.5 25" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </div>
            <div class="loading-cube-face loading-cube-face-left">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5L35 12.5V27.5L20 35L5 27.5V12.5L20 5Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M20 20L20 5M20 20L32.5 25M20 20L7.5 25" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </div>
            <div class="loading-cube-face loading-cube-face-top">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5L35 12.5V27.5L20 35L5 27.5V12.5L20 5Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M20 20L20 5M20 20L32.5 25M20 20L7.5 25" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </div>
            <div class="loading-cube-face loading-cube-face-bottom">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5L35 12.5V27.5L20 35L5 27.5V12.5L20 5Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M20 20L20 5M20 20L32.5 25M20 20L7.5 25" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </div>
        </div>
        <p id="loading-text">Initializing Operator Uplift...</p>
    `;
    
    // 3. Add the hybrid CSS styles
    const style = document.createElement('style');
    style.textContent = `
        #loading-overlay {
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%;
            background: var(--bg-color); 
            z-index: 9999; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            transition: opacity 0.5s;
            gap: 2rem;
        }
        
        #loading-cube {
            width: 80px;
            height: 80px;
            position: relative;
            transform-style: preserve-3d;
            animation: loadingCubeRotateCCW 2s linear infinite;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        #loading-cube:hover {
            transform: scale(1.1);
        }
        
        .loading-cube-face {
            position: absolute;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(249, 115, 22, 0.1);
            border: 2px solid var(--accent-color);
            border-radius: 8px;
            color: var(--accent-color);
            transition: all 0.3s ease;
        }
        
        .loading-cube-face:hover {
            background: rgba(249, 115, 22, 0.2);
            border-color: var(--accent-color-light);
            color: var(--accent-color-light);
        }
        
        .loading-cube-face-front { transform: translateZ(40px); }
        .loading-cube-face-back { transform: translateZ(-40px) rotateY(180deg); }
        .loading-cube-face-right { transform: translateX(40px) rotateY(90deg); }
        .loading-cube-face-left { transform: translateX(-40px) rotateY(-90deg); }
        .loading-cube-face-top { transform: translateY(-40px) rotateX(90deg); }
        .loading-cube-face-bottom { transform: translateY(40px) rotateX(-90deg); }
        
        @keyframes loadingCubeRotateCW {
            from { transform: rotateX(0deg) rotateY(0deg); }
            to { transform: rotateX(360deg) rotateY(360deg); }
        }
        
        @keyframes loadingCubeRotateCCW {
            from { transform: rotateX(0deg) rotateY(0deg); }
            to { transform: rotateX(-360deg) rotateY(-360deg); }
        }
        
        #loading-text { 
            margin-top: 1rem; 
            font-weight: 500; 
            animation: fadeIn 1s ease-in;
            font-size: 1.2rem;
            color: var(--text-color);
        }
        
        @keyframes fadeIn { 
            from { opacity: 0; } 
            to { opacity: 1; } 
        }
    `;
    
    // 4. Add to document
    document.head.appendChild(style);
    document.body.appendChild(loadingOverlay);
    
    // 5. Add cube click interaction
    const loadingCube = document.getElementById('loading-cube');
    if (loadingCube) {
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
        
        loadingCube.addEventListener('click', handleCubeClick);
        loadingCube.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCubeClick(e);
            }
        });
        
        // Add accessibility attributes
        loadingCube.setAttribute('role', 'button');
        loadingCube.setAttribute('aria-label', 'Toggle loading cube rotation');
        loadingCube.setAttribute('tabindex', '0');
    }
    
    console.log('✅ Hybrid loading overlay with 3D cube created');
    
    // 6. Auto-hide after 4 seconds
    setTimeout(() => {
        hideLoadingOverlay();
    }, 4000);
}

function hideLoadingOverlay() {
    console.log('🔄 Hiding loading overlay...');
    
    const loadingOverlay = document.getElementById('loading-overlay');
    const authView = document.getElementById('auth-view');
    
    if (loadingOverlay) {
        // Fade out loading overlay
        loadingOverlay.style.opacity = '0';
        
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            
            // Show auth view
            if (authView) {
                authView.classList.remove('hidden');
                authView.classList.add('active');
                console.log('✅ Auth view activated');
            }
            
            console.log('✅ Loading overlay hidden, auth view shown');
        }, 500);
    } else {
        console.log('❌ Loading overlay not found for hiding');
    }
}

// Apply the fix immediately
console.log('🎯 Applying hybrid loading fix...');

// Apply immediately if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createHybridLoading);
} else {
    // DOM is already loaded
    setTimeout(createHybridLoading, 100);
}

// Also apply on window load as backup
window.addEventListener('load', () => {
    setTimeout(createHybridLoading, 200);
});

console.log('✅ Hybrid Loading Fix script loaded'); 