#!/usr/bin/env python3
"""
Test for second chunk of UI fixes (100-150 lines)
"""

import re

def test_auto_spinning_cube():
    """Test that cube has auto-spinning on both axes"""
    print("🎲 Testing Auto-Spinning Cube...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for auto-spin on both X and Y axes
    if 'rotationX += autoRotateSpeed * 0.3' in content and 'rotationY += autoRotateSpeed' in content:
        print("✅ Cube auto-spins on both X and Y axes")
    else:
        print("❌ Cube missing auto-spin on both axes")
        return False
    
    return True

def test_test_mode_button():
    """Test that test mode button is added"""
    print("\n🧪 Testing Test Mode Button...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for test mode functions
    if 'enableTestMode()' in content and 'enterTestMode()' in content:
        print("✅ Test mode functions implemented")
    else:
        print("❌ Test mode functions missing")
        return False
    
    # Check for test button creation
    if 'test-mode-btn' in content and '🧪 Test Dashboard' in content:
        print("✅ Test dashboard button created")
    else:
        print("❌ Test dashboard button missing")
        return False
    
    return True

def test_test_mode_initialization():
    """Test that test mode is initialized"""
    print("\n🚀 Testing Test Mode Initialization...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for test mode initialization in app init
    if 'this.enableTestMode()' in content:
        print("✅ Test mode initialized in app init")
    else:
        print("❌ Test mode not initialized")
        return False
    
    return True

def test_dashboard_bypass():
    """Test that test mode bypasses auth"""
    print("\n🔓 Testing Dashboard Bypass...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for auth bypass logic
    if 'authView.classList.remove' in content and 'dashboardView.classList.add' in content:
        print("✅ Auth bypass implemented")
    else:
        print("❌ Auth bypass missing")
        return False
    
    return True

if __name__ == "__main__":
    print("🔧 UI Fixes Chunk 2 Test")
    print("=" * 40)
    
    success = True
    
    tests = [
        test_auto_spinning_cube,
        test_test_mode_button,
        test_test_mode_initialization,
        test_dashboard_bypass
    ]
    
    for test in tests:
        if not test():
            success = False
    
    print("\n" + "=" * 40)
    if success:
        print("🎉 CHUNK 2 UI FIXES IMPLEMENTED!")
        print("✅ Cube auto-spins on both axes")
        print("✅ Test mode button added")
        print("✅ Test mode initialized")
        print("✅ Dashboard bypass implemented")
    else:
        print("⚠️ CHUNK 2 UI FIXES NEED ATTENTION")
    
    print(f"\n📊 CHUNK 2 STATUS:")
    print(f"   - Auto-Spin: Both X and Y axes")
    print(f"   - Test Button: Added to auth card")
    print(f"   - Test Mode: Initialized on load")
    print(f"   - Auth Bypass: Direct dashboard access")
    
    print(f"\n🚀 READY FOR TESTING!")
    print(f"   - Cube should auto-spin continuously")
    print(f"   - Test Dashboard button should appear")
    print(f"   - Click button to bypass auth")
    print(f"   - Dashboard should load immediately") 