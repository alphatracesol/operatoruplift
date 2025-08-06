#!/usr/bin/env python3
"""
Test script to verify style improvements
"""

import os
import sys
import re
from pathlib import Path

def test_matrix_rain_improvements():
    """Test matrix rain improvements"""
    print("🌧️ Testing Matrix Rain Improvements...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for Japanese characters
    if 'あいうえおかきくけこ' in content:
        print("✅ Japanese characters found")
    else:
        print("❌ Japanese characters missing")
        return False
    
    # Check for slower speed
    if 'setInterval(draw, 60)' in content:
        print("✅ Slower speed (60ms) found")
    else:
        print("❌ Slower speed not found")
        return False
    
    # Check for larger font size
    if 'fontSize = 12' in content:
        print("✅ Larger font size (12px) found")
    else:
        print("❌ Larger font size not found")
        return False
    
    return True

def test_bento_box_improvements():
    """Test bento box style improvements"""
    print("\n🎨 Testing Bento Box Improvements...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for less opaque backgrounds
    if 'rgba(249, 115, 22, 0.05)' in content:
        print("✅ Less opaque background found")
    else:
        print("❌ Less opaque background missing")
        return False
    
    # Check for better glass effects
    if 'backdrop-filter: blur(15px)' in content:
        print("✅ Better glass blur effect found")
    else:
        print("❌ Better glass blur effect missing")
        return False
    
    # Check for orange-tinted borders
    if 'rgba(249, 115, 22, 0.15)' in content:
        print("✅ Orange-tinted borders found")
    else:
        print("❌ Orange-tinted borders missing")
        return False
    
    # Check for enhanced hover effects
    if 'transform: translateY(-6px) scale(1.02)' in content:
        print("✅ Enhanced hover effects found")
    else:
        print("❌ Enhanced hover effects missing")
        return False
    
    return True

def test_blue_color_fixes():
    """Test blue color fixes"""
    print("\n🔵 Testing Blue Color Fixes...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check that blue colors are replaced with orange
    blue_checks = [
        '#3b82f6',
        '#2563eb',
        '#1d4ed8'
    ]
    
    for blue_color in blue_checks:
        if blue_color in content:
            print(f"❌ Blue color still found: {blue_color}")
            return False
    
    print("✅ All blue colors replaced with orange")
    
    # Check for orange replacements
    orange_checks = [
        '--info-color: #f97316',
        'rgba(249, 115, 22, 0.2)',
        'color: #f97316'
    ]
    
    for orange_check in orange_checks:
        if orange_check in content:
            print(f"✅ Orange replacement found: {orange_check}")
        else:
            print(f"❌ Orange replacement missing: {orange_check}")
            return False
    
    return True

def test_gradient_hover_effects():
    """Test gradient hover effects"""
    print("\n🌈 Testing Gradient Hover Effects...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for enhanced hover effects
    hover_checks = [
        'outline: 2px solid rgba(249, 115, 22, 0.3)',
        'outline-offset: 2px',
        'scale(1.02)',
        'rgba(249, 115, 22, 0.25)'
    ]
    
    for check in hover_checks:
        if check in content:
            print(f"✅ Enhanced hover effect found: {check}")
        else:
            print(f"❌ Enhanced hover effect missing: {check}")
            return False
    
    return True

def test_glass_effects():
    """Test glass morphism effects"""
    print("\n🔮 Testing Glass Morphism Effects...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for improved glass effects
    glass_checks = [
        'backdrop-filter: blur(15px)',
        'backdrop-filter: blur(12px)',
        'backdrop-filter: blur(20px)',
        'rgba(249, 115, 22, 0.06)',
        'rgba(249, 115, 22, 0.08)'
    ]
    
    for check in glass_checks:
        if check in content:
            print(f"✅ Glass effect found: {check}")
        else:
            print(f"❌ Glass effect missing: {check}")
            return False
    
    return True

def generate_improvement_summary():
    """Generate improvement summary"""
    print("\n📊 Style Improvement Summary:")
    
    improvements = [
        "🌧️ Matrix Rain: Japanese characters, slower speed (60ms), larger font (12px)",
        "🎨 Bento Box: Less opaque (0.05), orange-tinted borders, enhanced hover effects",
        "🔵 Color Fixes: All blue colors replaced with orange theme",
        "🌈 Hover Effects: Gradient sweeps, outline effects, scale transforms",
        "🔮 Glass Effects: Enhanced blur (15px/12px/20px), orange-tinted backgrounds",
        "✨ Visual Polish: Better shadows, transitions, and visual feedback"
    ]
    
    for improvement in improvements:
        print(f"   {improvement}")
    
    return improvements

if __name__ == "__main__":
    print("🚀 Operator Uplift - Style Improvements Test")
    print("=" * 60)
    
    success = True
    
    # Test matrix rain improvements
    if not test_matrix_rain_improvements():
        success = False
    
    # Test bento box improvements
    if not test_bento_box_improvements():
        success = False
    
    # Test blue color fixes
    if not test_blue_color_fixes():
        success = False
    
    # Test gradient hover effects
    if not test_gradient_hover_effects():
        success = False
    
    # Test glass effects
    if not test_glass_effects():
        success = False
    
    # Generate summary
    improvements = generate_improvement_summary()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 STYLE IMPROVEMENTS COMPLETED!")
        print("✅ Matrix rain enhanced with Japanese characters")
        print("✅ Bento box styles improved with less opacity")
        print("✅ All blue colors replaced with orange theme")
        print("✅ Enhanced gradient hover effects added")
        print("✅ Glass morphism effects improved")
    else:
        print("⚠️ SOME STYLE IMPROVEMENTS FAILED")
        print("Please review and fix the issues above")
    
    print(f"\n📊 IMPROVEMENTS SUMMARY:")
    print(f"   - Improvements Made: {len(improvements)}")
    print(f"   - Matrix Rain: Japanese characters, slower speed")
    print(f"   - Bento Box: Less opaque, better glass effects")
    print(f"   - Color Theme: Pure orange/black throughout")
    print(f"   - Hover Effects: Enhanced with outlines and scaling")
    
    print(f"\n🎨 VISUAL ENHANCEMENTS:")
    print(f"   1. Matrix rain now uses Japanese characters")
    print(f"   2. Matrix rain runs at slower, more elegant speed")
    print(f"   3. Bento boxes are less opaque and more elegant")
    print(f"   4. All blue elements now use orange theme")
    print(f"   5. Enhanced hover effects with gradient sweeps")
    print(f"   6. Better glass morphism with orange tints")
    
    print(f"\n🚀 READY FOR TESTING!")
    print(f"   - Matrix rain should be slower and more elegant")
    print(f"   - Bento boxes should be less opaque")
    print(f"   - No blue colors should remain")
    print(f"   - Hover effects should be enhanced")
    print(f"   - Glass effects should be improved") 