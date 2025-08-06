#!/usr/bin/env python3
"""
Test script to verify auth overlay persistence
"""

import os
import sys
import time
from pathlib import Path

def test_auth_persistence():
    """Test that auth overlay stays visible and main content stays hidden"""
    print("🧪 Testing Auth Overlay Persistence...")
    
    # Check if app.html exists
    app_path = Path("app.html")
    if not app_path.exists():
        print("❌ app.html not found!")
        return False
    
    print("✅ app.html found")
    
    # Read app.html and check for key fixes
    with open(app_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for authentication status check fix
    auth_check_fix = 'this.state.currentUser && this.state.isAuthenticated' in content
    if auth_check_fix:
        print("✅ Authentication status check fixed")
    else:
        print("❌ Authentication status check not updated")
        return False
    
    # Check for main content hiding in auth view
    main_hide_auth = 'mainContent.style.display = \'none\';' in content
    if main_hide_auth:
        print("✅ Main content hiding in auth view")
    else:
        print("❌ Main content hiding logic missing")
        return False
    
    # Check for auth view visibility enforcement
    auth_visibility = 'authView.classList.add(\'active\');' in content
    if auth_visibility:
        print("✅ Auth view visibility enforcement")
    else:
        print("❌ Auth view visibility enforcement missing")
        return False
    
    # Check for authenticated check in showView
    authenticated_check = 'app.state.isAuthenticated' in content
    if authenticated_check:
        print("✅ Authenticated check in showView")
    else:
        print("❌ Authenticated check missing in showView")
        return False
    
    # Check for CSS enforcement
    css_enforcement = '.main-content[style*="display: none"]' in content
    if css_enforcement:
        print("✅ CSS enforcement for hidden main content")
    else:
        print("❌ CSS enforcement missing")
        return False
    
    print("\n🎉 Auth Persistence Test PASSED!")
    print("📋 Summary:")
    print("   - Authentication status properly checked")
    print("   - Main content hidden when auth is active")
    print("   - Auth view visibility enforced")
    print("   - CSS enforcement for hidden content")
    print("\n🔧 Expected Behavior:")
    print("   1. Auth overlay should appear on load")
    print("   2. Auth overlay should STAY visible")
    print("   3. Main content should remain hidden")
    print("   4. Only show dashboard after successful login")
    
    return True

def test_auth_flow():
    """Test the complete auth flow"""
    print("\n🔄 Testing Complete Auth Flow...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for proper login flow
    login_flow = 'app.ui.showView(\'dashboard\')' in content
    if login_flow:
        print("✅ Login flow to dashboard")
    else:
        print("❌ Login flow missing")
        return False
    
    # Check for logout flow
    logout_flow = 'app.ui.showView(\'auth\')' in content
    if logout_flow:
        print("✅ Logout flow to auth")
    else:
        print("❌ Logout flow missing")
        return False
    
    # Check for main content showing after login
    main_show_login = 'mainContent.style.display = \'block\';' in content
    if main_show_login:
        print("✅ Main content shows after login")
    else:
        print("❌ Main content show logic missing")
        return False
    
    print("🎉 Auth Flow Test PASSED!")
    return True

if __name__ == "__main__":
    print("🚀 Operator Uplift - Auth Persistence Test")
    print("=" * 50)
    
    success = True
    
    # Test auth persistence
    if not test_auth_persistence():
        success = False
    
    # Test auth flow
    if not test_auth_flow():
        success = False
    
    if success:
        print("\n🎉 ALL TESTS PASSED!")
        print("✅ Auth overlay should now persist until login")
        print("✅ Main content should stay hidden until authenticated")
        print("\n📝 Manual Testing Instructions:")
        print("   1. Open app.html in browser")
        print("   2. Auth overlay should appear and STAY visible")
        print("   3. Main content should remain hidden")
        print("   4. Login with: demo@operatoruplift.com / demo123")
        print("   5. Should then show dashboard")
    else:
        print("\n❌ SOME TESTS FAILED!")
        print("Please check the issues above and fix them.")
        sys.exit(1) 