#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting mixed deployment build...');

// Configuration
const STATIC_FILES = [
    'app.html',
    'manifest.json',
    'sw.js',
    'netlify.toml',
    '_redirects',
    '_headers',
    'firebase-config.js'
];

const BUILD_FILES = [
    'index.html',
    'login.html',
    'dashboard.html',
    'press-release.html',
    'MVP Launch Page.html'
];

const ASSET_DIRS = [
    'assets',
    'css',
    'js',
    'images'
];

// Function to check if file exists
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// Function to copy file if it exists
function copyIfExists(source, dest) {
    if (fileExists(source)) {
        try {
            fs.copyFileSync(source, dest);
            console.log(`✅ Copied: ${source} -> ${dest}`);
            return true;
        } catch (error) {
            console.log(`❌ Failed to copy ${source}: ${error.message}`);
            return false;
        }
    } else {
        console.log(`⚠️  File not found: ${source}`);
        return false;
    }
}

// Function to copy directory if it exists
function copyDirIfExists(source, dest) {
    if (fs.existsSync(source)) {
        try {
            // Create destination directory if it doesn't exist
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            
            // Copy directory contents
            const files = fs.readdirSync(source);
            files.forEach(file => {
                const sourcePath = path.join(source, file);
                const destPath = path.join(dest, file);
                
                if (fs.statSync(sourcePath).isDirectory()) {
                    copyDirIfExists(sourcePath, destPath);
                } else {
                    fs.copyFileSync(sourcePath, destPath);
                }
            });
            console.log(`✅ Copied directory: ${source} -> ${dest}`);
            return true;
        } catch (error) {
            console.log(`❌ Failed to copy directory ${source}: ${error.message}`);
            return false;
        }
    } else {
        console.log(`⚠️  Directory not found: ${source}`);
        return false;
    }
}

// Main build process
async function buildMixed() {
    console.log('\n📁 Creating build directory...');
    
    // Create build directory if it doesn't exist
    const buildDir = 'build';
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
        console.log(`✅ Created build directory: ${buildDir}`);
    }
    
    console.log('\n📁 Processing static files...');
    
    // Copy static files to build directory
    STATIC_FILES.forEach(file => {
        copyIfExists(file, path.join(buildDir, file));
    });
    
    console.log('\n🏗️  Processing build files...');
    
    // Copy build files to build directory
    BUILD_FILES.forEach(file => {
        copyIfExists(file, path.join(buildDir, file));
    });
    
    console.log('\n📦 Processing asset directories...');
    
    // Copy asset directories to build directory
    ASSET_DIRS.forEach(dir => {
        copyDirIfExists(dir, path.join(buildDir, dir));
    });
    
    // Copy other important directories to build directory
    copyDirIfExists('netlify', path.join(buildDir, 'netlify'));
    copyDirIfExists('tests', path.join(buildDir, 'tests'));
    copyDirIfExists('docs', path.join(buildDir, 'docs'));
    
    console.log('\n✅ Mixed deployment build completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Build directory: ${buildDir}`);
    console.log(`   - Static files: ${STATIC_FILES.length} files`);
    console.log(`   - Build files: ${BUILD_FILES.length} files`);
    console.log(`   - Asset directories: ${ASSET_DIRS.length} directories`);
    console.log('\n🚀 Ready for deployment!');
}

// Run the build
buildMixed().catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
});
