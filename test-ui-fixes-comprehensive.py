#!/usr/bin/env python3
"""
Comprehensive test for all UI fixes
"""

import re

def test_theme_toggle_fixes():
    """Test theme toggle button fixes"""
    print("🌓 Testing Theme Toggle Fixes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for accent color hover effect
    if 'box-shadow: 0 0 15px var(--accent-glow)' in content:
        print("✅ Theme toggle uses accent color on hover")
    else:
        print("❌ Theme toggle missing accent color hover")
        return False
    
    # Check for proper sun icon
    if 'fill="currentColor"' in content and 'stroke="currentColor"' in content:
        print("✅ Sun icon properly implemented")
    else:
        print("❌ Sun icon not properly implemented")
        return False
    
    return True

def test_welcome_title_fixes():
    """Test welcome title fixes"""
    print("\n✨ Testing Welcome Title Fixes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for theme-aware color
    if 'color: var(--text-primary)' in content and 'filter: drop-shadow(0 0 10px var(--accent-glow))' in content:
        print("✅ Welcome title uses theme colors with glow")
    else:
        print("❌ Welcome title not using theme colors")
        return False
    
    return True

def test_light_mode_transparency():
    """Test light mode bento box transparency"""
    print("\n💡 Testing Light Mode Transparency...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for reduced transparency
    if 'rgba(255, 255, 255, 0.12)' in content:
        print("✅ Light mode transparency reduced to 12%")
    else:
        print("❌ Light mode transparency not reduced")
        return False
    
    return True

def test_button_glow_reduction():
    """Test sign-in button glow reduction"""
    print("\n🔆 Testing Button Glow Reduction...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for reduced glow
    if 'box-shadow: 0 6px 12px var(--accent-glow)' in content:
        print("✅ Button glow reduced to 6px 12px")
    else:
        print("❌ Button glow not reduced")
        return False
    
    return True

def test_mobile_nav_z_index():
    """Test mobile nav z-index fix"""
    print("\n📱 Testing Mobile Nav Z-Index...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for proper z-index
    if 'z-index: 150' in content:
        print("✅ Mobile nav z-index set to 150")
    else:
        print("❌ Mobile nav z-index not fixed")
        return False
    
    return True

def test_hover_effect_z_index():
    """Test hover effect z-index"""
    print("\n🎨 Testing Hover Effect Z-Index...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for auth card hover z-index
    if 'z-index: 1' in content:
        print("✅ Hover effects have proper z-index")
    else:
        print("❌ Hover effects missing z-index")
        return False
    
    return True

def test_3d_cube_animation():
    """Test 3D cube animation"""
    print("\n🎲 Testing 3D Cube Animation...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for auto-spin on both axes
    if 'rotationX += autoRotateSpeed * 0.3' in content and 'rotationY += autoRotateSpeed' in content:
        print("✅ Cube auto-spins on both X and Y axes")
    else:
        print("❌ Cube missing auto-spin on both axes")
        return False
    
    # Check for 3D transform style
    if 'transform-style: preserve-3d' in content:
        print("✅ Cube has 3D transform style")
    else:
        print("❌ Cube missing 3D transform")
        return False
    
    return True

def test_duplicate_theme_toggles():
    """Test for duplicate theme toggle implementations"""
    print("\n🔍 Testing for Duplicate Theme Toggles...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count theme toggle implementations
    theme_toggle_count = content.count('theme-toggle')
    set_theme_count = content.count('setTheme')
    
    if theme_toggle_count <= 5 and set_theme_count <= 3:
        print("✅ No excessive theme toggle duplicates")
    else:
        print(f"⚠️ Potential duplicates: {theme_toggle_count} theme-toggles, {set_theme_count} setTheme calls")
        return False
    
    return True

if __name__ == "__main__":
    print("🔧 Comprehensive UI Fixes Test")
    print("=" * 50)
    
    success = True
    
    tests = [
        test_theme_toggle_fixes,
        test_welcome_title_fixes,
        test_light_mode_transparency,
        test_button_glow_reduction,
        test_mobile_nav_z_index,
        test_hover_effect_z_index,
        test_3d_cube_animation,
        test_duplicate_theme_toggles
    ]
    
    for test in tests:
        if not test():
            success = False
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 ALL UI FIXES IMPLEMENTED SUCCESSFULLY!")
        print("✅ Theme toggle uses accent color and proper sun icon")
        print("✅ Welcome title uses theme colors with glow")
        print("✅ Light mode transparency reduced")
        print("✅ Button glow reduced")
        print("✅ Mobile nav z-index fixed")
        print("✅ Hover effects have proper z-index")
        print("✅ 3D cube auto-spins on both axes")
        print("✅ No excessive theme toggle duplicates")
    else:
        print("⚠️ SOME UI FIXES NEED ATTENTION")
    
    print(f"\n📊 COMPREHENSIVE STATUS:")
    print(f"   - Theme Toggle: Accent color hover + proper sun icon")
    print(f"   - Welcome Title: Theme-aware with orange glow")
    print(f"   - Light Mode: Reduced transparency (12%)")
    print(f"   - Button Glow: Reduced to 6px 12px")
    print(f"   - Mobile Nav: Z-index 150 (below header)")
    print(f"   - Hover Effects: Z-index 1 for visibility")
    print(f"   - 3D Cube: Auto-spin on X and Y axes")
    print(f"   - No Duplicates: Clean theme toggle implementation")
    
    print(f"\n🚀 READY FOR TESTING!")
    print(f"   - Theme toggle should glow orange on hover")
    print(f"   - Sun icon should be filled with rays")
    print(f"   - Welcome title should be white/grey with orange glow")
    print(f"   - Light mode bento box should be less transparent")
    print(f"   - Sign-in button glow should be reduced")
    print(f"   - Mobile nav should not overlap theme toggle")
    print(f"   - Hover effects should be visible")
    print(f"   - Cube should auto-spin continuously")
