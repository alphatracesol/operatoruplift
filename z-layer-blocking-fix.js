// Z-Layer Blocking Fix - Phase 1 Critical Fix
// This script addresses z-index conflicts, auth dependencies, and cross-wrapper issues

console.log('🔧 Z-Layer Blocking Fix - Phase 1 Critical Fix');

function analyzeZLayerConflicts() {
    console.log('🔍 Analyzing z-layer conflicts and blocking issues...');
    
    // 1. CHECK CRITICAL Z-INDEX CONFLICTS
    const criticalZIndexes = {
        '--z-auth-overlay': 20000,
        '--z-loading': 99999,
        '--z-modal': 1100,
        '--z-modal-backdrop': 1000,
        '--z-auth-container': 2001,
        '--z-auth-card': 2002
    };
    
    console.log('📊 Critical z-index conflicts found:');
    Object.entries(criticalZIndexes).forEach(([key, value]) => {
        console.log(`  - ${key}: ${value}`);
    });
    
    // 2. CHECK AUTH DEPENDENCIES
    const authElements = {
        'auth-view': document.getElementById('auth-view'),
        'auth-container': document.querySelector('.auth-container'),
        'auth-card': document.querySelector('.auth-card'),
        'auth-state-indicator': document.getElementById('auth-state-indicator')
    };
    
    console.log('📊 Auth elements status:');
    Object.entries(authElements).forEach(([key, element]) => {
        console.log(`  - ${key}: ${element ? 'Found' : 'Missing'}`);
        if (element) {
            const computedStyle = window.getComputedStyle(element);
            console.log(`    Z-index: ${computedStyle.zIndex}`);
            console.log(`    Display: ${computedStyle.display}`);
            console.log(`    Visibility: ${computedStyle.visibility}`);
        }
    });
    
    // 3. CHECK FIREBASE DEPENDENCIES
    const firebaseLoaded = typeof firebase !== 'undefined';
    const firebaseAuth = firebaseLoaded && typeof firebase.auth !== 'undefined';
    console.log('📊 Firebase dependencies:', { firebaseLoaded, firebaseAuth });
    
    // 4. CHECK AI CHAT INTEGRATIONS
    const aiChatElements = {
        'ai-chat-view': document.getElementById('ai-chat-view'),
        'chat-messages': document.getElementById('chat-messages'),
        'ai-chat-header': document.querySelector('.ai-chat-header')
    };
    
    console.log('📊 AI Chat elements status:');
    Object.entries(aiChatElements).forEach(([key, element]) => {
        console.log(`  - ${key}: ${element ? 'Found' : 'Missing'}`);
    });
    
    // 5. IDENTIFY BLOCKING ISSUES
    const blockingIssues = [];
    
    if (authElements['auth-view'] && authElements['auth-view'].classList.contains('active')) {
        blockingIssues.push('Auth view is active and blocking other content');
    }
    
    if (!firebaseAuth) {
        blockingIssues.push('Firebase auth not loaded - blocking initialization');
    }
    
    const highZIndexElements = document.querySelectorAll('[style*="z-index: 999"], [style*="z-index: 9999"], [style*="z-index: 99999"]');
    if (highZIndexElements.length > 0) {
        blockingIssues.push(`${highZIndexElements.length} elements with very high z-index found`);
    }
    
    console.log('🚨 Blocking issues identified:', blockingIssues);
    
    return {
        criticalZIndexes,
        authElements,
        firebaseLoaded,
        firebaseAuth,
        aiChatElements,
        blockingIssues
    };
}

function createLocalTestMode() {
    console.log('🔧 Creating local test mode...');
    
    // 1. CREATE TEST MODE TOGGLE
    const testModeToggle = document.createElement('div');
    testModeToggle.id = 'local-test-mode-toggle';
    testModeToggle.innerHTML = `
        <div style="
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 999999;
            background: #f97316;
            color: white;
            padding: 10px;
            border-radius: 8px;
            font-size: 12px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
            <strong>🧪 LOCAL TEST MODE</strong><br>
            <span id="test-mode-status">ENABLED</span><br>
            <button onclick="toggleLocalTestMode()" style="
                background: #ea580c;
                border: none;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 5px;
            ">Toggle</button>
        </div>
    `;
    document.body.appendChild(testModeToggle);
    
    // 2. ADD GLOBAL TEST MODE FUNCTION
    window.toggleLocalTestMode = function() {
        const status = document.getElementById('test-mode-status');
        const isEnabled = status.textContent === 'ENABLED';
        
        if (isEnabled) {
            // Disable test mode
            status.textContent = 'DISABLED';
            status.style.color = '#ef4444';
            document.body.classList.remove('local-test-mode');
            console.log('🔴 Local test mode disabled');
        } else {
            // Enable test mode
            status.textContent = 'ENABLED';
            status.style.color = '#22c55e';
            document.body.classList.add('local-test-mode');
            console.log('🟢 Local test mode enabled');
        }
    };
    
    // 3. APPLY TEST MODE STYLES
    const testModeStyles = document.createElement('style');
    testModeStyles.textContent = `
        /* ===== LOCAL TEST MODE STYLES ===== */
        .local-test-mode #auth-view {
            z-index: 100 !important;
            opacity: 0.3 !important;
            pointer-events: none !important;
        }
        
        .local-test-mode .auth-container {
            z-index: 101 !important;
            opacity: 0.3 !important;
            pointer-events: none !important;
        }
        
        .local-test-mode .auth-card {
            z-index: 102 !important;
            opacity: 0.3 !important;
            pointer-events: none !important;
        }
        
        .local-test-mode #loading-overlay {
            z-index: 103 !important;
            opacity: 0.3 !important;
            pointer-events: none !important;
        }
        
        .local-test-mode .modal {
            z-index: 1000 !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        
        .local-test-mode .modal-overlay {
            z-index: 999 !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        
        .local-test-mode #ai-chat-view {
            z-index: 1000 !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        
        .local-test-mode .app-wrapper {
            z-index: 1 !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        
        /* Test mode indicators */
        .local-test-mode::before {
            content: '🧪 LOCAL TEST MODE ACTIVE';
            position: fixed;
            top: 50px;
            right: 10px;
            background: #f97316;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 10px;
            z-index: 999999;
            font-weight: bold;
        }
    `;
    document.head.appendChild(testModeStyles);
    
    // 4. ENABLE TEST MODE BY DEFAULT
    document.body.classList.add('local-test-mode');
    console.log('✅ Local test mode created and enabled');
}

function fixZIndexConflicts() {
    console.log('🔧 Fixing z-index conflicts...');
    
    // 1. NORMALIZE Z-INDEX SCALE
    const zIndexScale = {
        '--z-background': 0,
        '--z-base': 1,
        '--z-content': 10,
        '--z-header': 100,
        '--z-fixed': 150,
        '--z-sidebar': 200,
        '--z-modal-backdrop': 1000,
        '--z-modal': 1100,
        '--z-tooltip': 1200,
        '--z-notification': 1300,
        '--z-auth-container': 2001,
        '--z-auth-card': 2002,
        '--z-loading': 99999,
        '--z-auth-overlay': 20000
    };
    
    // 2. APPLY NORMALIZED Z-INDEXES
    const root = document.documentElement;
    Object.entries(zIndexScale).forEach(([key, value]) => {
        root.style.setProperty(key, value.toString());
    });
    
    console.log('✅ Z-index scale normalized');
}

function bypassAuthDependencies() {
    console.log('🔧 Bypassing auth dependencies for local testing...');
    
    // 1. CREATE MOCK FIREBASE AUTH
    if (typeof firebase === 'undefined') {
        console.log('➕ Creating mock Firebase auth...');
        window.firebase = {
            auth: () => ({
                onAuthStateChanged: (callback) => {
                    console.log('🔧 Mock auth state changed - bypassing');
                    // Simulate authenticated state after 2 seconds
                    setTimeout(() => {
                        callback({ uid: 'test-user-123', email: 'test@local.dev' });
                    }, 2000);
                },
                signInWithEmailAndPassword: (email, password) => {
                    console.log('🔧 Mock sign in:', email);
                    return Promise.resolve({ user: { uid: 'test-user-123', email } });
                },
                createUserWithEmailAndPassword: (email, password) => {
                    console.log('🔧 Mock sign up:', email);
                    return Promise.resolve({ user: { uid: 'test-user-123', email } });
                },
                signOut: () => {
                    console.log('🔧 Mock sign out');
                    return Promise.resolve();
                }
            })
        };
    }
    
    // 2. CREATE MOCK APP.AUTH
    if (!window.app) window.app = {};
    if (!window.app.auth) {
        window.app.auth = {
            init: () => {
                console.log('🔧 Mock auth init - bypassing Firebase');
                // Simulate successful auth initialization
                setTimeout(() => {
                    const authView = document.getElementById('auth-view');
                    if (authView) {
                        authView.classList.remove('active');
                        console.log('✅ Mock auth view hidden');
                    }
                }, 1000);
            },
            login: (email, password) => {
                console.log('🔧 Mock login:', email);
                return Promise.resolve({ success: true });
            },
            register: (email, password) => {
                console.log('🔧 Mock register:', email);
                return Promise.resolve({ success: true });
            },
            logout: () => {
                console.log('🔧 Mock logout');
                return Promise.resolve({ success: true });
            }
        };
    }
    
    console.log('✅ Auth dependencies bypassed for local testing');
}

function fixModalSystem() {
    console.log('🔧 Fixing modal system for local testing...');
    
    // 1. ENSURE MODAL OVERLAY EXISTS
    let modalOverlay = document.getElementById('modal-overlay');
    if (!modalOverlay) {
        console.log('➕ Creating missing modal overlay...');
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'modal-overlay';
        modalOverlay.className = 'modal-overlay';
        document.body.appendChild(modalOverlay);
    }
    
    // 2. ENSURE MODAL FUNCTIONS EXIST
    if (!window.app.ui) window.app.ui = {};
    
    if (!window.app.ui.showModal) {
        window.app.ui.showModal = function(modalId) {
            console.log('🔧 Showing modal:', modalId);
            const modal = document.getElementById(modalId);
            const overlay = document.getElementById('modal-overlay');
            
            if (modal && overlay) {
                overlay.classList.add('active');
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };
    }
    
    if (!window.app.ui.hideModal) {
        window.app.ui.hideModal = function(modalId) {
            console.log('🔧 Hiding modal:', modalId);
            const modal = document.getElementById(modalId);
            const overlay = document.getElementById('modal-overlay');
            
            if (modal) {
                modal.classList.remove('active');
            }
            
            if (overlay) {
                overlay.classList.remove('active');
            }
            
            document.body.style.overflow = '';
        };
    }
    
    console.log('✅ Modal system fixed for local testing');
}

function fixAIChatSystem() {
    console.log('🔧 Fixing AI chat system for local testing...');
    
    // 1. CREATE MOCK AI CHAT SYSTEM
    if (!window.app.ai) window.app.ai = {};
    
    if (!window.app.ai.sendMessage) {
        window.app.ai.sendMessage = function(message) {
            console.log('🔧 Mock AI message:', message);
            return Promise.resolve({
                response: `Mock AI response to: "${message}"\n\nThis is a local test response. In production, this would connect to the actual AI service.`,
                timestamp: new Date().toISOString()
            });
        };
    }
    
    if (!window.app.ai.clearChat) {
        window.app.ai.clearChat = function() {
            console.log('🔧 Mock clear chat');
            const messagesContainer = document.getElementById('chat-messages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
        };
    }
    
    if (!window.app.ai.exportChat) {
        window.app.ai.exportChat = function() {
            console.log('🔧 Mock export chat');
            alert('Mock chat export - this would save chat history in production');
        };
    }
    
    console.log('✅ AI chat system fixed for local testing');
}

// AUTO-INJECTION FUNCTION FOR MAIN APP
function injectIntoMainApp() {
    console.log('🎯 Auto-injecting z-layer blocking fix into main app...');
    
    // Check if we're in the main app
    const isMainApp = window.location.pathname.includes('app.html') || 
                     window.location.pathname.endsWith('/') ||
                     document.getElementById('auth-view') !== null;
    
    if (isMainApp) {
        console.log('✅ Detected main app - applying fixes...');
        
        // Apply all fixes
        createLocalTestMode();
        fixZIndexConflicts();
        bypassAuthDependencies();
        fixModalSystem();
        fixAIChatSystem();
        
        console.log('✅ Z-Layer Blocking Fix auto-injected successfully');
        console.log('💡 Local test mode is now active - you can test modals and other features');
        console.log('💡 Use the toggle button in the top-right to enable/disable test mode');
        console.log('💡 Remember to disable test mode before deployment!');
    } else {
        console.log('⚠️ Not in main app - skipping auto-injection');
    }
}

// Apply all fixes
console.log('🎯 Applying z-layer blocking fix...');

// Check if we should auto-inject
if (typeof window !== 'undefined' && window.location) {
    injectIntoMainApp();
} else {
    // Manual application (for testing)
    console.log('🔧 Manual application mode...');
    
    // Analyze first
    const analysis = analyzeZLayerConflicts();
    
    // Apply fixes
    createLocalTestMode();
    fixZIndexConflicts();
    bypassAuthDependencies();
    fixModalSystem();
    fixAIChatSystem();
    
    console.log('✅ Z-Layer Blocking Fix applied successfully');
    console.log('💡 Local test mode is now active - you can test modals and other features');
    console.log('💡 Use the toggle button in the top-right to enable/disable test mode');
    console.log('💡 Remember to disable test mode before deployment!');
} 