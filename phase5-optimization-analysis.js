/**
 * Phase 5: Optimization and Linting Analysis
 * Analyzes app.html JavaScript for optimization opportunities
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Phase 5: Optimization and Linting Analysis\n');

// Analysis results
const analysis = {
  performance: {
    bottlenecks: [],
    optimizations: [],
    memoryIssues: []
  },
  codeQuality: {
    lintingIssues: [],
    unusedCode: [],
    inconsistentPatterns: []
  },
  security: {
    vulnerabilities: [],
    dataLeaks: [],
    unsafePatterns: []
  },
  optimization: {
    debounceOpportunities: [],
    throttleOpportunities: [],
    lazyLoadOpportunities: [],
    cachingOpportunities: []
  }
};

// Read app.html
function analyzeAppHtml() {
  try {
    const appHtml = fs.readFileSync('app.html', 'utf8');
    
    // Extract JavaScript sections
    const scriptSections = extractScriptSections(appHtml);
    
    console.log(`📊 Found ${scriptSections.length} JavaScript sections to analyze\n`);
    
    // Analyze each section
    scriptSections.forEach((section, index) => {
      console.log(`🔍 Analyzing JavaScript Section ${index + 1}...`);
      analyzeJavaScriptSection(section, index);
    });
    
    // Generate optimization report
    generateOptimizationReport();
    
  } catch (error) {
    console.error('❌ Error reading app.html:', error.message);
  }
}

// Extract JavaScript sections from HTML
function extractScriptSections(html) {
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  const sections = [];
  let match;
  
  while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1].trim()) {
      sections.push({
        content: match[1].trim(),
        index: match.index
      });
    }
  }
  
  return sections;
}

// Analyze JavaScript section for issues
function analyzeJavaScriptSection(section, index) {
  const code = section.content;
  
  // Performance Analysis
  analyzePerformance(code, index);
  
  // Code Quality Analysis
  analyzeCodeQuality(code, index);
  
  // Security Analysis
  analyzeSecurity(code, index);
  
  // Optimization Opportunities
  analyzeOptimizationOpportunities(code, index);
}

// Performance Analysis
function analyzePerformance(code, sectionIndex) {
  // Check for potential memory leaks
  const memoryLeakPatterns = [
    /addEventListener.*function.*\{/g,
    /setInterval.*function.*\{/g,
    /setTimeout.*function.*\{/g,
    /new\s+Array\(/g,
    /new\s+Object\(/g
  ];
  
  memoryLeakPatterns.forEach((pattern, i) => {
    const matches = code.match(pattern);
    if (matches) {
      analysis.performance.memoryIssues.push({
        section: sectionIndex,
        pattern: pattern.toString(),
        count: matches.length,
        issue: 'Potential memory leak - consider cleanup'
      });
    }
  });
  
  // Check for expensive operations
  const expensiveOperations = [
    /document\.querySelectorAll\(/g,
    /getElementById\(/g,
    /innerHTML\s*=/g,
    /JSON\.parse\(/g,
    /JSON\.stringify\(/g
  ];
  
  expensiveOperations.forEach((pattern, i) => {
    const matches = code.match(pattern);
    if (matches) {
      analysis.performance.bottlenecks.push({
        section: sectionIndex,
        operation: pattern.toString(),
        count: matches.length,
        suggestion: 'Consider caching or optimization'
      });
    }
  });
}

// Code Quality Analysis
function analyzeCodeQuality(code, sectionIndex) {
  // Check for unused variables
  const varDeclarations = code.match(/const\s+(\w+)|let\s+(\w+)|var\s+(\w+)/g);
  if (varDeclarations) {
    const declaredVars = varDeclarations.map(decl => {
      const match = decl.match(/(?:const|let|var)\s+(\w+)/);
      return match ? match[1] : null;
    }).filter(Boolean);
    
    declaredVars.forEach(varName => {
      const usageCount = (code.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length;
      if (usageCount <= 1) {
        analysis.codeQuality.unusedCode.push({
          section: sectionIndex,
          variable: varName,
          usageCount,
          issue: 'Potentially unused variable'
        });
      }
    });
  }
  
  // Check for inconsistent patterns
  const inconsistentPatterns = [
    { pattern: /function\s+\w+\s*\(/g, name: 'Function declarations' },
    { pattern: /=>\s*\{/g, name: 'Arrow functions' },
    { pattern: /\.forEach\(/g, name: 'forEach loops' },
    { pattern: /for\s*\(/g, name: 'For loops' }
  ];
  
  inconsistentPatterns.forEach(({ pattern, name }) => {
    const matches = code.match(pattern);
    if (matches) {
      analysis.codeQuality.inconsistentPatterns.push({
        section: sectionIndex,
        pattern: name,
        count: matches.length,
        suggestion: 'Consider standardizing patterns'
      });
    }
  });
}

// Security Analysis
function analyzeSecurity(code, sectionIndex) {
  // Check for potential XSS vulnerabilities
  const xssPatterns = [
    /innerHTML\s*=\s*[^;]*\+/g,
    /document\.write\(/g,
    /eval\(/g
  ];
  
  xssPatterns.forEach((pattern, i) => {
    const matches = code.match(pattern);
    if (matches) {
      analysis.security.vulnerabilities.push({
        section: sectionIndex,
        pattern: pattern.toString(),
        count: matches.length,
        risk: 'Potential XSS vulnerability'
      });
    }
  });
  
  // Check for data leaks
  const dataLeakPatterns = [
    /console\.log\([^)]*password[^)]*\)/gi,
    /console\.log\([^)]*api[^)]*key[^)]*\)/gi,
    /console\.log\([^)]*token[^)]*\)/gi
  ];
  
  dataLeakPatterns.forEach((pattern, i) => {
    const matches = code.match(pattern);
    if (matches) {
      analysis.security.dataLeaks.push({
        section: sectionIndex,
        pattern: pattern.toString(),
        count: matches.length,
        risk: 'Potential data leak in console.log'
      });
    }
  });
}

// Optimization Opportunities Analysis
function analyzeOptimizationOpportunities(code, sectionIndex) {
  // Check for debounce opportunities
  const debounceOpportunities = [
    /addEventListener\([^)]*input[^)]*\)/g,
    /addEventListener\([^)]*scroll[^)]*\)/g,
    /addEventListener\([^)]*resize[^)]*\)/g
  ];
  
  debounceOpportunities.forEach((pattern, i) => {
    const matches = code.match(pattern);
    if (matches) {
      analysis.optimization.debounceOpportunities.push({
        section: sectionIndex,
        event: pattern.toString(),
        count: matches.length,
        suggestion: 'Consider debouncing for performance'
      });
    }
  });
  
  // Check for throttle opportunities
  const throttleOpportunities = [
    /setInterval\(/g,
    /setTimeout\(/g
  ];
  
  throttleOpportunities.forEach((pattern, i) => {
    const matches = code.match(pattern);
    if (matches) {
      analysis.optimization.throttleOpportunities.push({
        section: sectionIndex,
        operation: pattern.toString(),
        count: matches.length,
        suggestion: 'Consider throttling for performance'
      });
    }
  });
  
  // Check for lazy loading opportunities
  const lazyLoadOpportunities = [
    /Chart\.js/g,
    /GSAP/g,
    /Tone\.js/g,
    /tsParticles/g
  ];
  
  lazyLoadOpportunities.forEach((pattern, i) => {
    const matches = code.match(pattern);
    if (matches) {
      analysis.optimization.lazyLoadOpportunities.push({
        section: sectionIndex,
        library: pattern.toString(),
        count: matches.length,
        suggestion: 'Consider lazy loading for performance'
      });
    }
  });
  
  // Check for caching opportunities
  const cachingOpportunities = [
    /localStorage\.getItem\(/g,
    /JSON\.parse\(/g,
    /fetch\(/g
  ];
  
  cachingOpportunities.forEach((pattern, i) => {
    const matches = code.match(pattern);
    if (matches) {
      analysis.optimization.cachingOpportunities.push({
        section: sectionIndex,
        operation: pattern.toString(),
        count: matches.length,
        suggestion: 'Consider implementing caching'
      });
    }
  });
}

// Generate optimization report
function generateOptimizationReport() {
  console.log('\n📊 OPTIMIZATION ANALYSIS REPORT\n');
  console.log('=' .repeat(50));
  
  // Performance Issues
  console.log('\n🚨 PERFORMANCE ISSUES:');
  if (analysis.performance.bottlenecks.length > 0) {
    analysis.performance.bottlenecks.forEach(issue => {
      console.log(`  ⚠️  Section ${issue.section}: ${issue.operation} (${issue.count} occurrences)`);
      console.log(`     Suggestion: ${issue.suggestion}`);
    });
  } else {
    console.log('  ✅ No major performance bottlenecks found');
  }
  
  // Memory Issues
  console.log('\n🧠 MEMORY ISSUES:');
  if (analysis.performance.memoryIssues.length > 0) {
    analysis.performance.memoryIssues.forEach(issue => {
      console.log(`  ⚠️  Section ${issue.section}: ${issue.pattern} (${issue.count} occurrences)`);
      console.log(`     Issue: ${issue.issue}`);
    });
  } else {
    console.log('  ✅ No memory leak patterns detected');
  }
  
  // Code Quality Issues
  console.log('\n📝 CODE QUALITY ISSUES:');
  if (analysis.codeQuality.unusedCode.length > 0) {
    analysis.codeQuality.unusedCode.forEach(issue => {
      console.log(`  ⚠️  Section ${issue.section}: Unused variable '${issue.variable}' (used ${issue.usageCount} times)`);
    });
  } else {
    console.log('  ✅ No unused variables detected');
  }
  
  // Security Issues
  console.log('\n🔒 SECURITY ISSUES:');
  if (analysis.security.vulnerabilities.length > 0) {
    analysis.security.vulnerabilities.forEach(issue => {
      console.log(`  ⚠️  Section ${issue.section}: ${issue.pattern} (${issue.count} occurrences)`);
      console.log(`     Risk: ${issue.risk}`);
    });
  } else {
    console.log('  ✅ No security vulnerabilities detected');
  }
  
  // Optimization Opportunities
  console.log('\n⚡ OPTIMIZATION OPPORTUNITIES:');
  
  if (analysis.optimization.debounceOpportunities.length > 0) {
    console.log('  🎯 Debounce Opportunities:');
    analysis.optimization.debounceOpportunities.forEach(opp => {
      console.log(`     Section ${opp.section}: ${opp.event} (${opp.count} occurrences)`);
      console.log(`     Suggestion: ${opp.suggestion}`);
    });
  }
  
  if (analysis.optimization.throttleOpportunities.length > 0) {
    console.log('  🎯 Throttle Opportunities:');
    analysis.optimization.throttleOpportunities.forEach(opp => {
      console.log(`     Section ${opp.section}: ${opp.operation} (${opp.count} occurrences)`);
      console.log(`     Suggestion: ${opp.suggestion}`);
    });
  }
  
  if (analysis.optimization.lazyLoadOpportunities.length > 0) {
    console.log('  🎯 Lazy Load Opportunities:');
    analysis.optimization.lazyLoadOpportunities.forEach(opp => {
      console.log(`     Section ${opp.section}: ${opp.library} (${opp.count} occurrences)`);
      console.log(`     Suggestion: ${opp.suggestion}`);
    });
  }
  
  if (analysis.optimization.cachingOpportunities.length > 0) {
    console.log('  🎯 Caching Opportunities:');
    analysis.optimization.cachingOpportunities.forEach(opp => {
      console.log(`     Section ${opp.section}: ${opp.operation} (${opp.count} occurrences)`);
      console.log(`     Suggestion: ${opp.suggestion}`);
    });
  }
  
  // Summary
  console.log('\n📈 SUMMARY:');
  const totalIssues = 
    analysis.performance.bottlenecks.length +
    analysis.performance.memoryIssues.length +
    analysis.codeQuality.unusedCode.length +
    analysis.security.vulnerabilities.length +
    analysis.security.dataLeaks.length;
  
  const totalOpportunities = 
    analysis.optimization.debounceOpportunities.length +
    analysis.optimization.throttleOpportunities.length +
    analysis.optimization.lazyLoadOpportunities.length +
    analysis.optimization.cachingOpportunities.length;
  
  console.log(`  Issues Found: ${totalIssues}`);
  console.log(`  Optimization Opportunities: ${totalOpportunities}`);
  
  if (totalIssues === 0) {
    console.log('  🎉 Excellent! No critical issues found');
  } else {
    console.log('  ⚠️  Some issues need attention');
  }
  
  if (totalOpportunities > 0) {
    console.log('  🚀 Optimization opportunities available');
  }
}

// Run analysis
analyzeAppHtml();

module.exports = analysis; 