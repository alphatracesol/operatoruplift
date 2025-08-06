/**
 * Phase 5: Optimization and Linting Analysis
 * Extracts JavaScript from app.html and performs comprehensive analysis
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Phase 5: Optimization and Linting Analysis Starting...\n');

// Read the app.html file
const appHtmlPath = path.join(__dirname, 'app.html');
let appHtml = '';

try {
    appHtml = fs.readFileSync(appHtmlPath, 'utf8');
    console.log('✅ Successfully loaded app.html');
} catch (error) {
    console.error('❌ Failed to load app.html:', error.message);
    process.exit(1);
}

// Extract JavaScript from app.html
function extractJavaScript(html) {
    const jsBlocks = [];
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    
    while ((match = scriptRegex.exec(html)) !== null) {
        if (match[1].trim()) {
            jsBlocks.push({
                content: match[1].trim(),
                startIndex: match.index,
                endIndex: match.index + match[0].length
            });
        }
    }
    
    return jsBlocks;
}

// Extract inline JavaScript from onclick, onload, etc.
function extractInlineJavaScript(html) {
    const inlineJs = [];
    const inlineRegex = /(on\w+)\s*=\s*["']([^"']*)["']/gi;
    let match;
    
    while ((match = inlineRegex.exec(html)) !== null) {
        if (match[2].trim()) {
            inlineJs.push({
                event: match[1],
                code: match[2].trim(),
                index: match.index
            });
        }
    }
    
    return inlineJs;
}

// Analyze JavaScript for common issues
function analyzeJavaScript(jsBlocks, inlineJs) {
    const analysis = {
        totalLines: 0,
        issues: [],
        optimizations: [],
        performance: [],
        security: [],
        unused: [],
        inconsistencies: []
    };
    
    // Analyze script blocks
    jsBlocks.forEach((block, index) => {
        const lines = block.content.split('\n');
        analysis.totalLines += lines.length;
        
        // Check for common issues
        lines.forEach((line, lineIndex) => {
            const trimmedLine = line.trim();
            
            // Unused variables
            if (trimmedLine.includes('let ') || trimmedLine.includes('const ') || trimmedLine.includes('var ')) {
                const varMatch = trimmedLine.match(/(let|const|var)\s+(\w+)/);
                if (varMatch && !block.content.includes(varMatch[2] + '.') && !block.content.includes(varMatch[2] + '[')) {
                    analysis.unused.push({
                        type: 'unused-variable',
                        variable: varMatch[2],
                        line: lineIndex + 1,
                        block: index + 1
                    });
                }
            }
            
            // Console statements
            if (trimmedLine.includes('console.')) {
                analysis.issues.push({
                    type: 'console-statement',
                    line: lineIndex + 1,
                    block: index + 1,
                    severity: 'warning'
                });
            }
            
            // Eval usage
            if (trimmedLine.includes('eval(')) {
                analysis.security.push({
                    type: 'eval-usage',
                    line: lineIndex + 1,
                    block: index + 1,
                    severity: 'error'
                });
            }
            
            // Inline event handlers
            if (trimmedLine.includes('onclick=') || trimmedLine.includes('onload=')) {
                analysis.issues.push({
                    type: 'inline-event-handler',
                    line: lineIndex + 1,
                    block: index + 1,
                    severity: 'warning'
                });
            }
            
            // Performance issues
            if (trimmedLine.includes('innerHTML') && !trimmedLine.includes('sanitize')) {
                analysis.performance.push({
                    type: 'unsafe-innerHTML',
                    line: lineIndex + 1,
                    block: index + 1,
                    severity: 'warning'
                });
            }
            
            // Memory leaks
            if (trimmedLine.includes('addEventListener') && !trimmedLine.includes('removeEventListener')) {
                analysis.performance.push({
                    type: 'potential-memory-leak',
                    line: lineIndex + 1,
                    block: index + 1,
                    severity: 'warning'
                });
            }
        });
    });
    
    // Analyze inline JavaScript
    inlineJs.forEach((inline, index) => {
        analysis.issues.push({
            type: 'inline-javascript',
            event: inline.event,
            code: inline.code,
            index: index + 1,
            severity: 'warning'
        });
    });
    
    return analysis;
}

// Performance optimization recommendations
function generateOptimizationRecommendations(analysis) {
    const recommendations = {
        debouncing: [],
        throttling: [],
        lazyLoading: [],
        memoryManagement: [],
        codeSplitting: [],
        caching: []
    };
    
    // Check for scroll/resize events that need debouncing
    if (appHtml.includes('scroll') || appHtml.includes('resize')) {
        recommendations.debouncing.push({
            type: 'scroll-resize-events',
            description: 'Add debouncing to scroll and resize event handlers',
            priority: 'high'
        });
    }
    
    // Check for frequent DOM queries
    if (appHtml.includes('getElementById') || appHtml.includes('querySelector')) {
        recommendations.caching.push({
            type: 'dom-caching',
            description: 'Cache DOM element references instead of repeated queries',
            priority: 'medium'
        });
    }
    
    // Check for large functions that could be split
    const largeFunctions = appHtml.match(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]{500,}\}/g);
    if (largeFunctions) {
        recommendations.codeSplitting.push({
            type: 'large-functions',
            description: 'Split large functions into smaller, more manageable pieces',
            priority: 'medium'
        });
    }
    
    // Check for missing error handling
    if (appHtml.includes('fetch(') && !appHtml.includes('.catch(')) {
        recommendations.memoryManagement.push({
            type: 'error-handling',
            description: 'Add proper error handling to async operations',
            priority: 'high'
        });
    }
    
    return recommendations;
}

// Extract and analyze JavaScript
console.log('📊 Extracting JavaScript from app.html...\n');

const jsBlocks = extractJavaScript(appHtml);
const inlineJs = extractInlineJavaScript(appHtml);

console.log(`📈 Found ${jsBlocks.length} script blocks and ${inlineJs.length} inline JavaScript handlers\n`);

// Analyze the JavaScript
const analysis = analyzeJavaScript(jsBlocks, inlineJs);
const recommendations = generateOptimizationRecommendations(analysis);

// Generate comprehensive report
console.log('🔍 ANALYSIS RESULTS:\n');
console.log(`📊 Total JavaScript Lines: ${analysis.totalLines}`);
console.log(`⚠️  Issues Found: ${analysis.issues.length}`);
console.log(`🔒 Security Issues: ${analysis.security.length}`);
console.log(`⚡ Performance Issues: ${analysis.performance.length}`);
console.log(`🗑️  Unused Variables: ${analysis.unused.length}\n`);

// Report issues by category
if (analysis.issues.length > 0) {
    console.log('🚨 ISSUES FOUND:\n');
    analysis.issues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.type}`);
        if (issue.line) console.log(`   Line: ${issue.line}, Block: ${issue.block}`);
        if (issue.event) console.log(`   Event: ${issue.event}`);
        if (issue.code) console.log(`   Code: ${issue.code}`);
        console.log('');
    });
}

if (analysis.security.length > 0) {
    console.log('🔒 SECURITY ISSUES:\n');
    analysis.security.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.type}`);
        console.log(`   Line: ${issue.line}, Block: ${issue.block}`);
        console.log('');
    });
}

if (analysis.performance.length > 0) {
    console.log('⚡ PERFORMANCE ISSUES:\n');
    analysis.performance.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.type}`);
        console.log(`   Line: ${issue.line}, Block: ${issue.block}`);
        console.log('');
    });
}

if (analysis.unused.length > 0) {
    console.log('🗑️  UNUSED VARIABLES:\n');
    analysis.unused.forEach((issue, index) => {
        console.log(`${index + 1}. Variable: ${issue.variable}`);
        console.log(`   Line: ${issue.line}, Block: ${issue.block}`);
        console.log('');
    });
}

// Optimization recommendations
console.log('🚀 OPTIMIZATION RECOMMENDATIONS:\n');

Object.entries(recommendations).forEach(([category, items]) => {
    if (items.length > 0) {
        console.log(`${category.toUpperCase()}:`);
        items.forEach((item, index) => {
            console.log(`  ${index + 1}. [${item.priority.toUpperCase()}] ${item.description}`);
        });
        console.log('');
    }
});

// Specific optimization suggestions
console.log('🔧 SPECIFIC OPTIMIZATIONS TO IMPLEMENT:\n');

// 1. Debouncing and Throttling
console.log('1. DEBOUNCING & THROTTLING:');
console.log('   - Add debouncing to scroll/resize event handlers');
console.log('   - Implement throttling for frequent operations');
console.log('   - Use requestAnimationFrame for smooth animations\n');

// 2. Memory Management
console.log('2. MEMORY MANAGEMENT:');
console.log('   - Remove event listeners when components unmount');
console.log('   - Clear intervals and timeouts');
console.log('   - Use WeakMap/WeakSet for object references\n');

// 3. DOM Optimization
console.log('3. DOM OPTIMIZATION:');
console.log('   - Cache DOM element references');
console.log('   - Use DocumentFragment for bulk DOM operations');
console.log('   - Minimize reflows and repaints\n');

// 4. Code Quality
console.log('4. CODE QUALITY:');
console.log('   - Remove unused variables and functions');
console.log('   - Add proper error handling');
console.log('   - Use consistent naming conventions\n');

// 5. Security
console.log('5. SECURITY:');
console.log('   - Sanitize all user inputs');
console.log('   - Avoid eval() and innerHTML');
console.log('   - Use Content Security Policy\n');

// Performance metrics
console.log('📈 PERFORMANCE METRICS:\n');
console.log(`- JavaScript Size: ~${Math.round(appHtml.length / 1024)}KB`);
console.log(`- Script Blocks: ${jsBlocks.length}`);
console.log(`- Inline Handlers: ${inlineJs.length}`);
console.log(`- Potential Issues: ${analysis.issues.length + analysis.security.length + analysis.performance.length}`);

// Calculate optimization score
const totalIssues = analysis.issues.length + analysis.security.length + analysis.performance.length;
const optimizationScore = Math.max(0, 100 - (totalIssues * 5));
console.log(`- Optimization Score: ${optimizationScore}/100\n`);

console.log('✅ Phase 5 Analysis Complete!');
console.log('📋 Next: Implement the recommended optimizations');

// Export results for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analysis,
        recommendations,
        optimizationScore,
        jsBlocks,
        inlineJs
    };
} 