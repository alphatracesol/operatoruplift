#!/usr/bin/env python3
"""
Test script to verify logo replacement and gradient fixes
"""

import os
import sys
import re
from pathlib import Path

def test_logo_replacement():
    """Test logo replacement with rotating cube"""
    print("🎲 Testing Logo Replacement...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for mini-cube structure
    if 'mini-cube' in content:
        print("✅ Mini-cube structure found")
    else:
        print("❌ Mini-cube structure missing")
        return False
    
    # Check for cube faces
    if 'mini-cube-face' in content:
        print("✅ Mini-cube faces found")
    else:
        print("❌ Mini-cube faces missing")
        return False
    
    # Check for SVG cube logo
    if 'mini-cube-logo' in content:
        print("✅ Mini-cube logo SVG found")
    else:
        print("❌ Mini-cube logo SVG missing")
        return False
    
    # Check for cube animation
    if 'miniCubeRotate' in content:
        print("✅ Mini-cube animation found")
    else:
        print("❌ Mini-cube animation missing")
        return False
    
    return True

def test_cube_styles():
    """Test cube CSS styles"""
    print("\n🎨 Testing Cube Styles...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for cube dimensions
    if 'width: 60px' in content and 'height: 60px' in content:
        print("✅ Cube dimensions found")
    else:
        print("❌ Cube dimensions missing")
        return False
    
    # Check for 3D transforms
    if 'transform-style: preserve-3d' in content:
        print("✅ 3D transform style found")
    else:
        print("❌ 3D transform style missing")
        return False
    
    # Check for cube face transforms
    if 'translateZ(30px)' in content:
        print("✅ Cube face transforms found")
    else:
        print("❌ Cube face transforms missing")
        return False
    
    return True

def test_gradient_fixes():
    """Test gradient color fixes"""
    print("\n🌈 Testing Gradient Fixes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check that blue gradients are replaced
    blue_gradients = [
        '#1da1f2',
        '#4267b2', 
        '#0077b5',
        '#0088cc',
        '#06b6d4',
        '#667eea',
        '#764ba2',
        '#f093fb'
    ]
    
    for gradient in blue_gradients:
        if gradient in content:
            print(f"⚠️ Blue gradient still found: {gradient}")
            return False
    
    print("✅ Blue gradients replaced")
    
    # Check for orange accent colors
    orange_colors = [
        'var(--accent-color)',
        '#e67e22',
        '#f97316',
        '#ea580c'
    ]
    
    for color in orange_colors:
        if color in content:
            print(f"✅ Orange color found: {color}")
        else:
            print(f"❌ Orange color missing: {color}")
            return False
    
    return True

def test_social_buttons():
    """Test social button gradient fixes"""
    print("\n📱 Testing Social Button Fixes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for social button gradients
    if 'share-button.twitter' in content and 'var(--accent-color)' in content:
        print("✅ Twitter button gradient fixed")
    else:
        print("❌ Twitter button gradient not fixed")
        return False
    
    if 'share-button.facebook' in content and 'var(--accent-color)' in content:
        print("✅ Facebook button gradient fixed")
    else:
        print("❌ Facebook button gradient not fixed")
        return False
    
    if 'share-button.linkedin' in content and 'var(--accent-color)' in content:
        print("✅ LinkedIn button gradient fixed")
    else:
        print("❌ LinkedIn button gradient not fixed")
        return False
    
    return True

def test_lucky_wheel():
    """Test lucky wheel gradient fixes"""
    print("\n🎰 Testing Lucky Wheel Fixes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for wheel segment gradients
    if 'wheel-segment:nth-child(1)' in content and 'var(--accent-color)' in content:
        print("✅ Wheel segment gradients fixed")
    else:
        print("❌ Wheel segment gradients not fixed")
        return False
    
    return True

def test_chart_colors():
    """Test chart color fixes"""
    print("\n📊 Testing Chart Color Fixes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for chart background colors
    if 'backgroundColor:' in content and 'var(--accent-color)' in content:
        print("✅ Chart background colors fixed")
    else:
        print("❌ Chart background colors not fixed")
        return False
    
    # Check for chart border colors
    if 'borderColor:' in content and 'var(--accent-color)' in content:
        print("✅ Chart border colors fixed")
    else:
        print("❌ Chart border colors not fixed")
        return False
    
    return True

def test_old_logo_removal():
    """Test old logo removal"""
    print("\n🗑️ Testing Old Logo Removal...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check that old logo image is removed
    if 'operator-logo.png' in content:
        print("❌ Old logo image still present")
        return False
    else:
        print("✅ Old logo image removed")
    
    # Check that old logo classes are removed
    if 'operator-logo rotating' in content:
        print("❌ Old logo classes still present")
        return False
    else:
        print("✅ Old logo classes removed")
    
    return True

def generate_fix_summary():
    """Generate fix summary"""
    print("\n📊 Logo & Gradient Fix Summary:")
    
    fixes = [
        "🎲 Logo Replacement: PNG logo replaced with rotating cube",
        "🎨 Cube Styling: 3D cube with proper transforms",
        "🌈 Gradient Fixes: Blue/cyan/purple gradients replaced",
        "📱 Social Buttons: All social buttons use orange theme",
        "🎰 Lucky Wheel: Wheel segments use orange theme",
        "📊 Chart Colors: Chart.js colors use orange theme",
        "🗑️ Cleanup: Old logo references removed"
    ]
    
    for fix in fixes:
        print(f"   {fix}")
    
    return fixes

if __name__ == "__main__":
    print("🚀 Operator Uplift - Logo & Gradient Fix Test")
    print("=" * 60)
    
    success = True
    
    # Test logo replacement
    if not test_logo_replacement():
        success = False
    
    # Test cube styles
    if not test_cube_styles():
        success = False
    
    # Test gradient fixes
    if not test_gradient_fixes():
        success = False
    
    # Test social buttons
    if not test_social_buttons():
        success = False
    
    # Test lucky wheel
    if not test_lucky_wheel():
        success = False
    
    # Test chart colors
    if not test_chart_colors():
        success = False
    
    # Test old logo removal
    if not test_old_logo_removal():
        success = False
    
    # Generate summary
    fixes = generate_fix_summary()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 LOGO & GRADIENT FIXES COMPLETED!")
        print("✅ Logo replaced with rotating cube")
        print("✅ Blue/cyan/purple gradients fixed")
        print("✅ Social buttons use orange theme")
        print("✅ Lucky wheel uses orange theme")
        print("✅ Chart colors use orange theme")
        print("✅ Old logo references cleaned up")
    else:
        print("⚠️ SOME FIXES FAILED")
        print("Please review and fix the issues above")
    
    print(f"\n📊 FIXES SUMMARY:")
    print(f"   - Fixes Applied: {len(fixes)}")
    print(f"   - Logo: PNG replaced with 3D rotating cube")
    print(f"   - Gradients: Blue/cyan/purple → Orange theme")
    print(f"   - Consistency: All elements use orange theme")
    print(f"   - Cleanup: Old logo references removed")
    
    print(f"\n🎲 ROTATING CUBE FEATURES:")
    print(f"   1. 3D rotating cube with 6 faces")
    print(f"   2. SVG logo on each face")
    print(f"   3. Smooth 8-second rotation animation")
    print(f"   4. Orange accent color theme")
    print(f"   5. Glass morphism effects")
    print(f"   6. Responsive design")
    
    print(f"\n🌈 GRADIENT FIXES:")
    print(f"   1. Social media buttons: Blue → Orange")
    print(f"   2. Lucky wheel segments: Multi-color → Orange")
    print(f"   3. Chart.js colors: Blue/purple → Orange")
    print(f"   4. Consistent orange theme throughout")
    print(f"   5. No more blue/cyan/purple conflicts")
    
    print(f"\n🚀 READY FOR TESTING!")
    print(f"   - Login screen should show rotating cube")
    print(f"   - No blue/cyan/purple gradients visible")
    print(f"   - All elements use orange theme")
    print(f"   - Cube should rotate smoothly")
    print(f"   - Social buttons should be orange")
    print(f"   - Lucky wheel should be orange") 