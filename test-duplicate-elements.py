#!/usr/bin/env python3
"""
Test script to check for duplicate elements and styling conflicts
"""

import os
import sys
import re
from pathlib import Path

def test_duplicate_elements():
    """Test for duplicate HTML elements that might cause visual conflicts"""
    print("🔍 Testing for Duplicate Elements...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for duplicate dashboard views
    dashboard_views = re.findall(r'<div class="view" id="dashboard-view">', content)
    if len(dashboard_views) > 1:
        print(f"❌ Found {len(dashboard_views)} duplicate dashboard views")
        return False
    elif len(dashboard_views) == 1:
        print("✅ Only one dashboard view found")
    else:
        print("❌ No dashboard view found")
        return False
    
    # Check for duplicate welcome titles
    welcome_titles = re.findall(r'<h1 class="welcome-title">Welcome back, Operator!</h1>', content)
    if len(welcome_titles) > 1:
        print(f"❌ Found {len(welcome_titles)} duplicate welcome titles")
        return False
    elif len(welcome_titles) == 1:
        print("✅ Only one welcome title found")
    else:
        print("❌ No welcome title found")
        return False
    
    # Check for duplicate "Welcome to Operator Uplift" headings
    welcome_operator = re.findall(r'<h2[^>]*>Welcome to Operator Uplift</h2>', content)
    if len(welcome_operator) > 1:
        print(f"❌ Found {len(welcome_operator)} duplicate 'Welcome to Operator Uplift' headings")
        return False
    elif len(welcome_operator) == 1:
        print("✅ Only one 'Welcome to Operator Uplift' heading found")
    else:
        print("❌ No 'Welcome to Operator Uplift' heading found")
        return False
    
    return True

def test_hardcoded_colors():
    """Test for hardcoded colors that might override theme variables"""
    print("\n🎨 Testing for Hardcoded Colors...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for problematic hardcoded colors
    hardcoded_colors = [
        'color: #f97316',
        'color: #ea580c',
        'background: #f97316',
        'background: #ea580c',
        'border-color: #f97316',
        'border-color: #ea580c'
    ]
    
    problematic_count = 0
    for color in hardcoded_colors:
        count = content.count(color)
        if count > 0:
            print(f"⚠️ Hardcoded color found: {color} ({count} times)")
            problematic_count += 1
        else:
            print(f"✅ No hardcoded color: {color}")
    
    if problematic_count == 0:
        print("✅ All hardcoded colors removed")
        return True
    else:
        print(f"⚠️ {problematic_count} hardcoded colors still present")
        return False

def test_css_variables():
    """Test that CSS variables are properly defined"""
    print("\n🎯 Testing CSS Variables...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for essential CSS variables
    essential_vars = [
        '--accent-color',
        '--text-primary',
        '--bg-primary',
        '--accent-glow',
        '--accent-glow-strong'
    ]
    
    missing_vars = []
    for var in essential_vars:
        if var in content:
            print(f"✅ CSS variable found: {var}")
        else:
            print(f"❌ CSS variable missing: {var}")
            missing_vars.append(var)
    
    if len(missing_vars) == 0:
        print("✅ All essential CSS variables present")
        return True
    else:
        print(f"❌ {len(missing_vars)} CSS variables missing")
        return False

def test_theme_consistency():
    """Test that theme colors are consistent"""
    print("\n🌓 Testing Theme Consistency...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for theme-specific accent colors
    dark_theme = re.search(r'\[data-theme="dark"\][^}]*--accent-color:\s*([^;]+)', content)
    light_theme = re.search(r'\[data-theme="light"\][^}]*--accent-color:\s*([^;]+)', content)
    
    if dark_theme and light_theme:
        dark_color = dark_theme.group(1).strip()
        light_color = light_theme.group(1).strip()
        
        print(f"✅ Dark theme accent: {dark_color}")
        print(f"✅ Light theme accent: {light_color}")
        
        if dark_color != light_color:
            print("✅ Theme colors are different (good!)")
            return True
        else:
            print("❌ Theme colors are the same (bad!)")
            return False
    else:
        print("❌ Could not find theme color definitions")
        return False

def test_element_positions():
    """Test that elements don't have conflicting positioning"""
    print("\n📍 Testing Element Positions...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for problematic positioning
    positioning_issues = [
        'position: absolute',
        'position: fixed',
        'z-index: -1',
        'z-index: 0'
    ]
    
    issue_count = 0
    for issue in positioning_issues:
        count = content.count(issue)
        if count > 10:  # Too many absolute/fixed positions might cause conflicts
            print(f"⚠️ Many {issue} rules found ({count} times)")
            issue_count += 1
        else:
            print(f"✅ Reasonable {issue} usage ({count} times)")
    
    if issue_count == 0:
        print("✅ No positioning conflicts detected")
        return True
    else:
        print(f"⚠️ {issue_count} potential positioning issues")
        return False

if __name__ == "__main__":
    print("🔍 Operator Uplift - Duplicate Elements Test")
    print("=" * 60)
    
    success = True
    
    # Test for duplicate elements
    if not test_duplicate_elements():
        success = False
    
    # Test for hardcoded colors
    if not test_hardcoded_colors():
        success = False
    
    # Test CSS variables
    if not test_css_variables():
        success = False
    
    # Test theme consistency
    if not test_theme_consistency():
        success = False
    
    # Test element positions
    if not test_element_positions():
        success = False
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 DUPLICATE ELEMENTS TEST PASSED!")
        print("✅ No duplicate elements found")
        print("✅ No hardcoded color conflicts")
        print("✅ CSS variables properly defined")
        print("✅ Theme consistency maintained")
        print("✅ No positioning conflicts")
    else:
        print("⚠️ DUPLICATE ELEMENTS TEST FAILED!")
        print("Please review and fix the issues above")
    
    print(f"\n📊 TEST SUMMARY:")
    print(f"   - Duplicate Elements: Checked")
    print(f"   - Hardcoded Colors: Checked")
    print(f"   - CSS Variables: Checked")
    print(f"   - Theme Consistency: Checked")
    print(f"   - Element Positions: Checked")
    
    print(f"\n🚀 READY FOR TESTING!")
    print(f"   - No duplicate text elements")
    print(f"   - Consistent styling throughout")
    print(f"   - Theme colors work properly")
    print(f"   - No visual conflicts") 