#!/usr/bin/env python3
"""
Quick test to check app.html structure
"""

def main():
    print("Quick App.html Test")
    print("=" * 30)
    
    try:
        with open("app.html", 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"File loaded successfully")
        print(f"File size: {len(content):,} characters")
        print(f"Lines: {content.count(chr(10)) + 1}")
        
        # Check for key elements
        checks = [
            ("Loading screen", 'id="loading-screen"'),
            ("Auth view", 'id="auth-view"'),
            ("Dashboard", 'id="dashboard-view"'),
            ("Loading cube", 'id="loading-cube"'),
            ("Mini cube", 'id="mini-cube"'),
            ("Matrix rain", 'matrix-rain'),
            ("Background music", 'background-music')
        ]
        
        for name, pattern in checks:
            count = content.count(pattern)
            status = "OK" if count > 0 else "MISSING"
            print(f"{status} {name}: {count} found")
        
        # Additional checks
        print("\nAdditional checks:")
        print(f"Loading cube faces: {content.count('loading-cube-face')} found")
        print(f"Mini cube faces: {content.count('mini-cube-face')} found")
        print(f"3D transforms: {content.count('translateZ')} found")
        print(f"CSS animations: {content.count('@keyframes')} found")
        
        print("\nTest completed!")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 