#!/usr/bin/env python3
"""
Debug test to identify loading screen transition issues
"""

def main():
    print("Loading Screen Debug Analysis")
    print("=" * 40)
    
    try:
        with open("app.html", 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"File loaded: {len(content):,} characters")
        
        # Check for loading screen transition logic
        print("\nLoading Screen Transition Logic:")
        
        # Check for hideLoadingScreen function
        hide_loading_count = content.count('hideLoadingScreen')
        print(f"  hideLoadingScreen calls: {hide_loading_count}")
        
        # Check for loading screen removal
        loading_removal_patterns = [
            ('loadingScreen.style.display = "none"', 'style.display = "none"'),
            ('loadingScreen.style.opacity = "0"', 'style.opacity = "0"'),
            ('loadingScreen.classList.remove', 'classList.remove'),
            ('loadingScreen.classList.add', 'classList.add'),
            ('setTimeout.*loading', 'setTimeout'),
            ('clearInterval', 'clearInterval'),
            ('requestAnimationFrame', 'requestAnimationFrame')
        ]
        
        for name, pattern in loading_removal_patterns:
            count = content.count(pattern)
            if count > 0:
                print(f"  FOUND {name}: {count} instances")
        
        # Check for auth view activation
        auth_activation_patterns = [
            ('auth-view.*active', 'auth-view.*active'),
            ('authView.classList.add', 'authView.classList.add'),
            ('showView.*auth', 'showView.*auth'),
            ('navigateTo.*auth', 'navigateTo.*auth')
        ]
        
        print("\nAuth View Activation Logic:")
        for name, pattern in auth_activation_patterns:
            count = content.count(pattern)
            if count > 0:
                print(f"  FOUND {name}: {count} instances")
        
        # Check for cube click handlers
        print("\nCube Interaction Logic:")
        cube_patterns = [
            ('loadingCube.addEventListener', 'loadingCube.addEventListener'),
            ('cube.*click', 'cube.*click'),
            ('handleCubeClick', 'handleCubeClick'),
            ('isClockwise', 'isClockwise'),
            ('loadingCubeRotateCW', 'loadingCubeRotateCW'),
            ('loadingCubeRotateCCW', 'loadingCubeRotateCCW')
        ]
        
        for name, pattern in cube_patterns:
            count = content.count(pattern)
            if count > 0:
                print(f"  FOUND {name}: {count} instances")
        
        # Check for progress completion logic
        print("\nProgress Completion Logic:")
        progress_patterns = [
            ('progress >= 100', 'progress >= 100'),
            ('progress = 100', 'progress = 100'),
            ('Loading complete', 'Loading complete'),
            ('transitioning', 'transitioning'),
            ('hideLoadingScreen', 'hideLoadingScreen')
        ]
        
        for name, pattern in progress_patterns:
            count = content.count(pattern)
            if count > 0:
                print(f"  FOUND {name}: {count} instances")
        
        # Check for initialization timing
        print("\nInitialization Timing:")
        timing_patterns = [
            ('setTimeout.*1000', 'setTimeout.*1000'),
            ('setTimeout.*500', 'setTimeout.*500'),
            ('setTimeout.*4000', 'setTimeout.*4000'),
            ('setInterval.*800', 'setInterval.*800'),
            ('setInterval.*40', 'setInterval.*40')
        ]
        
        for name, pattern in timing_patterns:
            count = content.count(pattern)
            if count > 0:
                print(f"  FOUND {name}: {count} instances")
        
        print("\n" + "=" * 40)
        print("Debug Analysis Complete!")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 