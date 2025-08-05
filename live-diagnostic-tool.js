// === LIVE DIAGNOSTIC TOOL ===
// This tool provides real-time feedback about the application state
// and communicates results back for analysis

window.LiveDiagnostic = {
    results: {
        timestamp: new Date().toISOString(),
        phase1: { passed: 0, failed: 0, errors: [] },
        phase2: { passed: 0, failed: 0, errors: [] },
        phase3: { passed: 0, failed: 0, errors: [] },
        phase4: { passed: 0, failed: 0, errors: [] },
        console: { errors: [], warnings: [] },
        network: { failed: [], successful: [] },
        modules: { loaded: [], missing: [], errors: [] }
    },

    log(message, type = 'info', phase = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        
        console.log(logMessage);
        
        if (phase) {
            if (type === 'error') {
                this.results[phase].failed++;
                this.results[phase].errors.push(message);
            } else {
                this.results[phase].passed++;
            }
        }
        
        // Also log to a visible element if available
        const logContainer = document.getElementById('diagnostic-log');
        if (logContainer) {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-${type}`;
            logEntry.textContent = logMessage;
            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    },

    testPhase1() {
        this.log('🧪 Testing Phase 1: Core Application...', 'info', 'phase1');
        
        // Test App object
        if (window.app) {
            this.log('✅ App object found', 'success', 'phase1');
        } else {
            this.log('❌ App object not found', 'error', 'phase1');
        }
        
        // Test UI elements
        const dashboard = document.getElementById('dashboard-view');
        if (dashboard && dashboard.style.display !== 'none') {
            this.log('✅ Dashboard visible', 'success', 'phase1');
        } else {
            this.log('❌ Dashboard not visible', 'error', 'phase1');
        }
        
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.style.display !== 'none') {
            this.log('✅ Sidebar visible', 'success', 'phase1');
        } else {
            this.log('❌ Sidebar not visible', 'error', 'phase1');
        }
        
        // Test loading overlay
        const loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay || loadingOverlay.style.display === 'none') {
            this.log('✅ Loading overlay removed', 'success', 'phase1');
        } else {
            this.log('❌ Loading overlay still present', 'error', 'phase1');
        }
    },

    testPhase2() {
        this.log('🧪 Testing Phase 2: Advanced Features...', 'info', 'phase2');
        
        // Test Phase 2 modules
        const modules = [
            'AdvancedAIEnhancement',
            'AdvancedGamification',
            'PersonalityIntegration'
        ];
        
        modules.forEach(module => {
            if (window[module]) {
                this.log(`✅ ${module} module found`, 'success', 'phase2');
                this.results.modules.loaded.push(module);
            } else {
                this.log(`❌ ${module} module not found`, 'error', 'phase2');
                this.results.modules.missing.push(module);
            }
        });
        
        // Test responsive features
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            this.log('✅ Responsive viewport found', 'success', 'phase2');
        } else {
            this.log('❌ Responsive viewport missing', 'error', 'phase2');
        }
    },

    testPhase3() {
        this.log('🧪 Testing Phase 3: Enhanced Features...', 'info', 'phase3');
        
        // Test Phase 3 modules
        const modules = [
            'AdvancedPersonalization',
            'EnhancedAI',
            'Security',
            'Performance',
            'Accessibility'
        ];
        
        modules.forEach(module => {
            if (window[module]) {
                this.log(`✅ ${module} module found`, 'success', 'phase3');
                this.results.modules.loaded.push(module);
            } else {
                this.log(`❌ ${module} module not found`, 'error', 'phase3');
                this.results.modules.missing.push(module);
            }
        });
    },

    testPhase4() {
        this.log('🧪 Testing Phase 4: Gamification & Goals...', 'info', 'phase4');
        
        // Test Phase 4 modules
        const modules = [
            'Phase4Gamification',
            'Phase4Goals',
            'Phase4HabitsFocus'
        ];
        
        modules.forEach(module => {
            if (window[module]) {
                this.log(`✅ ${module} module found`, 'success', 'phase4');
                this.results.modules.loaded.push(module);
            } else {
                this.log(`❌ ${module} module not found`, 'error', 'phase4');
                this.results.modules.missing.push(module);
            }
        });
        
        // Test gamification features
        if (window.Phase4Gamification && window.Phase4Gamification.getUserLevel) {
            this.log('✅ Gamification system functional', 'success', 'phase4');
        } else {
            this.log('❌ Gamification system not functional', 'error', 'phase4');
        }
    },

    captureConsoleErrors() {
        this.log('🔍 Capturing console errors...', 'info');
        
        // Override console.error to capture errors
        const originalError = console.error;
        console.error = (...args) => {
            const errorMessage = args.join(' ');
            this.results.console.errors.push(errorMessage);
            this.log(`❌ Console Error: ${errorMessage}`, 'error');
            originalError.apply(console, args);
        };
        
        // Override console.warn to capture warnings
        const originalWarn = console.warn;
        console.warn = (...args) => {
            const warningMessage = args.join(' ');
            this.results.console.warnings.push(warningMessage);
            this.log(`⚠️ Console Warning: ${warningMessage}`, 'warning');
            originalWarn.apply(console, args);
        };
    },

    captureNetworkErrors() {
        this.log('🔍 Monitoring network requests...', 'info');
        
        // Monitor failed network requests
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            return originalFetch.apply(window, args)
                .then(response => {
                    if (!response.ok) {
                        this.results.network.failed.push(args[0]);
                        this.log(`❌ Network Error: ${args[0]} - ${response.status}`, 'error');
                    } else {
                        this.results.network.successful.push(args[0]);
                    }
                    return response;
                })
                .catch(error => {
                    this.results.network.failed.push(args[0]);
                    this.log(`❌ Network Error: ${args[0]} - ${error.message}`, 'error');
                    throw error;
                });
        };
    },

    createDiagnosticUI() {
        // Create diagnostic overlay
        const overlay = document.createElement('div');
        overlay.id = 'diagnostic-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            max-height: 80vh;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border: 2px solid #f97316;
            border-radius: 10px;
            z-index: 10000;
            font-family: monospace;
            font-size: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #f97316;
            color: white;
            padding: 10px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>🔍 Live Diagnostic</span>
            <button onclick="document.getElementById('diagnostic-overlay').remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">×</button>
        `;
        
        // Controls
        const controls = document.createElement('div');
        controls.style.cssText = `
            padding: 10px;
            border-bottom: 1px solid #333;
            display: flex;
            gap: 5px;
        `;
        controls.innerHTML = `
            <button onclick="window.LiveDiagnostic.runAllTests()" style="background: #10b981; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Run All</button>
            <button onclick="window.LiveDiagnostic.exportResults()" style="background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Export</button>
            <button onclick="window.LiveDiagnostic.clearLog()" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Clear</button>
        `;
        
        // Log container
        const logContainer = document.createElement('div');
        logContainer.id = 'diagnostic-log';
        logContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            max-height: 400px;
        `;
        
        // Summary
        const summary = document.createElement('div');
        summary.id = 'diagnostic-summary';
        summary.style.cssText = `
            padding: 10px;
            border-top: 1px solid #333;
            background: rgba(255, 255, 255, 0.1);
        `;
        
        overlay.appendChild(header);
        overlay.appendChild(controls);
        overlay.appendChild(logContainer);
        overlay.appendChild(summary);
        
        document.body.appendChild(overlay);
        
        this.log('🔧 Diagnostic UI created', 'success');
    },

    runAllTests() {
        this.log('🚀 Starting comprehensive diagnostic...', 'info');
        this.results.timestamp = new Date().toISOString();
        
        // Reset results
        Object.keys(this.results).forEach(key => {
            if (key !== 'timestamp' && key !== 'console' && key !== 'network' && key !== 'modules') {
                this.results[key] = { passed: 0, failed: 0, errors: [] };
            }
        });
        this.results.modules = { loaded: [], missing: [], errors: [] };
        
        // Run tests
        setTimeout(() => this.testPhase1(), 100);
        setTimeout(() => this.testPhase2(), 200);
        setTimeout(() => this.testPhase3(), 300);
        setTimeout(() => this.testPhase4(), 400);
        setTimeout(() => this.updateSummary(), 500);
    },

    updateSummary() {
        const summary = document.getElementById('diagnostic-summary');
        if (!summary) return;
        
        const totalPassed = Object.values(this.results)
            .filter(r => r.passed !== undefined)
            .reduce((sum, r) => sum + r.passed, 0);
        
        const totalFailed = Object.values(this.results)
            .filter(r => r.failed !== undefined)
            .reduce((sum, r) => sum + r.failed, 0);
        
        const successRate = totalPassed + totalFailed > 0 ? 
            Math.round((totalPassed / (totalPassed + totalFailed)) * 100) : 0;
        
        summary.innerHTML = `
            <strong>📊 Summary:</strong><br>
            ✅ Passed: ${totalPassed} | ❌ Failed: ${totalFailed}<br>
            📈 Success Rate: ${successRate}%<br>
            🔧 Modules Loaded: ${this.results.modules.loaded.length}<br>
            ⚠️ Console Errors: ${this.results.console.errors.length}
        `;
    },

    exportResults() {
        const dataStr = JSON.stringify(this.results, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `diagnostic-results-${new Date().toISOString().slice(0, 19)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        this.log('📁 Results exported to JSON file', 'success');
    },

    clearLog() {
        const logContainer = document.getElementById('diagnostic-log');
        if (logContainer) {
            logContainer.innerHTML = '';
        }
        this.log('🧹 Log cleared', 'info');
    },

    init() {
        this.log('🔧 Initializing Live Diagnostic Tool...', 'info');
        
        // Capture console and network errors
        this.captureConsoleErrors();
        this.captureNetworkErrors();
        
        // Create UI after a short delay
        setTimeout(() => {
            this.createDiagnosticUI();
            this.runAllTests();
        }, 1000);
        
        this.log('✅ Live Diagnostic Tool initialized', 'success');
    }
};

// Auto-initialize when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.LiveDiagnostic.init(), 500);
    });
} else {
    setTimeout(() => window.LiveDiagnostic.init(), 500);
}

// Expose to global scope
window.LiveDiagnostic = window.LiveDiagnostic; 