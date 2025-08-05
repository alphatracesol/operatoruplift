const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Operator Uplift build process...');

// Step 1: Skip webpack build for now (static HTML app)
console.log('📦 Skipping webpack build - using static files only...');
console.log('✅ Static build mode enabled');

// Step 2: Create build directory
console.log('📁 Creating build directory...');
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Step 3: Copy static files
console.log('📋 Copying static files...');
const filesToCopy = [
  'app.html',
  'index.html',
  'MVP Launch Page.html',
  'press-release.html',
  '404.html',
  '500.html',
  'manifest.json',
  'sw.js',
  'favicon.ico',
  '_redirects',
  'netlify.toml'
];

const dirsToCopy = [
  'assets',
  'css',
  'js',
  'components',
  'pages',
  'src',
  'tests',
  'utils',
  'config'
];

// Copy individual files
filesToCopy.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(buildDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file}`);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

// Copy directories
dirsToCopy.forEach(dir => {
  const sourcePath = path.join(__dirname, dir);
  const destPath = path.join(buildDir, dir);
  
  if (fs.existsSync(sourcePath)) {
    copyDirectorySync(sourcePath, destPath);
    console.log(`✅ Copied directory: ${dir}`);
  } else {
    console.log(`⚠️  Directory not found: ${dir}`);
  }
});

// Step 4: Install function dependencies
console.log('🔧 Installing function dependencies...');
try {
  execSync('cd netlify/functions && npm install', { stdio: 'inherit' });
  console.log('✅ Function dependencies installed');
} catch (error) {
  console.error('❌ Function dependency installation failed:', error.message);
  process.exit(1);
}

console.log('🎉 Build completed successfully!');

// Helper function to copy directories recursively
function copyDirectorySync(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectorySync(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
} 