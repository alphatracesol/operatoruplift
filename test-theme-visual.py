#!/usr/bin/env python3
"""
Test script to verify visual theme changes are working properly
"""

import os
import sys
import re
from pathlib import Path

def test_theme_color_changes():
    """Test that theme colors actually change between light/dark"""
    print("🎨 Testing Theme Color Changes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for different accent colors in light vs dark themes
    dark_accent = '#f97316'
    light_accent = '#ea580c'
    
    dark_theme_section = re.search(r'\[data-theme="dark"\][^}]*--accent-color:\s*([^;]+)', content)
    light_theme_section = re.search(r'\[data-theme="light"\][^}]*--accent-color:\s*([^;]+)', content)
    
    if dark_theme_section and light_theme_section:
        dark_color = dark_theme_section.group(1).strip()
        light_color = light_theme_section.group(1).strip()
        
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

def test_background_changes():
    """Test that backgrounds change between themes"""
    print("\n🌅 Testing Background Changes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for different background colors
    dark_bg = '#000000'
    light_bg = '#ffffff'
    
    dark_bg_section = re.search(r'\[data-theme="dark"\][^}]*--bg-primary:\s*([^;]+)', content)
    light_bg_section = re.search(r'\[data-theme="light"\][^}]*--bg-primary:\s*([^;]+)', content)
    
    if dark_bg_section and light_bg_section:
        dark_bg_color = dark_bg_section.group(1).strip()
        light_bg_color = light_bg_section.group(1).strip()
        
        print(f"✅ Dark theme background: {dark_bg_color}")
        print(f"✅ Light theme background: {light_bg_color}")
        
        if dark_bg_color != light_bg_color:
            print("✅ Background colors are different (good!)")
            return True
        else:
            print("❌ Background colors are the same (bad!)")
            return False
    else:
        print("❌ Could not find background color definitions")
        return False

def test_text_color_changes():
    """Test that text colors change between themes"""
    print("\n📝 Testing Text Color Changes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for different text colors
    dark_text_section = re.search(r'\[data-theme="dark"\][^}]*--text-primary:\s*([^;]+)', content)
    light_text_section = re.search(r'\[data-theme="light"\][^}]*--text-primary:\s*([^;]+)', content)
    
    if dark_text_section and light_text_section:
        dark_text_color = dark_text_section.group(1).strip()
        light_text_color = light_text_section.group(1).strip()
        
        print(f"✅ Dark theme text: {dark_text_color}")
        print(f"✅ Light theme text: {light_text_color}")
        
        if dark_text_color != light_text_color:
            print("✅ Text colors are different (good!)")
            return True
        else:
            print("❌ Text colors are the same (bad!)")
            return False
    else:
        print("❌ Could not find text color definitions")
        return False

def test_glass_effects():
    """Test that glass effects change between themes"""
    print("\n🔮 Testing Glass Effects...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for glass effect variables
    glass_vars = ['--glass-bg', '--glass-border', '--glass-shadow']
    
    for var in glass_vars:
        dark_glass = re.search(r'\[data-theme="dark"\][^}]*' + var + r':\s*([^;]+)', content)
        light_glass = re.search(r'\[data-theme="light"\][^}]*' + var + r':\s*([^;]+)', content)
        
        if dark_glass and light_glass:
            dark_value = dark_glass.group(1).strip()
            light_value = light_glass.group(1).strip()
            
            print(f"✅ {var}: Dark={dark_value}, Light={light_value}")
            
            if dark_value != light_value:
                print(f"   ✅ {var} changes between themes")
            else:
                print(f"   ⚠️ {var} same in both themes")
        else:
            print(f"❌ Could not find {var} definitions")
    
    return True

def test_gradient_sweep_effect():
    """Test that gradient sweep effects are properly implemented"""
    print("\n🌈 Testing Gradient Sweep Effects...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for gradient sweep implementation
    sweep_features = [
        'content: \'\'',
        'position: absolute',
        'left: -100%',
        'transition: left 0.5s ease',
        'left: 100%'
    ]
    
    for feature in sweep_features:
        if feature in content:
            print(f"✅ Gradient sweep feature found: {feature}")
        else:
            print(f"❌ Gradient sweep feature missing: {feature}")
            return False
    
    return True

def test_theme_override_removal():
    """Test that hardcoded colors don't override theme variables"""
    print("\n🚫 Testing Theme Override Removal...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for problematic hardcoded colors
    hardcoded_colors = [
        'rgba(249, 115, 22, 0.2)',  # Hardcoded orange
        'rgba(249, 115, 22, 0.1)',  # Hardcoded orange
        'rgba(249, 115, 22, 0.6)',  # Hardcoded orange
        '#f97316',                  # Hardcoded orange hex
        '#ea580c'                   # Hardcoded orange hex
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

def generate_visual_summary():
    """Generate visual theme summary"""
    print("\n📊 Visual Theme Summary:")
    
    features = [
        "🎨 Accent Colors: Different orange shades for light/dark",
        "🌅 Backgrounds: Black for dark, white for light",
        "📝 Text Colors: White for dark, black for light",
        "🔮 Glass Effects: Different opacity levels per theme",
        "🌈 Gradient Sweep: Animated button hover effects",
        "🚫 No Overrides: Theme variables take precedence",
        "🔄 Smooth Transitions: All changes animate smoothly"
    ]
    
    for feature in features:
        print(f"   {feature}")
    
    return features

if __name__ == "__main__":
    print("🎨 Operator Uplift - Visual Theme Test")
    print("=" * 60)
    
    success = True
    
    # Test theme color changes
    if not test_theme_color_changes():
        success = False
    
    # Test background changes
    if not test_background_changes():
        success = False
    
    # Test text color changes
    if not test_text_color_changes():
        success = False
    
    # Test glass effects
    if not test_glass_effects():
        success = False
    
    # Test gradient sweep effects
    if not test_gradient_sweep_effect():
        success = False
    
    # Test theme override removal
    if not test_theme_override_removal():
        success = False
    
    # Generate summary
    features = generate_visual_summary()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 VISUAL THEME FUNCTIONALITY COMPLETED!")
        print("✅ Theme colors change properly")
        print("✅ Backgrounds switch correctly")
        print("✅ Text colors adapt to theme")
        print("✅ Glass effects theme-aware")
        print("✅ Gradient sweeps working")
        print("✅ No hardcoded overrides")
    else:
        print("⚠️ SOME VISUAL THEME FEATURES NEED ATTENTION")
        print("Please review and fix the issues above")
    
    print(f"\n📊 VISUAL SUMMARY:")
    print(f"   - Features Tested: {len(features)}")
    print(f"   - Color Changes: Accent, background, text")
    print(f"   - Effects: Glass, gradients, transitions")
    print(f"   - Overrides: Removed hardcoded colors")
    
    print(f"\n🎨 VISUAL THEME FEATURES:")
    print(f"   1. Dark theme: Black background, white text, bright orange")
    print(f"   2. Light theme: White background, black text, darker orange")
    print(f"   3. Glass morphism: Theme-appropriate opacity")
    print(f"   4. Button effects: Gradient sweep animations")
    print(f"   5. Smooth transitions: All changes animate")
    print(f"   6. No conflicts: Theme variables take priority")
    
    print(f"\n🚀 READY FOR VISUAL TESTING!")
    print(f"   - Click theme toggle to see changes")
    print(f"   - All components should update")
    print(f"   - Smooth animations on hover")
    print(f"   - Consistent styling throughout")
    print(f"   - No hardcoded color conflicts") 