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

        // Function to process HTML file and inject environment variables
        function processHtmlFile(source, dest) {
            if (fileExists(source)) {
                try {
                    let content = fs.readFileSync(source, 'utf8');
                    
                    // Create environment variables object
                    const envVars = {
                        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || '',
                        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
                        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || '',
                        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
                        FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
                        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || '',
                        FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID || '',
                        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
                        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
                    };
                    
                    // Create environment variables script
                    const envScript = `
    <script>
        // Environment variables injected by build process
        window.ENV = ${JSON.stringify(envVars)};
    </script>`;
                    
                    // Insert environment variables script before firebase-config.js
                    const firebaseScriptIndex = content.indexOf('<script src="firebase-config.js"></script>');
                    if (firebaseScriptIndex !== -1) {
                        content = content.slice(0, firebaseScriptIndex) + envScript + '\n    ' + content.slice(firebaseScriptIndex);
                        console.log('✅ Environment variables injected into HTML');
                    } else {
                        console.log('⚠️  firebase-config.js script tag not found in HTML');
                        console.log('🔍 Searching for alternative patterns...');
                        const alternativePatterns = [
                            'firebase-config.js',
                            'src="firebase-config.js"',
                            '<script src="firebase-config.js">'
                        ];
                        alternativePatterns.forEach(pattern => {
                            const index = content.indexOf(pattern);
                            if (index !== -1) {
                                console.log(`📍 Found pattern "${pattern}" at index ${index}`);
                            }
                        });
                    }
                    
                    fs.writeFileSync(dest, content);
                    console.log(`✅ Processed and copied: ${source} -> ${dest}`);
                    return true;
                } catch (error) {
                    console.log(`❌ Failed to process ${source}: ${error.message}`);
                    return false;
                }
            } else {
                console.log(`⚠️  File not found: ${source}`);
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
                if (file === 'app.html') {
                    // Process app.html to inject environment variables
                    processHtmlFile(file, path.join(buildDir, file));
                } else {
                    copyIfExists(file, path.join(buildDir, file));
                }
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
