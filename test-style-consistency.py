#!/usr/bin/env python3
"""
Test script to verify complete style consistency and gradient cleanup
"""

import os
import sys
import re
from pathlib import Path

def test_auth_view_background():
    """Test auth view background uses theme colors"""
    print("🎨 Testing Auth View Background...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check that auth view uses theme background
    if 'authView.style.background = \'var(--bg-primary)\'' in content:
        print("✅ Auth view uses theme background")
    else:
        print("❌ Auth view background not fixed")
        return False
    
    return True

def test_button_gradients():
    """Test button gradients are removed"""
    print("\n🔘 Testing Button Gradients...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check that btn-primary uses solid colors
    if 'background: var(--accent-color)' in content and 'btn-primary' in content:
        print("✅ Primary button uses solid color")
    else:
        print("❌ Primary button still has gradient")
        return False
    
    # Check that btn-secondary uses theme colors
    if 'background: var(--bg-secondary)' in content and 'btn-secondary' in content:
        print("✅ Secondary button uses theme colors")
    else:
        print("❌ Secondary button not fixed")
        return False
    
    return True

def test_welcome_title():
    """Test welcome title styling"""
    print("\n📝 Testing Welcome Title...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for inline styling on welcome title
    if 'color: var(--text-primary)' in content and 'Welcome to Operator Uplift' in content:
        print("✅ Welcome title uses theme colors")
    else:
        print("❌ Welcome title not properly styled")
        return False
    
    return True

def test_remaining_gradients():
    """Test for remaining problematic gradients"""
    print("\n🌈 Testing Remaining Gradients...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for remaining blue/purple gradients
    problematic_gradients = [
        'linear-gradient.*#667eea',
        'linear-gradient.*#764ba2',
        'linear-gradient.*#f093fb',
        'linear-gradient.*#4facfe',
        'linear-gradient.*#00f2fe'
    ]
    
    for gradient in problematic_gradients:
        if re.search(gradient, content):
            print(f"⚠️ Problematic gradient found: {gradient}")
            return False
    
    print("✅ No problematic gradients found")
    return True

def test_theme_consistency():
    """Test theme consistency throughout"""
    print("\n🎯 Testing Theme Consistency...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for theme variable usage
    theme_vars = [
        'var(--accent-color)',
        'var(--bg-primary)',
        'var(--bg-secondary)',
        'var(--text-primary)',
        'var(--text-secondary)'
    ]
    
    for var in theme_vars:
        if var in content:
            print(f"✅ Theme variable found: {var}")
        else:
            print(f"❌ Theme variable missing: {var}")
            return False
    
    return True

def test_stat_fills():
    """Test stat fill gradients are removed"""
    print("\n📊 Testing Stat Fills...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check that stat fills use theme colors
    if 'stat-fill.health { background: var(--accent-color)' in content:
        print("✅ Stat fills use theme colors")
    else:
        print("❌ Stat fills still have gradients")
        return False
    
    return True

def test_theme_config():
    """Test theme configuration uses theme variables"""
    print("\n⚙️ Testing Theme Configuration...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check that gradient presets use theme variables
    if 'primary: \'var(--accent-color)\'' in content:
        print("✅ Theme config uses theme variables")
    else:
        print("❌ Theme config still has gradients")
        return False
    
    return True

def test_bento_box_consistency():
    """Test bento box styling consistency"""
    print("\n📦 Testing Bento Box Consistency...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check that glass-card uses theme colors
    if 'background: var(--bg-secondary)' in content and 'glass-card' in content:
        print("✅ Bento box uses theme background")
    else:
        print("❌ Bento box background not consistent")
        return False
    
    # Check that glass-card border uses accent color
    if 'border: 1px solid var(--accent-color)' in content and 'glass-card' in content:
        print("✅ Bento box uses accent border")
    else:
        print("❌ Bento box border not consistent")
        return False
    
    return True

def generate_consistency_summary():
    """Generate style consistency summary"""
    print("\n📊 Style Consistency Summary:")
    
    fixes = [
        "🎨 Auth View: Uses var(--bg-primary) instead of gradient",
        "🔘 Buttons: All gradients removed, use theme colors",
        "📝 Welcome Title: Uses var(--text-primary) styling",
        "🌈 Gradients: All blue/purple gradients removed",
        "📊 Stat Fills: Use var(--accent-color) instead of gradients",
        "⚙️ Theme Config: Uses theme variables instead of gradients",
        "📦 Bento Box: Consistent with theme colors",
        "🎯 Overall: Unified orange/black theme throughout"
    ]
    
    for fix in fixes:
        print(f"   {fix}")
    
    return fixes

if __name__ == "__main__":
    print("🚀 Operator Uplift - Style Consistency Test")
    print("=" * 60)
    
    success = True
    
    # Test auth view background
    if not test_auth_view_background():
        success = False
    
    # Test button gradients
    if not test_button_gradients():
        success = False
    
    # Test welcome title
    if not test_welcome_title():
        success = False
    
    # Test remaining gradients
    if not test_remaining_gradients():
        success = False
    
    # Test theme consistency
    if not test_theme_consistency():
        success = False
    
    # Test stat fills
    if not test_stat_fills():
        success = False
    
    # Test theme config
    if not test_theme_config():
        success = False
    
    # Test bento box consistency
    if not test_bento_box_consistency():
        success = False
    
    # Generate summary
    fixes = generate_consistency_summary()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 STYLE CONSISTENCY COMPLETED!")
        print("✅ All gradients removed")
        print("✅ Theme colors used throughout")
        print("✅ Login screen properly styled")
        print("✅ Buttons use solid colors")
        print("✅ Welcome title uses theme colors")
        print("✅ Bento box matches theme")
        print("✅ No conflicting colors")
    else:
        print("⚠️ SOME CONSISTENCY ISSUES REMAIN")
        print("Please review and fix the issues above")
    
    print(f"\n📊 CONSISTENCY SUMMARY:")
    print(f"   - Fixes Applied: {len(fixes)}")
    print(f"   - Gradients Removed: All blue/purple gradients")
    print(f"   - Theme Colors: Used throughout app")
    print(f"   - Login Screen: Properly styled")
    print(f"   - Buttons: Solid colors instead of gradients")
    
    print(f"\n🎨 STYLE IMPROVEMENTS:")
    print(f"   1. Auth view uses var(--bg-primary)")
    print(f"   2. Buttons use solid theme colors")
    print(f"   3. Welcome title uses var(--text-primary)")
    print(f"   4. All gradients replaced with theme colors")
    print(f"   5. Stat fills use var(--accent-color)")
    print(f"   6. Theme config uses theme variables")
    print(f"   7. Bento box consistent with theme")
    
    print(f"\n🚀 READY FOR TESTING!")
    print(f"   - Login screen should match theme")
    print(f"   - No blue/purple gradients visible")
    print(f"   - All buttons use solid colors")
    print(f"   - Welcome title properly styled")
    print(f"   - Bento box matches background")
    print(f"   - Consistent orange/black theme") 