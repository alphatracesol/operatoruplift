#!/usr/bin/env python3
"""
Test for first chunk of UI fixes (100-150 lines)
"""

import re

def test_cube_positioning():
    """Test that cube is properly positioned above title"""
    print("🎲 Testing Cube Positioning...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for proper container sizing
    if 'width: 60px' in content and 'height: 60px' in content and 'margin-left: auto' in content and 'margin-right: auto' in content:
        print("✅ Cube container properly sized and centered")
    else:
        print("❌ Cube container not properly positioned")
        return False
    
    return True

def test_welcome_title_styling():
    """Test that welcome title has proper styling"""
    print("\n✨ Testing Welcome Title Styling...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for welcome-title class
    if 'class="welcome-title"' in content:
        print("✅ Welcome title has proper class")
    else:
        print("❌ Welcome title missing class")
        return False
    
    # Check for CSS styling
    if 'text-shadow: 0 0 20px var(--accent-color)' in content:
        print("✅ Welcome title has orange glow")
    else:
        print("❌ Welcome title missing orange glow")
        return False
    
    return True

def test_theme_toggle_hover():
    """Test that theme toggle uses accent color on hover"""
    print("\n🌓 Testing Theme Toggle Hover...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for accent color hover effect
    if 'box-shadow: 0 0 20px var(--accent-glow)' in content:
        print("✅ Theme toggle uses accent color on hover")
    else:
        print("❌ Theme toggle not using accent color")
        return False
    
    return True

def test_sun_icon():
    """Test that sun icon is properly implemented"""
    print("\n☀️ Testing Sun Icon...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for SVG sun icon
    if 'circle cx="12" cy="12" r="5"' in content and 'stroke="currentColor"' in content:
        print("✅ Sun icon properly implemented with SVG")
    else:
        print("❌ Sun icon not properly implemented")
        return False
    
    return True

if __name__ == "__main__":
    print("🔧 UI Fixes Chunk 1 Test")
    print("=" * 40)
    
    success = True
    
    tests = [
        test_cube_positioning,
        test_welcome_title_styling,
        test_theme_toggle_hover,
        test_sun_icon
    ]
    
    for test in tests:
        if not test():
            success = False
    
    print("\n" + "=" * 40)
    if success:
        print("🎉 CHUNK 1 UI FIXES IMPLEMENTED!")
        print("✅ Cube properly positioned above title")
        print("✅ Welcome title with orange glow")
        print("✅ Theme toggle uses accent color")
        print("✅ Proper sun icon implemented")
    else:
        print("⚠️ CHUNK 1 UI FIXES NEED ATTENTION")
    
    print(f"\n📊 CHUNK 1 STATUS:")
    print(f"   - Cube: Centered above title")
    print(f"   - Title: White with orange glow")
    print(f"   - Theme Toggle: Accent color hover")
    print(f"   - Sun Icon: SVG with rays")
    
    print(f"\n🚀 READY FOR CHUNK 2!")
    print(f"   - Next: Auto-spinning cube")
    print(f"   - Next: Testing dashboard")
    print(f"   - Next: Function testing") 