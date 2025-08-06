#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 Building Operator Uplift...');

// Check if we're in a build scenario or static scenario
const isStaticBuild = process.env.NETLIFY_BUILD_TYPE === 'static' || !process.env.NETLIFY_BUILD_TYPE;

if (isStaticBuild) {
    console.log('📁 Static HTML deployment detected');
    console.log('✅ No build required - serving from root directory');
    
    // Ensure essential files exist
    const essentialFiles = ['app.html', 'sw.js', 'firebase-config.js'];
    const missingFiles = essentialFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
        console.error('❌ Missing essential files:', missingFiles);
        process.exit(1);
    }
    
    console.log('✅ All essential files present');
    console.log('🚀 Ready for static deployment');
} else {
    console.log('🔨 Build-based deployment detected');
    
    // Create build directory if it doesn't exist
    const buildDir = 'build';
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }
    
    // Copy essential files to build directory
    const filesToCopy = [
        'app.html',
        'sw.js', 
        'firebase-config.js',
        'manifest.json',
        'favicon.ico',
        '_redirects'
    ];
    
    filesToCopy.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, path.join(buildDir, file));
            console.log(`📋 Copied ${file} to build directory`);
        }
    });
    
    console.log('✅ Build completed successfully');
}

console.log('🎉 Build process finished'); 