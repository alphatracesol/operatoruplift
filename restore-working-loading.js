// Restore Working Loading Overlay - Phase 1 Critical Fix
// This script restores the simple working loading overlay from app-broken-backup.html

console.log('🔧 Restore Working Loading Overlay - Phase 1 Critical Fix');

function restoreWorkingLoading() {
    console.log('🚀 Restoring working loading overlay...');
    
    // 1. Remove the complex loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        console.log('🗑️ Removing complex loading screen...');
        loadingScreen.remove();
    }
    
    // 2. Create the simple working loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="spinner"></div><p>Initializing Operator Uplift...</p>';
    
    // 3. Add the working CSS styles
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
        }
        .spinner {
            width: 50px; 
            height: 50px; 
            border: 5px solid var(--border-glass);
            border-radius: 50%; 
            animation: spin 1s linear infinite, color-pulse 2s ease-in-out infinite;
        }
        @keyframes spin { 
            to { transform: rotate(360deg); } 
        }
        @keyframes color-pulse {
            0% { border-top-color: var(--accent-color); }
            50% { border-top-color: var(--secondary-color); }
            100% { border-top-color: var(--accent-color); }
        }
        #loading-overlay p { 
            margin-top: 1rem; 
            font-weight: 500; 
            animation: fadeIn 1s ease-in; 
        }
        @keyframes fadeIn { 
            from { opacity: 0; } 
            to { opacity: 1; } 
        }
    `;
    
    // 4. Add to document
    document.head.appendChild(style);
    document.body.appendChild(loadingOverlay);
    
    console.log('✅ Working loading overlay restored');
    
    // 5. Auto-hide after 3 seconds (like the working version)
    setTimeout(() => {
        hideLoadingOverlay();
    }, 3000);
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
console.log('🎯 Applying working loading overlay fix...');

// Apply immediately if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreWorkingLoading);
} else {
    // DOM is already loaded
    setTimeout(restoreWorkingLoading, 100);
}

// Also apply on window load as backup
window.addEventListener('load', () => {
    setTimeout(restoreWorkingLoading, 200);
});

console.log('✅ Restore Working Loading Overlay script loaded'); 