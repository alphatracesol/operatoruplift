#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔨 Building Operator Uplift - Hybrid Deployment...');

// Create build directory
const buildDir = 'build';
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    console.log('📁 Created build directory');
}

// Copy all static files to build directory
const staticFiles = [
    'app.html',
    'sw.js', 
    'firebase-config.js',
    'manifest.json',
    'favicon.ico',
    '_redirects',
    'netlify.toml'
];

console.log('📋 Copying static files...');
staticFiles.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(buildDir, file));
        console.log(`  ✅ Copied ${file}`);
    } else {
        console.log(`  ⚠️  ${file} not found (optional)`);
    }
});

// Copy other HTML pages that need webpack processing
const htmlPages = [
    'index.html',
    'press-release.html', 
    'MVP Launch Page.html',
    '404.html',
    '500.html'
];

console.log('📋 Copying HTML pages...');
htmlPages.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(buildDir, file));
        console.log(`  ✅ Copied ${file}`);
    } else {
        console.log(`  ⚠️  ${file} not found (optional)`);
    }
});

// Copy assets directory if it exists
if (fs.existsSync('assets')) {
    console.log('📋 Copying assets directory...');
    copyDirectory('assets', path.join(buildDir, 'assets'));
}

// Copy any other directories that might be needed
const directories = ['css', 'js', 'images', 'fonts', 'src'];
directories.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`📋 Copying ${dir} directory...`);
        copyDirectory(dir, path.join(buildDir, dir));
    }
});

console.log('✅ Hybrid build completed successfully');
console.log('🚀 Ready for deployment with both static SPA and webpack pages');

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
} 