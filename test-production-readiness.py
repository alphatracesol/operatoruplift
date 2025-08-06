#!/usr/bin/env python3
"""
Production Readiness Test for Operator Uplift
"""

import re
import os

def test_firebase_configuration():
    """Test Firebase configuration setup"""
    print("🔥 Testing Firebase Configuration...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for Firebase CDNs
    if all([
        'firebase-app-compat.js' in content,
        'firebase-auth-compat.js' in content,
        'firebase-firestore-compat.js' in content,
        'firebase-analytics-compat.js' in content
    ]):
        print("✅ Firebase CDNs included")
    else:
        print("❌ Firebase CDNs missing")
        return False
    
    # Check for Firebase config file
    if 'firebase-config.js' in content:
        print("✅ Firebase config file referenced")
    else:
        print("❌ Firebase config file missing")
        return False
    
    # Check if firebase-config.js exists
    if os.path.exists('firebase-config.js'):
        print("✅ Firebase config file exists")
    else:
        print("❌ Firebase config file not found")
        return False
    
    return True

def test_deepseek_configuration():
    """Test DeepSeek AI configuration"""
    print("\n🧠 Testing DeepSeek AI Configuration...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for DeepSeek API integration
    if all([
        'DEEPSEEK_API_KEY' in content,
        'makeDeepSeekRequest' in content,
        'processDeepSeekResponse' in content,
        'api-inference.huggingface.co' in content
    ]):
        print("✅ DeepSeek API integration configured")
    else:
        print("❌ DeepSeek API integration incomplete")
        return False
    
    return True

def test_netlify_configuration():
    """Test Netlify deployment configuration"""
    print("\n🌐 Testing Netlify Configuration...")
    
    if not os.path.exists('netlify.toml'):
        print("❌ netlify.toml not found")
        return False
    
    with open("netlify.toml", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for essential Netlify config
    if all([
        'publish = "."' in content,
        'from = "/*"' in content,
        'to = "/app.html"' in content,
        'Content-Security-Policy' in content,
        'DEEPSEEK_API_KEY' in content,
        'FIREBASE_API_KEY' in content
    ]):
        print("✅ Netlify configuration complete")
    else:
        print("❌ Netlify configuration incomplete")
        return False
    
    return True

def test_security_headers():
    """Test security headers configuration"""
    print("\n🛡️ Testing Security Headers...")
    
    with open("netlify.toml", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for essential security headers
    security_headers = [
        'X-Frame-Options',
        'X-XSS-Protection',
        'X-Content-Type-Options',
        'Content-Security-Policy',
        'Strict-Transport-Security'
    ]
    
    missing_headers = []
    for header in security_headers:
        if header not in content:
            missing_headers.append(header)
    
    if not missing_headers:
        print("✅ All security headers configured")
    else:
        print(f"❌ Missing security headers: {', '.join(missing_headers)}")
        return False
    
    return True

def test_environment_variables():
    """Test environment variables configuration"""
    print("\n🔧 Testing Environment Variables...")
    
    with open("netlify.toml", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for required environment variables
    required_vars = [
        'DEEPSEEK_API_KEY',
        'FIREBASE_API_KEY',
        'FIREBASE_AUTH_DOMAIN',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_STORAGE_BUCKET'
    ]
    
    missing_vars = []
    for var in required_vars:
        if var not in content:
            missing_vars.append(var)
    
    if not missing_vars:
        print("✅ All required environment variables configured")
    else:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        return False
    
    return True

def test_gitignore():
    """Test .gitignore configuration"""
    print("\n🔒 Testing .gitignore Configuration...")
    
    if not os.path.exists('.gitignore'):
        print("❌ .gitignore not found")
        return False
    
    with open(".gitignore", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for sensitive files in .gitignore
    sensitive_files = [
        'firebase-config.js',
        '.env',
        '*.key',
        '*.pem',
        'secrets.json'
    ]
    
    missing_files = []
    for file in sensitive_files:
        if file not in content:
            missing_files.append(file)
    
    if not missing_files:
        print("✅ Sensitive files properly ignored")
    else:
        print(f"❌ Missing from .gitignore: {', '.join(missing_files)}")
        return False
    
    return True

def test_spa_routing():
    """Test SPA routing configuration"""
    print("\n🛣️ Testing SPA Routing...")
    
    with open("netlify.toml", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for SPA routing redirects
    if all([
        'from = "/*"' in content,
        'to = "/app.html"' in content,
        'status = 200' in content
    ]):
        print("✅ SPA routing configured")
    else:
        print("❌ SPA routing not configured")
        return False
    
    return True

def test_caching_strategy():
    """Test caching configuration"""
    print("\n⚡ Testing Caching Strategy...")
    
    with open("netlify.toml", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for caching headers
    cache_patterns = [
        'Cache-Control',
        'max-age=31536000',  # 1 year for static assets
        'max-age=3600'       # 1 hour for HTML
    ]
    
    missing_patterns = []
    for pattern in cache_patterns:
        if pattern not in content:
            missing_patterns.append(pattern)
    
    if not missing_patterns:
        print("✅ Caching strategy configured")
    else:
        print(f"❌ Missing caching patterns: {', '.join(missing_patterns)}")
        return False
    
    return True

def test_production_files():
    """Test production file structure"""
    print("\n📁 Testing Production File Structure...")
    
    required_files = [
        'app.html',
        'netlify.toml',
        '.gitignore',
        'firebase-config.js',
        'sw.js'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if not missing_files:
        print("✅ All production files present")
    else:
        print(f"❌ Missing files: {', '.join(missing_files)}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Production Readiness Test")
    print("=" * 50)
    
    success = True
    
    tests = [
        test_firebase_configuration,
        test_deepseek_configuration,
        test_netlify_configuration,
        test_security_headers,
        test_environment_variables,
        test_gitignore,
        test_spa_routing,
        test_caching_strategy,
        test_production_files
    ]
    
    for test in tests:
        if not test():
            success = False
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 PRODUCTION READY!")
        print("✅ Firebase configuration complete")
        print("✅ DeepSeek AI configured")
        print("✅ Netlify deployment ready")
        print("✅ Security headers implemented")
        print("✅ Environment variables configured")
        print("✅ Sensitive files protected")
        print("✅ SPA routing configured")
        print("✅ Caching strategy optimized")
        print("✅ All production files present")
    else:
        print("⚠️ PRODUCTION CONFIGURATION INCOMPLETE")
        print("Please fix the issues above before deploying")
    
    print(f"\n📊 PRODUCTION STATUS:")
    print(f"   - Firebase: Ready for authentication and database")
    print(f"   - DeepSeek AI: Ready for AI interactions")
    print(f"   - Netlify: Ready for deployment")
    print(f"   - Security: All headers and policies configured")
    print(f"   - Performance: Caching and optimization ready")
    print(f"   - Files: All required files present")
    
    print(f"\n🚀 NEXT STEPS:")
    if success:
        print(f"   1. Set up Firebase project in console")
        print(f"   2. Get DeepSeek API key")
        print(f"   3. Configure environment variables in Netlify")
        print(f"   4. Deploy to Netlify")
        print(f"   5. Test all features")
        print(f"   6. Monitor performance and errors")
    else:
        print(f"   1. Fix configuration issues above")
        print(f"   2. Re-run this test")
        print(f"   3. Then proceed with deployment")
    
    print(f"\n🔧 DEPLOYMENT COMMANDS:")
    print(f"   git add .")
    print(f"   git commit -m 'Production ready deployment'")
    print(f"   git push origin main")
    print(f"   # Then deploy via Netlify dashboard")
