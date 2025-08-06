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
    '_headers'
];

const BUILD_FILES = [
    'index.html',
    'login.html',
    'dashboard.html',
    'press-release.html'
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
    console.log('\n📁 Processing static files...');
    
    // Copy static files (no processing needed)
    STATIC_FILES.forEach(file => {
        copyIfExists(file, file);
    });
    
    console.log('\n🏗️  Processing build files...');
    
    // Copy build files (these would normally be processed, but for now just copy)
    BUILD_FILES.forEach(file => {
        copyIfExists(file, file);
    });
    
    console.log('\n📦 Processing asset directories...');
    
    // Copy asset directories
    ASSET_DIRS.forEach(dir => {
        copyDirIfExists(dir, dir);
    });
    
    // Copy other important directories
    copyDirIfExists('netlify', 'netlify');
    copyDirIfExists('tests', 'tests');
    copyDirIfExists('docs', 'docs');
    
    console.log('\n✅ Mixed deployment build completed!');
    console.log('\n📋 Summary:');
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
