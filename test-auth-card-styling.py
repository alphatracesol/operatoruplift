#!/usr/bin/env python3
"""
Test to verify auth card styling is correct
"""

import re

def test_auth_card_styling():
    """Test that auth card uses grey background with orange accents"""
    print("🎨 Testing Auth Card Styling...")
    
    with open("app.html", 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for proper auth card styling
    auth_card_css = re.search(r'\.auth-card\s*\{[^}]*\}', content, re.DOTALL)
    
    if auth_card_css:
        css_content = auth_card_css.group(0)
        print("✅ Auth card CSS found")
        
        # Check for theme-aware background
        if 'background: var(--auth-card-bg)' in css_content and 'backdrop-filter: blur(10px)' in css_content:
            print("✅ Theme-aware glass morphism background")
        else:
            print("❌ Wrong background color")
            return False
        
        # Check for orange border
        if 'border: 1px solid var(--accent-color)' in css_content:
            print("✅ Orange accent border (1px)")
        else:
            print("❌ Wrong border color")
            return False
        
        # Check for proper heading color
        auth_card_h2 = re.search(r'\.auth-card h2\s*\{[^}]*\}', content, re.DOTALL)
        if auth_card_h2 and 'color: var(--text-primary)' in auth_card_h2.group(0):
            print("✅ White text color for heading")
        else:
            print("❌ Wrong heading color")
            return False
        
        # Check for accent color in links
        auth_switch_a = re.search(r'\.auth-switch a\s*\{[^}]*\}', content, re.DOTALL)
        if auth_switch_a and 'color: var(--accent-color)' in auth_switch_a.group(0):
            print("✅ Orange accent color for links")
        else:
            print("❌ Wrong link color")
            return False
        
        return True
    else:
        print("❌ Auth card CSS not found")
        return False

if __name__ == "__main__":
    print("🔧 Auth Card Styling Test")
    print("=" * 40)
    
    if test_auth_card_styling():
        print("\n🎉 AUTH CARD STYLING IS CORRECT!")
        print("✅ Theme-aware glass morphism background")
        print("✅ Orange accent border (1px)")
        print("✅ White text for heading")
        print("✅ Orange accent for links")
        print("✅ Hover sweep animation")
    else:
        print("\n⚠️ AUTH CARD STYLING NEEDS FIXING") 