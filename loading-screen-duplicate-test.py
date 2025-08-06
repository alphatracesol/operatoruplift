#!/usr/bin/env python3
"""
Test to identify duplicate loading screens and initialization conflicts
"""

def main():
    print("Loading Screen Duplicate Analysis")
    print("=" * 40)
    
    try:
        with open("app.html", 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"File loaded: {len(content):,} characters")
        
        # Check for different loading screen types
        loading_elements = [
            ("loading-screen", 'id="loading-screen"'),
            ("loading-overlay", 'id="loading-overlay"'),
            ("loading-container", 'class="loading-container"'),
            ("loading-wrapper", 'class="loading-wrapper"'),
            ("loading-cube", 'id="loading-cube"'),
            ("app-wrapper", 'class="app-wrapper"'),
            ("auth-view", 'id="auth-view"'),
            ("dashboard-view", 'id="dashboard-view"')
        ]
        
        print("\nLoading Elements Found:")
        for name, pattern in loading_elements:
            count = content.count(pattern)
            status = "FOUND" if count > 0 else "NOT FOUND"
            print(f"  {status} {name}: {count} instances")
        
        # Check for initialization scripts
        print("\nInitialization Scripts:")
        init_patterns = [
            ("window.addEventListener('load'", 'window.addEventListener(\'load\''),
            ("DOMContentLoaded", 'DOMContentLoaded'),
            ("loadingScreen.style.opacity", 'loadingScreen.style.opacity'),
            ("loadingOverlay.style.opacity", 'loadingOverlay.style.opacity'),
            ("setTimeout.*loading", 'setTimeout.*loading'),
            ("initGSAP", 'initGSAP'),
            ("initParticles", 'initParticles'),
            ("initCubeInteraction", 'initCubeInteraction')
        ]
        
        for name, pattern in init_patterns:
            count = content.count(pattern)
            status = "FOUND" if count > 0 else "NOT FOUND"
            print(f"  {status} {name}: {count} instances")
        
        # Check for conflicting z-index values
        print("\nZ-Index Conflicts:")
        z_index_patterns = [
            ("z-index: 10000", 'z-index: 10000'),
            ("z-index: 99999", 'z-index: 99999'),
            ("z-index: 9999", 'z-index: 9999'),
            ("z-index: 1000", 'z-index: 1000')
        ]
        
        for name, pattern in z_index_patterns:
            count = content.count(pattern)
            if count > 0:
                print(f"  FOUND {name}: {count} instances")
        
        # Check for multiple initialization attempts
        print("\nPotential Conflicts:")
        
        # Check if loading screen is inside app-wrapper
        app_wrapper_start = content.find('<div class="app-wrapper">')
        loading_screen_start = content.find('<div id="loading-screen"')
        
        if app_wrapper_start != -1 and loading_screen_start != -1:
            if loading_screen_start > app_wrapper_start:
                print("  ❌ CONFLICT: loading-screen is INSIDE app-wrapper")
            else:
                print("  ✅ OK: loading-screen is OUTSIDE app-wrapper")
        
        # Check for multiple loading screen definitions
        loading_screen_count = content.count('id="loading-screen"')
        if loading_screen_count > 1:
            print(f"  ❌ CONFLICT: Multiple loading-screen elements ({loading_screen_count})")
        else:
            print(f"  ✅ OK: Single loading-screen element ({loading_screen_count})")
        
        # Check for multiple initialization scripts
        load_event_count = content.count('window.addEventListener(\'load\'')
        if load_event_count > 1:
            print(f"  ❌ CONFLICT: Multiple load event listeners ({load_event_count})")
        else:
            print(f"  ✅ OK: Single load event listener ({load_event_count})")
        
        print("\n" + "=" * 40)
        print("Analysis Complete!")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 