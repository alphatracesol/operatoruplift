/**
 * Performance Monitoring System
 * Tracks metrics, identifies bottlenecks, and provides optimization insights
 */

window.PerformanceMonitoring = {
    // Configuration
    config: {
        enabled: true,
        sampleRate: 1, // 100% sampling
        alertThresholds: {
            pageLoad: 3000, // 3 seconds
            interaction: 100, // 100ms
            memory: 50 * 1024 * 1024, // 50MB
            fps: 30, // 30 FPS minimum
            errorRate: 0.01 // 1% error rate
        },
        reportingInterval: 60000 // 1 minute
    },

    // Metrics storage
    metrics: {
        pageLoad: [],
        interactions: [],
        memory: [],
        fps: [],
        errors: [],
        userFlows: [],
        resources: []
    },

    // Performance observers
    observers: {
        navigation: null,
        resource: null,
        paint: null,
        layoutShift: null,
        longTask: null
    },

    // Initialize monitoring
    initialize() {
        if (!this.config.enabled) return;
        
        this.setupPerformanceObservers();
        this.trackPageLoadMetrics();
        this.setupInteractionTracking();
        this.setupMemoryMonitoring();
        this.setupFPSMonitoring();
        this.setupErrorTracking();
        this.setupReporting();
        this.injectPerformanceMarks();
    },

    // Setup performance observers
    setupPerformanceObservers() {
        // Navigation timing
        if ('PerformanceObserver' in window) {
            // Navigation observer
            try {
                this.observers.navigation = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.processNavigationEntry(entry);
                    }
                });
                this.observers.navigation.observe({ entryTypes: ['navigation'] });
            } catch (e) {
                console.warn('Navigation observer not supported');
            }

            // Resource timing
            try {
                this.observers.resource = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.processResourceEntry(entry);
                    }
                });
                this.observers.resource.observe({ entryTypes: ['resource'] });
            } catch (e) {
                console.warn('Resource observer not supported');
            }

            // Paint timing
            try {
                this.observers.paint = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.processPaintEntry(entry);
                    }
                });
                this.observers.paint.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.warn('Paint observer not supported');
            }

            // Layout shift (CLS)
            try {
                this.observers.layoutShift = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.processLayoutShiftEntry(entry);
                    }
                });
                this.observers.layoutShift.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('Layout shift observer not supported');
            }

            // Long tasks
            try {
                this.observers.longTask = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.processLongTaskEntry(entry);
                    }
                });
                this.observers.longTask.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                console.warn('Long task observer not supported');
            }
        }
    },

    // Track page load metrics
    trackPageLoadMetrics() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0] || performance.timing;
            
            const metrics = {
                timestamp: Date.now(),
                // Core Web Vitals
                lcp: this.getLargestContentfulPaint(),
                fid: this.getFirstInputDelay(),
                cls: this.getCumulativeLayoutShift(),
                // Additional metrics
                ttfb: navigation.responseStart - navigation.requestStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                // Resource metrics
                resources: performance.getEntriesByType('resource').length,
                totalResourceSize: this.calculateTotalResourceSize(),
                // Memory
                memory: performance.memory ? {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
                } : null
            };
            
            this.metrics.pageLoad.push(metrics);
            this.checkPageLoadThresholds(metrics);
            
            // Send beacon
            this.sendMetrics('pageLoad', metrics);
        });
    },

    // Setup interaction tracking
    setupInteractionTracking() {
        // Track clicks
        document.addEventListener('click', (e) => {
            this.trackInteraction('click', e);
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackInteraction('submit', e);
        });

        // Track input changes
        let inputTimer;
        document.addEventListener('input', (e) => {
            clearTimeout(inputTimer);
            inputTimer = setTimeout(() => {
                this.trackInteraction('input', e);
            }, 500);
        });
    },

    // Track interaction
    trackInteraction(type, event) {
        const startTime = performance.now();
        
        // Mark interaction start
        performance.mark(`interaction-${type}-start`);
        
        // Use requestIdleCallback to measure when interaction completes
        requestIdleCallback(() => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            performance.mark(`interaction-${type}-end`);
            performance.measure(
                `interaction-${type}`,
                `interaction-${type}-start`,
                `interaction-${type}-end`
            );
            
            const interaction = {
                type: type,
                target: this.getElementSelector(event.target),
                duration: duration,
                timestamp: Date.now(),
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            };
            
            this.metrics.interactions.push(interaction);
            
            // Check threshold
            if (duration > this.config.alertThresholds.interaction) {
                this.reportSlowInteraction(interaction);
            }
        });
    },

    // Setup memory monitoring
    setupMemoryMonitoring() {
        if (!performance.memory) return;
        
        setInterval(() => {
            const memoryInfo = {
                timestamp: Date.now(),
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                percentUsed: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
            };
            
            this.metrics.memory.push(memoryInfo);
            
            // Keep only last 100 entries
            if (this.metrics.memory.length > 100) {
                this.metrics.memory.shift();
            }
            
            // Check for memory leaks
            this.checkMemoryLeaks();
            
            // Alert if memory usage is high
            if (memoryInfo.usedJSHeapSize > this.config.alertThresholds.memory) {
                this.reportHighMemoryUsage(memoryInfo);
            }
        }, 10000); // Every 10 seconds
    },

    // Setup FPS monitoring
    setupFPSMonitoring() {
        let lastTime = performance.now();
        let frames = 0;
        let fps = 0;
        
        const measureFPS = () => {
            const currentTime = performance.now();
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                
                this.metrics.fps.push({
                    timestamp: Date.now(),
                    fps: fps
                });
                
                // Keep only last 60 entries
                if (this.metrics.fps.length > 60) {
                    this.metrics.fps.shift();
                }
                
                // Alert if FPS is low
                if (fps < this.config.alertThresholds.fps) {
                    this.reportLowFPS(fps);
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    },

    // Setup error tracking
    setupErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.trackError({
                type: 'javascript',
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now()
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError({
                type: 'unhandledRejection',
                message: event.reason?.message || event.reason,
                stack: event.reason?.stack,
                timestamp: Date.now()
            });
        });

        // Resource errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.trackError({
                    type: 'resource',
                    tagName: event.target.tagName,
                    source: event.target.src || event.target.href,
                    message: 'Resource failed to load',
                    timestamp: Date.now()
                });
            }
        }, true);
    },

    // Track error
    trackError(error) {
        this.metrics.errors.push(error);
        
        // Calculate error rate
        const recentErrors = this.metrics.errors.filter(e => 
            e.timestamp > Date.now() - 300000 // Last 5 minutes
        );
        
        const errorRate = recentErrors.length / (this.metrics.interactions.length || 1);
        
        if (errorRate > this.config.alertThresholds.errorRate) {
            this.reportHighErrorRate(errorRate, recentErrors);
        }
        
        // Send error beacon
        this.sendMetrics('error', error);
    },

    // Track user flow
    trackUserFlow(flowName, step) {
        const flow = this.metrics.userFlows.find(f => f.name === flowName && !f.completed);
        
        if (!flow) {
            // Start new flow
            this.metrics.userFlows.push({
                name: flowName,
                steps: [{
                    name: step,
                    timestamp: Date.now(),
                    duration: 0
                }],
                startTime: Date.now(),
                completed: false
            });
        } else {
            // Add step to existing flow
            const lastStep = flow.steps[flow.steps.length - 1];
            lastStep.duration = Date.now() - lastStep.timestamp;
            
            flow.steps.push({
                name: step,
                timestamp: Date.now(),
                duration: 0
            });
            
            // Mark as completed if it's a completion step
            if (step.includes('complete') || step.includes('success')) {
                flow.completed = true;
                flow.totalDuration = Date.now() - flow.startTime;
                
                // Analyze flow
                this.analyzeUserFlow(flow);
            }
        }
    },

    // Process navigation entry
    processNavigationEntry(entry) {
        const metrics = {
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            tcp: entry.connectEnd - entry.connectStart,
            ttfb: entry.responseStart - entry.requestStart,
            download: entry.responseEnd - entry.responseStart,
            domInteractive: entry.domInteractive - entry.domLoading,
            domComplete: entry.domComplete - entry.domInteractive,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            totalTime: entry.loadEventEnd - entry.fetchStart
        };
        
        // Store detailed metrics
        this.metrics.pageLoad.push({
            ...metrics,
            timestamp: Date.now(),
            url: entry.name
        });
    },

    // Process resource entry
    processResourceEntry(entry) {
        const resource = {
            name: entry.name,
            type: entry.initiatorType,
            duration: entry.duration,
            size: entry.transferSize,
            cached: entry.transferSize === 0,
            timestamp: Date.now()
        };
        
        this.metrics.resources.push(resource);
        
        // Alert for slow resources
        if (resource.duration > 1000 && !resource.cached) {
            this.reportSlowResource(resource);
        }
    },

    // Get Core Web Vitals
    getLargestContentfulPaint() {
        let lcp = 0;
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = lastEntry.renderTime || lastEntry.loadTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        return lcp;
    },

    getFirstInputDelay() {
        let fid = 0;
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            fid = entries[0].processingStart - entries[0].startTime;
        }).observe({ entryTypes: ['first-input'] });
        return fid;
    },

    getCumulativeLayoutShift() {
        let cls = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
        return cls;
    },

    // Check for memory leaks
    checkMemoryLeaks() {
        if (this.metrics.memory.length < 10) return;
        
        // Get last 10 measurements
        const recent = this.metrics.memory.slice(-10);
        
        // Check if memory is consistently increasing
        let increasing = true;
        for (let i = 1; i < recent.length; i++) {
            if (recent[i].usedJSHeapSize <= recent[i - 1].usedJSHeapSize) {
                increasing = false;
                break;
            }
        }
        
        if (increasing) {
            const increase = recent[9].usedJSHeapSize - recent[0].usedJSHeapSize;
            const percentIncrease = (increase / recent[0].usedJSHeapSize) * 100;
            
            if (percentIncrease > 20) {
                this.reportMemoryLeak({
                    increase: increase,
                    percentIncrease: percentIncrease,
                    duration: recent[9].timestamp - recent[0].timestamp
                });
            }
        }
    },

    // Generate performance report
    generatePerformanceReport() {
        const report = {
            timestamp: Date.now(),
            summary: {
                avgPageLoad: this.calculateAverage(this.metrics.pageLoad.map(m => m.totalTime || m.loadComplete)),
                avgInteractionTime: this.calculateAverage(this.metrics.interactions.map(i => i.duration)),
                avgMemoryUsage: this.calculateAverage(this.metrics.memory.map(m => m.usedJSHeapSize)),
                avgFPS: this.calculateAverage(this.metrics.fps.map(f => f.fps)),
                errorCount: this.metrics.errors.length,
                errorRate: this.metrics.errors.length / (this.metrics.interactions.length || 1)
            },
            details: {
                slowestPages: this.getSlowentPages(),
                slowestInteractions: this.getSlowestInteractions(),
                commonErrors: this.getCommonErrors(),
                resourceStats: this.getResourceStats()
            },
            recommendations: this.generateRecommendations()
        };
        
        return report;
    },

    // Generate recommendations
    generateRecommendations() {
        const recommendations = [];
        
        // Page load recommendations
        const avgPageLoad = this.calculateAverage(this.metrics.pageLoad.map(m => m.totalTime || m.loadComplete));
        if (avgPageLoad > this.config.alertThresholds.pageLoad) {
            recommendations.push({
                type: 'performance',
                priority: 'high',
                title: 'Slow Page Load',
                description: `Average page load time is ${Math.round(avgPageLoad)}ms. Consider optimizing resources.`,
                actions: [
                    'Enable compression',
                    'Optimize images',
                    'Implement lazy loading',
                    'Use CDN for static assets'
                ]
            });
        }
        
        // Memory recommendations
        const avgMemory = this.calculateAverage(this.metrics.memory.map(m => m.usedJSHeapSize));
        if (avgMemory > this.config.alertThresholds.memory) {
            recommendations.push({
                type: 'memory',
                priority: 'high',
                title: 'High Memory Usage',
                description: 'Application is using significant memory. Check for memory leaks.',
                actions: [
                    'Remove event listeners when components unmount',
                    'Clear timers and intervals',
                    'Limit cached data size',
                    'Use weak references where appropriate'
                ]
            });
        }
        
        // FPS recommendations
        const avgFPS = this.calculateAverage(this.metrics.fps.map(f => f.fps));
        if (avgFPS < this.config.alertThresholds.fps) {
            recommendations.push({
                type: 'rendering',
                priority: 'medium',
                title: 'Low Frame Rate',
                description: `Average FPS is ${Math.round(avgFPS)}. Optimize rendering performance.`,
                actions: [
                    'Reduce DOM manipulations',
                    'Use CSS transforms instead of position changes',
                    'Implement virtual scrolling for long lists',
                    'Debounce scroll and resize handlers'
                ]
            });
        }
        
        return recommendations;
    },

    // Render performance dashboard
    renderPerformanceDashboard() {
        const report = this.generatePerformanceReport();
        
        return `
            <div class="performance-dashboard">
                <h2>⚡ Performance Monitoring</h2>
                
                <div class="performance-summary">
                    <div class="metric-card">
                        <h3>Page Load</h3>
                        <div class="metric-value">${Math.round(report.summary.avgPageLoad)}ms</div>
                        <div class="metric-status ${report.summary.avgPageLoad > this.config.alertThresholds.pageLoad ? 'warning' : 'good'}">
                            ${report.summary.avgPageLoad > this.config.alertThresholds.pageLoad ? '⚠️ Slow' : '✅ Good'}
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <h3>Interactions</h3>
                        <div class="metric-value">${Math.round(report.summary.avgInteractionTime)}ms</div>
                        <div class="metric-status ${report.summary.avgInteractionTime > this.config.alertThresholds.interaction ? 'warning' : 'good'}">
                            ${report.summary.avgInteractionTime > this.config.alertThresholds.interaction ? '⚠️ Slow' : '✅ Fast'}
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <h3>Memory Usage</h3>
                        <div class="metric-value">${this.formatBytes(report.summary.avgMemoryUsage)}</div>
                        <div class="metric-trend">${this.getMemoryTrend()}</div>
                    </div>
                    
                    <div class="metric-card">
                        <h3>Frame Rate</h3>
                        <div class="metric-value">${Math.round(report.summary.avgFPS)} FPS</div>
                        <div class="metric-status ${report.summary.avgFPS < this.config.alertThresholds.fps ? 'warning' : 'good'}">
                            ${report.summary.avgFPS < this.config.alertThresholds.fps ? '⚠️ Low' : '✅ Smooth'}
                        </div>
                    </div>
                </div>
                
                <div class="performance-details">
                    <h3>Performance Details</h3>
                    
                    <div class="detail-section">
                        <h4>Slowest Pages</h4>
                        ${this.renderSlowestPages(report.details.slowestPages)}
                    </div>
                    
                    <div class="detail-section">
                        <h4>Resource Statistics</h4>
                        ${this.renderResourceStats(report.details.resourceStats)}
                    </div>
                    
                    <div class="detail-section">
                        <h4>Error Summary</h4>
                        <p>Total Errors: ${report.summary.errorCount}</p>
                        <p>Error Rate: ${(report.summary.errorRate * 100).toFixed(2)}%</p>
                    </div>
                </div>
                
                <div class="performance-recommendations">
                    <h3>Recommendations</h3>
                    ${this.renderRecommendations(report.recommendations)}
                </div>
            </div>
        `;
    },

    // Helper methods
    calculateAverage(values) {
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    },

    formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    getElementSelector(element) {
        if (!element) return 'unknown';
        
        let selector = element.tagName.toLowerCase();
        if (element.id) {
            selector += '#' + element.id;
        } else if (element.className) {
            selector += '.' + element.className.split(' ').join('.');
        }
        
        return selector;
    },

    calculateTotalResourceSize() {
        return performance.getEntriesByType('resource').reduce((total, resource) => {
            return total + (resource.transferSize || 0);
        }, 0);
    },

    getSlowestPages() {
        return this.metrics.pageLoad
            .sort((a, b) => (b.totalTime || b.loadComplete) - (a.totalTime || a.loadComplete))
            .slice(0, 5);
    },

    getSlowestInteractions() {
        return this.metrics.interactions
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 5);
    },

    getCommonErrors() {
        const errorCounts = {};
        this.metrics.errors.forEach(error => {
            const key = error.message || error.type;
            errorCounts[key] = (errorCounts[key] || 0) + 1;
        });
        
        return Object.entries(errorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([error, count]) => ({ error, count }));
    },

    getResourceStats() {
        const stats = {
            total: this.metrics.resources.length,
            cached: this.metrics.resources.filter(r => r.cached).length,
            avgDuration: this.calculateAverage(this.metrics.resources.map(r => r.duration)),
            totalSize: this.metrics.resources.reduce((sum, r) => sum + (r.size || 0), 0)
        };
        
        stats.cacheRate = stats.total > 0 ? (stats.cached / stats.total * 100).toFixed(1) : 0;
        
        return stats;
    },

    getMemoryTrend() {
        if (this.metrics.memory.length < 2) return '→';
        
        const recent = this.metrics.memory.slice(-10);
        const first = recent[0].usedJSHeapSize;
        const last = recent[recent.length - 1].usedJSHeapSize;
        
        if (last > first * 1.1) return '↑';
        if (last < first * 0.9) return '↓';
        return '→';
    },

    // Send metrics to backend
    sendMetrics(type, data) {
        if (navigator.sendBeacon) {
            const payload = JSON.stringify({
                type: type,
                data: data,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
            
            navigator.sendBeacon('/api/metrics', payload);
        }
    },

    // Setup reporting
    setupReporting() {
        setInterval(() => {
            const report = this.generatePerformanceReport();
            this.sendMetrics('report', report);
        }, this.config.reportingInterval);
    },

    // Alert methods
    reportSlowInteraction(interaction) {
        console.warn('Slow interaction detected:', interaction);
        if (window.showToast) {
            window.showToast(`Slow interaction: ${interaction.duration}ms`, 'warning');
        }
    },

    reportHighMemoryUsage(memoryInfo) {
        console.warn('High memory usage:', memoryInfo);
    },

    reportLowFPS(fps) {
        console.warn('Low FPS:', fps);
    },

    reportHighErrorRate(rate, errors) {
        console.error('High error rate:', rate, errors);
    },

    reportSlowResource(resource) {
        console.warn('Slow resource:', resource);
    },

    reportMemoryLeak(info) {
        console.error('Possible memory leak detected:', info);
        if (window.showToast) {
            window.showToast('Memory leak detected. Please refresh the page.', 'error');
        }
    },

    checkPageLoadThresholds(metrics) {
        if (metrics.loadComplete > this.config.alertThresholds.pageLoad) {
            console.warn('Page load exceeded threshold:', metrics);
        }
    },

    // Inject performance marks
    injectPerformanceMarks() {
        // Mark key application events
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (['DOMContentLoaded', 'load'].includes(type)) {
                const wrappedListener = function(event) {
                    performance.mark(`event-${type}`);
                    return listener.call(this, event);
                };
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }
};

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.PerformanceMonitoring.initialize());
} else {
    window.PerformanceMonitoring.initialize();
}
