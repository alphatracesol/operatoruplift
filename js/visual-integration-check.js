// Visual Integration Verification System
// Ensures all 20 systems are properly displayed in the UI

(function() {
    'use strict';

    class VisualIntegrationChecker {
        constructor() {
            this.systems = [
                { name: 'Journey System', selector: '.journey-card', location: 'Dashboard' },
                { name: 'Mood Tracking', selector: '.mood-check-btn', location: 'Header' },
                { name: 'Streak Protection', selector: '.streak-shield-indicator', location: 'Header Stats' },
                { name: 'Notifications', selector: '.notification-bell', location: 'Header' },
                { name: 'Analytics Dashboard', selector: '[data-view="analytics"]', location: 'Navigation' },
                { name: 'AI Coaching', selector: '.ai-coaching-card', location: 'Dashboard' },
                { name: 'Collaboration', selector: '.team-challenges-card', location: 'Dashboard' },
                { name: 'Reward Marketplace', selector: '.marketplace-btn', location: 'Header Tokens' },
                { name: 'Habit Stacking', selector: '[data-stacking="true"]', location: 'Habits Nav' },
                { name: 'Focus Sessions', selector: '[data-enhanced-focus="true"]', location: 'Burn Nav' },
                { name: 'Goal Templates', selector: '[data-templates="true"]', location: 'Goals Nav' },
                { name: 'Progress Reports', selector: '.weekly-report-card', location: 'Dashboard' },
                { name: 'Backup/Restore', selector: '[data-backup="true"]', location: 'Settings Nav' },
                { name: 'Onboarding', selector: '.onboarding-overlay', location: 'Full Screen (when active)' },
                { name: 'Accessibility', selector: '.a11y-toggle', location: 'Header' },
                { name: 'Offline Mode', selector: '.offline-indicator', location: 'Header (when offline)' },
                { name: 'Integrations', selector: '[data-integrations="true"]', location: 'Settings Nav' },
                { name: 'Performance Monitor', selector: '.performance-widget', location: 'Bottom Left (dev mode)' },
                { name: 'Security', selector: '[data-security="true"]', location: 'Settings Nav' },
                { name: 'Testing Suite', selector: '#test-panel', location: 'Bottom Right (test mode)' }
            ];
        }

        check() {
            console.log('🔍 Visual Integration Check Starting...\n');
            
            const results = {
                found: [],
                missing: [],
                total: this.systems.length
            };

            this.systems.forEach(system => {
                const element = document.querySelector(system.selector);
                if (element) {
                    results.found.push(system);
                    console.log(`✅ ${system.name} - Found at ${system.location}`);
                } else {
                    results.missing.push(system);
                    console.log(`❌ ${system.name} - Missing from ${system.location}`);
                }
            });

            console.log(`\n📊 Summary: ${results.found.length}/${results.total} systems visible`);
            
            if (results.missing.length > 0) {
                console.log('\n⚠️  Missing Systems:');
                results.missing.forEach(system => {
                    console.log(`   - ${system.name} (should be in ${system.location})`);
                });
                
                console.log('\n💡 Troubleshooting:');
                console.log('1. Make sure all system JS files are loaded');
                console.log('2. Check if complete-ui-integration.js is loaded');
                console.log('3. Some elements only appear in certain conditions:');
                console.log('   - Onboarding: Only for new users');
                console.log('   - Offline indicator: Only when offline');
                console.log('   - Performance widget: Only in dev mode (?dev=true)');
                console.log('   - Test panel: Only in test mode (?test=true)');
            }

            return results;
        }

        async fixMissing() {
            console.log('\n🔧 Attempting to fix missing integrations...');
            
            // Force re-run integration
            if (window.integrateAllSystems) {
                window.integrateAllSystems();
                
                // Wait and recheck
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                console.log('\n🔄 Rechecking after fix attempt...');
                return this.check();
            } else {
                console.error('❌ Integration system not loaded!');
            }
        }

        showVisualReport() {
            const report = document.createElement('div');
            report.className = 'visual-integration-report';
            report.innerHTML = `
                <div class="report-header">
                    <h3>🔍 Visual Integration Report</h3>
                    <button onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="report-content">
                    <div class="report-summary">
                        <h4>System Integration Status</h4>
                    </div>
                    <div class="systems-grid">
                        ${this.systems.map(system => {
                            const found = !!document.querySelector(system.selector);
                            return `
                                <div class="system-status ${found ? 'found' : 'missing'}">
                                    <span class="status-icon">${found ? '✅' : '❌'}</span>
                                    <div class="system-info">
                                        <strong>${system.name}</strong>
                                        <small>${system.location}</small>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="report-actions">
                        <button class="btn btn-primary" onclick="window.integrationChecker.fixMissing()">
                            Fix Missing Systems
                        </button>
                        <button class="btn btn-secondary" onclick="window.integrationChecker.check()">
                            Recheck
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(report);
        }
    }

    // Add styles
    const styles = `
        <style>
        .visual-integration-report {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-primary);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow: hidden;
            z-index: 10000;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .report-header h3 {
            margin: 0;
        }

        .report-header button {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
        }

        .report-content {
            padding: 1.5rem;
            overflow-y: auto;
            max-height: calc(80vh - 80px);
        }

        .report-summary {
            margin-bottom: 1.5rem;
            text-align: center;
        }

        .systems-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .system-status {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .system-status.found {
            border-color: var(--success-color);
            background: rgba(0, 255, 136, 0.1);
        }

        .system-status.missing {
            border-color: var(--error-color);
            background: rgba(255, 68, 68, 0.1);
        }

        .status-icon {
            font-size: 1.2rem;
        }

        .system-info {
            flex: 1;
        }

        .system-info strong {
            display: block;
            margin-bottom: 0.25rem;
        }

        .system-info small {
            color: var(--text-secondary);
            font-size: 0.8rem;
        }

        .report-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        /* Dev Console Command */
        .dev-command {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #0f0;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.8rem;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 9999;
        }

        body.show-dev-hint .dev-command {
            opacity: 1;
        }
        </style>
    `;

    // Add styles
    if (!document.querySelector('#integration-check-styles')) {
        const styleEl = document.createElement('div');
        styleEl.id = 'integration-check-styles';
        styleEl.innerHTML = styles;
        document.head.appendChild(styleEl.firstElementChild);
    }

    // Create global instance
    window.integrationChecker = new VisualIntegrationChecker();

    // Add console command hint
    const devHint = document.createElement('div');
    devHint.className = 'dev-command';
    devHint.innerHTML = 'Console: integrationChecker.check()';
    document.body.appendChild(devHint);

    // Show hint on hover in bottom right
    let hintTimeout;
    document.addEventListener('mousemove', (e) => {
        const threshold = 100;
        const inCorner = e.clientX > window.innerWidth - threshold && 
                        e.clientY > window.innerHeight - threshold;
        
        if (inCorner) {
            document.body.classList.add('show-dev-hint');
            clearTimeout(hintTimeout);
            hintTimeout = setTimeout(() => {
                document.body.classList.remove('show-dev-hint');
            }, 3000);
        }
    });

    // Auto-check after load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const results = window.integrationChecker.check();
            if (results.missing.length > 0) {
                console.log('\n💡 Run integrationChecker.showVisualReport() for visual report');
                console.log('   or integrationChecker.fixMissing() to attempt fixes');
            }
        }, 2000);
    });

    console.log('✅ Visual Integration Checker initialized');
    console.log('   Commands: integrationChecker.check() | .showVisualReport() | .fixMissing()');
})();
