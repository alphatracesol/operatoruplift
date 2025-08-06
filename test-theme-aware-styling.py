#!/usr/bin/env python3
"""
Test to verify theme-aware styling for auth card and background
"""

import re

def test_auth_view_background():
    """Test that auth view background uses theme variables"""
    print("🌓 Testing Auth View Background...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check that auth-view uses theme background
    if 'background: var(--bg-primary)' in content:
        print("✅ Auth view uses theme background")
        return True
    else:
        print("❌ Auth view doesn't use theme background")
        return False

def test_auth_card_theme_variables():
    """Test that auth card uses theme variables"""
    print("\n🎨 Testing Auth Card Theme Variables...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for auth card CSS variables
    auth_card_css = re.search(r'\.auth-card\s*\{[^}]*\}', content, re.DOTALL)
    if auth_card_css and 'background: var(--auth-card-bg)' in auth_card_css.group(0):
        print("✅ Auth card uses theme background variable")
    else:
        print("❌ Auth card doesn't use theme background")
        return False
    
    if auth_card_css and 'box-shadow: var(--auth-card-shadow)' in auth_card_css.group(0):
        print("✅ Auth card uses theme shadow variable")
    else:
        print("❌ Auth card doesn't use theme shadow")
        return False
    
    return True

def test_theme_variable_definitions():
    """Test that theme variables are properly defined"""
    print("\n🎨 Testing Theme Variable Definitions...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for dark theme auth card variables
    if '--auth-card-bg: rgba(0, 0, 0, 0.3)' in content:
        print("✅ Dark theme auth card background defined")
    else:
        print("❌ Dark theme auth card background missing")
        return False
    
    if '--auth-card-shadow: 0 8px 32px rgba(0, 0, 0, 0.2)' in content:
        print("✅ Dark theme auth card shadow defined")
    else:
        print("❌ Dark theme auth card shadow missing")
        return False
    
    # Check for light theme auth card variables
    if '--auth-card-bg: rgba(255, 255, 255, 0.2)' in content:
        print("✅ Light theme auth card background defined")
    else:
        print("❌ Light theme auth card background missing")
        return False
    
    if '--auth-card-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)' in content:
        print("✅ Light theme auth card shadow defined")
    else:
        print("❌ Light theme auth card shadow missing")
        return False
    
    return True

def test_no_hardcoded_backgrounds():
    """Test that no hardcoded backgrounds remain"""
    print("\n🚫 Testing No Hardcoded Backgrounds...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check that the hardcoded black gradient is removed
    if 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%, #000000 100%)' in content:
        print("❌ Hardcoded black gradient still present")
        return False
    else:
        print("✅ Hardcoded black gradient removed")
    
    return True

if __name__ == "__main__":
    print("🔧 Theme-Aware Styling Test")
    print("=" * 50)
    
    success = True
    
    tests = [
        test_auth_view_background,
        test_auth_card_theme_variables,
        test_theme_variable_definitions,
        test_no_hardcoded_backgrounds
    ]
    
    for test in tests:
        if not test():
            success = False
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 THEME-AWARE STYLING IMPLEMENTED!")
        print("✅ Auth view uses theme background")
        print("✅ Auth card uses theme variables")
        print("✅ Dark theme: Dark glass morphism")
        print("✅ Light theme: Light pearl glass morphism")
        print("✅ No hardcoded backgrounds")
    else:
        print("⚠️ THEME-AWARE STYLING NEEDS FIXING")
    
    print(f"\n📊 THEME COMPATIBILITY:")
    print(f"   - Dark Mode: Dark glass morphism background")
    print(f"   - Light Mode: Light pearl glass morphism background")
    print(f"   - Both modes: Proper shadows and effects")
    print(f"   - Background: Theme-aware gradient removal")
    
    print(f"\n🚀 READY FOR THEME TESTING!")
    print(f"   - Switch between light/dark mode")
    print(f"   - Auth card should change appearance")
    print(f"   - Background should change properly")
    print(f"   - No hardcoded colors should remain") 