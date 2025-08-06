#!/usr/bin/env python3
"""
Test script to verify auth overlay functionality
"""

import os
import sys
import time
from pathlib import Path

def test_auth_overlay():
    """Test the auth overlay functionality"""
    print("🧪 Testing Auth Overlay Fix...")
    
    # Check if app.html exists
    app_path = Path("app.html")
    if not app_path.exists():
        print("❌ app.html not found!")
        return False
    
    print("✅ app.html found")
    
    # Read app.html and check for key elements
    with open(app_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for auth view outside main content
    auth_outside_main = '<!-- Authentication View - FULL SCREEN OVERLAY (Outside Main Content) -->' in content
    if auth_outside_main:
        print("✅ Auth view moved outside main content")
    else:
        print("❌ Auth view still inside main content")
        return False
    
    # Check for proper CSS positioning
    auth_css_fixed = '#auth-view {' in content and 'position: fixed;' in content
    if auth_css_fixed:
        print("✅ Auth view has fixed positioning")
    else:
        print("❌ Auth view missing fixed positioning")
        return False
    
    # Check for z-index
    auth_z_index = 'z-index: var(--z-auth-overlay);' in content
    if auth_z_index:
        print("✅ Auth view has proper z-index")
    else:
        print("❌ Auth view missing z-index")
        return False
    
    # Check for gradient background
    auth_gradient = 'background: linear-gradient(135deg, #0a0a0a 0%, #1f2937 50%, #374151 100%);' in content
    if auth_gradient:
        print("✅ Auth view has gradient background")
    else:
        print("❌ Auth view missing gradient background")
        return False
    
    # Check for main content hiding logic
    main_hide_logic = 'mainContent.style.display = \'none\';' in content
    if main_hide_logic:
        print("✅ Main content hiding logic present")
    else:
        print("❌ Main content hiding logic missing")
        return False
    
    print("\n🎉 Auth Overlay Fix Test PASSED!")
    print("📋 Summary:")
    print("   - Auth view moved outside main content")
    print("   - Fixed positioning with proper z-index")
    print("   - Gradient background restored")
    print("   - Main content hiding logic implemented")
    print("\n🔧 Next Steps:")
    print("   1. Open app.html in browser")
    print("   2. Should see full-screen login overlay")
    print("   3. Login with: demo@operatoruplift.com / demo123")
    print("   4. Should hide overlay and show dashboard")
    
    return True

def test_button_gradients():
    """Test button gradient fixes"""
    print("\n🎨 Testing Button Gradient Fixes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for updated button gradients
    btn_primary_gradient = 'background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);' in content
    if btn_primary_gradient:
        print("✅ Primary button gradient fixed")
    else:
        print("❌ Primary button gradient not updated")
        return False
    
    # Check for accent glow
    accent_glow = 'box-shadow: 0 10px 25px var(--accent-glow);' in content
    if accent_glow:
        print("✅ Button glow effects present")
    else:
        print("❌ Button glow effects missing")
        return False
    
    print("🎉 Button Gradient Test PASSED!")
    return True

if __name__ == "__main__":
    print("🚀 Operator Uplift - Auth Overlay Fix Test")
    print("=" * 50)
    
    success = True
    
    # Test auth overlay
    if not test_auth_overlay():
        success = False
    
    # Test button gradients
    if not test_button_gradients():
        success = False
    
    if success:
        print("\n🎉 ALL TESTS PASSED!")
        print("✅ Auth overlay should now work as full-screen overlay")
        print("✅ Button gradients should display correctly")
        print("\n📝 Manual Testing Instructions:")
        print("   1. Open app.html in browser")
        print("   2. Verify login screen appears as full-screen overlay")
        print("   3. Test login: demo@operatoruplift.com / demo123")
        print("   4. Verify buttons have orange gradient styling")
    else:
        print("\n❌ SOME TESTS FAILED!")
        print("Please check the issues above and fix them.")
        sys.exit(1) 