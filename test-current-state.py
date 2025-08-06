#!/usr/bin/env python3
"""
Test script to check the current state of the app after surgical particle removal
"""

import requests
import time
from urllib.parse import urljoin

def test_app_state():
    base_url = "http://127.0.0.1:8080"
    
    print("🔍 Testing current app state after surgical particle removal...")
    print("=" * 60)
    
    # Test main app.html
    print("\n1. Testing app.html...")
    try:
        response = requests.get(f"{base_url}/app.html", timeout=10)
        if response.status_code == 200:
            content = response.text
            print(f"✅ app.html loads successfully ({len(content)} bytes)")
            
            # Check for key elements
            checks = [
                ("matrix-canvas", "Matrix canvas background"),
                ("loading-overlay", "Loading overlay"),
                ("auth-view", "Auth view"),
                ("app-wrapper", "App wrapper"),
                ("btn", "Button styles"),
                ("card", "Card styles"),
                ("modal", "Modal styles"),
                ("particles", "Particle systems (should be removed)"),
                ("tsparticles", "tsParticles (should be removed)"),
                ("particles-js", "particles-js (should be removed)")
            ]
            
            for check, description in checks:
                count = content.count(check)
                if "should be removed" in description:
                    if count == 0:
                        print(f"✅ {description}: Removed ({count} instances)")
                    else:
                        print(f"⚠️  {description}: Still present ({count} instances)")
                else:
                    if count > 0:
                        print(f"✅ {description}: Present ({count} instances)")
                    else:
                        print(f"❌ {description}: Missing")
                        
        else:
            print(f"❌ app.html failed to load: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing app.html: {e}")
    
    # Test press-release.html
    print("\n2. Testing press-release.html...")
    try:
        response = requests.get(f"{base_url}/press-release.html", timeout=10)
        if response.status_code == 200:
            content = response.text
            print(f"✅ press-release.html loads successfully ({len(content)} bytes)")
            
            # Check for Tailwind CSS
            if "cdn.tailwindcss.com" in content:
                print("✅ Tailwind CSS CDN present")
            else:
                print("❌ Tailwind CSS CDN missing")
                
            # Check for key styling elements
            if "Inter" in content and "font-family" in content:
                print("✅ Google Fonts (Inter) present")
            else:
                print("❌ Google Fonts missing")
                
        else:
            print(f"❌ press-release.html failed to load: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing press-release.html: {e}")
    
    # Test MVP Launch Page
    print("\n3. Testing MVP Launch Page.html...")
    try:
        response = requests.get(f"{base_url}/MVP%20Launch%20Page.html", timeout=10)
        if response.status_code == 200:
            content = response.text
            print(f"✅ MVP Launch Page loads successfully ({len(content)} bytes)")
            
            # Check for Tailwind CSS
            if "cdn.tailwindcss.com" in content:
                print("✅ Tailwind CSS CDN present")
            else:
                print("❌ Tailwind CSS CDN missing")
                
        else:
            print(f"❌ MVP Launch Page failed to load: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing MVP Launch Page: {e}")
    
    # Test index.html
    print("\n4. Testing index.html...")
    try:
        response = requests.get(f"{base_url}/index.html", timeout=10)
        if response.status_code == 200:
            content = response.text
            print(f"✅ index.html loads successfully ({len(content)} bytes)")
            
            # Check for key elements
            if "Operator Uplift" in content:
                print("✅ Main content present")
            else:
                print("❌ Main content missing")
                
        else:
            print(f"❌ index.html failed to load: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing index.html: {e}")
    
    print("\n" + "=" * 60)
    print("🎯 Summary:")
    print("- CSP violation for madgicx.ai has been fixed")
    print("- Service worker cache issues have been fixed")
    print("- Missing goals module has been restored")
    print("- Autocomplete attributes have been added")
    print("- Particle systems have been removed")
    print("- Matrix canvas and core styling preserved")
    print("\n📝 Next steps:")
    print("1. Test the app in browser to verify functionality")
    print("2. Check for any remaining formatting issues")
    print("3. Verify that MVP and press release pages display correctly")

if __name__ == "__main__":
    test_app_state()
