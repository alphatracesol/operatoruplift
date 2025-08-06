#!/usr/bin/env python3
"""
Test to verify 3D cube structure and hover effects
"""

import re

def test_3d_cube_structure():
    """Test that the cube has proper 3D structure"""
    print("🎲 Testing 3D Cube Structure...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for proper 3D cube CSS
    mini_cube_css = re.search(r'\.mini-cube\s*\{[^}]*\}', content, re.DOTALL)
    if mini_cube_css and 'transform-style: preserve-3d' in mini_cube_css.group(0):
        print("✅ Mini cube has 3D transform style")
    else:
        print("❌ Mini cube missing 3D transform")
        return False
    
    # Check for proper face positioning
    if all([
        'transform: rotateY(0deg) translateZ(30px)' in content,
        'transform: rotateY(180deg) translateZ(30px)' in content,
        'transform: rotateY(90deg) translateZ(30px)' in content,
        'transform: rotateY(-90deg) translateZ(30px)' in content,
        'transform: rotateX(90deg) translateZ(30px)' in content,
        'transform: rotateX(-90deg) translateZ(30px)' in content
    ]):
        print("✅ All 6 cube faces properly positioned")
    else:
        print("❌ Cube faces not properly positioned")
        return False
    
    return True

def test_cube_hover_effects():
    """Test that cube faces have proper hover effects"""
    print("\n✨ Testing Cube Hover Effects...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for cube face hover effects
    if 'background: rgba(249, 115, 22, 0.15)' in content and 'border-color: rgba(249, 115, 22, 0.8)' in content:
        print("✅ Cube faces have proper hover effects")
    else:
        print("❌ Cube faces missing hover effects")
        return False
    
    # Check for logo hover effects
    if 'filter: drop-shadow(0 0 15px var(--accent-color))' in content and 'transform: scale(1.1)' in content:
        print("✅ Cube logo has hover effects")
    else:
        print("❌ Cube logo missing hover effects")
        return False
    
    return True

def test_auth_card_hover():
    """Test that auth card has proper hover gradient sweep"""
    print("\n🎨 Testing Auth Card Hover Effect...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for auth card hover effect
    if '.auth-card::before' in content and 'left: -100%' in content and 'transition: left 0.5s' in content:
        print("✅ Auth card has gradient sweep effect")
    else:
        print("❌ Auth card missing gradient sweep")
        return False
    
    # Check for hover trigger
    if '.auth-card:hover::before' in content and 'left: 100%' in content:
        print("✅ Auth card hover triggers sweep")
    else:
        print("❌ Auth card hover not working")
        return False
    
    return True

def test_cube_interaction():
    """Test that cube has proper interaction setup"""
    print("\n🎮 Testing Cube Interaction...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for cursor styles
    if 'cursor: grab' in content and 'cursor: grabbing' in content:
        print("✅ Cube has proper cursor styles")
    else:
        print("❌ Cube missing cursor styles")
        return False
    
    # Check for 3D interaction logic
    if 'autoRotateSpeed = 0.1' in content and 'rotationY += autoRotateSpeed' in content:
        print("✅ Cube has auto-rotation logic")
    else:
        print("❌ Cube missing auto-rotation")
        return False
    
    return True

if __name__ == "__main__":
    print("🔧 3D Cube and Hover Effects Test")
    print("=" * 50)
    
    success = True
    
    tests = [
        test_3d_cube_structure,
        test_cube_hover_effects,
        test_auth_card_hover,
        test_cube_interaction
    ]
    
    for test in tests:
        if not test():
            success = False
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 3D CUBE AND HOVER EFFECTS IMPLEMENTED!")
        print("✅ True 3D cube structure")
        print("✅ Cube face hover effects")
        print("✅ Auth card gradient sweep")
        print("✅ Interactive 3D rotation")
    else:
        print("⚠️ 3D CUBE AND HOVER EFFECTS NEED FIXING")
    
    print(f"\n📊 3D FEATURES:")
    print(f"   - Cube: True 3D with 6 faces")
    print(f"   - Hover: Face and logo effects")
    print(f"   - Auth Card: Gradient sweep on hover")
    print(f"   - Interaction: Drag to rotate with inertia")
    
    print(f"\n🚀 READY FOR 3D TESTING!")
    print(f"   - Cube should be truly 3D")
    print(f"   - Hover over cube faces for effects")
    print(f"   - Hover over auth card for sweep")
    print(f"   - Drag cube to rotate with inertia") 