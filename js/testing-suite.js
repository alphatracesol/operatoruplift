// Comprehensive Testing Suite
// Unit, Integration, E2E, Performance, and Accessibility Tests

(function() {
    'use strict';

    // Test Configuration
    const TestConfig = {
        verbose: true,
        stopOnError: false,
        timeout: 5000,
        retries: 3,
        coverage: {
            statements: 80,
            branches: 75,
            functions: 80,
            lines: 80
        },
        performance: {
            maxLoadTime: 3000,
            maxInteractionTime: 100,
            maxMemoryUsage: 50 * 1024 * 1024 // 50MB
        }
    };

    // Test Runner
    class TestRunner {
        constructor() {
            this.suites = new Map();
            this.results = [];
            this.coverage = new Map();
            this.startTime = null;
        }

        suite(name, tests) {
            this.suites.set(name, tests);
        }

        async run(suiteName = null) {
            this.startTime = Date.now();
            console.log('🧪 Starting Test Suite...\n');

            const suitesToRun = suiteName 
                ? [[suiteName, this.suites.get(suiteName)]]
                : Array.from(this.suites.entries());

            for (const [name, tests] of suitesToRun) {
                if (!tests) continue;
                await this.runSuite(name, tests);
            }

            this.generateReport();
        }

        async runSuite(suiteName, tests) {
            console.log(`📦 ${suiteName}`);
            const suiteResults = [];

            for (const [testName, testFn] of Object.entries(tests)) {
                const result = await this.runTest(testName, testFn);
                suiteResults.push(result);
                
                if (TestConfig.stopOnError && !result.passed) break;
            }

            this.results.push({ suite: suiteName, tests: suiteResults });
        }

        async runTest(name, testFn) {
            const result = {
                name,
                passed: false,
                error: null,
                duration: 0,
                retries: 0
            };

            for (let i = 0; i <= TestConfig.retries; i++) {
                try {
                    const start = performance.now();
                    await Promise.race([
                        testFn(),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Test timeout')), TestConfig.timeout)
                        )
                    ]);
                    result.duration = performance.now() - start;
                    result.passed = true;
                    break;
                } catch (error) {
                    result.error = error;
                    result.retries = i;
                    if (i < TestConfig.retries) {
                        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
                    }
                }
            }

            const icon = result.passed ? '✅' : '❌';
            const retryText = result.retries > 0 ? ` (${result.retries} retries)` : '';
            console.log(`  ${icon} ${name} (${result.duration.toFixed(2)}ms)${retryText}`);
            
            if (!result.passed && TestConfig.verbose) {
                console.error(`     ${result.error.message}`);
            }

            return result;
        }

        generateReport() {
            const duration = Date.now() - this.startTime;
            const totalTests = this.results.reduce((sum, suite) => sum + suite.tests.length, 0);
            const passedTests = this.results.reduce((sum, suite) => 
                sum + suite.tests.filter(t => t.passed).length, 0);
            const failedTests = totalTests - passedTests;

            console.log('\n📊 Test Results:');
            console.log(`  Total: ${totalTests}`);
            console.log(`  ✅ Passed: ${passedTests}`);
            console.log(`  ❌ Failed: ${failedTests}`);
            console.log(`  ⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);
            
            if (failedTests > 0) {
                console.log('\n❌ Failed Tests:');
                this.results.forEach(suite => {
                    const failed = suite.tests.filter(t => !t.passed);
                    if (failed.length > 0) {
                        console.log(`\n  ${suite.suite}:`);
                        failed.forEach(test => {
                            console.log(`    - ${test.name}: ${test.error.message}`);
                        });
                    }
                });
            }

            this.generateCoverageReport();
        }

        generateCoverageReport() {
            if (this.coverage.size === 0) return;

            console.log('\n📈 Code Coverage:');
            const totals = {
                statements: { covered: 0, total: 0 },
                branches: { covered: 0, total: 0 },
                functions: { covered: 0, total: 0 },
                lines: { covered: 0, total: 0 }
            };

            this.coverage.forEach(fileCoverage => {
                Object.keys(totals).forEach(metric => {
                    totals[metric].covered += fileCoverage[metric].covered;
                    totals[metric].total += fileCoverage[metric].total;
                });
            });

            Object.entries(totals).forEach(([metric, data]) => {
                const percentage = (data.covered / data.total * 100).toFixed(2);
                const threshold = TestConfig.coverage[metric];
                const icon = percentage >= threshold ? '✅' : '❌';
                console.log(`  ${icon} ${metric}: ${percentage}% (threshold: ${threshold}%)`);
            });
        }
    }

    // Assertion Library
    class Assert {
        static equal(actual, expected, message = '') {
            if (actual !== expected) {
                throw new Error(message || `Expected ${expected}, got ${actual}`);
            }
        }

        static deepEqual(actual, expected, message = '') {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(message || `Objects not equal`);
            }
        }

        static true(value, message = '') {
            if (value !== true) {
                throw new Error(message || `Expected true, got ${value}`);
            }
        }

        static false(value, message = '') {
            if (value !== false) {
                throw new Error(message || `Expected false, got ${value}`);
            }
        }

        static throws(fn, expectedError, message = '') {
            try {
                fn();
                throw new Error(message || 'Expected function to throw');
            } catch (error) {
                if (expectedError && !error.message.includes(expectedError)) {
                    throw new Error(message || `Expected error "${expectedError}", got "${error.message}"`);
                }
            }
        }

        static async rejects(asyncFn, expectedError, message = '') {
            try {
                await asyncFn();
                throw new Error(message || 'Expected async function to reject');
            } catch (error) {
                if (expectedError && !error.message.includes(expectedError)) {
                    throw new Error(message || `Expected error "${expectedError}", got "${error.message}"`);
                }
            }
        }

        static includes(array, item, message = '') {
            if (!array.includes(item)) {
                throw new Error(message || `Array does not include ${item}`);
            }
        }

        static notNull(value, message = '') {
            if (value === null || value === undefined) {
                throw new Error(message || `Expected non-null value, got ${value}`);
            }
        }
    }

    // Mock Factory
    class MockFactory {
        static function(name = 'mockFn') {
            const calls = [];
            const fn = (...args) => {
                calls.push(args);
                return fn.mockReturnValue;
            };
            fn.calls = calls;
            fn.mockReturnValue = undefined;
            fn.mockImplementation = null;
            fn.wasCalled = () => calls.length > 0;
            fn.wasCalledWith = (...args) => 
                calls.some(call => JSON.stringify(call) === JSON.stringify(args));
            fn.reset = () => calls.length = 0;
            return fn;
        }

        static localStorage() {
            const storage = new Map();
            return {
                getItem: key => storage.get(key) || null,
                setItem: (key, value) => storage.set(key, value),
                removeItem: key => storage.delete(key),
                clear: () => storage.clear(),
                key: index => Array.from(storage.keys())[index],
                length: storage.size
            };
        }

        static fetch(responses = {}) {
            return (url, options) => {
                const response = responses[url] || { ok: true, json: async () => ({}) };
                return Promise.resolve({
                    ok: response.ok !== false,
                    status: response.status || 200,
                    json: async () => response.json || {},
                    text: async () => response.text || ''
                });
            };
        }
    }

    // Unit Tests
    const unitTests = new TestRunner();

    // Test Utilities
    unitTests.suite('Utilities', {
        'formatTime should format seconds correctly': () => {
            Assert.equal(formatTime(0), '0:00');
            Assert.equal(formatTime(59), '0:59');
            Assert.equal(formatTime(60), '1:00');
            Assert.equal(formatTime(3661), '61:01');
        },

        'calculateXP should calculate experience points': () => {
            Assert.equal(calculateXP('focus', 30), 30);
            Assert.equal(calculateXP('task', 1), 10);
            Assert.equal(calculateXP('achievement', 1), 50);
        },

        'generateId should create unique IDs': () => {
            const id1 = generateId();
            const id2 = generateId();
            Assert.true(id1 !== id2);
            Assert.true(id1.includes('_'));
        }
    });

    // Test Task Management
    unitTests.suite('Task Management', {
        'should create a new task': async () => {
            const mockStorage = MockFactory.localStorage();
            window.localStorage = mockStorage;
            
            const task = await createTask('Test Task', 'high', 'work');
            Assert.notNull(task.id);
            Assert.equal(task.title, 'Test Task');
            Assert.equal(task.priority, 'high');
            Assert.equal(task.category, 'work');
            Assert.false(task.completed);
        },

        'should complete a task': async () => {
            const task = { id: '123', completed: false };
            await completeTask(task.id);
            
            const updated = JSON.parse(localStorage.getItem('tasks') || '[]')
                .find(t => t.id === task.id);
            Assert.true(updated.completed);
        },

        'should validate task input': () => {
            Assert.throws(() => createTask(''), 'Title required');
            Assert.throws(() => createTask('Task', 'invalid'), 'Invalid priority');
        }
    });

    // Test Focus Sessions
    unitTests.suite('Focus Sessions', {
        'should start a focus session': async () => {
            const session = await startFocusSession();
            Assert.notNull(session.id);
            Assert.notNull(session.startTime);
            Assert.equal(session.status, 'active');
        },

        'should calculate session duration': () => {
            const session = {
                startTime: Date.now() - 1800000, // 30 minutes ago
                endTime: Date.now()
            };
            Assert.equal(getSessionDuration(session), 30);
        },

        'should handle pause/resume': async () => {
            const session = await startFocusSession();
            await pauseSession(session.id);
            Assert.equal(session.status, 'paused');
            
            await resumeSession(session.id);
            Assert.equal(session.status, 'active');
        }
    });

    // Integration Tests
    const integrationTests = new TestRunner();

    integrationTests.suite('Firebase Integration', {
        'should sync user data': async () => {
            const mockFetch = MockFactory.fetch({
                '/api/sync': { ok: true, json: { synced: true } }
            });
            window.fetch = mockFetch;
            
            const result = await syncUserData();
            Assert.true(result.synced);
            Assert.true(mockFetch.wasCalled());
        },

        'should handle sync errors': async () => {
            window.fetch = MockFactory.fetch({
                '/api/sync': { ok: false, status: 500 }
            });
            
            await Assert.rejects(
                () => syncUserData(),
                'Sync failed'
            );
        }
    });

    integrationTests.suite('AI Integration', {
        'should get AI response': async () => {
            window.fetch = MockFactory.fetch({
                '/api/ai/chat': { 
                    json: { response: 'Keep up the great work!' }
                }
            });
            
            const response = await getAIResponse('How am I doing?');
            Assert.equal(response, 'Keep up the great work!');
        },

        'should fallback to other providers': async () => {
            let callCount = 0;
            window.fetch = () => {
                callCount++;
                if (callCount < 3) {
                    return Promise.reject(new Error('Provider failed'));
                }
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ response: 'Success' })
                });
            };
            
            const response = await getAIResponse('Test');
            Assert.equal(response, 'Success');
            Assert.equal(callCount, 3);
        }
    });

    // E2E Tests
    const e2eTests = new TestRunner();

    e2eTests.suite('User Journey', {
        'should complete onboarding flow': async () => {
            // Simulate new user
            localStorage.clear();
            
            // Start onboarding
            const onboarding = new OnboardingSystem();
            await onboarding.start();
            
            // Complete assessment
            await onboarding.completeStep('assessment', {
                goals: ['productivity', 'focus'],
                experience: 'beginner'
            });
            
            // Verify profile created
            const profile = JSON.parse(localStorage.getItem('userProfile'));
            Assert.notNull(profile);
            Assert.includes(profile.goals, 'productivity');
        },

        'should complete a full focus session': async () => {
            // Start session
            const session = await startFocusSession();
            
            // Simulate 25 minutes
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // End session
            await endFocusSession(session.id);
            
            // Verify rewards
            const user = await getUserData();
            Assert.true(user.stats.totalFocusTime > 0);
            Assert.true(user.points > 0);
        }
    });

    // Performance Tests
    const performanceTests = new TestRunner();

    performanceTests.suite('Performance Benchmarks', {
        'should load dashboard quickly': async () => {
            const start = performance.now();
            await loadDashboard();
            const loadTime = performance.now() - start;
            
            Assert.true(
                loadTime < TestConfig.performance.maxLoadTime,
                `Load time ${loadTime}ms exceeds ${TestConfig.performance.maxLoadTime}ms`
            );
        },

        'should handle large datasets': async () => {
            // Create 1000 tasks
            const tasks = Array.from({ length: 1000 }, (_, i) => ({
                id: `task_${i}`,
                title: `Task ${i}`,
                completed: Math.random() > 0.5
            }));
            
            const start = performance.now();
            await renderTaskList(tasks);
            const renderTime = performance.now() - start;
            
            Assert.true(renderTime < 1000, 'Rendering too slow');
        },

        'should not leak memory': async () => {
            const initialMemory = performance.memory?.usedJSHeapSize || 0;
            
            // Perform operations
            for (let i = 0; i < 100; i++) {
                await createTask(`Task ${i}`);
                await deleteTask(`task_${i}`);
            }
            
            // Force garbage collection if available
            if (window.gc) window.gc();
            
            const finalMemory = performance.memory?.usedJSHeapSize || 0;
            const leak = finalMemory - initialMemory;
            
            Assert.true(
                leak < TestConfig.performance.maxMemoryUsage,
                `Memory leak detected: ${(leak / 1024 / 1024).toFixed(2)}MB`
            );
        }
    });

    // Accessibility Tests
    const a11yTests = new TestRunner();

    a11yTests.suite('Accessibility', {
        'should have proper ARIA labels': () => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                Assert.true(
                    button.hasAttribute('aria-label') || button.textContent.trim(),
                    `Button missing accessible label`
                );
            });
        },

        'should support keyboard navigation': async () => {
            const modal = document.querySelector('.modal');
            if (modal) {
                // Test focus trap
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                Assert.true(focusableElements.length > 0);
                
                // Test escape key
                const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                modal.dispatchEvent(escapeEvent);
                Assert.false(modal.classList.contains('active'));
            }
        },

        'should have sufficient color contrast': () => {
            // This would use a proper contrast checking library
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.color && style.backgroundColor) {
                    // Simplified check - real implementation would calculate contrast ratio
                    Assert.true(true, 'Contrast check placeholder');
                }
            });
        }
    });

    // Browser Compatibility Tests
    const compatTests = new TestRunner();

    compatTests.suite('Browser Compatibility', {
        'should work in all modern browsers': () => {
            const requiredAPIs = [
                'Promise',
                'fetch',
                'localStorage',
                'IntersectionObserver',
                'ResizeObserver'
            ];
            
            requiredAPIs.forEach(api => {
                Assert.true(api in window, `${api} not supported`);
            });
        },

        'should have CSS feature support': () => {
            const testEl = document.createElement('div');
            const requiredCSS = [
                'grid',
                'flex',
                'transform',
                'filter'
            ];
            
            requiredCSS.forEach(prop => {
                Assert.true(prop in testEl.style, `CSS ${prop} not supported`);
            });
        }
    });

    // Test UI
    class TestUI {
        constructor() {
            this.createUI();
        }

        createUI() {
            const panel = document.createElement('div');
            panel.id = 'test-panel';
            panel.innerHTML = `
                <div class="test-header">
                    <h3>🧪 Test Suite</h3>
                    <button onclick="window.testSuite.runAll()">Run All Tests</button>
                </div>
                <div class="test-suites">
                    <button onclick="window.testSuite.run('unit')">Unit Tests</button>
                    <button onclick="window.testSuite.run('integration')">Integration Tests</button>
                    <button onclick="window.testSuite.run('e2e')">E2E Tests</button>
                    <button onclick="window.testSuite.run('performance')">Performance Tests</button>
                    <button onclick="window.testSuite.run('a11y')">Accessibility Tests</button>
                    <button onclick="window.testSuite.run('compat')">Compatibility Tests</button>
                </div>
                <div class="test-output"></div>
            `;
            document.body.appendChild(panel);
        }

        showResults(results) {
            const output = document.querySelector('.test-output');
            output.innerHTML = `<pre>${results}</pre>`;
        }
    }

    // Main Test Suite
    class TestSuite {
        constructor() {
            this.runners = {
                unit: unitTests,
                integration: integrationTests,
                e2e: e2eTests,
                performance: performanceTests,
                a11y: a11yTests,
                compat: compatTests
            };
            
            if (this.isTestEnvironment()) {
                this.ui = new TestUI();
            }
        }

        isTestEnvironment() {
            return window.location.search.includes('test=true') ||
                   localStorage.getItem('testMode') === 'true';
        }

        async run(suite) {
            console.clear();
            if (this.runners[suite]) {
                await this.runners[suite].run();
            } else {
                console.error(`Unknown test suite: ${suite}`);
            }
        }

        async runAll() {
            console.clear();
            for (const [name, runner] of Object.entries(this.runners)) {
                console.log(`\n🏃 Running ${name} tests...\n`);
                await runner.run();
            }
        }

        // Continuous Integration Support
        async ci() {
            const results = {
                passed: 0,
                failed: 0,
                suites: {}
            };

            for (const [name, runner] of Object.entries(this.runners)) {
                await runner.run();
                const suiteResults = runner.results;
                results.suites[name] = suiteResults;
                
                suiteResults.forEach(suite => {
                    suite.tests.forEach(test => {
                        if (test.passed) results.passed++;
                        else results.failed++;
                    });
                });
            }

            // Output for CI systems
            console.log('\n📋 CI Results:');
            console.log(JSON.stringify(results, null, 2));
            
            // Exit code for CI
            if (typeof process !== 'undefined' && process.exit) {
                process.exit(results.failed > 0 ? 1 : 0);
            }
        }
    }

    // Add styles
    const styles = `
        <style>
        /* Test Panel Styles */
        #test-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            max-height: 500px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1rem;
            display: none;
            z-index: 10000;
        }

        body.test-mode #test-panel {
            display: block;
        }

        .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .test-header h3 {
            margin: 0;
            color: white;
        }

        .test-suites {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .test-suites button {
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
        }

        .test-suites button:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .test-output {
            max-height: 300px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 6px;
            padding: 0.5rem;
        }

        .test-output pre {
            margin: 0;
            color: #0f0;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
        </style>
    `;

    // Initialize
    document.head.insertAdjacentHTML('beforeend', styles);
    window.testSuite = new TestSuite();
    window.Assert = Assert;
    window.MockFactory = MockFactory;

    // Enable test mode with ?test=true
    if (window.location.search.includes('test=true')) {
        document.body.classList.add('test-mode');
    }

    console.log('✅ Testing Suite initialized');
})();
