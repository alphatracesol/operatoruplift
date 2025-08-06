#!/usr/bin/env python3
"""
Fix Loading Screen Duplication and Integration Issues
Removes duplicate loading screens and fixes integration conflicts
"""

import re
import os
from datetime import datetime

def fix_loading_screen_duplication():
    """Fix loading screen duplication and integration issues"""
    
    print("🔧 FIXING LOADING SCREEN DUPLICATION")
    print("=" * 50)
    
    # Read current app.html
    with open('app.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = []
    
    # 1. Check for duplicate loading screen implementations
    print("\n1️⃣ ANALYZING LOADING SCREEN IMPLEMENTATIONS...")
    
    # Count loading screen related elements
    loading_screen_divs = content.count('id="loading-screen"')
    loading_screen_css = content.count('.loading-screen')
    init_loading_functions = content.count('initLoadingScreen')
    hide_loading_functions = content.count('hideLoadingScreen')
    
    print(f"Found {loading_screen_divs} loading screen divs")
    print(f"Found {loading_screen_css} loading screen CSS rules")
    print(f"Found {init_loading_functions} initLoadingScreen functions")
    print(f"Found {hide_loading_functions} hideLoadingScreen functions")
    
    # 2. Check for duplicate function definitions
    print("\n2️⃣ CHECKING FOR DUPLICATE FUNCTION DEFINITIONS...")
    
    # Look for duplicate function patterns
    function_patterns = [
        r'initLoadingScreen\s*\([^)]*\)\s*\{[^}]*\}',
        r'hideLoadingScreen\s*\([^)]*\)\s*\{[^}]*\}',
        r'initBackgroundMusic\s*\([^)]*\)\s*\{[^}]*\}',
        r'initMatrixRain\s*\([^)]*\)\s*\{[^}]*\}'
    ]
    
    duplicate_functions = []
    for pattern in function_patterns:
        matches = list(re.finditer(pattern, content, re.DOTALL))
        if len(matches) > 1:
            func_name = pattern.split('\\s*\\(')[0]
            duplicate_functions.append(func_name)
            print(f"  ❌ Found {len(matches)} instances of {func_name}")
        else:
            func_name = pattern.split('\\s*\\(')[0]
            print(f"  ✅ {func_name}: {len(matches)} instance")
    
    # 3. Check for mislabeled elements
    print("\n3️⃣ CHECKING FOR MISLABELED ELEMENTS...")
    
    # Look for potential mislabeled elements
    mislabeled_patterns = [
        r'id="loading-[^"]*"',
        r'class="loading-[^"]*"',
        r'id="auth-[^"]*"',
        r'id="dashboard-[^"]*"'
    ]
    
    mislabeled_elements = []
    for pattern in mislabeled_patterns:
        matches = re.findall(pattern, content)
        if len(matches) > 1:
            mislabeled_elements.extend(matches)
            print(f"  ⚠️  Found {len(matches)} potential mislabeled elements: {matches[:3]}...")
    
    # 4. Fix duplicate function definitions (keep only the first instance)
    if duplicate_functions:
        print(f"\n4️⃣ FIXING {len(duplicate_functions)} DUPLICATE FUNCTIONS...")
        
        for func_name in duplicate_functions:
            # Create pattern for this specific function
            if func_name == 'initLoadingScreen':
                pattern = r'(initLoadingScreen\s*\([^)]*\)\s*\{[^}]*\})'
            elif func_name == 'hideLoadingScreen':
                pattern = r'(hideLoadingScreen\s*\([^)]*\)\s*\{[^}]*\})'
            elif func_name == 'initBackgroundMusic':
                pattern = r'(initBackgroundMusic\s*\([^)]*\)\s*\{[^}]*\})'
            elif func_name == 'initMatrixRain':
                pattern = r'(initMatrixRain\s*\([^)]*\)\s*\{[^}]*\})'
            else:
                continue
            
            matches = list(re.finditer(pattern, content, re.DOTALL))
            
            if len(matches) > 1:
                # Keep the first one, remove the rest
                for match in reversed(matches[1:]):
                    content = content[:match.start()] + content[match.end():]
                    fixes_applied.append(f"Removed duplicate {func_name} function")
    
    # 5. Check for conflicting CSS rules
    print("\n5️⃣ CHECKING FOR CONFLICTING CSS RULES...")
    
    # Look for conflicting CSS rules
    conflicting_css = []
    
    # Check for duplicate CSS variable definitions
    css_var_pattern = r'--([^:]+):\s*([^;]+);'
    css_vars = re.findall(css_var_pattern, content)
    css_var_counts = {}
    
    for var_name, var_value in css_vars:
        if var_name not in css_var_counts:
            css_var_counts[var_name] = []
        css_var_counts[var_name].append(var_value)
    
    for var_name, values in css_var_counts.items():
        if len(values) > 1 and len(set(values)) > 1:
            conflicting_css.append(f"Conflicting CSS variable: {var_name}")
            print(f"  ⚠️  Conflicting CSS variable: {var_name} has {len(values)} different values")
    
    # 6. Create backup and save fixed file
    print("\n💾 SAVING LOADING SCREEN FIXES...")
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"app-loading-fixes-backup-{timestamp}.html"
    
    with open(backup_filename, 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    print(f"✅ Backup created: {backup_filename}")
    
    # Save fixed content
    with open('app.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Loading screen duplication fixed app.html saved")
    
    # 7. Verify the fixes
    print("\n🔍 VERIFYING LOADING SCREEN FIXES...")
    
    # Check remaining function instances
    for func_name in duplicate_functions:
        if func_name == 'initLoadingScreen':
            pattern = r'initLoadingScreen\s*\([^)]*\)\s*\{[^}]*\}'
        elif func_name == 'hideLoadingScreen':
            pattern = r'hideLoadingScreen\s*\([^)]*\)\s*\{[^}]*\}'
        elif func_name == 'initBackgroundMusic':
            pattern = r'initBackgroundMusic\s*\([^)]*\)\s*\{[^}]*\}'
        elif func_name == 'initMatrixRain':
            pattern = r'initMatrixRain\s*\([^)]*\)\s*\{[^}]*\}'
        else:
            continue
        
        matches = list(re.finditer(pattern, content, re.DOTALL))
        print(f"  {func_name}: {len(matches)} instance(s) remaining")
    
    # 8. Summary
    print("\n" + "=" * 50)
    print("📊 LOADING SCREEN FIXES APPLIED")
    print("=" * 50)
    
    if fixes_applied:
        for i, fix in enumerate(fixes_applied, 1):
            print(f"{i}. {fix}")
        print(f"\n✅ Applied {len(fixes_applied)} loading screen fixes")
    else:
        print("✅ No loading screen fixes needed")
    
    # 9. Recommendations
    print("\n🔧 RECOMMENDATIONS:")
    
    if conflicting_css:
        print("1. Review and consolidate conflicting CSS variables")
    
    if mislabeled_elements:
        print("2. Review element IDs for proper naming conventions")
    
    print("3. Test loading screen functionality after fixes")
    print("4. Verify music integration with loading screen")
    
    return fixes_applied

if __name__ == "__main__":
    fix_loading_screen_duplication()
