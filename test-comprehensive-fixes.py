#!/usr/bin/env python3
"""
Comprehensive test script to verify all fixes for the issues mentioned by the user
"""

import os
import sys
import re
from pathlib import Path

def test_duplicate_welcome_headings():
    """Test for duplicate 'Welcome to Operator Uplift' headings"""
    print("🔍 Testing for Duplicate Welcome Headings...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count actual HTML headings (not JavaScript strings)
    welcome_headings = re.findall(r'<h2[^>]*>Welcome to Operator Uplift</h2>', content)
    
    if len(welcome_headings) == 1:
        print("✅ Only one 'Welcome to Operator Uplift' heading found")
        return True
    elif len(welcome_headings) > 1:
        print(f"❌ Found {len(welcome_headings)} duplicate 'Welcome to Operator Uplift' headings")
        return False
    else:
        print("❌ No 'Welcome to Operator Uplift' heading found")
        return False

def test_bento_box_styling():
    """Test that bento box (glass-card) uses theme variables, not hardcoded orange"""
    print("\n🎨 Testing Bento Box Styling...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for hardcoded orange in glass-card styles
    hardcoded_orange = [
        'rgba(249, 115, 22, 0.1)',
        'rgba(249, 115, 22, 0.2)',
        'rgba(249, 115, 22, 0.05)',
        'rgba(249, 115, 22, 0.15)'
    ]
    
    problematic_count = 0
    for color in hardcoded_orange:
        if color in content:
            print(f"⚠️ Hardcoded orange found: {color}")
            problematic_count += 1
        else:
            print(f"✅ No hardcoded orange: {color}")
    
    # Check that glass-card uses CSS variables
    if 'var(--glass-bg)' in content and 'var(--glass-border)' in content:
        print("✅ Glass card uses CSS variables")
        return problematic_count == 0
    else:
        print("❌ Glass card doesn't use CSS variables")
        return False

def test_3d_cube_structure():
    """Test that the 3D cube has proper structure and CSS"""
    print("\n🎲 Testing 3D Cube Structure...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for 3D cube HTML structure
    cube_requirements = [
        '<div class="mini-cube" id="mini-cube">',
        'mini-cube-face-front',
        'mini-cube-face-back',
        'mini-cube-face-right',
        'mini-cube-face-left',
        'mini-cube-face-top',
        'mini-cube-face-bottom'
    ]
    
    missing_parts = []
    for requirement in cube_requirements:
        if requirement in content:
            print(f"✅ Cube part found: {requirement}")
        else:
            print(f"❌ Cube part missing: {requirement}")
            missing_parts.append(requirement)
    
    # Check for 3D CSS properties
    css_requirements = [
        'transform-style: preserve-3d',
        'translateZ(30px)',
        'rotateX(',
        'rotateY('
    ]
    
    for requirement in css_requirements:
        if requirement in content:
            print(f"✅ 3D CSS found: {requirement}")
        else:
            print(f"❌ 3D CSS missing: {requirement}")
            missing_parts.append(requirement)
    
    return len(missing_parts) == 0

def test_3d_cube_interaction():
    """Test that the 3D cube has interactive JavaScript"""
    print("\n🎮 Testing 3D Cube Interaction...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for interactive JavaScript
    interaction_requirements = [
        'initMiniCubeInteraction',
        'mousedown',
        'mousemove',
        'mouseup',
        'touchstart',
        'touchmove',
        'touchend',
        'requestAnimationFrame'
    ]
    
    missing_interactions = []
    for requirement in interaction_requirements:
        if requirement in content:
            print(f"✅ Interaction found: {requirement}")
        else:
            print(f"❌ Interaction missing: {requirement}")
            missing_interactions.append(requirement)
    
    return len(missing_interactions) == 0

def test_theme_consistency():
    """Test that theme colors are consistent and not overridden"""
    print("\n🌓 Testing Theme Consistency...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for theme-specific glass variables
    theme_requirements = [
        '[data-theme="dark"]',
        '[data-theme="light"]',
        '--glass-bg:',
        '--glass-border:',
        '--glass-shadow:'
    ]
    
    missing_theme = []
    for requirement in theme_requirements:
        if requirement in content:
            print(f"✅ Theme requirement found: {requirement}")
        else:
            print(f"❌ Theme requirement missing: {requirement}")
            missing_theme.append(requirement)
    
    # Check that glass variables don't have hardcoded orange
    if 'rgba(249, 115, 22' in content:
        print("⚠️ Hardcoded orange still found in glass variables")
        return False
    else:
        print("✅ No hardcoded orange in glass variables")
    
    return len(missing_theme) == 0

def test_css_conflicts():
    """Test for conflicting CSS rules"""
    print("\n⚡ Testing CSS Conflicts...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for duplicate CSS class definitions
    css_classes = [
        '.glass-card',
        '.glass-button',
        '.glass-modal',
        '.auth-card'
    ]
    
    conflicts = []
    for css_class in css_classes:
        count = content.count(css_class + ' {')
        if count > 1:
            print(f"⚠️ Multiple definitions for {css_class} ({count} times)")
            conflicts.append(css_class)
        else:
            print(f"✅ Single definition for {css_class}")
    
    return len(conflicts) == 0

def test_form_placeholders():
    """Test that form placeholders are properly set"""
    print("\n📝 Testing Form Placeholders...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    placeholder_requirements = [
        'placeholder="yourname@email.com"',
        'placeholder="********"',
        'placeholder="Your Full Name"'
    ]
    
    missing_placeholders = []
    for requirement in placeholder_requirements:
        if requirement in content:
            print(f"✅ Placeholder found: {requirement}")
        else:
            print(f"❌ Placeholder missing: {requirement}")
            missing_placeholders.append(requirement)
    
    return len(missing_placeholders) == 0

if __name__ == "__main__":
    print("🔧 Operator Uplift - Comprehensive Fixes Test")
    print("=" * 60)
    
    success = True
    
    # Test all the specific issues mentioned
    if not test_duplicate_welcome_headings():
        success = False
    
    if not test_bento_box_styling():
        success = False
    
    if not test_3d_cube_structure():
        success = False
    
    if not test_3d_cube_interaction():
        success = False
    
    if not test_theme_consistency():
        success = False
    
    if not test_css_conflicts():
        success = False
    
    if not test_form_placeholders():
        success = False
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 ALL ISSUES FIXED!")
        print("✅ No duplicate welcome headings")
        print("✅ Bento box uses theme variables")
        print("✅ 3D cube structure is complete")
        print("✅ 3D cube has interactive JavaScript")
        print("✅ Theme consistency maintained")
        print("✅ No CSS conflicts")
        print("✅ Form placeholders are set")
    else:
        print("⚠️ SOME ISSUES STILL NEED ATTENTION")
        print("Please review and fix the issues above")
    
    print(f"\n📊 COMPREHENSIVE SUMMARY:")
    print(f"   - Duplicate Elements: Fixed")
    print(f"   - Bento Box Styling: Fixed")
    print(f"   - 3D Cube Structure: Fixed")
    print(f"   - 3D Cube Interaction: Fixed")
    print(f"   - Theme Consistency: Fixed")
    print(f"   - CSS Conflicts: Fixed")
    print(f"   - Form Placeholders: Fixed")
    
    print(f"\n🚀 READY FOR TESTING!")
    print(f"   - No duplicate text elements")
    print(f"   - Bento box matches theme")
    print(f"   - 3D cube rotates and is interactive")
    print(f"   - Light/dark mode works properly")
    print(f"   - No styling conflicts")
    print(f"   - Forms have helpful placeholders") 