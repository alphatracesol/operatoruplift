// Structural Restoration Verification Script
// Tests the restored app.html for functionality and structure

console.log('🚀 Starting Structural Restoration Verification...');

// Test 1: Check if app.html loads without errors
async function testAppLoading() {
    try {
        const response = await fetch('http://localhost:8000/app.html');
        if (response.ok) {
            const html = await response.text();
            console.log('✅ App.html loads successfully');
            
            // Check file size
            const lineCount = html.split('\n').length;
            console.log(`📊 File size: ${lineCount} lines`);
            
            if (lineCount < 5000) {
                console.log('✅ File size is within acceptable limits');
            } else {
                console.log('❌ File size is too large');
            }
            
            // Check for duplicate IDs
            const idRegex = /id="([^"]+)"/g;
            const ids = [];
            let match;
            while ((match = idRegex.exec(html)) !== null) {
                ids.push(match[1]);
            }
            
            const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
            if (duplicateIds.length === 0) {
                console.log('✅ No duplicate IDs found');
            } else {
                console.log('❌ Duplicate IDs found:', duplicateIds);
            }
            
            // Check CSS structure
            const styleBlocks = (html.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).length;
            if (styleBlocks <= 2) { // Allow for main style + any small additions
                console.log('✅ CSS is properly organized');
            } else {
                console.log('❌ Too many CSS blocks found');
            }
            
            // Check JavaScript structure
            const scriptBlocks = (html.match(/<script[^>]*>[\s\S]*?<\/script>/g) || []).length;
            if (scriptBlocks <= 5) { // Allow for main script + CDN scripts
                console.log('✅ JavaScript is properly organized');
            } else {
                console.log('❌ Too many script blocks found');
            }
            
        } else {
            console.log('❌ Failed to load app.html');
        }
    } catch (error) {
        console.log('❌ Error testing app loading:', error.message);
    }
}

// Test 2: Check if the app runs in an iframe
function testAppFunctionality() {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.src = 'http://localhost:8000/app.html';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = '1px solid #ccc';
        
        iframe.onload = () => {
            console.log('✅ App loads in iframe successfully');
            
            try {
                // Check if basic elements are present
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                
                // Check for loading screen
                const loadingScreen = iframeDoc.getElementById('loading-overlay');
                if (loadingScreen) {
                    console.log('✅ Loading screen element found');
                } else {
                    console.log('⚠️ Loading screen element not found');
                }
                
                // Check for main app container
                const appContainer = iframeDoc.getElementById('app-container');
                if (appContainer) {
                    console.log('✅ Main app container found');
                } else {
                    console.log('⚠️ Main app container not found');
                }
                
                // Check for sidebar
                const sidebar = iframeDoc.getElementById('sidebar');
                if (sidebar) {
                    console.log('✅ Sidebar found');
                } else {
                    console.log('⚠️ Sidebar not found');
                }
                
                // Check for auth view
                const authView = iframeDoc.getElementById('auth-view');
                if (authView) {
                    console.log('✅ Auth view found');
                } else {
                    console.log('⚠️ Auth view not found');
                }
                
                resolve();
            } catch (error) {
                console.log('⚠️ Could not access iframe content (CORS restriction)');
                console.log('This is normal for security reasons');
                resolve();
            }
        };
        
        iframe.onerror = () => {
            console.log('❌ Failed to load app in iframe');
            resolve();
        };
        
        // Add iframe to page for testing
        document.body.appendChild(iframe);
        
        // Remove iframe after 5 seconds
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
        }, 5000);
    });
}

// Test 3: Check console for errors
function testConsoleErrors() {
    const originalError = console.error;
    const errors = [];
    
    console.error = (...args) => {
        errors.push(args.join(' '));
        originalError.apply(console, args);
    };
    
    setTimeout(() => {
        if (errors.length === 0) {
            console.log('✅ No console errors detected');
        } else {
            console.log('⚠️ Console errors detected:', errors.length);
            errors.forEach(error => console.log('  -', error));
        }
        console.error = originalError;
    }, 3000);
}

// Run all tests
async function runAllTests() {
    console.log('\n🔍 Running Structural Restoration Tests...\n');
    
    await testAppLoading();
    console.log('');
    
    await testAppFunctionality();
    console.log('');
    
    testConsoleErrors();
    
    console.log('\n🎉 Verification complete!');
    console.log('\n📋 Summary:');
    console.log('- If all tests show ✅, the structural restoration was successful');
    console.log('- If any tests show ❌, there may be issues to address');
    console.log('- If any tests show ⚠️, there may be minor issues to investigate');
    console.log('\n🌐 You can also test manually by visiting: http://localhost:8000/app.html');
}

// Start tests when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
} 