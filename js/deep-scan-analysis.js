// Deep Scan Analysis Tool
// Checks for missing CTAs, callbacks, data/memory leaks, and AI integration issues

(function() {
    'use strict';

    console.log('🔍 Starting Deep Scan Analysis...\n');

    const scanResults = {
        missingCTAs: [],
        brokenCallbacks: [],
        memoryLeaks: [],
        dataLeaks: [],
        missingAI: [],
        missingPersonalization: []
    };

    // 1. Scan for Missing CTAs and Callbacks
    function scanCTAsAndCallbacks() {
        console.log('1️⃣ Scanning CTAs and Callbacks...');

        // Find all buttons and clickable elements
        const clickables = document.querySelectorAll('button, [onclick], [data-action], .btn, .cta-button');
        
        clickables.forEach(element => {
            const onclick = element.getAttribute('onclick');
            const hasListener = element._listeners || element.onclick;
            
            // Check if element has any click handler
            if (!onclick && !hasListener && !element.closest('form')) {
                const text = element.textContent.trim();
                const id = element.id || element.className;
                
                if (text && !text.includes('...') && !text.includes('Loading')) {
                    scanResults.missingCTAs.push({
                        element: id || text,
                        type: 'No click handler',
                        location: getElementPath(element)
                    });
                }
            }
            
            // Check for broken callbacks
            if (onclick) {
                try {
                    // Check if function exists
                    const funcName = onclick.match(/^(\w+)\(/)?.[1];
                    if (funcName && !window[funcName]) {
                        scanResults.brokenCallbacks.push({
                            element: id || text,
                            callback: funcName,
                            location: getElementPath(element)
                        });
                    }
                } catch (e) {
                    // Invalid onclick
                }
            }
        });

        // Check forms without submit handlers
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.onsubmit && !form.hasAttribute('data-handled')) {
                scanResults.missingCTAs.push({
                    element: form.id || 'Unnamed form',
                    type: 'No submit handler',
                    location: getElementPath(form)
                });
            }
        });

        console.log(`Found ${scanResults.missingCTAs.length} missing CTAs`);
        console.log(`Found ${scanResults.brokenCallbacks.length} broken callbacks`);
    }

    // 2. Scan for Memory Leaks
    function scanMemoryLeaks() {
        console.log('\n2️⃣ Scanning for Memory Leaks...');

        // Check for event listeners that might not be cleaned up
        const potentialLeaks = [];

        // Check intervals and timeouts
        const originalSetInterval = window.setInterval;
        const originalSetTimeout = window.setTimeout;
        let intervalCount = 0;
        let timeoutCount = 0;

        // Monitor new intervals/timeouts
        window.setInterval = function() {
            intervalCount++;
            return originalSetInterval.apply(this, arguments);
        };

        window.setTimeout = function() {
            timeoutCount++;
            return originalSetTimeout.apply(this, arguments);
        };

        // Check for DOM references in global scope
        for (let key in window) {
            try {
                const value = window[key];
                if (value && value.nodeType === 1) { // DOM element
                    potentialLeaks.push({
                        type: 'Global DOM reference',
                        variable: key,
                        element: value.tagName
                    });
                }
            } catch (e) {
                // Skip inaccessible properties
            }
        }

        // Check for large arrays/objects in global scope
        for (let key in window) {
            try {
                const value = window[key];
                if (Array.isArray(value) && value.length > 1000) {
                    potentialLeaks.push({
                        type: 'Large array in global scope',
                        variable: key,
                        size: value.length
                    });
                }
            } catch (e) {
                // Skip
            }
        }

        scanResults.memoryLeaks = potentialLeaks;
        console.log(`Found ${potentialLeaks.length} potential memory leaks`);
    }

    // 3. Scan for Data Leaks
    function scanDataLeaks() {
        console.log('\n3️⃣ Scanning for Data Leaks...');

        // Check localStorage for sensitive data
        const sensitiveKeys = ['password', 'token', 'key', 'secret', 'api', 'private'];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            
            sensitiveKeys.forEach(sensitive => {
                if (key.toLowerCase().includes(sensitive)) {
                    scanResults.dataLeaks.push({
                        type: 'Sensitive data in localStorage',
                        key: key,
                        preview: value.substring(0, 20) + '...'
                    });
                }
            });
        }

        // Check for exposed API keys in global scope
        for (let key in window) {
            if (key.toLowerCase().includes('api') || key.toLowerCase().includes('key')) {
                try {
                    const value = window[key];
                    if (typeof value === 'string' && value.length > 10) {
                        scanResults.dataLeaks.push({
                            type: 'Potential API key in global scope',
                            variable: key,
                            preview: value.substring(0, 10) + '...'
                        });
                    }
                } catch (e) {
                    // Skip
                }
            }
        }

        console.log(`Found ${scanResults.dataLeaks.length} potential data leaks`);
    }

    // 4. Scan for Missing AI Integration
    function scanAIIntegration() {
        console.log('\n4️⃣ Scanning AI Integration...');

        // Check if AI systems are loaded
        const aiSystems = [
            { name: 'aiCoaching', feature: 'AI Coaching' },
            { name: 'aiAssistant', feature: 'AI Assistant' },
            { name: 'personalitySystem', feature: 'Personality System' },
            { name: 'adaptiveAI', feature: 'Adaptive AI' }
        ];

        aiSystems.forEach(system => {
            if (!window[system.name]) {
                scanResults.missingAI.push({
                    system: system.name,
                    feature: system.feature,
                    status: 'Not loaded'
                });
            }
        });

        // Check AI-related UI elements
        const aiElements = [
            { selector: '#ai-chat-input', feature: 'AI Chat Input' },
            { selector: '.ai-suggestion', feature: 'AI Suggestions' },
            { selector: '.ai-insights', feature: 'AI Insights' },
            { selector: '#dailyCoachingTip', feature: 'Daily AI Tips' }
        ];

        aiElements.forEach(element => {
            if (!document.querySelector(element.selector)) {
                scanResults.missingAI.push({
                    element: element.selector,
                    feature: element.feature,
                    status: 'UI element missing'
                });
            }
        });

        console.log(`Found ${scanResults.missingAI.length} missing AI integrations`);
    }

    // 5. Scan for Missing Personalization
    function scanPersonalization() {
        console.log('\n5️⃣ Scanning Personalization Features...');

        // Check user profile data
        const profileKeys = ['userProfile', 'personality', 'preferences', 'goals', 'habits'];
        
        profileKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (!data || data === '{}' || data === '[]') {
                scanResults.missingPersonalization.push({
                    type: 'Missing user data',
                    key: key,
                    status: 'Empty or not set'
                });
            }
        });

        // Check personalization features
        const features = [
            { check: () => window.moodTracker, name: 'Mood Tracking' },
            { check: () => window.journeySystem, name: 'Journey System' },
            { check: () => document.querySelector('.personality-badge'), name: 'Personality Display' },
            { check: () => localStorage.getItem('adaptiveSettings'), name: 'Adaptive Settings' }
        ];

        features.forEach(feature => {
            if (!feature.check()) {
                scanResults.missingPersonalization.push({
                    type: 'Missing feature',
                    name: feature.name,
                    status: 'Not implemented'
                });
            }
        });

        console.log(`Found ${scanResults.missingPersonalization.length} missing personalization features`);
    }

    // Helper function to get element path
    function getElementPath(element) {
        const path = [];
        while (element && element.nodeType === 1) {
            let selector = element.tagName.toLowerCase();
            if (element.id) {
                selector += '#' + element.id;
                path.unshift(selector);
                break;
            } else if (element.className) {
                selector += '.' + element.className.split(' ')[0];
            }
            path.unshift(selector);
            element = element.parentNode;
        }
        return path.join(' > ');
    }

    // Generate Report
    function generateReport() {
        console.log('\n📊 DEEP SCAN REPORT\n');
        console.log('=' .repeat(50));

        // Missing CTAs
        if (scanResults.missingCTAs.length > 0) {
            console.log('\n❌ MISSING CTAs:');
            scanResults.missingCTAs.forEach(cta => {
                console.log(`  - ${cta.element}: ${cta.type}`);
                console.log(`    Location: ${cta.location}`);
            });
        }

        // Broken Callbacks
        if (scanResults.brokenCallbacks.length > 0) {
            console.log('\n❌ BROKEN CALLBACKS:');
            scanResults.brokenCallbacks.forEach(cb => {
                console.log(`  - ${cb.element}: Function '${cb.callback}' not found`);
                console.log(`    Location: ${cb.location}`);
            });
        }

        // Memory Leaks
        if (scanResults.memoryLeaks.length > 0) {
            console.log('\n⚠️  POTENTIAL MEMORY LEAKS:');
            scanResults.memoryLeaks.forEach(leak => {
                console.log(`  - ${leak.type}: ${leak.variable}`);
                if (leak.size) console.log(`    Size: ${leak.size}`);
            });
        }

        // Data Leaks
        if (scanResults.dataLeaks.length > 0) {
            console.log('\n🔐 POTENTIAL DATA LEAKS:');
            scanResults.dataLeaks.forEach(leak => {
                console.log(`  - ${leak.type}: ${leak.key || leak.variable}`);
                console.log(`    Preview: ${leak.preview}`);
            });
        }

        // Missing AI
        if (scanResults.missingAI.length > 0) {
            console.log('\n🤖 MISSING AI INTEGRATION:');
            scanResults.missingAI.forEach(ai => {
                console.log(`  - ${ai.feature}: ${ai.status}`);
            });
        }

        // Missing Personalization
        if (scanResults.missingPersonalization.length > 0) {
            console.log('\n👤 MISSING PERSONALIZATION:');
            scanResults.missingPersonalization.forEach(p => {
                console.log(`  - ${p.name || p.key}: ${p.status}`);
            });
        }

        console.log('\n' + '=' .repeat(50));
        console.log('Scan complete. Check console for detailed results.');
        
        return scanResults;
    }

    // Auto-fix function
    window.autoFixIssues = function() {
        console.log('\n🔧 Attempting auto-fixes...');

        // Fix missing CTAs
        scanResults.missingCTAs.forEach(cta => {
            const elements = document.querySelectorAll(cta.location);
            elements.forEach(el => {
                if (el.textContent.includes('Start')) {
                    el.onclick = () => alert('Feature coming soon!');
                }
            });
        });

        // Initialize missing AI systems
        if (!window.aiCoaching && window.AICoaching) {
            window.aiCoaching = new AICoaching();
            console.log('✅ Initialized AI Coaching');
        }

        // Set default personalization data
        if (!localStorage.getItem('userProfile')) {
            localStorage.setItem('userProfile', JSON.stringify({
                name: 'Demo User',
                personality: 'Explorer',
                goals: ['productivity', 'focus'],
                preferences: { theme: 'dark', notifications: true }
            }));
            console.log('✅ Set default user profile');
        }

        console.log('Auto-fix complete');
    };

    // Run all scans
    function runDeepScan() {
        scanCTAsAndCallbacks();
        scanMemoryLeaks();
        scanDataLeaks();
        scanAIIntegration();
        scanPersonalization();
        return generateReport();
    }

    // Make available globally
    window.deepScan = runDeepScan;
    window.scanResults = scanResults;

    // Auto-run after load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(runDeepScan, 2000);
        });
    } else {
        setTimeout(runDeepScan, 2000);
    }

    console.log('✅ Deep Scan Analysis ready. Run deepScan() to scan manually.');
})();
